'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function renderLatex(text: string): string {
    if (!text) return '';

    let result = text;

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
