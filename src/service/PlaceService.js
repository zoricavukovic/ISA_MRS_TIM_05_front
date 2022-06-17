import { Paid } from "@mui/icons-material";
import api from "./baseApi";


export function getAllPlaces() {
    return api.get('/places');
}

export function getPlaceById(id) {
    return api.get('/places/' + id);
}
