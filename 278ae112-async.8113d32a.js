(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["278ae112"],{"278ae112":function(e,i,n){"use strict";n.d(i,"__esModule",{value:!0}),n.e(i,{default:function(){return p;},useStyle:function(){return s;}});var t=n("777fffbe"),r=n("8090cfc0"),d=n("c5d21053"),a=n("0ba2ace3"),l=n("46c8afcf"),o=n("64d8f06c"),c=t._(n("3e6b097d"));let s=(0,a.createStyles)(({token:e,css:i})=>{let{antCls:n}=e;return{anchorToc:i`
      scrollbar-width: thin;
      scrollbar-gutter: stable;
      ${n}-anchor {
        ${n}-anchor-link-title {
          font-size: ${e.fontSizeSM}px;
        }
      }
    `,tocWrapper:i`
      position: fixed;
      top: ${e.headerHeight+e.contentMarginTop-4}px;
      inset-inline-end: 0;
      width: 148px;
      padding: 0;
      border-radius: ${e.borderRadius}px;
      box-sizing: border-box;
      margin-inline-end: calc(8px - 100vw + 100%);
      z-index: 10;
      .toc-debug {
        color: ${e.purple6};
        &:hover {
          color: ${e.purple5};
        }
      }
      > div {
        box-sizing: border-box;
        width: 100%;
        max-height: calc(100vh - ${e.headerHeight+e.contentMarginTop+24}px) !important;
        margin: auto;
        overflow: auto;
        padding: ${e.paddingXXS}px;
        backdrop-filter: blur(8px);
      }

      @media only screen and (max-width: ${e.screenLG}px) {
        display: none;
      }
    `,articleWrapper:i`
      padding-inline: 48px 164px;
      padding-block: 0 32px;

      @media only screen and (max-width: ${e.screenLG}px) {
        & {
          padding: 0 ${2*e.paddingLG}px;
        }
      }
    `};});var p=({showDebug:e,debugDemos:i=[]})=>{let{styles:n}=s(),t=(0,a.useTheme)(),p=(0,o.useRouteMeta)(),u=(0,o.useTabMeta)(),h=c.default.useMemo(()=>((null==u?void 0:u.toc)||p.toc).reduce((e,i)=>{if(2===i.depth)e.push({...i});else if(3===i.depth){let n=e[e.length-1];n&&(n.children=n.children||[],n.children.push({...i}));}return e;},[]),[null==u?void 0:u.toc,p.toc]);return p.frontmatter.toc?(0,r.jsx)("section",{className:n.tocWrapper,children:(0,r.jsx)(d.Anchor,{affix:!1,className:n.anchorToc,targetOffset:t.anchorTop,showInkInFixed:!0,items:h.map(n=>{var t;return{href:`#${n.id}`,title:n.title,key:n.id,children:null===(t=n.children)||void 0===t?void 0:t.filter(n=>e||!i.includes(n.id)).map(e=>({key:e.id,href:`#${e.id}`,title:(0,r.jsx)("span",{className:(0,l.clsx)({"toc-debug":i.includes(e.id)}),children:null==e?void 0:e.title})}))};})})}):null;};}}]);
//# sourceMappingURL=278ae112-async.8113d32a.js.map