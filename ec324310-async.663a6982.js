(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["ec324310"],{"033c7941":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return d;}});var i=n("777fffbe"),o=n("8090cfc0"),r=n("5fa675a9"),a=n("4fc63de3"),l=i._(n("3e6b097d")),d=()=>{let e=(0,a.useRouteMeta)(),[t,n]=l.default.useMemo(()=>{let t;if(e.frontmatter.subtitle||e.frontmatter.title){var n,i,o,r,a,l;let d=(null===(i=e.frontmatter.subtitle)||void 0===i?void 0:null===(n=i.split("\uFF5C"))||void 0===n?void 0:n.length)===2?null===(r=e.frontmatter.subtitle)||void 0===r?void 0:null===(o=r.split("\uFF5C"))||void 0===o?void 0:o[1]:`${(null==e?void 0:null===(a=e.frontmatter)||void 0===a?void 0:a.subtitle)||""}${(null===(l=e.frontmatter)||void 0===l?void 0:l.title)||""}`;t=`${d||""} - Ant Design X`;}else t="404 Not Found - Ant Design X";return[t,e.frontmatter.description||""];},[e]);return(0,o.jsxs)(r.Helmet,{children:[(0,o.jsx)("title",{children:t}),(0,o.jsx)("meta",{property:"og:title",content:t}),n&&(0,o.jsx)("meta",{name:"og:description",content:n})]});};},"0b508d5d":function(e,t,n){"use strict";var i=n("852bbaa9")._;n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return s;}});var o=n("777fffbe"),r=n("8090cfc0"),a=n("5fa675a9"),l=o._(n("3e6b097d")),d=o._(n("d11c3a59")),s=e=>{let{children:t,title:o,desc:s}=e,c=l.default.lazy(()=>Promise.all([n.ensure("vendors_6"),n.ensure("vendors_4"),n.ensure("vendors_5"),n.ensure("ff0bf651")]).then(n.dr(i,n.bind(n,"ff0bf651"))));return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(a.Helmet,{children:[(0,r.jsx)("title",{children:o}),(0,r.jsx)("meta",{property:"og:title",content:o}),s&&(0,r.jsx)("meta",{name:"description",content:s})]}),(0,r.jsx)("div",{style:{minHeight:"100vh"},children:t}),(0,r.jsx)(d.default,{children:(0,r.jsx)(c,{})})]});};},"0fc2ea02":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=n("8090cfc0"),o=n("8997291d"),r=n("2bb52879"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(o.Global,{styles:(0,o.css)`
        @font-face {
          font-weight: normal;
          font-family: AlibabaPuHuiTi;
          src:
            url('//at.alicdn.com/t/webfont_6e11e43nfj.woff2') format('woff2'),
            url('//at.alicdn.com/t/webfont_6e11e43nfj.woff') format('woff'),
            /* chrome、firefox */ url('//at.alicdn.com/t/webfont_6e11e43nfj.ttf') format('truetype'); /* chrome、firefox、opera、Safari, Android, iOS 4.2+ */
          font-display: swap;
        }

        @font-face {
          font-weight: bold;
          font-family: AlibabaPuHuiTi;
          src:
            url('//at.alicdn.com/t/webfont_exesdog9toj.woff2') format('woff2'),
            url('//at.alicdn.com/t/webfont_exesdog9toj.woff') format('woff'),
            /* chrome、firefox */ url('//at.alicdn.com/t/webfont_exesdog9toj.ttf')
              format('truetype'); /* chrome、firefox、opera、Safari, Android, iOS 4.2+ */
          font-display: swap;
        }

        // 组件丰富，选用自如定制主题随心所欲设计语言与研发框架1234567890 QWERTYUIOPLKJHGFDSAZXCVBNM,.mnbvcxzasdfghjklpoiuytrewq
        /* CDN 服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
        @font-face {
          font-weight: 900;
          font-family: 'AliPuHui';
          src:
            url('//at.alicdn.com/wf/webfont/exMpJIukiCms/Gsw2PSKrftc1yNWMNlXgw.woff2')
              format('woff2'),
            url('//at.alicdn.com/wf/webfont/exMpJIukiCms/vtu73by4O2gEBcvBuLgeu.woff') format('woff');
          font-display: swap;
        }

        html {
          direction: initial;

          &.rtl {
            direction: rtl;
          }
        }

        body {
          overflow-x: hidden;
          color: ${e.colorText};
          font-size: ${e.fontSize}px;
          font-family: ${e.fontFamily};
          line-height: ${e.lineHeight};
          background: ${e.colorBgContainer};
          transition: background-color 1s cubic-bezier(0.075, 0.82, 0.165, 1);
        }
      `});};},"278ae112":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.e(t,{default:function(){return p;},useStyle:function(){return c;}});var i=n("777fffbe"),o=n("8090cfc0"),r=i._(n("80a072f5")),a=n("2bb52879"),l=n("46c8afcf"),d=n("4fc63de3"),s=i._(n("3e6b097d"));let c=(0,a.createStyles)(({token:e,css:t})=>{let{antCls:n}=e;return{anchorToc:t`
      scrollbar-width: thin;
      scrollbar-gutter: stable;
      ${n}-anchor {
        ${n}-anchor-link-title {
          font-size: ${e.fontSizeSM}px;
        }
      }
    `,tocWrapper:t`
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
    `,articleWrapper:t`
      padding-inline: 48px 164px;
      padding-block: 0 32px;

      @media only screen and (max-width: ${e.screenLG}px) {
        & {
          padding: 0 ${2*e.paddingLG}px;
        }
      }
    `};});var p=({showDebug:e,debugDemos:t=[]})=>{let{styles:n}=c(),i=(0,a.useTheme)(),p=(0,d.useRouteMeta)(),u=(0,d.useTabMeta)(),f=s.default.useMemo(()=>((null==u?void 0:u.toc)||p.toc).reduce((e,t)=>{if(2===t.depth)e.push({...t});else if(3===t.depth){let n=e[e.length-1];n&&(n.children=n.children||[],n.children.push({...t}));}return e;},[]),[null==u?void 0:u.toc,p.toc]);return p.frontmatter.toc?(0,o.jsx)("section",{className:n.tocWrapper,children:(0,o.jsx)(r.default,{affix:!1,className:n.anchorToc,targetOffset:i.anchorTop,showInkInFixed:!0,items:f.map(n=>{var i;return{href:`#${n.id}`,title:n.title,key:n.id,children:null===(i=n.children)||void 0===i?void 0:i.filter(n=>e||!t.includes(n.id)).map(e=>({key:e.id,href:`#${e.id}`,title:(0,o.jsx)("span",{className:(0,l.clsx)({"toc-debug":t.includes(e.id)}),children:null==e?void 0:e.title})}))};})})}):null;};},"2de8e7da":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return s;}});var i=n("777fffbe"),o=n("8090cfc0"),r=n("8997291d"),a=n("c7cef649"),l=n("2bb52879"),d=i._(n("3e6b097d")),s=()=>{let{anchorTop:e}=(0,l.useTheme)();return d.default.useInsertionEffect(()=>{(0,a.updateCSS)("@layer global, antd;","site-global",{prepend:!0});},[]),(0,o.jsx)(r.Global,{styles:(0,r.css)`
        @layer global {
          body,
          div,
          dl,
          dt,
          dd,
          ul,
          ol,
          li,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          pre,
          code,
          form,
          fieldset,
          legend,
          input,
          textarea,
          p,
          blockquote,
          th,
          td,
          hr,
          button,
          article,
          aside,
          details,
          figcaption,
          figure,
          footer,
          header,
          hgroup,
          menu,
          nav,
          section {
            margin: 0;
            padding: 0;
          }

          ul,
          ol {
            list-style: none;
          }

          img {
            vertical-align: middle;
            border-style: none;
          }

          [id] {
            scroll-margin-top: ${e}px;
          }

          [data-prefers-color='dark'] {
            color-scheme: dark;
          }

          [data-prefers-color='light'] {
            color-scheme: light;
          }
        }
      `});};},"318014f6":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return x;}});var i=n("777fffbe"),o=n("8090cfc0"),r=i._(n("6dbf8ae0")),a=i._(n("2de8e7da")),l=i._(n("fa5f6340")),d=i._(n("4ef87281")),s=i._(n("77401372")),c=i._(n("bcd2b2ef")),p=i._(n("e6eeb335")),u=i._(n("5f73947c")),f=i._(n("0fc2ea02")),m=i._(n("70bca826")),g=i._(n("31bde226")),h=i._(n("de0c83b4")),x=()=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(f.default,{}),(0,o.jsx)(a.default,{}),(0,o.jsx)(c.default,{}),(0,o.jsx)(s.default,{}),(0,o.jsx)(l.default,{}),(0,o.jsx)(m.default,{}),(0,o.jsx)(p.default,{}),(0,o.jsx)(u.default,{}),(0,o.jsx)(h.default,{}),(0,o.jsx)(r.default,{}),(0,o.jsx)(d.default,{}),(0,o.jsx)(g.default,{})]});},"31bde226":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=n("8090cfc0"),o=n("8997291d"),r=n("2bb52879");let a="dumi-default-";var l=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(o.Global,{styles:(0,o.css)`
        html {
          .${a}search-bar {
            &-input {
              color: ${e.colorText};
              background: ${e.colorBgContainer};
              &:focus {
                background: ${e.colorBgContainer};
              }
              &::placeholder {
                color: ${e.colorTextPlaceholder} !important;
              }
            }
          }
          .${a}search-popover {
            background-color: ${e.colorBgElevated} !important;
            &::before {
              border-bottom-color: ${e.colorBgElevated} !important;
            }
          }
          .${a}search-result {
            dl {
              dt {
                background-color: ${e.controlItemBgActive} !important;
              }
              dd {
                a {
                  &:hover {
                    background-color: ${e.controlItemBgHover};
                    h4,
                    p {
                      color: ${e.colorText} !important;
                    }
                    svg {
                      fill: ${e.colorText} !important;
                    }
                  }
                }
              }
            }
          }
        }
      `});};},"3352a31c":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=n("c7cef649"),o=n("2bb52879"),r=n("3e6b097d");let a=`
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

.dark::view-transition-old(root) {
  z-index: 1;
}

.dark::view-transition-new(root) {
  z-index: 999;
}

::view-transition-old(root) {
  z-index: 999;
}

::view-transition-new(root) {
  z-index: 1;
}
`;var l=()=>{let{colorBgElevated:e}=(0,o.useTheme)(),t=(0,r.useRef)({colorBgElevated:e}),n=(e,t)=>{(0,i.updateCSS)(`
    * {
    transition: none !important;
  }
    `,"disable-transition"),document.documentElement.animate({clipPath:t?[...e].reverse():e},{duration:500,easing:"ease-in",pseudoElement:t?"::view-transition-old(root)":"::view-transition-new(root)"}).addEventListener("finish",()=>{(0,i.removeCSS)("disable-transition");});};return(0,r.useEffect)(()=>{"function"==typeof document.startViewTransition&&(0,i.updateCSS)(a,"view-transition-style");},[]),(0,r.useEffect)(()=>{e!==t.current.colorBgElevated&&(t.current.colorBgElevated=e);},[e]),(o,r)=>{if(!(o&&"function"==typeof document.startViewTransition))return;let a=Date.now(),l=o.clientX,d=o.clientY,s=Math.hypot(Math.max(l,innerWidth-l),Math.max(d,innerHeight-d));(0,i.updateCSS)(`
    [data-prefers-color='dark'] {
      color-scheme: light !important;
    }

    [data-prefers-color='light'] {
      color-scheme: dark !important;
    }
    `,"color-scheme"),document.startViewTransition(async()=>{for(;e===t.current.colorBgElevated;)await new Promise(e=>setTimeout(e,1e3/60));let n=document.documentElement;n.classList.remove(r?"dark":"light"),n.classList.add(r?"light":"dark");}).ready.then(()=>{console.log(`Theme transition finished in ${Date.now()-a}ms`);let e=[`circle(0px at ${l}px ${d}px)`,`circle(${s}px at ${l}px ${d}px)`];(0,i.removeCSS)("color-scheme"),n(e,r);});};};},"3aacceed":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=n("777fffbe"),o=n("8090cfc0"),r=i._(n("328b8c88"));let a=e=>(0,o.jsxs)("svg",{width:20,height:20,viewBox:"0 0 24 24",fill:"currentColor",...e,children:[(0,o.jsx)("title",{children:"Theme icon"}),(0,o.jsx)("g",{fillRule:"evenodd",children:(0,o.jsx)("g",{fillRule:"nonzero",children:(0,o.jsx)("path",{d:"M7.02 3.635l12.518 12.518a1.863 1.863 0 010 2.635l-1.317 1.318a1.863 1.863 0 01-2.635 0L3.068 7.588A2.795 2.795 0 117.02 3.635zm2.09 14.428a.932.932 0 110 1.864.932.932 0 010-1.864zm-.043-9.747L7.75 9.635l9.154 9.153 1.318-1.317-9.154-9.155zM3.52 12.473c.514 0 .931.417.931.931v.932h.932a.932.932 0 110 1.864h-.932v.931a.932.932 0 01-1.863 0l-.001-.931h-.93a.932.932 0 010-1.864h.93v-.932c0-.514.418-.931.933-.931zm15.374-3.727a1.398 1.398 0 110 2.795 1.398 1.398 0 010-2.795zM4.385 4.953a.932.932 0 000 1.317l2.046 2.047L7.75 7 5.703 4.953a.932.932 0 00-1.318 0zM14.701.36a.932.932 0 01.931.932v.931h.932a.932.932 0 010 1.864h-.933l.001.932a.932.932 0 11-1.863 0l-.001-.932h-.93a.932.932 0 110-1.864h.93v-.931a.932.932 0 01.933-.932z"})})})]});var l=e=>(0,o.jsx)(r.default,{component:a,...e});},"4315bdff":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return u;}});var i=n("777fffbe"),o=n("852bbaa9"),r=n("8090cfc0"),a=n("2bb52879"),l=n("46c8afcf"),d=n("add35e7f"),s=i._(n("9db50d7e")),c=o._(n("f77140d4"));let p=(0,a.createStyles)(({token:e,css:t})=>{let{headerHeight:n,colorTextHeading:i,mobileMaxWidth:o}=e;return{logo:t`
      height: ${n}px;
      line-height: ${n}px;
      padding-inline-start: ${e.paddingXL}px;
      overflow: hidden;
      color: ${i};
      font-weight: normal;
      font-size: 20px;
      font-family: AlibabaPuHuiTi, ${e.fontFamily}, sans-serif;
      letter-spacing: -0.18px;
      white-space: nowrap;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      column-gap: ${e.marginSM}px;

      &:hover {
        color: ${i};
      }

      img {
        width: 32px;
        height: 32px;
        display: inline-block;
        vertical-align: middle;
      }

      @media only screen and (max-width: ${o}px) {
        padding-inline-start: 0;
        padding-inline-end: 0;
      }
    `,title:t`
      line-height: 32px;
    `,mobile:t`
      padding-inline-start: 0px !important;
      font-size: 16px !important;
      color: ${i} !important;
      column-gap: 4px;

      img {
        width: 24px !important;
        height: 24px !important;
      }
    `};});var u=({isZhCN:e,isMobile:t,isMini:n})=>{let{search:i}=(0,d.useLocation)(),{styles:o}=p();return(0,r.jsx)("h1",{children:(0,r.jsxs)(s.default,{to:c.getLocalizedPathname("/",e,i),className:(0,l.clsx)(o.logo,(t||n)&&o.mobile),children:[(0,r.jsx)("img",{src:"https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original",draggable:!1,alt:"logo"}),(0,r.jsx)("span",{className:o.title,children:"Ant Design X"})]})});};},"4ef87281":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=n("8090cfc0"),o=n("8997291d"),r=n("2bb52879"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(o.Global,{styles:(0,o.css)`
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          > a[aria-hidden]:first-child {
            float: left;
            width: 20px;
            padding-inline-end: ${e.paddingXXS}px;
            font-size: 0;
            line-height: inherit;
            text-align: right;
            padding-inline-end: ${e.paddingXXS}px;
            margin-inline-start: -${e.marginLG}px;

            [data-direction='rtl'] & {
              float: right;
            }

            &:hover {
              border: 0;
            }

            > .icon-link::before {
              font-size: ${e.fontSizeXL}px;
              content: '#';
              color: ${e.colorTextSecondary};
              font-family: ${e.codeFamily};
            }
          }

          &:not(:hover) > a[aria-hidden]:first-child > .icon-link {
            visibility: hidden;
          }
        }
      `});};},"5f73947c":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=n("8090cfc0"),o=n("8997291d"),r=n("2bb52879"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(o.Global,{styles:(0,o.css)`
        .preview-image-boxes {
          display: flex;
          float: right;
          clear: both;
          width: 496px;
          margin: 0 0 70px 64px;

          &-with-carousel {
            width: 420px;

            .preview-image-box img {
              padding: 0;
            }
          }

          .ant-row-rtl & {
            float: left;
            margin: 0 64px 70px 0;
          }
        }

        .preview-image-boxes + .preview-image-boxes {
          margin-top: -35px;
        }

        .preview-image-box {
          float: left;
          width: 100%;
        }

        .preview-image-box + .preview-image-box {
          margin-inline-start: ${e.marginLG}px;

          .ant-row-rtl & {
            margin-inline-end: ${e.marginLG}px;
            margin-inline-start: 0;
          }
        }

        .preview-image-wrapper {
          position: relative;
          display: inline-block;
          width: 100%;
          padding: ${e.padding}px;
          text-align: center;
          background: #f2f4f5;
          box-sizing: border-box;
        }

        .preview-image-wrapper.video {
          display: block;
          padding: 0;
          background: 0;
        }

        .preview-image-wrapper video {
          display: block;
          width: 100%;

          + svg {
            position: absolute;
            top: 0;
            inset-inline-start: 0;
          }
        }

        .preview-image-wrapper.good::after {
          position: absolute;
          bottom: 0;
          inset-inline-start: 0;
          display: block;
          width: 100%;
          height: 3px;
          background: ${e.colorPrimary};
          content: '';
        }

        .preview-image-wrapper.bad::after {
          position: absolute;
          bottom: 0;
          inset-inline-start: 0;
          display: block;
          width: 100%;
          height: 3px;
          background: ${e.colorError};
          content: '';
        }

        .preview-image-title {
          margin-top: ${e.marginMD}px;
          color: ${e.colorText};
          font-size: ${e.fontSizeSM}px;
        }

        .preview-image-description {
          margin-top: 2px;
          color: ${e.colorTextSecondary};
          font-size: ${e.fontSizeSM}px;
          line-height: 1.5;
        }

        .preview-image-description hr {
          margin: 2px 0;
          background: none;
          border: 0;
        }

        .preview-image-box img {
          box-sizing: border-box;
          max-width: 100%;
          padding: ${e.paddingSM}px;
          background: ${e.colorBgContainer};
          border-radius: ${e.borderRadius}px;
          cursor: pointer;
          transition: all ${e.motionDurationSlow};

          &.no-padding {
            padding: 0;
            background: none;
          }
        }

        .preview-image-boxes.preview-image-boxes-with-carousel img {
          padding: 0;
          box-shadow:
            0 1px 0 0 #ddd,
            0 3px 0 0 ${e.colorBgContainer},
            0 4px 0 0 #ddd,
            0 6px 0 0 ${e.colorBgContainer},
            0 7px 0 0 #ddd;
        }

        .preview-image-box img:hover {
          box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.3);
        }

        .transition-video-player,
        .motion-video-min {
          float: right;
          width: 600px;
          padding: 0 0 70px 20px;

          .preview-image-wrapper {
            padding: 0;
          }

          .ant-row-rtl & {
            float: left;
          }
        }

        .motion-video-min {
          width: 390px;
        }

        .motion-principle-wrapper {
          width: 100%;
          max-width: 900px;
          margin: ${e.marginXXL}px 0 ${e.marginLG}px;
        }

        .principle-wrapper {
          width: 100%;

          .principle {
            display: inline-block;
            box-sizing: border-box;
            width: 100%;
            min-height: 180px;
            margin-inline-end: 12.5%;
            margin-bottom: ${e.marginLG}px;
            padding: ${e.paddingLG}px;
            font-size: 24px;
            text-align: center;
            border: 1px solid #e8e8e8;
            border-radius: ${e.borderRadiusSM}px;

            &:last-child {
              margin-inline-end: 0;
            }

            h4 {
              margin: ${e.margin}px 0 ${e.marginXS}px;
            }

            p {
              font-size: ${e.fontSizeSM}px;
              line-height: 24px;
            }
          }
        }
      `});};},"636daf49":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=n("777fffbe")._(n("3e6b097d"));let o=()=>window.scrollY,r=()=>0;var a=()=>{let[e,t]=i.default.useState(),n=i.default.useCallback(e=>{let n=!1,i=window.scrollY,o=()=>{n||(requestAnimationFrame(()=>{e(),t(i>window.scrollY?"up":"down"),i=window.scrollY,n=!1;}),n=!0);};return window.addEventListener("scroll",o),()=>window.removeEventListener("scroll",o);},[]);return{scrollY:i.default.useSyncExternalStore(n,o,r),scrollYDirection:e};};},"6793501b":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return b;}});var i=n("777fffbe"),o=n("8090cfc0"),r=n("2bb52879"),a=n("46c8afcf"),l=n("4fc63de3"),d=n("add35e7f"),s=i._(n("3e6b097d")),c=i._(n("40ff87e3")),p=i._(n("9db50d7e")),u=n("f77140d4"),f=i._(n("fefdb32c"));let m="https://ant-design-x.antgroup.com",g={cn:{design:"\u8BBE\u8BA1",development:"\u7814\u53D1",components:"\u7EC4\u4EF6",playground:"\u6F14\u793A",zhUrl:"\u56FD\u5185\u955C\u50CF",blog:"\u535A\u5BA2",sdk:"X SDK",skill:"X Skill",card:"X Card",markdown:"X Markdown",resources:"\u8D44\u6E90"},en:{design:"Design",development:"Development",components:"Components",playground:"Playground",zhUrl:"",blog:"Blog",sdk:"X SDK",skill:"X Skill",card:"X Card",markdown:"X Markdown",resources:"Resources"}},h=[{path:"/docs/spec/introduce",basePath:"/docs/spec",key:"design"},{path:"/docs/react/introduce",basePath:"/docs/react",key:"development"},{path:"/components/introduce/",basePath:"/components",key:"components"},{path:"/x-markdowns/introduce",basePath:"/x-markdown",key:"markdown"},{path:"/x-sdks/introduce",basePath:"/x-sdk",key:"sdk"},{path:"/x-cards/introduce",basePath:"/x-card",key:"card"},{path:"/x-skills/introduce",basePath:"/x-skill",key:"skill"},{path:"/docs/playground/ultramodern",basePath:"/playground",key:"playground"}],x=(0,r.createStyles)(({token:e})=>({nav:(0,r.css)`
      padding: 0 ${e.paddingLG}px;
      border-radius: ${e.indexRadius}px;
      box-sizing: border-box;

      display: flex;
      gap: ${e.paddingLG}px;
      align-items: center;

      a {
        font-size: ${e.fontSizeLG}px;
        color: ${e.colorTextSecondary};
        white-space: nowrap;
      };

      a:hover {
        color: ${e.colorText};
      }
    `,pc:(0,r.css)`
      height: 48px;

      position: absolute;
      top: 50%;
      inset-inline-start: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;

      flex-direction: row;
    `,pc_rtl:(0,r.css)`
      transform: translate(50%, -50%);

      @media only screen and (max-width: ${e.mobileMaxWidth}px) {
        transform: translate(0, 0);
      }
    `,mobile:(0,r.css)`
      padding: ${e.headerHeight}px 0 !important;

      flex-direction: column;
    `,mini:(0,r.css)`
      flex-direction: row;
      width: max-content;
      padding: 0 !important;
    `,item_active:(0,r.css)`
      color: ${e.colorText} !important;
      font-weight: 500;
    `}));var b=e=>{var t,n;let{isZhCN:i,isMobile:r,isMini:b,isRTL:w,className:$}=e,{styles:v}=x(),[k]=(0,c.default)(g),{search:y,pathname:_}=(0,d.useLocation)(),[S,j]=s.default.useState(),z=(null===(n=(0,l.useFullSidebarData)()["/docs/blog"])||void 0===n?void 0:null===(t=n[0])||void 0===t?void 0:t.children)||[],M="undefined"!=typeof location?location.origin:"",T=s.default.useMemo(()=>{let e=[...h];return z.length&&e.push({path:z.sort((e,t)=>{var n,i;return(null===(n=e.frontmatter)||void 0===n?void 0:n.date)>(null===(i=t.frontmatter)||void 0===i?void 0:i.date)?-1:1;})[0].link,basePath:"/docs/blog",key:"blog"}),e;},[z.length]);s.default.useEffect(()=>{if(!T.length||!_)return;let e=T.findIndex(e=>_.includes(e.basePath));-1===e?j(void 0):j(T[e].key);},[_,T.length]);let C=e=>()=>j(e);return(0,o.jsxs)("nav",{className:(0,a.clsx)(v.nav,r||b?v.mobile:v.pc,b&&v.mini,!r&&!b&&w&&v.pc_rtl,$),children:[(0,o.jsx)(f.default,{isMobile:r}),T.map(e=>(0,o.jsx)(p.default,{to:(0,u.getLocalizedPathname)(e.path,i,y),onClick:C(e.key),className:S===e.key?v.item_active:"",children:k[e.key]},e.key)),i&&M!==m&&(0,o.jsx)("a",{href:`${m}/index-cn`,children:k.zhUrl})]});};},"6dbf8ae0":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=n("8090cfc0"),o=n("8997291d"),r=n("2bb52879");let a={1:"#fff",2:"#fafafa",3:"#f5f5f5",4:"#f0f0f0",5:"#d9d9d9",6:"#bfbfbf",7:"#8c8c8c",8:"#595959",9:"#434343",10:"#262626",11:"#1f1f1f",12:"#141414",13:"#000"};var l=()=>{let e=(0,r.useTheme)(),t=(n,i=1)=>i<=10?`
.palette-${n}-${i} {
  background: ${e[`${n}-${i}`]};
}
${t(n,i+1)}
    `:"",n=(e=1)=>e<=13?`
.palette-gray-${e} {
  background: ${a[e]};
}
${n(e+1)}
    `:"";return(0,i.jsx)(o.Global,{styles:(0,o.css)`
        .color-palettes {
          margin: 0 1%;

          &-dark {
            margin: 0;
            padding: 0 28px;
            background-color: #141414;

            .color-title {
              color: rgba(255, 255, 255, 0.85);
            }

            .color-description {
              color: rgba(255, 255, 255, 0.45);
            }

            .color-palette {
              margin: 45px 3.5% 45px 0;

              &:nth-of-type(3n) {
                margin-inline-end: 0;
              }

              .main-color-item {
                margin-inline-end: 0;

                &:hover {
                  margin-inline-end: -${e.paddingXS}px;
                }
              }
            }
          }
        }

        .color-palette {
          display: inline-block;
          width: 31%;
          margin: 45px 1%;

          &-pick {
            margin: 0 0 ${e.marginMD}px;
            font-size: ${e.fontSizeXL}px;
            text-align: center;
          }

          &-picker {
            margin: ${e.marginLG}px 0;

            &-value {
              position: relative;
              top: -3px;
              margin-inline-start: ${e.margin}px;
              font-size: ${e.fontSize}px;
              font-family: Consolas, sans-serif;
              .ant-row-rtl & {
                margin-inline-end: ${e.margin}px;
                margin-inline-start: 0;
              }
            }

            &-validation {
              position: relative;
              top: -3px;
              margin-inline-start: ${e.margin}px;
              color: ${e.colorError};
              font-size: ${e.fontSize}px;

              .ant-row-rtl & {
                margin-inline-end: ${e.margin}px;
                margin-inline-start: 0;
              }

              &-dark {
                margin-inline-start: 0;
              }
            }
          }
        }

        .main-color {
          ${t("blue")}
          ${t("purple")}
          ${t("cyan")}
          ${t("green")}
          ${t("magenta")}
          ${t("red")}
          ${t("volcano")}
          ${t("orange")}
          ${t("gold")}
          ${t("yellow")}
          ${t("lime")}
          ${t("geekblue")}
          ${n()}

  text-align: left;

          &-item {
            position: relative;
            height: 44px;
            margin-inline-end: ${e.marginXXS}px;
            padding: 0 ${e.paddingSM}px;
            font-size: ${e.fontSize}px;
            font-family: Consolas, sans-serif;
            line-height: 44px;
            cursor: pointer;
            transition: all ${e.motionDurationMid};

            &:first-child {
              border-radius: ${e.borderRadiusSM}px ${e.borderRadiusSM}px 0 0;
            }

            &:last-child {
              border-radius: 0 0 ${e.borderRadiusSM}px ${e.borderRadiusSM}px;
            }

            &:hover {
              margin-inline-end: -${e.marginXS}px;
              border-radius: 0 ${e.borderRadiusSM}px ${e.borderRadiusSM}px 0;
            }
          }

          &-item &-text {
            float: left;
            transition: all ${e.motionDurationSlow};
          }

          &-item &-value {
            position: relative;
            inset-inline-start: ${e.marginXXS}px;
            float: right;
            transform: scale(0.85);
            transform-origin: 100% 50%;
            opacity: 0;
            transition: all ${e.motionDurationSlow};
          }
        }

        .color-title {
          margin: 0 0 ${e.marginLG}px;
          color: #5c6b77;
          font-weight: 500;
          font-size: 22px;
          text-align: center;
          text-transform: capitalize;
        }

        .color-description {
          display: block;
          color: #777;
          font-weight: lighter;
          font-size: ${e.fontSize}px;
        }

        .main-color:hover {
          .main-color-value {
            inset-inline-start: 0;
            opacity: 0.7;
          }
        }

        .color-palette-horizontal {
          box-sizing: border-box;
          width: 100%;

          &-dark {
            height: 303px;
            padding: ${e.paddingXL}px ${e.paddingXL-4}px;
            background-color: #141414;

            .color-palette-picker {
              margin-bottom: 0;
            }

            .color-palette-pick {
              color: rgba(255, 255, 255, 0.65);
              text-align: left;

              &-hex {
                color: rgba(255, 255, 255, 0.65);
              }

              .ant-row-rtl & {
                direction: rtl;
                text-align: right;
              }
            }
          }

          .main-color {
            display: flex;

            &-item {
              position: relative;
              flex: 1;
              box-sizing: border-box;
              height: 86px;
              margin-inline-end: 0;
              padding: 37px 0 0;
              line-height: normal;
              text-align: center;
              border-radius: 0;

              .main-color-text {
                float: none;
              }

              &:hover {
                height: 96px;
                margin-top: -10px;
                border-radius: ${e.borderRadiusSM}px ${e.borderRadiusSM}px 0 0;
              }
            }

            &-value {
              position: absolute;
              bottom: 0;
              inset-inline-start: 0;
              width: 100%;
              text-align: center;
              transform-origin: unset;
            }

            &:hover {
              .main-color-item {
                padding-top: ${e.paddingXS}px;
              }

              .main-color-value {
                bottom: 8px;
                opacity: 0.7;
              }
            }
          }
        }
      `});};},"70bca826":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=n("8090cfc0"),o=n("8997291d"),r=n("2bb52879"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(o.Global,{styles:(0,o.css)`
        .nav-phone-icon {
          position: absolute;
          bottom: 17px;
          inset-inline-end: 30px;
          z-index: 1;
          display: none;
          width: 16px;
          height: 22px;
          cursor: pointer;
        }

        @media only screen and (max-width: ${e.screenLG}px) {
          .code-boxes-col-2-1,
          .code-boxes-col-1-1 {
            float: none;
            width: 100%;
            max-width: unset;
          }
        }

        @media only screen and (max-width: 767.99px) {
          .preview-image-boxes {
            float: none;
            width: 100%;
            margin: 0 !important;
          }

          .preview-image-box {
            width: 100%;
            margin: 10px 0;
            padding: 0;
          }

          .image-wrapper {
            display: none;
          }

          div.version {
            display: block;
            margin: 29px auto 16px;
          }

          .toc {
            display: none;
          }

          .nav-phone-icon {
            display: block;
          }

          .main {
            height: calc(100% - 86px);
          }

          .aside-container {
            float: none;
            width: auto;
            padding-bottom: 30px;
            border-right: 0;
          }

          .ant-row-rtl {
            margin-inline-end: 0;
            margin-inline-start: 0;
            padding-inline-end: ${e.padding}px;
            padding-inline-start: ${e.padding}px;

            > .markdown > * {
              width: 100% !important;
            }
          }

          .main-wrapper {
            width: 100%;
            margin: 0;
            border-radius: 0;
          }

          .prev-next-nav {
            width: calc(100% - 32px);
            margin-inline-start: ${e.margin}px;
            .ant-row-rtl & {
              margin-inline-end: ${e.margin}px;
              margin-inline-start: 64px;
            }
          }

          .drawer {
            .ant-menu-inline .ant-menu-item::after,
            .ant-menu-vertical .ant-menu-item::after {
              inset-inline-end: auto;
              inset-inline-start: 0;
            }
          }

          /** home 区块 **/
          .home-page-wrapper {
            .page {
              h2 {
                margin: 80px auto 64px;
              }
            }

            .parallax-bg {
              display: none;
            }
          }

          .banner {
            display: block;
            height: 632px;

            &-bg-wrapper {
              display: none;
            }

            .img-wrapper,
            .text-wrapper {
              display: inline-block;
              width: 100%;
              min-width: unset;
              max-width: unset;
              margin: auto;
              text-align: center;
            }

            .img-wrapper {
              position: initial;
              margin-top: ${e.marginMD}px;
              text-align: center;

              svg {
                width: 100%;
                max-width: 260px;
                height: auto;
                margin: 0 auto;
              }
            }

            .text-wrapper {
              min-height: 200px;
              margin-top: ${e.marginXL}px;
              padding: 0;

              h1 {
                display: none;
              }

              p {
                color: #314659;
                font-size: ${e.fontSize}px;
                line-height: 28px;
              }

              .banner-btns {
                display: block;
                min-width: 100%;
                white-space: nowrap;
                text-align: center;

                .banner-btn {
                  padding: 0 ${e.paddingMD}px;
                  font-size: ${e.fontSize}px;
                }
              }

              .banner-promote {
                min-width: 100%;
                margin-top: ${e.marginXL}px;

                .ant-divider {
                  display: none;
                }

                a {
                  font-size: ${e.fontSize}px;
                  white-space: nowrap;

                  img {
                    width: 20px;
                  }
                }
              }
            }
          }

          .page1 {
            min-height: 1300px;

            .ant-row {
              margin: 24px auto 64px;
              > div {
                margin-bottom: 48px;
              }
            }
          }

          .page2 {
            min-height: 840px;
            background: ${e.colorBgContainer};

            &-content {
              box-shadow: none;
            }

            &-components {
              display: none;
            }

            &-product {
              min-height: auto;
              padding: 0 ${e.padding}px;

              .product-block {
                margin-bottom: 34px;
                padding-bottom: 35px;
                border-bottom: 1px solid ${e.colorSplit};

                &:last-child {
                  margin-bottom: ${e.marginXL}px;
                  border-bottom: none;

                  .block-text-wrapper {
                    height: auto;
                  }
                }

                .block-image-wrapper {
                  height: 88px;

                  img {
                    height: 100%;
                  }
                }

                .block-text-wrapper {
                  padding-bottom: 0;
                  border-bottom: none;

                  h4 {
                    margin-bottom: ${e.marginXXS}px;
                    font-size: 18px;
                    line-height: 24px;
                  }

                  p {
                    margin-bottom: ${e.marginXS}px;
                    font-size: ${e.fontSizeSM}px;
                    line-height: 20px;
                  }

                  a {
                    line-height: 20px;
                  }

                  .components-button-wrapper {
                    margin-top: ${e.margin}px;
                    font-size: ${e.fontSizeSM}px;

                    a {
                      display: block;
                    }
                  }

                  a.more-mobile-react,
                  a.more-mobile-angular {
                    margin-top: 0;
                    color: ${e.colorLink};
                  }

                  a.more-mobile-react:hover,
                  a.more-mobile-angular:hover {
                    color: #40a9ff;
                  }
                }
              }
            }
          }

          .page3 {
            min-height: 688px;
            background-image: url('https://gw.alipayobjects.com/zos/rmsportal/qICoJIqqQRMeRGhPHBBS.svg');
            background-repeat: no-repeat;
            background-size: cover;
            .ant-row {
              margin: 0 ${e.marginXS}px;
            }

            .page3-block {
              margin-bottom: ${e.marginXL}px;
              padding: ${e.paddingLG}px;
              background: ${e.colorBgContainer};
              border-radius: ${e.borderRadiusSM}px;
              box-shadow: 0 8px 16px rgba(174, 185, 193, 0.3);

              &:nth-child(2) {
                .page3-img-wrapper img {
                  display: block;
                  width: 70%;
                  margin: auto;
                }
              }

              p {
                font-size: ${e.fontSizeSM}px;
              }

              .page3-img-wrapper {
                width: 20%;

                img {
                  width: 100%;
                }
              }

              .page3-text-wrapper {
                width: 80%;
                max-width: initial;
                margin: 0;
                padding-inline-start: ${e.padding}px;
              }
            }
          }
        }
      `});};},77401372:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=n("8090cfc0"),o=n("8997291d"),r=n("2bb52879"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(o.Global,{styles:(0,o.css)`
        /**
* prism.js default theme for JavaScript, CSS and HTML
* Based on dabblet (http://dabblet.com)
* @author Lea Verou
*/
  .code-box {
    .not(.ant-x-markdown){
        pre code {
          display: block;
          padding: ${e.padding}px ${e.paddingXL}px;
          color: ${e.colorText};
          font-size: ${e.fontSize}px;
          font-family: 'Lucida Console', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
          line-height: 2;
          white-space: pre;
          background: white;
          border: 1px solid #e9e9e9;
          border-radius: ${e.borderRadius}px;
        }

        code[class*='language-'],
        pre[class*='language-'] {
          color: ${e.colorText};
          font-family: 'Lucida Console', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
          line-height: ${e.lineHeightLG};
          direction: ltr;
          white-space: pre;
          text-align: left;
          word-wrap: normal;
          word-break: normal;
          word-spacing: normal;
          tab-size: 4;
          hyphens: none;
          background: none;
        }

        code[class*='css'] {
          direction: ltr;
        }

        pre[class*='language-'] ::selection,
        code[class*='language-'] ::selection {
          text-shadow: none;
          background: #b3d4fc;
        }

        @media print {
          code[class*='language-'],
          pre[class*='language-'] {
            text-shadow: none;
          }
        }

        /* Code blocks */
        pre[class*='language-'] {
          margin: ${e.margin}px 0;
          padding: ${e.paddingSM}px ${e.paddingMD}px;
          overflow: auto;
        }

        :not(pre) > code[class*='language-'],
        pre[class*='language-'] {
          background: ${e.colorBgLayout};
        }

        /* Inline code */
        :not(pre) > code[class*='language-'] {
          padding: 0.1em;
          white-space: normal;
          border-radius: 0.3em;
        }

        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: slategray;
        }

        .token.punctuation {
          color: #999;
        }

        .namespace {
          opacity: 0.7;
        }

        .markdown {
          .token.property,
          .token.tag,
          .token.boolean,
          .token.number,
          .token.constant,
          .token.symbol,
          .token.deleted {
            color: #f81d22;
          }

          .token.selector,
          .token.attr-name,
          .token.string,
          .token.char,
          .token.builtin,
          .token.inserted {
            color: #0b8235;
          }

          .token.operator,
          .token.entity,
          .token.url,
          .language-css .token.string,
          .style .token.string {
            color: #0b8235;
          }

          .token.atrule,
          .token.attr-value,
          .token.keyword {
            color: #008dff;
          }

          .token.function {
            color: #f81d22;
          }

          .token.regex,
          .token.important,
          .token.variable {
            color: #e90;
          }

          .token.important,
          .token.bold {
            font-weight: bold;
          }

          .token.italic {
            font-style: italic;
          }

          .token.entity {
            cursor: help;
          }
        }
    }
  }

   
      `});};},a58e0216:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return u;}});var i=n("777fffbe"),o=n("8090cfc0"),r=i._(n("f6462572")),a=i._(n("bf2579c8")),l=i._(n("1db42436")),d=n("2bb52879"),s=n("46c8afcf");let c="1.2em",p=(0,d.createStyles)(({token:e,css:t})=>{let{colorText:n,controlHeightLG:i,colorBgContainer:o,motionDurationMid:r}=e;return{btn:t`
      width: ${i}px;
      height: ${i}px;
      padding: 0 !important;
      border-radius: ${i/2}px;
      .btn-inner {
        transition: all ${r};
      }
      img {
        width: ${c};
        height: ${c};
      }
    `,innerDiv:t`
      position: relative;
      width: ${c};
      height: ${c};
    `,labelStyle:t`
      position: absolute;
      font-size: ${c};
      line-height: 1;
      border: 1px solid ${n};
      color: ${n};
    `,label1Style:t`
      inset-inline-start: -5%;
      top: 0;
      z-index: 1;
      background-color: ${n};
      color: ${o};
      transform: scale(0.7);
      transform-origin: 0 0;
    `,label2Style:t`
      inset-inline-end: -5%;
      bottom: 0;
      z-index: 0;
      transform: scale(0.5);
      transform-origin: 100% 100%;
    `};});var u=e=>{let{label1:t,label2:n,tooltip1:i,tooltip2:d,value:c,pure:u,onClick:f,...m}=e,{styles:{btn:g,innerDiv:h,labelStyle:x,label1Style:b,label2Style:w}}=p(),$=(0,o.jsx)(a.default,{type:"text",onClick:f,className:g,...(0,r.default)(m,["className"]),children:(0,o.jsxs)("div",{className:"btn-inner",children:[u&&(1===c?t:n),!u&&(0,o.jsxs)("div",{className:h,children:[(0,o.jsx)("span",{className:(0,s.clsx)(x,1===c?b:w),children:t}),(0,o.jsx)("span",{className:(0,s.clsx)(x,1===c?w:b),children:n})]})]})},"lang-button");return i||d?(0,o.jsx)(l.default,{title:1===c?i:d,children:$}):$;};},a5adfde9:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return d;}});var i=n("777fffbe"),o=n("8090cfc0"),r=i._(n("328b8c88")),a=i._(n("3e6b097d"));let l=({direction:e})=>(0,o.jsxs)("svg",{viewBox:"0 0 20 20",width:"20",height:"20",fill:"currentColor",style:{transform:`scaleX(${"ltr"===e?"1":"-1"})`},children:[(0,o.jsx)("title",{children:"Direction Icon"}),(0,o.jsx)("path",{d:"m14.6961816 11.6470802.0841184.0726198 2 2c.2662727.2662727.2904793.682876.0726198.9764816l-.0726198.0841184-2 2c-.2929.2929-.7677.2929-1.0606 0-.2662727-.2662727-.2904793-.682876-.0726198-.9764816l.0726198-.0841184.7196-.7197h-10.6893c-.41421 0-.75-.3358-.75-.75 0-.3796833.28215688-.6934889.64823019-.7431531l.10176981-.0068469h10.6893l-.7196-.7197c-.2929-.2929-.2929-.7677 0-1.0606.2662727-.2662727.682876-.2904793.9764816-.0726198zm-8.1961616-8.6470802c.30667 0 .58246.18671.69635.47146l3.00003 7.50004c.1538.3845-.0333.821-.41784.9749-.38459.1538-.82107-.0333-.9749-.4179l-.81142-2.0285h-2.98445l-.81142 2.0285c-.15383.3846-.59031.5717-.9749.4179-.38458-.1539-.57165-.5904-.41781-.9749l3-7.50004c.1139-.28475.38968-.47146.69636-.47146zm8.1961616 1.14705264.0841184.07261736 2 2c.2662727.26626364.2904793.68293223.0726198.97654222l-.0726198.08411778-2 2c-.2929.29289-.7677.29289-1.0606 0-.2662727-.26626364-.2904793-.68293223-.0726198-.97654222l.0726198-.08411778.7196-.7196675h-3.6893c-.4142 0-.75-.3357925-.75-.7500025 0-.3796925.2821653-.69348832.6482323-.74315087l.1017677-.00684663h3.6893l-.7196-.7196725c-.2929-.29289-.2929-.76777 0-1.06066.2662727-.26626364.682876-.29046942.9764816-.07261736zm-8.1961616 1.62238736-.89223 2.23056h1.78445z"})]});var d=a.default.forwardRef((e,t)=>(0,o.jsx)(r.default,{ref:t,component:()=>(0,o.jsx)(l,{direction:e.direction}),...e}));},b0054242:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return y;}});var i=n("777fffbe"),o=n("852bbaa9"),r=n("8090cfc0"),a=n("46c8afcf"),l=i._(n("e9fd738c"));n("a42556f2");var d=i._(n("bdbc82f3")),s=i._(n("2f80ec10")),c=i._(n("a50f92a3")),p=n("5fa675a9"),u=n("add35e7f"),f=n("4fc63de3"),m=o._(n("3e6b097d")),g=i._(n("40ff87e3")),h=i._(n("8dc5e1a9")),x=i._(n("318014f6")),b=i._(n("b5f4c2f0")),w=i._(n("f90be3ac"));n("e24e6256");var $=i._(n("0b508d5d")),v=i._(n("ff4be71a"));let k={cn:{title:"Ant Design X - AI\u754C\u9762\u89E3\u51B3\u65B9\u6848",description:"\u8F7B\u677E\u6253\u9020 AI \u9A71\u52A8\u7684\u754C\u9762\u3002"},en:{title:"Ant Design X - AI interface solution",description:"Craft AI-driven interfaces effortlessly."}};var y=()=>{let e=(0,u.useOutlet)(),t=(0,h.default)(),{pathname:n,search:i,hash:o}=t,[y,_]=(0,g.default)(k),S=(0,m.useRef)(null),{direction:j}=m.default.use(w.default),{loading:z}=(0,f.useSiteData)();(0,m.useLayoutEffect)(()=>{"cn"===_?l.default.locale("zh-cn"):l.default.locale("en");},[]),(0,m.useEffect)(()=>{let e=document.getElementById("nprogress-style");return S.current=setTimeout(()=>{null==e||e.remove();},0),()=>clearTimeout(S.current);},[]),(0,m.useEffect)(()=>{let e=o.replace("#","");if(e){var t;null===(t=document.getElementById(decodeURIComponent(e)))||void 0===t||t.scrollIntoView();}},[z,o]),(0,m.useEffect)(()=>{void 0!==window.ga&&window.ga("send","pageview",n+i);},[t]);let M=m.default.useMemo(()=>["","/"].some(e=>e===n)||["/index"].some(e=>n.startsWith(e))?(0,r.jsx)($.default,{title:y.title,desc:y.description,children:e}):n.startsWith("/theme-editor")?e:(0,r.jsx)(v.default,{children:e}),[n,e]);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(p.Helmet,{encodeSpecialCharacters:!1,children:[(0,r.jsx)("html",{lang:"cn"===_?"zh-CN":_,"data-direction":j,className:(0,a.clsx)({rtl:"rtl"===j})}),(0,r.jsx)("link",{sizes:"144x144",href:"https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/MGdkQ6iLuXEAAAAAQDAAAAgADtFMAQFr/original"}),(0,r.jsx)("meta",{property:"og:description",content:y.description}),(0,r.jsx)("meta",{property:"og:type",content:"website"}),(0,r.jsx)("meta",{property:"og:image",content:"https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/MGdkQ6iLuXEAAAAAQDAAAAgADtFMAQFr/original"})]}),(0,r.jsxs)(d.default,{direction:j,locale:"cn"===_?{...c.default,...s.default}:void 0,children:[(0,r.jsx)(x.default,{}),(0,r.jsx)(b.default,{}),M]})]});};},b1c92a44:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return h;}});var i=n("777fffbe"),o=n("8090cfc0"),r=i._(n("edf0c61e")),a=i._(n("912f8aba")),l=i._(n("bf2579c8")),d=i._(n("1db68e09")),s=i._(n("3800d4ef")),c=i._(n("cb596686")),p=n("4fc63de3"),u=n("3e6b097d"),f=i._(n("3352a31c")),m=i._(n("f90be3ac")),g=i._(n("3aacceed")),h=()=>{let{theme:e,updateSiteConfig:t}=(0,u.use)(m.default),n=(0,f.default)(),i=(0,u.useRef)(e.includes("dark")?"dark":"light"),h=(0,o.jsx)(a.default,{color:"blue",style:{marginTop:-1}}),x=[{id:"app.theme.switch.default",icon:(0,o.jsx)(r.default,{}),key:"light",showBadge:()=>e.includes("light")||0===e.length},{id:"app.theme.switch.dark",icon:(0,o.jsx)(c.default,{}),key:"dark",showBadge:()=>e.includes("dark")},{type:"divider"},{id:"app.theme.switch.compact",icon:(0,o.jsx)(s.default,{}),key:"compact",showBadge:()=>e.includes("compact")}].map((e,t)=>{if("divider"===e.type)return{type:"divider",key:`divider-${t}`};let{id:n,icon:i,key:r,showBadge:a}=e;return{label:(0,o.jsx)(p.FormattedMessage,{id:n}),icon:i,key:r||t,extra:a&&a()?h:null};}),b=(o,r)=>{o!==i.current&&(("dark"===o||"light"===o)&&(i.current=o,n(r,e.includes("dark"))),["light","dark"].includes(o)?t({theme:[...e.filter(e=>!["light","dark"].includes(e)),o]}):t({theme:e.includes(o)?e.filter(e=>e!==o):[...e,o]}));};return(0,o.jsx)(d.default,{menu:{items:x,onClick:({key:e,domEvent:t})=>{b(e,t);}},arrow:{pointAtCenter:!0},placement:"bottomRight",children:(0,o.jsx)(l.default,{type:"text",icon:(0,o.jsx)(g.default,{}),style:{fontSize:16,borderRadius:100,height:40,width:40}})});};},b50175c0:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return $;}});var i=n("777fffbe"),o=n("852bbaa9"),r=n("8090cfc0"),a=i._(n("5555ac7c")),l=i._(n("bf2579c8")),d=i._(n("7a821dc0")),s=n("2bb52879"),c=n("46c8afcf"),p=n("add35e7f"),u=n("4fc63de3"),f=i._(n("3e6b097d")),m=i._(n("b1c92a44")),g=i._(n("a5adfde9")),h=o._(n("f77140d4")),x=i._(n("f90be3ac")),b=i._(n("a58e0216"));let w=(0,s.createStyles)(({css:e,token:t})=>({actions:e`
      display: flex;
      align-items: center;
      margin: 0 ${t.margin}px;
    `,mobile:e`
     width: 100%;
     justify-content: center;
    `,mini:e`
      margin: 0;
    `,select:e`
      padding: 0;
      border-radius: ${t.indexRadius}px;
    `}));var $=e=>{let t=(0,p.useLocation)(),{pkg:n}=(0,u.useSiteData)(),i=(0,h.getThemeConfig)(),{direction:o,updateSiteConfig:s}=f.default.useContext(x.default),{styles:$}=w(),{pathname:v,search:k}=t,y=f.default.useMemo(()=>"rtl"===o?{direction:"ltr",textAlign:"right"}:{},[o]),_={[n.version]:n.version,...null==i?void 0:i.docVersions},S=Object.keys(_).map(e=>({value:_[e],label:e})).filter(e=>e.value),j=[["docs/react","/docs/react/introduce","/docs/react/introduce"],["components","/components/overview","/components/introduce"],["x-markdowns","/index","/x-markdowns/introduce"],["x-sdks","/index","/x-sdks/introduce"],["playground","/docs/playground/independent","/docs/playground/ultramodern"]],z=f.default.useCallback(e=>{let t=window.location.href,i=window.location.pathname,o=n.version,r=!h.isZhCN(i),a=/^2\./.test(o)&&/1x-/.test(e);for(let[t,n,o]of j)if(i.includes(t)){let t=a?n:o,i=`${e}${t}${r?"-cn":""}`;window.location.href=i;return;}let l=new URL(t.replace(window.location.origin,e));l.host.includes("antgroup")?(l.pathname=`${l.pathname.replace(/\/$/,"")}/`,window.location.href=l.toString()):window.location.href=l.href.replace(/\/$/,"");},[n.version]),M=f.default.useCallback(()=>{let e=`${window.location.protocol}//`,t=window.location.href.slice(e.length);h.isLocalStorageNameSupported()&&localStorage.setItem("locale",h.isZhCN(v)?"en-US":"zh-CN"),window.location.href=e+t.replace(window.location.pathname,h.getLocalizedPathname(v,!h.isZhCN(v),k).pathname);},[t]),T=[(0,r.jsx)(l.default,{type:"text",className:$.select,children:(0,r.jsx)(d.default,{size:"large",variant:"borderless",value:n.version,onChange:z,styles:{popup:{root:y}},popupMatchSelectWidth:!1,options:S})},"version"),(0,r.jsx)(b.default,{onClick:M,value:h.isZhCN(v)?1:2,label1:"\u4E2D",label2:"En",tooltip1:"\u4E2D\u6587 / English",tooltip2:"English / \u4E2D\u6587"},"lang"),(0,r.jsx)(b.default,{onClick:()=>{s({direction:"rtl"!==o?"rtl":"ltr"});},value:"rtl"===o?2:1,label1:(0,r.jsx)(g.default,{direction:"ltr"}),tooltip1:"LTR",label2:(0,r.jsx)(g.default,{direction:"rtl"}),tooltip2:"RTL",pure:!0,"aria-label":"RTL Switch Button"},"direction"),(0,r.jsx)(m.default,{},"theme"),(0,r.jsx)("a",{href:"https://github.com/ant-design/x",target:"_blank",rel:"noreferrer",children:(0,r.jsx)(b.default,{value:1,label1:(0,r.jsx)(a.default,{}),tooltip1:"Github",label2:null,pure:!0})},"github")];return(0,r.jsx)("div",{className:(0,c.clsx)($.actions,e.isMini&&$.mini,e.isMobile&&$.mobile,e.className),children:T});};},b5f4c2f0:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return v;}});var i=n("777fffbe"),o=n("852bbaa9"),r=n("8090cfc0"),a=i._(n("a3939bfb")),l=i._(n("f6847a99")),d=i._(n("bf2579c8")),s=i._(n("0dd6dd4a")),c=n("2bb52879"),p=n("46c8afcf"),u=n("add35e7f"),f=o._(n("3e6b097d")),m=i._(n("40ff87e3")),g=i._(n("636daf49")),h=i._(n("f90be3ac")),x=i._(n("b50175c0")),b=i._(n("4315bdff")),w=i._(n("6793501b"));let $=(0,c.createStyles)(({token:e,css:t},{alertVisible:n})=>({header:t`
      height: ${e.headerHeight}px;
      width: 100%;
      box-sizing: border-box;
      position: fixed;
      top: ${n?e.alertHeight:"0"}px;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: padding 0.2s ease-in-out, margin 0.2s ease-in-out, opacity 0.2s ease-in-out;
    `,mobile:t`
      height: 48px;
      width: calc(100% - ${2*e.paddingLG}px);
      padding: 0 ${e.paddingLG}px;
      margin: 0 ${e.paddingLG}px;
      top: ${(e.headerHeight-2*e.paddingLG)/2+(n?e.alertHeight:0)}px;
      border-radius: ${e.indexRadius}px;
    `,mini:t`
      width: min-content !important;
      margin: 0 !important;
      gap: ${e.paddingLG}px;
      inset-inline-end: 50%;
      transform: translateX(50%);
    `,hidden:t`
      opacity: 0;
    `,mini_rtl:t`
      inset-inline-start: 50%;
    `,background:t`
      position: auto;
      background: linear-gradient(117deg, #ffffff1a 17%, #ffffff0d 51%);
      backdrop-filter: blur(40px);

      pointer-events: auto;

      box-shadow: ${e.boxShadow};

      &::before, &::after {
        content: '';
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: inherit;

        position: absolute;
        top: 0;
        bottom: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;

        pointer-events: none;
        clip-path: inset(0 round ${e.indexRadius}px);
      };

      &::before {
        border: ${e.lineWidth}px solid;
        border-image: linear-gradient(100deg, #ffffff53 0%, #ffffff00 100%);
        border-image-slice: 1 0 0 1;
        filter: blur(2px);
      };

      &::after {
        padding: ${e.lineWidth}px;
        background: linear-gradient(180deg, #ffffff26 0%, #ffffff00 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
      };
    `}));var v=()=>{let[e,t]=f.default.useState(!1),[,n]=(0,m.default)(),{pathname:i}=(0,u.useLocation)(),{direction:o,isMobile:c,alertVisible:v}=f.default.useContext(h.default),{styles:k}=$({alertVisible:v}),{scrollY:y,scrollYDirection:_}=(0,g.default)(),S=1080,j=1080;"undefined"!=typeof window&&(S=document.body.clientHeight,j=window.innerHeight);let z=y>Math.min(.5*j,.25*S)&&!c,M=y>Math.min(1.5*j,.5*S)&&"down"===_,T={isZhCN:"cn"===n,isRTL:"rtl"===o,isMobile:c,isMini:z},C=null;return(0,f.useEffect)(()=>{c&&t(!1);},[i]),C=c?(0,r.jsx)(s.default,{closable:!1,footer:(0,r.jsx)(x.default,{...T}),onClose:()=>t(!1),open:e,placement:"top",style:{height:"100%"},zIndex:999,children:(0,r.jsx)(w.default,{...T})}):(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(w.default,{...T,className:(0,p.clsx)(!c&&!z&&k.background)}),y>200?null:(0,r.jsx)(x.default,{...T})]}),(0,r.jsxs)("header",{className:(0,p.clsx)(k.header,(c||z)&&k.background,(c||z)&&k.mobile,z&&k.mini,z&&"rtl"===o&&k.mini_rtl,M&&k.hidden),children:[(0,r.jsx)(b.default,{...T}),c&&(0,r.jsx)(d.default,{onClick:()=>t(e=>!e),type:"text",icon:e?(0,r.jsx)(a.default,{}):(0,r.jsx)(l.default,{})}),C]});};},b698f887:function(e,t,n){"use strict";var i=n("852bbaa9")._;n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return C;}});var o=n("777fffbe"),r=n("852bbaa9"),a=n("8090cfc0"),l=o._(n("d7640a0c")),d=o._(n("d78812de")),s=o._(n("8f07f572")),c=o._(n("fd409399")),p=o._(n("6db67643")),u=n("46c8afcf"),f=n("4fc63de3"),m=r._(n("3e6b097d")),g=o._(n("1bf48fda")),h=o._(n("8dc5e1a9")),x=o._(n("ffb4b1a2")),b=o._(n("7d7c981e")),w=o._(n("f90be3ac")),$=n("278ae112"),v=o._(n("d11c3a59"));let k=m.default.lazy(()=>Promise.all([n.ensure("vendors_4"),n.ensure("vendors_5"),n.ensure("593e22d2")]).then(n.dr(i,n.bind(n,"593e22d2")))),y=m.default.lazy(()=>Promise.all([n.ensure("vendors_6"),n.ensure("vendors_5"),n.ensure("13567842")]).then(n.dr(i,n.bind(n,"13567842")))),_=m.default.lazy(()=>Promise.all([n.ensure("vendors_5"),n.ensure("278ae112")]).then(n.dr(i,n.bind(n,"278ae112")))),S=m.default.lazy(()=>Promise.all([n.ensure("vendors_6"),n.ensure("vendors_4"),n.ensure("vendors_5"),n.ensure("827ceca1")]).then(n.dr(i,n.bind(n,"827ceca1")))),j=m.default.lazy(()=>Promise.all([n.ensure("vendors_6"),n.ensure("vendors_4"),n.ensure("vendors_5"),n.ensure("ff0bf651")]).then(n.dr(i,n.bind(n,"ff0bf651")))),z=m.default.lazy(()=>Promise.all([n.ensure("vendors_6"),n.ensure("common"),n.ensure("vendors_5"),n.ensure("8f4ea15e")]).then(n.dr(i,n.bind(n,"8f4ea15e")))),M=m.default.lazy(()=>Promise.all([n.ensure("70a92f5c")]).then(n.dr(i,n.bind(n,"70a92f5c")))),T=({num:e=6})=>Array.from({length:e}).map((e,t)=>(0,a.jsx)(s.default.Avatar,{size:"small",active:!0,style:{marginInlineStart:0===t?0:-8}},t));var C=({children:e})=>{var t,n,i;let o=(0,f.useRouteMeta)(),{pathname:r,hash:s}=(0,h.default)(),{direction:C}=m.default.use(w.default),{styles:L}=(0,$.useStyle)(),[A,X]=(0,g.default)(!1),[B,R]=(0,m.useState)("tsx"),D=(0,m.useMemo)(()=>{var e;return(null===(e=o.toc)||void 0===e?void 0:e.filter(e=>e._debug_demo).map(e=>e.id))||[];},[o]),G=D.includes(s.slice(1));(0,m.useLayoutEffect)(()=>{X(G);},[]);let N=(0,m.useMemo)(()=>({showDebug:A,setShowDebug:X,codeType:B,setCodeType:R}),[A,B,D]),E="rtl"===C;return(0,a.jsx)(b.default,{value:N,children:(0,a.jsxs)(l.default,{xxl:20,xl:19,lg:18,md:18,sm:24,xs:24,children:[(0,a.jsx)(v.default,{fallback:null,children:(0,a.jsx)(_,{showDebug:A,debugDemos:D})}),(0,a.jsxs)("article",{className:(0,u.clsx)(L.articleWrapper,{rtl:E}),children:[(null===(t=o.frontmatter)||void 0===t?void 0:t.title)?(0,a.jsx)(d.default,{justify:"space-between",children:(0,a.jsx)(p.default.Title,{style:{fontSize:32,position:"relative"},children:(0,a.jsxs)(c.default,{children:[(0,a.jsx)("span",{children:null===(n=o.frontmatter)||void 0===n?void 0:n.title}),(0,a.jsx)("span",{children:null===(i=o.frontmatter)||void 0===i?void 0:i.subtitle}),!r.startsWith("/components/overview")&&(0,a.jsx)(v.default,{fallback:null,children:(0,a.jsx)(M,{title:(0,a.jsx)(f.FormattedMessage,{id:"app.content.edit-page"}),filename:o.frontmatter.filename})})]})})}):null,(0,a.jsx)(v.default,{fallback:null,children:(0,a.jsx)(S,{})}),!o.frontmatter.__autoDescription&&o.frontmatter.description,"Components"===o.frontmatter.category&&"false"!==String(o.frontmatter.showImport)&&(0,a.jsx)(x.default,{source:!0,packageName:o.frontmatter.packageName,component:o.frontmatter.componentName??o.frontmatter.title,filename:o.frontmatter.filename,version:o.frontmatter.tag,designUrl:o.frontmatter.designUrl}),(0,a.jsx)("div",{style:{minHeight:"calc(100vh - 64px)"},children:e}),(0,a.jsx)(v.default,{fallback:null,children:(0,a.jsx)(y,{zhihuLink:o.frontmatter.zhihu_url,yuqueLink:o.frontmatter.yuque_url,juejinLink:o.frontmatter.juejin_url})}),(0,a.jsx)("div",{style:{marginTop:120},children:(0,a.jsx)(v.default,{fallback:(0,a.jsx)(T,{}),children:(0,a.jsx)(k,{filename:`packages/x/${o.frontmatter.filename}`})})})]}),(0,a.jsx)(v.default,{fallback:null,children:(0,a.jsx)(z,{rtl:E})}),(0,a.jsx)(v.default,{fallback:null,children:(0,a.jsx)(j,{})})]})});};},bcd2b2ef:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=n("8090cfc0"),o=n("7ae894d0"),r=n("8997291d"),a=n("2bb52879"),l=()=>{let e=(0,a.useTheme)(),{antCls:t}=e,n=e.colorPrimary;return(0,i.jsx)(r.Global,{styles:(0,r.css)`
        .markdown {
          color: ${e.colorText};
          font-size: ${e.fontSize}px;
          line-height: 2;
        }

        .highlight {
          line-height: 1.5;
        }

        .markdown img {
          max-width: calc(100% - 32px);
          max-height: 100%;
        }

        .markdown > a > img,
        .markdown > img {
          display: block;
          margin: 0 auto;
        }

        .markdown p > img,
        .markdown li > img {
          margin: 34px auto;
          box-shadow: 0 8px 20px rgba(143, 168, 191, 0.35);
          display: block;
        }

        .markdown p > img.markdown-inline-image {
          margin: 0;
          box-shadow: none;
        }

        .markdown h1 {
          margin-top: ${e.marginXS}px;
          margin-bottom: ${e.marginMD}px;
          color: ${e.colorTextHeading};
          font-weight: 500;
          font-size: 30px;
          font-family: Avenir, ${e.fontFamily}, sans-serif;
          line-height: 38px;

          .subtitle {
            margin-inline-start: ${e.marginSM}px;
          }
        }

        .markdown h2 {
          font-size: 24px;
          line-height: 32px;
        }

        .markdown h2,
        .markdown h3,
        .markdown h4,
        .markdown h5,
        .markdown h6 {
          clear: both;
          margin: 1.6em 0 0.6em;
          color: ${e.colorTextHeading};
          font-weight: 500;
          font-family: Avenir, ${e.fontFamily}, sans-serif;
        }

        .markdown h3 {
          font-size: 18px;
        }

        .markdown h4 {
          font-size: ${e.fontSizeLG}px;
        }

        .markdown h5 {
          font-size: ${e.fontSize}px;
        }

        .markdown h6 {
          font-size: ${e.fontSizeSM}px;
        }

        .markdown hr {
          clear: both;
          height: 1px;
          margin: ${e.marginLG}px 0;
          background: ${e.colorSplit};
          border: 0;
        }

        .markdown p,
        .markdown pre {
          margin: 1em 0;

          ${t}-row-rtl & {
            direction: rtl;
            text-align: right;
          }
        }

        .markdown ul > li,
        .markdown ol > li {
          padding-inline-start: ${e.paddingXXS}px;
          margin-inline-start: ${e.marginMD}px;
          > p {
            margin: 0.2em 0;
          }
          &:empty {
            display: none;
          }
        }

        .markdown ul > li {
          list-style-type: circle;
        }

        .markdown ol > li {
          list-style-type: decimal;
        }

        .markdown code {
          margin: 0 1px;
          padding: 0.2em 0.4em;
          font-size: 0.9em;
          background: ${e.siteMarkdownCodeBg};
          border: 1px solid ${e.colorSplit};
          border-radius: ${e.borderRadiusSM}px;
        }

        .markdown pre {
          font-family: ${e.codeFamily};
          background: ${e.siteMarkdownCodeBg};
          border-radius: ${e.borderRadius}px;
        }

        .markdown pre code {
          margin: 0;
          padding: 0;
          overflow: auto;
          color: ${e.colorText};
          font-size: ${Math.max(e.fontSize-1,12)}px;
          direction: ltr;
          text-align: left;
          background-color: ${e.colorBgLayout};
          border: none;
        }

        .markdown strong,
        .markdown b {
          font-weight: 500;
        }

        .markdown .dumi-default-source-code {
          margin: 1em 0;
          background-color: ${e.siteMarkdownCodeBg};
          border-radius: ${e.borderRadius}px;
          > pre.prism-code {
            scrollbar-width: thin;
            scrollbar-gutter: stable;
            padding: ${e.paddingSM}px ${e.paddingMD}px;
            font-size: ${e.fontSize}px;
            line-height: 2;
          }
        }
        .pic-plus {
          & > * {
            display: inline-block !important;
            vertical-align: middle;
          }
          span {
            margin: 0 ${e.marginMD}px;
            color: #aaa;
            font-size: 30px;
            user-select: none;
          }
        }

        .markdown table td > a:not(:last-child) {
          margin-inline-end: 0 !important;

          &::after {
            position: relative !important;
          }
        }

        .markdown blockquote {
          margin: 1em 0;
          padding-inline-start: 0.8em;
          color: ${e.colorTextSecondary};
          font-size: 90%;
          border-left: 4px solid ${e.colorSplit};

          .rtl & {
            padding-inline-end: 0.8em;
            padding-inline-start: 0;
            border-right: 4px solid ${e.colorSplit};
            border-left: none;
          }
        }

        .markdown blockquote p {
          margin: 0;
        }

        .markdown .anchor {
          margin-inline-start: ${e.marginXS}px;
          opacity: 0;
          transition: opacity ${e.motionDurationSlow};

          .rtl & {
            margin-inline-end: ${e.marginXS}px;
            margin-inline-start: 0;
          }
        }

        .markdown .waiting {
          color: #ccc;
          cursor: not-allowed;
        }

        .markdown a.edit-button {
          display: inline-block;
          margin-inline-start: ${e.marginXS}px;
          text-decoration: none;

          .rtl & {
            margin-inline-end: ${e.marginXS}px;
            margin-inline-start: 0;
            transform: rotateY(180deg);
          }

          ${t}icon {
            display: block;
            color: ${e.colorTextSecondary};
            font-size: ${e.fontSizeLG}px;
            transition: all ${e.motionDurationSlow};

            &:hover {
              color: ${e.colorText};
            }
          }
        }

        .markdown h1:hover .anchor,
        .markdown h2:hover .anchor,
        .markdown h3:hover .anchor,
        .markdown h4:hover .anchor,
        .markdown h5:hover .anchor,
        .markdown h6:hover .anchor {
          display: inline-block;
          opacity: 1;
        }

        .markdown > br,
        .markdown > p > br {
          clear: both;
        }

        .markdown .dumi-default-table {
          &-content {
            scrollbar-width: thin;
            scrollbar-gutter: stable;
          }
          table {
            margin: 0;
            overflow-x: auto;
            overflow-y: hidden;
            direction: ltr;
            empty-cells: show;
            border: 1px solid ${e.colorSplit};
            border-collapse: collapse;
            border-spacing: 0;

            th,
            td {
              padding: ${e.paddingSM}px ${e.paddingLG}px;
              text-align: left;
              border: 1px solid ${e.colorSplit};

              &:first-child {
                border-left: 1px solid ${e.colorSplit};
              }

              &:last-child {
                border-right: 1px solid ${e.colorSplit};
              }

              img {
                max-width: unset;
              }
            }

            th {
              color: #5c6b77;
              font-weight: 500;
              white-space: nowrap;
              background: rgba(0, 0, 0, 0.02);
              border-width: 1px 1px 2px;
            }

            tbody tr {
              transition: all ${e.motionDurationSlow};

              &:hover {
                background: rgba(60, 90, 100, 0.04);
              }
            }
          }

          table.component-api-table {
            margin: 0;
            overflow-x: auto;
            overflow-y: hidden;
            font-size: ${Math.max(e.fontSize-1,12)}px;
            font-family: ${e.codeFamily};
            line-height: ${e.lineHeight};
            border: 1px solid ${e.colorSplit};
            border-width: 0 1px;

            th {
              border-width: 1px 0 2px;
            }

            td {
              border-width: 1px 0;
              &:first-child {
                width: 18%;
                min-width: 58px;
                color: ${e.colorText};
                font-weight: ${e.fontWeightStrong};
                white-space: nowrap;
              }

              &:nth-child(2) {
                min-width: 160px;
              }

              &:nth-child(3) {
                width: 22%;
                color: ${e.magenta7};
                font-size: ${Math.max(e.fontSize-1,12)}px;
              }

              &:nth-child(4) {
                width: 15%;
                font-size: ${Math.max(e.fontSize-1,12)}px;
              }

              &:nth-child(5) {
                width: 8%;
                font-size: ${Math.max(e.fontSize-1,12)}px;
              }

              &:nth-last-child(3):first-child {
                width: 38%;
              }

              &:nth-last-child(3):first-child ~ td:nth-last-child(2) {
                width: 70%;
              }
            }
          }

            /*
              Api 表中某些属性用 del 标记，表示已废弃（但仍期望给开发者一个过渡期)用 css 标记出来。仅此而已。
              有更多看法？移步讨论区: https://github.com/ant-design/ant-design/discussions/51298
            */
            tr:has(td:first-child > del) {
              color: ${e.colorWarning} !important;
              background-color: ${e.colorWarningBg} !important;
              display: var(--antd-site-api-deprecated-display, none);

              del {
                color: ${e.colorWarning};
              }

              &:hover del {
                text-decoration: none;
              }
            }
        }

        .grid-demo,
        [id^='grid-demo-'] {
          ${t}-row > div,
            .code-box-demo ${t}-row > div {
            min-height: 30px;
            margin-top: ${e.marginXS}px;
            margin-bottom: ${e.marginXS}px;
            color: #fff;
            text-align: center;
            border-radius: 0;
          }

          .code-box-demo ${t}-row > div:not(.gutter-row) {
            padding: ${e.padding}px 0;
            background: ${n};

            &:nth-child(2n + 1) {
              background: ${new o.FastColor(n).setA(.75).toHexString()};
            }
          }

          ${t}-row .demo-col,
            .code-box-demo ${t}-row .demo-col {
            margin-top: 0;
            margin-bottom: 0;
            padding: 30px 0;
            color: ${e.colorWhite};
            font-size: 18px;
            text-align: center;
            border: none;
          }

          ${t}-row .demo-col-1 {
            background: ${new o.FastColor(n).setA(.75).toHexString()};
          }

          ${t}-row .demo-col-2,
            .code-box-demo ${t}-row .demo-col-2 {
            background: ${new o.FastColor(n).setA(.75).toHexString()};
          }

          ${t}-row .demo-col-3,
            .code-box-demo ${t}-row .demo-col-3 {
            color: #999;
            background: rgba(255, 255, 255, 0.2);
          }

          ${t}-row .demo-col-4,
            .code-box-demo ${t}-row .demo-col-4 {
            background: ${new o.FastColor(n).setA(.6).toHexString()};
          }

          ${t}-row .demo-col-5,
            .code-box-demo ${t}-row .demo-col-5 {
            color: #999;
            background: rgba(255, 255, 255, 0.2);
          }

          .code-box-demo .height-100 {
            height: 100px;
            line-height: 100px;
          }

          .code-box-demo .height-50 {
            height: 50px;
            line-height: 50px;
          }

          .code-box-demo .height-120 {
            height: 120px;
            line-height: 120px;
          }

          .code-box-demo .height-80 {
            height: 80px;
            line-height: 80px;
          }
        }

        [id='grid-demo-playground'],
        [id='grid-demo-gutter'] {
          > .code-box-demo ${t}-row > div {
            margin-top: 0;
            margin-bottom: 0;
          }
        }
      `});};},cdcc8b05:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return i.default;}});var i=n("777fffbe")._(n("238b80c9"));},d11c3a59:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return d;}});var i=n("777fffbe"),o=n("8090cfc0"),r=i._(n("8f07f572")),a=n("3e6b097d"),l=n("37386a2f"),d=({children:e,fallback:t=(0,o.jsx)(r.default.Input,{active:!0,size:"small"}),delay:n=200})=>(0,o.jsx)(l.InView,{triggerOnce:!0,delay:n,children:({inView:n,ref:i})=>(0,o.jsx)("div",{ref:i,children:(0,o.jsx)(a.Suspense,{fallback:t,children:n?e:(0,o.jsx)("span",{})})})});},de0c83b4:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=n("8090cfc0"),o=n("8997291d"),r=n("2bb52879"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(o.Global,{styles:(0,o.css)`
        .design-inline-cards {
          display: flex;
          margin: 0 -${e.marginMD}px;
        }
        .design-inline-cards > * {
          flex: 10%;
          margin: 0 ${e.marginMD}px;
        }
        .design-inline-cards img {
          width: 100%;
          max-width: 100%;
        }
        .design-inline-cards h4 {
          margin-bottom: 0;
        }
      `});};},e24e6256:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0});},e6eeb335:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=n("8090cfc0"),o=n("8997291d"),r=n("2bb52879"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(o.Global,{styles:(0,o.css)`
        #nprogress {
          .bar {
            background: ${e.colorPrimary};
          }

          .peg {
            box-shadow:
              0 0 10px ${e.colorPrimary},
              0 0 5px ${e.colorPrimary};
          }

          .spinner-icon {
            border-top-color: ${e.colorPrimary};
            border-left-color: ${e.colorPrimary};
          }
        }
      `});};},eadc61b0:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return h;}});var i=n("777fffbe"),o=n("8090cfc0"),r=i._(n("bdbc82f3")),a=i._(n("a4a8b0da")),l=i._(n("d7640a0c")),d=i._(n("b1180629")),s=n("2bb52879"),c=n("4fc63de3"),p=i._(n("3e6b097d")),u=i._(n("8dc5e1a9")),f=i._(n("8a377d6c")),m=i._(n("f90be3ac"));let g=(0,s.createStyles)(({token:e,css:t},{alertVisible:n})=>{let{antCls:i,fontFamily:o,colorSplit:r,marginXXL:a,paddingXXS:l}=e;return{asideContainer:t`
      min-height: 100%;
      padding-bottom: ${a}px !important;
      font-family: Avenir, ${o}, sans-serif;
      padding: 0 ${l}px;

      &${i}-menu-inline {
        ${i}-menu-submenu-title h4,
        > ${i}-menu-item,
        ${i}-menu-item a {
          overflow: hidden;
          font-size: ${e.fontSize}px;
          text-overflow: ellipsis;
        }

        > ${i}-menu-item-group > ${i}-menu-item-group-title {
          margin-top: ${e.margin}px;
          margin-bottom: ${e.margin}px;
          font-size: ${e.fontSize}px;

          &::after {
            position: relative;
            top: 12px;
            display: block;
            width: calc(100% - 20px);
            height: 1px;
            background: ${r};
            content: '';
          }
        }

        > ${i}-menu-item,
          > ${i}-menu-submenu
          > ${i}-menu-submenu-title,
          > ${i}-menu-item-group
          > ${i}-menu-item-group-title,
          > ${i}-menu-item-group
          > ${i}-menu-item-group-list
          > ${i}-menu-item,
          &${i}-menu-inline
          > ${i}-menu-item-group
          > ${i}-menu-item-group-list
          > ${i}-menu-item {
          padding-inline: 36px 12px !important;
        }

        // Nest Category > Type > Article
        &${i}-menu-inline {
          ${i}-menu-item-group-title {
            margin-inline-start: ${e.marginXXS}px;
            padding-inline-start: 60px;

            ${i}-row-rtl & {
              padding-inline-end: 60px;
              padding-inline-start: ${e.padding}px;
            }
          }

          ${i}-menu-item-group-list > ${i}-menu-item {
            padding-inline-start: 80px !important;

            ${i}-row-rtl & {
              padding-inline-end: 80px !important;
              padding-inline-start: ${e.padding}px !important;
            }
          }
        }

        ${i}-menu-item-group:first-child {
          ${i}-menu-item-group-title {
            margin-top: 0;
          }
        }
      }

      a[disabled] {
        color: #ccc;
      }
    `,mainMenu:t`
      z-index: 1;
      position: sticky;
      top: ${e.headerHeight+(n?e.alertHeight:0)}px;
      width: 100%;
      max-height: calc(100vh - ${e.headerHeight+(n?e.alertHeight:0)}px);
      overflow: hidden;
      scrollbar-width: thin;
      scrollbar-gutter: stable;

      &:hover {
        overflow-y: auto;
      }
    `};});var h=()=>{let e=(0,c.useSidebarData)(),{isMobile:t,theme:n,alertVisible:i}=p.default.use(m.default),{styles:h}=g({alertVisible:i}),{pathname:x}=(0,u.default)(),[b,w]=(0,f.default)(),$=n.includes("dark"),{colorBgContainer:v}=(0,s.useTheme)(),k=(0,o.jsx)(r.default,{theme:{components:{Menu:{itemBg:v,darkItemBg:v}}},children:(0,o.jsx)(d.default,{items:b,inlineIndent:30,className:h.asideContainer,mode:"inline",theme:$?"dark":"light",selectedKeys:[w],defaultOpenKeys:null==e?void 0:e.map(({title:e})=>e).filter(Boolean)},x)});return t?(0,o.jsx)(a.default,{children:k},"Mobile-menu"):(0,o.jsx)(l.default,{xxl:4,xl:5,lg:6,md:6,sm:24,xs:24,className:h.mainMenu,children:k});};},fa5f6340:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=n("8090cfc0"),o=n("8997291d"),r=n("2bb52879"),a=()=>{let e=(0,r.useTheme)(),{antCls:t,iconCls:n}=e;return(0,i.jsx)(o.Global,{styles:(0,o.css)`
        .code-boxes-col-1-1 {
          width: 100%;
        }

        .code-boxes-col-2-1 {
          display: inline-block;
          vertical-align: top;
        }

        
        .code-box{
          position: relative;
          display: inline-block;
          width: calc(100% - ${2*e.lineWidth}px);
          margin: 0 0 ${e.margin}px;
          background-color: ${e.colorBgContainer};
          border: 1px solid ${e.colorSplit};
          border-radius: ${e.borderRadiusLG}px;
          transition: all ${e.motionDurationMid};

          &.code-box-simplify {
            border-radius: 0;
            margin-bottom: 0;

            .code-box-demo {
              padding: 0;
              border-bottom: 0;
            }
          }

          .code-box-title {
            &,
            a {
              color: ${e.colorText} !important;
              background: ${e.colorBgContainer};
            }
          }

          .code-box-demo {
            background-color: ${e.colorBgContainer};
            border-radius: ${e.borderRadiusLG}px ${e.borderRadiusLG}px 0 0;
            > .demo {
              overflow: auto;
            }
          }

          .markdown {
            pre {
              margin: 0.5em 0;
              padding: 6px 12px;
            }
            pre code {
              margin: 0;
              background: #f5f5f5;
            }
          }
          

          &:target {
            border: 1px solid ${e.colorPrimary};
          }

          &-title {
            position: absolute;
            top: -14px;
            padding: 1px 8px;
            color: #777;
            background: ${e.colorBgContainer};
            border-radius: ${e.borderRadius}px ${e.borderRadius}px 0 0;
            transition: background-color 0.4s;
            margin-inline-start: ${e.margin}px;

            a,
            a:hover {
              color: ${e.colorText};
              font-weight: 500;
              font-size: ${e.fontSize}px;
            }
          }

          &-description {
            padding: 18px 24px 12px;
          }

          a.edit-button {
            position: absolute;
            top: 7px;
            inset-inline-end: -16px;
            font-size: ${e.fontSizeSM}px;
            text-decoration: none;
            background: inherit;
            transform: scale(0.9);
            padding-inline-end: ${e.paddingXXS}px;

            ${n} {
              color: ${e.colorTextSecondary};
              transition: all ${e.motionDurationSlow};

              &:hover {
                color: ${e.colorText};
              }
            }

            ${t}-row${t}-row-rtl & {
              inset-inline-end: auto;
              inset-inline-start: -22px;
            }
          }

          &-demo {
            padding: 42px 24px 50px;
            color: ${e.colorText};
            border-bottom: 1px solid ${e.colorSplit};
          }

          iframe {
            width: 100%;
            border: 0;
          }

          &-meta {
            &.markdown {
              position: relative;
              width: 100%;
              font-size: ${e.fontSize}px;
              border-radius: 0 0 ${e.borderRadius}px ${e.borderRadius}px;
              transition: background-color 0.4s;
            }

            blockquote {
              line-height: 1.5;
            }

            h4,
            section& p {
              margin: 0;
            }

            > p {
              width: 100%;
              margin: 0.5em 0;
              font-size: ${e.fontSizeSM}px;
              word-break: break-word;
              padding-inline-end: 25px;
            }
          }

          &.expand &-meta {
            border-bottom: 1px dashed ${e.colorSplit};
            border-radius: 0;
          }

          .code-expand-icon {
            position: relative;
            width: 16px;
            height: 16px;
            cursor: pointer;
          }

          .code-expand-icon-show,
          .code-expand-icon-hide {
            position: absolute;
            top: 0;
            inset-inline-start: 0;
            width: 100%;
            max-width: 100%;
            margin: 0;
            box-shadow: none;
            transition: all 0.4s;
            user-select: none;

            ${t}-row-rtl & {
              inset-inline-end: 0;
              inset-inline-start: auto;
            }
          }

          .code-expand-icon-show {
            opacity: 0.55;
            pointer-events: auto;

            &:hover {
              opacity: 1;
            }
          }

          .code-expand-icon${t}-tooltip-open .code-expand-icon-show {
            opacity: 1;
          }

          .code-expand-icon-hide {
            opacity: 0;
            pointer-events: none;
          }

          .highlight-wrapper {
            display: none;
            border-radius: 0 0 ${e.borderRadius}px ${e.borderRadius}px;

            &-expand {
              display: block;
            }
          }

          .highlight {
            position: relative;

            pre {
              margin: 0;
              padding: 0;
              background: ${e.colorBgContainer};
            }

            &:not(:first-child) {
              border-top: 1px dashed ${e.colorSplit};
            }
          }

          &-actions {
            display: flex;
            justify-content: center;
            padding: ${e.paddingSM}px 0;
            border-top: 1px dashed ${e.colorSplit};
            opacity: 0.7;
            transition: opacity ${e.motionDurationSlow};

            &:hover {
              opacity: 1;
            }
          }

          &-actions &-code-action {
            position: relative;
            display: flex;
            align-items: center;
            width: 16px;
            height: 16px;
            color: ${e.colorTextSecondary};
            cursor: pointer;
            transition: all 0.24s;

            &:hover {
              color: ${e.colorText};
            }

            ${n} {
              display: block;
            }
          }

          &-code-copy {
            width: 14px;
            height: 14px;
            font-size: ${e.fontSize}px;
            text-align: center;
            background: ${e.colorBgContainer};
            cursor: pointer;
            transition: transform 0.24s;

            &${n}-check {
              color: ${e.green6} !important;
              font-weight: bold;
            }
          }

          &-codepen {
            width: 14px;
            height: 14px;
            overflow: hidden;
            border: 0;
            cursor: pointer;
          }

           &-codeblock {
            width: 16px;
            height: 16px;
            overflow: hidden;
            border: 0;
            cursor: pointer;
            max-width: 100% !important;
          }

          &-codesandbox {
            width: 16px;
            height: 16px;
            overflow: hidden;
            border: 0;
            cursor: pointer;

            &:hover {
              opacity: 1;
            }
          }

          .highlight-wrapper:hover &-code-copy,
          .highlight-wrapper:hover &-codepen,
          .highlight-wrapper:hover &-codesandbox,
          .highlight-wrapper:hover &-riddle {
            opacity: 1;
          }

          pre {
          .not{.ant-x-markdown}{
           width: auto;
            margin: 0;

            code {
              background: ${e.colorBgContainer};
              border: none;
              box-shadow: unset;
              padding: ${e.paddingSM}px ${e.padding}px;
              font-size: ${e.fontSize}px;
            }
          }
           
          }

          &-debug {
            border-color: ${e.purple3};
          }

          &-debug &-title a {
            color: ${e.purple6};
          }
        }

        .demo-wrapper {
          position: relative;
        }

        .all-code-box-controls {
          position: absolute;
          top: -32px;
          inset-inline-end: 0;
          display: flex;
          align-items: center;
          column-gap: ${e.marginXS}px;
        }

        ${t}-btn {
          &.icon-enabled {
            background-color: ${e.colorFillSecondary};
            opacity: 1;
            ${n} {
              color: ${e.colorTextBase};
              font-weight: bold;
            }
          }
        }

        ${t}-row-rtl {
          #tooltip-demo-placement,
          #popover-demo-placement,
          #popconfirm-demo-placement {
            .code-box-demo {
              direction: ltr;
            }
          }
        }
      `});};},fefdb32c:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return f;}});var i=n("777fffbe"),o=n("852bbaa9"),r=n("8090cfc0"),a=i._(n("b6c77670")),l=n("2bb52879"),d=n("46c8afcf"),s=n("add35e7f"),c=i._(n("a8ae155a")),p=o._(n("3e6b097d"));let u=(0,l.createStyles)(({token:e,css:t})=>({container:t`
    display: flex;
    align-items: center;
    margin-inline-end: -10px;
  `,iconBtn:t`
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${e.borderRadiusLG}px;
    color: ${e.colorTextSecondary};
    font-size: 15px;
    flex-shrink: 0;
    transition:
      color 0.2s,
      background 0.2s,
      opacity 0.25s,
      width 0.3s;

    &:hover {
      color: ${e.colorText};
      background: rgba(255, 255, 255, 0.12);
    }
  `,iconBtnVisible:t`
    width: 32px;
    height: 32px;
    opacity: 1;
    pointer-events: auto;
  `,iconBtnHidden:t`
    display: none !important;
  `,searchWrapper:t`
    width: 0;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    flex-shrink: 0;
    transition:
      width 0.3s ease,
      opacity 0.3s ease;

    .dumi-default-search-shortcut {
      display: none;
    }

    .dumi-default-search-bar:not(:last-child) {
      margin-inline-end: 0;
    }

    .dumi-default-search-bar-input {
      width: 100%;
      height: 32px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      color: ${e.colorText};
      font-size: 13px;
      padding-inline-end: 12px;
      transition:
        background 0.2s,
        border-color 0.2s,
        box-shadow 0.2s;

      &::placeholder {
        color: ${e.colorTextTertiary};
      }

      &:focus {
        background: ${e.colorBgElevated};
        border-color: rgba(255, 255, 255, 0.45);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
      }
    }

    .dumi-default-search-bar-svg {
      fill: ${e.colorTextTertiary};
    }

    .dumi-default-search-popover {
      inset-inline-start: 0;
      inset-inline-end: auto;

      &::before {
        inset-inline-start: 92px;
        inset-inline-end: auto;
      }
    }
  `,searchWrapperExpanded:t`
    width: 200px !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
  `}));var f=({isMobile:e})=>{let{styles:t}=u(),n=p.useRef(null),i=p.useRef(null),[o,l]=p.useState(!1),{pathname:f}=(0,s.useLocation)();return(p.useEffect(()=>{l(!1);},[f]),p.useEffect(()=>{o&&!e&&requestAnimationFrame(()=>{var e;let t=null===(e=n.current)||void 0===e?void 0:e.querySelector("input");null==t||t.focus();});},[o,e]),p.useEffect(()=>()=>{i.current&&clearTimeout(i.current);},[]),e)?null:(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("div",{className:t.container,children:[(0,r.jsx)("button",{type:"button","aria-label":"Search","aria-hidden":o,className:(0,d.clsx)(t.iconBtn,o?t.iconBtnHidden:t.iconBtnVisible),onClick:()=>l(!0),children:(0,r.jsx)(a.default,{})}),(0,r.jsx)("div",{ref:n,"aria-hidden":!o,className:(0,d.clsx)(t.searchWrapper,o&&t.searchWrapperExpanded),onBlur:()=>{i.current=window.setTimeout(()=>{n.current&&!n.current.contains(document.activeElement)&&l(!1);},150);},children:(0,r.jsx)(c.default,{})})]})});};},ff4be71a:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return u;}});var i=n("777fffbe"),o=n("8090cfc0"),r=n("2bb52879"),a=i._(n("3e6b097d")),l=i._(n("8ff5a1c9")),d=i._(n("033c7941")),s=i._(n("b698f887")),c=i._(n("eadc61b0"));let p=(0,r.createStyles)(({css:e,token:t},{alertVisible:n})=>({main:e`
    display: flex;
    margin-top: ${t.headerHeight+(n?40:0)}px;
`}));var u=({children:e})=>{let{alertVisible:t}=a.default.use(l.default),{styles:n}=p({alertVisible:t});return(0,o.jsxs)("main",{className:n.main,children:[(0,o.jsx)(d.default,{}),(0,o.jsx)(c.default,{}),(0,o.jsx)(s.default,{children:e})]});};}}]);