(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["42cdb4ea"],{"1535932b":function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.e(t,{CustomizationBubble:function(){return h;},CustomizationPrompts:function(){return A;},CustomizationWelcome:function(){return m;}});var s=i("777fffbe"),n=i("8090cfc0"),a=s._(i("5d78c473")),o=s._(i("17d19f0f")),d=s._(i("a7202df0")),r=s._(i("0a1da924")),l=s._(i("8dce4a14")),c=s._(i("80f564e5")),f=i("2bb52879"),p=s._(i("40ff87e3")),u=i("cb1953a5");let g=(0,f.createStyles)(({token:e,css:t})=>({actions:t`
      width: 230px;
      display: flex;
      align-items: end;
      justify-content: end;
      gap: ${e.paddingSM}px;
      opacity: 0.65;
    `})),m=e=>{let[t]=(0,p.default)(u.LOCALES),{styles:{background:i}}=(0,u.useCustomizationBgStyle)();return(0,n.jsx)(c.default,{style:{width:290},icon:"https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp",title:t.greeting_short,description:t.description_short,className:i,...e});},A=e=>{let[t]=(0,p.default)(u.LOCALES),{styles:{background:i}}=(0,u.useCustomizationBgStyle)();return(0,n.jsx)(l.default,{styles:{item:{width:290,borderRadius:20},list:{borderRadius:20}},classNames:{item:i},items:[{key:"1",label:`\u{1F389} ${t.greeting}`,description:t.description,children:[{key:"1-1",description:t.question1},{key:"1-2",description:t.question4}]}],...e});},h=e=>{let{styles:t}=g(),[i]=(0,p.default)(u.LOCALES),{styles:{background:s}}=(0,u.useCustomizationBgStyle)();return(0,n.jsx)(r.default,{classNames:{content:s},footer:(0,n.jsxs)("div",{className:t.actions,children:[(0,n.jsx)(o.default,{}),(0,n.jsx)(a.default,{}),(0,n.jsx)(d.default,{})]}),...e,content:e.content||i.question1});};},"42cdb4ea":function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return g;}});var s=i("777fffbe"),n=i("8090cfc0"),a=i("2bb52879"),o=s._(i("3e6b097d")),d=s._(i("40ff87e3")),r=i("cb1953a5"),l=s._(i("d7cdd4eb")),c=s._(i("8ff5a1c9")),f=i("1535932b");let p={cn:{title:"\u7EC4\u4EF6\u4E30\u5BCC , \u9009\u7528\u81EA\u5982",desc:"Ant Design X \u5168\u65B0 AI \u7EC4\u4EF6 , \u5927\u91CF\u5B9E\u7528\u7EC4\u4EF6\u6EE1\u8DB3\u4F60\u7684\u9700\u6C42 , \u7075\u6D3B\u5B9A\u5236\u4E0E\u62D3\u5C55",welcome_title:"\u6B22\u8FCE\u7EC4\u4EF6",welcome_desc:"\u5F00\u7BB1\u5373\u7528\u3001\u6613\u4E8E\u914D\u7F6E\u3001\u6781\u81F4\u4F53\u9A8C\u7684\u901A\u7528\u56FE\u8868\u5E93",welcome_tag:"\u5524\u9192",prompts_title:"\u7528\u6237\u63A8\u8350",prompts_desc:"\u8BA9\u9996\u6B21\u63A5\u89E6AI\u4EA7\u54C1\u7684\u7528\u6237\u5FEB\u901F\u7406\u89E3AI\u80FD\u505A\u4EC0\u4E48",prompts_tag:"\u5524\u9192",suggestion_title:"\u5FEB\u6377\u547D\u4EE4",suggestion_desc:"\u5F00\u7BB1\u5373\u7528\u3001\u6613\u4E8E\u914D\u7F6E\u3001\u6781\u81F4\u4F53\u9A8C\u7684\u901A\u7528\u56FE\u8868\u5E93",suggestion_tag:"\u8868\u8FBE",bubble_title:"\u8FDB\u5EA6\u52A0\u8F7D",bubble_desc:"\u5F00\u7BB1\u5373\u7528\u3001\u6613\u4E8E\u914D\u7F6E\u3001\u6781\u81F4\u4F53\u9A8C\u7684\u901A\u7528\u56FE\u8868\u5E93",bubble_tag:"\u786E\u8BA4",actions_title:"\u7ED3\u679C\u64CD\u4F5C",actions_desc:"\u5F00\u7BB1\u5373\u7528\u3001\u6613\u4E8E\u914D\u7F6E\u3001\u6781\u81F4\u4F53\u9A8C\u7684\u901A\u7528\u56FE\u8868\u5E93",actions_tag:"\u53CD\u9988",conversations_title:"\u7BA1\u7406\u5BF9\u8BDD",conversations_desc:"\u5F00\u7BB1\u5373\u7528\u3001\u6613\u4E8E\u914D\u7F6E\u3001\u6781\u81F4\u4F53\u9A8C\u7684\u901A\u7528\u56FE\u8868\u5E93",conversations_tag:"\u901A\u7528"},en:{title:"Components Rich, Easy to Use",desc:"Ant Design X\u2019s new AI components offer a wide range of practical options to meet your needs, with flexible customization and expansion",welcome_title:"Welcome",welcome_desc:"Ready to use, easy to set up, with great user experience",welcome_tag:"Activate",prompts_title:"User Guide",prompts_desc:"Helps new users quickly understand AI capabilities",prompts_tag:"Activate",suggestion_title:"Quick Commands",suggestion_desc:"Ready to use, easy to set up, with great user experience",suggestion_tag:"Execute",bubble_title:"Loading Progress",bubble_desc:"Ready to use, easy to set up, with great user experience",bubble_tag:"Confirm",actions_title:"Results",actions_desc:"Ready to use, easy to set up, with great user experience",actions_tag:"Feedback",conversations_title:"Manage Chats",conversations_desc:"Ready to use, easy to set up, with great user experience",conversations_tag:"General"}},u=(0,a.createStyles)(({css:e})=>({header:e`
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
    `}));var g=()=>{let{styles:e}=u(),[t,i]=(0,d.default)(p),s="cn"===i,{isMobile:a}=o.default.useContext(c.default),g=[{title:t.welcome_title,desc:t.welcome_desc,tag:t.welcome_tag,startColor:r.DESIGN_STAGE_COLOR.AWAKE.START,endColor:r.DESIGN_STAGE_COLOR.AWAKE.END,header:(0,n.jsx)("div",{className:e.header,children:(0,n.jsx)(f.CustomizationWelcome,{})})},{title:t.prompts_title,desc:t.prompts_desc,tag:t.prompts_tag,startColor:r.DESIGN_STAGE_COLOR.AWAKE.START,endColor:r.DESIGN_STAGE_COLOR.AWAKE.END,header:(0,n.jsx)("div",{className:e.header,children:(0,n.jsx)(f.CustomizationPrompts,{})})},{title:t.suggestion_title,desc:t.suggestion_desc,tag:t.suggestion_tag,startColor:r.DESIGN_STAGE_COLOR.EXPRESS.START,endColor:r.DESIGN_STAGE_COLOR.EXPRESS.END,header:(0,n.jsx)("div",{className:e.header,children:(0,n.jsx)("img",{loading:"lazy",alt:"thumbnails",style:{width:290},src:s?"https://mdn.alipayobjects.com/huamei_k0vkmw/afts/img/A*-c6EQ7U4-4oAAAAAAAAAAAAADsR-AQ/fmt.avif":"https://mdn.alipayobjects.com/huamei_k0vkmw/afts/img/A*SUJFTbqovJsAAAAAAAAAAAAADsR-AQ/fmt.avif"})})},{title:t.bubble_title,desc:t.bubble_desc,tag:t.bubble_tag,startColor:r.DESIGN_STAGE_COLOR.CONFIRM.START,endColor:r.DESIGN_STAGE_COLOR.CONFIRM.END,header:(0,n.jsx)("div",{className:e.header,children:(0,n.jsx)("img",{loading:"lazy",alt:"thumbnails",style:{width:173},src:s?"https://mdn.alipayobjects.com/huamei_k0vkmw/afts/img/A*WxlPTYGnviYAAAAAAAAAAAAADsR-AQ/fmt.avif":"https://mdn.alipayobjects.com/huamei_k0vkmw/afts/img/A*EDPdR54UBncAAAAAAAAAAAAADsR-AQ/fmt.avif"})})},{title:t.actions_title,desc:t.actions_desc,tag:t.actions_tag,startColor:r.DESIGN_STAGE_COLOR.FEEDBACK.START,endColor:r.DESIGN_STAGE_COLOR.FEEDBACK.END,header:(0,n.jsx)("div",{className:e.header,children:(0,n.jsx)(f.CustomizationBubble,{content:""})})},{title:t.conversations_title,desc:t.conversations_desc,tag:t.conversations_tag,startColor:r.DESIGN_STAGE_COLOR.COMMON.START,endColor:r.DESIGN_STAGE_COLOR.COMMON.END,header:(0,n.jsx)("div",{className:e.header,children:(0,n.jsx)("img",{loading:"lazy",alt:"thumbnails",style:{width:290},src:"https://mdn.alipayobjects.com/huamei_k0vkmw/afts/img/A*7nVeT7Qg-QoAAAAAAAAAAAAADsR-AQ/fmt.avif"})})}];return(0,n.jsx)(l.default,{title:t.title,desc:t.desc,items:g,column:a?1:3});};},c5e8d449:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return d;}});var s=i("8090cfc0"),n=i("2bb52879"),a=i("46c8afcf");let o=(0,n.createStyles)(({token:e,css:t})=>({container:t`
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
    `}));var d=e=>{let{styles:t}=o();return(0,s.jsxs)("div",{className:(0,a.clsx)(t.container,e.className),style:e.style,onClick:e.onClick,children:[e.title&&(0,s.jsx)("h2",{className:t.title,children:e.title}),e.desc&&(0,s.jsx)("p",{className:t.desc,children:e.desc}),e.children]});};},cb1953a5:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.e(t,{DESIGN_STAGE_COLOR:function(){return l;},LOCALES:function(){return r;},default:function(){return f;},useCustomizationBgStyle:function(){return d;}});var s=i("777fffbe"),n=i("8090cfc0"),a=s._(i("bdbc82f3")),o=i("2bb52879");let d=(0,o.createStyles)(({token:e,css:t})=>({background:t`
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
    `})),r={cn:{greeting:"\u4F60\u597D, \u6211\u662F\u5168\u65B0 AI \u4EA7\u54C1\u521B\u9020\u52A9\u624B",greeting_short:"\u4F60\u597D, \u6211\u662F Ant Design X",description:"\u57FA\u4E8E Ant Design \u7684 AGI \u4EA7\u54C1\u667A\u80FD\u89E3\u51B3\u65B9\u6848, \u521B\u9020\u66F4\u7F8E\u597D\u7684\u667A\u80FD\u89C6\u754C",description_short:"\u57FA\u4E8E Ant Design \u7684 AGI \u4EA7\u54C1\u667A\u80FD\u89E3\u51B3\u65B9\u6848, \u521B\u9020\u66F4\u7F8E\u597D\u7684\u667A\u80FD\u89C6\u754C",help_text:"\u6211\u53EF\u4EE5\u5E2E\u60A8: ",conversations_group:"\u6700\u8FD1\u5BF9\u8BDD",send_placeholder:"\u8F93\u5165 / \u83B7\u53D6\u5EFA\u8BAE",hot_question:"\u70ED\u95E8\u8BDD\u9898",question1:"Ant Design X \u5168\u65B0\u5347\u7EA7\u4E86\u4EC0\u4E48? ",question2:"Ant Design X \u63A8\u51FA\u5168\u65B0 RICH \u8BBE\u8BA1\u89C4\u8303 ",question3:"Ant Design X \u7EC4\u4EF6\u8D44\u4EA7\u6709\u54EA\u4E9B? ",question4:"\u5FEB\u6765\u4E86\u89E3\u5168\u65B0AI\u65F6\u4EE3\u7684\u8BBE\u8BA1\u8303\u5F0F! ",design_guide:"Rich \u8BBE\u8BA1\u6307\u5357",empathy:"AI \u7406\u89E3\u7528\u6237\u8BC9\u6C42\u5E76\u89E3\u51B3",persona:"AI \u5BF9\u5916\u7684\u4EBA\u8BBE\u53CA\u5F62\u8C61",conversation:"AI \u5982\u4F55\u8868\u8FBE\u7528\u6237\u80FD\u542C\u61C2",interface:"AI \u517C\u987E\u201Cchat\u201D & \u201Cdo\u201D \u884C\u4E3A"},en:{greeting:"Hello, I am your AI Product Design Assistant",greeting_short:"Hello, I am Ant Design X",description:"Powered by Ant Design's AGI solution to enhance intelligent, aesthetic visual experiences",description_short:"Aesthetic visual experiences",help_text:"I can assist you with:",conversations_group:"History",send_placeholder:"Type / to get suggestions",hot_question:"Hot Topics",question1:"What are the new upgrades in X?",question2:"X has introduced the new RICH design guide.",question3:"What are the component assets in X?",question4:"Discover new design for the AI!",design_guide:"Rich Design Guidelines",empathy:"AI that understands and addresses user needs",persona:"Defining AI's persona and presentation",conversation:"Ensuring AI communicates clearly",interface:"Balancing 'chat' & 'do' functionalities"}},l={AWAKE:{START:"#6fb3e2",END:"#6c57ff"},EXPRESS:{START:"#6dd6f5",END:"#108c44"},CONFIRM:{START:"#ba2cb8",END:"#6c37e8"},FEEDBACK:{START:"#f7c348",END:"#f75972"},COMMON:{START:"#d857ff",END:"#8594ff"}},c=(0,o.createStyles)(({token:e,css:t})=>({welcome:t`
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
    `}));var f=e=>{let{styles:t}=c();return(0,n.jsx)(a.default,{conversations:{className:t.conversations},sender:{className:t.sender},prompts:{className:t.prompts},welcome:{className:t.welcome},suggestion:{className:t.suggestion},children:e.children});};},d69d0489:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.e(t,{default:function(){return r;},useStyle:function(){return d;}});var s=i("777fffbe"),n=i("8090cfc0"),a=s._(i("1bd097dd")),o=s._(i("bf2579c8"));let d=(0,i("2bb52879").createStyles)(({css:e,token:t})=>({sender:e`
      margin-inline: ${2*t.paddingSM}px;
      background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%);
      position: relative;
      border: none;
      cursor: pointer;
      :hover {
        opacity: 0.85;
      }
    `}));var r=e=>{let{styles:t}=d();return(0,n.jsx)(a.default,{className:t.sender,style:{width:"calc(100% - 48px)"},suffix:()=>(0,n.jsx)(o.default,{type:"text",style:{padding:0},onClick:()=>{var t;return null==e?void 0:null===(t=e.onSubmit)||void 0===t?void 0:t.call(e,e.value);},icon:(0,n.jsx)("img",{alt:"send",loading:"lazy",src:"https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4e5sTY9lU3sAAAAAAAAAAAAADgCCAQ/original"})}),...e});};},d7cdd4eb:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return c;}});var s=i("777fffbe"),n=i("8090cfc0"),a=i("2bb52879"),o=s._(i("9db50d7e")),d=s._(i("c5e8d449")),r=s._(i("cb1953a5"));let l=(0,a.createStyles)(({token:e,css:t})=>({container:t`
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
    `}));var c=e=>{var t,i;let{styles:s}=l();return(0,n.jsx)(d.default,{className:s.container,title:e.title,desc:e.desc,children:(0,n.jsx)("div",{className:s.content,style:{gridTemplateColumns:`repeat(${e.column||(null===(t=e.items)||void 0===t?void 0:t.length)}, 1fr)`},children:null===(i=e.items)||void 0===i?void 0:i.map(t=>{let i=(0,n.jsxs)(n.Fragment,{children:[t.header&&(0,n.jsx)("div",{className:s.item_header,children:(0,n.jsx)(r.default,{children:t.header})}),(0,n.jsxs)("div",{className:s.item_content,children:[t.icon&&(0,n.jsx)("img",{className:s.item_icon,src:t.icon,alt:t.icon}),(0,n.jsxs)("div",{children:[(0,n.jsxs)("h3",{className:s.item_title,children:[t.title,t.tag&&(0,n.jsx)("span",{className:s.item_tag,style:{background:`linear-gradient(127deg, ${t.startColor||"#fff"} 23%, ${t.endColor||"#fff"} 100%)`,WebkitBackgroundClip:"text"},children:t.tag})]}),(0,n.jsx)("p",{className:s.item_desc,children:t.desc})]})]})]});return t.to&&"string"==typeof t.to&&t.to.startsWith("http")?(0,n.jsx)("a",{className:s.item,style:e.cardStyle,href:t.to,target:"_blank",rel:"noopener noreferrer",children:i},`${t.title}`):t.to?(0,n.jsx)(o.default,{className:s.item,style:e.cardStyle,to:t.to,children:i},`${t.title}`):(0,n.jsx)("div",{className:s.item,style:e.cardStyle,children:i},`${t.title}`);})})});};}}]);