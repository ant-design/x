(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["ec1f64f3"],{"128fba82":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return d;}});var i=n("777fffbe"),a=n("8090cfc0"),o=n("0ba2ace3"),s=i._(n("8c339db8"));let r=(0,o.createStyles)(({token:e,css:t})=>({container:t`
      width: 100%;
      margin: 0 auto;
      max-width: ${e.pcMaxWidth-2*e.pcContainerMargin}px;
      font-family: AlibabaPuHuiTi, ${e.fontFamily}, sans-serif;

      @media only screen and (max-width: ${e.pcMaxWidth}px) {
        max-width: calc(100vw - ${2*e.pcContainerMargin}px);
      }

      @media only screen and (max-width: ${e.mobileMaxWidth}px) {
        max-width: calc(100vw - ${2*e.marginLG}px);
      }
    `,title:t`
      font-size: 48px;
      color: #fff;
      text-align: center;
      padding-bottom: ${e.padding}px;

      @media only screen and (max-width: ${e.mobileMaxWidth}px) {
        font-size: ${e.fontSizeHeading1}px;
      }
    `,desc:t`
      color: ${e.colorTextSecondary};
      max-width: 880px !important;
      margin: 0 auto;
      text-align: center;
      padding-bottom: ${e.padding}px;
    `}));var d=e=>{let{styles:t}=r();return(0,a.jsxs)("div",{className:(0,s.default)(t.container,e.className),style:e.style,onClick:e.onClick,children:[e.title&&(0,a.jsx)("h2",{className:t.title,children:e.title}),e.desc&&(0,a.jsx)("p",{className:t.desc,children:e.desc}),e.children]});};},"17a683be":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return c;}});var i=n("777fffbe"),a=n("8090cfc0"),o=n("0ba2ace3"),s=i._(n("128fba82")),r=i._(n("e54b26fe"));let d=(0,o.createStyles)(({token:e,css:t})=>({container:t`
      overflow: hidden;
    `,content:t`
      display: grid;
      width: 100%;
      gap: ${e.padding+e.paddingSM}px;
      margin-top: ${e.marginXXL}px;
    `,item:t`
      background: #0c0e10cc;
      border-radius: ${24}px;
      padding: ${e.padding+e.paddingSM}px;
      overflow: hidden;
      position: relative;
      cursor: pointer;

      & :hover::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: ${24}px;
        padding: ${2*e.lineWidth}px;
        background: linear-gradient(180deg, #ffffff20 0%, #ffffff0d 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
      }
    `,item_header:t`
    `,item_content:t`
      display: flex;
      align-items: center;
      gap: ${e.paddingSM}px;
    `,item_icon:t`
      width: 32px;
      height: 32px;
      padding: ${e.paddingSM}px;
      border-radius: ${12}px;
      background: #ffffff1a;
      box-shadow: inset 0px 1px 1.5px 0px #ffffff80;
    `,item_title:t`
      display: flex;
      align-items: center;
      gap: ${e.paddingXS}px;
      font-size: ${e.fontSizeHeading4}px;
      font-weight: bold;
      margin-bottom: ${e.paddingXS}px;
    `,item_desc:t`
      text-align: start;
      font-size: ${e.fontSizeSM}px;
      opacity: 0.65;
    `,item_tag:t`
      border-radius: 4px;
      color: transparent;
      height: 24px;
      line-height: 24px;
      box-sizing: border-box;
      font-size: ${e.fontSizeSM}px;
      padding: 0 8px;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        width: 100%;
        height: 100%;

        background: #ffffff;
        opacity: 0.1;
      }
    `}));var c=e=>{var t,n;let{styles:i}=d();return(0,a.jsx)(s.default,{className:i.container,title:e.title,desc:e.desc,children:(0,a.jsx)("div",{className:i.content,style:{gridTemplateColumns:`repeat(${e.column||(null===(t=e.items)||void 0===t?void 0:t.length)}, 1fr)`},children:null===(n=e.items)||void 0===n?void 0:n.map(t=>(0,a.jsxs)("div",{className:i.item,style:e.cardStyle,onClick:t.onClick,children:[t.header&&(0,a.jsx)("div",{className:i.item_header,children:(0,a.jsx)(r.default,{children:t.header})}),(0,a.jsxs)("div",{className:i.item_content,children:[t.icon&&(0,a.jsx)("img",{className:i.item_icon,src:t.icon,alt:t.icon}),(0,a.jsxs)("div",{children:[(0,a.jsxs)("h3",{className:i.item_title,children:[t.title,t.tag&&(0,a.jsx)("span",{className:i.item_tag,style:{background:`linear-gradient(127deg, ${t.startColor||"#fff"} 23%, ${t.endColor||"#fff"} 100%)`,WebkitBackgroundClip:"text"},children:t.tag})]}),(0,a.jsx)("p",{className:i.item_desc,children:t.desc})]})]})]},`${t.title}`))})});};},"50f45460":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return u;}});var i=n("777fffbe"),a=n("8090cfc0"),o=n("0ba2ace3"),s=i._(n("8c339db8")),r=i._(n("0b8263ae")),d=i._(n("a5f16eac")),c=i._(n("9c5338b0")),l=i._(n("f69b9ec3")),f=i._(n("9b72ed83")),p=i._(n("22abf80f"));let g=(0,o.createStyles)(({token:e,css:t})=>({section:t`
      background: linear-gradient(180deg, #1e2226e6 0%, #1c2024 38%, #16191c 100%);
      border-radius: 40px 40px 0 0;
      backdrop-filter: blur(40px);
      display: flex;
      flex-direction: column;
      gap: ${e.pcContainerMargin}px;
      padding: ${e.pcContainerMargin}px 0;
    `,container:t`
      margin-top: -40px;
    `,framework:t`
      border-radius: 0;
      background-image: linear-gradient(90deg, #5a37e6 0%, #0059c9 100%);
    `}));var u=()=>{let{styles:e}=g();return(0,a.jsxs)("main",{children:[(0,a.jsx)(f.default,{}),(0,a.jsx)("section",{className:e.section,children:(0,a.jsx)(d.default,{})}),(0,a.jsx)("section",{className:(0,s.default)(e.section,e.container),children:(0,a.jsx)(l.default,{})}),(0,a.jsxs)("section",{className:(0,s.default)(e.section,e.container),children:[(0,a.jsx)(p.default,{}),(0,a.jsx)(r.default,{})]}),(0,a.jsx)("section",{className:(0,s.default)(e.section,e.framework,e.container),children:(0,a.jsx)(c.default,{})})]});};},"7bbae564":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.e(t,{default:function(){return r;},useStyle:function(){return s;}});var i=n("8090cfc0"),a=n("f153e352"),o=n("c5d21053");let s=(0,n("0ba2ace3").createStyles)(({css:e})=>({sender:e`
      background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%);
      position: relative;
      border: none;
      cursor: pointer;

      :hover {
        opacity: 0.85;
      }
    `}));var r=e=>{let{styles:t}=s();return(0,i.jsx)(a.Sender,{className:t.sender,actions:()=>(0,i.jsx)(o.Button,{type:"text",style:{padding:0},onClick:()=>{var t;return null==e?void 0:null===(t=e.onSubmit)||void 0===t?void 0:t.call(e,e.value);},icon:(0,i.jsx)("img",{alt:"send",loading:"lazy",src:"https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4e5sTY9lU3sAAAAAAAAAAAAADgCCAQ/original"})}),...e});};},e54b26fe:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.e(t,{DESIGN_STAGE_COLOR:function(){return d;},LOCALES:function(){return r;},default:function(){return l;},useCustomizationBgStyle:function(){return s;}});var i=n("8090cfc0"),a=n("f153e352"),o=n("0ba2ace3");let s=(0,o.createStyles)(({token:e,css:t})=>({background:t`
      background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%) !important;
      overflow: hidden;
      position: auto;

      &::after {
        content: '';
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: inherit;
        pointer-events: none;
        position: absolute;
        top: 0;
        bottom: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        padding: ${e.lineWidth}px;
        background: linear-gradient(180deg, #ffffff26 0%, #ffffff00 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
      };
    `})),r={cn:{greeting:"\u4F60\u597D, \u6211\u662F\u5168\u65B0 AI \u4EA7\u54C1\u521B\u9020\u52A9\u624B",greeting_short:"\u4F60\u597D, \u6211\u662F Ant Design X",description:"\u57FA\u4E8E Ant Design \u7684 AGI \u4EA7\u54C1\u667A\u80FD\u89E3\u51B3\u65B9\u6848, \u521B\u9020\u66F4\u7F8E\u597D\u7684\u667A\u80FD\u89C6\u754C",description_short:"\u57FA\u4E8E Ant Design \u7684 AGI \u4EA7\u54C1\u667A\u80FD\u89E3\u51B3\u65B9\u6848, \u521B\u9020\u66F4\u7F8E\u597D\u7684\u667A\u80FD\u89C6\u754C",help_text:"\u6211\u53EF\u4EE5\u5E2E\u60A8: ",conversations_group:"\u6700\u8FD1\u5BF9\u8BDD",send_placeholder:"\u8F93\u5165 / \u83B7\u53D6\u5EFA\u8BAE",hot_question:"\u70ED\u95E8\u8BDD\u9898",question1:"Ant Design X \u5168\u65B0\u5347\u7EA7\u4E86\u4EC0\u4E48? ",question2:"Ant Design X \u63A8\u51FA\u5168\u65B0 RICH \u8BBE\u8BA1\u89C4\u8303 ",question3:"Ant Design X \u7EC4\u4EF6\u8D44\u4EA7\u6709\u54EA\u4E9B? ",question4:"\u5FEB\u6765\u4E86\u89E3\u5168\u65B0AI\u65F6\u4EE3\u7684\u8BBE\u8BA1\u8303\u5F0F! ",design_guide:"Rich \u8BBE\u8BA1\u6307\u5357",empathy:"AI \u7406\u89E3\u7528\u6237\u8BC9\u6C42\u5E76\u89E3\u51B3",persona:"AI \u5BF9\u5916\u7684\u4EBA\u8BBE\u53CA\u5F62\u8C61",conversation:"AI \u5982\u4F55\u8868\u8FBE\u7528\u6237\u80FD\u542C\u61C2",interface:"AI \u517C\u987E\u201Cchat\u201D & \u201Cdo\u201D \u884C\u4E3A"},en:{greeting:"Hello, I am your AI Product Design Assistant",greeting_short:"Hello, I am Ant Design X",description:"Powered by Ant Design's AGI solution to enhance intelligent, aesthetic visual experiences",description_short:"Aesthetic visual experiences",help_text:"I can assist you with:",conversations_group:"History",send_placeholder:"Type / to get suggestions",hot_question:"Hot Topics",question1:"What are the new upgrades in X?",question2:"X has introduced the new RICH design guide.",question3:"What are the component assets in X?",question4:"Discover new design for the AI!",design_guide:"Rich Design Guidelines",empathy:"AI that understands and addresses user needs",persona:"Defining AI's persona and presentation",conversation:"Ensuring AI communicates clearly",interface:"Balancing 'chat' & 'do' functionalities"}},d={AWAKE:{START:"#6fb3e2",END:"#6c57ff"},EXPRESS:{START:"#6dd6f5",END:"#108c44"},CONFIRM:{START:"#ba2cb8",END:"#6c37e8"},FEEDBACK:{START:"#f7c348",END:"#f75972"},COMMON:{START:"#d857ff",END:"#8594ff"}},c=(0,o.createStyles)(({token:e,css:t})=>({welcome:t`
      display: flex;
      align-items: center;
      gap: ${e.paddingXS}px;
      position: relative;
      box-sizing: border-box;
      border-radius: ${20}px;
      padding: 18px;

      .ant-welcome-title {
        font-size: ${e.fontSize}px;
        font-weight: 400;
      }

      .ant-welcome-description {
        font-size: ${e.fontSizeSM-1}px;
        opacity: 0.65;        
      }
    `,prompts:t`
      border-radius: ${20}px !important;
      position: relative;

      .ant-prompts-desc {
        font-size: ${e.fontSizeSM}px !important;
        opacity: 0.9;
      }
      .ant-prompts-label {
        font-size: ${e.fontSize}px !important;
        font-weight: 400;
      }

      .ant-prompts-title {
        font-size: ${e.fontSize}px !important;
        padding-bottom: ${e.paddingXS}px;
      }
    `,sender:t`
      border-radius: ${40}px;
      height: 44px;
      display: flex;
      align-items: center;

      .ant-sender-content {
        padding: 0px ${e.paddingSM}px;
      }
    `,conversations:t`
      padding: ${e.padding}px;
      padding-top: 0;
      border-radius: ${20}px;
      position: relative;
    `,suggestion:t`
      border-radius: ${20}px;
      position: relative;
    `}));var l=e=>{let{styles:t}=c();return(0,i.jsx)(a.XProvider,{conversations:{className:t.conversations},sender:{className:t.sender},prompts:{className:t.prompts},welcome:{className:t.welcome},suggestion:{className:t.suggestion},children:e.children});};},ec1f64f3:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return i;}});var i=n("777fffbe")._(n("50f45460")).default;}}]);
//# sourceMappingURL=ec1f64f3-async.76b140c2.js.map