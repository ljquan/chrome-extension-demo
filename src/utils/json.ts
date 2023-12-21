export function JSONparse(str=''){
    try{
        return JSON.parse(str);
    }catch(e){
        return null;
    }
}