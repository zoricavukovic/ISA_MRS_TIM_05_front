import api from "./baseApi";

export function getReportByReservationId(reservationId) {
    return api.get('/reports/' + reservationId)
}

export function addReport(report) {
    return api.post('/reports', report);
}


export const PROCESSED = 'processed';
export const UNPROCESSED = 'unprocessed';

export function getAllReportsForViewByType(type) {
    return api.get('/reports/all/' + type);
}

export function giveResponseForReport(response) {
    return api.put('/reports/giveResponse', response);
}