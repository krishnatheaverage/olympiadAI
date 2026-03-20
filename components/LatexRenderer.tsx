'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function renderLatex(text: string): string {
    if (!text) return '';
    // Replace display math $$...$$ first
    let result = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
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
    return result;
}

export default function LatexRenderer({ text, style }: { text: string; style?: React.CSSProperties }) {
    const html = useMemo(() => renderLatex(text), [text]);
    return <span style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}
