import{r as d,J as L,j as A}from"./app-DwOPwvF1.js";let _={data:""},H=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||_,R=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,J=/\/\*[^]*?\*\/|  +/g,P=/\n+/g,b=(e,t)=>{let a="",o="",n="";for(let r in e){let i=e[r];r[0]=="@"?r[1]=="i"?a=r+" "+i+";":o+=r[1]=="f"?b(i,r):r+"{"+b(i,r[1]=="k"?"":t)+"}":typeof i=="object"?o+=b(i,t?t.replace(/([^,])+/g,s=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,s):s?s+" "+l:l)):r):i!=null&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=b.p?b.p(r,i):r+":"+i+";")}return a+(t&&n?t+"{"+n+"}":n)+o},y={},M=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+M(e[a]);return t}return e},U=(e,t,a,o,n)=>{let r=M(e),i=y[r]||(y[r]=(l=>{let c=0,p=11;for(;c<l.length;)p=101*p+l.charCodeAt(c++)>>>0;return"go"+p})(r));if(!y[i]){let l=r!==e?e:(c=>{let p,m,f=[{}];for(;p=R.exec(c.replace(J,""));)p[4]?f.shift():p[3]?(m=p[3].replace(P," ").trim(),f.unshift(f[0][m]=f[0][m]||{})):f[0][p[1]]=p[2].replace(P," ").trim();return f[0]})(e);y[i]=b(n?{["@keyframes "+i]:l}:l,a?"":"."+i)}let s=a&&y.g?y.g:null;return a&&(y.g=y[i]),((l,c,p,m)=>{m?c.data=c.data.replace(m,l):c.data.indexOf(l)===-1&&(c.data=p?l+c.data:c.data+l)})(y[i],t,o,s),i},q=(e,t,a)=>e.reduce((o,n,r)=>{let i=t[r];if(i&&i.call){let s=i(a),l=s&&s.props&&s.props.className||/^go/.test(s)&&s;i=l?"."+l:s&&typeof s=="object"?s.props?"":b(s,""):s===!1?"":s}return o+n+(i??"")},"");function O(e){let t=this||{},a=e.call?e(t.p):e;return U(a.unshift?a.raw?q(a,[].slice.call(arguments,1),t.p):a.reduce((o,n)=>Object.assign(o,n&&n.call?n(t.p):n),{}):a,H(t.target),t.g,t.o,t.k)}let S,N,z;O.bind({g:1});let h=O.bind({k:1});function V(e,t,a,o){b.p=t,S=e,N=a,z=o}function v(e,t){let a=this||{};return function(){let o=arguments;function n(r,i){let s=Object.assign({},r),l=s.className||n.className;a.p=Object.assign({theme:N&&N()},s),a.o=/ *go\d+/.test(l),s.className=O.apply(a,o)+(l?" "+l:"");let c=e;return e[0]&&(c=s.as||e,delete s.as),z&&c[0]&&z(s),S(c,s)}return t?t(n):n}}var W=e=>typeof e=="function",D=(e,t)=>W(e)?e(t):e,Y=(()=>{let e=0;return()=>(++e).toString()})(),T=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),Z=20,F=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,Z)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:a}=t;return F(e,{type:e.toasts.find(r=>r.id===a.id)?1:0,toast:a});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(r=>r.id===o||o===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+n}))}}},j=[],x={toasts:[],pausedAt:void 0},w=e=>{x=F(x,e),j.forEach(t=>{t(x)})},B={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},K=(e={})=>{let[t,a]=d.useState(x),o=d.useRef(x);d.useEffect(()=>(o.current!==x&&a(x),j.push(a),()=>{let r=j.indexOf(a);r>-1&&j.splice(r,1)}),[]);let n=t.toasts.map(r=>{var i,s,l;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||((i=e[r.type])==null?void 0:i.removeDelay)||(e==null?void 0:e.removeDelay),duration:r.duration||((s=e[r.type])==null?void 0:s.duration)||(e==null?void 0:e.duration)||B[r.type],style:{...e.style,...(l=e[r.type])==null?void 0:l.style,...r.style}}});return{...t,toasts:n}},X=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(a==null?void 0:a.id)||Y()}),$=e=>(t,a)=>{let o=X(t,e,a);return w({type:2,toast:o}),o.id},u=(e,t)=>$("blank")(e,t);u.error=$("error");u.success=$("success");u.loading=$("loading");u.custom=$("custom");u.dismiss=e=>{w({type:3,toastId:e})};u.remove=e=>w({type:4,toastId:e});u.promise=(e,t,a)=>{let o=u.loading(t.loading,{...a,...a==null?void 0:a.loading});return typeof e=="function"&&(e=e()),e.then(n=>{let r=t.success?D(t.success,n):void 0;return r?u.success(r,{id:o,...a,...a==null?void 0:a.success}):u.dismiss(o),n}).catch(n=>{let r=t.error?D(t.error,n):void 0;r?u.error(r,{id:o,...a,...a==null?void 0:a.error}):u.dismiss(o)}),e};var G=(e,t)=>{w({type:1,toast:{id:e,height:t}})},Q=()=>{w({type:5,time:Date.now()})},E=new Map,ee=1e3,te=(e,t=ee)=>{if(E.has(e))return;let a=setTimeout(()=>{E.delete(e),w({type:4,toastId:e})},t);E.set(e,a)},re=e=>{let{toasts:t,pausedAt:a}=K(e);d.useEffect(()=>{if(a)return;let r=Date.now(),i=t.map(s=>{if(s.duration===1/0)return;let l=(s.duration||0)+s.pauseDuration-(r-s.createdAt);if(l<0){s.visible&&u.dismiss(s.id);return}return setTimeout(()=>u.dismiss(s.id),l)});return()=>{i.forEach(s=>s&&clearTimeout(s))}},[t,a]);let o=d.useCallback(()=>{a&&w({type:6,time:Date.now()})},[a]),n=d.useCallback((r,i)=>{let{reverseOrder:s=!1,gutter:l=8,defaultPosition:c}=i||{},p=t.filter(g=>(g.position||c)===(r.position||c)&&g.height),m=p.findIndex(g=>g.id===r.id),f=p.filter((g,C)=>C<m&&g.visible).length;return p.filter(g=>g.visible).slice(...s?[f+1]:[0,f]).reduce((g,C)=>g+(C.height||0)+l,0)},[t]);return d.useEffect(()=>{t.forEach(r=>{if(r.dismissed)te(r.id,r.removeDelay);else{let i=E.get(r.id);i&&(clearTimeout(i),E.delete(r.id))}})},[t]),{toasts:t,handlers:{updateHeight:G,startPause:Q,endPause:o,calculateOffset:n}}},ae=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,se=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,oe=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,ie=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ae} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${se} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${oe} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,ne=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,le=v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${ne} 1s linear infinite;
`,ce=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,de=h`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,pe=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ce} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${de} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,ue=v("div")`
  position: absolute;
`,fe=v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,me=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ge=v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${me} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ye=({toast:e})=>{let{icon:t,type:a,iconTheme:o}=e;return t!==void 0?typeof t=="string"?d.createElement(ge,null,t):t:a==="blank"?null:d.createElement(fe,null,d.createElement(le,{...o}),a!=="loading"&&d.createElement(ue,null,a==="error"?d.createElement(ie,{...o}):d.createElement(pe,{...o})))},he=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,be=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,ve="0%{opacity:0;} 100%{opacity:1;}",xe="0%{opacity:1;} 100%{opacity:0;}",we=v("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Ee=v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,$e=(e,t)=>{let a=e.includes("top")?1:-1,[o,n]=T()?[ve,xe]:[he(a),be(a)];return{animation:t?`${h(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},ke=d.memo(({toast:e,position:t,style:a,children:o})=>{let n=e.height?$e(e.position||t||"top-center",e.visible):{opacity:0},r=d.createElement(ye,{toast:e}),i=d.createElement(Ee,{...e.ariaProps},D(e.message,e));return d.createElement(we,{className:e.className,style:{...n,...a,...e.style}},typeof o=="function"?o({icon:r,message:i}):d.createElement(d.Fragment,null,r,i))});V(d.createElement);var je=({id:e,className:t,style:a,onHeightUpdate:o,children:n})=>{let r=d.useCallback(i=>{if(i){let s=()=>{let l=i.getBoundingClientRect().height;o(e,l)};s(),new MutationObserver(s).observe(i,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return d.createElement("div",{ref:r,className:t,style:a},n)},De=(e,t)=>{let a=e.includes("top"),o=a?{top:0}:{bottom:0},n=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:T()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...o,...n}},Oe=O`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,k=16,Ce=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:o,children:n,containerStyle:r,containerClassName:i})=>{let{toasts:s,handlers:l}=re(a);return d.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:k,left:k,right:k,bottom:k,pointerEvents:"none",...r},className:i,onMouseEnter:l.startPause,onMouseLeave:l.endPause},s.map(c=>{let p=c.position||t,m=l.calculateOffset(c,{reverseOrder:e,gutter:o,defaultPosition:t}),f=De(p,m);return d.createElement(je,{id:c.id,key:c.id,onHeightUpdate:l.updateHeight,className:c.visible?Oe:"",style:f},c.type==="custom"?D(c.message,c):n?n(c):d.createElement(ke,{toast:c,position:p}))}))},I=u;function Ne({children:e}){const{flash:t={}}=L().props;return d.useEffect(()=>{t.success&&I.success(t.success,{id:"flash-success",iconTheme:{primary:"#16a34a",secondary:"#ffffff"}}),t.error&&I.error(t.error,{id:"flash-error"})},[t.success,t.error]),A.jsxs(A.Fragment,{children:[e,A.jsx(Ce,{position:"top-center",toastOptions:{style:{background:"var(--color-base-100)",border:"1px solid var(--app-border)",color:"var(--color-base-content)"},success:{style:{background:"#dcfce7",border:"1px solid rgba(22, 163, 74, 0.35)",color:"#14532d",fontWeight:700}}}})]})}export{Ne as L};
