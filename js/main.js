import { validate } from "./validation.js";
import { buildPrompt } from "./prompt.js";
import './settings.js' ;
import { addProjet } from "./storage.js";


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
    console.log(projet)
    
    console.log(buildPrompt(projet))
})
btn.disabled=true;

//