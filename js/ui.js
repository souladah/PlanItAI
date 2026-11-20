import { getProjetDemo, getProjetai, removeProjet, updateprojet } from './storage.js';
import { validate, validatetache } from './validation.js';
let container = document.getElementById("projectsList");
let empty = document.getElementById("msgEmpty");
let projetCourant=null;
let tacheCourant=null;

function modeDemo(){
    return localStorage.getItem("demoChecked")==="true";
}
export function renderlist() {

    if (!container || !empty) return;
    container.innerHTML = "";
    let projets = localStorage.getItem("demoChecked") === "true" ? getProjetDemo() : getProjetai();

    empty.classList.toggle("hidden", projets.length > 0);
    for (let p of projets) {
        const tasks = p.tasks || [];
        const total = tasks.length;
        const done = tasks.filter(t => t.status === "Done").length;
        const percent = total === 0 ? 0 : Math.floor((done / total) * 100);
        const card = document.createElement("article");
        card.className = "bg-white rounded-2xl shadow-sm p-6 border border-slate-200  ";
        card.innerHTML = `
           <h2 class="nom text-lg font-bold"></h2>
           <p class="desc text-sm text-slate-500"></p>
           <p class="text-sm"> Total : ${total} - Terminees :${done} - Restantes :${total - done}</p>
           <div class="w-full bg-slate-200 rounded-full h-2">
             <div class="bg-blue-600 h-2 rounded-full" style="width:${percent}%"></div>
            </div>
            <p class="text-sm font-semibold">${percent}%</p>
            <div class="flex justify-between mt-2">
            <a href="Detail-projet.html?id=${p.id}" class="btn-show text-blue-600 font-semibold">show detail</a>
             <button type="button" data-id="${p.id}" class="btn-delete text-red-600 font-semibold cursor-pointer">Supprimer</button>
            </div>
             `;
        card.querySelector(".nom").textContent = p.nom;
        card.querySelector(".desc").textContent = p.description;

        container.appendChild(card);

    }

}

if (container) {
    container.addEventListener("click", (e) => {
        const btn =e.target.closest("button") ;// cherche le plus proche element qui a .btn-delete
        if (!btn) return;
        if (confirm("Supprimer ce projet ?")) {
            removeProjet(btn.dataset.id);
            renderlist();
        }
    })
}

export function initSttingsDIalog({ getkey, saveKey }) {
    let openBtn = document.querySelector("#openSettings");
    let dialog = document.querySelector("#settingDialogue")
    let closBTn = document.querySelector("#fermer");
    let input = document.getElementById("token");
    let cancelBtn = document.getElementById("anulerBTn");
    

    openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        input.value = getkey();
        dialog.showModal();
    })
    closBTn.addEventListener("click", () => {
        dialog.close();
    })
    cancelBtn.addEventListener("click", () => {
        dialog.close();
    })
    let enregistrerBtn = document.querySelector("#enregistrerBtn");

    enregistrerBtn.addEventListener("click", () => {
        let valeur = input.value.trim();
        if (valeur) saveKey(valeur);
        dialog.close();
        renderlist();
    })

}

export function initDemo(load, redirectTo) {
    const demoCheckbox = document.getElementById("demoCheckbox");
    if (!demoCheckbox) return;

    demoCheckbox.addEventListener("change", async () => {
        if (!demoCheckbox.checked) return;// si est decocher fait rien
        localStorage.setItem("demoChecked", "true"); // sinon modifier true dans ls
        try {
            await load();
            window.location.href = redirectTo
        } catch (error) {
            alert(error.message)
            demoCheckbox.checked = false
        }

    });
}
export function showData(projet) {
    projetCourant=projet;
    const section = document.getElementById("details");
    if (!section) return;
    section.innerHTML = "";

    if(!projet.tasks) projet.tasks=[];

    const tasks=projet.tasks;
    const total=tasks.length;
    const faites=tasks.filter(t=>t.status==="Done");
    const percent=total===0?0:Math.floor((faites.length/total)*100);
    const heuresTotal=tasks.reduce((somme,t) => somme+Number(t.estimatedTime),0);
    const heuresFaite=faites.reduce((somme,t)=>somme+Number(t.estimatedTime),0);

    const h1 = document.createElement("h1");
    h1.textContent = projet.nom;
    h1.className="font-bold text-3xl text-slate-800 mb-3";

    const infos=document.createElement("p");
    infos.textContent=projet.duree+" jours -"+projet.nbDev+" dev -"+heuresFaite+"h/"+heuresTotal+"h -"+percent+"% terminee";
    infos.textContent="text-sm text-gray-500 border border-slate-200 rounded-xl p-4 mb-8 shadow-sm"
   
  const parentDiv=document.createElement("p");
  parentDiv.className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start";
  const status=[
    {nom:"To Do",bordure:"border-blue-200",titre:"text-blue-700"},
    {nom:"In Progress",bordure:"border-orange-200",titre:"text-orange-700"},
    {nom:"To Do",bordure:"border-green-200",titre:"text-green-700"},
  ]

  for(let s of status){
    const liste=tasks.filter(t=>t.status===s.nom);
    const col=document.createElement("div");
    col.className="bg-slate-50 border"+s.bordure+ " rounded-2xl p-5 shadow-sm h-fit min-h-40";

    const h2=document.createElement("h2");
    h2.textContent=s.nom+" ("+liste.length+" )";
    h2.className="text-lg font-bold mb-3 "+s.titre;
    col.append(h2);
    for(let t of liste) col.append(creerCarte(t));
    activerDrop(col,s.nom,task,projet);
    parentDiv.append(col);
  }
  section.className="max-w-7xl mx-auto px-4 sm:px-6 py-8";
  section.append(h1,infos,parentDiv);

}

function RemplirDialogueTask(task){
   
   document.getElementById("nom-tache").value=task.title;
   document.getElementById("acceptanceCriteria").value=task.acceptanceCriteria.join("\n");
   document.getElementById("t-priority").value=task.priority;
   document.getElementById("importance").value=task.importance;
   document.getElementById("size").value=task.size;
   document.getElementById("estimatedTime").value=task.estimatedTime;
   document.getElementById("deadline").value=task.deadline;
   document.getElementById("status").value=task.status;
   document.getElementById("dependencies").value=task.dependencies.join("\n");
       
}

function updatetache(tache){
 
 const formulaireUpdate=document.getElementById("form-update");
 formulaireUpdate.querySelectorAll(".erreur").forEach((e)=>{
    e.remove();
 })
 formulaireUpdate.addEventListener("input",(e)=>{
  e.preventDefault();
  validatetache(e.target.value);
 })
 formulaireUpdate.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(validate(tache.id)){
            let updatedTache={};

   updatedTache.id=tache.id;
   updatedTache.title=document.getElementById("nom-tache").value;
   updatedTache.acceptanceCriteria=document.getElementById("acceptanceCriteria").value;
   updatedTache.priority=document.getElementById("t-priority").value;
   updatedTache.importance=document.getElementById("importance").value;
   updatedTache.size=document.getElementById("size").value;
   updatedTache.estimatedTime=document.getElementById("estimatedTime").value;
   updatedTache.deadline=document.getElementById("deadline").value;
   updatedTache.status=document.getElementById("status").value;
   updatedTache.dependencies=document.getElementById("dependencies").value=task.dependencies.length>0 ? task.dependenciesjoin("\n"):"aucune dependance";
// verification du dependance
   if(updatedTache.status==="Done"){
            const bloquees=task.dependencies.filter((depId)=>{
                const dep=tasks.find((t)=>t.id===depId);
                return dep && dep.status  !=="Done";
            })
            if(bloquees.length>0){
                alert("impossible : termier dabord "+bloquees.join(", "));
                return;
            }
    }
    Object.assign(tacheCourant,updatedTache)
    updateprojet(projetCourant)
    document.getElementById("update-dialog").close()
    showData()
 }})

}


/// je doit ajouter crud pour chaque plannifiaction et ses taches , button de ai qui affiche les ai a la place de checbox . // button de retour qui retour a la page precedente