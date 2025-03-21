var N={FORM_FIELDS:{multiOwner:"is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_",state:"state",practiceSetup:"how_is_your_business_setup__v2",income:"what_is_your_expected_annual_income_for_2024___1099__private_practice_",practiceRunning:"how_long_have_you_been_running_your_private_practice_",profession:"what_best_describes_your_practice_",employeeCount:"does_your_practice_employ_any_w2_employees_or_1099_contractors_who_see_patients_"},HUBSPOT_CALENDARS:{SOLE_PROP:{url:"https://meetings.hubspot.com/bz/consultations?embed=true",title:"Schedule a Call - Sole Proprietor"},S_CORP:{url:"https://meetings.hubspot.com/bz/consultation?embed=true",title:"Schedule a Call - S Corporation"}},LANDING_PAGES:{FREE_TRIAL:"/thank-you/free-trial",SCHEDULER:"/thank-you/schedule",NOT_QUALIFIED:"/thank-you/success"},DISQUALIFYING_CONDITIONS:{multiOwner:["yes"],state:["international"],practiceSetup:["c corp"],income:["none","less than $20,000"],profession:["dietician","nutritionist","massage therapist","dietician or nutritionist","dietetics or nutrition counseling"],practiceRunning:["opening practice in 1+ month","opening in 1+ months"],employeeCount:["yes (more than 10 employees)"]},INCOME_TIERS:{QUALIFIED_INCOME:["$20,000 - $49,999","$50,000 - $99,999","more than $100,000"]},determineRoute(A){let I=(A[this.FORM_FIELDS.multiOwner]||"").toLowerCase(),H=(A[this.FORM_FIELDS.state]||"").toLowerCase(),J=(A[this.FORM_FIELDS.practiceSetup]||"").toLowerCase(),K=(A[this.FORM_FIELDS.income]||"").toLowerCase(),L=(A[this.FORM_FIELDS.practiceRunning]||"").toLowerCase(),U=(A[this.FORM_FIELDS.profession]||"").toLowerCase(),V=(A[this.FORM_FIELDS.employeeCount]||"").toLowerCase();console.log("Form Router Debug:",{multiOwner:I,state:H,practiceSetup:J,income:K,practiceRunning:L,profession:U,employeeCount:V,formData:A});let X=this.DISQUALIFYING_CONDITIONS.multiOwner.includes(I)||this.DISQUALIFYING_CONDITIONS.state.includes(H)||this.DISQUALIFYING_CONDITIONS.practiceSetup.includes(J)||this.DISQUALIFYING_CONDITIONS.income.includes(K)||this.DISQUALIFYING_CONDITIONS.profession.some((P)=>U.includes(P))||this.DISQUALIFYING_CONDITIONS.practiceRunning.includes(L)||this.DISQUALIFYING_CONDITIONS.employeeCount.includes(V);if(console.log("isDQ",X),X)return console.log("Form Router: Not qualified due to DQ conditions"),"NOT_QUALIFIED";if(this.INCOME_TIERS.QUALIFIED_INCOME.some((P)=>K.includes(P)))return console.log("Form Router: Qualified for scheduler"),"SCHEDULER";return console.log("Form Router: Not qualified (default)"),"NOT_QUALIFIED"}};if(typeof window!=="undefined")window.FormRouterConfig=N;function Z(A){if((A[N.FORM_FIELDS.practiceSetup]||"").toLowerCase().includes("s corp"))return"S_CORP";return"SOLE_PROP"}function _(A){let I=N.HUBSPOT_CALENDARS[A],H=document.createElement("div");H.id="scheduler-modal",H.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;let J=document.createElement("div");J.style.cssText=`
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 95%;
    max-width: 800px;
    height: 90vh;
    position: relative;
  `;let K=document.createElement("button");K.innerHTML="×",K.style.cssText=`
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: none;
    font-size: 24px;
    cursor: pointer;
    padding: 5px 10px;
  `,K.onclick=()=>H.remove();let L=document.createElement("iframe");return L.src=I.url,L.style.cssText=`
    width: 100%;
    height: calc(100% - 40px);
    border: none;
    margin-top: 20px;
  `,J.appendChild(K),J.appendChild(L),H.appendChild(J),H}function j(){try{let A=JSON.parse(localStorage.getItem("hubspot_form_data")||"{}"),I=Z(A),H=_(I);document.body.appendChild(H),window.addEventListener("message",(J)=>{if(J.data.type==="CALENDAR_EVENT_SCHEDULED")localStorage.removeItem("hubspot_form_data"),H.remove()})}catch(A){console.error("Error initializing scheduler:",A),window.location.href="https://joinheard.com"}}function Y(){if(window.location.pathname==="/thank-you/schedule")try{let A=localStorage.getItem("hubspot_form_data");if(!A)throw console.log("No form data found in localStorage, redirecting to homepage"),window.location.href="https://joinheard.com",new Error("No form data found");try{JSON.parse(A),j()}catch(I){throw console.error("Invalid form data in localStorage:",I),window.location.href="https://joinheard.com",new Error("Invalid form data")}console.log("Valid form data found, initializing scheduler")}catch(A){console.error("Error checking form data:",A)}}if(document.readyState==="complete")Y();else window.addEventListener("load",Y);export{Y as initializeSchedulerWithGuard,j as initScheduler,Z as determineCalendarType};
