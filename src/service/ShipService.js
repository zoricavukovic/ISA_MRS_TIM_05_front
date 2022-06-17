import api from "./baseApi";


export function getAllShips() {
    return api.get('/ships');
}

export function getAllShipsView() {
    return api.get('/ships/view')
}

export function getAllShipsViewForOwnerId(ownerId) {
    return api.get('/ships/view/forOwnerId/' + ownerId);
}

export function getTopRatedShips() {
    return api.get('/ships/topRated')
}

export function getShipById(id) {
    return api.get('/ships/' + id);
}

export function getShipByIdCanBeDeleted(id) {
    return api.get('/ships/deleted/' + id);
}

export function editShipById(id, editedShip) {
    return api.put('/ships/' + id, editedShip);
}

export function addNewShip(id, newShip) {
    return api.post('/ships/' + id, newShip);
}

export function getSearchedShips(searchParams) {
    return api.post('/ships/search', searchParams);
}

