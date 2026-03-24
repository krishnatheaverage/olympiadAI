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

    // Convert plain-text math patterns to LaTeX (for DB solutions that don't use $ delimiters)
    // Only do this if there are NO katex rendered spans already (meaning no LaTeX was found)
    if (!result.includes('class="katex"')) {
        result = convertPlainMathToLatex(result);
    }

    // Handle markdown bold **text**
    result = result.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');

    // Handle newlines (convert to <br>)
    result = result.replace(/\n/g, '<br/>');

    return result;
}

function convertPlainMathToLatex(text: string): string {
    let result = text;

    // Replace common plain-text math expressions line by line
    const lines = result.split('\n');
    const converted = lines.map(line => {
        // Skip lines that are already HTML or purely text descriptions
        if (line.includes('<') && line.includes('>')) return line;

        // Detect lines that look like equations (contain = with math-like content)
        // e.g. "omega_m = m*pi*c/L" or "E = mc^2" or "Delta_omega = omega_{m+1} - omega_m"
        if (isLikelyMathLine(line)) {
            const latex = plainToLatex(line.trim());
            try {
                return katex.renderToString(latex, { displayMode: true, throwOnError: false });
            } catch {
                return line;
            }
        }

        // For mixed lines (text with inline math expressions), wrap detected expressions
        return convertInlinePlainMath(line);
    });

    return converted.join('\n');
}

function isLikelyMathLine(line: string): boolean {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 3) return false;

    // Must contain = sign or be a standalone expression
    const hasEquals = trimmed.includes('=');
    // Check for math-like patterns: subscripts, operators, Greek letters, fractions
    const mathPatterns = /(?:_\{|_[a-zA-Z]|\^[\d{]|\\frac|\\sqrt|omega|alpha|beta|gamma|delta|theta|lambda|sigma|pi\b|sum_|prod_|int_|\*|\/(?![a-z]{3,})|\^[0-9])/i;
    const hasMathContent = mathPatterns.test(trimmed);

    // Line is mostly math if it has = and math symbols, and is relatively short
    if (hasEquals && hasMathContent && trimmed.length < 200) return true;

    // Pure expressions like "x^2 + y^2" or "f(x) = ..."
    if (hasEquals && /^[a-zA-Z0-9_^{}\s=+\-*/().,:;<>!|\\]+$/.test(trimmed) && trimmed.length < 150) {
        // Make sure it's not a regular English sentence
        const wordCount = trimmed.split(/\s+/).filter(w => w.length > 3 && /^[a-z]+$/i.test(w)).length;
        if (wordCount <= 2) return true;
    }

    return false;
}

function plainToLatex(text: string): string {
    let latex = text;

    // Replace Greek letter names with LaTeX commands
    const greekLetters = [
        'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta',
        'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'pi', 'rho',
        'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
        'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Theta',
        'Lambda', 'Pi', 'Sigma', 'Phi', 'Psi', 'Omega'
    ];

    for (const letter of greekLetters) {
        // Replace standalone Greek letter names (not inside other words)
        const regex = new RegExp(`(?<![a-zA-Z])${letter}(?![a-zA-Z])`, 'g');
        latex = latex.replace(regex, `\\${letter}`);
    }

    // Replace * with \cdot for multiplication
    latex = latex.replace(/\*/g, ' \\cdot ');

    // Replace common patterns
    // subscript: x_m or x_{m+1}
    // Already works in LaTeX

    // Replace "Delta_" with "\Delta "
    latex = latex.replace(/\\Delta_/g, '\\Delta_{');
    // Fix unclosed braces from Delta
    if (latex.includes('\\Delta_{') && !latex.match(/\\Delta_\{[^}]*\}/)) {
        latex = latex.replace(/\\Delta_\{(\w+)/, '\\Delta_{$1}');
    }

    // sum_{...}^{...} patterns
    latex = latex.replace(/sum_/g, '\\sum_');

    // Replace "~" with "\approx"
    latex = latex.replace(/ ~ /g, ' \\approx ');

    // Replace ">>" and "<<" with "\gg" and "\ll"
    latex = latex.replace(/>>/g, '\\gg');
    latex = latex.replace(/<</g, '\\ll');

    return latex;
}

function convertInlinePlainMath(line: string): string {
    // For text lines with embedded math-like expressions
    // Look for patterns like "where omega = 2*pi*c/lambda" and wrap the math part

    // Match expressions that look like inline math (variable = expression)
    const result = line.replace(
        /(?<![a-zA-Z])([a-zA-Z_][a-zA-Z0-9_]*(?:\{[^}]*\})?)\s*=\s*([a-zA-Z0-9_^{}\s+\-*/().]+?)(?=[,.]?\s*(?:[A-Z]|$|,|\.|where|and|so|thus|then|for|with|if|is|are|the|this|that|which|gives|yields))/g,
        (match, lhs, rhs) => {
            // Only convert if the expression looks sufficiently "mathy"
            const fullExpr = `${lhs} = ${rhs}`.trim();
            if (isLikelyMathLine(fullExpr)) {
                const latex = plainToLatex(fullExpr);
                try {
                    return katex.renderToString(latex, { displayMode: false, throwOnError: false });
                } catch {
                    return match;
                }
            }
            return match;
        }
    );

    return result;
}

export default function LatexRenderer({ text, style }: { text: string; style?: React.CSSProperties }) {
    const html = useMemo(() => renderLatex(text), [text]);
    return <span style={{ whiteSpace: 'normal', ...style }} dangerouslySetInnerHTML={{ __html: html }} />;
}
