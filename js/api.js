import { API_URL } from "./config.js";
import { getApi } from "./storage.js";

export async function callAi(prompt){// async permet de utiliser await dans cette function
   let cle=getApi();
   if(!cle) throw new Error("Cle API manquante : ouvrer Parametres et saisissez votre cle .");//throw permet de lancer une errur et darreter lexecution  et error objet sera transferer a la function call ai
   let reponse;
   try{ // essayer defectuer la requete http
    reponse= await fetch(API_URL ,{ //fetch communique avec appi , await attend reponse
        method:"POST", // pour lenvoi
        headers:{
            "Content-type":"application/json",// data sous format json
            "X-goog-api-key":cle // envoyer cle
        },
        body:JSON.stringify({ // donnee envoyer a ai
            contents:[{parts:[{text:prompt}]}] , // gemini doit obligatoirement prend data sous cette form 
                    generationConfig:{responseMimeType:"application/json"}// forcea gemini de repondre sous format json
        })
                    
    });     
   }catch(error){ // se declanche quand js narive pas a communiquer avec fetch , problem connexion
        throw new Error("impossible de joindre lapi")   
   }
   
   if(!reponse.ok){ // server a repondu mais reponse indqiue un  probleme
    throw new Error("Erreur HTTP :"+reponse.status);
   }
   let data= await reponse.json();
   return data.candidates[0].content.parts[0].text // chemin d'accès hiérarchique dans la structure JSON de la réponse de l'API Gemini de Google pour récupérer le texte généré par le modèle
}