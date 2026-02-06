(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["13567842"],{13567842:function(e,s,i){"use strict";i.d(s,"__esModule",{value:!0}),i.d(s,"default",{enumerable:!0,get:function(){return x;}});var n=i("777fffbe"),t=i("8090cfc0"),l=i("2020273b"),a=i("c5d21053"),r=i("0ba2ace3"),o=i("46c8afcf"),c=n._(i("40ff87e3")),d=n._(i("b2e08bc7"));let u="https://picx.zhimg.com/v2-3b2bca09c2771e7a82a81562e806be4d.jpg?source=d16d100b",g=(0,r.createStyles)(({token:e,css:s})=>({card:s`
    width: 100%;
    margin: ${2*e.marginMD}px 0;
    transition: all ${e.motionDurationMid};
    background-color: ${e.colorFillQuaternary};
  `,bigTitle:s`
    color: #121212;
    font-size: ${e.fontSizeLG}px;
    margin-bottom: ${e.marginLG}px;
    font-weight: ${e.fontWeightStrong};
  `,cardBody:s`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,leftCard:s`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img {
      width: 200px;
      overflow: hidden;
      margin-inline-end: ${e.marginLG}px;
      border-radius: ${e.borderRadiusLG}px;
    }
  `,title:s`
    color: #444;
    font-size: ${e.fontSizeLG}px;
    font-weight: ${e.fontWeightStrong};
    user-select: none;
  `,subTitle:s`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #646464;
    font-size: ${e.fontSize}px;
    font-weight: 400;
    margin-top: ${e.marginXS}px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,logo:s`
    width: 24px;
    height: 24px;
    font-size: 24px;
    &.zhihu-logo {
      color: #056de8;
    }
    &.yuque-logo {
      color: #00b96b;
    }
    &.juejin-logo {
      color: #1e80ff;
    }
  `,arrowIcon:s`
    color: #8a8f8d;
    margin: 0 ${e.marginXS}px;
    font-size: ${e.fontSizeSM}px;
  `,zlBtn:s`
    padding: 0;
    color: #646464;
  `,discussLogo:s`
    width: 16px;
    height: 16px;
    font-size: 16px;
  `})),h={cn:{bigTitle:"\u6587\u7AE0\u88AB\u4EE5\u4E0B\u4E13\u680F\u6536\u5F55\uFF1A",zhiHu:"\u4E00\u4E2A UI \u8BBE\u8BA1\u4F53\u7CFB",yuQue:"Ant Design \u5B98\u65B9\u4E13\u680F",junjin:"Ant Design \u5F00\u6E90\u4E13\u680F",buttonText:"\u6211\u6709\u60F3\u6CD5\uFF0C\u53BB\u53C2\u4E0E\u8BA8\u8BBA"},en:{bigTitle:"Articles are included in the column:",zhiHu:"A UI design system",yuQue:"Ant Design official column",junjin:"Ant Design Open Source Column",buttonText:"Go to discuss"}};var x=({zhihuLink:e,yuqueLink:s,juejinLink:i})=>{let[n]=(0,c.default)(h),{styles:{card:r,bigTitle:x,cardBody:m,leftCard:f,title:j,subTitle:p,logo:b,arrowIcon:v,zlBtn:y,discussLogo:L}}=g();return e||s||i?(0,t.jsxs)(a.Card,{className:r,variant:"borderless",children:[(0,t.jsx)("h3",{className:x,children:n.bigTitle}),e&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.Divider,{}),(0,t.jsxs)("div",{className:m,children:[(0,t.jsxs)("div",{className:f,children:[(0,t.jsx)("img",{draggable:!1,src:u,alt:"@ant-design/x"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:j,children:"Ant Design"}),(0,t.jsxs)("div",{className:p,children:[(0,t.jsx)(l.ZhihuOutlined,{className:(0,o.clsx)(b,"zhihu-logo")}),(0,t.jsx)(l.RightOutlined,{className:v}),(0,t.jsx)(a.Button,{target:"_blank",href:"https://www.zhihu.com/column/c_1564262000561106944",className:y,type:"link",children:n.zhiHu})]})]})]}),(0,t.jsx)(a.Button,{ghost:!0,type:"primary",icon:(0,t.jsx)(l.ZhihuOutlined,{className:L}),target:"_blank",href:e,children:n.buttonText})]})]}),s&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.Divider,{}),(0,t.jsxs)("div",{className:m,children:[(0,t.jsxs)("div",{className:f,children:[(0,t.jsx)("img",{draggable:!1,src:u,alt:"@ant-design/x"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:j,children:"Ant Design"}),(0,t.jsxs)("div",{className:p,children:[(0,t.jsx)(l.YuqueOutlined,{className:(0,o.clsx)(b,"yuque-logo")}),(0,t.jsx)(l.RightOutlined,{className:v}),(0,t.jsx)(a.Button,{target:"_blank",href:"https://www.yuque.com/ant-design/ant-design",className:y,type:"link",children:n.yuQue})]})]})]}),(0,t.jsx)(a.Button,{ghost:!0,type:"primary",icon:(0,t.jsx)(l.YuqueOutlined,{className:L}),target:"_blank",href:s,children:n.buttonText})]})]}),i&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.Divider,{}),(0,t.jsxs)("div",{className:m,children:[(0,t.jsxs)("div",{className:f,children:[(0,t.jsx)("img",{draggable:!1,src:u,alt:"@ant-design/x"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:j,children:"Ant Design"}),(0,t.jsxs)("div",{className:p,children:[(0,t.jsx)(d.default,{className:(0,o.clsx)(b,"juejin-logo")}),(0,t.jsx)(l.RightOutlined,{className:v}),(0,t.jsx)(a.Button,{target:"_blank",href:"https://juejin.cn/column/7247354308258054200",className:y,type:"link",children:n.junjin})]})]})]}),(0,t.jsx)(a.Button,{ghost:!0,type:"primary",icon:(0,t.jsx)(d.default,{className:L}),target:"_blank",href:i,children:n.buttonText})]})]})]}):null;};},b2e08bc7:function(e,s,i){"use strict";i.d(s,"__esModule",{value:!0}),i.d(s,"default",{enumerable:!0,get:function(){return t;}});var n=i("8090cfc0"),t=e=>{let{className:s,style:i}=e;return(0,n.jsxs)("svg",{className:s,style:i,xmlns:"http://www.w3.org/2000/svg",width:"36",height:"28",viewBox:"0 0 36 28",fill:"none",children:[(0,n.jsx)("title",{children:"Juejin logo"}),(0,n.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M17.5875 6.77268L21.8232 3.40505L17.5875 0.00748237L17.5837 0L13.3555 3.39757L17.5837 6.76894L17.5875 6.77268ZM17.5863 17.3955H17.59L28.5161 8.77432L25.5526 6.39453L17.59 12.6808H17.5863L17.5825 12.6845L9.61993 6.40201L6.66016 8.78181L17.5825 17.3992L17.5863 17.3955ZM17.5828 23.2891L17.5865 23.2854L32.2133 11.7456L35.1768 14.1254L28.5238 19.3752L17.5865 28L0.284376 14.3574L0 14.1291L2.95977 11.7531L17.5828 23.2891Z",fill:"currentColor"})]});};}}]);
//# sourceMappingURL=13567842-async.ceab11dc.js.map