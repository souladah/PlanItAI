import './settings.js' ;
import { getProjet , removeProjet } from './storage.js';
import { load } from './demo.js';
let container=document.getElementById("projectsList");
let empty=document.getElementById("msgEmpty");

export function renderlist(){
    
    let projets=getProjet();

    container.innerHTML="";
    empty.classList.toggle("hidden",projets.length>0);
    for (let p of projets){
       const tasks=p.tasks || [];
       const total=tasks.length;
       const done=tasks.filter(t=>t.status==="Done").length;
       const percent=total===0 ? 0 :Math.round((done/total)*100);
       const card=document.createElement("article");
       card.className="bg-white rounded-xl shadow p-5 border border-slate-200 flex flex-col gap-2";
       card.innerHTML=`
           <h2 class="nom text-lg font-bold"></h2>
           <p class="desc text-sm text-slate-500"></p>
           <p class="text-sm"> Total : ${total} - Terminees :${done} - Restantes :${total-done}</p>
           <div class="w-full bg-slate-200 rounded-full h-2">
             <div class="bg-blue-600 h-2 rounded-full" style="width:${percent}%"></div>
            </div>
            <p class="text-sm font-semibold">${percent}%</p>
            <div class="flex justify-between mt-2">
             <a class="lien text-blue-600 font-semibold" href="#">Voir le task Board</a>
             <button type="button" class="btn-delete text-red-600 font-semibold cursor-pointer">Supprimer</button>
            </div>
             `;
        card.querySelector(".nom").textContent=p.nom;
        card.querySelector(".desc").textContent=p.description;
        card.querySelector(".lien").href="projet.html?id"+encodeURIComponent(p.id);
        card.querySelector(".btn-delete").dataset.id=p.id;
        container.appendChild(card);
    }
 
}

if(container){
    container.addEventListener("click",(e)=>{
        const btn=e.target.closest(".btn-delete");
        if(!btn)return;
        if(confirm("Supprimer ce projet ?")){
            removeProjet(btn.dataset.id);
            renderlist();
        }
    })
}

export function initSttingsDIalog({getkey,saveKey,load}){
    let openBtn=document.querySelector("#openSettings");
    let dialog=document.querySelector("dialog")
    let closBTn=document.querySelector("#fermer");
    let input=document.getElementById("token");
    let cancelBtn=document.getElementById("anulerBTn");
    let demoCheckbox=document.getElementById("demoCheckbox");

    openBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        input.value=getApi();
        dialog.showModal();
    })
    closBTn.addEventListener("click",()=>{
        dialog.close();
    })
    cancelBtn.addEventListener("click",()=>{
        dialog.close();
    })
    let enregistrerBtn=document.querySelector("#enregistrerBtn");

    enregistrerBtn.addEventListener("click",()=>{
        let valeur=input.value.trim();
        if(valeur) saveApi(valeur);
        dialog.close();
    })
    demoCheckbox.addEventListener("change", async ()=>{
        if(!demoCheckbox.checked) return ;
        try{
            await load();
            renderlist();
            dialog.close();
        }catch(error){
            alert(error.message)
        }
        demoCheckbox.checked=false ;

    });
}