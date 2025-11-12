import { useState } from 'react'
import MarkdownLatex from './markdown-latex'

/**
 * Example component demonstrating MarkdownLatex usage
 */
export default function MarkdownLatexExample() {
  const [text1, setText1] = useState(`# Physics Formula Example

## Newton's Second Law

The mathematical expression is:

$$
F = ma
$$

Where:
- $F$ is force (unit: Newton N)
- $m$ is mass (unit: kilogram kg)
- $a$ is acceleration (unit: m/s²)

## Energy Conservation

Einstein's mass-energy equation:

$$
E = mc^2
$$

## Quadratic Formula

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
`)

  const [text2, setText2] = useState(`# Markdown Examples

## Greek Letters

Inline: $\\alpha, \\beta, \\gamma, \\Delta, \\Omega$

Block:
$$
\\alpha + \\beta = \\gamma
$$

## Matrix

$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$

## Summation

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$
`)

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">MarkdownLatex Component Examples</h1>

      {/* Example 1: Side-by-side layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Side-by-side Layout</h2>
        <MarkdownLatex
          editable
          value={text1}
          onChange={setText1}
          previewLayout="side"
          editorHeight="500px"
          showCount
          maxLength={2000}
        />
      </section>

      {/* Example 2: Top-bottom layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Top-bottom Layout</h2>
        <MarkdownLatex
          editable
          value={text2}
          onChange={setText2}
          previewLayout="bottom"
          editorHeight="300px"
          showCount
        />
      </section>

      {/* Example 3: Tabs layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Tabs Layout</h2>
        <MarkdownLatex
          editable
          value={text1}
          onChange={setText1}
          previewLayout="tabs"
          editorHeight="400px"
          showCount
          maxLength={1000}
        />
      </section>

      {/* Example 4: Preview only */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Preview Only Mode</h2>
        <div className="rounded-lg border border-gray-300 p-6 dark:border-gray-700">
          <MarkdownLatex>
            {`# Preview Only

This is a **preview only** mode example.

Inline formula: $E = mc^2$

Block formula:

$$
\\int_{0}^{\\infty} e^{-x} dx = 1
$$
`}
          </MarkdownLatex>
        </div>
      </section>
    </div>
  )
}
