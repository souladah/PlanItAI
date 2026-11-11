let form=document.querySelector("form");
let btn=document.querySelector('#btnSubmit')
const rules = [
    { id: "nom",         regex: /^.{3,60}$/,     message: "Le nom doit contenir entre 3 et 60 caractères." },
    { id: "description", regex: /^.{10,200}$/,   message: "La description doit contenir entre 10 et 200 caractères." },
    { id: "brief",       regex: /^[\s\S]{30,}$/, message: "Le brief doit contenir au moins 30 caractères." },
    { id: "duree",       regex: /^[1-9]\d*$/,    message: "La durée doit être un entier supérieur ou égal à 1." },
    { id: "nbDev",       regex: /^[1-9]\d*$/,    message: "Le nombre de développeurs doit être un entier supérieur ou égal à 1." },
    { id: "techno",      regex: /^.{2,}$/,       message: "Indiquez au moins une technologie." },
    { id: "niveau",      regex: /^(Beginner|Intermediate|Advanced)$/, message: "Choisissez un niveau de difficulté." }
];
function validate(id){
    let notValide=[]
    for(let rule of rules){
       let input=document.getElementById(rule.id);
       let valeur =input.value.trim() ;
       let nextElement=input.nextElementSibling;
       if(nextElement && nextElement.classList.contains("erreur")) nextElement.remove();
       if(id!=rule.id) continue  ;//// ignore les autres champs : seul le champ modifie affiche son erreur
       if(!rule.regex.test(valeur)){
        let span=document.createElement("span")
        span.textContent=rule.message;
        span.classList.add("erreur", "block", "text-xs", "mt-1", "text-red-600");
        input.insertAdjacentElement("afterend",span)
        notValide.push(rule.id);
       }
    }
    return notValide.length > 0 ? false : true  
}
form.addEventListener("input",(e)=>{
    let Estvalide=validate(e.target.id);
    btn.disabled=!Estvalide
})
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(validate()===false){
        alert("non valide");
        return ;
    }
    alert("valide");
})
btn.disabled=true;

