(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["50f76504"],{"0d3a6349":function(e,t,a){"use strict";a.d(t,"__esModule",{value:!0}),a.d(t,"default",{enumerable:!0,get:function(){return i;}});var r=a("777fffbe"),n=a("8090cfc0");a("7e02abe3");var l=r._(a("82e3a9c7")),i=()=>(0,n.jsx)(l.default,{children:`graph TD
    A[\u{5F00}\u{59CB}] --> B{\u{6761}\u{4EF6}\u{5224}\u{65AD}}
    B -->|\u{662F}| C[\u{6267}\u{884C}\u{64CD}\u{4F5C}A]
    B -->|\u{5426}| D[\u{6267}\u{884C}\u{64CD}\u{4F5C}B]
    C --> E[\u{7ED3}\u{675F}]
    D --> E`});},58020392:function(e,t,a){"use strict";a.d(t,"__esModule",{value:!0}),a.d(t,"default",{enumerable:!0,get:function(){return s;}});var r=a("777fffbe"),n=a("8090cfc0");a("4418089e");var l=r._(a("82e3a9c7")),i=r._(a("bf2579c8")),o=r._(a("fd409399")),s=()=>{let e=(0,n.jsx)("div",{style:{padding:"12px 16px",border:"1px solid #f0f0f0",borderBottom:"none",borderRadius:"8px 8px 0 0",backgroundColor:"#fafafa"},children:(0,n.jsxs)(o.default,{size:"middle",children:[(0,n.jsx)("span",{style:{fontWeight:500,color:"#1a1a1a"},children:"Login Flow"}),(0,n.jsx)(i.default,{type:"primary",size:"small",children:"Export"}),(0,n.jsx)(i.default,{size:"small",children:"Reset"})]})});return(0,n.jsx)("div",{style:{padding:24},children:(0,n.jsx)(l.default,{header:e,children:`flowchart LR
    A[User Login] --> B{Validate}
    B -->|Success| C[System Entry]
    B -->|Failed| D[Error Message]
    C --> E[Dashboard]
    D --> A`})});};},b6acc4dc:function(e,t,a){"use strict";a.d(t,"__esModule",{value:!0}),a.d(t,"default",{enumerable:!0,get:function(){return u;}});var r=a("777fffbe"),n=a("8090cfc0");a("40b09c76");var l=r._(a("82e3a9c7")),i=a("3e6b097d"),o=r._(a("ce5dd0f9")),s=r._(a("40ff87e3"));let d={cn:{root:"\u6839\u8282\u70B9",header:"\u5934\u90E8\u7684\u5BB9\u5668",graph:"\u56FE\u7247\u7684\u5BB9\u5668",code:"\u4EE3\u7801\u5BB9\u5668"},en:{root:"root",header:"Wrapper element of the header",graph:"Wrapper element of the graph",code:"Wrapper element of the code"}},c=`graph TD
    A[Start] --> B{Data Valid?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Error Handling]
    C --> E[Generate Report]
    D --> E
    E --> F[End]
    style A fill:#2ecc71,stroke:#27ae60
    style F fill:#e74c3c,stroke:#c0392b`;var u=()=>{let[e]=(0,s.default)(d),[t,a]=(0,i.useState)("image");return(0,n.jsx)(o.default,{componentName:"Mermaid",semantics:[{name:"root",desc:e.root},{name:"header",desc:e.header},"image"===t?{name:"graph",desc:e.graph}:{name:"code",desc:e.code}],children:(0,n.jsx)(l.default,{onRenderTypeChange:e=>a(e),children:c})});};},e26ad08c:function(e,t,a){"use strict";a.d(t,"__esModule",{value:!0}),a.d(t,"default",{enumerable:!0,get:function(){return g;}});var r=a("777fffbe"),n=a("8090cfc0");a("db268fe0");var l=r._(a("0a1da924")),i=r._(a("82e3a9c7")),o=r._(a("ffa67926")),s=r._(a("bf2579c8")),d=r._(a("d78812de")),c=r._(a("3e6b097d"));let u=`
Here are several Mermaid diagram examples 

#### 1. Flowchart (Vertical)

\`\`\` mermaid
graph TD
    A[Start] --> B{Data Valid?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Error Handling]
    C --> E[Generate Report]
    D --> E
    E --> F[End]
    style A fill:#2ecc71,stroke:#27ae60
    style F fill:#e74c3c,stroke:#c0392b
\`\`\`

#### 2. Sequence Diagram

\`\`\` mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database
    
    Client->>Server: POST /api/data
    Server->>Database: INSERT record
    Database-->>Server: Success
    Server-->>Client: 201 Created
\`\`\`

#### 3. Quadrant Chart

\`\`\`mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
\`\`\`
`,f=e=>{var t;let{className:a,children:r}=e,l=(null==a?void 0:null===(t=a.match(/language-(\w+)/))||void 0===t?void 0:t[1])||"";return"string"!=typeof r?null:"mermaid"===l?(0,n.jsx)(i.default,{children:r}):(0,n.jsx)("code",{children:r});};var g=()=>{let[e,t]=c.default.useState(0),a=c.default.useRef(null),r=c.default.useRef(null);return c.default.useEffect(()=>{if(!(e>=u.length))return a.current=setTimeout(()=>{t(Math.min(e+5,u.length));},20),()=>{a.current&&(clearTimeout(a.current),a.current=null);};},[e]),c.default.useEffect(()=>{if(r.current&&e>0&&e<u.length){let{scrollHeight:e,clientHeight:t}=r.current;e>t&&r.current.scrollTo({top:e,behavior:"smooth"});}},[e]),(0,n.jsxs)(d.default,{vertical:!0,gap:"small",style:{height:600,overflow:"auto"},ref:r,children:[(0,n.jsx)(d.default,{justify:"flex-end",children:(0,n.jsx)(s.default,{onClick:()=>t(0),children:"Re-Render"})}),(0,n.jsx)(l.default,{content:u.slice(0,e),styles:{content:{width:700}},contentRender:e=>(0,n.jsx)(o.default,{components:{code:f},paragraphTag:"div",children:e}),variant:"outlined"})]});};},ea89dea8:function(e,t,a){"use strict";a.d(t,"__esModule",{value:!0}),a.d(t,"refractor",{enumerable:!0,get:function(){return o;}});var r=a("ae022160"),n=a("94d17c2f"),l=a("c79cb849");function i(){}i.prototype=l.Prism;let o=new i;o.highlight=function(e,t){let a,r;if("string"!=typeof e)throw TypeError("Expected `string` for `value`, got `"+e+"`");if(t&&"object"==typeof t)a=t;else{if("string"!=typeof(r=t))throw TypeError("Expected `string` for `name`, got `"+r+"`");if(Object.hasOwn(o.languages,r))a=o.languages[r];else throw Error("Unknown language: `"+r+"` is not registered");}return{type:"root",children:l.Prism.highlight.call(o,e,a,r)};},o.register=function(e){if("function"!=typeof e||!e.displayName)throw Error("Expected `function` for `syntax`, got `"+e+"`");Object.hasOwn(o.languages,e.displayName)||e(o);},o.alias=function(e,t){let a;let r=o.languages,n={};for(a in"string"==typeof e?t&&(n[e]=t):n=e,n)if(Object.hasOwn(n,a)){let e=n[a],t="string"==typeof e?[e]:e,l=-1;for(;++l<t.length;)r[t[l]]=r[a];}},o.registered=function(e){if("string"!=typeof e)throw TypeError("Expected `string` for `aliasOrLanguage`, got `"+e+"`");return Object.hasOwn(o.languages,e);},o.listLanguages=function(){let e;let t=o.languages,a=[];for(e in t)Object.hasOwn(t,e)&&"object"==typeof t[e]&&a.push(e);return a;},o.util.encode=function(e){return e;},o.Token.stringify=function e(t,a){if("string"==typeof t)return{type:"text",value:t};if(Array.isArray(t)){let r=[],n=-1;for(;++n<t.length;)null!==t[n]&&void 0!==t[n]&&""!==t[n]&&r.push(e(t[n],a));return r;}let l={attributes:{},classes:["token",t.type],content:e(t.content,a),language:a,tag:"span",type:t.type};return t.alias&&l.classes.push(..."string"==typeof t.alias?[t.alias]:t.alias),o.hooks.run("wrap",l),(0,r.h)(l.tag+"."+l.classes.join("."),function(e){let t;for(t in e)Object.hasOwn(e,t)&&(e[t]=(0,n.parseEntities)(e[t]));return e;}(l.attributes),l.content);};},ff019651:function(e,t,a){"use strict";a.d(t,"__esModule",{value:!0}),a.d(t,"default",{enumerable:!0,get:function(){return f;}});var r=a("777fffbe"),n=a("8090cfc0");a("996cf023");var l=r._(a("17d19f0f")),i=r._(a("b9336169")),o=r._(a("82e3a9c7")),s=r._(a("12b611aa")),d=r._(a("86cb85cd")),c=r._(a("fd409399")),u=a("3e6b097d"),f=()=>{let[e,t]=(0,u.useState)(!0),[a,r]=(0,u.useState)(!0),[f,g]=(0,u.useState)(!0),[h,p]=(0,u.useState)(!1),m=[{key:"edit",icon:(0,n.jsx)(l.default,{}),label:"Edit",onItemClick:()=>{d.default.info("Edit button clicked");}},{key:"share",icon:(0,n.jsx)(i.default,{}),label:"Share",onItemClick:()=>{d.default.success("Chart link copied to clipboard");}}],b={enableZoom:e,enableDownload:a,enableCopy:f,...h&&{customActions:m}};return(0,n.jsxs)("div",{style:{padding:24,maxWidth:800,margin:"0 auto"},children:[(0,n.jsxs)("div",{style:{marginBottom:24},children:[(0,n.jsx)("h2",{style:{marginBottom:16,color:"#1a1a1a"},children:"Header Actions Configuration"}),(0,n.jsxs)(c.default,{size:"large",wrap:!0,children:[(0,n.jsx)(s.default,{checked:e,onChange:e=>t(e.target.checked),children:"Enable Zoom"}),(0,n.jsx)(s.default,{checked:a,onChange:e=>r(e.target.checked),children:"Enable Download"}),(0,n.jsx)(s.default,{checked:f,onChange:e=>g(e.target.checked),children:"Enable Copy"}),(0,n.jsx)(s.default,{checked:h,onChange:e=>p(e.target.checked),children:"Show Custom Actions"})]})]}),(0,n.jsx)("div",{style:{border:"1px solid #f0f0f0",borderRadius:8,overflow:"hidden"},children:(0,n.jsx)(o.default,{actions:b,children:`flowchart TD
    A[Start] --> B{Decision Point}
    B -->|Yes| C[Process Data]
    B -->|No| D[Skip Processing]
    C --> E[Generate Report]
    D --> E
    E --> F[End]`})})]});};}}]);