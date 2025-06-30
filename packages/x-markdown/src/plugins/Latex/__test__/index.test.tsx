import { render } from '@testing-library/react';
import React from 'react';
import XMarkdown from '../../../XMarkdown';
import latexPlugin from '../index';

const testCases = [
  {
    title: 'should render inline LaTeX with $..$ syntax',
    markdown: `### Latex
inline standard: $\\frac{df}{dt}$ \n
block standard：\n
$$
\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}
$$

inline: \\(\\frac{df}{dt}\\)  \n
block: \n
\\[
\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}
\\]`,
    html: '<p>This is an inline LaTeX: &lt;span class="katex"&gt;&lt;math xmlns="http://www.w3.org/1998/Math/MathML"&gt;&lt;semantics&gt;&lt;mrow&gt;&lt;mi&gt;E&lt;/mi&gt;&lt;mo&gt;=&lt;/mo&gt;&lt;mi&gt;m&lt;/mi&gt;&lt;msup&gt;&lt;mi&gt;c&lt;/mi&gt;&lt;mn&gt;2&lt;/mn&gt;&lt;/msup&gt;&lt;/mrow&gt;&lt;annotation encoding="application/x-tex"&gt;E=mc^2&lt;/annotation&gt;&lt;/semantics&gt;&lt;/math&gt;&lt;/span&gt;</p>',
  },
  {
    title: 'should render inline LaTeX with \\(..\\) syntax',
    markdown: 'This is an inline LaTeX: \\(E=mc^2\\)',
    html: '<p>This is an inline LaTeX: &lt;span class="katex"&gt;&lt;math xmlns="http://www.w3.org/1998/Math/MathML"&gt;&lt;semantics&gt;&lt;mrow&gt;&lt;mi&gt;E&lt;/mi&gt;&lt;mo&gt;=&lt;/mo&gt;&lt;mi&gt;m&lt;/mi&gt;&lt;msup&gt;&lt;mi&gt;c&lt;/mi&gt;&lt;mn&gt;2&lt;/mn&gt;&lt;/msup&gt;&lt;/mrow&gt;&lt;annotation encoding="application/x-tex"&gt;E=mc^2&lt;/annotation&gt;&lt;/semantics&gt;&lt;/math&gt;&lt;/span&gt;</p>',
  },
  {
    title: 'should render block LaTeX with $$..$$ syntax',
    markdown:
      "This is an block LaTeX: \n\n $$\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}$$",
    html: '<p>This is an block LaTeX: </p><p> &lt;span class="katex"&gt;&lt;math xmlns="http://www.w3.org/1998/Math/MathML"&gt;&lt;semantics&gt;&lt;mrow&gt;&lt;mi mathvariant="normal"&gt;Δ&lt;/mi&gt;&lt;msup&gt;&lt;mi&gt;t&lt;/mi&gt;&lt;mo mathvariant="normal" lspace="0em" rspace="0em"&gt;′&lt;/mo&gt;&lt;/msup&gt;&lt;mo&gt;=&lt;/mo&gt;&lt;mfrac&gt;&lt;mrow&gt;&lt;mi mathvariant="normal"&gt;Δ&lt;/mi&gt;&lt;mi&gt;t&lt;/mi&gt;&lt;/mrow&gt;&lt;msqrt&gt;&lt;mrow&gt;&lt;mn&gt;1&lt;/mn&gt;&lt;mo&gt;−&lt;/mo&gt;&lt;mfrac&gt;&lt;msup&gt;&lt;mi&gt;v&lt;/mi&gt;&lt;mn&gt;2&lt;/mn&gt;&lt;/msup&gt;&lt;msup&gt;&lt;mi&gt;c&lt;/mi&gt;&lt;mn&gt;2&lt;/mn&gt;&lt;/msup&gt;&lt;/mfrac&gt;&lt;/mrow&gt;&lt;/msqrt&gt;&lt;/mfrac&gt;&lt;/mrow&gt;&lt;annotation encoding="application/x-tex"&gt;\\Delta t&amp;#x27; = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}&lt;/annotation&gt;&lt;/semantics&gt;&lt;/math&gt;&lt;/span&gt;</p>',
  },
  {
    title: 'should render block LaTeX with \\[..\\] syntax',
    markdown: `This is an block LaTeX: \n
      \\[
\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}
\\]`,
    html: 'This is an block LaTeX: <span class="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">E=mc^2</annotation></semantics></math></span>',
  },
];

describe('LaTeX Plugin', () => {
  testCases.forEach(({ title, markdown }) => {
    it(`testcase: ${title}`, () => {
      const { container } = render(
        <XMarkdown plugins={[latexPlugin({ output: 'mathml' })]}>{markdown}</XMarkdown>,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
