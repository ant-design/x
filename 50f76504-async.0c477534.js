(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["50f76504"],{"0d3a6349":function(e,a,t){"use strict";t.d(a,"__esModule",{value:!0}),t.d(a,"default",{enumerable:!0,get:function(){return d;}});var r=t("8090cfc0");t("7e02abe3");var n=t("2bcf28f3"),d=()=>(0,r.jsx)(n.Mermaid,{children:`graph TD
    A[\u{5F00}\u{59CB}] --> B{\u{6761}\u{4EF6}\u{5224}\u{65AD}}
    B -->|\u{662F}| C[\u{6267}\u{884C}\u{64CD}\u{4F5C}A]
    B -->|\u{5426}| D[\u{6267}\u{884C}\u{64CD}\u{4F5C}B]
    C --> E[\u{7ED3}\u{675F}]
    D --> E`});},58020392:function(e,a,t){"use strict";t.d(a,"__esModule",{value:!0}),t.d(a,"default",{enumerable:!0,get:function(){return l;}});var r=t("8090cfc0");t("4418089e");var n=t("2bcf28f3"),d=t("c5d21053"),l=()=>{let e=(0,r.jsx)("div",{style:{padding:"12px 16px",border:"1px solid #f0f0f0",borderBottom:"none",borderRadius:"8px 8px 0 0",backgroundColor:"#fafafa"},children:(0,r.jsxs)(d.Space,{size:"middle",children:[(0,r.jsx)("span",{style:{fontWeight:500,color:"#1a1a1a"},children:"Login Flow"}),(0,r.jsx)(d.Button,{type:"primary",size:"small",children:"Export"}),(0,r.jsx)(d.Button,{size:"small",children:"Reset"})]})});return(0,r.jsx)("div",{style:{padding:24},children:(0,r.jsx)(n.Mermaid,{header:e,children:`flowchart LR
    A[User Login] --> B{Validate}
    B -->|Success| C[System Entry]
    B -->|Failed| D[Error Message]
    C --> E[Dashboard]
    D --> A`})});};},b6acc4dc:function(e,a,t){"use strict";t.d(a,"__esModule",{value:!0}),t.d(a,"default",{enumerable:!0,get:function(){return u;}});var r=t("777fffbe"),n=t("8090cfc0");t("40b09c76");var d=t("2bcf28f3"),l=t("3e6b097d"),c=r._(t("ce5dd0f9")),i=r._(t("40ff87e3"));let o={cn:{root:"\u6839\u8282\u70B9",header:"\u5934\u90E8\u7684\u5BB9\u5668",graph:"\u56FE\u7247\u7684\u5BB9\u5668",code:"\u4EE3\u7801\u5BB9\u5668"},en:{root:"root",header:"Wrapper element of the header",graph:"Wrapper element of the graph",code:"Wrapper element of the code"}},s=`graph TD
    A[Start] --> B{Data Valid?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Error Handling]
    C --> E[Generate Report]
    D --> E
    E --> F[End]
    style A fill:#2ecc71,stroke:#27ae60
    style F fill:#e74c3c,stroke:#c0392b`;var u=()=>{let[e]=(0,i.default)(o),[a,t]=(0,l.useState)("image");return(0,n.jsx)(c.default,{componentName:"Mermaid",semantics:[{name:"root",desc:e.root},{name:"header",desc:e.header},"image"===a?{name:"graph",desc:e.graph}:{name:"code",desc:e.code}],children:(0,n.jsx)(d.Mermaid,{onRenderTypeChange:e=>t(e),children:s})});};},e26ad08c:function(e,a,t){"use strict";t.d(a,"__esModule",{value:!0}),t.d(a,"default",{enumerable:!0,get:function(){return u;}});var r=t("777fffbe"),n=t("8090cfc0");t("db268fe0");var d=t("2bcf28f3"),l=r._(t("ffa67926")),c=t("c5d21053"),i=r._(t("3e6b097d"));let o=`
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
`,s=e=>{var a;let{className:t,children:r}=e,l=(null==t?void 0:null===(a=t.match(/language-(\w+)/))||void 0===a?void 0:a[1])||"";return"string"!=typeof r?null:"mermaid"===l?(0,n.jsx)(d.Mermaid,{children:r}):(0,n.jsx)("code",{children:r});};var u=()=>{let[e,a]=i.default.useState(0),t=i.default.useRef(null),r=i.default.useRef(null);return i.default.useEffect(()=>{if(!(e>=o.length))return t.current=setTimeout(()=>{a(Math.min(e+5,o.length));},20),()=>{t.current&&(clearTimeout(t.current),t.current=null);};},[e]),i.default.useEffect(()=>{if(r.current&&e>0&&e<o.length){let{scrollHeight:e,clientHeight:a}=r.current;e>a&&r.current.scrollTo({top:e,behavior:"smooth"});}},[e]),(0,n.jsxs)(c.Flex,{vertical:!0,gap:"small",style:{height:600,overflow:"auto"},ref:r,children:[(0,n.jsx)(c.Flex,{justify:"flex-end",children:(0,n.jsx)(c.Button,{onClick:()=>a(0),children:"Re-Render"})}),(0,n.jsx)(d.Bubble,{content:o.slice(0,e),styles:{content:{width:700}},contentRender:e=>(0,n.jsx)(l.default,{components:{code:s},paragraphTag:"div",children:e}),variant:"outlined"})]});};},ff019651:function(e,a,t){"use strict";t.d(a,"__esModule",{value:!0}),t.d(a,"default",{enumerable:!0,get:function(){return i;}});var r=t("8090cfc0");t("996cf023");var n=t("2020273b"),d=t("2bcf28f3"),l=t("c5d21053"),c=t("3e6b097d"),i=()=>{let[e,a]=(0,c.useState)(!0),[t,i]=(0,c.useState)(!0),[o,s]=(0,c.useState)(!0),[u,h]=(0,c.useState)(!1),f=[{key:"edit",icon:(0,r.jsx)(n.EditOutlined,{}),label:"Edit",onItemClick:()=>{l.message.info("Edit button clicked");}},{key:"share",icon:(0,r.jsx)(n.ShareAltOutlined,{}),label:"Share",onItemClick:()=>{l.message.success("Chart link copied to clipboard");}}],g={enableZoom:e,enableDownload:t,enableCopy:o,...u&&{customActions:f}};return(0,r.jsxs)("div",{style:{padding:24,maxWidth:800,margin:"0 auto"},children:[(0,r.jsxs)("div",{style:{marginBottom:24},children:[(0,r.jsx)("h2",{style:{marginBottom:16,color:"#1a1a1a"},children:"Header Actions Configuration"}),(0,r.jsxs)(l.Space,{size:"large",wrap:!0,children:[(0,r.jsx)(l.Checkbox,{checked:e,onChange:e=>a(e.target.checked),children:"Enable Zoom"}),(0,r.jsx)(l.Checkbox,{checked:t,onChange:e=>i(e.target.checked),children:"Enable Download"}),(0,r.jsx)(l.Checkbox,{checked:o,onChange:e=>s(e.target.checked),children:"Enable Copy"}),(0,r.jsx)(l.Checkbox,{checked:u,onChange:e=>h(e.target.checked),children:"Show Custom Actions"})]})]}),(0,r.jsx)("div",{style:{border:"1px solid #f0f0f0",borderRadius:8,overflow:"hidden"},children:(0,r.jsx)(d.Mermaid,{actions:g,children:`flowchart TD
    A[Start] --> B{Decision Point}
    B -->|Yes| C[Process Data]
    B -->|No| D[Skip Processing]
    C --> E[Generate Report]
    D --> E
    E --> F[End]`})})]});};}}]);
//# sourceMappingURL=50f76504-async.0c477534.js.map