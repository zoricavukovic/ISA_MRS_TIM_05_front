import api from "./baseApi";

export function getRatingByReservationId(id) {
    return api.get('/ratings/byReservationId/'+id);
}

export function createRating(ratingDTO) {
    return api.post('/ratings/createRating', ratingDTO);
}

export function getRatingsByEntityId(bookingEntityId) {
    return api.get('/ratings/ProcessedByEntityId/' + bookingEntityId);
}

export function getAllRatingsForViewByType(type) {
    return api.get('/ratings/all/' + type);
}

export function putReviewForPublication(review) {
    return api.put('/ratings/putForPublication', review)
}

export function deleteReviewById(id) {
    return api.delete('ratings/' + id)
}