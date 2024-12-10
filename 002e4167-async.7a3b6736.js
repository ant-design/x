(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["002e4167"],{"002e4167":function(e,n,t){"use strict";t.d(n,"__esModule",{value:!0}),t.d(n,"default",{enumerable:!0,get:function(){return v;}});var i=t("777fffbe"),a=t("852bbaa9"),l=t("a4446a09"),o=t("fda1afd4"),r=t("65bfd38d"),s=i._(t("70ad0bd7")),f=a._(t("e7242881")),d=i._(t("f73333ac")),c=i._(t("5a9c5183"));let u=(0,r.createStyles)(({token:e,css:n})=>{let{colorSplit:t,iconCls:i,fontSizeIcon:a}=e;return{prevNextNav:n`
      width: calc(100% - 234px);
      margin-inline-end: 170px;
      margin-inline-start: 64px;
      overflow: hidden;
      font-size: ${e.fontSize}px;
      border-top: 1px solid ${t};
      display: flex;
    `,pageNav:n`
      flex: 1;
      height: 72px;
      line-height: 72px;
      text-decoration: none;

      ${i} {
        color: #999;
        font-size: ${a}px;
        transition: all ${e.motionDurationSlow};
      }

      .chinese {
        margin-inline-start: ${e.marginXXS}px;
      }
    `,prevNav:n`
      text-align: start;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .footer-nav-icon-after {
        display: none;
      }

      .footer-nav-icon-before {
        position: relative;
        line-height: 0;
        vertical-align: middle;
        transition: inset-inline-end ${e.motionDurationSlow};
        margin-inline-end: 1em;
        inset-inline-end: 0;
      }

      &:hover .footer-nav-icon-before {
        inset-inline-end: 0.2em;
      }
    `,nextNav:n`
      text-align: end;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .footer-nav-icon-before {
        display: none;
      }

      .footer-nav-icon-after {
        position: relative;
        margin-bottom: 1px;
        line-height: 0;
        vertical-align: middle;
        transition: inset-inline-start ${e.motionDurationSlow};
        margin-inline-start: 1em;
        inset-inline-start: 0;
      }

      &:hover .footer-nav-icon-after {
        inset-inline-start: 0.2em;
      }
    `};}),m=e=>Array.isArray(e)?e.reduce((e,n)=>n?"children"in n&&n.children?e.concat(m(n.children)??[]):e.concat(n):e,[]):null;var v=({rtl:e})=>{let{styles:n}=u(),t={className:"footer-nav-icon-before"},i={className:"footer-nav-icon-after"},a=e?(0,l.jsx)(o.RightOutlined,{...t}):(0,l.jsx)(o.LeftOutlined,{...t}),r=e?(0,l.jsx)(o.LeftOutlined,{...i}):(0,l.jsx)(o.RightOutlined,{...i}),[v,x]=(0,d.default)({before:a,after:r}),{isMobile:g}=(0,f.useContext)(c.default),[p,h]=(0,f.useMemo)(()=>{let e=m(v);if(!e)return[null,null];let n=-1;return e.forEach((e,t)=>{e&&e.key===x&&(n=t);}),[e[n-1],e[n+1]];},[v,x]);return g?null:(0,l.jsxs)("section",{className:n.prevNextNav,children:[p&&f.default.cloneElement(p.label,{className:(0,s.default)(n.pageNav,n.prevNav,p.className)}),h&&f.default.cloneElement(h.label,{className:(0,s.default)(n.pageNav,n.nextNav,h.className)})]});};}}]);
//# sourceMappingURL=002e4167-async.7a3b6736.js.map