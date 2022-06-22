import api from "./baseApi";

export function getAllUnprocessedDeleteAccountRequests() {
    return api.get('/deleteAccounts/unprocessed');
}

export function sendDeleteRequest(request){
    return api.post('/deleteAccounts/sendRequest', request);
}

export function hasUserRequest(userId){
    return api.get('/deleteAccounts/hasRequest/'+ userId);
}

export function canDeleteProfile(userId){
    return api.get('/deleteAccounts/canDelete/'+ userId);
}


export function giveResponseForDeleteAccountRequest(response) {
    return api.put('/deleteAccounts/giveResponse', response);
}