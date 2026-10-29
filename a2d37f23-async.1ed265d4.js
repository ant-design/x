(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["a2d37f23"],{a2d37f23:function(e,t,a){"use strict";a.d(t,"__esModule",{value:!0}),a.d(t,"diagram",{enumerable:!0,get:function(){return E;}});var r=a("1b54c0d5"),i=a("05839072"),n=a("9a4da574"),l=a("3b820953"),s=a("43634b5c"),o=a("982b5e72"),d=a("67c5ec7d"),c={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},g={axes:[],curves:[],options:c},u=structuredClone(g),m=l.defaultConfig_default.radar,h=(0,o.__name)(()=>(0,n.cleanAndMerge)({...m,...(0,l.getConfig)().radar}),"getConfig"),p=(0,o.__name)(()=>u.axes,"getAxes"),x=(0,o.__name)(()=>u.curves,"getCurves"),f=(0,o.__name)(()=>u.options,"getOptions"),_=(0,o.__name)(e=>{u.axes=e.map(e=>({name:e.name,label:e.label??e.name}));},"setAxes"),v=(0,o.__name)(e=>{u.curves=e.map(e=>({name:e.name,label:e.label??e.name,entries:$(e.entries)}));},"setCurves"),$=(0,o.__name)(e=>{if(void 0==e[0].axis)return e.map(e=>e.value);let t=p();if(0===t.length)throw Error("Axes must be populated before curves for reference entries");return t.map(t=>{let a=e.find(e=>{var a;return(null===(a=e.axis)||void 0===a?void 0:a.$refText)===t.name;});if(void 0===a)throw Error("Missing entry for axis "+t.label);return a.value;});},"computeCurveEntries"),y={getAxes:p,getCurves:x,getOptions:f,setAxes:_,setCurves:v,setOptions:(0,o.__name)(e=>{var t,a,r,i,n;let l=e.reduce((e,t)=>(e[t.name]=t,e),{});u.options={showLegend:(null===(t=l.showLegend)||void 0===t?void 0:t.value)??c.showLegend,ticks:(null===(a=l.ticks)||void 0===a?void 0:a.value)??c.ticks,max:(null===(r=l.max)||void 0===r?void 0:r.value)??c.max,min:(null===(i=l.min)||void 0===i?void 0:i.value)??c.min,graticule:(null===(n=l.graticule)||void 0===n?void 0:n.value)??c.graticule},u.options.ticks>32&&(s.log.warn(`Radar diagram ticks (${u.options.ticks}) exceeds maximum allowed (32). Using 32 instead.`),u.options.ticks=32);},"setOptions"),getConfig:h,clear:(0,o.__name)(()=>{(0,l.clear)(),u=structuredClone(g);},"clear"),setAccTitle:l.setAccTitle,getAccTitle:l.getAccTitle,setDiagramTitle:l.setDiagramTitle,getDiagramTitle:l.getDiagramTitle,getAccDescription:l.getAccDescription,setAccDescription:l.setAccDescription},b=(0,o.__name)(e=>{(0,r.populateCommonDb)(e,y);let{axes:t,curves:a,options:i}=e;y.setAxes(t),y.setCurves(a),y.setOptions(i);},"populate"),C={parse:(0,o.__name)(async e=>{let t=await (0,d.parse)("radar",e);s.log.debug(t),b(t);},"parse")},w=(0,o.__name)((e,t,a,r)=>{let n=r.db,l=n.getAxes(),s=n.getCurves(),o=n.getOptions(),d=n.getConfig(),c=n.getDiagramTitle(),g=M((0,i.selectSvgElement)(t),d),u=o.max??Math.max(...s.map(e=>Math.max(...e.entries))),m=o.min,h=Math.min(d.width,d.height)/2;T(g,l,h,o.ticks,o.graticule),k(g,l,h,d),A(g,l,s,m,u,o.graticule,d),O(g,s,o.showLegend,d),g.append("text").attr("class","radarTitle").text(c).attr("x",0).attr("y",-d.height/2-d.marginTop);},"draw"),M=(0,o.__name)((e,t)=>{let a=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return(0,l.configureSvgSize)(e,r,a,t.useMaxWidth??!0),e.attr("viewBox",`0 0 ${a} ${r}`).attr("overflow","visible"),e.append("g").attr("transform",`translate(${i.x}, ${i.y})`);},"drawFrame"),T=(0,o.__name)((e,t,a,r,i)=>{if("circle"===i)for(let t=0;t<r;t++){let i=a*(t+1)/r;e.append("circle").attr("r",i).attr("class","radarGraticule");}else if("polygon"===i){let i=t.length;for(let n=0;n<r;n++){let l=a*(n+1)/r,s=t.map((e,t)=>{let a=2*t*Math.PI/i-Math.PI/2,r=l*Math.cos(a),n=l*Math.sin(a);return`${r},${n}`;}).join(" ");e.append("polygon").attr("points",s).attr("class","radarGraticule");}}},"drawGraticule"),k=(0,o.__name)((e,t,a,r)=>{let i=t.length;for(let n=0;n<i;n++){let l=t[n].label,s=2*n*Math.PI/i-Math.PI/2,o=Math.cos(s),d=Math.sin(s);e.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*o).attr("y2",a*r.axisScaleFactor*d).attr("class","radarAxisLine");let c=o>.01?"start":o<-.01?"end":"middle",g=d>.01?"hanging":d<-.01?"auto":"central";e.append("text").text(l).attr("x",a*r.axisLabelFactor*o+4*o).attr("y",a*r.axisLabelFactor*d+4*d).attr("text-anchor",c).attr("dominant-baseline",g).attr("class","radarAxisLabel");}},"drawAxes");function A(e,t,a,r,i,n,l){let s=t.length,o=Math.min(l.width,l.height)/2;a.forEach((t,a)=>{if(t.entries.length!==s)return;let d=t.entries.map((e,t)=>{let a=2*Math.PI*t/s-Math.PI/2,n=L(e,r,i,o);return{x:n*Math.cos(a),y:n*Math.sin(a)};});"circle"===n?e.append("path").attr("d",S(d,l.curveTension)).attr("class",`radarCurve-${a}`):"polygon"===n&&e.append("polygon").attr("points",d.map(e=>`${e.x},${e.y}`).join(" ")).attr("class",`radarCurve-${a}`);});}function L(e,t,a,r){return r*(Math.min(Math.max(e,t),a)-t)/(a-t);}function S(e,t){let a=e.length,r=`M${e[0].x},${e[0].y}`;for(let i=0;i<a;i++){let n=e[(i-1+a)%a],l=e[i],s=e[(i+1)%a],o=e[(i+2)%a],d={x:l.x+(s.x-n.x)*t,y:l.y+(s.y-n.y)*t},c={x:s.x-(o.x-l.x)*t,y:s.y-(o.y-l.y)*t};r+=` C${d.x},${d.y} ${c.x},${c.y} ${s.x},${s.y}`;}return`${r} Z`;}function O(e,t,a,r){if(!a)return;let i=(r.width/2+r.marginRight)*3/4,n=-(3*(r.height/2+r.marginTop))/4;t.forEach((t,a)=>{let r=e.append("g").attr("transform",`translate(${i}, ${n+20*a})`);r.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${a}`),r.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(t.label);});}(0,o.__name)(A,"drawCurves"),(0,o.__name)(L,"relativeRadius"),(0,o.__name)(S,"closedRoundCurve"),(0,o.__name)(O,"drawLegend");var D=(0,o.__name)((e,t)=>{let a="";for(let r=0;r<e.THEME_COLOR_LIMIT;r++){let i=e[`cScale${r}`];a+=`
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
		`;}return a;},"genIndexStyles"),I=(0,o.__name)(e=>{let t=(0,l.getThemeVariables)(),a=(0,l.getConfig)(),r=(0,n.cleanAndMerge)(t,a.themeVariables),i=(0,n.cleanAndMerge)(r.radar,e);return{themeVariables:r,radarOptions:i};},"buildRadarStyleOptions"),E={parser:C,db:y,renderer:{draw:w},styles:(0,o.__name)(({radar:e}={})=>{let{themeVariables:t,radarOptions:a}=I(e);return`
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
	${D(t,a)}
	`;},"styles")};}}]);