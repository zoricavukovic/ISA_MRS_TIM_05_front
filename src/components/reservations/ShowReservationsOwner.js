import * as React from 'react';
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import ReservationBasicCard from "./ReservationBasicCard.js";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, useTheme } from "@mui/material/styles";
import { getReservationsByOwnerId, getReservationsByOwnerIdAndFilter } from '../../service/ReservationService.js';
import ReactPaginate from "react-paginate";
import CssBaseline from '@mui/material/CssBaseline';
import CottageIcon from '@mui/icons-material/Cottage';
import "../../App.css"
import { useHistory } from 'react-router-dom';
import { getCurrentUser } from '../../service/AuthService.js';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const drawerWidth = 240;
  
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

function ShowReservationsOwner() {
    const history = useHistory();
    const theme = useTheme();
    const [reservations, setReservations] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [nameChoosen, setNameChoosen] = React.useState("ALL");
    const [timeChoosen, setTimeChoosen] = React.useState("ALL");
    const [options, setOptions] = React.useState([]);

    const [displayFilterName, setFilterName] = React.useState("none");

    function openAutocomplete(){
        if (displayFilterName === "none"){
            setFilterName("block");
        }else{
            setFilterName("none");
        }
        
    }
    function onChangeValueName(event) {
       setNameChoosen(event.target.value);
    };
    
    function onChangeValueTime(event) {
        setTimeChoosen(event.target.value);
    }

    const [displayFilterTime, setFilterTime] = React.useState("none");

    function openTime(){
        if (displayFilterTime === "none"){
            setFilterTime("block");
        }else{
            setFilterTime("none");
        }
        
    }
    useEffect(() => {
        
        if (getCurrentUser() === null || getCurrentUser() === undefined){
            history.push('/login');
        }
        
        let type = "";
        if (getCurrentUser().userType.name === "ROLE_COTTAGE_OWNER"){
            type = "COTTAGE";
        }
        else if (getCurrentUser().userType.name === "ROLE_SHIP_OWNER"){
            type = "SHIP";
        }
        else if (getCurrentUser().userType.name === "ROLE_INSTRUCTOR"){
            type = "ADVENTURE";
        }
        getReservationsByOwnerId(getCurrentUser().id, type).then(result => {
          
            let newOpts = [];
            for (let res of result.data){
                let found = false;
                for (let added of newOpts){
                    if (added === res.bookingEntity.name){
                        found = true;
                        break;
                    }
                }
                if (found === false) {newOpts.push(res.bookingEntity.name);}
            }
            setReservations(result.data.sort((a,b)=>new Date(b.startDate) - new Date(a.startDate)));
            setLoading(false);
            setOptions(newOpts);
        })
    }, []);
    const filter = () =>{ 
        if (getCurrentUser() === null || getCurrentUser() === undefined){
            history.push('/forbiddenPage');
        }
        setLoading(true);
        let type = "";
        if (getCurrentUser().userType.name === "ROLE_COTTAGE_OWNER"){
            type = "COTTAGE";
        }
        else if (getCurrentUser().userType.name === "ROLE_SHIP_OWNER"){
            type = "SHIP";
        }
        else if (getCurrentUser().userType.name === "ROLE_INSTRUCTOR"){
            type = "ADVENTURE";
        }
        getReservationsByOwnerIdAndFilter(getCurrentUser().id, nameChoosen, timeChoosen, type).then(res => {
            let allRes = res.data.sort((a,b)=>new Date(b.startDate) - new Date(a.startDate));
            setReservations(allRes);
            setNameChoosen("ALL");
            setTimeChoosen("ALL");
            setLoading(false);
        })
    }

    
    const displayReservations = 
        reservations.length > 0 ? 
        reservations.map(res=> {
            return <ReservationBasicCard reservation={res} reservationId={res.id} details="true"></ReservationBasicCard>
        }) : (<h1>No reservation history.</h1>)

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    if (isLoading) { return <div><CircularProgress /></div> }
    return (
        <div>
            <div style={{display: "flex", justifyContent:'right' , margin: "2%", width:"100%",  backgroundColor: "aliceblue", borderRadius: "5px", minWidth:'200px' }}>
                
                
                <CssBaseline />
                <Button onClick={handleDrawerOpen}  edge="end" sx={{ ...(open && { display: 'none' }) }} label="Extra Soft" style={{color: 'rgb(5, 30, 52)', fontWeight: 'bold', borderRadius: '10px', margin: '1%',backgroundColor: 'rgb(244, 177, 77)' }}>
                    Filters
                </Button>
                <Drawer
                    sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={open}
                >
                    <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                    <ListItem key={"EntityName"} disablePadding>
                        <ListItemButton onClick={openAutocomplete}>
                            <ListItemIcon>
                                <CottageIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Entity name"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"combo"} disablePadding>
                        <table onChange={onChangeValueName}
                            style={{display:displayFilterName, marginLeft:"7%", marginTop:"1%", minWidth:'200px', color: 'rgb(5, 30, 52)'}}>
                            {options.map((item) => (
                                <tr>
                                    <td><input type="radio" value={item} name="name" /> {item}</td>
                                </tr>
                            ))}
                        </table>
                    
                    </ListItem>
                    <ListItem key={"time"} disablePadding onClick={openTime}>
                        <ListItemButton>
                            <ListItemIcon>
                                <AccessTimeIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Timeline"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"combo"} disablePadding>
                        <table onChange={onChangeValueTime}
                            style={{display:displayFilterTime, marginLeft:"7%", marginTop:"1%", minWidth:'200px', color: 'rgb(5, 30, 52)'}}>
                            <tr>
                                <td><input type="radio" value="FINISHED" name="time" />Finished</td>
                            </tr>
                            <tr>
                                <td><input type="radio" value="STARTED" name="time" />Started</td>
                            </tr>
                            <tr>
                                <td><input type="radio" value="NOT_STARTED" name="time" />Not started</td>
                            </tr>
                            <tr>
                                <td><input type="radio" value="CANCELED" name="time" />Canceled</td>
                            </tr>
                        </table>
                        
                    </ListItem>
                    <Divider />
                    <Button onClick={filter}>FILTER</Button>
                    </List>
                </Drawer>

            </div>
            <div style={{ margin: "3%", display: "flex", flexWrap: 'wrap', flexDirection: "row", justifyContent: "center", flex:"3" }} className="App">
                {displayReservations}
                {/* <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previosBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            /> */}
            </div>
            <div style={{ margin: '1% 9% 1% 9%' }} className="App">
                <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row", justifyContent: "center" }}>
                    {reservations.length === 0 && <h3>Reservation history is empty.</h3>}
                    
                </div>
            </div>
        </div>
    );
}

export default ShowReservationsOwner;
