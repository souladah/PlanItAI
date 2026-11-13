import { addProjet, getProjet } from "./storage.js";

const url="data/data.json"
export  async function load(){
    getProjet()
    let response;
    try{
         response=await fetch(url)
    }catch(e){
        throw new Error("Imposssible de charger le plan demo");
    }
    if(!response.ok) throw new Error("Erreur HTTP :"+response.status)
    let plan ;
    try{
        plan=await response.json();
    }catch(e){
        throw new Error("le fichier nest pas valide")
    }
    addProjet(plan);
}