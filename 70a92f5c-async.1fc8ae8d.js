(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["70a92f5c"],{"70a92f5c":function(e,t,n){"use strict";n.d(t,"__esModule",{value:!0}),n.d(t,"default",{enumerable:!0,get:function(){return s;}});var i=n("777fffbe"),l=n("8090cfc0"),a=n("2020273b"),o=i._(n("1db42436"));let r=(0,n("2bb52879").createStyles)(({token:e,css:t})=>{let{colorIcon:n,colorText:i,iconCls:l}=e;return{editButton:t`
      a& {
        position: relative;
        top: -2px;
        display: inline-block;
        text-decoration: none;
        vertical-align: middle;
        pointer-events: auto;
        z-index: 999;
        margin-inline-start: ${e.marginXS}px;
        ${l} {
          display: block;
          color: ${n};
          font-size: ${e.fontSizeLG}px;
          transition: all ${e.motionDurationSlow};
          &:hover {
            color: ${i};
          }
        }
      }
    `};});var s=({title:e,filename:t})=>{let{styles:n}=r();return(0,l.jsx)(o.default,{title:e,children:(0,l.jsx)("a",{className:n.editButton,href:`https://github.com/ant-design/x/edit/main/packages/x/${t}`,target:"_blank",rel:"noopener noreferrer",children:(0,l.jsx)(a.EditOutlined,{})})});};}}]);