var K={FORM_FIELDS:{multiOwner:"is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_",state:"state",practiceSetup:"how_is_your_business_setup__v2",income:"what_is_your_expected_annual_income_for_2024___1099__private_practice_",practiceRunning:"how_long_have_you_been_running_your_private_practice_",profession:"what_best_describes_your_practice_",employeeCount:"does_your_practice_employ_any_w2_employees_or_1099_contractors_who_see_patients_"},HUBSPOT_CALENDARS:{SOLE_PROP:{url:"YOUR_SOLE_PROP_SCHEDULING_URL",title:"Schedule a Call - Sole Proprietor"},S_CORP:{url:"YOUR_S_CORP_SCHEDULING_URL",title:"Schedule a Call - S Corporation"}},LANDING_PAGES:{FREE_TRIAL:"/thank-you/free-trial",SCHEDULER:"/thank-you/schedule",NOT_QUALIFIED:"/thank-you/success"},DISQUALIFYING_CONDITIONS:{multiOwner:["yes"],state:["international"],practiceSetup:["c corp"],income:["none","less than $20,000"],profession:["dietician","nutritionist","massage therapist","dietician or nutritionist","dietetics or nutrition counseling"],practiceRunning:["opening practice in 1+ month","opening in 1+ months"],employeeCount:["yes (more than 10 employees)"]},INCOME_TIERS:{QUALIFIED_INCOME:["$20,000 - $49,999","$50,000 - $99,999","more than $100,000"]},determineRoute(z){let I=(z[this.FORM_FIELDS.multiOwner]||"").toLowerCase(),A=(z[this.FORM_FIELDS.state]||"").toLowerCase(),G=(z[this.FORM_FIELDS.practiceSetup]||"").toLowerCase(),H=(z[this.FORM_FIELDS.income]||"").toLowerCase(),J=(z[this.FORM_FIELDS.practiceRunning]||"").toLowerCase(),N=(z[this.FORM_FIELDS.profession]||"").toLowerCase(),P=(z[this.FORM_FIELDS.employeeCount]||"").toLowerCase();console.log("Form Router Debug:",{multiOwner:I,state:A,practiceSetup:G,income:H,practiceRunning:J,profession:N,employeeCount:P,formData:z});let U=this.DISQUALIFYING_CONDITIONS.multiOwner.includes(I)||this.DISQUALIFYING_CONDITIONS.state.includes(A)||this.DISQUALIFYING_CONDITIONS.practiceSetup.includes(G)||this.DISQUALIFYING_CONDITIONS.income.includes(H)||this.DISQUALIFYING_CONDITIONS.profession.some((L)=>N.includes(L))||this.DISQUALIFYING_CONDITIONS.practiceRunning.includes(J)||this.DISQUALIFYING_CONDITIONS.employeeCount.includes(P);if(console.log("isDQ",U),U)return console.log("Form Router: Not qualified due to DQ conditions"),"NOT_QUALIFIED";if(this.INCOME_TIERS.QUALIFIED_INCOME.some((L)=>H.includes(L)))return console.log("Form Router: Qualified for scheduler"),"SCHEDULER";return console.log("Form Router: Not qualified (default)"),"NOT_QUALIFIED"}};if(typeof window!=="undefined")window.FormRouterConfig=K;function W(z){if((z[K.FORM_FIELDS.practiceSetup]||"").toLowerCase().includes("s corp"))return"S_CORP";return"SOLE_PROP"}function X(z){let I=K.HUBSPOT_CALENDARS[z],A=document.createElement("div");A.id="scheduler-modal",A.style.cssText=`
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
  `;let G=document.createElement("div");G.style.cssText=`
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 95%;
    max-width: 800px;
    height: 90vh;
    position: relative;
  `;let H=document.createElement("button");H.innerHTML="×",H.style.cssText=`
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: none;
    font-size: 24px;
    cursor: pointer;
    padding: 5px 10px;
  `,H.onclick=()=>A.remove();let J=document.createElement("iframe");return J.src=I.url,J.style.cssText=`
    width: 100%;
    height: calc(100% - 40px);
    border: none;
    margin-top: 20px;
  `,G.appendChild(H),G.appendChild(J),A.appendChild(G),A}function V(){try{let z=JSON.parse(localStorage.getItem("hubspot_form_data")||"{}"),I=W(z),A=X(I);document.body.appendChild(A),window.addEventListener("message",(G)=>{if(G.data.type==="CALENDAR_EVENT_SCHEDULED")localStorage.removeItem("hubspot_form_data"),A.remove()})}catch(z){console.error("Error initializing scheduler:",z),window.location.href="https://joinheard.com"}}if(document.readyState==="complete")V();else window.addEventListener("load",V);export{V as initScheduler,W as determineCalendarType};
