(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["49126a5d"],{"49126a5d":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return o;}});var r=n("777fffbe"),i=n("8090cfc0");n("4f28b535");var a=r._(n("e468cea1")),o=()=>{let e=`import React from 'react';
import { Button } from 'antd';

const App = () => (
  <div>
    <Button type="primary">Primary Button</Button>
  </div>
);

export default App;`;return(0,i.jsxs)("div",{children:[(0,i.jsx)("h3",{style:{marginBottom:8},children:"JavaScript Code"}),(0,i.jsx)(a.default,{lang:"javascript",children:e}),(0,i.jsx)("h3",{style:{margin:"8px 0"},children:"CSS Code"}),(0,i.jsx)(a.default,{lang:"css",children:`.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}`}),(0,i.jsx)("h3",{style:{margin:"8px 0"},children:"HTML Code"}),(0,i.jsx)(a.default,{lang:"html",children:`<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`}),(0,i.jsx)("h3",{style:{margin:"8px 0"},children:"Prism Light Mode"}),(0,i.jsxs)("p",{style:{marginBottom:8,color:"#666"},children:["\u4F7F\u7528 ",(0,i.jsx)("code",{children:"prismLightMode"})," \u5C5E\u6027\u542F\u7528\u8F7B\u91CF\u6A21\u5F0F\uFF0C\u6309\u9700\u52A0\u8F7D\u8BED\u8A00\u652F\u6301\uFF0C\u53EF\u663E\u8457\u51CF\u5C11\u6253\u5305\u4F53\u79EF\u3002"]}),(0,i.jsx)(a.default,{lang:"javascript",prismLightMode:!0,children:e})]});};},ea89dea8:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"refractor",{enumerable:!0,get:function(){return s;}});var r=n("ae022160"),i=n("94d17c2f"),a=n("c79cb849");function o(){}o.prototype=a.Prism;let s=new o;s.highlight=function(e,t){let n,r;if("string"!=typeof e)throw TypeError("Expected `string` for `value`, got `"+e+"`");if(t&&"object"==typeof t)n=t;else{if("string"!=typeof(r=t))throw TypeError("Expected `string` for `name`, got `"+r+"`");if(Object.hasOwn(s.languages,r))n=s.languages[r];else throw Error("Unknown language: `"+r+"` is not registered");}return{type:"root",children:a.Prism.highlight.call(s,e,n,r)};},s.register=function(e){if("function"!=typeof e||!e.displayName)throw Error("Expected `function` for `syntax`, got `"+e+"`");Object.hasOwn(s.languages,e.displayName)||e(s);},s.alias=function(e,t){let n;let r=s.languages,i={};for(n in"string"==typeof e?t&&(i[e]=t):i=e,i)if(Object.hasOwn(i,n)){let e=i[n],t="string"==typeof e?[e]:e,a=-1;for(;++a<t.length;)r[t[a]]=r[n];}},s.registered=function(e){if("string"!=typeof e)throw TypeError("Expected `string` for `aliasOrLanguage`, got `"+e+"`");return Object.hasOwn(s.languages,e);},s.listLanguages=function(){let e;let t=s.languages,n=[];for(e in t)Object.hasOwn(t,e)&&"object"==typeof t[e]&&n.push(e);return n;},s.util.encode=function(e){return e;},s.Token.stringify=function e(t,n){if("string"==typeof t)return{type:"text",value:t};if(Array.isArray(t)){let r=[],i=-1;for(;++i<t.length;)null!==t[i]&&void 0!==t[i]&&""!==t[i]&&r.push(e(t[i],n));return r;}let a={attributes:{},classes:["token",t.type],content:e(t.content,n),language:n,tag:"span",type:t.type};return t.alias&&a.classes.push(..."string"==typeof t.alias?[t.alias]:t.alias),s.hooks.run("wrap",a),(0,r.h)(a.tag+"."+a.classes.join("."),function(e){let t;for(t in e)Object.hasOwn(e,t)&&(e[t]=(0,i.parseEntities)(e[t]));return e;}(a.attributes),a.content);};}}]);