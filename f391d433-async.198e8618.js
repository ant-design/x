(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["f391d433"],{"646c9da1":function(e,l,t){"use strict";t.d(l,"__esModule",{value:!0}),t.d(l,"default",{enumerable:!0,get:function(){return r;}});var n=t("a4446a09"),i=t("78539509");let a=({num:e=3})=>(0,n.jsx)("li",{children:Array.from({length:e}).map((e,l)=>(0,n.jsx)(i.Skeleton.Avatar,{size:"small",active:!0,style:{marginInlineStart:0===l?0:-8}},l))});var r=e=>{let{item:{username:l,url:t}={},loading:r}=e;return r?(0,n.jsx)(a,{}):(null==l?void 0:l.includes("github-actions"))?null:(0,n.jsx)(i.Tooltip,{title:l,children:(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:`https://github.com/${l}`,target:"_blank",rel:"noopener noreferrer",children:(0,n.jsx)(i.Avatar,{size:"small",src:t,alt:l,children:l})})})});};},f391d433:function(e,l,t){"use strict";t.d(l,"__esModule",{value:!0}),t.d(l,"default",{enumerable:!0,get:function(){return m;}});var n=t("777fffbe"),i=t("a4446a09"),a=n._(t("6dd7375c")),r=t("65bfd38d"),s=n._(t("70ad0bd7")),d=t("653be5f0"),o=t("e7242881"),u=n._(t("5a9c5183")),c=n._(t("646c9da1"));let f=(0,r.createStyles)(({token:e,css:l})=>({listMobile:l`
    margin: 1em 0 !important;
  `,title:l`
    font-size: ${e.fontSizeSM}px;
    opacity: 0.5;
    margin-bottom: ${e.marginXS}px;
  `,list:l`
    display: flex;
    flex-wrap: wrap;
    clear: both;
    li {
      height: 24px;
      transition: all ${e.motionDurationSlow};
      margin-inline-end: -${e.marginXS}px;
    }
    &:hover {
      li {
        margin-inline-end: 0;
      }
    }
  `}));var m=({filename:e})=>{let{formatMessage:l}=(0,d.useIntl)(),{styles:t}=f(),{isMobile:n}=(0,o.useContext)(u.default);return e?(0,i.jsxs)("div",{className:(0,s.default)({[t.listMobile]:n}),children:[(0,i.jsx)("div",{className:t.title,children:l({id:"app.content.contributors"})}),(0,i.jsx)(a.default,{cache:!0,repo:"x",owner:"ant-design",branch:"main",fileName:e,className:t.list,renderItem:(e,l)=>(0,i.jsx)(c.default,{item:e,loading:l},null==e?void 0:e.url)})]}):null;};}}]);
//# sourceMappingURL=f391d433-async.198e8618.js.map