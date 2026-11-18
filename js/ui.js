import { getProjetDemo, getProjetai, removeProjet, setProjetDemo, setProjetai, updateprojet } from './storage.js';

let container = document.getElementById("projectsList");
let empty = document.getElementById("msgEmpty");

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
        const btn = e.target.closest(".btn-delete");
        if (!btn) return;
        if (confirm("Supprimer ce projet ?")) {
            removeProjet(btn.dataset.id);
            renderlist();
        }
    })
}

export function initSttingsDIalog({ getkey, saveKey }) {
    let openBtn = document.querySelector("#openSettings");
    let dialog = document.querySelector("dialog")
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
    const section = document.getElementById("details");
    if (!section) return;
    section.innerHTML = "";
    const h1 = document.createElement("h1");
    h1.textContent = projet.nom;
    let pragph = document.createElement("p");
    let tasks = projet.tasks || [];
    const total = tasks.length;
    const done = tasks.filter(t => t.status === "Done").length;
    const percent = total === 0 ? 0 : Math.floor((done / total) * 100);
    pragph.textContent = projet.duree + " jour-" + projet.nbDev + " dev-" + total + "h/" + total + "h -" + percent + "% terminee";
    const parentDiv = document.createElement("div");
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const div3 = document.createElement("div");

    const TodosH2 = document.createElement("h2");
    const inProgressH2 = document.createElement("h2");
    const DoneH2 = document.createElement("h2");
    TodosH2.textContent = "To Do (" + tasks.filter(t => t.status === "To Do").length + ")";
    inProgressH2.textContent = "inProgres (" + tasks.filter(t => t.status === "In Progress").length + ")";
    DoneH2.textContent = "Done (" + done + ")";
    div1.appendChild(TodosH2);
    div2.appendChild(inProgressH2);
    div3.appendChild(DoneH2);
    const listTaskTodo = tasks.filter((t) => t.status === "To Do");
    const listTaskInprogress = tasks.filter((t) => t.status === "In Progress");
    const listTaskDone = tasks.filter((t) => t.status === "Done");
    const list = [listTaskTodo, listTaskInprogress, listTaskDone]
    const colones = [div1, div2, div3];
    for (let i = 0; i < list.length; i++) {//boucle pour les colone
        for (let t of list[i]) {// boucle sur chaque list des taches 

            const card = document.createElement("div");
            card.draggable = true;
            card.dataset.id=t.id;
            card.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", t.id)
            })
            card.className = "bg-gray-100 border border-slate-200 rounded-md p-2.5 shadow-sm  hover:shadow-md transition-shadow mb-10";
            const p = document.createElement("p");
            p.textContent = t.id;
            const h3 = document.createElement("h3");
            h3.textContent = t.title;
            const span1 = document.createElement("span");
            span1.textContent = t.priority;
            const span2 = document.createElement("span");
            span2.textContent = t.size;
            const span3 = document.createElement("span");
            span3.textContent = t.estimatedTime;
            const span4 = document.createElement("span");
            span4.textContent = t.deadline;
            card.append(p, h3, span1, span2, span3, span4)
            colones[i].append(card);
            if (t.dependencies.length > 0) {
                const depondencies = document.createElement("p");
                depondencies.className = "text-[10px] text-slate-500 mt-1"
                depondencies.textContent = "depend de : " + t.dependencies.join(",");
                card.append(depondencies)
            }
            // css
            p.className = "text-[10px] text-slate-400 font-medium";
            h3.className = "text-xs font-semibold text-slate-800 leading-snug"
            span1.className = "text-[10px] font-medium bg-red-100 text-red-700 rounded px-1.5 py-0.5 w-fit"
            span2.className = "text-[10px]  bg-slate-200 text-slate-600 rounded px-1.5 py-0.5 w-fit"
            span3.className = "text-[10px]  bg-slate-200 text-slate-600 rounded px-1.5 py-0.5 w-fit"
            span4.className = "text-[10px]  bg-slate-200 text-slate-600 rounded px-1.5 py-0.5 w-fit"
        }
    }

    // add css

    parentDiv.classList.add("grid", "md:grid-cols-2", "lg:grid-cols-3", "gap-6", "w-full", "items-start");
    h1.classList.add("font-bold", "mb-3", "text-3xl", "text-slate-800");
    pragph.classList.add("text-sm", "text-gray-500", "border", "border-slate-200", "rounded-xl", "p-4", "mb-8", "shadow-sm")
    section.classList.add("max-w-7xl", "mx-auto", "px-4", "sm:px-6", "py-8")
    div1.className = "bg-slate-50 border border-blue-200 rounded-2xl p-5 shadow-sm leading-10 h-fit";
    div2.className = "bg-slate-50 border border-orange-200 rounded-2xl p-5 shadow-sm leading-10 h-fit";
    div3.className = "bg-slate-50 border border-green-200 rounded-2xl p-5 shadow-sm leading-10 h-fit";
    TodosH2.className = "text-lg font-bold text-blue-700 border-blue-200 pb-3"
    inProgressH2.className = "text-lg font-bold text-orange-700 border-orange-200 pb-3"
    DoneH2.className = "text-lg font-bold text-green-700 border-green-200 pb-3"



    parentDiv.append(div1, div2, div3);
    section.append(h1, pragph, parentDiv);

    // add drang and drop
    [["To Do", div1], ["In Progress", div2], ["Done", div3]].forEach(([st, col]) => {
     col.classList.add("min-h-40");

     col.addEventListener("dragover",(e)=>{// jai fait ca pour autoriser le drop de chaque div
        e.preventDefault();
     })

     col.addEventListener("drop",(e)=>{//event responsable de leffect lors du lachement de la carte dans une colone
        e.preventDefault();
        const id=e.dataTransfer.getData("text/plain");
        let task=tasks.find((t)=>String(t.id)===id);
        if(!task) return;
        const carteCible=e.target.closest("[data-id]");

        if(carteCible && carteCible.dataset.id===id) return;
        // maintenat je doit verifier si cette taches depond dune autre et verifie si la cette derniere est done or not pour que je puise lajouter dans done
        if(st==="Done"){
            const bloquees=task.dependencies.filter((depId)=>{
                const dep=tasks.find((t)=>t.id===depId);
                return dep && dep.status  !=="Done";
            })
            if(bloquees.length>0){
                alert("impossible : termier dabord "+bloquees.join(", "));
                return;
            }
        }
        task.status=st;
        tasks.splice(tasks.indexOf(task),1);

        if(carteCible){
            const idCible=carteCible.dataset.id;
            const positionCible=tasks.findIndex((t)=>String(t.id)===idCible);
            tasks.splice(positionCible,0,task);
        }else{
            tasks.push(task);
        }
        updateprojet(projet);
        showData(projet);
     })
    
    })



}

/// je doit ajouter crud pour chaque plannifiaction et ses taches , button de ai qui affiche les ai . 