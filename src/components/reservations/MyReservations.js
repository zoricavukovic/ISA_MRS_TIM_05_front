import * as React from 'react';
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import Button from '@mui/material/Button';
import { styled, useTheme } from "@mui/material/styles";
import { getReservationsByClientId } from '../../service/ReservationService.js';
import ReactPaginate from "react-paginate";
import CssBaseline from '@mui/material/CssBaseline';
import CottageIcon from '@mui/icons-material/Cottage';
import "../../App.css"
import { useHistory } from 'react-router-dom';
import { getCurrentUser } from '../../service/AuthService.js';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReservationCardForClient from './ReservationCardForClient.js';

const drawerWidth = 240;
  
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

export default function MyReservations() {
    const history = useHistory();
    const theme = useTheme();
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [finishedReservations, setFinishedReservations] = useState([]);
    const [unFinishedReservations, setUnFinishedReservations] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [entityTypeChoosen, setEntityTypeChoosen] = React.useState("ALL");
    const [statusChoosen, setStatusChoosen] = React.useState("ALL");
    const [options, setOptions] = React.useState([]);
    const oneDay = 60 * 60 * 24 * 1000;

    const [displayFilterName, setFilterName] = React.useState("none");

    function openAutocomplete(){
        if (displayFilterName === "none"){
            setFilterName("block");
        }else{
            setFilterName("none");
        }
    }
    
    function onChangeValueTime(event) {
        setStatusChoosen(event.target.value);
    }

    function onChangeEntityType(event){
        setEntityTypeChoosen(event.target.value);
    }

    const [displayFilterTime, setFilterTime] = React.useState("none");
    const [displayEntityType, setDisplayEntityType] = React.useState("none");

    function openTime(){
        if (displayFilterTime === "none"){
            setFilterTime("block");
        }else{
            setFilterTime("none");
            setStatusChoosen('ALL');
        }
        
    }

    function openEntityType(){
        if (displayEntityType === "none"){
            setDisplayEntityType("block");
        }else{
            setDisplayEntityType("none");
            setEntityTypeChoosen("ALL");
        }
    }


    useEffect(() => {
        
        if (getCurrentUser() === null || getCurrentUser() === undefined){
            history.push('/login');
        }
        
        
        getReservationsByClientId(getCurrentUser().id).then(result => {
            let allRes = result.data.sort((a,b)=>new Date(b.startDate) - new Date(a.startDate));
            console.log(allRes);
            setReservations(allRes);
            setFilteredReservations(allRes);
            
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
            setLoading(false);
            setOptions(newOpts);
        })
    }, []);


    const filter = () =>{ 
        if (getCurrentUser() === null || getCurrentUser() === undefined){
            history.push('/forbiddenPage');
        }
        let res = reservations;
        if(statusChoosen != "ALL")
             res = res.filter(e=>{
                if(statusChoosen === "STARTED")
                    return new Date(e.startDate).getTime() <= new Date().getTime() && new Date().getTime() < new Date(new Date(e.startDate).getTime()+oneDay*e.numOfDays);
                else if(statusChoosen === "NOT_STARTED")
                    return new Date(e.startDate).getTime() > new Date().getTime() && new Date().getTime();
                else
                    return new Date().getTime() > new Date(new Date(e.startDate).getTime()+oneDay*e.numOfDays);
            });
        console.log(entityTypeChoosen);
        if(entityTypeChoosen != "ALL")
            res = res.filter(e=>{ return e.bookingEntity.entityType === entityTypeChoosen; });

        setFilteredReservations(res);
    }

    const displayReservations = 
        filteredReservations.length > 0 ? 
        filteredReservations.map(res=> {
                        console.log(res);
                        return <ReservationCardForClient reservation={res} reservationId={res.id} details="true"></ReservationCardForClient>
                        
            }): (<h1>No reservations</h1>)

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setFilteredReservations(reservations);
    };

    if (isLoading) { return <div><CircularProgress /></div> }
    return (
        <div>
            <div style={{ marginRight: '0px', display: "flex", justifyContent:'right' , margin: "2%", width:"100%",  backgroundColor: "aliceblue", borderRadius: "5px", minWidth:'200px' }}>
                
                
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
                    <ListItem key={"time"} disablePadding onClick={openTime}>
                        <ListItemButton>
                            <ListItemIcon>
                                <AccessTimeIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Status"} />
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
                        </table>
                        
                    </ListItem>
                    <ListItem key={"time"} disablePadding onClick={openEntityType}>
                        <ListItemButton>
                            <ListItemIcon>
                                <CottageIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Entity type"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"combo"} disablePadding>
                        <table onChange={onChangeEntityType}
                            style={{display:displayEntityType, marginLeft:"7%", marginTop:"1%", minWidth:'200px', color: 'rgb(5, 30, 52)'}}>
                            <tr>
                                <td><input type="radio" value="COTTAGE" name="type" />Cottage</td>
                            </tr>
                            <tr>
                                <td><input type="radio" value="SHIP" name="type" />Ship</td>
                            </tr>
                            <tr>
                                <td><input type="radio" value="ADVENTURE" name="type" />Adventure</td>
                            </tr>
                        </table>
                        
                    </ListItem>
                    <Divider />
                    <Button onClick={filter}>FILTER</Button>
                    </List>
                </Drawer>
            </div>
            <div style={{ display: "flex", flexWrap: 'wrap', margin:'0px auto', flexDirection: "row", justifyContent: "center", flex:"3" , width:'80%'}} className="App">
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
        </div>
    );
}
