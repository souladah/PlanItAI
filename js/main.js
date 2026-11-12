import { validate } from "./validation.js";
import { buildPrompt } from "./prompt.js";
import './settings.js' ;
import { addProjet } from "./storage.js";
import {callAi} from "./api.js";

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
