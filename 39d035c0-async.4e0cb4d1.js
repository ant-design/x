(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["39d035c0"],{"128fba82":function(e,a,i){"use strict";i.d(a,"__esModule",{value:!0}),i.d(a,"default",{enumerable:!0,get:function(){return o;}});var t=i("777fffbe"),n=i("8090cfc0"),d=i("0ba2ace3"),l=t._(i("8c339db8"));let c=(0,d.createStyles)(({token:e,css:a})=>({container:a`
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
    `,title:a`
      font-size: 48px;
      color: #fff;
      text-align: center;
      padding-bottom: ${e.padding}px;

      @media only screen and (max-width: ${e.mobileMaxWidth}px) {
        font-size: ${e.fontSizeHeading1}px;
      }
    `,desc:a`
      color: ${e.colorTextSecondary};
      max-width: 880px !important;
      margin: 0 auto;
      text-align: center;
      padding-bottom: ${e.padding}px;
    `}));var o=e=>{let{styles:a}=c();return(0,n.jsxs)("div",{className:(0,l.default)(a.container,e.className),style:e.style,onClick:e.onClick,children:[e.title&&(0,n.jsx)("h2",{className:a.title,children:e.title}),e.desc&&(0,n.jsx)("p",{className:a.desc,children:e.desc}),e.children]});};}}]);
//# sourceMappingURL=39d035c0-async.4e0cb4d1.js.map