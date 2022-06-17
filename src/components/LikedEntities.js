import { Button, Drawer, ListItemButton, ListItemIcon, ListItemText, styled, useTheme } from '@mui/material';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CottageIcon from '@mui/icons-material/Cottage';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useEffect, useState } from "react";
import { getCurrentUser } from '../service/AuthService';
import { getAllSubscribedEntities } from '../service/BookingEntityService';
import EntityBasicCard from './EntityBasicCard';

export default function LikedEntities() {

    const [subscribedEntities, setSubscribedEntities] = useState([]);
    const [defaultEntities, setDefaultEntities] = useState([]);
    const [filterParams, setFilterParams] = useState({});
    const [sortSelected, setSortSelected] = useState('');
    const [ascOrder, setAscOrder] = useState(true);
    const [entityTypeChoosen, setEntityTypeChoosen] = React.useState("ALL");
    const [open, setOpen] = React.useState(false);
    const [displayEntityType, setDisplayEntityType] = React.useState("none");
    const theme = useTheme();

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    }));

    useEffect(() => {
        getAllSubscribedEntities(getCurrentUser().id).then(res => {
            setSubscribedEntities(res.data);
            setDefaultEntities(res.data);
            console.log(res.data);
            setSortSelected('');
        });
    }, []);

    useEffect(() => {
        console.log("Nesto filtrirano");
        console.log(filterParams);
        if(Object.keys(defaultEntities).length > 0)
            filterData(defaultEntities, filterParams);
        setSortSelected('');
    }, [filterParams]);

    const filterData = (givenData, filterParams) =>{
        if(Object.keys(filterParams).length > 0){
            let data = givenData;
            console.log(data);
            data = data.filter(e => {
                let accept = true;
                if(!isNaN(filterParams.minCost) && filterParams.minCost > e.entityPricePerPerson) 
                    accept = false;
                if(!isNaN(filterParams.maxCost) && filterParams.maxCost < e.entityPricePerPerson)
                    accept = false;
                if(filterParams.rating != null && filterParams.rating != '' && e.averageRating != null && filterParams.rating > e.averageRating)
                    accept = false;
                return accept;
            });
            console.log(data);
            setSubscribedEntities(data);
        }
        
    }
    

    const filter = () =>{ 
        let watched = defaultEntities;
        console.log(entityTypeChoosen);
        if(entityTypeChoosen != "ALL")
            watched = watched.filter(e=>{ return e.entityType === entityTypeChoosen; });

        setSubscribedEntities(watched);
    }

    function onChangeEntityType(event){
        setEntityTypeChoosen(event.target.value);
    }

    function openEntityType(){
        if (displayEntityType === "none"){
            setDisplayEntityType("block");
        }else{
            setDisplayEntityType("none");
            setEntityTypeChoosen("ALL");
        }
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setSubscribedEntities(defaultEntities);
    };

    return (<>
            <div style={{ marginRight: '0px', display: "flex", justifyContent:'right' , margin: "2%", width:"100%",  backgroundColor: "aliceblue", borderRadius: "5px", minWidth:'200px' }}>
                
                
                <CssBaseline />
                <Button onClick={handleDrawerOpen}  edge="end" sx={{ ...(open && { display: 'none' }) }} label="Extra Soft" style={{color: 'rgb(5, 30, 52)', fontWeight: 'bold', borderRadius: '10px', margin: '1%',backgroundColor: 'rgb(244, 177, 77)' }}>
                    Filters
                </Button>
                <Drawer
                    sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
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
            <div style={{ margin: '1% 9% 1% 9%' }} className="App">
                <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row", justifyContent: "center" }}>
                    {subscribedEntities.length === 0 && <h3>No results found.</h3>}
                    {
                    subscribedEntities.map((item, index) => (
                        <EntityBasicCard bookingEntity={item} key={index} searchParams={null}  subscribedEntities={subscribedEntities} setSubscribedEntities={setSubscribedEntities}/>
                    ))}
                </div>
            </div>
        </>
    );
}