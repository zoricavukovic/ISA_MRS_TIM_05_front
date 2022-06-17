import api from "./baseApi";

export function addNewAdmin(newAdmin) {
    return api.post('/admins', newAdmin);
}

export function getAllRequests() {
    return api.get('/admins/allRequestsNums');
}