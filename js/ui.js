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
export function initModeButton(load){
    const btn=document.getElementById("btnMode");
    if(!btn) return ;

    function majTexte(){
        btn.textContent=modeDemo()?"Voir mes projet IA" :"voir la demo";
    }
    majTexte();
    btn.addEventListener("click",async ()=>{
        if(modeDemo()){
            localStorage.setItem("demoChecked","false");

        }else{
            try{
                await load();
                localStorage.setItem("demoChecked","true");

            }catch(error){
                alert(error.message);
                return;
            }
        }
        majTexte();
        renderlist();
    });
}
if (container) {
    container.addEventListener("click", (e) => {
        const btn =e.target.closest(".btn-delete") ;// cherche le plus proche element qui a .btn-delete
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
    const btnDemo = document.getElementById("btnDemo");
    if (!btnDemo) return;

    btnDemo.addEventListener("click", async () => {
        const texte=btnDemo.textContent;
        btnDemo.disabled=true;
        btnDemo.textContent="Chargement ...";
        try{
            await load();
            localStorage.setItem("demoChecked","true");
            window.location.href=redirectTo
        
        } catch (error) {
            alert(error.message)
            btnDemo.disabled = false;
            btnDemo.textContent=texte;
        }

    });
}

function bloqueesPar(dependencies,tasks){
    return dependencies.filter((depId)=>{
        const dep=tasks.find((t)=>t.id===depId);
        return dep && dep.status !=="Done";
    })
}
function ouvrirDialogTache(task){
    tacheCourant=task;
    const dialog=document.getElementById("update-dialog");
    dialog.querySelectorAll(".erreur").forEach((e)=>e.remove());

    document.getElementById("nom-tache").value=task.title;
    document.getElementById("dec-tache").value=task.description ;
    document.getElementById("userStories").value=(task.userStories || []).join("\n");
    document.getElementById("acceptanceCriteria").value=(task.acceptanceCriteria || []).join("\n");
    document.getElementById("t-priority").value=task.priority;
   document.getElementById("importance").value=task.importance;
   document.getElementById("size").value=task.size;
   document.getElementById("estimatedTime").value=task.estimatedTime;
   document.getElementById("deadline").value=task.deadline;
   document.getElementById("status").value=task.status;
   document.getElementById("dependencies").value=(task.dependencies || []).join(", ");
   dialog.showModal();
}

function creerCarte(t){
    const deps=t.dependencies || [];

    const card=document.createElement("div");
    card.draggable=true ;
    card.dataset.id=t.id;
    card.className="bg-gray-100 border border-slate-200 rounded-md p-2.5 shadow-sm hover:shadow-md mb-3 cursor-pointer";
    card.addEventListener("dragstart",(e)=>{
        e.dataTransfer.setData("text/plain",t.id);
    })
    card.addEventListener("click",()=>ouvrirDialogTache(t));

    const p=document.createElement("p");
    p.textContent=t.id;
    p.className="text-[10px] text-slate-400 font-medium";

    const h3=document.createElement("h3");
    h3.textContent=t.title;
    h3.className="text-xs font-semibold text-slate-800 leading-snug";
    
    const badges=document.createElement("div");
    badges.className="flex flex-wrap gap-1 mt-1";
    for(let texte of[t.priority,t.size,t.estimatedTime+" h",t.deadline]){
        const span=document.createElement("span");
        span.textContent=texte;
        span.className="text-[10px] bg-slate-200 text-slate-600 rounded px-1.5 py-0.5";
        badges.append(span);
    }
    card.append(p,h3,badges);

    if(deps.length>0){
        const pDeps=document.createElement("p");
        pDeps.className="text-[10px] text-slate-500 mt-1";
        pDeps.textContent="depend de : "+ deps.join(", ");
        card.append(pDeps);
    }
    return card;
}

function activerDrop(col,status,tasks,projet){
    col.addEventListener("dragover",(e)=>{
        e.preventDefault();
    });
    col.addEventListener("drop",(e)=>{
        e.preventDefault();
        const id=e.dataTransfer.getData("text/plain");
        const task=tasks.find((t)=>t.id===id);
        if(!task) return;
    
        const carteCible=e.target.closest("[data-id]");
        if(carteCible && carteCible.dataset.id===id) return;
        if(status==="Done"){
            const bloquees=bloqueesPar(task.dependencies || [],tasks);
            if(bloquees.length>0){
                alert("Impossible : terminer d 'abord"+bloquees.join(", "));
                return;
            }
        }
        task.status=status;
        tasks.splice(tasks.indexOf(task),1);
        if(carteCible){
            const position=tasks.findIndex((t)=>t.id===carteCible.dataset.id);
            tasks.splice(position,0,task);
        }else{
            tasks.push(task);
        }
        updateprojet(projet);
        showData(projet);
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
    h1.className="font-bold text-3xl text-slate-800";
    
    
    const desc=document.createElement("p");
    desc.textContent=projet.description;
    desc.className="text-slate-600 mb-3";


    const infos=document.createElement("p");
    infos.textContent=projet.duree+" jours -"+projet.nbDev+" dev -"+heuresFaite+"h/"+heuresTotal+"h -"+percent+"% terminee";
    infos.className="text-sm text-gray-500 border border-slate-200 rounded-xl p-4 mb-8 shadow-sm"
   
  const parentDiv=document.createElement("div");
  parentDiv.className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start";
  const status=[
    {nom:"To Do",bordure:"border-blue-200",titre:"text-blue-700"},
    {nom:"In Progress",bordure:"border-orange-200",titre:"text-orange-700"},
    {nom:"Done",bordure:"border-green-200",titre:"text-green-700"},
  ]

  for(let s of status){
    const liste=tasks.filter(t=>t.status===s.nom);
    const col=document.createElement("div");
    col.className="bg-slate-50 border "+s.bordure+ " rounded-2xl p-5 shadow-sm h-fit min-h-40";

    const h2=document.createElement("h2");
    h2.textContent=s.nom+" ("+liste.length+")";
    h2.className="text-lg font-bold mb-3 "+s.titre;
    col.append(h2);
    for(let t of liste) col.append(creerCarte(t));
    activerDrop(col,s.nom,tasks,projet);
    parentDiv.append(col);
  }
  section.className="max-w-7xl mx-auto px-4 sm:px-6 py-8";
  const haut=document.createElement("div");
  haut.className="flex justify-between items-center mb-3";
  const btnModifier=document.createElement("button");
  btnModifier.type="button";
  btnModifier.textContent="Modifier le projet";
  btnModifier.className="cursor-pointer bg-blue-600 hover:bg-blue-700  text-white px-4 py-2 rounded-lg font-semibold";
  btnModifier.addEventListener("click",ouvrirDialogProjet);
  haut.append(h1,btnModifier);
  section.append(haut,desc,infos,parentDiv);
}
const champsProjet=["nom","description","duree","nbDev","techno","brief","niveau"];

function ouvrirDialogProjet(){
    const dialog=document.getElementById("update-projet-dialog");
    dialog.querySelectorAll(".erreur").forEach((e)=>e.remove());
    for(let id of champsProjet){
        document.getElementById(id).value=projetCourant[id]||"";
    }
    dialog.showModal();
}
export function initDialogs(){
    const dialogTache=document.getElementById("update-dialog");
    const dialogProjet=document.getElementById("update-projet-dialog");

    document.getElementById("clos-update").addEventListener("click",()=>dialogTache.close());
    document.getElementById("btnanluer").addEventListener("click",()=>dialogTache.close());
    document.getElementById("clos-update-projet").addEventListener("click",()=>dialogProjet.close());
    document.getElementById("btnanluer-projet").addEventListener("click",()=>dialogProjet.close());

    const formTache=document.getElementById("form-update");

    formTache.addEventListener("input",(e)=>{
        validatetache(e.target.id);
    });

    formTache.addEventListener("submit",(e)=>{
        e.preventDefault();
        if(!validatetache()) return;
        
        const tasks=projetCourant.tasks;
        const deps=document.getElementById("dependencies").value.split(/[\s,;]+/).filter(Boolean);
        const statut=document.getElementById("status").value;

        for(let d of deps){
            if(d===tacheCourant.id || !tasks.some((t)=>t.id===d)){
                alert("Dependance invalide :"+d);
                return;
            }
        }

        if(statut==="Done"){
            const bloquees=bloqueesPar(deps,tasks);
            if(bloquees.length>0){
                alert("Impossible : terminer d abord "+bloquees.join(", "));
                return;
            }
        }
        Object.assign(tacheCourant, {
            title:document.getElementById("nom-tache").value.trim(),
            description:document.getElementById("dec-tache").value,
            userStories:document.getElementById("userStories").value.split("\n").map((l)=>l.trim()).filter(Boolean),
            acceptanceCriteria:document.getElementById("acceptanceCriteria").value.split("\n").map((l)=>l.trim()).filter(Boolean),
            priority:document.getElementById("t-priority").value,
            importance:document.getElementById("importance").value,
            size:document.getElementById("size").value,
            estimatedTime:Number(document.getElementById("estimatedTime").value),
            deadline:document.getElementById("deadline").value.trim(),
            status:statut,
            dependencies:deps
        })
        updateprojet(projetCourant);
        dialogTache.close();
        showData(projetCourant);
    });
        const formProjet=document.getElementById("form-update-projet");

        formProjet.addEventListener("input",(e)=>{
            validate(e.target.id);
        })
        formProjet.addEventListener("submit",(e)=>{
            e.preventDefault();
            if(!validate()) return ;
            for(let id of champsProjet){
                projetCourant[id]=document.getElementById(id).value.trim();
            }
            updateprojet(projetCourant);
            dialogProjet.close();
            showData(projetCourant);
        });
   

    document.getElementById("supprimer").addEventListener("click",()=>{
        if(!confirm("supprimer cette tache ?")) return;
        const idSupprime=tacheCourant.id;

        projetCourant.tasks=projetCourant.tasks.filter((t)=>t.id!== idSupprime);
        for(let t of projetCourant.tasks){
            t.dependencies=(t.dependencies || []).filter((d)=>d!==idSupprime);
        }
        updateprojet(projetCourant);
        dialogTache.close();
        showData(projetCourant);
    });
}