import './settings.js' ;
import { getProjet , setProjet } from './storage.js';
export function renderlist(){
    let container=document.getElementById("projectsList");
    let empty=document.getElementById("msgEmpty");
    let projets=getProjet();

    container.innerHTML="";
    empty.classList.toggle("hidden",projets.length>0);
    for (let p of projets){
        // je vais afficher tout les p
    }
 
}