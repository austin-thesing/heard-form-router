(function(){(()=>{let M=document.createElement("style");M.textContent=`
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
  }`,document.head.appendChild(M);let F=100,T=50,X=0;function V(){let K=document.querySelector(".hbspt-form form");if(!K){if(console.warn("HubSpot form not found, retrying..."),X<T)X++,setTimeout(V,F);return}let Q=!1,Z=null,Y=!1,U=K.querySelector('input[type="email"]');if(U)U.addEventListener("change",function(j){let J=j.target.value;if(J&&J.includes("@")){Z=J;let q=document.querySelector('.hidden-form input[type="email"]');if(q)q.value=J}});K.addEventListener("submit",function(){Q=!0});function L(){if(!Q&&!Y&&Z){let j=document.querySelector(".hidden-form");if(j){let J=new FormData(j),q=j.getAttribute("action");fetch(q,{method:"POST",body:J,headers:{Accept:"application/json"}}).then((O)=>{if(O.ok)Y=!0,console.log("Submitted partial email:",Z)}).catch((O)=>{console.error("Error submitting partial email:",O)})}}}document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden")L()}),window.addEventListener("beforeunload",function(){L()});let G=Array.from(K.querySelectorAll(".hs-form-field:not(.hs_submit):not(.hs_recaptcha):not(.hs_error_rollup)")),w=K.querySelector(".hs-richtext h3");if(w)w.remove();let A=K.querySelector(".legal-consent-container"),y=K.querySelector(".hs-richtext:not(:has(h3))");if(y)y.remove();if(A)A.remove();K.querySelectorAll(".step-nav, .form-step, .form-navigation, .error-message").forEach((j)=>j.remove());let P=document.createElement("div");P.className="form-header";let N=document.createElement("div");if(N.className="step-nav",[1,2,3,4].forEach((j)=>{let J=document.createElement("span");J.className=j===1?"step-number active":"step-number",J.dataset.step=(j-1).toString(),J.textContent=j.toString(),N.appendChild(J)}),P.appendChild(N),w){let j=document.createElement("div");j.className="hubspot-title-wrapper",j.appendChild(w),P.appendChild(j)}K.insertBefore(P,K.firstChild);let g=G.slice(0,2),S=G.slice(2,5),v=G.slice(5,8),E=G.slice(8),_=[{fields:g,num:1},{fields:S,num:2},{fields:v,num:3},{fields:E,num:4}].map(({fields:j,num:J})=>{if(!j.length)return console.warn(`No fields for step ${J}`),null;let q=document.createElement("div");if(q.className=J===1?"form-step active":"form-step",q.dataset.step=J.toString(),j.forEach(($)=>{if($&&$.parentNode)q.appendChild($)}),J===4&&A){let $=document.createElement("div");if($.className="consent-wrapper",A)$.appendChild(A);let H=document.createElement("div");H.className="privacy-text",H.textContent="Heard is committed to protecting and respecting your privacy, and we'll only use your personal information to administer your account and to provide the services you requested from us. By clicking submit on the form below, you consent to allow Heard to send SMS meeting reminders as well as store and process the personal information submitted above to provide you with the content requested.",$.appendChild(H),q.appendChild($)}let O=K.querySelector(".hs_submit");return K.insertBefore(q,O),q});if(_.some((j)=>!j)){console.error("Failed to create all form steps");return}let z=document.createElement("div");z.className="form-navigation",z.innerHTML=`
      <button type="button" class="previous button-secondary">Previous</button>
      <button type="button" class="next button-primary">Next</button>
      <button type="submit" class="submit button-primary">Submit</button>
    `;let B=document.createElement("div");B.className="error-message",B.style.display="none",B.textContent="Please fill out all required fields.",K.appendChild(z),K.appendChild(B);let k=0,c=document.querySelectorAll(".step-nav .step-number");function R(j){document.querySelectorAll(".form-step").forEach((J,q)=>{J.classList.toggle("active",q===j)}),c.forEach((J,q)=>{J.classList.toggle("active",q<=j)}),f(j)}function f(j){let J=document.querySelector(".previous"),q=document.querySelector(".next"),O=document.querySelector(".submit");J.style.display=j===0?"none":"block",q.style.display=j===_.length-1?"none":"block",O.style.display=j===_.length-1?"block":"none"}function x(j){let J=_[j],q=!0;return J.querySelectorAll("select").forEach((O)=>{if(O.closest("[required]")&&!O.value)q=!1}),J.querySelectorAll("input").forEach((O)=>{if(O.closest("[required]")&&!O.value)q=!1;if(O.getAttribute("data-gtm-form-interact-field-id"))q=!0}),J.querySelectorAll("ul.multi-container").forEach((O)=>{if(O.querySelector('input[type="radio"]')){if(!O.querySelector('input[type="radio"]:checked'))q=!1}}),J.querySelectorAll("ul.multi-container").forEach((O)=>{let $=O.querySelectorAll('input[type="checkbox"]');if(Array.from($).some((H)=>H.required)){if(!O.querySelector('input[type="checkbox"]:checked'))q=!1}}),q}function I(j){B.style.display=j?"block":"none"}document.querySelector(".next").addEventListener("click",()=>{if(x(k)){if(I(!1),k<_.length-1)k++,R(k)}else I(!0)}),document.querySelector(".previous").addEventListener("click",()=>{if(k>0)k--,R(k)}),K.addEventListener("submit",function(j){if(!x(k)){j.preventDefault(),I(!0);return}let J={};K.querySelectorAll("input, select").forEach((q)=>{if(q.name)if(q.type==="radio"){if(q.checked)J[q.name]=q.value}else J[q.name]=q.value});try{localStorage.setItem("hubspot_form_data",JSON.stringify(J)),console.log("MS Form - Stored form data in localStorage")}catch(q){console.error("MS Form - Storage failed:",q)}}),R(k);let b=document.querySelector(".hbspt-form");if(b)b.style.display="block";let h=localStorage.getItem("my_email"),W=document.querySelector('input[type="email"]');if(W&&h)W.value=h}function C(K){let Q=document.createElement("div");Q.className="image-container";let Z=document.createElement("img");Z.className="select-image",Z.src="https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg",Z.alt="Image",Q.appendChild(Z),K.appendChild(Q)}document.addEventListener("DOMContentLoaded",()=>{D()});function D(){let K=document.querySelector(".hbspt-form"),Q=document.querySelector(".right_step_form");if(Q&&!Q.querySelector(".loader")){Q.classList.add("form-loading");let U=document.createElement("span");if(U.className="loader",Q.appendChild(U),K)K.style.display="none"}if(!K||!K.querySelector("form")){if(X++,X<T){requestAnimationFrame(D);return}if(console.warn("HubSpot form not found or not fully loaded after maximum retries"),Q){Q.classList.remove("form-loading");let U=Q.querySelector(".loader");if(U)U.remove()}return}X=0,V();let Z=Q?.querySelector(".loader");if(Z)Z.remove(),Q.classList.remove("form-loading");if(K)K.style.display="block";let Y=document.querySelectorAll(".form-step .input select");if(Y.length)Y.forEach((U)=>{if(U&&U.parentElement)C(U.parentElement),U.addEventListener("change",(L)=>{let G=U.parentElement.querySelector(".select-image");if(!G)return;let w=L.target.value;G.src=w==="default"||w===""?"https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg":"https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd131c9a0a6e9c7f805c3_Vector%202533.svg"})})}window.initializeMultiStepFormOnReady=function(){console.log("MS Form - HubSpot form ready callback received"),D()}})();
})();