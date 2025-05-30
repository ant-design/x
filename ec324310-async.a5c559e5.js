(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["ec324310"],{"00e00f20":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return s;}});var i=o("777fffbe"),n=o("8090cfc0"),r=i._(o("3e6b097d")),a=o("8997291d"),l=o("0ba2ace3"),d=o("dd4e3a8b"),s=()=>{let{anchorTop:e}=(0,l.useTheme)();return r.default.useInsertionEffect(()=>{(0,d.updateCSS)("@layer global, antd;","site-global",{prepend:!0});},[]),(0,n.jsx)(a.Global,{styles:(0,a.css)`
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
      `});};},"119f4557":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=o("8090cfc0"),n=o("8997291d"),r=o("0ba2ace3"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(n.Global,{styles:(0,n.css)`
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
      `});};},"19325a69":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=o("8090cfc0"),n=o("8997291d"),r=o("0ba2ace3");let a={1:"#fff",2:"#fafafa",3:"#f5f5f5",4:"#f0f0f0",5:"#d9d9d9",6:"#bfbfbf",7:"#8c8c8c",8:"#595959",9:"#434343",10:"#262626",11:"#1f1f1f",12:"#141414",13:"#000"};var l=()=>{let e=(0,r.useTheme)(),t=(o,i=1)=>i<=10?`
.palette-${o}-${i} {
  background: ${e[`${o}-${i}`]};
}
${t(o,i+1)}
    `:"",o=(e=1)=>e<=13?`
.palette-gray-${e} {
  background: ${a[e]};
}
${o(e+1)}
    `:"";return(0,i.jsx)(n.Global,{styles:(0,n.css)`
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
          ${o()}

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
      `});};},"1b1ea5c3":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.e(t,{default:function(){return p;},useStyle:function(){return c;}});var i=o("777fffbe"),n=o("8090cfc0"),r=o("c5d21053"),a=o("0ba2ace3"),l=i._(o("8c339db8")),d=o("3a2876c3"),s=i._(o("3e6b097d"));let c=(0,a.createStyles)(({token:e,css:t})=>{let{antCls:o}=e;return{anchorToc:t`
      scrollbar-width: thin;
      scrollbar-gutter: stable;
      ${o}-anchor {
        ${o}-anchor-link-title {
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
    `};});var p=({showDebug:e,debugDemos:t=[]})=>{let{styles:o}=c(),i=(0,a.useTheme)(),p=(0,d.useRouteMeta)(),u=(0,d.useTabMeta)(),m=s.default.useMemo(()=>((null==u?void 0:u.toc)||p.toc).reduce((e,t)=>{if(2===t.depth)e.push({...t});else if(3===t.depth){let o=e[e.length-1];o&&(o.children=o.children||[],o.children.push({...t}));}return e;},[]),[null==u?void 0:u.toc,p.toc]);return p.frontmatter.toc?(0,n.jsx)("section",{className:o.tocWrapper,children:(0,n.jsx)(r.Anchor,{affix:!1,className:o.anchorToc,targetOffset:i.anchorTop,showInkInFixed:!0,items:m.map(o=>{var i;return{href:`#${o.id}`,title:o.title,key:o.id,children:null===(i=o.children)||void 0===i?void 0:i.filter(o=>e||!t.includes(o.id)).map(e=>({key:e.id,href:`#${e.id}`,title:(0,n.jsx)("span",{className:(0,l.default)({"toc-debug":t.includes(e.id)}),children:null==e?void 0:e.title})}))};})})}):null;};},"1bf9d6b2":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=o("8090cfc0"),n=o("8997291d"),r=o("0ba2ace3"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(n.Global,{styles:(0,n.css)`
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
      `});};},"22d5b106":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return f;}});var i=o("777fffbe"),n=o("8090cfc0"),r=o("2020273b"),a=o("c5d21053"),l=o("92799974"),d=o("3a2876c3"),s=o("3e6b097d"),c=i._(o("966e154f")),p=i._(o("968104eb")),u=o("ed88eec8"),m=i._(o("12464bb0")),g=i._(o("84fd9268")),f=()=>{let{pathname:e,search:t}=(0,d.useLocation)(),{theme:o,updateSiteConfig:i}=(0,s.use)(p.default),f=(0,c.default)(),h=(0,n.jsx)(a.Badge,{color:"blue",style:{marginTop:-1}}),x=[{id:"app.theme.switch.default",icon:(0,n.jsx)(r.SunOutlined,{}),key:"light",showBadge:()=>o.includes("light")||0===o.length},{id:"app.theme.switch.dark",icon:(0,n.jsx)(l.DarkTheme,{}),key:"dark",showBadge:()=>o.includes("dark")},{type:"divider"},{id:"app.theme.switch.compact",icon:(0,n.jsx)(l.CompactTheme,{}),key:"compact",showBadge:()=>o.includes("compact")},{type:"divider"},{id:"app.theme.switch.happy-work",icon:(0,n.jsx)(r.SmileOutlined,{}),key:"happy-work",showBadge:()=>o.includes("happy-work")},{type:"divider"},{id:"app.footer.theme",icon:(0,n.jsx)(r.BgColorsOutlined,{}),key:"theme-editor",extra:(0,n.jsx)(r.LinkOutlined,{}),isLink:!0,linkPath:"/theme-editor"}].map((o,i)=>{if("divider"===o.type)return{type:"divider",key:`divider-${i}`};let{id:r,icon:a,key:l,showBadge:s,extra:c,isLink:p,linkPath:g}=o;return{label:p?(0,n.jsx)(m.default,{to:(0,u.getLocalizedPathname)(g,(0,u.isZhCN)(e),t),children:(0,n.jsx)(d.FormattedMessage,{id:r})}):(0,n.jsx)(d.FormattedMessage,{id:r}),icon:a,key:l||i,extra:s?s()?h:null:c};}),b=(e,t)=>{"theme-editor"!==e&&(("dark"===e||"light"===e)&&f(t,o.includes("dark")),["light","dark"].includes(e)?i({theme:[...o.filter(e=>!["light","dark"].includes(e)),e]}):i({theme:o.includes(e)?o.filter(t=>t!==e):[...o,e]}));};return(0,n.jsx)(a.Dropdown,{menu:{items:x,onClick:({key:e,domEvent:t})=>{b(e,t);}},arrow:{pointAtCenter:!0},placement:"bottomRight",children:(0,n.jsx)(a.Button,{type:"text",icon:(0,n.jsx)(g.default,{}),style:{fontSize:16,borderRadius:100,height:40,width:40}})});};},"25e9092d":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=o("8090cfc0"),n=o("3e6b097d"),r=o("c5d21053"),a=o("37386a2f"),l=({children:e,fallback:t=(0,i.jsx)(r.Skeleton.Input,{active:!0,size:"small"}),delay:o=200})=>(0,i.jsx)(a.InView,{triggerOnce:!0,delay:o,children:({inView:o,ref:r})=>(0,i.jsx)("div",{ref:r,children:(0,i.jsx)(n.Suspense,{fallback:t,children:o?e:(0,i.jsx)("span",{})})})});},"2b79b3a9":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=o("777fffbe")._(o("3e6b097d"));let n=()=>window.scrollY,r=()=>0;var a=()=>{let[e,t]=i.default.useState(),o=i.default.useCallback(e=>{let o=!1,i=window.scrollY,n=()=>{o||(requestAnimationFrame(()=>{e(),t(i>window.scrollY?"up":"down"),i=window.scrollY,o=!1;}),o=!0);};return window.addEventListener("scroll",n),()=>window.removeEventListener("scroll",n);},[]);return{scrollY:i.default.useSyncExternalStore(o,n,r),scrollYDirection:e};};},"3de53a89":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=o("777fffbe"),n=o("8090cfc0"),r=o("3a2876c3"),a=i._(o("543a447c")),l=e=>{let{children:t,title:o,desc:i}=e;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(r.Helmet,{children:[(0,n.jsxs)("title",{children:[o," - ",i]}),(0,n.jsx)("meta",{property:"og:title",content:o}),i&&(0,n.jsx)("meta",{name:"description",content:i})]}),(0,n.jsx)("div",{style:{minHeight:"100vh"},children:t}),(0,n.jsx)(a.default,{})]});};},"4030a808":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.e(t,{Common:function(){return a.default;},Demo:function(){return s.default;},HeadingAnchor:function(){return n.default;},Highlight:function(){return d.default;},Markdown:function(){return l.default;},NProgress:function(){return p.default;},PreviewImage:function(){return u.default;},Reset:function(){return r.default;},Responsive:function(){return c.default;},SearchBar:function(){return m.default;}});var i=o("777fffbe"),n=i._(o("b0a1e00e")),r=i._(o("d94701e6")),a=i._(o("00e00f20")),l=i._(o("4edc3e10")),d=i._(o("bf5a2e9b")),s=i._(o("a11ac8d4")),c=i._(o("119f4557")),p=i._(o("78290692")),u=i._(o("1bf9d6b2")),m=i._(o("e79f2560"));},"4edc3e10":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=o("8090cfc0"),n=o("5a936b41"),r=o("8997291d"),a=o("0ba2ace3"),l=()=>{let e=(0,a.useTheme)(),{antCls:t}=e,o=e.colorPrimary;return(0,i.jsx)(r.Global,{styles:(0,r.css)`
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
            background: ${o};

            &:nth-child(2n + 1) {
              background: ${new n.FastColor(o).setA(.75).toHexString()};
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
            background: ${new n.FastColor(o).setA(.75).toHexString()};
          }

          ${t}-row .demo-col-2,
            .code-box-demo ${t}-row .demo-col-2 {
            background: ${new n.FastColor(o).setA(.75).toHexString()};
          }

          ${t}-row .demo-col-3,
            .code-box-demo ${t}-row .demo-col-3 {
            color: #999;
            background: rgba(255, 255, 255, 0.2);
          }

          ${t}-row .demo-col-4,
            .code-box-demo ${t}-row .demo-col-4 {
            background: ${new n.FastColor(o).setA(.6).toHexString()};
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
      `});};},"543a447c":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return b;}});var i=o("777fffbe"),n=o("8090cfc0"),r=o("5a936b41"),a=o("2020273b"),l=o("0ba2ace3"),d=i._(o("6c0a143f")),s=o("3a2876c3"),c=i._(o("dcc72ee4")),p=i._(o("3e6b097d")),u=i._(o("30115f70")),m=i._(o("6d8f1b37")),g=i._(o("968104eb")),f=i._(o("8182986c"));let h={cn:{owner:"\u8682\u8681\u96C6\u56E2\u548C Ant Design \u5F00\u6E90\u793E\u533A"},en:{owner:"Ant Group and Ant Design Community"}},x=()=>{let{isMobile:e}=p.default.use(g.default);return(0,l.createStyles)(({token:t,css:o})=>{let i=new r.FastColor((0,d.default)("#f0f3fa","#fff")).onBackground(t.colorBgContainer).toHexString();return{holder:o`
      background: ${i};
    `,footer:o`
      background: ${i};
      color: ${t.colorTextSecondary};
      box-shadow: inset 0 106px 36px -116px rgba(0, 0, 0, 0.14);

      * {
        box-sizing: border-box;
      }

      h2,
      a {
        color: ${t.colorText};
      }
      .rc-footer-column {
        margin-bottom: ${e?60:0}px;
        :last-child {
          margin-bottom: ${e?20:0}px;
        }
      }
      .rc-footer-item-icon {
        top: -1.5px;
      }
      .rc-footer-container {
        max-width: 1208px;
        margin-inline: auto;
        padding-inline: ${t.marginXXL}px;
      }
      .rc-footer-bottom {
        box-shadow: inset 0 106px 36px -116px rgba(0, 0, 0, 0.14);
        .rc-footer-bottom-container {
          font-size: ${t.fontSize}px;
        }
      }
      `};})();};var b=()=>{let e=(0,m.default)(),[t,o]=(0,u.default)(h),{styles:i}=x(),{getLink:r}=e,l=p.default.useMemo(()=>{let e="cn"===o,t={title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.resources"}),items:[{title:"Ant Design",url:e?"https://ant-design.antgroup.com/index-cn":"https://ant.design",openExternal:!0},{title:"Ant Design Charts",url:e?"https://ant-design-charts.antgroup.com":"https://charts.ant.design",openExternal:!0},{title:"Ant Design Pro",url:"https://pro.ant.design",openExternal:!0},{title:"Pro Components",url:e?"https://pro-components.antdigital.dev":"https://procomponents.ant.design",openExternal:!0},{title:"Ant Design Mobile",url:e?"https://ant-design-mobile.antgroup.com/zh":"https://mobile.ant.design",openExternal:!0},{title:"Ant Design Mini",url:e?"https://ant-design-mini.antgroup.com/":"https://mini.ant.design",openExternal:!0},{title:"Ant Design Web3",url:e?"https://web3.antdigital.dev":"https://web3.ant.design",openExternal:!0},{title:"Ant Design Landing",description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.landing"}),url:"https://landing.ant.design",openExternal:!0},{title:"Scaffolds",description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.scaffolds"}),url:"https://scaffold.ant.design",openExternal:!0},{title:"Umi",description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.umi"}),url:"https://umijs.org",openExternal:!0},{title:"dumi",description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.dumi"}),url:"https://d.umijs.org",openExternal:!0},{title:"qiankun",description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.qiankun"}),url:"https://qiankun.umijs.org",openExternal:!0},{title:"Ant Motion",description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.motion"}),url:"https://motion.ant.design",openExternal:!0},{title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.chinamirror"}),url:"https://ant-design.antgroup.com"}]},i={title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.community"}),items:[{icon:(0,n.jsx)(a.AntDesignOutlined,{}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.awesome"}),url:"https://github.com/websemantics/awesome-ant-design",openExternal:!0},{icon:(0,n.jsx)(a.MediumOutlined,{}),title:"Medium",url:"http://medium.com/ant-design/",openExternal:!0},{icon:(0,n.jsx)(a.TwitterOutlined,{style:{color:"#1DA1F2"}}),title:"Twitter",url:"http://twitter.com/antdesignui",openExternal:!0},{icon:(0,n.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg",width:16,height:16,alt:"yuque logo"}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.yuque.repo"}),url:"https://yuque.com/ant-design/ant-design",openExternal:!0},{icon:(0,n.jsx)(a.ZhihuOutlined,{style:{color:"#056de8"}}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.zhihu"}),url:"https://www.zhihu.com/column/c_1564262000561106944",openExternal:!0},{icon:(0,n.jsx)(a.ZhihuOutlined,{style:{color:"#056de8"}}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.zhihu.xtech"}),url:"https://www.zhihu.com/column/c_1543658574504751104",openExternal:!0},{icon:(0,n.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/mZBWtboYbnMkTBaRIuWQ.png",width:16,height:16,alt:"seeconf logo"}),title:"SEE Conf",description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.seeconf"}),url:"https://seeconf.antfin.com/",openExternal:!0}]};return e&&i.items.push({icon:(0,n.jsx)(a.UsergroupAddOutlined,{}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.work_with_us"}),url:r("/docs/resources",{cn:"\u52A0\u5165\u6211\u4EEC",en:"JoinUs"}),LinkComponent:s.Link}),[t,i,{title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.help"}),items:[{icon:(0,n.jsx)(a.GithubOutlined,{}),title:"GitHub",url:"https://github.com/ant-design/x",openExternal:!0},{icon:(0,n.jsx)(a.HistoryOutlined,{}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.change-log"}),url:r("/changelog"),LinkComponent:s.Link},{icon:(0,n.jsx)(a.QuestionCircleOutlined,{}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.faq"}),url:r("/docs/react/faq"),LinkComponent:s.Link},{icon:(0,n.jsx)(a.BugOutlined,{}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.bug-report"}),url:"https://github.com/ant-design/x/issues/new?template=bug_report.yml",openExternal:!0},{icon:(0,n.jsx)(a.IssuesCloseOutlined,{}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.issues"}),url:"https://github.com/ant-design/x/issues",openExternal:!0},{icon:(0,n.jsx)(a.MessageOutlined,{}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.discussions"}),url:"https://github.com/ant-design/x/discussions",openExternal:!0},{icon:(0,n.jsx)(a.QuestionCircleOutlined,{}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.stackoverflow"}),url:"http://stackoverflow.com/questions/tagged/antd",openExternal:!0},{icon:(0,n.jsx)(a.QuestionCircleOutlined,{}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.segmentfault"}),url:"https://segmentfault.com/t/antd",openExternal:!0}]},{icon:(0,n.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg",width:22,height:22,alt:"Ant XTech logo"}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.more-product"}),items:[{icon:(0,n.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg",width:16,height:16,alt:"yuque logo"}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.yuque"}),url:"https://yuque.com",description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.yuque.slogan"}),openExternal:!0},{icon:(0,n.jsx)("img",{src:"https://gw.alipayobjects.com/zos/antfincdn/nc7Fc0XBg5/8a6844f5-a6ed-4630-9177-4fa5d0b7dd47.png",width:16,height:16,alt:"AntV logo"}),title:"AntV",url:"https://antv.antgroup.com",description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.antv.slogan"}),openExternal:!0},{icon:(0,n.jsx)("img",{src:"https://www.eggjs.org/logo.svg",alt:"Egg logo",width:16,height:16}),title:"Egg",url:"https://eggjs.org",description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.egg.slogan"}),openExternal:!0},{icon:(0,n.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/DMDOlAUhmktLyEODCMBR.ico",width:16,height:16,alt:"Kitchen logo"}),title:"Kitchen",description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.kitchen"}),url:"https://kitchen.alipay.com",openExternal:!0},{icon:(0,n.jsx)("img",{src:"https://mdn.alipayobjects.com/huamei_j9rjmc/afts/img/A*3ittT5OEo2gAAAAAAAAAAAAADvGmAQ/original",width:16,height:16,alt:"Galacean logo"}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.galacean"}),description:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.galacean.slogan"}),url:"https://galacean.antgroup.com/",openExternal:!0},{icon:(0,n.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg",width:16,height:16,alt:"xtech logo"}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.xtech"}),url:"https://xtech.antfin.com/",openExternal:!0},{icon:(0,n.jsx)(a.BgColorsOutlined,{}),title:(0,n.jsx)(s.FormattedMessage,{id:"app.footer.theme"}),url:r("/theme-editor"),LinkComponent:s.Link}]}];},[o,e.search]);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(c.default,{columns:l,className:i.footer,bottom:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("div",{style:{opacity:"0.4"},children:["Made with ",(0,n.jsx)("span",{style:{color:"#fff"},children:"\u2764"})," by"]}),(0,n.jsx)("div",{children:t.owner})]})}),(0,n.jsx)(f.default,{})]});};},"568b625e":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return b;}});var i=o("777fffbe"),n=o("852bbaa9"),r=o("8090cfc0"),a=o("2020273b"),l=o("c5d21053"),d=o("0ba2ace3"),s=i._(o("8c339db8")),c=o("3a2876c3"),p=i._(o("3e6b097d")),u=i._(o("22d5b106")),m=i._(o("bbc33fc0")),g=n._(o("ed88eec8")),f=i._(o("968104eb")),h=i._(o("c0c87f69"));let x=(0,d.createStyles)(({css:e,token:t})=>({actions:e`
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
    `}));var b=e=>{let t=(0,c.useLocation)(),{pkg:o}=(0,c.useSiteData)(),i=(0,g.getThemeConfig)(),{direction:n,updateSiteConfig:d}=p.default.useContext(f.default),{styles:b}=x(),{pathname:w,search:$}=t,v=p.default.useMemo(()=>"rtl"===n?{direction:"ltr",textAlign:"right"}:{},[n]),k={[o.version]:o.version,...null==i?void 0:i.docVersions},y=Object.keys(k).map(e=>({value:k[e],label:e})),j=p.default.useCallback(e=>{let t=window.location.href,o=window.location.pathname;if(/overview/.test(o)&&/0?[1-39][0-3]?x/.test(e)){window.location.href=t.replace(window.location.origin,e).replace(/\/components\/overview/,`/docs${/0(9|10)x/.test(e)?"":"/react"}/introduce`).replace(/\/$/,"");return;}let i=new URL(t.replace(window.location.origin,e));i.host.includes("antgroup")?(i.pathname=`${i.pathname.replace(/\/$/,"")}/`,window.location.href=i.toString()):window.location.href=i.href.replace(/\/$/,"");},[]),S=p.default.useCallback(()=>{let e=`${window.location.protocol}//`,t=window.location.href.slice(e.length);g.isLocalStorageNameSupported()&&localStorage.setItem("locale",g.isZhCN(w)?"en-US":"zh-CN"),window.location.href=e+t.replace(window.location.pathname,g.getLocalizedPathname(w,!g.isZhCN(w),$).pathname);},[t]),_=[(0,r.jsx)(l.Button,{type:"text",className:b.select,children:(0,r.jsx)(l.Select,{size:"large",variant:"borderless",defaultValue:o.version,onChange:j,dropdownStyle:v,popupMatchSelectWidth:!1,options:y})},"version"),(0,r.jsx)(h.default,{onClick:S,value:g.isZhCN(w)?1:2,label1:"\u4E2D",label2:"En",tooltip1:"\u4E2D\u6587 / English",tooltip2:"English / \u4E2D\u6587"},"lang"),(0,r.jsx)(h.default,{onClick:()=>{d({direction:"rtl"!==n?"rtl":"ltr"});},value:"rtl"===n?2:1,label1:(0,r.jsx)(m.default,{direction:"ltr"}),tooltip1:"LTR",label2:(0,r.jsx)(m.default,{direction:"rtl"}),tooltip2:"RTL",pure:!0,"aria-label":"RTL Switch Button"},"direction"),(0,r.jsx)(u.default,{},"theme"),(0,r.jsx)("a",{href:"https://github.com/ant-design/x",target:"_blank",rel:"noreferrer",children:(0,r.jsx)(h.default,{value:1,label1:(0,r.jsx)(a.GithubOutlined,{}),tooltip1:"Github",label2:null,pure:!0})},"github")];return(0,r.jsx)("div",{className:(0,s.default)(b.actions,e.isMini&&b.mini,e.isMobile&&b.mobile,e.className),children:_});};},78290692:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=o("8090cfc0"),n=o("8997291d"),r=o("0ba2ace3"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(n.Global,{styles:(0,n.css)`
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
      `});};},"7873e29a":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return g;}});var i=o("777fffbe"),n=o("8090cfc0"),r=o("f153e352"),a=o("c5d21053"),l=o("0ba2ace3"),d=o("3a2876c3"),s=i._(o("9450a224")),c=i._(o("3e6b097d")),p=i._(o("f05d7dd1")),u=i._(o("968104eb"));let m=(0,l.createStyles)(({token:e,css:t})=>{let{antCls:o,fontFamily:i,colorSplit:n,marginXXL:r,paddingXXS:a}=e;return{asideContainer:t`
      min-height: 100%;
      padding-bottom: ${r}px !important;
      font-family: Avenir, ${i}, sans-serif;
      padding: 0 ${a}px;

      &${o}-menu-inline {
        ${o}-menu-submenu-title h4,
        > ${o}-menu-item,
        ${o}-menu-item a {
          overflow: hidden;
          font-size: ${e.fontSize}px;
          text-overflow: ellipsis;
        }

        > ${o}-menu-item-group > ${o}-menu-item-group-title {
          margin-top: ${e.margin}px;
          margin-bottom: ${e.margin}px;
          font-size: ${e.fontSize}px;

          &::after {
            position: relative;
            top: 12px;
            display: block;
            width: calc(100% - 20px);
            height: 1px;
            background: ${n};
            content: '';
          }
        }

        > ${o}-menu-item,
          > ${o}-menu-submenu
          > ${o}-menu-submenu-title,
          > ${o}-menu-item-group
          > ${o}-menu-item-group-title,
          > ${o}-menu-item-group
          > ${o}-menu-item-group-list
          > ${o}-menu-item,
          &${o}-menu-inline
          > ${o}-menu-item-group
          > ${o}-menu-item-group-list
          > ${o}-menu-item {
          padding-inline: 36px 12px !important;
        }

        // Nest Category > Type > Article
        &${o}-menu-inline {
          ${o}-menu-item-group-title {
            margin-inline-start: ${e.marginXXS}px;
            padding-inline-start: 60px;

            ${o}-row-rtl & {
              padding-inline-end: 60px;
              padding-inline-start: ${e.padding}px;
            }
          }

          ${o}-menu-item-group-list > ${o}-menu-item {
            padding-inline-start: 80px !important;

            ${o}-row-rtl & {
              padding-inline-end: 80px !important;
              padding-inline-start: ${e.padding}px !important;
            }
          }
        }

        ${o}-menu-item-group:first-child {
          ${o}-menu-item-group-title {
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
      top: ${e.headerHeight}px;
      width: 100%;
      max-height: calc(100vh - ${e.headerHeight}px);
      overflow: hidden;
      scrollbar-width: thin;
      scrollbar-gutter: stable;

      &:hover {
        overflow-y: auto;
      }
    `};});var g=()=>{let e=(0,d.useSidebarData)(),{isMobile:t,theme:o}=c.default.use(u.default),{styles:i}=m(),[g,f]=(0,p.default)(),h=o.includes("dark"),{colorBgContainer:x}=(0,l.useTheme)(),b=(0,n.jsx)(r.XProvider,{theme:{components:{Menu:{itemBg:x,darkItemBg:x}}},children:(0,n.jsx)(a.Menu,{items:g,inlineIndent:30,className:i.asideContainer,mode:"inline",theme:h?"dark":"light",selectedKeys:[f],defaultOpenKeys:null==e?void 0:e.map(({title:e})=>e).filter(Boolean)})});return t?(0,n.jsx)(s.default,{children:b},"Mobile-menu"):(0,n.jsx)(a.Col,{xxl:4,xl:5,lg:6,md:6,sm:24,xs:24,className:i.mainMenu,children:b});};},"7911dafa":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return u;}});var i=o("777fffbe"),n=o("852bbaa9"),r=o("8090cfc0"),a=o("0ba2ace3"),l=i._(o("8c339db8")),d=o("3a2876c3"),s=i._(o("12464bb0")),c=n._(o("ed88eec8"));let p=(0,a.createStyles)(({token:e,css:t})=>{let{headerHeight:o,colorTextHeading:i,mobileMaxWidth:n}=e;return{logo:t`
      height: ${o}px;
      line-height: ${o}px;
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

      @media only screen and (max-width: ${n}px) {
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
    `};});var u=({isZhCN:e,isMobile:t,isMini:o})=>{let{search:i}=(0,d.useLocation)(),{styles:n}=p();return(0,r.jsx)("h1",{children:(0,r.jsxs)(s.default,{to:c.getLocalizedPathname("/",e,i),className:(0,l.default)(n.logo,(t||o)&&n.mobile),children:[(0,r.jsx)("img",{src:"https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original",draggable:!1,alt:"logo"}),(0,r.jsx)("span",{className:n.title,children:"Ant Design X"})]})});};},"7d24d339":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return f;}});var i=o("777fffbe"),n=o("8090cfc0"),r=o("0ba2ace3"),a=i._(o("8c339db8")),l=o("3a2876c3"),d=i._(o("3e6b097d")),s=i._(o("30115f70")),c=i._(o("12464bb0")),p=o("ed88eec8");let u={cn:{design:"\u8BBE\u8BA1",development:"\u7814\u53D1",components:"\u7EC4\u4EF6",playground:"\u6F14\u793A",blog:"\u535A\u5BA2",resources:"\u8D44\u6E90"},en:{design:"Design",development:"Development",components:"Components",playground:"Playground",blog:"Blog",resources:"Resources"}},m=[{path:"/docs/spec/introduce",basePath:"/docs/spec",key:"design"},{path:"/docs/react/introduce",basePath:"/docs/react",key:"development"},{path:"/components/overview/",basePath:"/components",key:"components"},{path:"/docs/playground/independent",basePath:"/playground",key:"playground"}],g=(0,r.createStyles)(({token:e})=>({nav:(0,r.css)`
      padding: 0 ${e.paddingLG}px;
      border-radius: ${e.indexRadius}px;
      box-sizing: border-box;

      display: flex;
      gap: ${e.paddingLG}px;
      align-items: center;

      a {
        font-size: ${e.fontSizeLG}px;
        color: ${e.colorTextSecondary};
      };

      a:hover {
        color: ${e.colorText};
      }
    `,pc:(0,r.css)`
      height: 48px;
      overflow: hidden;

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
  `}));var f=e=>{var t,o;let{isZhCN:i,isMobile:r,isMini:f,isRTL:h,className:x}=e,{styles:b}=g(),[w]=(0,s.default)(u),{search:$,pathname:v}=(0,l.useLocation)(),[k,y]=d.default.useState(),j=(null===(o=(0,l.useFullSidebarData)()["/docs/blog"])||void 0===o?void 0:null===(t=o[0])||void 0===t?void 0:t.children)||[],S=d.default.useMemo(()=>{let e=[...m];return j.length&&e.push({path:j.sort((e,t)=>{var o,i;return(null===(o=e.frontmatter)||void 0===o?void 0:o.date)>(null===(i=t.frontmatter)||void 0===i?void 0:i.date)?-1:1;})[0].link,basePath:"/docs/blog",key:"blog"}),e;},[j.length]);d.default.useEffect(()=>{if(!S.length||!v)return;let e=S.findIndex(e=>v.includes(e.basePath));-1===e?y(void 0):y(S[e].key);},[v,S.length]);let _=e=>()=>y(e);return(0,n.jsx)("nav",{className:(0,a.default)(b.nav,r||f?b.mobile:b.pc,f&&b.mini,!r&&!f&&h&&b.pc_rtl,x),children:S.map(e=>(0,n.jsx)(c.default,{to:(0,p.getLocalizedPathname)(e.path,i,$),onClick:_(e.key),className:k===e.key?b.item_active:"",children:w[e.key]},e.key))});};},"7eea5fd8":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0});},"84fd9268":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=o("777fffbe"),n=o("8090cfc0"),r=i._(o("2020273b"));let a=e=>(0,n.jsxs)("svg",{width:20,height:20,viewBox:"0 0 24 24",fill:"currentColor",...e,children:[(0,n.jsx)("title",{children:"Theme icon"}),(0,n.jsx)("g",{fillRule:"evenodd",children:(0,n.jsx)("g",{fillRule:"nonzero",children:(0,n.jsx)("path",{d:"M7.02 3.635l12.518 12.518a1.863 1.863 0 010 2.635l-1.317 1.318a1.863 1.863 0 01-2.635 0L3.068 7.588A2.795 2.795 0 117.02 3.635zm2.09 14.428a.932.932 0 110 1.864.932.932 0 010-1.864zm-.043-9.747L7.75 9.635l9.154 9.153 1.318-1.317-9.154-9.155zM3.52 12.473c.514 0 .931.417.931.931v.932h.932a.932.932 0 110 1.864h-.932v.931a.932.932 0 01-1.863 0l-.001-.931h-.93a.932.932 0 010-1.864h.93v-.932c0-.514.418-.931.933-.931zm15.374-3.727a1.398 1.398 0 110 2.795 1.398 1.398 0 010-2.795zM4.385 4.953a.932.932 0 000 1.317l2.046 2.047L7.75 7 5.703 4.953a.932.932 0 00-1.318 0zM14.701.36a.932.932 0 01.931.932v.931h.932a.932.932 0 010 1.864h-.933l.001.932a.932.932 0 11-1.863 0l-.001-.932h-.93a.932.932 0 110-1.864h.93v-.931a.932.932 0 01.933-.932z"})})})]});var l=e=>(0,n.jsx)(r.default,{component:a,...e});},"966e154f":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=o("0ba2ace3"),n=o("dd4e3a8b"),r=o("3e6b097d");let a=`
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
`;var l=()=>{let{colorBgElevated:e}=(0,i.useTheme)(),t=(0,r.useRef)({colorBgElevated:e}),o=(e,t)=>{(0,n.updateCSS)(`
    * {
    transition: none !important;
  }
    `,"disable-transition"),document.documentElement.animate({clipPath:t?[...e].reverse():e},{duration:500,easing:"ease-in",pseudoElement:t?"::view-transition-old(root)":"::view-transition-new(root)"}).addEventListener("finish",()=>{(0,n.removeCSS)("disable-transition");});};return(0,r.useEffect)(()=>{"function"==typeof document.startViewTransition&&(0,n.updateCSS)(a,"view-transition-style");},[]),(0,r.useEffect)(()=>{e!==t.current.colorBgElevated&&(t.current.colorBgElevated=e);},[e]),(i,r)=>{if(!(i&&"function"==typeof document.startViewTransition))return;let a=Date.now(),l=i.clientX,d=i.clientY,s=Math.hypot(Math.max(l,innerWidth-l),Math.max(d,innerHeight-d));(0,n.updateCSS)(`
    [data-prefers-color='dark'] {
      color-scheme: light !important;
    }

    [data-prefers-color='light'] {
      color-scheme: dark !important;
    }
    `,"color-scheme"),document.startViewTransition(async()=>{for(;e===t.current.colorBgElevated;)await new Promise(e=>setTimeout(e,1e3/60));let o=document.documentElement;o.classList.remove(r?"dark":"light"),o.classList.add(r?"light":"dark");}).ready.then(()=>{console.log(`Theme transition finished in ${Date.now()-a}ms`);let e=[`circle(0px at ${l}px ${d}px)`,`circle(${s}px at ${l}px ${d}px)`];(0,n.removeCSS)("color-scheme"),o(e,r);});};};},"967f0ab0":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return $;}});var i=o("777fffbe"),n=o("852bbaa9"),r=o("8090cfc0"),a=i._(o("8c339db8")),l=i._(o("e9fd738c"));o("a42556f2");var d=o("f153e352"),s=i._(o("a50f92a3")),c=o("3a2876c3"),p=n._(o("3e6b097d")),u=i._(o("30115f70")),m=i._(o("6d8f1b37")),g=i._(o("ccceaa5e")),f=i._(o("e76bf6db")),h=i._(o("968104eb"));o("7eea5fd8");var x=i._(o("3de53a89")),b=i._(o("eb928c2b"));let w={cn:{title:"Ant Design X",description:"\u8F7B\u677E\u6253\u9020 AI \u9A71\u52A8\u7684\u754C\u9762\u3002"},en:{title:"Ant Design X",description:"Craft AI-driven interfaces effortlessly."}};var $=()=>{let e=(0,c.useOutlet)(),t=(0,m.default)(),{pathname:o,search:i,hash:n}=t,[$,v]=(0,u.default)(w),k=(0,p.useRef)(null),{direction:y}=p.default.use(h.default),{loading:j}=(0,c.useSiteData)();(0,p.useLayoutEffect)(()=>{"cn"===v?l.default.locale("zh-cn"):l.default.locale("en");},[]),(0,p.useEffect)(()=>{let e=document.getElementById("nprogress-style");return k.current=setTimeout(()=>{null==e||e.remove();},0),()=>clearTimeout(k.current);},[]),(0,p.useEffect)(()=>{let e=n.replace("#","");if(e){var t;null===(t=document.getElementById(decodeURIComponent(e)))||void 0===t||t.scrollIntoView();}},[j,n]),(0,p.useEffect)(()=>{void 0!==window.ga&&window.ga("send","pageview",o+i);},[t]);let S=p.default.useMemo(()=>["","/"].some(e=>e===o)||["/index"].some(e=>o.startsWith(e))?(0,r.jsx)(x.default,{title:$.title,desc:$.description,children:e}):o.startsWith("/theme-editor")?e:(0,r.jsx)(b.default,{children:e}),[o,e]);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(c.Helmet,{encodeSpecialCharacters:!1,children:[(0,r.jsx)("html",{lang:"cn"===v?"zh-CN":v,"data-direction":y,className:(0,a.default)({rtl:"rtl"===y})}),(0,r.jsx)("link",{sizes:"144x144",href:"https://gw.alipayobjects.com/zos/antfincdn/UmVnt3t4T0/antd.png"}),(0,r.jsx)("meta",{property:"og:description",content:$.description}),(0,r.jsx)("meta",{property:"og:type",content:"website"}),(0,r.jsx)("meta",{property:"og:image",content:"https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png"})]}),(0,r.jsxs)(d.XProvider,{direction:y,locale:"cn"===v?s.default:void 0,children:[(0,r.jsx)(g.default,{}),(0,r.jsx)(f.default,{}),S]})]});};},"9abc6268":function(e,t,o){"use strict";var i=o("852bbaa9")._;o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return _;}});var n=o("777fffbe"),r=o("852bbaa9"),a=o("8090cfc0"),l=o("c5d21053"),d=n._(o("8c339db8")),s=o("3a2876c3"),c=r._(o("3e6b097d")),p=n._(o("d7250faa")),u=n._(o("6d8f1b37")),m=n._(o("ec985880")),g=n._(o("87f698d7")),f=n._(o("968104eb")),h=o("1b1ea5c3"),x=n._(o("25e9092d"));let b=c.default.lazy(()=>Promise.all([o.ensure("vendors_3"),o.ensure("f281e03b")]).then(o.dr(i,o.bind(o,"f281e03b")))),w=c.default.lazy(()=>Promise.all([o.ensure("542cc4a9")]).then(o.dr(i,o.bind(o,"542cc4a9")))),$=c.default.lazy(()=>Promise.all([o.ensure("1b1ea5c3")]).then(o.dr(i,o.bind(o,"1b1ea5c3")))),v=c.default.lazy(()=>Promise.all([o.ensure("6512f379")]).then(o.dr(i,o.bind(o,"6512f379")))),k=c.default.lazy(()=>Promise.all([o.ensure("vendors_3"),o.ensure("common"),o.ensure("543a447c")]).then(o.dr(i,o.bind(o,"543a447c")))),y=c.default.lazy(()=>Promise.all([o.ensure("vendors_3"),o.ensure("common"),o.ensure("5c6d94b3")]).then(o.dr(i,o.bind(o,"5c6d94b3")))),j=c.default.lazy(()=>Promise.all([o.ensure("5a6dbd7c")]).then(o.dr(i,o.bind(o,"5a6dbd7c")))),S=({num:e=6})=>Array.from({length:e}).map((e,t)=>(0,a.jsx)(l.Skeleton.Avatar,{size:"small",active:!0,style:{marginInlineStart:0===t?0:-8}},t));var _=({children:e})=>{var t,o,i;let n=(0,s.useRouteMeta)(),{pathname:r,hash:_}=(0,u.default)(),{direction:M}=c.default.use(f.default),{styles:z}=(0,h.useStyle)(),[C,L]=(0,p.default)(!1),[T,A]=(0,c.useState)("tsx"),B=(0,c.useMemo)(()=>{var e;return(null===(e=n.toc)||void 0===e?void 0:e.filter(e=>e._debug_demo).map(e=>e.id))||[];},[n]),E=B.includes(_.slice(1));(0,c.useLayoutEffect)(()=>{L(E);},[]);let F=(0,c.useMemo)(()=>({showDebug:C,setShowDebug:L,codeType:T,setCodeType:A}),[C,T,B]),X="rtl"===M;return(0,a.jsx)(g.default,{value:F,children:(0,a.jsxs)(l.Col,{xxl:20,xl:19,lg:18,md:18,sm:24,xs:24,children:[(0,a.jsx)(x.default,{fallback:null,children:(0,a.jsx)($,{showDebug:C,debugDemos:B})}),(0,a.jsxs)("article",{className:(0,d.default)(z.articleWrapper,{rtl:X}),children:[(null===(t=n.frontmatter)||void 0===t?void 0:t.title)?(0,a.jsx)(l.Flex,{justify:"space-between",children:(0,a.jsx)(l.Typography.Title,{style:{fontSize:32,position:"relative"},children:(0,a.jsxs)(l.Space,{children:[(0,a.jsx)("span",{children:null===(o=n.frontmatter)||void 0===o?void 0:o.title}),(0,a.jsx)("span",{children:null===(i=n.frontmatter)||void 0===i?void 0:i.subtitle}),!r.startsWith("/components/overview")&&(0,a.jsx)(x.default,{fallback:null,children:(0,a.jsx)(j,{title:(0,a.jsx)(s.FormattedMessage,{id:"app.content.edit-page"}),filename:n.frontmatter.filename})})]})})}):null,(0,a.jsx)(x.default,{fallback:null,children:(0,a.jsx)(v,{})}),!n.frontmatter.__autoDescription&&n.frontmatter.description,"Components"===n.frontmatter.category&&"false"!==String(n.frontmatter.showImport)&&(0,a.jsx)(m.default,{source:!0,component:n.frontmatter.title,filename:n.frontmatter.filename,version:n.frontmatter.tag,designUrl:n.frontmatter.designUrl}),(0,a.jsx)("div",{style:{minHeight:"calc(100vh - 64px)"},children:e}),(0,a.jsx)(x.default,{fallback:null,children:(0,a.jsx)(w,{zhihuLink:n.frontmatter.zhihu_url,yuqueLink:n.frontmatter.yuque_url,juejinLink:n.frontmatter.juejin_url})}),(0,a.jsx)("div",{style:{marginTop:120},children:(0,a.jsx)(x.default,{fallback:(0,a.jsx)(S,{}),children:(0,a.jsx)(b,{filename:n.frontmatter.filename})})})]}),(0,a.jsx)(x.default,{fallback:null,children:(0,a.jsx)(y,{rtl:X})}),(0,a.jsx)(k,{})]})});};},a11ac8d4:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=o("8090cfc0"),n=o("8997291d"),r=o("0ba2ace3"),a=()=>{let e=(0,r.useTheme)(),{antCls:t,iconCls:o}=e;return(0,i.jsx)(n.Global,{styles:(0,n.css)`
        .code-boxes-col-1-1 {
          width: 100%;
        }

        .code-boxes-col-2-1 {
          display: inline-block;
          vertical-align: top;
        }

        .code-box {
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

            ${o} {
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

            ${o} {
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

            &${o}-check {
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
            ${o} {
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
      `});};},b0a1e00e:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=o("8090cfc0"),n=o("8997291d"),r=o("0ba2ace3"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(n.Global,{styles:(0,n.css)`
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
      `});};},bbc33fc0:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return d;}});var i=o("777fffbe"),n=o("8090cfc0"),r=i._(o("2020273b")),a=i._(o("3e6b097d"));let l=({direction:e})=>(0,n.jsxs)("svg",{viewBox:"0 0 20 20",width:"20",height:"20",fill:"currentColor",style:{transform:`scaleX(${"ltr"===e?"1":"-1"})`},children:[(0,n.jsx)("title",{children:"Direction Icon"}),(0,n.jsx)("path",{d:"m14.6961816 11.6470802.0841184.0726198 2 2c.2662727.2662727.2904793.682876.0726198.9764816l-.0726198.0841184-2 2c-.2929.2929-.7677.2929-1.0606 0-.2662727-.2662727-.2904793-.682876-.0726198-.9764816l.0726198-.0841184.7196-.7197h-10.6893c-.41421 0-.75-.3358-.75-.75 0-.3796833.28215688-.6934889.64823019-.7431531l.10176981-.0068469h10.6893l-.7196-.7197c-.2929-.2929-.2929-.7677 0-1.0606.2662727-.2662727.682876-.2904793.9764816-.0726198zm-8.1961616-8.6470802c.30667 0 .58246.18671.69635.47146l3.00003 7.50004c.1538.3845-.0333.821-.41784.9749-.38459.1538-.82107-.0333-.9749-.4179l-.81142-2.0285h-2.98445l-.81142 2.0285c-.15383.3846-.59031.5717-.9749.4179-.38458-.1539-.57165-.5904-.41781-.9749l3-7.50004c.1139-.28475.38968-.47146.69636-.47146zm8.1961616 1.14705264.0841184.07261736 2 2c.2662727.26626364.2904793.68293223.0726198.97654222l-.0726198.08411778-2 2c-.2929.29289-.7677.29289-1.0606 0-.2662727-.26626364-.2904793-.68293223-.0726198-.97654222l.0726198-.08411778.7196-.7196675h-3.6893c-.4142 0-.75-.3357925-.75-.7500025 0-.3796925.2821653-.69348832.6482323-.74315087l.1017677-.00684663h3.6893l-.7196-.7196725c-.2929-.29289-.2929-.76777 0-1.06066.2662727-.26626364.682876-.29046942.9764816-.07261736zm-8.1961616 1.62238736-.89223 2.23056h1.78445z"})]});var d=a.default.forwardRef((e,t)=>(0,n.jsx)(r.default,{ref:t,component:()=>(0,n.jsx)(l,{direction:e.direction}),...e}));},bf5a2e9b:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=o("8090cfc0"),n=o("8997291d"),r=o("0ba2ace3"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(n.Global,{styles:(0,n.css)`
        /**
* prism.js default theme for JavaScript, CSS and HTML
* Based on dabblet (http://dabblet.com)
* @author Lea Verou
*/

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
      `});};},c0c87f69:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return p;}});var i=o("777fffbe"),n=o("8090cfc0"),r=o("c5d21053"),a=o("0ba2ace3"),l=i._(o("8c339db8")),d=i._(o("21a20694"));let s="1.2em",c=(0,a.createStyles)(({token:e,css:t})=>{let{colorText:o,controlHeightLG:i,colorBgContainer:n,motionDurationMid:r}=e;return{btn:t`
      width: ${i}px;
      height: ${i}px;
      padding: 0 !important;
      border-radius: ${i/2}px;
      .btn-inner {
        transition: all ${r};
      }
      img {
        width: ${s};
        height: ${s};
      }
    `,innerDiv:t`
      position: relative;
      width: ${s};
      height: ${s};
    `,labelStyle:t`
      position: absolute;
      font-size: ${s};
      line-height: 1;
      border: 1px solid ${o};
      color: ${o};
    `,label1Style:t`
      inset-inline-start: -5%;
      top: 0;
      z-index: 1;
      background-color: ${o};
      color: ${n};
      transform: scale(0.7);
      transform-origin: 0 0;
    `,label2Style:t`
      inset-inline-end: -5%;
      bottom: 0;
      z-index: 0;
      transform: scale(0.5);
      transform-origin: 100% 100%;
    `};});var p=e=>{let{label1:t,label2:o,tooltip1:i,tooltip2:a,value:s,pure:p,onClick:u,...m}=e,{styles:{btn:g,innerDiv:f,labelStyle:h,label1Style:x,label2Style:b}}=c(),w=(0,n.jsx)(r.Button,{type:"text",onClick:u,className:g,...(0,d.default)(m,["className"]),children:(0,n.jsxs)("div",{className:"btn-inner",children:[p&&(1===s?t:o),!p&&(0,n.jsxs)("div",{className:f,children:[(0,n.jsx)("span",{className:(0,l.default)(h,1===s?x:b),children:t}),(0,n.jsx)("span",{className:(0,l.default)(h,1===s?b:x),children:o})]})]})},"lang-button");return i||a?(0,n.jsx)(r.Tooltip,{title:1===s?i:a,children:w}):w;};},c46960c5:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=o("8090cfc0"),n=o("8997291d"),r=o("0ba2ace3"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(n.Global,{styles:(0,n.css)`
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
      `});};},ccceaa5e:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return d;}});var i=o("777fffbe"),n=o("8090cfc0"),r=i._(o("19325a69")),a=o("4030a808"),l=i._(o("c46960c5")),d=()=>(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.Reset,{}),(0,n.jsx)(a.Common,{}),(0,n.jsx)(a.Markdown,{}),(0,n.jsx)(a.Highlight,{}),(0,n.jsx)(a.Demo,{}),(0,n.jsx)(a.Responsive,{}),(0,n.jsx)(a.NProgress,{}),(0,n.jsx)(a.PreviewImage,{}),(0,n.jsx)(l.default,{}),(0,n.jsx)(r.default,{}),(0,n.jsx)(a.HeadingAnchor,{}),(0,n.jsx)(a.SearchBar,{})]});},d94701e6:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return a;}});var i=o("8090cfc0"),n=o("8997291d"),r=o("0ba2ace3"),a=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(n.Global,{styles:(0,n.css)`
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
      `});};},e0b6e314:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=o("777fffbe"),n=o("8090cfc0"),r=o("3a2876c3"),a=i._(o("3e6b097d")),l=()=>{let e=(0,r.useRouteMeta)(),[t,o]=a.default.useMemo(()=>{let t;if(e.frontmatter.subtitle||e.frontmatter.title){var o;t=`${e.frontmatter.subtitle||""} ${(null===(o=e.frontmatter)||void 0===o?void 0:o.title)||""} - Ant Design X`;}else t="404 Not Found - Ant Design X";return[t,e.frontmatter.description||""];},[e]);return(0,n.jsxs)(r.Helmet,{children:[(0,n.jsx)("title",{children:t}),(0,n.jsx)("meta",{property:"og:title",content:t}),o&&(0,n.jsx)("meta",{name:"description",content:o})]});};},e76bf6db:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return w;}});var i=o("777fffbe"),n=o("852bbaa9"),r=o("8090cfc0"),a=o("2020273b"),l=o("c5d21053"),d=o("0ba2ace3"),s=i._(o("8c339db8")),c=n._(o("3e6b097d")),p=i._(o("30115f70")),u=i._(o("2b79b3a9")),m=i._(o("968104eb")),g=i._(o("568b625e")),f=i._(o("7911dafa")),h=i._(o("7d24d339")),x=o("3a2876c3");let b=(0,d.createStyles)(({token:e,css:t})=>({header:t`
      height: ${e.headerHeight}px;
      width: 100%;
      box-sizing: border-box;

      position: fixed;
      top: 0;
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
      
      top: ${(e.headerHeight-2*e.paddingLG)/2}px;
      overflow: hidden;
      
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
    `}));var w=()=>{let[e,t]=c.default.useState(!1),[,o]=(0,p.default)(),{pathname:i}=(0,x.useLocation)(),{direction:n,isMobile:d}=c.default.useContext(m.default),{styles:w}=b(),{scrollY:$,scrollYDirection:v}=(0,u.default)(),k=1080;"undefined"!=typeof window&&(k=window.innerHeight);let y=$>k&&!d,j={isZhCN:"cn"===o,isRTL:"rtl"===n,isMobile:d,isMini:y},S=null;(0,c.useEffect)(()=>{d&&t(!1);},[i]),S=d?(0,r.jsx)(l.Drawer,{closable:!1,footer:(0,r.jsx)(g.default,{...j}),onClose:()=>t(!1),open:e,placement:"top",height:"100%",zIndex:999,children:(0,r.jsx)(h.default,{...j})}):(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(h.default,{...j,className:(0,s.default)(!d&&!y&&w.background)}),(0,r.jsx)(g.default,{...j})]});let _=$>1.5*k&&"down"===v;return(0,r.jsxs)("header",{className:(0,s.default)(w.header,(d||y)&&w.background,(d||y)&&w.mobile,y&&w.mini,y&&"rtl"===n&&w.mini_rtl,_&&w.hidden),children:[(0,r.jsx)(f.default,{...j}),d&&(0,r.jsx)(l.Button,{onClick:()=>t(e=>!e),type:"text",icon:e?(0,r.jsx)(a.CloseOutlined,{}):(0,r.jsx)(a.MenuOutlined,{})}),S]});};},e79f2560:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return l;}});var i=o("8090cfc0"),n=o("8997291d"),r=o("0ba2ace3");let a="dumi-default-";var l=()=>{let e=(0,r.useTheme)();return(0,i.jsx)(n.Global,{styles:(0,n.css)`
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
      `});};},eb928c2b:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return c;}});var i=o("777fffbe"),n=o("8090cfc0"),r=o("0ba2ace3"),a=i._(o("e0b6e314")),l=i._(o("9abc6268")),d=i._(o("7873e29a"));let s=(0,r.createStyles)(({css:e,token:t})=>({main:e`
    display: flex;
    margin-top: ${t.headerHeight}px;
  `}));var c=({children:e})=>{let{styles:t}=s();return(0,n.jsxs)("main",{className:t.main,children:[(0,n.jsx)(a.default,{}),(0,n.jsx)(d.default,{}),(0,n.jsx)(l.default,{children:e})]});};}}]);
//# sourceMappingURL=ec324310-async.a5c559e5.js.map