(function(){var w=document.createElement("style");w.textContent=`
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

  .hs-form-field input[type="checkbox"] {
    vertical-align: middle;
    accent-color: #226752;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .hs-form-field.hs-fieldtype-checkbox label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    cursor: pointer;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.2;
  }

  .hs-form-field.hs-fieldtype-checkbox {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .hs-form-field > label > span {
    font-weight: bold;
    line-height: 174%;
  }
`;document.head.appendChild(w);var h=100,x=50,B=0;function g(){let J=document.querySelector(".hbspt-form form");if(!J){if(console.warn("HubSpot form not found, retrying..."),B<x)B++,setTimeout(g,h);return}let O=!1,Y=null,z=!1,U=J.querySelector('input[type="email"]');if(U)U.addEventListener("change",function(j){let G=j.target.value;if(G&&G.includes("@")){Y=G;let q=document.querySelector('.hidden-form input[type="email"]');if(q)q.value=G}});J.addEventListener("submit",function(){O=!0});function H(){if(!O&&!z&&Y){let j=document.querySelector(".hidden-form");if(j)j.dispatchEvent(new Event("submit",{bubbles:!0})),z=!0,console.log("Submitted partial email:",Y)}}document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden")H()}),window.addEventListener("beforeunload",function(){H()});let K=Array.from(J.querySelectorAll(".hs-form-field:not(.hs_submit):not(.hs_recaptcha):not(.hs_error_rollup)")),L=J.querySelector(".hs-richtext h3");if(L)L.remove();let X=J.querySelector(".legal-consent-container"),V=J.querySelector(".hs-richtext:not(:has(h3))");if(V)V.remove();if(X)X.remove();J.querySelectorAll(".step-nav, .form-step, .form-navigation, .error-message").forEach((j)=>j.remove());let P=document.createElement("div");P.className="form-header";let D=document.createElement("div");if(D.className="step-nav",[1,2,3,4].forEach((j)=>{let G=document.createElement("span");G.className=j===1?"step-number active":"step-number",G.dataset.step=(j-1).toString(),G.textContent=j.toString(),D.appendChild(G)}),P.appendChild(D),L){let j=document.createElement("div");j.className="hubspot-title-wrapper",j.appendChild(L),P.appendChild(j)}J.insertBefore(P,J.firstChild);let E=K.slice(0,2),C=K.slice(2,5),f=K.slice(5,8),S=K.slice(8),A=[{fields:E,num:1},{fields:C,num:2},{fields:f,num:3},{fields:S,num:4}].map(({fields:j,num:G})=>{if(!j.length)return console.warn(`No fields for step ${G}`),null;let q=document.createElement("div");if(q.className=G===1?"form-step active":"form-step",q.dataset.step=G.toString(),j.forEach((Z)=>{if(Z&&Z.parentNode)q.appendChild(Z)}),G===4&&X){let Z=document.createElement("div");if(Z.className="consent-wrapper",X)Z.appendChild(X);let k=document.createElement("div");k.className="privacy-text",k.textContent="Heard is committed to protecting and respecting your privacy, and we'll only use your personal information to administer your account and to provide the services you requested from us. By clicking submit on the form below, you consent to allow Heard to send SMS meeting reminders as well as store and process the personal information submitted above to provide you with the content requested.",Z.appendChild(k),q.appendChild(Z)}let Q=J.querySelector(".hs_submit");return J.insertBefore(q,Q),q});if(A.some((j)=>!j)){console.error("Failed to create all form steps");return}let R=document.createElement("div");R.className="form-navigation",R.innerHTML=`
    <button type="button" class="previous button-secondary">Previous</button>
    <button type="button" class="next button-primary">Next</button>
    <button type="submit" class="submit button-primary">Submit</button>
  `;let _=document.createElement("div");_.className="error-message",_.style.display="none",_.textContent="Please fill out all required fields.",J.appendChild(R),J.appendChild(_);let $=0,F=document.querySelectorAll(".step-nav .step-number");function W(j){document.querySelectorAll(".form-step").forEach((G,q)=>{G.classList.toggle("active",q===j)}),F.forEach((G,q)=>{G.classList.toggle("active",q<=j)}),b(j)}function b(j){let G=document.querySelector(".previous"),q=document.querySelector(".next"),Q=document.querySelector(".submit");G.style.display=j===0?"none":"block",q.style.display=j===A.length-1?"none":"block",Q.style.display=j===A.length-1?"block":"none"}function M(j){let G=A[j],q=!0;return G.querySelectorAll("select").forEach((Q)=>{if(Q.closest("[required]")&&!Q.value)q=!1}),G.querySelectorAll("input").forEach((Q)=>{if(Q.closest("[required]")&&!Q.value)q=!1;if(Q.getAttribute("data-gtm-form-interact-field-id"))q=!0}),G.querySelectorAll("ul.multi-container").forEach((Q)=>{if(Q.querySelector('input[type="radio"]')){if(!Q.querySelector('input[type="radio"]:checked'))q=!1}}),G.querySelectorAll("ul.multi-container").forEach((Q)=>{let Z=Q.querySelectorAll('input[type="checkbox"]');if(Array.from(Z).some((k)=>k.required)){if(!Q.querySelector('input[type="checkbox"]:checked'))q=!1}}),q}function I(j){_.style.display=j?"block":"none"}document.querySelector(".next").addEventListener("click",()=>{if(M($)){if(I(!1),$<A.length-1)$++,W($)}else I(!0)}),document.querySelector(".previous").addEventListener("click",()=>{if($>0)$--,W($)}),J.addEventListener("submit",function(j){if(!M($)){j.preventDefault(),I(!0);return}let G={};J.querySelectorAll("input, select").forEach((q)=>{if(q.name)if(q.type==="radio"){if(q.checked)G[q.name]=q.value}else G[q.name]=q.value});try{localStorage.setItem("hubspot_form_data",JSON.stringify(G)),console.log("MS Form - Stored form data in localStorage")}catch(q){console.error("MS Form - Storage failed:",q)}}),W($);let T=document.querySelector(".hbspt-form");if(T)T.style.display="block";let y=localStorage.getItem("my_email"),v=document.querySelector('input[type="email"]');if(v&&y)v.value=y}function c(J){let O=document.createElement("div");O.className="image-container";let Y=document.createElement("img");Y.className="select-image",Y.src="https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg",Y.alt="Image",O.appendChild(Y),J.appendChild(O)}document.addEventListener("DOMContentLoaded",()=>{N()});function N(){let J=document.querySelector(".hbspt-form"),O=document.querySelector(".right_step_form");if(O&&!O.querySelector(".loader")){O.classList.add("form-loading");let U=document.createElement("span");if(U.className="loader",O.appendChild(U),J)J.style.display="none"}if(!J||!J.querySelector("form")){if(B++,B<x){requestAnimationFrame(N);return}if(console.warn("HubSpot form not found or not fully loaded after maximum retries"),O){O.classList.remove("form-loading");let U=O.querySelector(".loader");if(U)U.remove()}return}B=0,g();let Y=O?.querySelector(".loader");if(Y)Y.remove(),O.classList.remove("form-loading");if(J)J.style.display="block";let z=document.querySelectorAll(".form-step .input select");if(z.length)z.forEach((U)=>{if(U&&U.parentElement)c(U.parentElement),U.addEventListener("change",(H)=>{let K=U.parentElement.querySelector(".select-image");if(!K)return;let L=H.target.value;K.src=L==="default"||L===""?"https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg":"https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd131c9a0a6e9c7f805c3_Vector%202533.svg"})})}window.initializeMultiStepFormOnReady=function(){console.log("MS Form - HubSpot form ready callback received"),N()};
})();