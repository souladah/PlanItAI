import { validate } from "./validation.js";
import { buildPrompt } from "./prompt.js";
import { initSttingsDIalog , renderlist } from "./ui.js";
import { addProjet , getApi , saveApi } from "./storage.js";
import {callAi} from "./api.js";
import { load } from "./demo.js";

initSttingsDIalog({getkey:getApi , saveKey:saveApi ,load:load});
renderlist();
// form validation and add a projet , build projet
let form=document.querySelector("form");
let btn=document.querySelector('#btnSubmit')

form.addEventListener("input",(e)=>{
     let Estvalide=validate(e.target.id);
    btn.disabled=!Estvalide
});
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(validate()===false){
        return ;
    }
    let champs=form.querySelectorAll("input,textarea,select");
    let projet={};
    for(let champ of champs){
        projet[champ.id]=champ.value.trim();
    }
    addProjet(projet);
    let prompt=buildPrompt(projet);
    btn.disabled=true;
    btn.textContent="Generation en cours ..."
    let data =callAi(prompt);
    if(callAi(prompt)){
            btn.textContent="envoyer";
        }
    console.log(data) ;
})

// 
