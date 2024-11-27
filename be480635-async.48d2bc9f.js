(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["be480635"],{c1587eef:function(e,n,t){"use strict";t.d(n,"__esModule",{value:!0}),t.e(n,{DESIGN_STAGE_COLOR:function(){return d;},LOCALES:function(){return r;},default:function(){return c;},useCustomizationBgStyle:function(){return a;}});var i=t("a4446a09"),s=t("735a2091"),o=t("65bfd38d");let a=(0,o.createStyles)(({token:e,css:n})=>({background:n`
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
    `})),r={cn:{greeting:"\u4F60\u597D, \u6211\u662F\u5168\u65B0 AI \u4EA7\u54C1\u521B\u9020\u52A9\u624B",greeting_short:"\u4F60\u597D, \u6211\u662F Ant Design X",description:"\u57FA\u4E8E Ant Design \u7684 AGI \u4EA7\u54C1\u667A\u80FD\u89E3\u51B3\u65B9\u6848, \u521B\u9020\u66F4\u7F8E\u597D\u7684\u667A\u80FD\u89C6\u754C",description_short:"\u57FA\u4E8E Ant Design \u7684 AGI \u4EA7\u54C1\u667A\u80FD\u89E3\u51B3\u65B9\u6848, \u521B\u9020\u66F4\u7F8E\u597D\u7684\u667A\u80FD\u89C6\u754C",help_text:"\u6211\u53EF\u4EE5\u5E2E\u60A8: ",conversations_group:"\u6700\u8FD1\u5BF9\u8BDD",send_placeholder:"\u8F93\u5165 / \u83B7\u53D6\u5EFA\u8BAE",hot_question:"\u70ED\u95E8\u8BDD\u9898",question1:"Ant Design X \u5168\u65B0\u5347\u7EA7\u4E86\u4EC0\u4E48? ",question2:"Ant Design X \u63A8\u51FA\u5168\u65B0 RICH \u8BBE\u8BA1\u89C4\u8303 ",question3:"Ant Design X \u7EC4\u4EF6\u8D44\u4EA7\u6709\u54EA\u4E9B? ",question4:"\u5FEB\u6765\u4E86\u89E3\u5168\u65B0AI\u65F6\u4EE3\u7684\u8BBE\u8BA1\u8303\u5F0F! ",design_guide:"Rich \u8BBE\u8BA1\u6307\u5357",empathy:"AI \u7406\u89E3\u7528\u6237\u8BC9\u6C42\u5E76\u89E3\u51B3",persona:"AI \u5BF9\u5916\u7684\u4EBA\u8BBE\u53CA\u5F62\u8C61",conversation:"AI \u5982\u4F55\u8868\u8FBE\u7528\u6237\u80FD\u542C\u61C2",interface:"AI \u517C\u987E\u201Cchat\u201D & \u201Cdo\u201D \u884C\u4E3A"},en:{greeting:"Hello, I am your AI Product Design Assistant",greeting_short:"Hello, I am Ant Design X",description:"Powered by Ant Design's AGI solution to enhance intelligent, aesthetic visual experiences",description_short:"Aesthetic visual experiences",help_text:"I can assist you with:",conversations_group:"History",send_placeholder:"Type / to get suggestions",hot_question:"Hot Topics",question1:"What are the new upgrades in X?",question2:"X has introduced the new RICH design guide.",question3:"What are the component assets in X?",question4:"Discover new design for the AI!",design_guide:"Rich Design Guidelines",empathy:"AI that understands and addresses user needs",persona:"Defining AI's persona and presentation",conversation:"Ensuring AI communicates clearly",interface:"Balancing 'chat' & 'do' functionalities"}},d={AWAKE:{START:"#6fb3e2",END:"#6c57ff"},EXPRESS:{START:"#6dd6f5",END:"#108c44"},CONFIRM:{START:"#ba2cb8",END:"#6c37e8"},FEEDBACK:{START:"#f7c348",END:"#f75972"},COMMON:{START:"#d857ff",END:"#8594ff"}},p=(0,o.createStyles)(({token:e,css:n})=>({welcome:n`
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
    `,prompts:n`
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
    `,sender:n`
      border-radius: ${40}px;
      height: 44px;
      display: flex;
      align-items: center;

      .ant-sender-content {
        padding: 0px ${e.paddingSM}px;
      }
    `,conversations:n`
      padding: ${e.padding}px;
      padding-top: 0;
      border-radius: ${20}px;
      position: relative;
    `,suggestion:n`
      border-radius: ${20}px;
      position: relative;
    `}));var c=e=>{let{styles:n}=p();return(0,i.jsx)(s.XProvider,{conversations:{className:n.conversations},sender:{className:n.sender},prompts:{className:n.prompts},welcome:{className:n.welcome},suggestion:{className:n.suggestion},children:e.children});};}}]);
//# sourceMappingURL=be480635-async.48d2bc9f.js.map