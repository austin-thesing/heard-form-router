var V={FORM_FIELDS:{multiOwner:"is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_",state:"state",practiceSetup:"how_is_your_business_setup__v2",income:"what_is_your_expected_annual_income_for_2024___1099__private_practice_",practiceRunning:"how_long_have_you_been_running_your_private_practice_",profession:"what_best_describes_your_practice_",employeeCount:"does_your_practice_employ_any_w2_employees_or_1099_contractors_who_see_patients_"},HUBSPOT_CALENDARS:{SOLE_PROP:{url:"https://meetings.hubspot.com/bz/consultations?embed=true",title:"Schedule a Call - Sole Proprietor"},S_CORP:{url:"https://meetings.hubspot.com/bz/consultation?embed=true",title:"Schedule a Call - S Corporation"}},LANDING_PAGES:{FREE_TRIAL:"/thank-you/free-trial",SCHEDULER:"/thank-you/schedule",NOT_QUALIFIED:"/thank-you/success"},DISQUALIFYING_CONDITIONS:{multiOwner:["yes"],state:["international"],practiceSetup:["c corp"],income:["none","less than $20,000"],profession:["dietician","nutritionist","massage therapist","dietician or nutritionist","dietetics or nutrition counseling"],practiceRunning:["opening practice in 1+ month","opening in 1+ months"],employeeCount:["yes (more than 10 employees)"]},INCOME_TIERS:{QUALIFIED_INCOME:["$20,000 - $49,999","$50,000 - $99,999","more than $100,000"]},determineRoute(A){let H=(A[this.FORM_FIELDS.multiOwner]||"").toLowerCase(),I=(A[this.FORM_FIELDS.state]||"").toLowerCase(),J=(A[this.FORM_FIELDS.practiceSetup]||"").toLowerCase(),K=(A[this.FORM_FIELDS.income]||"").toLowerCase(),U=(A[this.FORM_FIELDS.practiceRunning]||"").toLowerCase(),X=(A[this.FORM_FIELDS.profession]||"").toLowerCase(),Y=(A[this.FORM_FIELDS.employeeCount]||"").toLowerCase();console.log("Form Router Debug:",{multiOwner:H,state:I,practiceSetup:J,income:K,practiceRunning:U,profession:X,employeeCount:Y,formData:A});let _=this.DISQUALIFYING_CONDITIONS.multiOwner.includes(H)||this.DISQUALIFYING_CONDITIONS.state.includes(I)||this.DISQUALIFYING_CONDITIONS.practiceSetup.includes(J)||this.DISQUALIFYING_CONDITIONS.income.includes(K)||this.DISQUALIFYING_CONDITIONS.profession.some((Z)=>X.includes(Z))||this.DISQUALIFYING_CONDITIONS.practiceRunning.includes(U)||this.DISQUALIFYING_CONDITIONS.employeeCount.includes(Y);if(console.log("isDQ",_),_)return console.log("Form Router: Not qualified due to DQ conditions"),"NOT_QUALIFIED";if(this.INCOME_TIERS.QUALIFIED_INCOME.some((Z)=>K.includes(Z)))return console.log("Form Router: Qualified for scheduler"),"SCHEDULER";return console.log("Form Router: Not qualified (default)"),"NOT_QUALIFIED"}};if(typeof window!=="undefined")window.FormRouterConfig=V;function q(A){if(!A||typeof A!=="object")return console.error("Form data is missing or invalid"),window.location.href="https://joinheard.com",null;let H=(A[V.FORM_FIELDS.practiceSetup]||"").toLowerCase(),I=(A[V.FORM_FIELDS.employeeCount]||"").toLowerCase();if(!H||!I)return console.error("Required form fields are missing",{practiceSetup:H,employeeCount:I}),window.location.href="https://joinheard.com/welcome-form",null;let J=H.includes("s corp"),K=H.includes("llc")||H.includes("pllc")||H.includes("sole prop"),U=I.includes("less than 5")||I.includes("5-10");if(J||K&&U)return"S_CORP";let X=H.includes("sole prop"),Y=I.includes("no");if(X&&Y)return"SOLE_PROP";return"SOLE_PROP"}function M(A){let H=V.HUBSPOT_CALENDARS[A],I=document.createElement("div");I.id="scheduler-modal",I.style.cssText=`
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
  `,K.onclick=()=>I.remove();let U=document.createElement("iframe");return U.src=H.url,U.style.cssText=`
    width: 100%;
    height: calc(100% - 40px);
    border: none;
    margin-top: 20px;
  `,J.appendChild(K),J.appendChild(U),I.appendChild(J),I}function N(){try{let A=JSON.parse(localStorage.getItem("hubspot_form_data")||"{}"),H=q(A);if(H===null)return;let I=M(H);document.body.appendChild(I),window.addEventListener("message",(J)=>{if(J.data.type==="CALENDAR_EVENT_SCHEDULED")localStorage.removeItem("hubspot_form_data"),I.remove()})}catch(A){console.error("Error initializing scheduler:",A),window.location.href="https://joinheard.com"}}function j(){if(window.location.pathname==="/thank-you/schedule")try{let A=localStorage.getItem("hubspot_form_data");if(!A)throw console.log("No form data found in localStorage, redirecting to homepage"),window.location.href="https://joinheard.com",new Error("No form data found");try{JSON.parse(A),N()}catch(H){throw console.error("Invalid form data in localStorage:",H),window.location.href="https://joinheard.com",new Error("Invalid form data")}console.log("Valid form data found, initializing scheduler")}catch(A){console.error("Error checking form data:",A)}}if(document.readyState==="complete")j();else window.addEventListener("load",j);export{j as initializeSchedulerWithGuard,N as initScheduler,q as determineCalendarType};
