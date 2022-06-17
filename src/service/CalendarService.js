import api from "./baseApi";


export function getCalendarValuesByBookintEntityId(id) {
    return api.get('/calendar/entity/' + id);
}

export function getAnalysisWeekByBookintEntityId(id) {
    return api.get('/calendar/week/entity/' + id);
}

export function getAnalysisMonthByBookintEntityId(id) {
    return api.get('/calendar/month/entity/' + id);
}

export function getAnalysisYearByBookintEntityId(id) {
    return api.get('/calendar/year/entity/' + id);
}

export function getCalendarValuesForAllOwnerEntitiesById(id) {
    return api.get('/calendar/allForOwner/' + id);
}