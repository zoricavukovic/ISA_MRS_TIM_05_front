import api from "./baseApi";


export function getAllBookingEntitiesByOwnerId(id) {
    return api.get('/bookingEntities/allByOwner/' + id);
}

export function getBookingEntityByIdForCardView(id) {
    return api.get('/bookingEntities/view/' + id);
}

export function getAllSearchedEntitiesBySimpleCriteria(searchCriteria) {
    return api.post('/bookingEntities/simpleSearch', searchCriteria);
}

export function checkIfCanEditEntityById(id) {
    return api.get('/bookingEntities/checkIfCanEdit/' + id)
}

export function logicalDeleteBookingEntityById(entityId, ownerId, confirmPass) {
    return api.delete('/bookingEntities/' + entityId + '/' + ownerId, {data : confirmPass});
}

export function getBookingEntityById(id) {
    return api.get('/bookingEntities/byId/' + id);
}

export function getAllSubscribedEntities(clientId){
    return api.get('/bookingEntities/subscribedEntities/' + clientId);
}

export function getBookingEntitiesFromOwnerId(id) {
    return api.get('/bookingEntities/getAllForOwnerId' + id);
}