import * as React from 'react';
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { getPricelistByEntityId } from '../../service/PricelistService';
import { getAdditionalServicesByReservationId } from '../../service/AdditionalService';
import { getFastReservationsByBookingEntityId } from '../../service/ReservationService.js';
import "../../App.css"
import { useHistory } from 'react-router-dom';
import { getCurrentUser } from '../../service/AuthService.js';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddFastReservation from './AddFastReservation';

function ShowFastReservations(props) {
    const history = useHistory();
    const [reservations, setReservations] = useState([]);
    const [bookingEntityName, setBookingEntityName] = useState("");
    const [isLoading, setLoading] = useState(true);
    const [isLoadingPricelist, setLoadingPricelist] = useState(true);
    const [isLoadingAddServices, setLoadingAddServices] = useState(true);
    const [rows, setRows] = React.useState([]);
    const [reservationCost, setReservationCost] = React.useState(0);
    const [additionalServices, setAdditionalServices] = React.useState({});
    const [pricelist, setPricelist] = useState([]);
    let ownerId = null;

    function createFastReservation(){
        history.push({
            pathname: "/addFastReservation",
            state: { bookingEntityId: props.history.location.state.bookingEntityId } 
          }) 
    }

    useEffect(() => {
        let owner = getCurrentUser();
        if (owner === null || owner === undefined){
            history.push('/login');
        }
        else{
            ownerId = owner.id;
        }
        if (props.history.location.state === null || props.history.location.state === undefined){
            return;
        }
        getPricelistByEntityId(props.history.location.state.bookingEntityId).then(resPricelist => {
            setPricelist(resPricelist.data);
            setLoadingPricelist(false);
        });
        getFastReservationsByBookingEntityId(props.history.location.state.bookingEntityId).then(res => {
            setReservations(res.data);
            if (res.data.length != 0){
                setBookingEntityName(res.data[0].bookingEntity.name);
            }
            let rowsData = [];
            
            for (let r of res.data){
                getAdditionalServicesByReservationId(r.id).then(addServices => {
                    setAdditionalServices(addServices.data);
                    let updatedResCost = pricelist.entityPricePerPerson*r.numOfDays*r.numOfPersons;
                    console.log(updatedResCost);
                    if (addServices.data.length>0){
                    for (let addService of addServices.data){
                        updatedResCost += addService.price;
                    }
                    }
                    setReservationCost(updatedResCost);
                    console.log(reservationCost);
                    setLoadingAddServices(false);
                });
                var date = new Date(r.startDate); 
                let end = new Date(r.startDate);
                console.log(date);
                end.setDate(date.getDate() + r.numOfDays);
                rowsData.push({
                    id: r.id, 
                    startDate: new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit"
                      }).format(date),
                    endDate: new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit"
                      }).format(end),
                    lengthStay: r.numOfDays, 
                    numOfPersons: r.numOfPersons,
                    cost: 0
                });
            }
            
            setRows(rowsData);
            setLoading(false);
            if (res.data.length === 0){
                setLoadingAddServices(false);
                setLoadingPricelist(false);
            }
        })
    }, []);

    const columns = [
        { field: 'startDate', headerName: 'Start Date', width: 150 },
        { field: 'endDate', headerName: 'End Date', width: 150 },
        { field: 'lengthStay', headerName: 'Length Of Stay', type: 'number',width: 120 },
        { field: 'numOfPersons', headerName: 'Num Of Persons', type: 'number',width: 120 },
        { field: 'cost', headerName: 'Cost', type: 'number', width: 100},
      ];

    if (isLoading || isLoadingAddServices || isLoadingPricelist) { return <div><CircularProgress /></div> }
    return (
        <div>
            <div style={{marginLeft:"20%",marginRight:"20%",marginTop:"5%", marginBottom:"5%", borderRadius:"10px", backgroundColor:"aliceblue"}}>
                <Typography style={{marginRight:"5%", marginLeft:"5%", textAlign:"left", color: 'rgb(5, 30, 52)'}} gutterBottom variant="h6" component="div">
                {reservations.length === 0 ? (
                            <text>Active Fast Reservation</text>
       
                        ) : (
                            <text>
                                <LocalFireDepartmentIcon style={{color:"#F29F05"}}/>
                                Active Fast Reservations For {bookingEntityName}
                            </text>
                            
                    
                    )}
                    <Tooltip style={{marginLeft:"20%"}} title="Add Fast Reservation">
                        <IconButton onClick={createFastReservation}>
                            <AddCircleIcon style={{color:"#F29F05", textAlign:"right"}} fontSize="large"/>
                        </IconButton>
                    </Tooltip>
                </Typography>
                
                <div style={{marginRight:"5%", marginLeft:"5%", height: 350, width: '90%' }}>
                 
                    {reservations.length === true ? (
                            <h5 style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', marginLeft:"15%" }}>There are no fast reservations.</h5>
       
                        ) : (
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                            />
                    )}
                    
                    
                </div>
                
            </div>
            
            
        </div>
    );
}

export default ShowFastReservations;
