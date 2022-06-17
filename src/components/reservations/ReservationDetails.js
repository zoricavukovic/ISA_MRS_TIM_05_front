import * as React from 'react';
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import ImgReservation from "./ReservationBasicCard.js";
import ReservedBookingEntityDetail from './ReservedBookingEntityDetail';
import ClientDetails from './ClientDetails';
import { getCurrentUser } from '../../service/AuthService.js';
import { useHistory } from 'react-router-dom';

function ShowReservationsDetails(props) {
    const history = useHistory();
    const [reservation, setReservation] = useState({});
    const [pricelist, setPricelist] = useState({});
    const [additionalServices, setAdditionalServices] = useState([]);
    const [isLoading, setLoading] = useState(true);
    let ownerId = null;
    useEffect(() => {
        if (props.history.location.state === null || props.history.location.state === undefined){
            history.push('/login');
        }
        let owner = getCurrentUser();
        if (owner === null || owner === undefined){
            history.push('/login');
        }
        else{
            ownerId = owner.id;
        }
        console.log(props.history.location.state);
        setReservation(props.history.location.state.reservation);
        setPricelist(props.history.location.state.pricelist);
        setAdditionalServices(props.history.location.state.additionalServices);
        setLoading(false);
    }, []);
    if (isLoading) { return <div><CircularProgress /></div> }
    return (
        <div style={{marginLeft:"5%", marginRight:"5%"}}>
            <div style={{ display: "flex", flexWrap: 'no-wrap', flexDirection: "row", justifyContent: "left", marginTop:"5%" }} className="App">
                <ImgReservation reservation={reservation} reservationId={reservation.id} details="false"></ImgReservation>
                <div style={{ display: "flex", flexWrap: 'no-wrap', flexDirection: "column", justifyContent: "left" }} className="App">
                    <ReservedBookingEntityDetail reservation={reservation} reservationId={reservation.id} details="false"></ReservedBookingEntityDetail>
                    <ClientDetails reservation={reservation}></ClientDetails>
                </div>  
            </div>
        </div>
    );
}

export default ShowReservationsDetails;
