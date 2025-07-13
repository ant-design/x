import { render } from '@testing-library/react';
import React from 'react';
import XMarkdown from '../../../XMarkdown';
import latexPlugin from '../index';

const testCases = [
  {
    title: 'should render inline LaTeX with $..$ syntax',
    markdown: `This is an inline LaTeX: $\\frac{df}{dt}$ \n`,
    html: '<p>This is an inline LaTeX: <span class="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mi>d</mi><mi>f</mi></mrow><mrow><mi>d</mi><mi>t</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">\\frac{df}{dt}</annotation></semantics></math></span> </p>\n',
  },
  {
    title: 'should render inline LaTeX with \\(..\\) syntax',
    markdown: 'This is an inline LaTeX: \\(E=mc^2\\)',
    html: '<p>This is an inline LaTeX: <span class="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">E=mc^2</annotation></semantics></math></span></p>\n',
  },
  {
    title: 'should render block LaTeX with $$..$$ syntax',
    markdown:
      "$$\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}$$",
    html: `<p><span class="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="normal">Δ</mi><msup><mi>t</mi><mo mathvariant="normal" lspace="0em" rspace="0em">′</mo></msup><mo>=</mo><mfrac><mrow><mi mathvariant="normal">Δ</mi><mi>t</mi></mrow><msqrt><mrow><mn>1</mn><mo>−</mo><mfrac><msup><mi>v</mi><mn>2</mn></msup><msup><mi>c</mi><mn>2</mn></msup></mfrac></mrow></msqrt></mfrac></mrow><annotation encoding="application/x-tex">\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}</annotation></semantics></math></span></p>\n`,
  },
  {
    title: 'should render block LaTeX with \\[..\\] syntax',
    markdown: `\\[\n\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}\n\\]`,
    html: `<span class="katex"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi mathvariant="normal">Δ</mi><msup><mi>t</mi><mo mathvariant="normal" lspace="0em" rspace="0em">′</mo></msup><mo>=</mo><mfrac><mrow><mi mathvariant="normal">Δ</mi><mi>t</mi></mrow><msqrt><mrow><mn>1</mn><mo>−</mo><mfrac><msup><mi>v</mi><mn>2</mn></msup><msup><mi>c</mi><mn>2</mn></msup></mfrac></mrow></msqrt></mfrac></mrow><annotation encoding="application/x-tex">\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}</annotation></semantics></math></span>\n`,
  },
  {
    title: 'should replace align* syntax',
    markdown: `$$ \\begin{align*} \\text{最小化} \\quad & f_0(x) \\ \\text{满足约束} \\quad & f_i(x) \\leq 0, \\quad i=1,2,\\dots,m \\ & h_j(x) = 0, \\quad j=1,2,\\dots,p \\end{align*} $$`,
    html: '<p><span class="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.25em" columnalign="right left right left" columnspacing="0em 1em 0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mtext>最小化</mtext><mspace width="1em"></mspace></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><msub><mi>f</mi><mn>0</mn></msub><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mtext>&nbsp;满足约束</mtext><mspace width="1em"></mspace></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><msub><mi>f</mi><mi>i</mi></msub><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>≤</mo><mn>0</mn><mo separator="true">,</mo><mspace width="1em"></mspace><mi>i</mi><mo>=</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mo>…</mo><mo separator="true">,</mo><mi>m</mi><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><msub><mi>h</mi><mi>j</mi></msub><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><mn>0</mn><mo separator="true">,</mo><mspace width="1em"></mspace><mi>j</mi><mo>=</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mo>…</mo><mo separator="true">,</mo><mi>p</mi></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{aligned} \\text{最小化} \\quad &amp; f_0(x) \\ \\text{满足约束} \\quad &amp; f_i(x) \\leq 0, \\quad i=1,2,\\dots,m \\ &amp; h_j(x) = 0, \\quad j=1,2,\\dots,p \\end{aligned}</annotation></semantics></math></span></p>\n',
  },
];

describe('LaTeX Plugin', () => {
  testCases.forEach(({ title, markdown, html }) => {
    it(`testcase: ${title}`, () => {
      const { container } = render(
        <XMarkdown config={{ extensions: latexPlugin() }}>{markdown}</XMarkdown>,
      );

      expect((container.firstChild as HTMLElement)?.innerHTML).toBe(html);
    });
  });
});
