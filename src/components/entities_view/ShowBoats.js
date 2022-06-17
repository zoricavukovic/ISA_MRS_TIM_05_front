import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Grid } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from "react";
import { getCurrentUser } from '../../service/AuthService';
import { getAllSubscribedEntities } from '../../service/BookingEntityService';
import { getAllShipsView, getSearchedShips } from '../../service/ShipService';
import { getAllShipsViewForOwnerId } from '../../service/ShipService';
import EntityBasicCard from '../EntityBasicCard';
import SearchForReservation from '../SearchForReservation';

export default function ShowBoats(props) {

    const [ships, setShips] = useState([]);
    const [subscribedEntities, setSubscribedEntities] = useState([]);
    const [defaultShips, setDefaultShips] = useState([]);
    const [searchParams, setSearchParams] = useState({});
    const [filterParams, setFilterParams] = useState({});
    const [sortSelected, setSortSelected] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [ascOrder, setAscOrder] = useState(true);

    useEffect(() => {
        if (getCurrentUser() !== null && getCurrentUser() !== undefined) {
            if (getCurrentUser().userType.name === "ROLE_CLIENT") {
                getAllSubscribedEntities(getCurrentUser().id).then(res => {
                    setSubscribedEntities(res.data);
                    setIsLoaded(true);
                });    
            }
            else 
                setIsLoaded(true);
        }
        else 
            setIsLoaded(true);
        
    }, []);

    useEffect(() => {
        if(subscribedEntities.length > 0)
            setIsLoaded(true);
    }, [subscribedEntities]);

    const getAllShips = () => {
        if (props.location.state !== null && props.location.state !== undefined) {
            getAllShipsViewForOwnerId(props.location.state.ownerId).then(res => {
                setShips(res.data);
                setDefaultShips(res.data);
                console.log(res.data);
                setSortSelected('');
            });    
        } 
        else {
            getAllShipsView().then(res => {
                setShips(res.data);
                setDefaultShips(res.data);
                console.log(res.data);
                setSortSelected('');
            });
        } 
    };


    useEffect(() => {
        console.log("Nesto pretrazeno");    
        if(Object.keys(searchParams).length === 0)
            getAllShips();
        else{
            console.log(searchParams);
            getSearchedShips(searchParams).then(res=>{
                console.log(res.data);
                setShips(res.data);
                setDefaultShips(res.data);
                filterData(res.data, filterParams);
                setSortSelected('');
            })
        }
    }, [searchParams]);


    useEffect(() => {
        console.log("Nesto filtrirano");
        console.log(filterParams);
        if(Object.keys(defaultShips).length > 0)
            filterData(defaultShips, filterParams);
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
            setShips(data);
        }
    }


    const sortClicked = (event) =>{
        console.log("Sort Clicked");
        let asc = ascOrder;
        if(sortSelected === event.target.name){
            asc = !ascOrder;
            setAscOrder(asc);
            setSortIcon(asc?<ArrowDropUp/>:<ArrowDropDown/>);
        }
        else{
            setSortSelected(event.target.name);
            setAscOrder(true);
            asc = true;
            setSortIcon(<ArrowDropUp/>)
        }
        sortData(event.target.name, asc);
    }

    const sortData = (sortParam, ascending) =>{
        if(sortSelected){
            console.log("Sort data");
            let data = ships;
            if(sortParam === 'name')
                data.sort((a,b)=> ascending?a.name.localeCompare(b.name):b.name.localeCompare(a.name));
            else if(sortParam === 'place')
                data.sort((a,b)=> ascending?a.place.cityName.localeCompare(b.place.cityName):b.place.cityName.localeCompare(a.place.cityName));
            else if(sortParam === 'rating')
                data.sort((a,b)=> ascending?a.averageRating-b.averageRating:b.averageRating-a.averageRating);
            else if(sortParam === 'price')
                data.sort((a,b)=> ascending?a.entityPricePerPerson - b.entityPricePerPerson:b.entityPricePerPerson - a.entityPricePerPerson);
            setShips(data);
        }
    }

    const [sortIcon,setSortIcon] =useState(<ArrowDropUp/>);

    return (
        <>
            <SearchForReservation setSearchParams={setSearchParams} setFilterParams={setFilterParams} type="ship"></SearchForReservation>
            <hr style={{width:"100%"}}></hr>
            {ships.length > 0 && 
                        <Box container style={{width:'40%', margin:'10px auto', display:'flex', alignItems:'center'}}>
                            <ButtonGroup variant="outlined" aria-label="outlined button group" size='medium' style={{margin:'0px auto'}}>
                                <Button name="name" variant={sortSelected==="name"?'contained':'outlined'} onClick={sortClicked}>{sortSelected === 'name' && sortIcon}Name</Button>
                                <Button name="place" variant={sortSelected==="place"?'contained':'outlined'} onClick={sortClicked}>{sortSelected === 'place' && sortIcon}Place</Button>
                                <Button name="rating" variant={sortSelected==="rating"?'contained':'outlined'} onClick={sortClicked}>{sortSelected === 'rating' && sortIcon}Rating</Button>
                                <Button name="price" variant={sortSelected==="price"?'contained':'outlined'} onClick={sortClicked}>{sortSelected === 'price' && sortIcon}Price</Button>
                            </ButtonGroup>
                        </Box>
            }
            <div style={{ margin: '1% 9% 1% 9%' }} className="App">
                <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row", justifyContent: "center" }}>
                    {ships.length === 0 && <h3>No results found.</h3>}
                    {isLoaded && ships.map((item, index) => (
                        <EntityBasicCard onlyTypeForDeleteVisible={"SHIPS"} bookingEntity={item} key={index} subscribedEntities={subscribedEntities}  searchParams={searchParams}  />
                    ))}
                </div>
            </div>
        </>
    );
}
