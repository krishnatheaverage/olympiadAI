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

    // Split into segments that are either already-delimited math or plain
    // text. We only auto-wrap inside the plain-text segments so we never
    // double-wrap.
    const delimRe = /\$\$[\s\S]*?\$\$|(?<!\\)\$(?!\$)[\s\S]*?(?<!\\)\$(?!\$)|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g;

    const wrapPlain = (s: string): string => {
        return s
            // \command, optionally followed by {arg} groups and a ^/_ tail.
            // Catches \frac{1}{2}, \sqrt{x+1}, \pi, \omega_0, \sum_{i=1}^n, etc.
            .replace(
                /\\[a-zA-Z]+(?:\s*\{[^{}]*\})*(?:_(?:\{[^{}]*\}|[a-zA-Z0-9]))?(?:\^(?:\{[^{}]*\}|[a-zA-Z0-9]))?/g,
                m => `$${m}$`
            )
            // base^exp: x^2, 2^n, x^{n+1}, (a+b)^2
            .replace(
                /([A-Za-z]|\d+|\([^()]+\))\^(\{[^{}]*\}|-?\d+|[A-Za-z]+)/g,
                m => `$${m}$`
            )
            // var_sub: x_1, a_{n+1}
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
 * KaTeX technically accepts unbraced single-char args, but some rendering
 * paths drop the radical bar or super-/sub-script positioning when braces
 * are missing. Explicit braces are always safe.
 */
function normalizeBareArgs(input: string): string {
    let out = input;
    // \frac takes two single-char args: \frac12 → \frac{1}{2}
    out = out.replace(/\\frac\s*([0-9A-Za-z])\s*([0-9A-Za-z])/g, '\\frac{$1}{$2}');
    // Single-arg commands: \sqrt, \vec, \hat, \tilde, \bar, \dot, \ddot,
    // \widehat, \widetilde, \overline, \underline, \boxed
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

function renderLatex(text: string): string {
    if (!text) return '';

    // Strip Asymptote diagram source ([asy]...[/asy]) — it's a markup
    // language for figures, not something the student should read raw.
    // 41 AMC/AIME rows have this embedded in their problem text.
    let result = text.replace(
        /\[asy\][\s\S]*?\[\/asy\]/g,
        '<span class="inline-block px-2 py-0.5 my-1 rounded text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">geometric figure — see source link</span>'
    );

    result = normalizeBareArgs(result);
    result = autoWrapBareMath(result);

    // Replace display math $$...$$ first
    result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
        try {
            return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
        } catch { return `$$${tex}$$`; }
    });

    // Replace inline math $...$  (but not $$)
    result = result.replace(/(?<!\$)\$(?!\$)([\s\S]*?)(?<!\$)\$(?!\$)/g, (_, tex) => {
        try {
            return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
        } catch { return `$${tex}$`; }
    });

    // Replace \(...\) inline math
    result = result.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => {
        try {
            return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
        } catch { return `\\(${tex}\\)`; }
    });

    // Replace \[...\] display math
    result = result.replace(/\\\[([\s\S]*?)\\\]/g, (_, tex) => {
        try {
            return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
        } catch { return `\\[${tex}\\]`; }
    });

    // Handle markdown bold **text**
    result = result.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');

    // Markdown bullet / numbered lists. We detect a contiguous block of
    // lines that all start with "- ", "* ", or "1. " and wrap them in a
    // proper <ul>/<ol>. Indented sub-content is ignored — keep it simple.
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

    // Newlines that aren't inside a list block become <br/>
    result = result.replace(/\n/g, '<br/>');
    // Strip <br/> that sneaks in between consecutive list/HTML blocks
    result = result.replace(/<\/(ul|ol)><br\/>/g, '</$1>')
                   .replace(/<br\/>\s*<(ul|ol)/g, '<$1');

    return result;
}

export default function LatexRenderer({ text, style }: { text: string; style?: React.CSSProperties }) {
    const html = useMemo(() => renderLatex(text), [text]);
    return <span style={{ whiteSpace: 'normal', ...style }} dangerouslySetInnerHTML={{ __html: html }} />;
}
