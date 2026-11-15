import { addProjet, getProjet } from "./storage.js";

const url="data/data.json"
export   function load(){
    return fetch(url)
      .then(response=>{
        if(!response.ok)throw new Error("Erreur HTTP :"+ response.status);
        return response.json();
      })
      .then(data=>{
        for(let plan of data.projects){
            if(getProjet().some(p=>p.id===plan.id)) continue ;
            addProjet({
                id:plan.id,
                ...plan.project,
                totalEstimatedHours:plan.totalEstimatedHours,
                tasks:plan.tasks
            });
     
    } }).catch(error=>{
        throw new Error("impossible de charger le plan "+ error.message);
      });
    
}