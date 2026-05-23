'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

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

function renderLatex(text: string): string {
    if (!text) return '';

    let result = autoWrapBareMath(text);

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

    // Handle newlines (convert to <br>)
    result = result.replace(/\n/g, '<br/>');

    return result;
}

export default function LatexRenderer({ text, style }: { text: string; style?: React.CSSProperties }) {
    const html = useMemo(() => renderLatex(text), [text]);
    return <span style={{ whiteSpace: 'normal', ...style }} dangerouslySetInnerHTML={{ __html: html }} />;
}
