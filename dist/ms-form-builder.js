(function(){var V=document.createElement("style");V.textContent=`
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
`;document.head.appendChild(V);var C=100,w=50,_=0;function T(){let J=document.querySelector(".hbspt-form form");if(!J){if(console.warn("HubSpot form not found, retrying..."),_<w)_++,setTimeout(T,C);return}let O=Array.from(J.querySelectorAll(".hs-form-field:not(.hs_submit):not(.hs_recaptcha):not(.hs_error_rollup)")),U=J.querySelector(".hs-richtext h3");if(U)U.remove();let $=J.querySelector(".legal-consent-container"),Q=J.querySelector(".hs-richtext:not(:has(h3))");if(Q)Q.remove();if($)$.remove();J.querySelectorAll(".step-nav, .form-step, .form-navigation, .error-message").forEach((q)=>q.remove());let K=document.createElement("div");K.className="form-header";let L=document.createElement("div");if(L.className="step-nav",[1,2,3,4].forEach((q)=>{let G=document.createElement("span");G.className=q===1?"step-number active":"step-number",G.dataset.step=(q-1).toString(),G.textContent=q.toString(),L.appendChild(G)}),K.appendChild(L),U){let q=document.createElement("div");q.className="hubspot-title-wrapper",q.appendChild(U),K.appendChild(q)}J.insertBefore(K,J.firstChild);let y=O.slice(0,2),v=O.slice(2,5),x=O.slice(5,8),E=O.slice(8),z=[{fields:y,num:1},{fields:v,num:2},{fields:x,num:3},{fields:E,num:4}].map(({fields:q,num:G})=>{if(!q.length)return console.warn(`No fields for step ${G}`),null;let j=document.createElement("div");if(j.className=G===1?"form-step active":"form-step",j.dataset.step=G.toString(),q.forEach((Y)=>{if(Y&&Y.parentNode)j.appendChild(Y)}),G===4&&$){let Y=document.createElement("div");if(Y.className="consent-wrapper",$)Y.appendChild($);let A=document.createElement("div");A.className="privacy-text",A.textContent="Heard is committed to protecting and respecting your privacy, and we'll only use your personal information to administer your account and to provide the services you requested from us. By clicking submit on the form below, you consent to allow Heard to send SMS meeting reminders as well as store and process the personal information submitted above to provide you with the content requested.",Y.appendChild(A),j.appendChild(Y)}let P=J.querySelector(".hs_submit");return J.insertBefore(j,P),j});if(z.some((q)=>!q)){console.error("Failed to create all form steps");return}let k=document.createElement("div");k.className="form-navigation",k.innerHTML=`
    <button type="button" class="previous button-secondary">Previous</button>
    <button type="button" class="next button-primary">Next</button>
    <button type="submit" class="submit button-primary">Submit</button>
  `;let X=document.createElement("div");X.className="error-message",X.style.display="none",X.textContent="Please fill out all required fields.",J.appendChild(k),J.appendChild(X);let Z=0,g=document.querySelectorAll(".step-nav .step-number");function B(q){document.querySelectorAll(".form-step").forEach((G,j)=>{G.classList.toggle("active",j===q)}),g.forEach((G,j)=>{G.classList.toggle("active",j<=q)}),f(q)}function f(q){let G=document.querySelector(".previous"),j=document.querySelector(".next"),P=document.querySelector(".submit");G.style.display=q===0?"none":"block",j.style.display=q===z.length-1?"none":"block",P.style.display=q===z.length-1?"block":"none"}function R(q){let G=z[q],j=!0;return G.querySelectorAll("select").forEach((P)=>{if(P.closest("[required]")&&!P.value)j=!1}),G.querySelectorAll("input").forEach((P)=>{if(P.closest("[required]")&&!P.value)j=!1;if(P.getAttribute("data-gtm-form-interact-field-id"))j=!0}),G.querySelectorAll("ul.multi-container").forEach((P)=>{if(P.querySelector('input[type="radio"]')){if(!P.querySelector('input[type="radio"]:checked'))j=!1}}),G.querySelectorAll("ul.multi-container").forEach((P)=>{let Y=P.querySelectorAll('input[type="checkbox"]');if(Array.from(Y).some((A)=>A.required)){if(!P.querySelector('input[type="checkbox"]:checked'))j=!1}}),j}function H(q){X.style.display=q?"block":"none"}document.querySelector(".next").addEventListener("click",()=>{if(R(Z)){if(H(!1),Z<z.length-1)Z++,B(Z)}else H(!0)}),document.querySelector(".previous").addEventListener("click",()=>{if(Z>0)Z--,B(Z)}),J.addEventListener("submit",function(q){if(!R(Z)){q.preventDefault(),H(!0);return}let G={};J.querySelectorAll("input, select").forEach((j)=>{if(j.name)if(j.type==="radio"){if(j.checked)G[j.name]=j.value}else G[j.name]=j.value});try{localStorage.setItem("hubspot_form_data",JSON.stringify(G)),console.log("MS Form - Stored form data in localStorage")}catch(j){console.error("MS Form - Storage failed:",j)}}),B(Z);let W=document.querySelector(".hbspt-form");if(W)W.style.display="block";let N=localStorage.getItem("my_email"),M=document.querySelector('input[type="email"]');if(M&&N)M.value=N}function S(J){let O=document.createElement("div");O.className="image-container";let U=document.createElement("img");U.className="select-image",U.src="https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg",U.alt="Image",O.appendChild(U),J.appendChild(O)}document.addEventListener("DOMContentLoaded",()=>{D()});function D(){let J=document.querySelector(".hbspt-form"),O=document.querySelector(".right_step_form");if(O&&!O.querySelector(".loader")){O.classList.add("form-loading");let Q=document.createElement("span");if(Q.className="loader",O.appendChild(Q),J)J.style.display="none"}if(!J||!J.querySelector("form")){if(_++,_<w){requestAnimationFrame(D);return}if(console.warn("HubSpot form not found or not fully loaded after maximum retries"),O){O.classList.remove("form-loading");let Q=O.querySelector(".loader");if(Q)Q.remove()}return}_=0,T();let U=O?.querySelector(".loader");if(U)U.remove(),O.classList.remove("form-loading");if(J)J.style.display="block";let $=document.querySelectorAll(".form-step .input select");if($.length)$.forEach((Q)=>{if(Q&&Q.parentElement)S(Q.parentElement),Q.addEventListener("change",(I)=>{let K=Q.parentElement.querySelector(".select-image");if(!K)return;let L=I.target.value;K.src=L==="default"||L===""?"https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg":"https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd131c9a0a6e9c7f805c3_Vector%202533.svg"})})}window.initializeMultiStepFormOnReady=function(){console.log("MS Form - HubSpot form ready callback received"),D()};
})();