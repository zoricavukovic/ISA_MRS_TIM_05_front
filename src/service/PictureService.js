import api from "./baseApi";


export function getAllPictureBase64ForEntityId(id) {
    return api.get('/pictures/entity/' + id);
}

export const URL_PICTURE_PATH = "http://localhost:8092/bookingApp/pictures/";

export function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}