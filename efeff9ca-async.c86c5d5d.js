(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["efeff9ca"],{"2ab8246c":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return s;}});var a=n("8090cfc0");n("b6ef1885");var r=n("2020273b"),i=n("f153e352"),o=n("c5d21053");let l=Array.from({length:6}).map((e,t)=>{let n=t<=3?17322048e5:1732204713600;return{key:`item${t+1}`,label:`Conversation ${n+3600*t}`,timestamp:n+3600*t,group:t<=3?"Today":"Yesterday"};});var s=()=>{let{token:e}=o.theme.useToken(),t={width:256,background:e.colorBgContainer,borderRadius:e.borderRadius};return(0,a.jsx)(i.Conversations,{style:t,groupable:{sort:(e,t)=>e===t?0:"Today"===e?-1:1,title:(e,{components:{GroupTitle:t}})=>e?(0,a.jsx)(t,{children:(0,a.jsxs)(o.Space,{children:[(0,a.jsx)(r.CommentOutlined,{}),(0,a.jsx)("span",{children:e})]})}):(0,a.jsx)(t,{})},defaultActiveKey:"item1",items:l});};},"61e93273":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return u;}});var a=n("777fffbe"),r=n("8090cfc0");n("d5762935");var i=n("2020273b"),o=n("f153e352"),l=n("c5d21053"),s=n("3e6b097d"),d=a._(n("c3a77618")),u=()=>{let[e,t]=(0,s.useState)(!1),[n,a]=(0,s.useState)([]),{token:u}=l.theme.useToken(),c={width:280,height:600,background:u.colorBgContainer,borderRadius:u.borderRadius,overflow:"auto"},m=()=>{e||(t(!0),fetch("https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo").then(e=>e.json()).then(e=>{a([...n,...e.results.map(e=>({key:e.email,label:`${e.name.title} ${e.name.first} ${e.name.last}`,icon:(0,r.jsx)(l.Avatar,{src:e.picture.thumbnail}),group:e.nat}))]),t(!1);}).catch(()=>{t(!1);}));};return(0,s.useEffect)(()=>{m();},[]),(0,r.jsx)("div",{id:"scrollableDiv",style:c,children:(0,r.jsx)(d.default,{dataLength:n.length,next:m,hasMore:n.length<50,loader:(0,r.jsx)("div",{style:{textAlign:"center"},children:(0,r.jsx)(l.Spin,{indicator:(0,r.jsx)(i.RedoOutlined,{spin:!0}),size:"small"})}),endMessage:(0,r.jsx)(l.Divider,{plain:!0,children:"It is all, nothing more \u{1F910}"}),scrollableTarget:"scrollableDiv",style:{overflow:"hidden"},children:(0,r.jsx)(o.Conversations,{items:n,defaultActiveKey:"demo1",groupable:!0})})});};},"8b2a0167":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return l;}});var a=n("8090cfc0");n("1d6dfede");var r=n("f153e352"),i=n("c5d21053");let o=Array.from({length:4}).map((e,t)=>({key:`item${t+1}`,label:`Conversation Item ${t+1}`,disabled:3===t}));var l=()=>{let{token:e}=i.theme.useToken(),t={width:256,background:e.colorBgContainer,borderRadius:e.borderRadius};return(0,a.jsx)(r.Conversations,{items:o,defaultActiveKey:"item1",style:t});};},"99563d0a":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return s;}});var a=n("8090cfc0");n("545f68f1");var r=n("f153e352"),i=n("c5d21053"),o=n("3e6b097d");let l=Array.from({length:3}).map((e,t)=>({key:`item${t+1}`,label:`Conversation Item ${t+1}`}));var s=()=>{let[e,t]=(0,o.useState)("item1"),{token:n}=i.theme.useToken(),s={width:256,background:n.colorBgContainer,borderRadius:n.borderRadius};return(0,a.jsxs)(i.Flex,{vertical:!0,gap:"small",align:"flex-start",children:[(0,a.jsx)(r.Conversations,{activeKey:e,onActiveChange:e=>t(e),items:l,style:s}),(0,a.jsxs)(i.Flex,{gap:"small",children:[(0,a.jsx)(i.Button,{onClick:()=>{t("item1");},children:"Active First"}),(0,a.jsx)(i.Button,{onClick:()=>{t("item3");},children:"Active Last"})]})]});};},b6ff2478:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return s;}});var a=n("8090cfc0");n("13d5a43a");var r=n("2020273b"),i=n("f153e352"),o=n("c5d21053");let l=Array.from({length:4}).map((e,t)=>({key:`item${t+1}`,label:`Conversation Item ${t+1}`,disabled:3===t}));var s=()=>{let{token:e}=o.theme.useToken(),t={width:256,background:e.colorBgContainer,borderRadius:e.borderRadius};return(0,a.jsx)(i.Conversations,{defaultActiveKey:"item1",menu:e=>({trigger:t=>(0,a.jsx)(r.PlusSquareOutlined,{onClick:()=>{console.log(`Click ${e.key} - ${t.key}`);}}),items:[{label:"Operation 1",key:"operation1",icon:(0,a.jsx)(r.EditOutlined,{})},{label:"Operation 2",key:"operation2",icon:(0,a.jsx)(r.StopOutlined,{}),disabled:!0},{label:"Operation 3",key:"operation3",icon:(0,a.jsx)(r.DeleteOutlined,{}),danger:!0}],onClick:t=>{t.domEvent.stopPropagation(),console.log(`Click ${e.key} - ${t.key}`);}}),items:l,style:t});};},cc8ae2a0:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return l;}});var a=n("8090cfc0");n("0807c4a4");var r=n("f153e352"),i=n("c5d21053");let o=Array.from({length:4}).map((e,t)=>({key:`item${t+1}`,label:`Conversation Item ${t+1}`,disabled:3===t,group:3===t?"Group2":"Group1"}));var l=()=>{let{token:e}=i.theme.useToken(),t={width:256,background:e.colorBgContainer,borderRadius:e.borderRadius};return(0,a.jsx)(r.Conversations,{items:o,defaultActiveKey:"item1",style:t,groupable:!0});};},f2957205:function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return d;}});var a=n("8090cfc0");n("c35e71a9");var r=n("2020273b"),i=n("f153e352"),o=n("c5d21053");let l=Array.from({length:4}).map((e,t)=>({key:`item${t+1}`,label:`Conversation Item ${t+1}`,disabled:3===t})),s=()=>{let{message:e}=o.App.useApp(),{token:t}=o.theme.useToken(),n={width:256,background:t.colorBgContainer,borderRadius:t.borderRadius};return(0,a.jsx)(i.Conversations,{defaultActiveKey:"item1",menu:t=>({items:[{label:"Operation 1",key:"operation1",icon:(0,a.jsx)(r.EditOutlined,{})},{label:"Operation 2",key:"operation2",icon:(0,a.jsx)(r.StopOutlined,{}),disabled:!0},{label:"Operation 3",key:"operation3",icon:(0,a.jsx)(r.DeleteOutlined,{}),danger:!0}],onClick:n=>{n.domEvent.stopPropagation(),e.info(`Click ${t.key} - ${n.key}`);}}),items:l,style:n});};var d=()=>(0,a.jsx)(o.App,{children:(0,a.jsx)(s,{})});}}]);
//# sourceMappingURL=efeff9ca-async.c86c5d5d.js.map