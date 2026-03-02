(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["5d484c98"],{"38df7d2f":function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return b;}});var n=i("777fffbe"),a=i("852bbaa9"),s=i("8090cfc0"),o=i("2bcf28f3"),d=i("6ed18065"),r=i("c5d21053"),l=i("0ba2ace3"),c=n._(i("3e6b097d")),p=n._(i("40ff87e3")),f=a._(i("cb1953a5")),u=n._(i("d69d0489"));let g=()=>new Promise(e=>setTimeout(e,1e3)),m={ai:{placement:"start",typing:{effect:"typing",step:5,interval:20},style:{maxWidth:600},styles:{content:{borderRadius:16}}},local:{placement:"end",styles:{content:{borderRadius:16,background:"#3877FF"}},contentRender:e=>null==e?void 0:e.query}},x=(0,l.createStyles)(({token:e,css:t})=>({container:t`
      display: flex;
      padding: ${e.paddingXL}px 0px;
      box-sizing: border-box;
      flex-direction: column;
      gap: ${e.paddingSM}px;
      height: 100%;
      width: 350px;
      background: #0000001a;
    `,content:t`
      padding: ${e.paddingXL}px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: ${e.padding}px;
    `,bubble_list:t`
      flex: 1;
    `,placeholder_bubble:t`
      .ant-welcome {
        padding: 0;
      }

      .ant-welcome-title {
        font-size: 16px !important;
        font-weight: 500 !important;
        opacity: 0.9;
      }

      .ant-welcome-description {
        font-size: 12px;
        opacity: 0.65;
      }

      .ant-welcome-icon {
        img {
          transform: scale(1.2);
          margin-inline-end: 10px;
        }
      }

      .ant-bubble-content {
        overflow: hidden;
        background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%) !important;
        width: 100%;
        border-radius: 16px;
        padding: 24px;
      }

      .ant-prompts {
        padding: 0;
      }

      .ant-prompts-item {
        background: rgba(255, 255, 255, 0.05);
        box-sizing: border-box;
        padding: 8px 16px;
        font-size: 12px;
        height: 36px;
        line-height: 36px;
        border: none;
        flex: 1;
      }
    `}));var b=()=>{let{styles:e}=x(),[t]=(0,p.default)(f.LOCALES),[i,n]=c.default.useState(""),[a]=c.default.useState(new d.DefaultChatProvider({request:(0,d.XRequest)("https://api.example.com/chat",{manual:!0,fetch:async(e,t)=>{await g();let i=null==t?void 0:t.params;return Promise.resolve(new Response(JSON.stringify([`Mock success return. You said: ${null==i?void 0:i.query}`]),{headers:{"Content-Type":"application/json"}}));}})})),{onRequest:l,messages:b,isRequesting:h}=(0,d.useXChat)({provider:a,requestPlaceholder:"Waiting...",requestFallback:"Mock failed return. Please try again later."}),A={role:"system",key:"placeholder",variant:"borderless",className:e.placeholder_bubble,content:(0,s.jsx)(o.Welcome,{icon:(0,s.jsx)("img",{src:"https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp",alt:"Ant Design X"}),variant:"borderless",title:t.greeting_short,description:t.description_short}),footer:(0,s.jsx)(o.Prompts,{title:t.help_text,onItemClick:e=>{l({query:e.data.description});},vertical:!0,items:[{key:"1-1",description:t.question1},{key:"1-2",description:t.question2},{key:"1-3",description:t.question3},{key:"1-4",description:t.question4}]})};return(0,s.jsx)(f.default,{children:(0,s.jsxs)(r.Flex,{justify:"space-between",style:{height:"100%"},children:[(0,s.jsxs)("div",{className:e.content,children:[(0,s.jsx)(r.Skeleton,{}),(0,s.jsx)(r.Skeleton,{}),(0,s.jsx)(r.Skeleton,{})]}),(0,s.jsxs)("div",{className:e.container,children:[(0,s.jsx)(o.Bubble.List,{className:e.bubble_list,role:m,styles:{root:{height:"calc(100% - 56px)"},scroll:{paddingInline:20}},items:[A,...b.map(({id:e,message:t,status:i})=>({key:e,loading:"loading"===i,role:"local"===i?"local":"ai",content:t}))]}),(0,s.jsx)(u.default,{loading:h,value:i,onChange:n,placeholder:t.send_placeholder,onSubmit:e=>{e&&(l({query:e}),n(""));}})]})]})});};},"5c02472b":function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return b;}});var n=i("777fffbe"),a=i("852bbaa9"),s=i("8090cfc0"),o=i("2bcf28f3"),d=i("6ed18065"),r=i("c5d21053"),l=i("0ba2ace3"),c=n._(i("3e6b097d")),p=n._(i("40ff87e3")),f=a._(i("cb1953a5")),u=n._(i("d69d0489"));let g=()=>new Promise(e=>setTimeout(e,1e3)),m={ai:{placement:"start",typing:{effect:"typing",step:5,interval:20},styles:{content:{borderRadius:16}}},local:{placement:"end",styles:{content:{borderRadius:16,background:"#3877FF"}},contentRender:e=>null==e?void 0:e.query}},x=(0,l.createStyles)(({token:e,css:t})=>({container:t`
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      align-items: center;
      gap: ${e.padding}px;
      height: 100%;
      justify-content: space-between;
      padding-block: ${e.paddingXL}px;
   `,bubble_list:t`
      flex: 1;
    `,placeholder_bubble:t`
      .ant-welcome {
        padding: 0;
        margin-bottom: ${e.marginSM}px;
      }

      .ant-welcome-title {
        font-size: 16px !important;
        font-weight: 500 !important;
        opacity: 0.9;
      }

      .ant-welcome-description {
        font-size: 12px;
        opacity: 0.65;
      }

      .ant-welcome-icon {
        img {
          transform: scale(1.2);
          margin-inline-end: 10px;
        }
      }

      .ant-bubble-content {
        overflow: hidden;
        background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%) !important;
        width: 100%;
        border-radius: 16px;
        padding: 24px;
      }

      .ant-prompts-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      .ant-tag {
        background: linear-gradient(45deg, #ffffff33 0%, #ffffff00 100%);
        border: 1px solid #ffffff4d;
        border-radius: 4px;
        margin: 0;
        width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .ant-prompts {
        padding: 0;
      }

      .ant-prompts-desc {
        line-height: 2 !important;
      }

      .ant-prompts-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 16px;
        border: none;
        flex: 1;
        height: 100%;
      }
    `}));var b=()=>{let{styles:e}=x(),[t]=(0,p.default)(f.LOCALES),[i,n]=c.default.useState(""),[a]=c.default.useState(new d.DefaultChatProvider({request:(0,d.XRequest)("https://api.example.com/chat",{manual:!0,fetch:async(e,t)=>{await g();let i=null==t?void 0:t.params;return Promise.resolve(new Response(JSON.stringify([`Mock success return. You said: ${null==i?void 0:i.query}`]),{headers:{"Content-Type":"application/json"}}));}})})),{onRequest:l,messages:b,isRequesting:h}=(0,d.useXChat)({provider:a,requestPlaceholder:"Waiting...",requestFallback:"Mock failed return. Please try again later."}),A={role:"system",key:"placeholder",variant:"borderless",className:e.placeholder_bubble,content:(0,s.jsxs)("div",{children:[(0,s.jsx)(o.Welcome,{icon:(0,s.jsx)("img",{src:"https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp",alt:"Ant Design X"}),title:t.greeting,description:t.description,variant:"borderless"}),(0,s.jsx)(o.Prompts,{title:t.help_text,onItemClick:e=>{l({query:e.data.description});},styles:{subItem:{background:"none",padding:"4px 0"}},items:[{key:"1",label:t.hot_question,children:[{key:"1-1",icon:(0,s.jsx)(r.Tag,{children:"1"}),description:t.question1},{key:"1-2",icon:(0,s.jsx)(r.Tag,{children:"2"}),description:t.question2},{key:"1-3",icon:(0,s.jsx)(r.Tag,{children:"3"}),description:t.question3},{key:"1-4",icon:(0,s.jsx)(r.Tag,{children:"4"}),description:t.question4}]},{key:"2",label:t.design_guide,children:[{key:"2-1",icon:(0,s.jsx)(r.Tag,{children:"1"}),description:t.empathy},{key:"2-2",icon:(0,s.jsx)(r.Tag,{children:"2"}),description:t.persona},{key:"2-3",icon:(0,s.jsx)(r.Tag,{children:"3"}),description:t.conversation},{key:"2-4",icon:(0,s.jsx)(r.Tag,{children:"4"}),description:t.interface}]}]})]})};return(0,s.jsx)(f.default,{children:(0,s.jsxs)("div",{className:e.container,children:[(0,s.jsx)(o.Bubble.List,{className:e.bubble_list,role:m,styles:{root:{height:"calc(100% - 108px)"},scroll:{paddingInline:20}},items:[A,...b.map(({id:e,message:t,status:i})=>({key:e,loading:"loading"===i,role:"local"===i?"local":"ai",content:t}))]}),(0,s.jsx)(u.default,{loading:h,value:i,onChange:n,placeholder:t.question1,onSubmit:e=>{e&&(l({query:e}),n(""));}})]})});};},"5d484c98":function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return b;}});var n=i("777fffbe"),a=i("8090cfc0"),s=i("c5d21053"),o=i("0ba2ace3"),d=i("46c8afcf"),r=n._(i("3e6b097d")),l=n._(i("40ff87e3")),c=n._(i("c5e8d449")),p=n._(i("8ff5a1c9")),f=n._(i("38df7d2f")),u=n._(i("5c02472b")),g=n._(i("d8c02950"));let m={cn:{title:"\u8BD5\u4E00\u8BD5 , \u591A\u79CD AI \u573A\u666F\u4F53\u9A8C",desc:"\u63D0\u4F9B\u591A\u573A\u666F\u89E3\u51B3\u65B9\u6848 , \u5E2E\u52A9\u7528\u6237\u63D0\u9AD8\u4E0E AI \u534F\u4F5C\u6548\u7387",independent_title:"Web \u72EC\u7ACB\u5F0F",independent_desc:"\u81EA\u7136\u8BED\u8A00\u4E3A\u4E3B , \u51E0\u4E4E\u6CA1\u6709\u754C\u9762\u64CD\u4F5C",assistant_title:"Web \u52A9\u624B\u5F0F",assistant_desc:"\u81EA\u7136\u8BED\u8A00\u548C\u754C\u9762\u64CD\u4F5C\u5747\u8861\u914D\u5408\u4F7F\u7528",nest_title:"Web \u5D4C\u5165\u5F0F",nest_desc:"\u754C\u9762\u64CD\u4F5C\u4E3A\u4E3B , \u5076\u5C14\u5524\u8D77AI\u6307\u4EE4",app_title:"App \u7AEF",app_desc:"\u75AF\u72C2\u7814\u53D1\u4E2D , \u656C\u8BF7\u671F\u5F85"},en:{title:"Multiple AI Scenario Experiences",desc:"Offering multi-scenario solutions to help users enhance collaboration efficiency with AI",independent_title:"Web - Independent",independent_desc:"Primarily LUI",assistant_title:"Web - Assistant",assistant_desc:"Mix of LUI and GUI",nest_title:"Web - Nest",nest_desc:"Mainly UI-driven",app_title:"Mobile - APP",app_desc:"In development, stay tuned"}},x=(0,o.createStyles)(({token:e,css:t})=>({container:t`
      position: relative;

      @media screen and (max-width: ${e.mobileMaxWidth}px) {
        height: 100vh;
      }
    `,content_bg:t`
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(10%, -20%);
    `,content:t`
      display: flex;
      justify-content: space-between;
      gap: ${e.paddingXL}px;
      width: 100%;
      margin-top: ${e.pcContainerMargin/2}px;
    `,mobile_content:t`
      margin: ${e.marginXXL}px 0;

      h3 {
        text-align: center;
        font-size: ${e.fontSizeHeading3}px;
      }

      p {
        text-align: center;
        opacity: 0.65;
      }

      img {
        width: 100%;
        background: #0c0e10cc;
        border-radius: 12px;
        margin-top: ${e.margin}px;
      }
    `,tab:t`
      width: 280px;
      display: flex;
      flex-direction: column;
      gap: ${e.margin}px;
    `,tab_content:t`
      width: 890px;
      height: 600px;
      box-sizing: border-box;
      background-image: url(https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*RxJMSbQRvTUAAAAAAAAAAAAADgCCAQ/fmt.avif);
      background-repeat: no-repeat;
      background-size: cover;
      z-index: 2;
    `,item:t`
      position: relative;
      border-radius: 20px;
      height: 86px;
      padding: ${e.padding}px;
      box-sizing: border-box;
      display: flex;
      gap: 4px;
      flex-direction: column;
      align-items: flex-start;
      cursor: pointer;
      border: none !important;
    `,"item-disabled":t`
      h3,p {
        color: ${e.colorTextDisabled};
      }
    `,"item-active":t`
      background: #ffffff1a;

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
    `,item_title:t`
      font-size: ${e.fontSizeHeading4}px;
      color: #ffffff;
      font-weight: 500;
    `,item_desc:t`
      font-size: 14px;
      color: #ffffff;
      line-height: 22px;
      opacity: 0.65;
    `}));var b=()=>{var e;let{styles:t}=x(),[i]=(0,l.default)(m),{isMobile:n}=r.default.useContext(p.default),o=[{key:"independent",title:i.independent_title,desc:i.independent_desc,content:(0,a.jsx)(u.default,{}),img:"https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*YVjbTqbc7ngAAAAAAAAAAAAADgCCAQ/fmt.avif"},{key:"assistant",title:i.assistant_title,desc:i.assistant_desc,content:(0,a.jsx)(f.default,{}),img:"https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*kCojRo0SoAAAAAAAAAAAAAAADgCCAQ/fmt.avif"},{key:"nest",title:i.nest_title,desc:i.nest_desc,content:(0,a.jsx)(g.default,{}),img:"https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*krfsT5zBSuUAAAAAAAAAAAAADgCCAQ/fmt.avif"},{key:"app",title:i.app_title,desc:i.app_desc,disabled:!0,content:null}],[b,h]=r.default.useState(o[0].key),A=e=>()=>h(e),y=null===(e=o.find(e=>e.key===b))||void 0===e?void 0:e.content;return(0,a.jsxs)(c.default,{className:t.container,title:i.title,desc:i.desc,children:[!n&&(0,a.jsx)("img",{className:t.content_bg,src:"https://mdn.alipayobjects.com/huamei_k0vkmw/afts/img/A*aSLTSr53DPAAAAAAAAAAAAAADsR-AQ/original",alt:"bg"}),n?(0,a.jsx)(s.Carousel,{autoplay:!0,draggable:!0,autoplaySpeed:5e3,swipeToSlide:!0,children:o.map(e=>e.img&&(0,a.jsxs)("div",{className:t.mobile_content,children:[(0,a.jsx)("h3",{children:e.title}),(0,a.jsx)("p",{children:e.desc}),(0,a.jsx)("img",{src:e.img,alt:"item.img",loading:"lazy"})]}))}):(0,a.jsxs)("div",{className:t.content,children:[(0,a.jsx)("div",{className:t.tab,children:o.map(e=>(0,a.jsxs)(s.Button,{disabled:e.disabled,className:(0,d.clsx)(t.item,b===e.key&&t["item-active"],e.disabled&&t["item-disabled"]),type:"text",onClick:A(e.key),children:[(0,a.jsx)("h3",{className:t.item_title,children:e.title}),(0,a.jsx)("p",{className:t.item_desc,children:e.desc})]},e.key))}),!!y&&(0,a.jsx)("div",{className:t.tab_content,children:y})]})]});};},c5e8d449:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return d;}});var n=i("8090cfc0"),a=i("0ba2ace3"),s=i("46c8afcf");let o=(0,a.createStyles)(({token:e,css:t})=>({container:t`
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
    `}));var d=e=>{let{styles:t}=o();return(0,n.jsxs)("div",{className:(0,s.clsx)(t.container,e.className),style:e.style,onClick:e.onClick,children:[e.title&&(0,n.jsx)("h2",{className:t.title,children:e.title}),e.desc&&(0,n.jsx)("p",{className:t.desc,children:e.desc}),e.children]});};},cb1953a5:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.e(t,{DESIGN_STAGE_COLOR:function(){return r;},LOCALES:function(){return d;},default:function(){return c;},useCustomizationBgStyle:function(){return o;}});var n=i("8090cfc0"),a=i("2bcf28f3"),s=i("0ba2ace3");let o=(0,s.createStyles)(({token:e,css:t})=>({background:t`
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
    `})),d={cn:{greeting:"\u4F60\u597D, \u6211\u662F\u5168\u65B0 AI \u4EA7\u54C1\u521B\u9020\u52A9\u624B",greeting_short:"\u4F60\u597D, \u6211\u662F Ant Design X",description:"\u57FA\u4E8E Ant Design \u7684 AGI \u4EA7\u54C1\u667A\u80FD\u89E3\u51B3\u65B9\u6848, \u521B\u9020\u66F4\u7F8E\u597D\u7684\u667A\u80FD\u89C6\u754C",description_short:"\u57FA\u4E8E Ant Design \u7684 AGI \u4EA7\u54C1\u667A\u80FD\u89E3\u51B3\u65B9\u6848, \u521B\u9020\u66F4\u7F8E\u597D\u7684\u667A\u80FD\u89C6\u754C",help_text:"\u6211\u53EF\u4EE5\u5E2E\u60A8: ",conversations_group:"\u6700\u8FD1\u5BF9\u8BDD",send_placeholder:"\u8F93\u5165 / \u83B7\u53D6\u5EFA\u8BAE",hot_question:"\u70ED\u95E8\u8BDD\u9898",question1:"Ant Design X \u5168\u65B0\u5347\u7EA7\u4E86\u4EC0\u4E48? ",question2:"Ant Design X \u63A8\u51FA\u5168\u65B0 RICH \u8BBE\u8BA1\u89C4\u8303 ",question3:"Ant Design X \u7EC4\u4EF6\u8D44\u4EA7\u6709\u54EA\u4E9B? ",question4:"\u5FEB\u6765\u4E86\u89E3\u5168\u65B0AI\u65F6\u4EE3\u7684\u8BBE\u8BA1\u8303\u5F0F! ",design_guide:"Rich \u8BBE\u8BA1\u6307\u5357",empathy:"AI \u7406\u89E3\u7528\u6237\u8BC9\u6C42\u5E76\u89E3\u51B3",persona:"AI \u5BF9\u5916\u7684\u4EBA\u8BBE\u53CA\u5F62\u8C61",conversation:"AI \u5982\u4F55\u8868\u8FBE\u7528\u6237\u80FD\u542C\u61C2",interface:"AI \u517C\u987E\u201Cchat\u201D & \u201Cdo\u201D \u884C\u4E3A"},en:{greeting:"Hello, I am your AI Product Design Assistant",greeting_short:"Hello, I am Ant Design X",description:"Powered by Ant Design's AGI solution to enhance intelligent, aesthetic visual experiences",description_short:"Aesthetic visual experiences",help_text:"I can assist you with:",conversations_group:"History",send_placeholder:"Type / to get suggestions",hot_question:"Hot Topics",question1:"What are the new upgrades in X?",question2:"X has introduced the new RICH design guide.",question3:"What are the component assets in X?",question4:"Discover new design for the AI!",design_guide:"Rich Design Guidelines",empathy:"AI that understands and addresses user needs",persona:"Defining AI's persona and presentation",conversation:"Ensuring AI communicates clearly",interface:"Balancing 'chat' & 'do' functionalities"}},r={AWAKE:{START:"#6fb3e2",END:"#6c57ff"},EXPRESS:{START:"#6dd6f5",END:"#108c44"},CONFIRM:{START:"#ba2cb8",END:"#6c37e8"},FEEDBACK:{START:"#f7c348",END:"#f75972"},COMMON:{START:"#d857ff",END:"#8594ff"}},l=(0,s.createStyles)(({token:e,css:t})=>({welcome:t`
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
    `}));var c=e=>{let{styles:t}=l();return(0,n.jsx)(a.XProvider,{conversations:{className:t.conversations},sender:{className:t.sender},prompts:{className:t.prompts},welcome:{className:t.welcome},suggestion:{className:t.suggestion},children:e.children});};},d69d0489:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.e(t,{default:function(){return d;},useStyle:function(){return o;}});var n=i("8090cfc0"),a=i("2bcf28f3"),s=i("c5d21053");let o=(0,i("0ba2ace3").createStyles)(({css:e,token:t})=>({sender:e`
      margin-inline: ${2*t.paddingSM}px;
      background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%);
      position: relative;
      border: none;
      cursor: pointer;
      :hover {
        opacity: 0.85;
      }
    `}));var d=e=>{let{styles:t}=o();return(0,n.jsx)(a.Sender,{className:t.sender,style:{width:"calc(100% - 48px)"},suffix:()=>(0,n.jsx)(s.Button,{type:"text",style:{padding:0},onClick:()=>{var t;return null==e?void 0:null===(t=e.onSubmit)||void 0===t?void 0:t.call(e,e.value);},icon:(0,n.jsx)("img",{alt:"send",loading:"lazy",src:"https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4e5sTY9lU3sAAAAAAAAAAAAADgCCAQ/original"})}),...e});};},d8c02950:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return c;}});var n=i("777fffbe"),a=i("8090cfc0"),s=i("0ba2ace3"),o=n._(i("40ff87e3")),d=i("cb1953a5"),r=n._(i("d69d0489"));let l=(0,s.createStyles)(({token:e,css:t})=>({container:t`
      display: flex;
      height: 100%;
      width: 100%;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: ${e.paddingLG}px;
    `,title:t`
      font-size: 42px;
      color: #ffffff3f;
      line-height: 50px;
      font-weight: 500;
    `}));var c=()=>{let{styles:e}=l(),{styles:{background:t}}=(0,d.useCustomizationBgStyle)(),[i]=(0,o.default)(d.LOCALES);return(0,a.jsxs)("div",{className:e.container,children:[(0,a.jsx)("div",{className:e.title,children:i.greeting_short}),(0,a.jsx)(r.default,{style:{width:580,borderRadius:32},value:i.question1,className:t})]});};}}]);
//# sourceMappingURL=5d484c98-async.7daa6bd3.js.map