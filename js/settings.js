import { getApi , saveApi } from "./storage.js";
import { load  } from "./demo.js";
import { renderlist } from "./ui.js";

let openBtn=document.querySelector("#openSettings");
let dialog=document.querySelector("dialog")
let closBTn=document.querySelector("#fermer");
let input=document.getElementById("token");
let cancelBtn=document.getElementById("anulerBTn");
let demoCheckbox=document.getElementById("demoCheckbox");

openBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    input.value=getApi();
    dialog.showModal();
})
closBTn.addEventListener("click",()=>{
    dialog.close();
})
cancelBtn.addEventListener("click",()=>{
    dialog.close();
})
let enregistrerBtn=document.querySelector("#enregistrerBtn");

enregistrerBtn.addEventListener("click",()=>{
    let valeur=input.value.trim();
    if(valeur) saveApi(valeur);
    dialog.close();
})
demoCheckbox.addEventListener("change", async ()=>{
    if(!demoCheckbox.checked) return ;
    try{
        await load();
        renderlist();
        dialog.close();
    }catch(error){
        alert(error.message)
    }
    demoCheckbox.checked=false ;

});
renderlist();


