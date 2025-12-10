(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["c08eded9"],{a4405c02:function(e,n,a){"use strict";var i=a("852bbaa9")._;a.d(n,"__esModule",{value:!0}),a.d(n,"default",{enumerable:!0,get:function(){return f;}});var s=a("777fffbe"),r=a("8090cfc0"),d=a("0ba2ace3"),t=s._(a("8c339db8")),c=a("3e6b097d"),l=s._(a("c4352d30")),o=s._(a("f14e779a"));let u=(0,d.createStyles)(({token:e,css:n})=>({section:n`
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
    `}));var f=()=>{let{styles:e}=u(),n=(0,c.lazy)(()=>Promise.all([a.ensure("vendors_5"),a.ensure("common"),a.ensure("vendors_4"),a.ensure("7108fc30")]).then(a.dr(i,a.bind(a,"7108fc30")))),s=(0,c.lazy)(()=>Promise.all([a.ensure("vendors_5"),a.ensure("common"),a.ensure("vendors_4"),a.ensure("42cdb4ea")]).then(a.dr(i,a.bind(a,"42cdb4ea")))),d=(0,c.lazy)(()=>Promise.all([a.ensure("vendors_5"),a.ensure("common"),a.ensure("vendors_4"),a.ensure("5d484c98")]).then(a.dr(i,a.bind(a,"5d484c98")))),f=(0,c.lazy)(()=>Promise.all([a.ensure("vendors_5"),a.ensure("common"),a.ensure("vendors_4"),a.ensure("f4aeb400")]).then(a.dr(i,a.bind(a,"f4aeb400"))));return(0,r.jsxs)("main",{children:[(0,r.jsx)(o.default,{}),(0,r.jsx)("section",{className:e.section,children:(0,r.jsx)(l.default,{})}),(0,r.jsx)("section",{className:(0,t.default)(e.section,e.container),children:(0,r.jsx)(c.Suspense,{children:(0,r.jsx)(f,{})})}),(0,r.jsxs)("section",{className:(0,t.default)(e.section,e.container),children:[(0,r.jsx)(c.Suspense,{children:(0,r.jsx)(d,{})}),(0,r.jsx)(c.Suspense,{children:(0,r.jsx)(s,{})})]}),(0,r.jsx)("section",{className:(0,t.default)(e.section,e.framework,e.container),children:(0,r.jsx)(c.Suspense,{children:(0,r.jsx)(n,{})})})]});};},c08eded9:function(e,n,a){"use strict";a.d(n,"__esModule",{value:!0}),a.d(n,"default",{enumerable:!0,get:function(){return i;}});var i=a("777fffbe")._(a("a4405c02")).default;},c5e8d449:function(e,n,a){"use strict";a.d(n,"__esModule",{value:!0}),a.d(n,"default",{enumerable:!0,get:function(){return c;}});var i=a("777fffbe"),s=a("8090cfc0"),r=a("0ba2ace3"),d=i._(a("8c339db8"));let t=(0,r.createStyles)(({token:e,css:n})=>({container:n`
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
    `}));var c=e=>{let{styles:n}=t();return(0,s.jsxs)("div",{className:(0,d.default)(n.container,e.className),style:e.style,onClick:e.onClick,children:[e.title&&(0,s.jsx)("h2",{className:n.title,children:e.title}),e.desc&&(0,s.jsx)("p",{className:n.desc,children:e.desc}),e.children]});};}}]);
//# sourceMappingURL=c08eded9-async.6ec05510.js.map