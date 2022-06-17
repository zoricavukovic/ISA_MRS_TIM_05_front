import api from "./baseApi";

export function getAdditionalServicesByReservationId(reservationId) {
    return api.get('additionalServices/' + reservationId);
}

