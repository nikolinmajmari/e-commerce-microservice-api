
export function clean<T>(object:T){
    for(const key in object){
        if(object[key]==undefined){
            delete object[key];
        }
    }
    return object;
}