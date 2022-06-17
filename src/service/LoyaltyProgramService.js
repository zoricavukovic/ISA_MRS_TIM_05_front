import api from "./baseApi";

export function getCurrentLoyaltyProgram() {
    return api.get("/loyaltyPrograms/current");
}
export function saveNewLoyaltyProgram(data) {
    return api.post("/loyaltyPrograms/", data);
}
