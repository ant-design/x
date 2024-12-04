(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["1b1ea5c3"],{"1b1ea5c3":function(e,n,i){"use strict";i.d(n,"__esModule",{value:!0}),i.e(n,{default:function(){return p;},useStyle:function(){return s;}});var t=i("777fffbe"),d=i("8090cfc0"),r=i("c5d21053"),a=i("0ba2ace3"),o=t._(i("8c339db8")),l=i("3a2876c3"),c=t._(i("3e6b097d"));let s=(0,a.createStyles)(({token:e,css:n})=>{let{antCls:i}=e;return{anchorToc:n`
      scrollbar-width: thin;
      scrollbar-color: unset;
      ${i}-anchor {
        ${i}-anchor-link-title {
          font-size: ${e.fontSizeSM}px;
        }
      }
    `,tocWrapper:n`
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
    `,articleWrapper:n`
      padding-inline: 48px 164px;
      padding-block: 0 32px;

      @media only screen and (max-width: ${e.screenLG}px) {
        & {
          padding: 0 ${2*e.paddingLG}px;
        }
      }
    `};});var p=({showDebug:e,debugDemos:n=[]})=>{let{styles:i}=s(),t=(0,a.useTheme)(),p=(0,l.useRouteMeta)(),u=(0,l.useTabMeta)(),h=c.default.useMemo(()=>((null==u?void 0:u.toc)||p.toc).reduce((e,n)=>{if(2===n.depth)e.push({...n});else if(3===n.depth){let i=e[e.length-1];i&&(i.children=i.children||[],i.children.push({...n}));}return e;},[]),[null==u?void 0:u.toc,p.toc]);return p.frontmatter.toc?(0,d.jsx)("section",{className:i.tocWrapper,children:(0,d.jsx)(r.Anchor,{affix:!1,className:i.anchorToc,targetOffset:t.anchorTop,showInkInFixed:!0,items:h.map(i=>{var t;return{href:`#${i.id}`,title:i.title,key:i.id,children:null===(t=i.children)||void 0===t?void 0:t.filter(i=>e||!n.includes(i.id)).map(e=>({key:e.id,href:`#${e.id}`,title:(0,d.jsx)("span",{className:(0,o.default)({"toc-debug":n.includes(e.id)}),children:null==e?void 0:e.title})}))};})})}):null;};}}]);
//# sourceMappingURL=1b1ea5c3-async.515e0007.js.map