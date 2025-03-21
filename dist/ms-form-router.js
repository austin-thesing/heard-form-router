var L={FORM_FIELDS:{multiOwner:"is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_",state:"state",practiceSetup:"how_is_your_business_setup__v2",income:"what_is_your_expected_annual_income_for_2024___1099__private_practice_",practiceRunning:"how_long_have_you_been_running_your_private_practice_",profession:"what_best_describes_your_practice_",employeeCount:"does_your_practice_employ_any_w2_employees_or_1099_contractors_who_see_patients_"},HUBSPOT_CALENDARS:{SOLE_PROP:{url:"https://meetings.hubspot.com/bz/consultations?embed=true",title:"Schedule a Call"},S_CORP:{url:"https://meetings.hubspot.com/bz/consultation?embed=true",title:"Schedule a Call"}},LANDING_PAGES:{FREE_TRIAL:"/thank-you/free-trial",SCHEDULER:"/thank-you/schedule",NOT_QUALIFIED:"/thank-you/success"},DISQUALIFYING_CONDITIONS:{multiOwner:["yes"],state:["international"],practiceSetup:["c corp"],income:["none","less than $20,000"],profession:["dietician","nutritionist","massage therapist","dietician or nutritionist","dietetics or nutrition counseling"],practiceRunning:["opening practice in 1+ month","opening in 1+ months"],employeeCount:["yes (more than 10 employees)"]},INCOME_TIERS:{QUALIFIED_INCOME:["$20,000 - $49,999","$50,000 - $99,999","more than $100,000"]},determineRoute(A){let B=(A[this.FORM_FIELDS.multiOwner]||"").toLowerCase(),J=(A[this.FORM_FIELDS.state]||"").toLowerCase(),N=(A[this.FORM_FIELDS.practiceSetup]||"").toLowerCase(),K=(A[this.FORM_FIELDS.income]||"").toLowerCase(),G=(A[this.FORM_FIELDS.practiceRunning]||"").toLowerCase(),V=(A[this.FORM_FIELDS.profession]||"").toLowerCase(),W=(A[this.FORM_FIELDS.employeeCount]||"").toLowerCase();console.log("Form Router Debug:",{multiOwner:B,state:J,practiceSetup:N,income:K,practiceRunning:G,profession:V,employeeCount:W,formData:A});let X=this.DISQUALIFYING_CONDITIONS.multiOwner.includes(B)||this.DISQUALIFYING_CONDITIONS.state.includes(J)||this.DISQUALIFYING_CONDITIONS.practiceSetup.includes(N)||this.DISQUALIFYING_CONDITIONS.income.includes(K)||this.DISQUALIFYING_CONDITIONS.profession.some((P)=>V.includes(P))||this.DISQUALIFYING_CONDITIONS.practiceRunning.includes(G)||this.DISQUALIFYING_CONDITIONS.employeeCount.includes(W);if(console.log("isDQ",X),X)return console.log("Form Router: Not qualified due to DQ conditions"),"NOT_QUALIFIED";if(this.INCOME_TIERS.QUALIFIED_INCOME.some((P)=>K.includes(P)))return console.log("Form Router: Qualified for scheduler"),"SCHEDULER";return console.log("Form Router: Not qualified (default)"),"NOT_QUALIFIED"}};if(typeof window!=="undefined")window.FormRouterConfig=L;var Y=!1;function Z(){if(Y)return;let A=document.querySelector(".right_step_form form");if(!A){setTimeout(Z,500);return}console.log("MS Form - Adding field tracking"),A.querySelectorAll("input, select").forEach((B)=>{B.addEventListener("change",function(J){console.log("MS Form - Field Changed:",{name:J.target.name,value:J.target.value})})}),Y=!0}window.addEventListener("message",function(A){if(A.data.type==="hsFormCallback"){if(A.data.eventName==="onFormReady")console.log("MS Form - Form Ready"),setTimeout(Z,1000);if(A.data.eventName==="onFormSubmit"){console.log("MS Form - Form Submitted");let B;try{B=JSON.parse(localStorage.getItem("hubspot_form_data")||"{}"),console.log("MS Form - Retrieved stored form data:",B)}catch(G){console.error("MS Form - Failed to retrieve stored form data:",G),B={}}let J=A.data.data;if(J&&Array.isArray(J))J.forEach((G)=>{B[G.name]=G.value});let N=new Date().toISOString();if(console.log("MS Form - Final form data:",B),Object.keys(B).length===0)console.error("MS Form - No form data available"),Sentry.captureMessage("MS Form: No form data available",{level:"error",tags:{type:"hubspot_submission",form:"ms_hubspot_contact"},extra:{eventData:A.data,submissionTime:N,formElement:document.querySelector(".right_step_form form")?.outerHTML}});let K=L.determineRoute(B);console.log("MS Form - Determined route:",K),setTimeout(()=>{try{let G=L.LANDING_PAGES[K];console.log("MS Form - Redirecting to:",G),window.location.href=G}catch(G){console.error("MS Form - Redirect failed:",G),Sentry.captureException(G,{extra:{context:"MS Form redirect failed",route:K,formData:B},tags:{type:"redirect",form:"ms_hubspot_contact"}}),window.location.href=L.LANDING_PAGES.NOT_QUALIFIED}},700)}}});
