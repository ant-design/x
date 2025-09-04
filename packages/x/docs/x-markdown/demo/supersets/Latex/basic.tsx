import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import Latex from '@ant-design/x-markdown/plugins/Latex';
import { Flex, Button } from 'antd';
import React from 'react';

const text = `
## 行内公式

在文本中嵌入数学公式，如：勾股定理 $ a^2 + b^2 = c^2 $，欧拉公式 $ e^{i\\pi} + 1 = 0 $。

圆的面积公式是 $ S = \\pi r^2 $，其中 $ r $ 是半径。

二次方程 $ ax^2 + bx + c = 0 $ 的解为 $ x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a} $。

## 块级公式

### 基础数学运算

$$
\\begin{aligned}
a + b &= c \\\\
d - e &= f \\\\
g \\times h &= i \\\\
\\frac{j}{k} &= l
\\end{aligned}
$$

### 平方根和指数

$$
\\sqrt{x} = x^{\\frac{1}{2}}
$$

$$
\\sqrt[n]{x} = x^{\\frac{1}{n}}
$$

$$
e^{i\\theta} = cos + sin
$$

### 分数和比例

$$
\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}
$$

$$
\\frac{a}{b} = \\frac{c}{d} \\Rightarrow ad = bc
$$

### 求和与积分

#### 求和公式

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

$$
\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}
$$

#### 积分公式

$$
\\int_a^b f(x) dx = F(b) - F(a)
$$

$$
\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\int_0^{\\pi} \\sin x dx = 2
$$

### 微分方程

$$
\\frac{dy}{dx} = ky \\Rightarrow y = Ce^{kx}
$$

$$
\\frac{d^2y}{dx^2} + \\omega^2 y = 0 \\Rightarrow y = A\\cos(\\omega x) + B\\sin(\\omega x)
$$

### 矩阵运算

$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix}
=
\\begin{pmatrix}
ax + by \\\\
cx + dy
\\end{pmatrix}
$$

行列式：

$$
\\det\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix} = ad - bc
$$

### 统计学公式

#### 正态分布

$$
f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}
$$

#### 贝叶斯定理

$$
P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}
$$

#### 标准差

$$
\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N}(x_i - \\mu)^2}
$$

### 三角函数

$$
\\sin^2\\theta + \\cos^2\\theta = 1
$$

$$
\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}
$$

$$
e^{i\\theta} = \\cos\\theta + i\\sin\\theta
$$

### 级数展开

#### 泰勒级数

$$
f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n
$$

#### 指数函数展开

$$
e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots
$$

#### 正弦函数展开

$$
\\sin x = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!} = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots
$$

### 复数运算

复数的一般形式： $ z = a + bi $

复数的模： $ |z| = \\sqrt{a^2 + b^2} $

复数的乘法：

$$
(a + bi)(c + di) = (ac - bd) + (ad + bc)i
$$

德摩弗定理：

$$
(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)
$$

### 极限

$$
\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1
$$

$$
\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e
$$

$$
\\lim_{n \\to \\infty} \\sqrt[n]{n} = 1
$$

### 组合数学

排列数： $ P(n,r) = \\frac{n!}{(n-r)!} $

组合数： $ C(n,r) = \\binom{n}{r} = \\frac{n!}{r!(n-r)!} $

二项式定理：

$$
(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k
$$

### 向量运算

向量的点积： $ \\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta $

向量的叉积： $ \\vec{a} \\times \\vec{b} = |\\vec{a}||\\vec{b}|\\sin\\theta \\vec{n} $

三维向量的叉积：

$$
\\vec{a} \\times \\vec{b} = \\begin{vmatrix}
\\vec{i} & \\vec{j} & \\vec{k} \\\\
a_1 & a_2 & a_3 \\\\
b_1 & b_2 & b_3
\\end{vmatrix}
$$


### 语法说明

- **行内公式**：使用单个 \`$\` 包围，如  \`$ x^2 $\`
- **块级公式**：使用双 \`$$\` 包围，如  \`$$ \\int_a^b f(x)dx $$\`
- **换行**：在公式中使用 \`\\\\\\\\\` 进行换行
- **对齐**：使用 \`aligned\` 环境进行公式对齐

> **注意**：LaTeX 公式的渲染依赖于 KaTeX 库，确保已正确配置相关依赖。
`;

const App = () => {
  const [index, setIndex] = React.useState(0);
  const timer = React.useRef<any>(-1);

  const renderStream = () => {
    if (index >= text.length) {
      clearTimeout(timer.current);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((prev) => prev + 5);
      renderStream();
    }, 20);
  };

  React.useEffect(() => {
    if (index === text.length) return;
    renderStream();
    return () => {
      clearTimeout(timer.current);
    };
  }, [index]);

  return (
    <Flex vertical gap="small">
      <Button style={{ alignSelf: 'flex-end' }} onClick={() => setIndex(0)}>
        Re-Render
      </Button>

      <Bubble
        content={text.slice(0, index)}
        contentRender={(content) => (
          <XMarkdown
            style={{ whiteSpace: 'normal' }}
            config={{ extensions: Latex() }}
            paragraphTag="div"
          >
            {content}
          </XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
