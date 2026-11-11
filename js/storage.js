const API_key_NAME="cleApi";

export function getApi(){
    return sessionStorage.getItem(API_key_NAME)|| "";
}
export function getApi(key){
    return sessionStorage.setItem(API_key_NAME,key);
}