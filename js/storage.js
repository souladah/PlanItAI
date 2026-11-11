const API_key_NAME="cleApi";
const PROJECT_KEY="planit_projects";

//get api
export function getApi(){
    return sessionStorage.getItem(API_key_NAME)||"";
}

// save api
export function saveApi(value){
    return sessionStorage.setItem(API_key_NAME,value);
}
// get projet
export function getProjet(){
    return JSON.parse(localStorage.getItem(PROJECT_KEY))||[];
}
// set projet
export function setProjet(projects){
    return localStorage.setItem(PROJECT_KEY , JSON.stringify(projects))
}
// ajouter un projet
export function addProjet(newProjet){
    let allProjets=getProjet();
    allProjets.push(newProjet);
    setProjet(allProjets);
}