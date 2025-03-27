(function(){var B={FORM_FIELDS:{multiOwner:"is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_",state:"state",practiceSetup:"how_is_your_business_setup__v2",income:"what_is_your_expected_annual_income_for_2024___1099__private_practice_",practiceRunning:"how_long_have_you_been_running_your_private_practice_",profession:"what_best_describes_your_practice_",employeeCount:"does_your_practice_employ_any_w2_employees_or_1099_contractors_who_see_patients_"},HUBSPOT_CALENDARS:{SOLE_PROP:{url:"https://meetings.hubspot.com/bz/consultations?embed=true",title:"Schedule a Call"},S_CORP:{url:"https://meetings.hubspot.com/bz/consultation?embed=true",title:"Schedule a Call"}},LANDING_PAGES:{FREE_TRIAL:"/thank-you/free-trial",SCHEDULER:"/thank-you/schedule",NOT_QUALIFIED:"/thank-you/success"},DISQUALIFYING_CONDITIONS:{multiOwner:["yes"],state:["international"],practiceSetup:["c corp"],income:["none","less than $20,000"],profession:["dietician","nutritionist","massage therapist","dietician or nutritionist","dietetics or nutrition counseling"],practiceRunning:["opening practice in 1+ month","opening in 1+ months"],employeeCount:["yes (more than 10 employees)"]},INCOME_TIERS:{QUALIFIED_INCOME:["$20,000 - $49,999","$50,000 - $99,999","more than $100,000"]},determineRoute(q){let J=(q[this.FORM_FIELDS.multiOwner]||"").toLowerCase(),G=(q[this.FORM_FIELDS.state]||"").toLowerCase(),K=(q[this.FORM_FIELDS.practiceSetup]||"").toLowerCase(),H=(q[this.FORM_FIELDS.income]||"").toLowerCase(),P=(q[this.FORM_FIELDS.practiceRunning]||"").toLowerCase(),V=(q[this.FORM_FIELDS.profession]||"").toLowerCase(),W=(q[this.FORM_FIELDS.employeeCount]||"").toLowerCase();console.log("Form Router Debug:",{multiOwner:J,state:G,practiceSetup:K,income:H,practiceRunning:P,profession:V,employeeCount:W,formData:q});let X=this.DISQUALIFYING_CONDITIONS.multiOwner.includes(J)||this.DISQUALIFYING_CONDITIONS.state.includes(G)||this.DISQUALIFYING_CONDITIONS.practiceSetup.includes(K)||this.DISQUALIFYING_CONDITIONS.income.includes(H)||this.DISQUALIFYING_CONDITIONS.profession.some((M)=>V.includes(M))||this.DISQUALIFYING_CONDITIONS.practiceRunning.includes(P)||this.DISQUALIFYING_CONDITIONS.employeeCount.includes(W);if(console.log("isDQ",X),X)return console.log("Form Router: Not qualified due to DQ conditions"),"NOT_QUALIFIED";console.log("Form Router: Checking income qualification. Current income value:",H),console.log("Form Router: Looking for income in qualified tiers:",this.INCOME_TIERS.QUALIFIED_INCOME);let Y=this.INCOME_TIERS.QUALIFIED_INCOME.map((M)=>{let Z=H.includes(M.toLowerCase());return console.log(`Form Router: Does income "${H}" include "${M.toLowerCase()}"? ${Z}`),Z}).some((M)=>M===!0);if(console.log("Form Router: Is income qualified?",Y),Y)return console.log("Form Router: Qualified for scheduler"),"SCHEDULER";return console.log("Form Router: Not qualified (default)"),"NOT_QUALIFIED"}};if(typeof window!=="undefined")window.FormRouterConfig=B;function A(){console.log("Form Router - Initializing form handler"),window.hbspt.forms.create({region:"na1",portalId:"7507639",formId:"0d9c387a-9c8b-40c4-8d46-3135f754f077",target:"#hubspot-form-container",onFormReady:function(q){console.log("Form Router - Form Ready"),console.log("Form Router - Config loaded:",!!B),console.log("Form Router - Adding field tracking"),q.find("input, select, textarea").each(function(){$(this).on("change",function(){console.log("Form Router - Field Changed:",{name:this.name,value:this.value,type:this.type||"textarea"})})})},onFormSubmit:function(q){if(!B)return console.error("Form Router - FormRouterConfig not found - ensure form-config.js is loaded"),!1;console.log("Form Router - Starting submission process");let J=new FormData(q),G={};console.log("Form Router - Raw form fields:");for(let[K,H]of J.entries())console.log(`Field: "${K}" = "${H}"`);J.forEach((K,H)=>{if(H===B.FORM_FIELDS.employeeCount||H===B.FORM_FIELDS.practiceRunning)G[H]=K.toLowerCase().trim();else G[H]=K});try{localStorage.setItem("hubspot_form_data",JSON.stringify(G)),console.log("Form Router - Stored form data:",G)}catch(K){console.error("Form Router - Storage failed:",K),Sentry.captureException(K,{extra:{context:"Form submission storage failed",formData:G},tags:{type:"local_storage",form:"hubspot_contact"}})}return!0},onFormSubmitted:function(q){if(!B)return console.error("Form Router - FormRouterConfig not found during submission - ensure form-config.js is loaded"),!1;return console.log("Form Router - Processing submission"),N(),!1},onFormSubmitError:function(q,J){Sentry.captureException(J,{extra:{context:"HubSpot form submission error",formData:Object.fromEntries(new FormData(q))},tags:{type:"hubspot_submission_error",form:"hubspot_contact"}})}})}function L(q){return B.determineRoute(q)}if(window.hbspt)A();else window.addEventListener("load",function(){if(window.hbspt)A()});function N(){try{let q=JSON.parse(localStorage.getItem("hubspot_form_data")||"{}");console.log("Form Router - Retrieved form data:",q),console.log("Form Router - Expected field names:",{multiOwner:B.FORM_FIELDS.multiOwner,state:B.FORM_FIELDS.state,practiceSetup:B.FORM_FIELDS.practiceSetup,income:B.FORM_FIELDS.income,practiceRunning:B.FORM_FIELDS.practiceRunning,profession:B.FORM_FIELDS.profession,employeeCount:B.FORM_FIELDS.employeeCount}),console.log("Form Router - Field existence check:",{multiOwner:q.hasOwnProperty(B.FORM_FIELDS.multiOwner),state:q.hasOwnProperty(B.FORM_FIELDS.state),practiceSetup:q.hasOwnProperty(B.FORM_FIELDS.practiceSetup),income:q.hasOwnProperty(B.FORM_FIELDS.income),practiceRunning:q.hasOwnProperty(B.FORM_FIELDS.practiceRunning),profession:q.hasOwnProperty(B.FORM_FIELDS.profession),employeeCount:q.hasOwnProperty(B.FORM_FIELDS.employeeCount)});let J=L(q);console.log("Form Router - Determined route:",J);let G=B.LANDING_PAGES[J]||B.LANDING_PAGES.NOT_QUALIFIED;if(console.log("Form Router - Final URL:",G),!B){console.error("Form Router - FormRouterConfig not found - form-config.js may not be loaded");return}setTimeout(()=>{console.log("Form Router - Executing redirect to:",G),window.location.href=G},700)}catch(q){console.error("Form Router - Redirect failed:",q),Sentry.captureException(q,{extra:{context:"Post-submission redirect failed"},tags:{type:"redirect",form:"hubspot_contact"}}),window.location.href=B.LANDING_PAGES.NOT_QUALIFIED}}
})();