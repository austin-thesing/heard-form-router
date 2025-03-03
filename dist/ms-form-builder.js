var M=document.createElement("style");M.textContent=`
  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #FFF;
    border-bottom-color: #226752;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  @keyframes rotation {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  .form-loading {
    min-height: 200px;
    position: relative;
  }
`;document.head.appendChild(M);var b=100,w=50,k=0;function T(){let G=document.querySelector(".hbspt-form form");if(!G){if(console.warn("HubSpot form not found, retrying..."),k<w)k++,setTimeout(T,b);return}let O=Array.from(G.querySelectorAll(".hs-form-field:not(.hs_submit):not(.hs_recaptcha):not(.hs_error_rollup)")),Q=G.querySelector(".hs-richtext h3");if(Q)Q.remove();let $=G.querySelector(".legal-consent-container"),P=G.querySelector(".hs-richtext:not(:has(h3))");if(P)P.remove();if($)$.remove();G.querySelectorAll(".step-nav, .form-step, .form-navigation, .error-message").forEach((j)=>j.remove());let K=document.createElement("div");K.className="form-header";let L=document.createElement("div");if(L.className="step-nav",[1,2,3,4].forEach((j)=>{let J=document.createElement("span");J.className=j===1?"step-number active":"step-number",J.dataset.step=(j-1).toString(),J.textContent=j.toString(),L.appendChild(J)}),K.appendChild(L),Q){let j=document.createElement("div");j.className="hubspot-title-wrapper",j.appendChild(Q),K.appendChild(j)}G.insertBefore(K,G.firstChild);let y=O.slice(0,2),v=O.slice(2,5),x=O.slice(5,7),E=O.slice(7),z=[{fields:y,num:1},{fields:v,num:2},{fields:x,num:3},{fields:E,num:4}].map(({fields:j,num:J})=>{if(!j.length)return console.warn(`No fields for step ${J}`),null;let q=document.createElement("div");if(q.className=J===1?"form-step active":"form-step",q.dataset.step=J.toString(),j.forEach((Z)=>{if(Z&&Z.parentNode)q.appendChild(Z)}),J===4&&$){let Z=document.createElement("div");if(Z.className="consent-wrapper",$)Z.appendChild($);let H=document.createElement("div");H.className="privacy-text",H.textContent="Heard is committed to protecting and respecting your privacy, and we'll only use your personal information to administer your account and to provide the services you requested from us. By clicking submit on the form below, you consent to allow Heard to send SMS meeting reminders as well as store and process the personal information submitted above to provide you with the content requested.",Z.appendChild(H),q.appendChild(Z)}let U=G.querySelector(".hs_submit");return G.insertBefore(q,U),q});if(z.some((j)=>!j)){console.error("Failed to create all form steps");return}let A=document.createElement("div");A.className="form-navigation",A.innerHTML=`
    <button type="button" class="previous button-secondary">Previous</button>
    <button type="button" class="next button-primary">Next</button>
    <button type="submit" class="submit button-primary">Submit</button>
  `;let X=document.createElement("div");X.className="error-message",X.style.display="none",X.textContent="Please fill out all required fields.",G.appendChild(A),G.appendChild(X);let Y=0,g=document.querySelectorAll(".step-nav .step-number");function _(j){document.querySelectorAll(".form-step").forEach((J,q)=>{J.classList.toggle("active",q===j)}),g.forEach((J,q)=>{J.classList.toggle("active",q<=j)}),f(j)}function f(j){let J=document.querySelector(".previous"),q=document.querySelector(".next"),U=document.querySelector(".submit");J.style.display=j===0?"none":"block",q.style.display=j===z.length-1?"none":"block",U.style.display=j===z.length-1?"block":"none"}function R(j){let J=z[j],q=!0;return J.querySelectorAll("select").forEach((U)=>{if(U.closest("[required]")&&!U.value)q=!1}),J.querySelectorAll("input").forEach((U)=>{if(U.closest("[required]")&&!U.value)q=!1;if(U.getAttribute("data-gtm-form-interact-field-id"))q=!0}),J.querySelectorAll("ul.multi-container").forEach((U)=>{if(!U.querySelector('input[type="radio"]:checked'))q=!1}),q}function B(j){X.style.display=j?"block":"none"}document.querySelector(".next").addEventListener("click",()=>{if(R(Y)){if(B(!1),Y<z.length-1)Y++,_(Y)}else B(!0)}),document.querySelector(".previous").addEventListener("click",()=>{if(Y>0)Y--,_(Y)}),G.addEventListener("submit",function(j){if(!R(Y)){j.preventDefault(),B(!0);return}let J={};G.querySelectorAll("input, select").forEach((q)=>{if(q.name)if(q.type==="radio"){if(q.checked)J[q.name]=q.value}else J[q.name]=q.value});try{localStorage.setItem("hubspot_form_data",JSON.stringify(J)),console.log("MS Form - Stored form data in localStorage")}catch(q){console.error("MS Form - Storage failed:",q)}}),_(Y);let W=document.querySelector(".hbspt-form");if(W)W.style.display="block";let N=localStorage.getItem("my_email"),V=document.querySelector('input[type="email"]');if(V&&N)V.value=N}function C(G){let O=document.createElement("div");O.className="image-container";let Q=document.createElement("img");Q.className="select-image",Q.src="https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg",Q.alt="Image",O.appendChild(Q),G.appendChild(O)}document.addEventListener("DOMContentLoaded",()=>{D()});function D(){let G=document.querySelector(".hbspt-form"),O=document.querySelector(".right_step_form");if(O&&!O.querySelector(".loader")){O.classList.add("form-loading");let P=document.createElement("span");if(P.className="loader",O.appendChild(P),G)G.style.display="none"}if(!G||!G.querySelector("form")){if(k++,k<w){requestAnimationFrame(D);return}if(console.warn("HubSpot form not found or not fully loaded after maximum retries"),O){O.classList.remove("form-loading");let P=O.querySelector(".loader");if(P)P.remove()}return}k=0,T();let Q=O?.querySelector(".loader");if(Q)Q.remove(),O.classList.remove("form-loading");if(G)G.style.display="block";let $=document.querySelectorAll(".form-step .input select");if($.length)$.forEach((P)=>{if(P&&P.parentElement)C(P.parentElement),P.addEventListener("change",(I)=>{let K=P.parentElement.querySelector(".select-image");if(!K)return;let L=I.target.value;K.src=L==="default"||L===""?"https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg":"https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd131c9a0a6e9c7f805c3_Vector%202533.svg"})})}window.initializeMultiStepFormOnReady=function(){console.log("MS Form - HubSpot form ready callback received"),D()};
