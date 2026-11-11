const API_key_NAME="cleApi";
const PROJECT_KEY="planit_projects";

//get api
export function getApi(){
    return sessionStorage.getItem(API_key_NAME)|| "";
}

// save api
export function saveApi(key){
    return sessionStorage.setItem(API_key_NAME,key);
}
// get projet
export function getProjects(){
    return JSON.parse(localStorage.getItem(PROJECT_KEY))||[];
}
// set projet
export function saveProjects(projects){
     localStorage.setItem(PROJECT_KEY , JSON.stringify(projects))
}
// ajouter un projet
export function addProject(project){
    const projects=getProjects();
    projects.push(project);
    saveProjects(projects);
}
