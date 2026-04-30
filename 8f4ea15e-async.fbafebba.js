(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["8f4ea15e"],{"8f4ea15e":function(e,n,t){"use strict";t.d(n,"__esModule",{value:!0}),t.d(n,"default",{enumerable:!0,get:function(){return v;}});var a=t("777fffbe"),i=t("852bbaa9"),l=t("8090cfc0"),o=a._(t("597373e4")),r=a._(t("7261227c")),s=t("2bb52879"),f=t("46c8afcf"),c=i._(t("3e6b097d")),d=a._(t("8a377d6c")),u=a._(t("f90be3ac"));let m=(0,s.createStyles)(({token:e,css:n})=>{let{colorSplit:t,iconCls:a,fontSizeIcon:i}=e;return{prevNextNav:n`
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

      ${a} {
        color: #999;
        font-size: ${i}px;
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
    `};}),x=e=>Array.isArray(e)?e.reduce((e,n)=>n?"children"in n&&n.children?e.concat(x(n.children)??[]):e.concat(n):e,[]):null;var v=({rtl:e})=>{let{styles:n}=m(),t={className:"footer-nav-icon-before"},a={className:"footer-nav-icon-after"},i=e?(0,l.jsx)(r.default,{...t}):(0,l.jsx)(o.default,{...t}),s=e?(0,l.jsx)(o.default,{...a}):(0,l.jsx)(r.default,{...a}),[v,p]=(0,d.default)({before:i,after:s}),{isMobile:g}=c.default.use(u.default),[h,b]=(0,c.useMemo)(()=>{let e=x(v);if(!e)return[null,null];let n=-1;return e.forEach((e,t)=>{e&&e.key===p&&(n=t);}),[e[n-1],e[n+1]];},[v,p]);return g?null:(0,l.jsxs)("section",{className:n.prevNextNav,children:[h&&c.default.cloneElement(h.label,{className:(0,f.clsx)(n.pageNav,n.prevNav,h.className)}),b&&c.default.cloneElement(b.label,{className:(0,f.clsx)(n.pageNav,n.nextNav,b.className)})]});};}}]);