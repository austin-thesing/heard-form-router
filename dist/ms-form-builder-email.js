(function(){var y=document.createElement("style");y.textContent=`
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
`;document.head.appendChild(y);var b=100,v=50,k=0;function w(){let J=document.querySelector(".hbspt-form form");if(!J){if(console.warn("HubSpot form not found, retrying..."),k<v)k++,setTimeout(w,b);return}let O=!1,Y=null,L=J.querySelector('input[type="email"]');if(L)L.addEventListener("change",function(G){let j=G.target.value;if(j&&j.includes("@")){Y=j;let q=document.querySelector('.hidden-form input[type="email"]');if(q)q.value=j}});J.addEventListener("submit",function(){O=!0}),window.addEventListener("beforeunload",function(G){if(!O&&Y){let j=document.querySelector(".hidden-form");if(j)j.dispatchEvent(new Event("submit",{bubbles:!0}))}});let P=Array.from(J.querySelectorAll(".hs-form-field:not(.hs_submit):not(.hs_recaptcha):not(.hs_error_rollup)")),K=J.querySelector(".hs-richtext h3");if(K)K.remove();let $=J.querySelector(".legal-consent-container"),z=J.querySelector(".hs-richtext:not(:has(h3))");if(z)z.remove();if($)$.remove();J.querySelectorAll(".step-nav, .form-step, .form-navigation, .error-message").forEach((G)=>G.remove());let B=document.createElement("div");B.className="form-header";let H=document.createElement("div");if(H.className="step-nav",[1,2,3,4].forEach((G)=>{let j=document.createElement("span");j.className=G===1?"step-number active":"step-number",j.dataset.step=(G-1).toString(),j.textContent=G.toString(),H.appendChild(j)}),B.appendChild(H),K){let G=document.createElement("div");G.className="hubspot-title-wrapper",G.appendChild(K),B.appendChild(G)}J.insertBefore(B,J.firstChild);let x=P.slice(0,2),g=P.slice(2,5),E=P.slice(5,8),C=P.slice(8),X=[{fields:x,num:1},{fields:g,num:2},{fields:E,num:3},{fields:C,num:4}].map(({fields:G,num:j})=>{if(!G.length)return console.warn(`No fields for step ${j}`),null;let q=document.createElement("div");if(q.className=j===1?"form-step active":"form-step",q.dataset.step=j.toString(),G.forEach((U)=>{if(U&&U.parentNode)q.appendChild(U)}),j===4&&$){let U=document.createElement("div");if(U.className="consent-wrapper",$)U.appendChild($);let _=document.createElement("div");_.className="privacy-text",_.textContent="Heard is committed to protecting and respecting your privacy, and we'll only use your personal information to administer your account and to provide the services you requested from us. By clicking submit on the form below, you consent to allow Heard to send SMS meeting reminders as well as store and process the personal information submitted above to provide you with the content requested.",U.appendChild(_),q.appendChild(U)}let Q=J.querySelector(".hs_submit");return J.insertBefore(q,Q),q});if(X.some((G)=>!G)){console.error("Failed to create all form steps");return}let D=document.createElement("div");D.className="form-navigation",D.innerHTML=`
    <button type="button" class="previous button-secondary">Previous</button>
    <button type="button" class="next button-primary">Next</button>
    <button type="submit" class="submit button-primary">Submit</button>
  `;let A=document.createElement("div");A.className="error-message",A.style.display="none",A.textContent="Please fill out all required fields.",J.appendChild(D),J.appendChild(A);let Z=0,f=document.querySelectorAll(".step-nav .step-number");function R(G){document.querySelectorAll(".form-step").forEach((j,q)=>{j.classList.toggle("active",q===G)}),f.forEach((j,q)=>{j.classList.toggle("active",q<=G)}),S(G)}function S(G){let j=document.querySelector(".previous"),q=document.querySelector(".next"),Q=document.querySelector(".submit");j.style.display=G===0?"none":"block",q.style.display=G===X.length-1?"none":"block",Q.style.display=G===X.length-1?"block":"none"}function N(G){let j=X[G],q=!0;return j.querySelectorAll("select").forEach((Q)=>{if(Q.closest("[required]")&&!Q.value)q=!1}),j.querySelectorAll("input").forEach((Q)=>{if(Q.closest("[required]")&&!Q.value)q=!1;if(Q.getAttribute("data-gtm-form-interact-field-id"))q=!0}),j.querySelectorAll("ul.multi-container").forEach((Q)=>{if(Q.querySelector('input[type="radio"]')){if(!Q.querySelector('input[type="radio"]:checked'))q=!1}}),j.querySelectorAll("ul.multi-container").forEach((Q)=>{let U=Q.querySelectorAll('input[type="checkbox"]');if(Array.from(U).some((_)=>_.required)){if(!Q.querySelector('input[type="checkbox"]:checked'))q=!1}}),q}function W(G){A.style.display=G?"block":"none"}document.querySelector(".next").addEventListener("click",()=>{if(N(Z)){if(W(!1),Z<X.length-1)Z++,R(Z)}else W(!0)}),document.querySelector(".previous").addEventListener("click",()=>{if(Z>0)Z--,R(Z)}),J.addEventListener("submit",function(G){if(!N(Z)){G.preventDefault(),W(!0);return}let j={};J.querySelectorAll("input, select").forEach((q)=>{if(q.name)if(q.type==="radio"){if(q.checked)j[q.name]=q.value}else j[q.name]=q.value});try{localStorage.setItem("hubspot_form_data",JSON.stringify(j)),console.log("MS Form - Stored form data in localStorage")}catch(q){console.error("MS Form - Storage failed:",q)}}),R(Z);let V=document.querySelector(".hbspt-form");if(V)V.style.display="block";let M=localStorage.getItem("my_email"),T=document.querySelector('input[type="email"]');if(T&&M)T.value=M}function h(J){let O=document.createElement("div");O.className="image-container";let Y=document.createElement("img");Y.className="select-image",Y.src="https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg",Y.alt="Image",O.appendChild(Y),J.appendChild(O)}document.addEventListener("DOMContentLoaded",()=>{I()});function I(){let J=document.querySelector(".hbspt-form"),O=document.querySelector(".right_step_form");if(O&&!O.querySelector(".loader")){O.classList.add("form-loading");let P=document.createElement("span");if(P.className="loader",O.appendChild(P),J)J.style.display="none"}if(!J||!J.querySelector("form")){if(k++,k<v){requestAnimationFrame(I);return}if(console.warn("HubSpot form not found or not fully loaded after maximum retries"),O){O.classList.remove("form-loading");let P=O.querySelector(".loader");if(P)P.remove()}return}k=0,w();let Y=O?.querySelector(".loader");if(Y)Y.remove(),O.classList.remove("form-loading");if(J)J.style.display="block";let L=document.querySelectorAll(".form-step .input select");if(L.length)L.forEach((P)=>{if(P&&P.parentElement)h(P.parentElement),P.addEventListener("change",(K)=>{let $=P.parentElement.querySelector(".select-image");if(!$)return;let z=K.target.value;$.src=z==="default"||z===""?"https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg":"https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd131c9a0a6e9c7f805c3_Vector%202533.svg"})})}window.initializeMultiStepFormOnReady=function(){console.log("MS Form - HubSpot form ready callback received"),I()};
})();