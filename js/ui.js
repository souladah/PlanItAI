import { getProjet , removeProjet ,saveApi,getApi } from './storage.js';
import { load } from './demo.js';
let container=document.getElementById("projectsList");
let empty=document.getElementById("msgEmpty");

export function renderlist(){
    if(!container || !empty )return ;
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
            <a href="projet.html?id=${p.id}" class="btn-show text-blue-600 font-semibold">show detail</a>
             <button type="button" class="btn-delete text-red-600 font-semibold cursor-pointer">Supprimer</button>
            </div>
             `;
        card.querySelector(".nom").textContent=p.nom;
        card.querySelector(".desc").textContent=p.description;
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

export function showData(projet){
    const section=document.getElementById("details");
    if(!section) return ;
    section.innerHTML="";
    const h1=document.createElement("h1");
    h1.textContent=projet.nom;
    let pragph=document.createElement("p");
    let tasks=projet.tasks || [];
    let total=0;
    let done=0;
    let inProgres=0;
    let toDo=0 ;

 
            
        for(let t of tasks){
            total+=t.estimatedTime
             if(t.status==="To Do"){
                toDo+=1;
             }else if(t.status==="Done"){
                done+=1;
             }else if(t.status==="In Progress"){
                inProgres+=1;
             }
        }
        let totalstatus=done+inProgres+toDo;
        let donepourcentage=(done/totalstatus)*100;
        pragph.textContent=projet.duree+"-"+projet.nbDev+"-"+total+"h/"+projet.total+"/h -"+donepourcentage+"% terminee";
        const parentDiv=document.createElement("div");
        const div1=document.createElement("div");
        const div2=document.createElement("div");
        const div3=document.createElement("div");

        const TodosH2=document.createElement("h2");
        const inProgressH2=document.createElement("h2");
        const DoneH2=document.createElement("h2");
        TodosH2.textContent="To Do ("+toDo+")";
        inProgressH2.textContent="inProgres ("+inProgres+")";
        DoneH2.textContent="Done ("+done+")";
        div1.appendChild(TodosH2);
        div2.appendChild(inProgressH2);
        div3.appendChild(DoneH2);
        const listTaskTodo=tasks.filter((t)=>t.status==="To Do");
        const listTaskInprogress=tasks.filter((t)=>t.status==="In Progress");
        const listTaskDone=tasks.filter((t)=>t.status==="Done");
        for(let t of listTaskTodo){
            const p=document.createElement("p");
            p.textContent=t.id;
            const h3=document.createElement("h3");
            h3.textContent=t.title;
            const span1=document.createElement("span");
            span1.textContent=t.priority;
             const span2=document.createElement("span");
            span2.textContent=t.size;
             const span3=document.createElement("span");
            span3.textContent=t.estimatedTime;
             const span4=document.createElement("span");
            span4.textContent=t.deadline;
            div1.append(p,h3,span1,span2,span3,span4);

            if(t.dependencies.length>0){
                const depondencies=document.createElement("p");
                depondencies.textContent="depend de : "+t.dependencies.join(",");
                div1.append(depondencies)
            }
        }
        for(let t of listTaskInprogress){
            const p=document.createElement("p");
            p.textContent=t.id;
            const h3=document.createElement("h3");
            h3.textContent=t.title;
            const span1=document.createElement("span");
            span1.textContent=t.priority;
             const span2=document.createElement("span");
            span2.textContent=t.size;
             const span3=document.createElement("span");
            span3.textContent=t.estimatedTime;
             const span4=document.createElement("span");
            span4.textContent=t.deadline;
            div2.append(p,h3,span1,span2,span3,span4);

            if(t.dependencies.length>0){
                const depondencies=document.createElement("p");
                depondencies.textContent="depend de : "+t.dependencies.join(",");
                div2.append(depondencies)
            }
        }
        for(let t of listTaskDone){
            const p=document.createElement("p");
            p.textContent=t.id;
            const h3=document.createElement("h3");
            h3.textContent=t.title;
            const span1=document.createElement("span");
            span1.textContent=t.priority;
             const span2=document.createElement("span");
            span2.textContent=t.size;
             const span3=document.createElement("span");
            span3.textContent=t.estimatedTime;
             const span4=document.createElement("span");
            span4.textContent=t.deadline;
            div3.append(p,h3,span1,span2,span3,span4);

            if(t.dependencies.length>0){
                const depondencies=document.createElement("p");
                depondencies.textContent="depend de : "+t.dependencies.join(",");
                div3.append(depondencies)
            }
        }

 
        
        parentDiv.append(div1,div2,div3);
        section.append(h1,pragph,parentDiv)
        
}