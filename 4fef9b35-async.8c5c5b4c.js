(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["4fef9b35"],{"4fef9b35":function(t,e,a){"use strict";a.d(e,"__esModule",{value:!0}),a.d(e,"diagram",{enumerable:!0,get:function(){return A;}});var n=a("1b54c0d5"),r=a("84a22d12"),i=a("c797cc3e"),o=a("2515ee8a"),l=a("43634b5c"),c=a("982b5e72"),s=a("67c5ec7d"),d=(0,c.__name)(()=>({domains:new Map,transitions:[]}),"createDefaultData"),f=d(),m={getDomains:(0,c.__name)(()=>f.domains,"getDomains"),getTransitions:(0,c.__name)(()=>f.transitions,"getTransitions"),setDomains:(0,c.__name)(t=>{if(t)for(let e of t){let t=e.domain,a=(e.items??[]).map(t=>({label:t.label}));f.domains.set(t,{name:t,items:a});}},"setDomains"),setTransitions:(0,c.__name)(t=>{t&&(f.transitions=t.filter(t=>t.from!==t.to||(l.log.warn(`Cynefin: self-loop transition on domain "${t.from}" is not meaningful and will be skipped.`),!1)).map(t=>({from:t.from,to:t.to,label:t.label||void 0})));},"setTransitions"),getConfig:(0,c.__name)(()=>(0,i.cleanAndMerge)({...o.defaultConfig_default.cynefin,...(0,o.getConfig)().cynefin}),"getConfig"),clear:(0,c.__name)(()=>{(0,o.clear)(),f=d();},"clear"),setAccTitle:o.setAccTitle,getAccTitle:o.getAccTitle,setDiagramTitle:o.setDiagramTitle,getDiagramTitle:o.getDiagramTitle,getAccDescription:o.getAccDescription,setAccDescription:o.setAccDescription},p=(0,c.__name)(t=>{(0,n.populateCommonDb)(t,m),m.setDomains(t.domains),m.setTransitions(t.transitions);},"populate"),y={parse:(0,c.__name)(async t=>{let e=await (0,s.parse)("cynefin",t);l.log.debug(e),p(e);},"parse")};function g(t){let e=t+1831565813|0;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/4294967296;}function x(t){let e=0;for(let a=0;a<t.length;a++)e=(e<<5)-e+t.charCodeAt(a)|0;return e;}function h(t,e){return"number"==typeof t&&Number.isFinite(t)&&0!==t?t:x(e);}function u(t,e,a,n){let r=t/2,i=n??.015*t,o=e/7,l=[];for(let t=0;t<=7;t++){let e=g(a+17*t)*i*2-i;l.push({x:r+e,y:t*o});}let c=`M${l[0].x},${l[0].y}`;for(let t=0;t<l.length-1;t++){let e=l[t],n=l[t+1],r=(e.y+n.y)/2,o=1.5*i*(t%2==0?1:-1)*g(a+31*t+7),s=e.x+o,d=n.x-o;c+=` C${s},${r} ${d},${r} ${n.x},${n.y}`;}return c;}function $(t,e,a,n){let r=e/2,i=n??.015*e,o=t/7,l=[];for(let t=0;t<=7;t++){let e=g(a+23*t)*i*2-i;l.push({x:t*o,y:r+e});}let c=`M${l[0].x},${l[0].y}`;for(let t=0;t<l.length-1;t++){let e=l[t],n=l[t+1],r=(e.x+n.x)/2,o=1.5*i*(t%2==0?1:-1)*g(a+37*t+11),s=e.y+o,d=n.y-o;c+=` C${r},${s} ${r},${d} ${n.x},${n.y}`;}return c;}function b(t,e){let a=t/2,n=.5*e,r=.03*t;return`M${a},${n} C${a+r},${n+(e-n)*.2} ${a-1.5*r},${n+(e-n)*.55} ${a+.5*r},${n+(e-n)*.75} C${a-r},${n+(e-n)*.85} ${a+.3*r},${n+(e-n)*.95} ${a},${e}`;}function _(t,e,a,n){return`M${t-a},${e} A${a},${n} 0 1,1 ${t+a},${e} A${a},${n} 0 1,1 ${t-a},${e} Z`;}(0,c.__name)(g,"seededRandom"),(0,c.__name)(x,"hashString"),(0,c.__name)(h,"resolveSeed"),(0,c.__name)(u,"generateFoldPath"),(0,c.__name)($,"generateHorizontalBoundary"),(0,c.__name)(b,"generateCliffPath"),(0,c.__name)(_,"generateConfusionPath");var w={complex:{model:"Probe \u2192 Sense \u2192 Respond",practice:"Emergent Practices"},complicated:{model:"Sense \u2192 Analyse \u2192 Respond",practice:"Good Practices"},clear:{model:"Sense \u2192 Categorise \u2192 Respond",practice:"Best Practices"},chaotic:{model:"Act \u2192 Sense \u2192 Respond",practice:"Novel Practices"},confusion:{model:"",practice:"Disorder"}},C=(0,c.__name)((t,e)=>{let a=t/2,n=e/2;return{complex:{cx:a/2,cy:n/2,x:0,y:0,w:a,h:n},complicated:{cx:a+a/2,cy:n/2,x:a,y:0,w:a,h:n},chaotic:{cx:a/2,cy:n+n/2,x:0,y:n,w:a,h:n},clear:{cx:a+a/2,cy:n+n/2,x:a,y:n,w:a,h:n},confusion:{cx:a,cy:n,x:.7*a,y:.7*n,w:.6*a,h:.6*n}};},"getDomainLayouts"),k=(0,c.__name)(()=>{let t=(0,o.getThemeVariables)(),e=(0,o.getConfig)();return(0,i.cleanAndMerge)(t,e.themeVariables).cynefin;},"getCynefinDomainColors"),D=(0,c.__name)((t,e,a,n)=>{let i=n.db,c=i.getDomains(),s=i.getTransitions(),d=i.getDiagramTitle(),f=i.getAccTitle(),m=i.getAccDescription(),p=i.getConfig(),y=k();l.log.debug("Rendering Cynefin diagram");let g=p.width,x=p.height,D=p.padding,T=p.showDomainDescriptions,A=p.boundaryAmplitude,B=g+2*D,S=x+2*D,M={complex:y.complexBg,complicated:y.complicatedBg,clear:y.clearBg,chaotic:y.chaoticBg,confusion:y.confusionBg},v=(0,r.selectSvgElement)(e);(0,o.configureSvgSize)(v,S,B,p.useMaxWidth??!0),v.attr("viewBox",`0 0 ${B} ${S}`),f&&v.append("title").text(f),m&&v.append("desc").text(m);let z=v.append("g").attr("transform",`translate(${D}, ${D})`),L=C(g,x),P=h(p.seed,e),F=z.append("g").attr("class","cynefin-backgrounds"),I=["complex","complicated","chaotic","clear"];for(let t of I){let e=L[t];F.append("rect").attr("class","cynefinDomain").attr("x",e.x).attr("y",e.y).attr("width",e.w).attr("height",e.h).attr("fill",M[t]).attr("fill-opacity",.4).attr("stroke","none");}let R=z.append("g").attr("class","cynefin-boundaries");R.append("path").attr("class","cynefinBoundary").attr("d",u(g,x,P,A)).attr("fill","none"),R.append("path").attr("class","cynefinBoundary").attr("d",$(g,x,P+100,A)).attr("fill","none"),R.append("path").attr("class","cynefinCliff").attr("d",b(g,x)).attr("fill","none");let W=.15*g,E=.15*x;z.append("path").attr("class","cynefinConfusion").attr("d",_(g/2,x/2,W,E)).attr("fill",M.confusion).attr("fill-opacity",.5);let H=z.append("g").attr("class","cynefin-labels");for(let t of I){let e=L[t];H.append("text").attr("class","cynefinDomainLabel").attr("x",e.cx).attr("y",T?e.cy-30:e.cy).attr("text-anchor","middle").attr("dominant-baseline","middle").text(t.charAt(0).toUpperCase()+t.slice(1));}if(H.append("text").attr("class","cynefinDomainLabel").attr("x",g/2).attr("y",T?x/2-10:x/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text("Confusion"),T){let t=z.append("g").attr("class","cynefin-subtitles");for(let e of I){let a=L[e],n=w[e];t.append("text").attr("class","cynefinSubtitle").attr("x",a.cx).attr("y",a.cy-10).attr("text-anchor","middle").attr("dominant-baseline","middle").text(n.model),t.append("text").attr("class","cynefinSubtitle").attr("x",a.cx).attr("y",a.cy+5).attr("text-anchor","middle").attr("dominant-baseline","middle").text(n.practice);}t.append("text").attr("class","cynefinSubtitle").attr("x",g/2).attr("y",x/2+8).attr("text-anchor","middle").attr("dominant-baseline","middle").text(w.confusion.practice);}let V=z.append("g").attr("class","cynefin-items");for(let t of["complex","complicated","chaotic","clear","confusion"]){let e;let a=c.get(t);if(!a||0===a.items.length)continue;let n=L[t],r="confusion"===t,i=a.items,o=0;if(r&&a.items.length>3&&(o=a.items.length-3,i=a.items.slice(0,3)),r){let t=T?22:14;e=n.cy+t;}else e=n.cy+(T?25:15);if([...i].forEach((a,r)=>{let i=e+30*r,o=V.append("g"),l=o.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",13).attr("text-anchor","middle").attr("dominant-baseline","central").text(a.label),c=7*a.label.length,s=l.node();if(s&&"function"==typeof s.getBBox){let t=s.getBBox();t.width>0&&(c=t.width);}let d=c+20,f=n.cx-d/2;o.attr("transform",`translate(${f}, ${i})`),o.insert("rect","text").attr("class","cynefinItem").attr("x",0).attr("y",0).attr("width",d).attr("height",26).attr("rx",4).attr("ry",4).attr("fill",M[t]).attr("fill-opacity",.95),l.attr("x",d/2).attr("y",13);}),o>0){let a=e+30*i.length,r=`+${o} more`,l=V.append("g"),c=l.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",13).attr("text-anchor","middle").attr("dominant-baseline","central").text(r),s=7*r.length,d=c.node();if(d&&"function"==typeof d.getBBox){let t=d.getBBox();t.width>0&&(s=t.width);}let f=s+20,m=n.cx-f/2;l.attr("transform",`translate(${m}, ${a})`),l.insert("rect","text").attr("class","cynefinItemOverflow").attr("x",0).attr("y",0).attr("width",f).attr("height",26).attr("rx",4).attr("ry",4).attr("fill",M[t]).attr("fill-opacity",.6),c.attr("x",f/2).attr("y",13);}}if(s.length>0){let t=v.select("defs").empty()?v.append("defs"):v.select("defs"),a=`cynefin-arrow-${e}`;t.append("marker").attr("id",a).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","cynefinArrowHead");let n=z.append("g").attr("class","cynefin-arrows");s.forEach(t=>{let e=L[t.from],r=L[t.to];if(!e||!r)return;if(t.from===t.to){l.log.warn(`Cynefin renderer: skipping self-loop on domain "${t.from}"`);return;}let i=e.cx,o=e.cy,c=r.cx,s=r.cy,d=c-i,f=s-o,m=Math.sqrt(d*d+f*f),p=.15*m,y=(i+c)/2+-f/m*p,g=(o+s)/2+d/m*p;n.append("path").attr("class","cynefinArrowLine").attr("d",`M${i},${o} Q${y},${g} ${c},${s}`).attr("fill","none").attr("marker-end",`url(#${a})`),t.label&&n.append("text").attr("class","cynefinArrowLabel").attr("x",y).attr("y",g-6).attr("text-anchor","middle").attr("dominant-baseline","auto").text(t.label);});}d&&z.append("text").attr("class","cynefinTitle").attr("x",g/2).attr("y",-D/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text(d);},"draw"),T=(0,c.__name)(()=>{let t=(0,o.getThemeVariables)(),e=(0,o.getConfig)();return(0,i.cleanAndMerge)(t,e.themeVariables).cynefin;},"getCynefinTheme"),A={parser:y,db:m,renderer:{draw:D},styles:(0,c.__name)(()=>{let t=T();return`
	.cynefinDomain {
		stroke: none;
	}
	.cynefinDomainLabel {
		font-size: ${t.domainFontSize}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	.cynefinSubtitle {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
		font-style: italic;
	}
	.cynefinItem {
		fill-opacity: 0.95;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
	}
	.cynefinItemText {
		font-size: ${t.itemFontSize}px;
		fill: ${t.textColor};
	}
	.cynefinItemOverflow {
		fill-opacity: 0.6;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
		stroke-dasharray: 3 2;
	}
	.cynefinBoundary {
		stroke: ${t.boundaryColor};
		stroke-width: ${t.boundaryWidth};
		stroke-dasharray: 6 3;
	}
	.cynefinCliff {
		stroke: ${t.cliffColor};
		stroke-width: ${t.cliffWidth};
	}
	.cynefinConfusion {
		stroke: ${t.boundaryColor};
		stroke-width: 1.5;
		stroke-dasharray: 4 2;
	}
	.cynefinArrowLine {
		stroke: ${t.arrowColor};
		stroke-width: ${t.arrowWidth};
		fill: none;
	}
	.cynefinArrowHead {
		fill: ${t.arrowColor};
		stroke: none;
	}
	.cynefinArrowLabel {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
	}
	.cynefinTitle {
		font-size: ${t.domainFontSize+2}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	`;},"styles")};}}]);