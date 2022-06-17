import api from "./baseApi";


export function getAllAdventures() {
    return api.get('/adventures');
}

export function getAllAdventuresView() {
    return api.get('/adventures/view')
}

export function getAllAdventuresViewForOwnerId(ownerId) {
    return api.get('/adventures/view/forOwnerId/' + ownerId);
}

export function getTopRatedAdventures() {
    return api.get('/adventures/topRated')
}

export function getAdventureById(id) {
    return api.get('/adventures/' + id);
}

export function getAdventureByIdCanBeDeleted(id) {
    return api.get('/adventures/deleted/' + id);
}

export function editAdventureById(id, editedAdventure) {
    return api.put('/adventures/' + id, editedAdventure);
}

export function addNewAdventure(newAdventure) {
    return api.post('/adventures', newAdventure);
}

export function getSearchedAdventures(searchParams) {
    return api.post('/adventures/search', searchParams);
}
