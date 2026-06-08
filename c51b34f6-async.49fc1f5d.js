(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["c51b34f6"],{c51b34f6:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return h;}});var r=n("777fffbe"),i=n("8090cfc0");n("93b76724");var a=r._(n("0a1da924")),o=r._(n("e468cea1")),s=r._(n("ffa67926")),u=r._(n("bf2579c8")),l=r._(n("d78812de")),c=r._(n("3e6b097d"));let f=`
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
`,g=e=>{var t;let{className:n,children:r}=e,a=(null==n?void 0:null===(t=n.match(/language-(\w+)/))||void 0===t?void 0:t[1])||"";return"string"!=typeof r?null:(0,i.jsx)(o.default,{lang:a,children:r});};var h=()=>{let[e,t]=c.default.useState(0),n=c.default.useRef(null),r=c.default.useRef(null);return c.default.useEffect(()=>{if(!(e>=f.length))return n.current=setTimeout(()=>{t(Math.min(e+5,f.length));},20),()=>{n.current&&(clearTimeout(n.current),n.current=null);};},[e]),c.default.useEffect(()=>{if(r.current&&e>0&&e<f.length){let{scrollHeight:e,clientHeight:t}=r.current;e>t&&r.current.scrollTo({top:e,behavior:"smooth"});}},[e]),(0,i.jsxs)(l.default,{vertical:!0,gap:"small",style:{height:600,overflow:"auto"},ref:r,children:[(0,i.jsx)(l.default,{justify:"flex-end",children:(0,i.jsx)(u.default,{onClick:()=>t(0),children:"Re-Render"})}),(0,i.jsx)(a.default,{content:f.slice(0,e),contentRender:e=>(0,i.jsx)(s.default,{components:{code:g},paragraphTag:"div",children:e}),variant:"outlined"})]});};},ea89dea8:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"refractor",{enumerable:!0,get:function(){return s;}});var r=n("ae022160"),i=n("94d17c2f"),a=n("c79cb849");function o(){}o.prototype=a.Prism;let s=new o;s.highlight=function(e,t){let n,r;if("string"!=typeof e)throw TypeError("Expected `string` for `value`, got `"+e+"`");if(t&&"object"==typeof t)n=t;else{if("string"!=typeof(r=t))throw TypeError("Expected `string` for `name`, got `"+r+"`");if(Object.hasOwn(s.languages,r))n=s.languages[r];else throw Error("Unknown language: `"+r+"` is not registered");}return{type:"root",children:a.Prism.highlight.call(s,e,n,r)};},s.register=function(e){if("function"!=typeof e||!e.displayName)throw Error("Expected `function` for `syntax`, got `"+e+"`");Object.hasOwn(s.languages,e.displayName)||e(s);},s.alias=function(e,t){let n;let r=s.languages,i={};for(n in"string"==typeof e?t&&(i[e]=t):i=e,i)if(Object.hasOwn(i,n)){let e=i[n],t="string"==typeof e?[e]:e,a=-1;for(;++a<t.length;)r[t[a]]=r[n];}},s.registered=function(e){if("string"!=typeof e)throw TypeError("Expected `string` for `aliasOrLanguage`, got `"+e+"`");return Object.hasOwn(s.languages,e);},s.listLanguages=function(){let e;let t=s.languages,n=[];for(e in t)Object.hasOwn(t,e)&&"object"==typeof t[e]&&n.push(e);return n;},s.util.encode=function(e){return e;},s.Token.stringify=function e(t,n){if("string"==typeof t)return{type:"text",value:t};if(Array.isArray(t)){let r=[],i=-1;for(;++i<t.length;)null!==t[i]&&void 0!==t[i]&&""!==t[i]&&r.push(e(t[i],n));return r;}let a={attributes:{},classes:["token",t.type],content:e(t.content,n),language:n,tag:"span",type:t.type};return t.alias&&a.classes.push(..."string"==typeof t.alias?[t.alias]:t.alias),s.hooks.run("wrap",a),(0,r.h)(a.tag+"."+a.classes.join("."),function(e){let t;for(t in e)Object.hasOwn(e,t)&&(e[t]=(0,i.parseEntities)(e[t]));return e;}(a.attributes),a.content);};}}]);