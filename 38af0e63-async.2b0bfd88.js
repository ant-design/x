(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["38af0e63"],{"38af0e63":function(e,t,a){"use strict";a.d(t,"__esModule",{value:!0}),a.d(t,"diagram",{enumerable:!0,get:function(){return I;}});var r=a("c2ed7672"),i=a("581ac3bd"),n=a("84376f14"),l=a("a3e2fd54"),s=a("d38d060f"),o=a("67c5ec7d"),d={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},c={axes:[],curves:[],options:d},g=structuredClone(c),u=l.defaultConfig_default.radar,m=(0,s.__name)(()=>(0,n.cleanAndMerge)({...u,...(0,l.getConfig)().radar}),"getConfig"),h=(0,s.__name)(()=>g.axes,"getAxes"),p=(0,s.__name)(()=>g.curves,"getCurves"),x=(0,s.__name)(()=>g.options,"getOptions"),f=(0,s.__name)(e=>{g.axes=e.map(e=>({name:e.name,label:e.label??e.name}));},"setAxes"),_=(0,s.__name)(e=>{g.curves=e.map(e=>({name:e.name,label:e.label??e.name,entries:v(e.entries)}));},"setCurves"),v=(0,s.__name)(e=>{if(void 0==e[0].axis)return e.map(e=>e.value);let t=h();if(0===t.length)throw Error("Axes must be populated before curves for reference entries");return t.map(t=>{let a=e.find(e=>{var a;return(null===(a=e.axis)||void 0===a?void 0:a.$refText)===t.name;});if(void 0===a)throw Error("Missing entry for axis "+t.label);return a.value;});},"computeCurveEntries"),$={getAxes:h,getCurves:p,getOptions:x,setAxes:f,setCurves:_,setOptions:(0,s.__name)(e=>{var t,a,r,i,n;let l=e.reduce((e,t)=>(e[t.name]=t,e),{});g.options={showLegend:(null===(t=l.showLegend)||void 0===t?void 0:t.value)??d.showLegend,ticks:(null===(a=l.ticks)||void 0===a?void 0:a.value)??d.ticks,max:(null===(r=l.max)||void 0===r?void 0:r.value)??d.max,min:(null===(i=l.min)||void 0===i?void 0:i.value)??d.min,graticule:(null===(n=l.graticule)||void 0===n?void 0:n.value)??d.graticule};},"setOptions"),getConfig:m,clear:(0,s.__name)(()=>{(0,l.clear)(),g=structuredClone(c);},"clear"),setAccTitle:l.setAccTitle,getAccTitle:l.getAccTitle,setDiagramTitle:l.setDiagramTitle,getDiagramTitle:l.getDiagramTitle,getAccDescription:l.getAccDescription,setAccDescription:l.setAccDescription},y=(0,s.__name)(e=>{(0,i.populateCommonDb)(e,$);let{axes:t,curves:a,options:r}=e;$.setAxes(t),$.setCurves(a),$.setOptions(r);},"populate"),b={parse:(0,s.__name)(async e=>{let t=await (0,o.parse)("radar",e);s.log.debug(t),y(t);},"parse")},C=(0,s.__name)((e,t,a,i)=>{let n=i.db,l=n.getAxes(),s=n.getCurves(),o=n.getOptions(),d=n.getConfig(),c=n.getDiagramTitle(),g=M((0,r.selectSvgElement)(t),d),u=o.max??Math.max(...s.map(e=>Math.max(...e.entries))),m=o.min,h=Math.min(d.width,d.height)/2;T(g,l,h,o.ticks,o.graticule),w(g,l,h,d),A(g,l,s,m,u,o.graticule,d),S(g,s,o.showLegend,d),g.append("text").attr("class","radarTitle").text(c).attr("x",0).attr("y",-d.height/2-d.marginTop);},"draw"),M=(0,s.__name)((e,t)=>{let a=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return e.attr("viewbox",`0 0 ${a} ${r}`).attr("width",a).attr("height",r),e.append("g").attr("transform",`translate(${i.x}, ${i.y})`);},"drawFrame"),T=(0,s.__name)((e,t,a,r,i)=>{if("circle"===i)for(let t=0;t<r;t++){let i=a*(t+1)/r;e.append("circle").attr("r",i).attr("class","radarGraticule");}else if("polygon"===i){let i=t.length;for(let n=0;n<r;n++){let l=a*(n+1)/r,s=t.map((e,t)=>{let a=2*t*Math.PI/i-Math.PI/2,r=l*Math.cos(a),n=l*Math.sin(a);return`${r},${n}`;}).join(" ");e.append("polygon").attr("points",s).attr("class","radarGraticule");}}},"drawGraticule"),w=(0,s.__name)((e,t,a,r)=>{let i=t.length;for(let n=0;n<i;n++){let l=t[n].label,s=2*n*Math.PI/i-Math.PI/2;e.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*Math.cos(s)).attr("y2",a*r.axisScaleFactor*Math.sin(s)).attr("class","radarAxisLine"),e.append("text").text(l).attr("x",a*r.axisLabelFactor*Math.cos(s)).attr("y",a*r.axisLabelFactor*Math.sin(s)).attr("class","radarAxisLabel");}},"drawAxes");function A(e,t,a,r,i,n,l){let s=t.length,o=Math.min(l.width,l.height)/2;a.forEach((t,a)=>{if(t.entries.length!==s)return;let d=t.entries.map((e,t)=>{let a=2*Math.PI*t/s-Math.PI/2,n=L(e,r,i,o);return{x:n*Math.cos(a),y:n*Math.sin(a)};});"circle"===n?e.append("path").attr("d",k(d,l.curveTension)).attr("class",`radarCurve-${a}`):"polygon"===n&&e.append("polygon").attr("points",d.map(e=>`${e.x},${e.y}`).join(" ")).attr("class",`radarCurve-${a}`);});}function L(e,t,a,r){return r*(Math.min(Math.max(e,t),a)-t)/(a-t);}function k(e,t){let a=e.length,r=`M${e[0].x},${e[0].y}`;for(let i=0;i<a;i++){let n=e[(i-1+a)%a],l=e[i],s=e[(i+1)%a],o=e[(i+2)%a],d={x:l.x+(s.x-n.x)*t,y:l.y+(s.y-n.y)*t},c={x:s.x-(o.x-l.x)*t,y:s.y-(o.y-l.y)*t};r+=` C${d.x},${d.y} ${c.x},${c.y} ${s.x},${s.y}`;}return`${r} Z`;}function S(e,t,a,r){if(!a)return;let i=(r.width/2+r.marginRight)*3/4,n=-(3*(r.height/2+r.marginTop))/4;t.forEach((t,a)=>{let r=e.append("g").attr("transform",`translate(${i}, ${n+20*a})`);r.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${a}`),r.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(t.label);});}(0,s.__name)(A,"drawCurves"),(0,s.__name)(L,"relativeRadius"),(0,s.__name)(k,"closedRoundCurve"),(0,s.__name)(S,"drawLegend");var O=(0,s.__name)((e,t)=>{let a="";for(let r=0;r<e.THEME_COLOR_LIMIT;r++){let i=e[`cScale${r}`];a+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
		}
		`;}return a;},"genIndexStyles"),D=(0,s.__name)(e=>{let t=(0,l.getThemeVariables)(),a=(0,l.getConfig)(),r=(0,n.cleanAndMerge)(t,a.themeVariables),i=(0,n.cleanAndMerge)(r.radar,e);return{themeVariables:r,radarOptions:i};},"buildRadarStyleOptions"),I={parser:b,db:$,renderer:{draw:C},styles:(0,s.__name)(({radar:e}={})=>{let{themeVariables:t,radarOptions:a}=D(e);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${a.axisColor};
		stroke-width: ${a.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${a.axisLabelFontSize}px;
		color: ${a.axisColor};
	}
	.radarGraticule {
		fill: ${a.graticuleColor};
		fill-opacity: ${a.graticuleOpacity};
		stroke: ${a.graticuleColor};
		stroke-width: ${a.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${a.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${O(t,a)}
	`;},"styles")};}}]);
//# sourceMappingURL=38af0e63-async.2b0bfd88.js.map