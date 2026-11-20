import { validate } from "./validation.js";
import { buildPrompt } from "./prompt.js";
import { initSttingsDIalog ,initDemo , initDialogs , renderlist , showData } from "./ui.js";
import { addProjet , getProjetDemo , getProjetai , getApi , saveApi } from "./storage.js";
import {callAi} from "./api.js";
import { load } from "./demo.js";

initSttingsDIalog({getkey:getApi , saveKey:saveApi });
renderlist();
initDemo(load,"index.html");
// form validation and add a projet , build projet
let form=document.querySelector("#form");
let btn=document.querySelector('#btnSubmit')
if(form){

    form.addEventListener("input",(e)=>{
        let Estvalide=validate(e.target.id);
        btn.disabled=!Estvalide
    });
    form.addEventListener("submit",async (e)=>{
        e.preventDefault();
        if(validate()===false){
            return ;
        }
        let champs=form.querySelectorAll("input,textarea,select");
        let projet={};
        for(let champ of champs){
            if(champ.id==="demoCheckbox") continue ;
            projet[champ.id]=champ.value.trim();
        }
        let prompt=buildPrompt(projet);
        btn.disabled=true;
        btn.textContent="Generation en cours ..."
        try {
             let data = await callAi(prompt);
             
             const plan=JSON.parse(data);
             projet.id= "task"+Date.now();
             projet.name=plan.projectName;
             projet.totalEstimatedHours=plan.totalEstimatedHours
             projet.tasks=plan.tasks;
             delete projet.demoCheckbox ;
             localStorage.setItem("demoChecked","false");
             addProjet(projet,getProjetai);
             window.location.href="index.html" ;
            }catch(error){
                alert(error.message);
                btn.disabled=false;
                btn.textContent="envoyer"

            }
        
    })
    btn.disabled=true;
}
// 
const details=document.getElementById("details");
if(details){
    const id=new URLSearchParams (location.search).get("id");// prendre id depuis url
    const list=localStorage.getItem("demoChecked")==="true"?getProjetDemo():getProjetai();
    const projet=list.find(p=>p.id===id);
    if(projet) {
        initDialogs();
        showData(projet);
    }
    else details.textContent="page introuvable";
}

