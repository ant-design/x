(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["f281e03b"],{51630109:function(e,l,t){"use strict";t.d(l,"__esModule",{value:!0}),t.d(l,"default",{enumerable:!0,get:function(){return r;}});var n=t("8090cfc0"),i=t("c5d21053");let a=({num:e=3})=>(0,n.jsx)("li",{children:Array.from({length:e}).map((e,l)=>(0,n.jsx)(i.Skeleton.Avatar,{size:"small",active:!0,style:{marginInlineStart:0===l?0:-8}},l))});var r=e=>{let{item:{username:l,url:t}={},loading:r}=e;return r?(0,n.jsx)(a,{}):(null==l?void 0:l.includes("github-actions"))?null:(0,n.jsx)(i.Tooltip,{title:l,children:(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:`https://github.com/${l}`,target:"_blank",rel:"noopener noreferrer",children:(0,n.jsx)(i.Avatar,{size:"small",src:t,alt:l,children:l})})})});};},f281e03b:function(e,l,t){"use strict";t.d(l,"__esModule",{value:!0}),t.d(l,"default",{enumerable:!0,get:function(){return m;}});var n=t("777fffbe"),i=t("8090cfc0"),a=n._(t("e3269466")),r=t("0ba2ace3"),s=n._(t("8c339db8")),o=t("3a2876c3"),d=t("3e6b097d"),u=n._(t("968104eb")),c=n._(t("51630109"));let f=(0,r.createStyles)(({token:e,css:l})=>({listMobile:l`
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
  `}));var m=({filename:e})=>{let{formatMessage:l}=(0,o.useIntl)(),{styles:t}=f(),{isMobile:n}=(0,d.useContext)(u.default);return e?(0,i.jsxs)("div",{className:(0,s.default)({[t.listMobile]:n}),children:[(0,i.jsx)("div",{className:t.title,children:l({id:"app.content.contributors"})}),(0,i.jsx)(a.default,{cache:!0,repo:"x",owner:"ant-design",branch:"main",fileName:e,className:t.list,renderItem:(e,l)=>(0,i.jsx)(c.default,{item:e,loading:l},null==e?void 0:e.url)})]}):null;};}}]);
//# sourceMappingURL=f281e03b-async.5ccc1bac.js.map