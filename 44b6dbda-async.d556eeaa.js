(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["44b6dbda"],{a4405c02:function(e,n,a){"use strict";var s=a("852bbaa9")._;a.d(n,"__esModule",{value:!0}),a.d(n,"default",{enumerable:!0,get:function(){return u;}});var i=a("777fffbe"),r=a("8090cfc0"),c=a("0ba2ace3"),d=a("46c8afcf"),t=a("3e6b097d"),l=i._(a("c4352d30")),o=i._(a("f14e779a"));let x=(0,c.createStyles)(({token:e,css:n})=>({section:n`
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
    `}));var u=()=>{let{styles:e}=x(),n=(0,t.lazy)(()=>Promise.all([a.ensure("vendors_5"),a.ensure("common"),a.ensure("vendors_4"),a.ensure("7108fc30")]).then(a.dr(s,a.bind(a,"7108fc30")))),i=(0,t.lazy)(()=>Promise.all([a.ensure("vendors_5"),a.ensure("common"),a.ensure("vendors_4"),a.ensure("42cdb4ea")]).then(a.dr(s,a.bind(a,"42cdb4ea")))),c=(0,t.lazy)(()=>Promise.all([a.ensure("vendors_5"),a.ensure("common"),a.ensure("vendors_4"),a.ensure("5d484c98")]).then(a.dr(s,a.bind(a,"5d484c98")))),u=(0,t.lazy)(()=>Promise.all([a.ensure("vendors_5"),a.ensure("common"),a.ensure("vendors_4"),a.ensure("f4aeb400")]).then(a.dr(s,a.bind(a,"f4aeb400"))));return(0,r.jsxs)("main",{children:[(0,r.jsx)(o.default,{}),(0,r.jsx)("section",{className:e.section,children:(0,r.jsx)(l.default,{})}),(0,r.jsx)("section",{className:(0,d.clsx)(e.section,e.container),children:(0,r.jsx)(t.Suspense,{children:(0,r.jsx)(u,{})})}),(0,r.jsxs)("section",{className:(0,d.clsx)(e.section,e.container),children:[(0,r.jsx)(t.Suspense,{children:(0,r.jsx)(c,{})}),(0,r.jsx)(t.Suspense,{children:(0,r.jsx)(i,{})})]}),(0,r.jsx)("section",{className:(0,d.clsx)(e.section,e.framework,e.container),children:(0,r.jsx)(t.Suspense,{children:(0,r.jsx)(n,{})})})]});};},c5e8d449:function(e,n,a){"use strict";a.d(n,"__esModule",{value:!0}),a.d(n,"default",{enumerable:!0,get:function(){return d;}});var s=a("8090cfc0"),i=a("0ba2ace3"),r=a("46c8afcf");let c=(0,i.createStyles)(({token:e,css:n})=>({container:n`
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
    `}));var d=e=>{let{styles:n}=c();return(0,s.jsxs)("div",{className:(0,r.clsx)(n.container,e.className),style:e.style,onClick:e.onClick,children:[e.title&&(0,s.jsx)("h2",{className:n.title,children:e.title}),e.desc&&(0,s.jsx)("p",{className:n.desc,children:e.desc}),e.children]});};}}]);
//# sourceMappingURL=44b6dbda-async.d556eeaa.js.map