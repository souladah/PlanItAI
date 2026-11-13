import { addProjet } from "./storage.js";

const url="data/data.json"
export   function load(){
    return fetch(url)
      .then(response=>{
        if(!response.ok)throw new Error("Erreur HTTP :"+ response.status);
        return response.json();
      })
      .then(plan=>{
         addProjet({
            id:"demo",
            ...plan.project,
            totalEstimatedHours:plan.totalEstimatedHours,
            tasks:plan.tasks
         });
      })
      .catch(error=>{
        throw new Error("impossible de charger le plan"+ error.message);
      });
    
}