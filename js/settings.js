import { getApi , saveApi } from "./storage.js";

let openBtn=document.querySelector("#openSettings");
let dialog=document.querySelector("dialog")
let closBTn=document.querySelector("#fermer");
let input=document.getElementById("token");
let cancelBtn=document.getElementById("anulerBTn");

openBtn.addEventListener("click",()=>{
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

