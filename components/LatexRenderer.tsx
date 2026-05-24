'use client';

import { useMemo } from 'react';
import katex from 'katex';
// katex/dist/katex.min.css is imported in app/globals.css (Next.js 16 +
// Tailwind v4 was tree-shaking the import when it lived here).
// mhchem extension enables \ce{...} for chemical formulas (used in USNCO problems).
import 'katex/contrib/mhchem';

/**
 * Many problems in the DB were ingested as plain text (e.g.
 * "2y = x^2 - 8x + 12" with no $...$ delimiters), so KaTeX never sees
 * them. This pre-pass auto-wraps the most common unmistakable math
 * tokens — backslash commands, carets, and subscripts — in $...$
 * while leaving any region the author already delimited untouched.
 */
function autoWrapBareMath(input: string): string {
    if (!input) return '';

    const delimRe = /\$\$[\s\S]*?\$\$|(?<!\\)\$(?!\$)[\s\S]*?(?<!\\)\$(?!\$)|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g;

    const wrapPlain = (s: string): string => {
        return s
            .replace(
                /\\[a-zA-Z]+(?:\s*\{[^{}]*\})*(?:_(?:\{[^{}]*\}|[a-zA-Z0-9]))?(?:\^(?:\{[^{}]*\}|[a-zA-Z0-9]))?/g,
                m => `$${m}$`
            )
            .replace(
                /([A-Za-z]|\d+|\([^()]+\))\^(\{[^{}]*\}|-?\d+|[A-Za-z]+)/g,
                m => `$${m}$`
            )
            .replace(
                /\b([A-Za-z])_(\{[^{}]*\}|[A-Za-z0-9]+)/g,
                m => `$${m}$`
            );
    };

    const out: string[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = delimRe.exec(input)) !== null) {
        if (m.index > last) out.push(wrapPlain(input.slice(last, m.index)));
        out.push(m[0]);
        last = delimRe.lastIndex;
    }
    if (last < input.length) out.push(wrapPlain(input.slice(last)));
    return out.join('');
}

/**
 * Normalize LaTeX commands that take single-character args without braces.
 * `\sqrt3` → `\sqrt{3}`, `\frac12` → `\frac{1}{2}`, `\vec a` → `\vec{a}`.
 */
function normalizeBareArgs(input: string): string {
    let out = input;
    out = out.replace(/\\frac\s*([0-9A-Za-z])\s*([0-9A-Za-z])/g, '\\frac{$1}{$2}');
    out = out.replace(
        /\\(sqrt|vec|hat|tilde|bar|dot|ddot|widehat|widetilde|overline|underline|boxed)\s+([0-9A-Za-z])(?![A-Za-z])/g,
        '\\$1{$2}'
    );
    out = out.replace(
        /\\(sqrt|vec|hat|tilde|bar|dot|ddot|widehat|widetilde|overline|underline|boxed)([0-9])/g,
        '\\$1{$2}'
    );
    return out;
}

// Unicode SOH character (U+0001) used as a placeholder for source-text
// newlines. Won't appear in real problem text or in KaTeX's HTML output.
const SOURCE_NL = '';

function renderLatex(text: string): string {
    if (!text) return '';

    let result = text;

    // 1. Strip Asymptote diagram source ([asy]...[/asy])
    result = result.replace(
        /\[asy\][\s\S]*?\[\/asy\]/g,
        '<span class="inline-block px-2 py-0.5 my-1 rounded text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">geometric figure — see source link</span>'
    );

    // 2. Normalize \sqrt3 → \sqrt{3} etc.
    result = normalizeBareArgs(result);

    // 3. Auto-wrap bare math tokens
    result = autoWrapBareMath(result);

    // 4. Bold markdown
    result = result.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');

    // 5. Markdown list parsing (needs source \n to detect lines).
    const listLineRe = /^([ \t]*)(?:[-*]\s+|(\d+)\.\s+)(.+)$/;
    const lines = result.split('\n');
    const out: string[] = [];
    let i = 0;
    while (i < lines.length) {
        const m = lines[i].match(listLineRe);
        if (m) {
            const ordered = !!m[2];
            const items: string[] = [];
            while (i < lines.length) {
                const lm = lines[i].match(listLineRe);
                if (!lm) break;
                items.push(`<li>${lm[3]}</li>`);
                i++;
            }
            out.push(
                ordered
                    ? `<ol class="latex-list latex-list-ordered">${items.join('')}</ol>`
                    : `<ul class="latex-list latex-list-bullet">${items.join('')}</ul>`
            );
        } else {
            out.push(lines[i]);
            i++;
        }
    }
    result = out.join('\n');

    // 6. CRITICAL: stash remaining source \n in a placeholder BEFORE
    //    KaTeX runs. KaTeX's SVG path output contains literal \n inside
    //    the <path d="..."> attribute. If we did \n → <br/> AFTER
    //    KaTeX, we'd inject <br/> tags inside the path attribute,
    //    corrupting the d= geometry and making the radical invisible.
    //    THIS WAS THE ROOT CAUSE of "\sqrt renders blank padding".
    result = result.replace(/\n/g, SOURCE_NL);

    // 7. KaTeX rendering — produces HTML, may contain literal \n inside
    //    SVG path attributes (those stay untouched, our source \n is now
    //    safely stashed as SOURCE_NL).
    const renderMath = (tex: string, displayMode: boolean, fallback: string): string => {
        try {
            return katex.renderToString(tex.trim(), { displayMode, throwOnError: false });
        } catch {
            return fallback;
        }
    };

    result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => renderMath(tex, true, `$$${tex}$$`));
    result = result.replace(/(?<!\$)\$(?!\$)([\s\S]*?)(?<!\$)\$(?!\$)/g, (_, tex) => renderMath(tex, false, `$${tex}$`));
    result = result.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => renderMath(tex, false, `\\(${tex}\\)`));
    result = result.replace(/\\\[([\s\S]*?)\\\]/g, (_, tex) => renderMath(tex, true, `\\[${tex}\\]`));

    // 8. Restore source newlines as <br/>. Literal \n that KaTeX added
    //    inside its SVG path attributes is LEFT ALONE — that's fine,
    //    SVG attributes accept whitespace including newlines in their
    //    d= path data.
    result = result.replaceAll(SOURCE_NL, '<br/>');

    // 9. Trim <br/> bracketing list blocks
    result = result.replace(/<\/(ul|ol)><br\/>/g, '</$1>')
                   .replace(/<br\/>\s*<(ul|ol)/g, '<$1');

    return result;
}

export default function LatexRenderer({ text, style }: { text: string; style?: React.CSSProperties }) {
    const html = useMemo(() => renderLatex(text), [text]);
    return <span style={{ whiteSpace: 'normal', ...style }} dangerouslySetInnerHTML={{ __html: html }} />;
}
