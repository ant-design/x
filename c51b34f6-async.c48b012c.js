(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["c51b34f6"],{c51b34f6:function(e,n,t){"use strict";t.d(n,"__esModule",{value:!0}),t.d(n,"default",{enumerable:!0,get:function(){return f;}});var i=t("777fffbe"),r=t("8090cfc0");t("93b76724");var a=t("2bcf28f3"),u=i._(t("ffa67926")),l=t("c5d21053"),o=i._(t("3e6b097d"));let c=`
Here's a Python code block example that demonstrates how to calculate Fibonacci numbers:

\`\`\` python
def fibonacci(n):
    """
    Calculate the nth Fibonacci number
    :param n: The position in the Fibonacci sequence (must be a positive integer)
    :return: The value at position n
    """
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        a, b = 0, 1
        for _ in range(2, n+1):
            a, b = b, a + b
        return b

# Example usage
if __name__ == "__main__":
    num = 10
    print(f"The {num}th Fibonacci number is: {fibonacci(num)}")
    
    # Print the first 15 Fibonacci numbers
    print("First 15 Fibonacci numbers:")
    for i in range(1, 16):
        print(fibonacci(i), end=" ")
\`\`\`

This code includes:

1. A function to compute Fibonacci numbers
2. Docstring documentation
3. Example usage in the main block
4. A loop to print the first 15 numbers

You can modify the parameters or output format as needed. The Fibonacci sequence here starts with fib(1) = 1, fib(2) = 1.
`,s=e=>{var n;let{className:t,children:i}=e,u=(null==t?void 0:null===(n=t.match(/language-(\w+)/))||void 0===n?void 0:n[1])||"";return"string"!=typeof i?null:(0,r.jsx)(a.CodeHighlighter,{lang:u,children:i});};var f=()=>{let[e,n]=o.default.useState(0),t=o.default.useRef(null),i=o.default.useRef(null);return o.default.useEffect(()=>{if(!(e>=c.length))return t.current=setTimeout(()=>{n(Math.min(e+5,c.length));},20),()=>{t.current&&(clearTimeout(t.current),t.current=null);};},[e]),o.default.useEffect(()=>{if(i.current&&e>0&&e<c.length){let{scrollHeight:e,clientHeight:n}=i.current;e>n&&i.current.scrollTo({top:e,behavior:"smooth"});}},[e]),(0,r.jsxs)(l.Flex,{vertical:!0,gap:"small",style:{height:600,overflow:"auto"},ref:i,children:[(0,r.jsx)(l.Flex,{justify:"flex-end",children:(0,r.jsx)(l.Button,{onClick:()=>n(0),children:"Re-Render"})}),(0,r.jsx)(a.Bubble,{content:c.slice(0,e),contentRender:e=>(0,r.jsx)(u.default,{components:{code:s},paragraphTag:"div",children:e}),variant:"outlined"})]});};}}]);
//# sourceMappingURL=c51b34f6-async.c48b012c.js.map