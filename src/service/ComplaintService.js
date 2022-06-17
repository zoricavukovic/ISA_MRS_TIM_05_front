import api from "./baseApi";

export function getComplaintByReservationId(id) {
    return api.get("/complaints/getByReservationId/"+id);
}

export function createComplaint(complaintDTO) {
    return api.post('/complaints/createComplaint', complaintDTO);
}

export function getAllComplaintsForViewByType(type) {
    return api.get('/complaints/all/' + type);
}

export function giveResponseForComplaint(response) {
    return api.put('/complaints/giveResponse', response);
}