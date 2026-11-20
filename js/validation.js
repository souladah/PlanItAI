const rules = [
    { id: "nom",         regex: /^.{3,60}$/,     message: "Le nom doit contenir entre 3 et 60 caractères." },
    { id: "description", regex: /^.{10,200}$/,   message: "La description doit contenir entre 10 et 200 caractères." },
    { id: "brief",       regex: /^[\s\S]{30,}$/, message: "Le brief doit contenir au moins 30 caractères." },
    { id: "duree",       regex: /^[1-9]\d*$/,    message: "La durée doit être un entier supérieur ou égal à 1." },
    { id: "nbDev",       regex: /^[1-9]\d*$/,    message: "Le nombre de développeurs doit être un entier supérieur ou égal à 1." },
    { id: "techno",      regex: /^.{2,}$/,       message: "Indiquez au moins une technologie." },
    { id: "niveau",      regex: /^(Beginner|Intermediate|Advanced)$/, message: "Choisissez un niveau de difficulté." }
];
export function validate(id){
    let notValide=[]
    for(let rule of rules){
       let input=document.getElementById(rule.id);
       let valeur =input.value.trim() ;
       let valide=rule.regex.test(valeur)
        if(!valide) notValide.push(rule.id);
       if(id && id!=rule.id) continue  ;//// ignore les autres champs : seul le champ modifie affiche son erreur
       let nextElement=input.nextElementSibling;
       if(nextElement && nextElement.classList.contains("erreur")) nextElement.remove();
       if(!valide){
            let span=document.createElement("span")
            span.textContent=rule.message;
            span.classList.add("erreur", "block", "text-xs", "mt-1", "text-red-600");
            input.insertAdjacentElement("afterend",span)
       }
    }
    return notValide.length > 0 ? false : true  
}

const tacheRules = [
    { id: "nom-tache", regex: /^.{3,100}$/,   message: "Le titre doit contenir entre 3 et 100 caracteres." },
    { id: "dec-tache", regex: /^.{10,200}$/,   message: "La description doit contenir entre 10 et 200 caractères." },
    {id:"userStories", regex:/\S/, message:"Ajoutez au moins une user story (une par ligne)."},
    { id: "acceptanceCriteria",       regex: /\S/, message: "Ajoutez au moins un critère (un par ligne)." },
    { id: "t-priority",       regex: /^(Low|Medium|High|Critical)$/,    message: "Priorité : Low, Medium, High ou Critical." },
    { id: "importance",       regex: /^(Low|Medium|High)$/,    message: "Importance : Low, Medium ou High." },
    { id: "size",        regex: /^(XS|S|M|L|XL)$/,    message: "Taille : XS, S, M, L ou XL." },
    { id: "estimatedTime",  regex : /^(?!0+(\.0+)?$)\d+(\.\d+)?$/,         message: "Le temps estimé doit être un nombre supérieur à 0." },
    { id: "deadline",      regex:  /^Day [1-9]\d*$/, message: "Format attendu : Day 1, Day 2..." },
    { id: "status",      regex: /^(To Do|In Progress|Done)$/, message: "Choisissez un statut." },
    { id: "dependencies",      regex: /^(TASK-\d+([\s,;]+TASK-\d+)*)?$/, message: "Format : TASK-001, TASK-002 (ou vide)." }


];
export function validatetache(id){
    let notValide=[]
    for(let rule of tacheRules){
       let input=document.getElementById(rule.id);
       let valeur =input.value.trim() ;
       let valide=rule.regex.test(valeur)
        if(!valide) notValide.push(rule.id);
       if(id && id!=rule.id) continue  ;//// ignore les autres champs : seul le champ modifie affiche son erreur
       let nextElement=input.nextElementSibling;
       if(nextElement && nextElement.classList.contains("erreur")) nextElement.remove();
       if(!valide){
            let span=document.createElement("span")
            span.textContent=rule.message;
            span.classList.add("erreur", "block", "text-xs", "mt-1", "text-red-600");
            input.insertAdjacentElement("afterend",span)
       }
    }
    return notValide.length > 0 ? false : true  
}