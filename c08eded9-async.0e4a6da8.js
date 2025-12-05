(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["c08eded9"],{a4405c02:function(e,n,a){"use strict";var i=a("852bbaa9")._;a.d(n,"__esModule",{value:!0}),a.d(n,"default",{enumerable:!0,get:function(){return f;}});var t=a("777fffbe"),d=a("8090cfc0"),s=a("0ba2ace3"),r=t._(a("8c339db8")),c=a("3e6b097d"),l=t._(a("c4352d30")),o=t._(a("f14e779a"));let u=(0,s.createStyles)(({token:e,css:n})=>({section:n`
      background: linear-gradient(180deg, #1e2226e6 0%, #1c2024 38%, #16191c 100%);
      border-radius: 40px 40px 0 0;
      backdrop-filter: blur(40px);
      display: flex;
      flex-direction: column;
      gap: ${e.pcContainerMargin}px;
      padding: ${e.pcContainerMargin}px 0;
    `,container:n`
      margin-top: -40px;
    `,framework:n`
      border-radius: 0;
      background-image: linear-gradient(90deg, #5a37e6 0%, #0059c9 100%);
    `}));var f=()=>{let{styles:e}=u(),n=(0,c.lazy)(()=>Promise.all([a.ensure("vendors_4"),a.ensure("common"),a.ensure("7108fc30")]).then(a.dr(i,a.bind(a,"7108fc30")))),t=(0,c.lazy)(()=>Promise.all([a.ensure("vendors_4"),a.ensure("common"),a.ensure("42cdb4ea")]).then(a.dr(i,a.bind(a,"42cdb4ea")))),s=(0,c.lazy)(()=>Promise.all([a.ensure("vendors_4"),a.ensure("common"),a.ensure("5d484c98")]).then(a.dr(i,a.bind(a,"5d484c98")))),f=(0,c.lazy)(()=>Promise.all([a.ensure("vendors_4"),a.ensure("common"),a.ensure("f4aeb400")]).then(a.dr(i,a.bind(a,"f4aeb400"))));return(0,d.jsxs)("main",{children:[(0,d.jsx)(o.default,{}),(0,d.jsx)("section",{className:e.section,children:(0,d.jsx)(l.default,{})}),(0,d.jsx)("section",{className:(0,r.default)(e.section,e.container),children:(0,d.jsx)(c.Suspense,{children:(0,d.jsx)(f,{})})}),(0,d.jsxs)("section",{className:(0,r.default)(e.section,e.container),children:[(0,d.jsx)(c.Suspense,{children:(0,d.jsx)(s,{})}),(0,d.jsx)(c.Suspense,{children:(0,d.jsx)(t,{})})]}),(0,d.jsx)("section",{className:(0,r.default)(e.section,e.framework,e.container),children:(0,d.jsx)(c.Suspense,{children:(0,d.jsx)(n,{})})})]});};},c08eded9:function(e,n,a){"use strict";a.d(n,"__esModule",{value:!0}),a.d(n,"default",{enumerable:!0,get:function(){return i;}});var i=a("777fffbe")._(a("a4405c02")).default;},c5e8d449:function(e,n,a){"use strict";a.d(n,"__esModule",{value:!0}),a.d(n,"default",{enumerable:!0,get:function(){return c;}});var i=a("777fffbe"),t=a("8090cfc0"),d=a("0ba2ace3"),s=i._(a("8c339db8"));let r=(0,d.createStyles)(({token:e,css:n})=>({container:n`
      width: 100%;
      margin: 0 auto;
      max-width: ${e.pcMaxWidth-2*e.pcContainerMargin}px;
      font-family: AlibabaPuHuiTi, ${e.fontFamily}, sans-serif;

      @media only screen and (max-width: ${e.pcMaxWidth}px) {
        max-width: calc(100vw - ${2*e.pcContainerMargin}px);
      }

      @media only screen and (max-width: ${e.mobileMaxWidth}px) {
        max-width: calc(100vw - ${2*e.marginLG}px);
      }
    `,title:n`
      font-size: 48px;
      color: #fff;
      text-align: center;
      padding-bottom: ${e.padding}px;

      @media only screen and (max-width: ${e.mobileMaxWidth}px) {
        font-size: ${e.fontSizeHeading1}px;
      }
    `,desc:n`
      color: ${e.colorTextSecondary};
      max-width: 880px !important;
      margin: 0 auto;
      text-align: center;
      padding-bottom: ${e.padding}px;
    `}));var c=e=>{let{styles:n}=r();return(0,t.jsxs)("div",{className:(0,s.default)(n.container,e.className),style:e.style,onClick:e.onClick,children:[e.title&&(0,t.jsx)("h2",{className:n.title,children:e.title}),e.desc&&(0,t.jsx)("p",{className:n.desc,children:e.desc}),e.children]});};}}]);
//# sourceMappingURL=c08eded9-async.0e4a6da8.js.map