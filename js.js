let openBtn=document.querySelector("#openSettings");
let dialog=document.querySelector("dialog")
let closBTn=document.querySelector("#fermer");
openBtn.addEventListener("click",()=>{
    dialog.showModal();
})
closBTn.addEventListener("click",()=>{
    dialog.close();
})