(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["ff0bf651"],{"7e531f8e":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return u;}});var n=o("777fffbe"),s=o("852bbaa9"),i=o("8090cfc0"),a=o("c7cef649"),r=o("2bb52879"),l=s._(o("3e6b097d")),d=n._(o("40ff87e3"));let c="ant-where-checker",p={cn:{whereNotSupport:`\u{4F60}\u{7684}\u{6D4F}\u{89C8}\u{5668}\u{4E0D}\u{652F}\u{6301}\u{73B0}\u{4EE3} CSS Selector\u{FF0C}\u{8BF7}\u{4F7F}\u{7528}\u{73B0}\u{4EE3}\u{6D4F}\u{89C8}\u{5668}\u{FF08}\u{5982} Chrome\u{3001}Firefox \u{7B49}\u{7B49}\u{FF09}\u{67E5}\u{770B}\u{5B98}\u{7F51}\u{3002}\u{5982}\u{679C}\u{9700}\u{8981}\u{5BF9}\u{65E7}\u{7248}\u{6D4F}\u{89C8}\u{5668}\u{8FDB}\u{884C}\u{6837}\u{5F0F}\u{652F}\u{6301}\u{FF0C}\u{6B22}\u{8FCE}\u{67E5}\u{9605}\u{914D}\u{7F6E}\u{6587}\u{6863}\u{FF1A}`,whereDocTitle:"\u517C\u5BB9\u6027\u8C03\u6574\uFF08\u8BF7\u4F7F\u7528\u73B0\u4EE3\u6D4F\u89C8\u5668\u8BBF\u95EE\uFF09",whereDocUrl:"/docs/react/customize-theme-cn#\u517C\u5BB9\u6027\u8C03\u6574"},en:{whereNotSupport:"Your browser not support modern CSS Selector. Please use modern browser to view (e.g. Chrome, Firefox, etc). If you want to compatible style with legacy browser, please refer to the configuration document:",whereDocTitle:"Compatible adjustment (Please use modern browser to visit)",whereDocUrl:"/docs/react/customize-theme#compatible-adjustment"}},g=(0,r.createStyles)(({css:e,token:t})=>({container:e`
    position: fixed;
    inset-inline-start: 0;
    inset-inline-end: 0;
    top: 0;
    bottom: 0;
    z-index: 99999999;
    background-color: ${t.colorTextSecondary};
    display: flex;
    justify-content: center;
    align-items: center;
  `,alertBox:e`
    border: 1px solid ${t.colorWarningBorder};
    background-color: ${t.colorWarningBg};
    color: ${t.colorTextHeading};
    padding: ${t.paddingXS}px ${t.paddingSM}px;
    border-radius: ${t.borderRadiusLG}px;
    z-index: 9999999999;
    line-height: 22px;
    width: 520px;
    a {
      color: ${t.colorPrimary};
      text-decoration-line: none;
    }
  `}));var u=()=>{let[e]=(0,d.default)(p),[t,o]=l.useState(!0);l.useEffect(()=>{let e=document.createElement("p");e.className=c,e.style.position="fixed",e.style.pointerEvents="none",e.style.visibility="hidden",e.style.width="0",document.body.appendChild(e),(0,a.updateCSS)(`
:where(.${c}) {
  content: "__CHECK__";
}
    `,c);let{content:t}=getComputedStyle(e);o(String(t).includes("CHECK")),document.body.removeChild(e),(0,a.removeCSS)(c);},[]);let{styles:n}=g();return t?null:(0,i.jsx)("div",{className:n.container,children:(0,i.jsxs)("div",{className:n.alertBox,children:[e.whereNotSupport," ",(0,i.jsx)("a",{href:e.whereDocUrl,children:e.whereDocTitle})]})});};},ff0bf651:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return S;}});var n=o("777fffbe"),s=o("8090cfc0"),i=o("7ae894d0"),a=n._(o("cbd05140")),r=n._(o("d61b97ca")),l=n._(o("473e7971")),d=n._(o("5555ac7c")),c=n._(o("a65c973b")),p=n._(o("60ea52f5")),g=n._(o("f9333c54")),u=n._(o("55c5e615")),m=n._(o("32d2f31d")),h=n._(o("a0b2608c")),f=n._(o("e8d34874")),x=n._(o("47990f0f")),j=n._(o("6c0a143f")),b=o("2bb52879"),w=o("4fc63de3"),y=o("657f27a6"),M=n._(o("dcc72ee4")),F=n._(o("3e6b097d")),E=n._(o("40ff87e3")),_=n._(o("8dc5e1a9")),A=n._(o("f90be3ac")),k=n._(o("7e531f8e"));let v={cn:{owner:"\u8682\u8681\u96C6\u56E2\u548C Ant Design \u5F00\u6E90\u793E\u533A"},en:{owner:"Ant Group and Ant Design Community"}},C=()=>{let{isMobile:e}=F.default.use(A.default);return(0,b.createStyles)(({token:t,css:o})=>{let n=new i.FastColor((0,j.default)("#f0f3fa","#fff")).onBackground(t.colorBgContainer).toHexString();return{holder:o`
      background: ${n};
    `,footer:o`
      background: ${n};
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
      `};})();};var S=()=>{let e=(0,_.default)(),[t,o]=(0,E.default)(v),{styles:n}=C(),{getLink:i}=e,j=F.default.useMemo(()=>{let e="cn"===o,t={title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.resources"}),items:[{title:"Ant Design",url:e?"https://ant-design.antgroup.com/index-cn":"https://ant.design",openExternal:!0},{title:"Ant Design Charts",url:e?"https://ant-design-charts.antgroup.com":"https://charts.ant.design",openExternal:!0},{title:"Ant Design Pro",url:"https://pro.ant.design",openExternal:!0},{title:"Pro Components",url:e?"https://pro-components.antdigital.dev":"https://procomponents.ant.design",openExternal:!0},{title:"Ant Design Mobile",url:e?"https://ant-design-mobile.antgroup.com/zh":"https://mobile.ant.design",openExternal:!0},{title:"Ant Design Mini",url:e?"https://ant-design-mini.antgroup.com/":"https://mini.ant.design",openExternal:!0},{title:"Ant Design Web3",url:e?"https://web3.antdigital.dev":"https://web3.ant.design",openExternal:!0},{title:"Ant Design Landing",description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.landing"}),url:"https://landing.ant.design",openExternal:!0},{title:"Scaffolds",description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.scaffolds"}),url:"https://scaffold.ant.design",openExternal:!0},{title:"Umi",description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.umi"}),url:"https://umijs.org",openExternal:!0},{title:"dumi",description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.dumi"}),url:"https://d.umijs.org",openExternal:!0},{title:"qiankun",description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.qiankun"}),url:"https://qiankun.umijs.org",openExternal:!0},{title:"Ant Motion",description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.motion"}),url:"https://motion.ant.design",openExternal:!0},{title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.chinamirror"}),url:"https://ant-design.antgroup.com"}]},n={title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.community"}),items:[{icon:(0,s.jsx)(a.default,{}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.awesome"}),url:"https://github.com/websemantics/awesome-ant-design",openExternal:!0},{icon:(0,s.jsx)(g.default,{}),title:"Medium",url:"http://medium.com/ant-design/",openExternal:!0},{icon:(0,s.jsx)(h.default,{style:{color:"#1DA1F2"}}),title:"Twitter",url:"http://twitter.com/antdesignui",openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg",width:16,height:16,alt:"yuque logo"}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.yuque.repo"}),url:"https://yuque.com/ant-design/ant-design",openExternal:!0},{icon:(0,s.jsx)(x.default,{style:{color:"#056de8"}}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.zhihu"}),url:"https://www.zhihu.com/column/c_1564262000561106944",openExternal:!0},{icon:(0,s.jsx)(x.default,{style:{color:"#056de8"}}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.zhihu.xtech"}),url:"https://www.zhihu.com/column/c_1543658574504751104",openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/mZBWtboYbnMkTBaRIuWQ.png",width:16,height:16,alt:"seeconf logo"}),title:"SEE Conf",description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.seeconf"}),url:"https://seeconf.antfin.com/",openExternal:!0}]};return e&&n.items.push({icon:(0,s.jsx)(f.default,{}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.work_with_us"}),url:i("/docs/resources",{cn:"\u52A0\u5165\u6211\u4EEC",en:"JoinUs"}),LinkComponent:y.LinkWithPrefetch}),[t,n,{title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.help"}),items:[{icon:(0,s.jsx)(d.default,{}),title:"GitHub",url:"https://github.com/ant-design/x",openExternal:!0},{icon:(0,s.jsx)(c.default,{}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.change-log"}),url:i("/changelog"),LinkComponent:y.LinkWithPrefetch},{icon:(0,s.jsx)(m.default,{}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.faq"}),url:i("/docs/react/faq"),LinkComponent:y.LinkWithPrefetch},{icon:(0,s.jsx)(l.default,{}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.bug-report"}),url:"https://github.com/ant-design/x/issues/new?template=bug_report.yml",openExternal:!0},{icon:(0,s.jsx)(p.default,{}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.issues"}),url:"https://github.com/ant-design/x/issues",openExternal:!0},{icon:(0,s.jsx)(u.default,{}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.discussions"}),url:"https://github.com/ant-design/x/discussions",openExternal:!0},{icon:(0,s.jsx)(m.default,{}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.stackoverflow"}),url:"http://stackoverflow.com/questions/tagged/antd",openExternal:!0},{icon:(0,s.jsx)(m.default,{}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.segmentfault"}),url:"https://segmentfault.com/t/antd",openExternal:!0}]},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg",width:22,height:22,alt:"Ant XTech logo"}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.more-product"}),items:[{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg",width:16,height:16,alt:"yuque logo"}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.yuque"}),url:"https://yuque.com",description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.yuque.slogan"}),openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/antfincdn/nc7Fc0XBg5/8a6844f5-a6ed-4630-9177-4fa5d0b7dd47.png",width:16,height:16,alt:"AntV logo"}),title:"AntV",url:"https://antv.antgroup.com",description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.antv.slogan"}),openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://www.eggjs.org/logo.svg",alt:"Egg logo",width:16,height:16}),title:"Egg",url:"https://eggjs.org",description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.egg.slogan"}),openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/DMDOlAUhmktLyEODCMBR.ico",width:16,height:16,alt:"Kitchen logo"}),title:"Kitchen",description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.kitchen"}),url:"https://kitchen.alipay.com",openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://mdn.alipayobjects.com/huamei_j9rjmc/afts/img/A*3ittT5OEo2gAAAAAAAAAAAAADvGmAQ/original",width:16,height:16,alt:"Galacean logo"}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.galacean"}),description:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.galacean.slogan"}),url:"https://galacean.antgroup.com/",openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg",width:16,height:16,alt:"xtech logo"}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.xtech"}),url:"https://xtech.antfin.com/",openExternal:!0},{icon:(0,s.jsx)(r.default,{}),title:(0,s.jsx)(w.FormattedMessage,{id:"app.footer.theme"}),url:i("/theme-editor"),LinkComponent:y.LinkWithPrefetch}]}];},[o,e.search]);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(M.default,{columns:j,className:n.footer,bottom:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{style:{opacity:"0.4"},children:["Made with ",(0,s.jsx)("span",{style:{color:"#fff"},children:"\u2764"})," by"]}),(0,s.jsx)("div",{children:t.owner})]})}),(0,s.jsx)(k.default,{})]});};}}]);