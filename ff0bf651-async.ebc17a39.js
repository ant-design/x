(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["ff0bf651"],{"7e531f8e":function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return u;}});var n=o("777fffbe"),s=o("852bbaa9"),i=o("8090cfc0"),r=o("c7cef649"),a=o("0ba2ace3"),l=s._(o("3e6b097d")),d=n._(o("40ff87e3"));let p="ant-where-checker",c={cn:{whereNotSupport:`\u{4F60}\u{7684}\u{6D4F}\u{89C8}\u{5668}\u{4E0D}\u{652F}\u{6301}\u{73B0}\u{4EE3} CSS Selector\u{FF0C}\u{8BF7}\u{4F7F}\u{7528}\u{73B0}\u{4EE3}\u{6D4F}\u{89C8}\u{5668}\u{FF08}\u{5982} Chrome\u{3001}Firefox \u{7B49}\u{7B49}\u{FF09}\u{67E5}\u{770B}\u{5B98}\u{7F51}\u{3002}\u{5982}\u{679C}\u{9700}\u{8981}\u{5BF9}\u{65E7}\u{7248}\u{6D4F}\u{89C8}\u{5668}\u{8FDB}\u{884C}\u{6837}\u{5F0F}\u{652F}\u{6301}\u{FF0C}\u{6B22}\u{8FCE}\u{67E5}\u{9605}\u{914D}\u{7F6E}\u{6587}\u{6863}\u{FF1A}`,whereDocTitle:"\u517C\u5BB9\u6027\u8C03\u6574\uFF08\u8BF7\u4F7F\u7528\u73B0\u4EE3\u6D4F\u89C8\u5668\u8BBF\u95EE\uFF09",whereDocUrl:"/docs/react/customize-theme-cn#\u517C\u5BB9\u6027\u8C03\u6574"},en:{whereNotSupport:"Your browser not support modern CSS Selector. Please use modern browser to view (e.g. Chrome, Firefox, etc). If you want to compatible style with legacy browser, please refer to the configuration document:",whereDocTitle:"Compatible adjustment (Please use modern browser to visit)",whereDocUrl:"/docs/react/customize-theme#compatible-adjustment"}},g=(0,a.createStyles)(({css:e,token:t})=>({container:e`
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
  `}));var u=()=>{let[e]=(0,d.default)(c),[t,o]=l.useState(!0);l.useEffect(()=>{let e=document.createElement("p");e.className=p,e.style.position="fixed",e.style.pointerEvents="none",e.style.visibility="hidden",e.style.width="0",document.body.appendChild(e),(0,r.updateCSS)(`
:where(.${p}) {
  content: "__CHECK__";
}
    `,p);let{content:t}=getComputedStyle(e);o(String(t).includes("CHECK")),document.body.removeChild(e),(0,r.removeCSS)(p);},[]);let{styles:n}=g();return t?null:(0,i.jsx)("div",{className:n.container,children:(0,i.jsxs)("div",{className:n.alertBox,children:[e.whereNotSupport," ",(0,i.jsx)("a",{href:e.whereDocUrl,children:e.whereDocTitle})]})});};},ff0bf651:function(e,t,o){"use strict";o.d(t,"__esModule",{value:!0}),o.d(t,"default",{enumerable:!0,get:function(){return j;}});var n=o("777fffbe"),s=o("8090cfc0"),i=o("5a936b41"),r=o("2020273b"),a=n._(o("6c0a143f")),l=o("0ba2ace3"),d=o("64d8f06c"),p=n._(o("dcc72ee4")),c=n._(o("3e6b097d")),g=n._(o("40ff87e3")),u=n._(o("8dc5e1a9")),m=n._(o("f90be3ac")),h=n._(o("7e531f8e"));let x={cn:{owner:"\u8682\u8681\u96C6\u56E2\u548C Ant Design \u5F00\u6E90\u793E\u533A"},en:{owner:"Ant Group and Ant Design Community"}},f=()=>{let{isMobile:e}=c.default.use(m.default);return(0,l.createStyles)(({token:t,css:o})=>{let n=new i.FastColor((0,a.default)("#f0f3fa","#fff")).onBackground(t.colorBgContainer).toHexString();return{holder:o`
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
      `};})();};var j=()=>{let e=(0,u.default)(),[t,o]=(0,g.default)(x),{styles:n}=f(),{getLink:i}=e,a=c.default.useMemo(()=>{let e="cn"===o,t={title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.resources"}),items:[{title:"Ant Design",url:e?"https://ant-design.antgroup.com/index-cn":"https://ant.design",openExternal:!0},{title:"Ant Design Charts",url:e?"https://ant-design-charts.antgroup.com":"https://charts.ant.design",openExternal:!0},{title:"Ant Design Pro",url:"https://pro.ant.design",openExternal:!0},{title:"Pro Components",url:e?"https://pro-components.antdigital.dev":"https://procomponents.ant.design",openExternal:!0},{title:"Ant Design Mobile",url:e?"https://ant-design-mobile.antgroup.com/zh":"https://mobile.ant.design",openExternal:!0},{title:"Ant Design Mini",url:e?"https://ant-design-mini.antgroup.com/":"https://mini.ant.design",openExternal:!0},{title:"Ant Design Web3",url:e?"https://web3.antdigital.dev":"https://web3.ant.design",openExternal:!0},{title:"Ant Design Landing",description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.landing"}),url:"https://landing.ant.design",openExternal:!0},{title:"Scaffolds",description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.scaffolds"}),url:"https://scaffold.ant.design",openExternal:!0},{title:"Umi",description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.umi"}),url:"https://umijs.org",openExternal:!0},{title:"dumi",description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.dumi"}),url:"https://d.umijs.org",openExternal:!0},{title:"qiankun",description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.qiankun"}),url:"https://qiankun.umijs.org",openExternal:!0},{title:"Ant Motion",description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.motion"}),url:"https://motion.ant.design",openExternal:!0},{title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.chinamirror"}),url:"https://ant-design.antgroup.com"}]},n={title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.community"}),items:[{icon:(0,s.jsx)(r.AntDesignOutlined,{}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.awesome"}),url:"https://github.com/websemantics/awesome-ant-design",openExternal:!0},{icon:(0,s.jsx)(r.MediumOutlined,{}),title:"Medium",url:"http://medium.com/ant-design/",openExternal:!0},{icon:(0,s.jsx)(r.TwitterOutlined,{style:{color:"#1DA1F2"}}),title:"Twitter",url:"http://twitter.com/antdesignui",openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg",width:16,height:16,alt:"yuque logo"}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.yuque.repo"}),url:"https://yuque.com/ant-design/ant-design",openExternal:!0},{icon:(0,s.jsx)(r.ZhihuOutlined,{style:{color:"#056de8"}}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.zhihu"}),url:"https://www.zhihu.com/column/c_1564262000561106944",openExternal:!0},{icon:(0,s.jsx)(r.ZhihuOutlined,{style:{color:"#056de8"}}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.zhihu.xtech"}),url:"https://www.zhihu.com/column/c_1543658574504751104",openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/mZBWtboYbnMkTBaRIuWQ.png",width:16,height:16,alt:"seeconf logo"}),title:"SEE Conf",description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.seeconf"}),url:"https://seeconf.antfin.com/",openExternal:!0}]};return e&&n.items.push({icon:(0,s.jsx)(r.UsergroupAddOutlined,{}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.work_with_us"}),url:i("/docs/resources",{cn:"\u52A0\u5165\u6211\u4EEC",en:"JoinUs"}),LinkComponent:d.Link}),[t,n,{title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.help"}),items:[{icon:(0,s.jsx)(r.GithubOutlined,{}),title:"GitHub",url:"https://github.com/ant-design/x",openExternal:!0},{icon:(0,s.jsx)(r.HistoryOutlined,{}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.change-log"}),url:i("/changelog"),LinkComponent:d.Link},{icon:(0,s.jsx)(r.QuestionCircleOutlined,{}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.faq"}),url:i("/docs/react/faq"),LinkComponent:d.Link},{icon:(0,s.jsx)(r.BugOutlined,{}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.bug-report"}),url:"https://github.com/ant-design/x/issues/new?template=bug_report.yml",openExternal:!0},{icon:(0,s.jsx)(r.IssuesCloseOutlined,{}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.issues"}),url:"https://github.com/ant-design/x/issues",openExternal:!0},{icon:(0,s.jsx)(r.MessageOutlined,{}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.discussions"}),url:"https://github.com/ant-design/x/discussions",openExternal:!0},{icon:(0,s.jsx)(r.QuestionCircleOutlined,{}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.stackoverflow"}),url:"http://stackoverflow.com/questions/tagged/antd",openExternal:!0},{icon:(0,s.jsx)(r.QuestionCircleOutlined,{}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.segmentfault"}),url:"https://segmentfault.com/t/antd",openExternal:!0}]},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg",width:22,height:22,alt:"Ant XTech logo"}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.more-product"}),items:[{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg",width:16,height:16,alt:"yuque logo"}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.yuque"}),url:"https://yuque.com",description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.yuque.slogan"}),openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/antfincdn/nc7Fc0XBg5/8a6844f5-a6ed-4630-9177-4fa5d0b7dd47.png",width:16,height:16,alt:"AntV logo"}),title:"AntV",url:"https://antv.antgroup.com",description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.antv.slogan"}),openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://www.eggjs.org/logo.svg",alt:"Egg logo",width:16,height:16}),title:"Egg",url:"https://eggjs.org",description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.egg.slogan"}),openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/DMDOlAUhmktLyEODCMBR.ico",width:16,height:16,alt:"Kitchen logo"}),title:"Kitchen",description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.kitchen"}),url:"https://kitchen.alipay.com",openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://mdn.alipayobjects.com/huamei_j9rjmc/afts/img/A*3ittT5OEo2gAAAAAAAAAAAAADvGmAQ/original",width:16,height:16,alt:"Galacean logo"}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.galacean"}),description:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.galacean.slogan"}),url:"https://galacean.antgroup.com/",openExternal:!0},{icon:(0,s.jsx)("img",{src:"https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg",width:16,height:16,alt:"xtech logo"}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.xtech"}),url:"https://xtech.antfin.com/",openExternal:!0},{icon:(0,s.jsx)(r.BgColorsOutlined,{}),title:(0,s.jsx)(d.FormattedMessage,{id:"app.footer.theme"}),url:i("/theme-editor"),LinkComponent:d.Link}]}];},[o,e.search]);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(p.default,{columns:a,className:n.footer,bottom:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{style:{opacity:"0.4"},children:["Made with ",(0,s.jsx)("span",{style:{color:"#fff"},children:"\u2764"})," by"]}),(0,s.jsx)("div",{children:t.owner})]})}),(0,s.jsx)(h.default,{})]});};}}]);
//# sourceMappingURL=ff0bf651-async.ebc17a39.js.map