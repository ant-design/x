(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["f4aeb400"],{c5e8d449:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return r;}});var n=i("8090cfc0"),a=i("0ba2ace3"),s=i("46c8afcf");let o=(0,a.createStyles)(({token:e,css:t})=>({container:t`
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
    `}));var r=e=>{let{styles:t}=o();return(0,n.jsxs)("div",{className:(0,s.clsx)(t.container,e.className),style:e.style,onClick:e.onClick,children:[e.title&&(0,n.jsx)("h2",{className:t.title,children:e.title}),e.desc&&(0,n.jsx)("p",{className:t.desc,children:e.desc}),e.children]});};},cb1953a5:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.e(t,{DESIGN_STAGE_COLOR:function(){return c;},LOCALES:function(){return r;},default:function(){return l;},useCustomizationBgStyle:function(){return o;}});var n=i("8090cfc0"),a=i("2bcf28f3"),s=i("0ba2ace3");let o=(0,s.createStyles)(({token:e,css:t})=>({background:t`
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
    `})),r={cn:{greeting:"\u4F60\u597D, \u6211\u662F\u5168\u65B0 AI \u4EA7\u54C1\u521B\u9020\u52A9\u624B",greeting_short:"\u4F60\u597D, \u6211\u662F Ant Design X",description:"\u57FA\u4E8E Ant Design \u7684 AGI \u4EA7\u54C1\u667A\u80FD\u89E3\u51B3\u65B9\u6848, \u521B\u9020\u66F4\u7F8E\u597D\u7684\u667A\u80FD\u89C6\u754C",description_short:"\u57FA\u4E8E Ant Design \u7684 AGI \u4EA7\u54C1\u667A\u80FD\u89E3\u51B3\u65B9\u6848, \u521B\u9020\u66F4\u7F8E\u597D\u7684\u667A\u80FD\u89C6\u754C",help_text:"\u6211\u53EF\u4EE5\u5E2E\u60A8: ",conversations_group:"\u6700\u8FD1\u5BF9\u8BDD",send_placeholder:"\u8F93\u5165 / \u83B7\u53D6\u5EFA\u8BAE",hot_question:"\u70ED\u95E8\u8BDD\u9898",question1:"Ant Design X \u5168\u65B0\u5347\u7EA7\u4E86\u4EC0\u4E48? ",question2:"Ant Design X \u63A8\u51FA\u5168\u65B0 RICH \u8BBE\u8BA1\u89C4\u8303 ",question3:"Ant Design X \u7EC4\u4EF6\u8D44\u4EA7\u6709\u54EA\u4E9B? ",question4:"\u5FEB\u6765\u4E86\u89E3\u5168\u65B0AI\u65F6\u4EE3\u7684\u8BBE\u8BA1\u8303\u5F0F! ",design_guide:"Rich \u8BBE\u8BA1\u6307\u5357",empathy:"AI \u7406\u89E3\u7528\u6237\u8BC9\u6C42\u5E76\u89E3\u51B3",persona:"AI \u5BF9\u5916\u7684\u4EBA\u8BBE\u53CA\u5F62\u8C61",conversation:"AI \u5982\u4F55\u8868\u8FBE\u7528\u6237\u80FD\u542C\u61C2",interface:"AI \u517C\u987E\u201Cchat\u201D & \u201Cdo\u201D \u884C\u4E3A"},en:{greeting:"Hello, I am your AI Product Design Assistant",greeting_short:"Hello, I am Ant Design X",description:"Powered by Ant Design's AGI solution to enhance intelligent, aesthetic visual experiences",description_short:"Aesthetic visual experiences",help_text:"I can assist you with:",conversations_group:"History",send_placeholder:"Type / to get suggestions",hot_question:"Hot Topics",question1:"What are the new upgrades in X?",question2:"X has introduced the new RICH design guide.",question3:"What are the component assets in X?",question4:"Discover new design for the AI!",design_guide:"Rich Design Guidelines",empathy:"AI that understands and addresses user needs",persona:"Defining AI's persona and presentation",conversation:"Ensuring AI communicates clearly",interface:"Balancing 'chat' & 'do' functionalities"}},c={AWAKE:{START:"#6fb3e2",END:"#6c57ff"},EXPRESS:{START:"#6dd6f5",END:"#108c44"},CONFIRM:{START:"#ba2cb8",END:"#6c37e8"},FEEDBACK:{START:"#f7c348",END:"#f75972"},COMMON:{START:"#d857ff",END:"#8594ff"}},d=(0,s.createStyles)(({token:e,css:t})=>({welcome:t`
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
    `}));var l=e=>{let{styles:t}=d();return(0,n.jsx)(a.XProvider,{conversations:{className:t.conversations},sender:{className:t.sender},prompts:{className:t.prompts},welcome:{className:t.welcome},suggestion:{className:t.suggestion},children:e.children});};},f4aeb400:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return m;}});var n=i("777fffbe"),a=i("8090cfc0"),s=i("c5d21053"),o=i("0ba2ace3"),r=i("64d8f06c"),c=n._(i("40ff87e3")),d=i("f77140d4"),l=n._(i("c5e8d449")),p=i("cb1953a5");let f="\xa0,\xa0\xa0\xa0",g={cn:{title:"AI \u754C\u9762\u89E3\u51B3\u65B9\u6848",desc:"\u57FA\u4E8ERICH\uFF0C\u5EF6\u7EED\u719F\u6089\u7684 Ant Design \u8BBE\u8BA1\u8BED\u8A00\uFF0C\u5168\u65B0 AGI \u6DF7\u5408\u754C\u9762\uFF08Hybrid-UI\uFF09\u89E3\u51B3\u65B9\u6848\uFF0C\u5B8C\u7F8E\u878D\u5408 GUI \u548C\u81EA\u7136\u4F1A\u8BDD\u4EA4\u4E92\u3002\u4ECE\u5524\u9192\u5230\u8868\u8FBE\uFF0C\u4ECE\u8FC7\u7A0B\u5230\u53CD\u9988\uFF0C\u5408\u9002\u7684\u7EC4\u4EF6\u6070\u5F53\u7684\u5448\u73B0\u5728\u6240\u6709\u7684\u4EBA\u673A\u4E92\u52A8\u8FC7\u7A0B\u4E2D\u3002",awaken:"\u5524\u9192",awaken_title:`\u{8F7B}\u{677E}\u{5524}\u{9192}${f}\u{5373}\u{523B}\u{5438}\u{5F15}`,awaken_desc:"\u53EF\u4EE5\u8BA9\u9996\u6B21\u63A5\u89E6\u7684\u7528\u6237\u5FEB\u901F\u7406\u89E3AI\u80FD\u505A\u4EC0\u4E48, \u544A\u77E5\u7528\u6237AI\u53EF\u5B9E\u73B0\u7684\u610F\u56FE\u8303\u56F4, \u964D\u4F4E\u7528\u6237\u6210\u672C",awaken_action:"\u4ECE\u5524\u9192\u5F00\u59CB",express:"\u8868\u8FBE",express_title:`\u{7B80}\u{5355}\u{8868}\u{8FBE}${f}\u{968F}\u{65F6}\u{53CD}\u{9988}`,express_desc:"\u8BA9\u7528\u6237\u77E5\u9053\u5982\u4F55\u5FEB\u6377\u4E14\u6B63\u786E\u7684\u8868\u8FBE\u610F\u56FE, \u51CF\u5C11AI\u7684\u4E0D\u7406\u89E3\u98CE\u9669, \u770B\u6E05\u81EA\u5DF1\u53D1\u9001\u7684\u5185\u5BB9",express_action:"\u4ECE\u8868\u8FBE\u5F00\u59CB",confirm:"\u786E\u8BA4",confirm_title:`\u{8FC7}\u{7A0B}\u{786E}\u{8BA4}${f}\u{5C3D}\u{5728}\u{638C}\u{63E1}`,confirm_desc:"\u8BA9\u7528\u6237\u77E5\u9053\u8BE5\u4EFB\u52A1\u7684AI\u6267\u884C\u8FD0\u8F6C\u60C5\u51B5, \u7F13\u89E3\u7528\u6237\u7B49\u5F85\u7126\u8651, \u6709\u638C\u63A7\u611F",confirm_action:"\u4ECE\u786E\u8BA4\u5F00\u59CB",feedback:"\u53CD\u9988",feedback_title:`\u{7ED3}\u{679C}\u{53CD}\u{9988}${f}\u{8C01}\u{80FD}\u{4E0D}\u{4FE1}`,feedback_desc:"\u8BA9\u7528\u6237\u6E05\u6670\u770B\u5230\u5E76\u4FE1\u4EFBAI\u4EFB\u52A1\u5B8C\u6210\u7684\u60C5\u51B5, \u5E76\u5FEB\u901F\u5E94\u7528AI\u751F\u6210\u7ED3\u679C",feedback_action:"\u4ECE\u53CD\u9988\u5F00\u59CB"},en:{title:"AI Interface Solution",desc:"Building on the RICH paradigm and Ant Design language, the AGI Hybrid-UI solution blends GUI with natural conversation, presenting optimal components at each stage of human-computer interaction.",awaken:"Awaken",awaken_title:`Effortlessly Awaken${f}Instantly Engage`,awaken_desc:"Helps new users quickly understand what AI can do, informs them of the AI\u2019s capability range, and lowers entry barriers.",awaken_action:"Start with Awaken",express:"Express",express_title:`Simple Express${f}Instant Feedback`,express_desc:"Guides users on how to express intentions effectively, reducing misunderstandings with AI and clarifying their input.",express_action:"Start with Express",confirm:"Confirm",confirm_title:`Process Confirm${f}Fully in Control`,confirm_desc:"Keeps users informed of the AI\u2019s task execution status, easing wait-time anxiety and providing a sense of control.",confirm_action:"Start with Confirm",feedback:"Feedback",feedback_title:`Result Feedback${f}Built-in Trust`,feedback_desc:"Clearly displays AI task completion, fostering trust, and enabling quick application of AI-generated results.",feedback_action:"Start with Feedback"}},h=(0,o.createStyles)(({token:e,css:t})=>({container:t`
    `,content:t`
      display: flex;
      justify-content: space-between;
      padding-top: ${e.pcContainerMargin}px;
    `,chain:t`
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 540px;
    `,chain_item:t`
      display: flex;
      gap: ${e.paddingLG}px;
      color: #ffffff;
    `,chain_item_content:t`
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: ${e.paddingLG}px;
      overflow: hidden;
      
    `,chain_item_line:t`
      height: 300px;
      width: 4px;
      margin: 0 auto;
    `,chain_item_label:t`
      font-size: ${e.fontSizeHeading4}px;
      font-weight: bold;
      line-height: 40px;
    `,chain_item_title:t`
      font-size: ${e.fontSizeHeading1+10}px;
      line-height: 56px;
      font-weight: bold;

      @media only screen and (max-width: ${e.mobileMaxWidth}px) {
        font-size: ${e.fontSizeHeading2}px;
      }
    `,chain_item_desc:t`
      font-size: ${e.fontSizeHeading5}px;
      line-height: 32px;
      opacity: 0.65;
    `,chain_item_action:t`
      background: #ffffff1a;
      position: relative;
      border-radius: 40px;
      width: min-content;
      padding: ${e.paddingLG}px;
      overflow: hidden;
      font-size: ${e.fontSizeHeading5}px;
      font-weight: bold;
      opacity: 0.9;
      border: none !important;

      &::after {
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

        padding: ${e.lineWidth}px;
        background: linear-gradient(180deg, #ffffff26 0%, #ffffff00 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
      };
    `,chain_item_icon:t`
      width: 40px;
      height: 40px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: auto;
        height: 40px;
        position: absolute;
      }
    `}));var m=()=>{let[e]=(0,c.default)(g),{styles:t}=h(),{pathname:i,search:n}=(0,r.useLocation)(),o=(0,r.useNavigate)(),f=[{icon:"https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/f14LTKOFxRsAAAAAQbAAAAgADtFMAQFr/original",label:e.awaken,title:e.awaken_title,desc:e.awaken_desc,action:e.awaken_action,startColor:p.DESIGN_STAGE_COLOR.AWAKE.START,endColor:p.DESIGN_STAGE_COLOR.AWAKE.END,path:"components/welcome"},{icon:"https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/dGfqSaM9ZxoAAAAAQaAAAAgADtFMAQFr/original",label:e.express,title:e.express_title,desc:e.express_desc,action:e.express_action,startColor:p.DESIGN_STAGE_COLOR.EXPRESS.START,endColor:p.DESIGN_STAGE_COLOR.EXPRESS.END,path:"components/attachments"},{icon:"https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/BQaCTIUU-CkAAAAAQZAAAAgADtFMAQFr/original",label:e.confirm,title:e.confirm_title,desc:e.confirm_desc,action:e.confirm_action,startColor:p.DESIGN_STAGE_COLOR.CONFIRM.START,endColor:p.DESIGN_STAGE_COLOR.CONFIRM.END,path:"components/think"},{icon:"https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/r-DuSZG-9NIAAAAAQdAAAAgADtFMAQFr/original",label:e.feedback,title:e.feedback_title,desc:e.feedback_desc,action:e.feedback_action,startColor:p.DESIGN_STAGE_COLOR.FEEDBACK.START,endColor:p.DESIGN_STAGE_COLOR.FEEDBACK.END,path:"components/actions"}];return(0,a.jsx)(l.default,{className:t.container,title:e.title,desc:e.desc,children:(0,a.jsx)("div",{className:t.content,children:(0,a.jsx)("div",{className:t.chain,children:f.map((e,r)=>{let c=e.title.split(e.label);return(0,a.jsxs)("div",{className:t.chain_item,children:[(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:t.chain_item_icon,children:[(0,a.jsx)("img",{alt:"icon",src:e.icon,loading:"lazy"}),(0,a.jsx)("img",{alt:"icon",src:e.icon,loading:"lazy",style:{filter:"blur(18px)"}})]}),(0,a.jsx)("div",{className:t.chain_item_line,style:r===f.length-1?{}:{backgroundImage:`linear-gradient(180deg, ${e.startColor}00 0%, ${e.startColor} 25%, ${e.endColor} 75%, ${e.endColor}00 100%)`}})]}),(0,a.jsxs)("div",{className:t.chain_item_content,children:[(0,a.jsxs)("div",{className:t.chain_item_label,children:[(0,a.jsxs)("span",{style:{paddingInlineEnd:10},children:[r+1,"."]}),e.label]}),(0,a.jsxs)("div",{className:t.chain_item_title,children:[(0,a.jsx)("span",{children:c[0]}),(0,a.jsx)("span",{style:{background:`linear-gradient(127deg, ${e.startColor} 23%, ${e.endColor} 100%)`,WebkitBackgroundClip:"text",color:"transparent"},children:e.label}),(0,a.jsx)("span",{style:{maxWidth:"100%",display:"inline-block"},children:c[1]})]}),(0,a.jsx)("div",{className:t.chain_item_desc,children:e.desc}),(0,a.jsx)(s.Button,{className:t.chain_item_action,type:"text",size:"large",onClick:()=>o((0,d.getLocalizedPathname)(e.path,(0,d.isZhCN)(i),n)),children:e.action})]})]},e.label);})})})});};}}]);
//# sourceMappingURL=f4aeb400-async.697136a8.js.map