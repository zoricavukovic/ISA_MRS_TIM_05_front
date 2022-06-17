import api from "./baseApi";

export function getPricelistByEntityId(id) {
    return api.get('pricelists/' + id);
}

export function addNewPriceListForEntityId(id, newPricelist) {
    return api.post('pricelists/' + id, newPricelist);    
}
