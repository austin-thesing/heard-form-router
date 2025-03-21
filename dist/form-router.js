(function(){var G={FORM_FIELDS:{multiOwner:"is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_",state:"state",practiceSetup:"how_is_your_business_setup__v2",income:"what_is_your_expected_annual_income_for_2024___1099__private_practice_",practiceRunning:"how_long_have_you_been_running_your_private_practice_",profession:"what_best_describes_your_practice_",employeeCount:"does_your_practice_employ_any_w2_employees_or_1099_contractors_who_see_patients_"},HUBSPOT_CALENDARS:{SOLE_PROP:{url:"https://meetings.hubspot.com/bz/consultations?embed=true",title:"Schedule a Call"},S_CORP:{url:"https://meetings.hubspot.com/bz/consultation?embed=true",title:"Schedule a Call"}},LANDING_PAGES:{FREE_TRIAL:"/thank-you/free-trial",SCHEDULER:"/thank-you/schedule",NOT_QUALIFIED:"/thank-you/success"},DISQUALIFYING_CONDITIONS:{multiOwner:["yes"],state:["international"],practiceSetup:["c corp"],income:["none","less than $20,000"],profession:["dietician","nutritionist","massage therapist","dietician or nutritionist","dietetics or nutrition counseling"],practiceRunning:["opening practice in 1+ month","opening in 1+ months"],employeeCount:["yes (more than 10 employees)"]},INCOME_TIERS:{QUALIFIED_INCOME:["$20,000 - $49,999","$50,000 - $99,999","more than $100,000"]},determineRoute(B){let J=(B[this.FORM_FIELDS.multiOwner]||"").toLowerCase(),H=(B[this.FORM_FIELDS.state]||"").toLowerCase(),K=(B[this.FORM_FIELDS.practiceSetup]||"").toLowerCase(),M=(B[this.FORM_FIELDS.income]||"").toLowerCase(),P=(B[this.FORM_FIELDS.practiceRunning]||"").toLowerCase(),V=(B[this.FORM_FIELDS.profession]||"").toLowerCase(),X=(B[this.FORM_FIELDS.employeeCount]||"").toLowerCase();console.log("Form Router Debug:",{multiOwner:J,state:H,practiceSetup:K,income:M,practiceRunning:P,profession:V,employeeCount:X,formData:B});let Y=this.DISQUALIFYING_CONDITIONS.multiOwner.includes(J)||this.DISQUALIFYING_CONDITIONS.state.includes(H)||this.DISQUALIFYING_CONDITIONS.practiceSetup.includes(K)||this.DISQUALIFYING_CONDITIONS.income.includes(M)||this.DISQUALIFYING_CONDITIONS.profession.some((W)=>V.includes(W))||this.DISQUALIFYING_CONDITIONS.practiceRunning.includes(P)||this.DISQUALIFYING_CONDITIONS.employeeCount.includes(X);if(console.log("isDQ",Y),Y)return console.log("Form Router: Not qualified due to DQ conditions"),"NOT_QUALIFIED";if(this.INCOME_TIERS.QUALIFIED_INCOME.some((W)=>M.includes(W)))return console.log("Form Router: Qualified for scheduler"),"SCHEDULER";return console.log("Form Router: Not qualified (default)"),"NOT_QUALIFIED"}};if(typeof window!=="undefined")window.FormRouterConfig=G;function Z(){console.log("Form Router - Initializing form handler"),window.hbspt.forms.create({region:"na1",portalId:"7507639",formId:"0d9c387a-9c8b-40c4-8d46-3135f754f077",target:"#hubspot-form-container",onFormReady:function(B){console.log("Form Router - Form Ready"),console.log("Form Router - Config loaded:",!!G),console.log("Form Router - Adding field tracking"),B.find("input, select, textarea").each(function(){$(this).on("change",function(){console.log("Form Router - Field Changed:",{name:this.name,value:this.value,type:this.type||"textarea"})})})},onFormSubmit:function(B){if(!G)return console.error("Form Router - FormRouterConfig not found - ensure form-config.js is loaded"),!1;console.log("Form Router - Starting submission process");let J=new FormData(B),H={};J.forEach((K,M)=>{H[M]=K});try{localStorage.setItem("hubspot_form_data",JSON.stringify(H)),console.log("Form Router - Stored form data:",H)}catch(K){console.error("Form Router - Storage failed:",K),Sentry.captureException(K,{extra:{context:"Form submission storage failed",formData:H},tags:{type:"local_storage",form:"hubspot_contact"}})}return!0},onFormSubmitted:function(B){if(!G)return console.error("Form Router - FormRouterConfig not found during submission - ensure form-config.js is loaded"),!1;return console.log("Form Router - Processing submission"),A(),!1},onFormSubmitError:function(B,J){Sentry.captureException(J,{extra:{context:"HubSpot form submission error",formData:Object.fromEntries(new FormData(B))},tags:{type:"hubspot_submission_error",form:"hubspot_contact"}})}})}function q(B){let J=(B[G.FORM_FIELDS.multiOwner]||"").toLowerCase(),H=(B[G.FORM_FIELDS.state]||"").toLowerCase(),K=(B[G.FORM_FIELDS.practiceSetup]||"").toLowerCase(),M=(B[G.FORM_FIELDS.income]||"").toLowerCase(),P=(B[G.FORM_FIELDS.practiceRunning]||"").toLowerCase(),V=(B[G.FORM_FIELDS.profession]||"").toLowerCase();return G.determineRoute(B)}if(window.hbspt)Z();else window.addEventListener("load",function(){if(window.hbspt)Z()});function A(){try{let B=JSON.parse(localStorage.getItem("hubspot_form_data")||"{}");console.log("Form Router - Retrieved form data:",B);let J=q(B);console.log("Form Router - Determined route:",J);let H=G.LANDING_PAGES[J]||G.LANDING_PAGES.NOT_QUALIFIED;if(console.log("Form Router - Final URL:",H),!G){console.error("Form Router - FormRouterConfig not found - form-config.js may not be loaded");return}setTimeout(()=>{console.log("Form Router - Executing redirect to:",H),window.location.href=H},700)}catch(B){console.error("Form Router - Redirect failed:",B),Sentry.captureException(B,{extra:{context:"Post-submission redirect failed"},tags:{type:"redirect",form:"hubspot_contact"}}),window.location.href=G.LANDING_PAGES.NOT_QUALIFIED}}
})();