import api from "./baseApi";

export function getReservationsByOwnerId(ownerId, type) {
    return api.get('reservations/owner/' + ownerId + "/" + type);
}

export function getFastReservationsByBookingEntityId(bookingEntityId) {
    return api.get('reservations/fast/' + bookingEntityId);
}

export function getAvailableFastReservationsByBookingEntityId(bookingEntityId) {
    return api.get('reservations/fastAvailable/' + bookingEntityId);
}

export function getReservationsByOwnerIdAndFilter(ownerId, name, time, type) {
    return api.get('reservations/owner/' + ownerId + "/" + type + "/filter/name/" + name + "/time/" + time);
}

export function addNewFastReservation(newFastReservation){
    return api.post('reservations', newFastReservation);
}

export function reserveFastReservation(fastReservation){
    return api.post('reservations/reserveFastReservation', fastReservation);
}

export function addReservation(reservationDTO){
    return api.post('reservations/addReservation', reservationDTO);
}

export function addReservationForClient(reservationDTO){
    return api.post('reservations/addReservationForClient', reservationDTO);
}

export function getReservationsByClientId(id){
    return api.get('reservations/client/'+id);
}

export function cancelReservationById(reservationId){
    return api.post('reservations/cancel/'+reservationId);
}

export function findAllClientsWithActiveReservations(bookingEntityId) {
    return api.get('reservations/bookingEntity/' + bookingEntityId);
}
