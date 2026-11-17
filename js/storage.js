export const API_key_NAME="cleApi";
export const PROJECT_KEY="planit_projects";
export const PROJECT_KEYAi="planit_projectsAi"
//get api
export function getApi(){
    return sessionStorage.getItem(API_key_NAME)||"";
}

// save api
export function saveApi(value){
    return sessionStorage.setItem(API_key_NAME,value);
}
// get projet
export function getProjetDemo(){
    return JSON.parse(localStorage.getItem(PROJECT_KEY))||[];
}
// set projet
export function setProjetDemo(projects){
    return localStorage.setItem(PROJECT_KEY , JSON.stringify(projects))
}
export function getProjetai(){
    return JSON.parse(localStorage.getItem(PROJECT_KEYAi))||[];
}

export function setProjetai(projects){
    localStorage.setItem(PROJECT_KEYAi,JSON.stringify(projects))
}
// ajouter un projet
export function addProjet(newProjet,aiOrDemo){
    let allProjets=aiOrDemo();
    allProjets.push(newProjet);
    if(aiOrDemo==getProjetDemo) setProjetDemo(allProjets);
    if(aiOrDemo==getProjetai) setProjetai(allProjets);
}


export function removeProjet(id){
    setProjetDemo(getProjetDemo().filter((p)=>p.id!==id));
    setProjetai(getProjetai().filter((p)=>p.id!==id));

}