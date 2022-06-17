import { Paid } from "@mui/icons-material";
import api from "./baseApi";


export function getAllCottages() {
    return api.get('/cottages');
}
export function getAllCottagesView() {
    return api.get('/cottages/view')
}

export function getAllCottagesViewForOwnerId(ownerId) {
    return api.get('/cottages/view/forOwnerId/' + ownerId);
}

export function getTopRatedCottages() {
    return api.get('/cottages/topRated')
}

export function getCottageById(id) {
    return api.get('/cottages/' + id);
}

export function getCottageByIdCanBeDeleted(id) {
    return api.get('/cottages/deleted/' + id);
}

export function addNewCottage(id, newCottage) {
    return api.post('/cottages/' + id, newCottage);
}

export function deleteCottageById(id, password) {
    return api.delete('/cottages/' + id + '/' + password);
}

export function editCottageById(id, editedCottage) {
    return api.put('/cottages/' + id, editedCottage);
}

export function getSearchedCottages(searchParams) {
    return api.post('/cottages/search', searchParams);
}
