import api from "./baseApi";

export function getCurrentSystemRevenuePercentage() {
    return api.get("/systemRevenuePercentages/current");
}

export function saveNewSystemRevenuePercentage(data) {
    return api.post("/systemRevenuePercentages/", data);
}

export function getSystemRevenueForPeriod(startDate, endDate) {
    return api.get("/systemRevenuePercentages/revenueInPeriod?startDate=" + startDate + "&endDate=" + endDate);
}

export function getSystemRevenueAll() {
    return api.get("/systemRevenuePercentages/allRevenue");
}
