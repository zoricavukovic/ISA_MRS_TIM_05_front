import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Grid } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from "react";
import { getCurrentUser } from '../../service/AuthService';
import { getAllSubscribedEntities } from '../../service/BookingEntityService';
import { getAllAdventuresView, getAllAdventuresViewForOwnerId, getSearchedAdventures } from '../../service/AdventureService';
import EntityBasicCard from '../EntityBasicCard';
import SearchForReservation from '../SearchForReservation';

export default function ShowAdventures(props) {

    const [adventures, setAdventures] = useState([]);
    const [subscribedEntities, setSubscribedEntities] = useState([]);
    const [defaultAdventures, setDefaultAdventures] = useState([]);
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
                });  
                setIsLoaded(true);
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

    const getAllAdventures = () => {
        if (props.location.state !== null && props.location.state !== undefined) {
            getAllAdventuresViewForOwnerId(props.location.state.ownerId).then(res => {
                setAdventures(res.data);
                setDefaultAdventures(res.data);
                console.log(res.data);
                setSortSelected('');
            });    
        } else {
            getAllAdventuresView().then(res => {
                setAdventures(res.data);
                setDefaultAdventures(res.data);
                console.log(res.data);
                setSortSelected('');
            });    
        }
    };

    useEffect(() => {
        console.log("Nesto pretrazeno");    
        if(Object.keys(searchParams).length === 0)
            getAllAdventures();
        else{
            console.log(searchParams);
            getSearchedAdventures(searchParams).then(res=>{
                console.log(res.data);
                setAdventures(res.data);
                setDefaultAdventures(res.data);
                filterData(res.data, filterParams);
                setSortSelected('');
            })
        }
    }, [searchParams]);

    useEffect(() => {
        console.log("Nesto filtrirano");
        console.log(filterParams);
        if(Object.keys(defaultAdventures).length > 0)
            filterData(defaultAdventures, filterParams);
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
            setAdventures(data);
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
            let data = adventures;
            if(sortParam === 'name')
                data.sort((a,b)=> ascending?a.name.localeCompare(b.name):b.name.localeCompare(a.name));
            else if(sortParam === 'place')
                data.sort((a,b)=> ascending?a.place.cityName.localeCompare(b.place.cityName):b.place.cityName.localeCompare(a.place.cityName));
            else if(sortParam === 'rating')
                data.sort((a,b)=> ascending?a.averageRating-b.averageRating:b.averageRating-a.averageRating);
            else if(sortParam === 'price')
                data.sort((a,b)=> ascending?a.entityPricePerPerson - b.entityPricePerPerson:b.entityPricePerPerson - a.entityPricePerPerson);
            setAdventures(data);
        }
    }

    const [sortIcon,setSortIcon] =useState(<ArrowDropUp/>);

    return (
        <>
            <SearchForReservation setSearchParams={setSearchParams} setFilterParams={setFilterParams} type={"adventure"}></SearchForReservation>
            <hr style={{width:"100%"}}></hr>
            {adventures.length > 0 && 
                        <Box container style={{width:'40%', margin:'10px auto', display:'flex', alignItems:'center'}}>
                            <ButtonGroup variant="text" aria-label="outlined button group" size='medium' style={{margin:'0px auto', /*backgroundColor:'aliceblue'*/}}>
                                <Button name="name" variant={sortSelected==="name"?'contained':'outlined'} onClick={sortClicked}>{sortSelected === 'name' && sortIcon}Name</Button>
                                <Button name="place" variant={sortSelected==="place"?'contained':'outlined'} onClick={sortClicked}>{sortSelected === 'place' && sortIcon}Place</Button>
                                <Button name="rating" variant={sortSelected==="rating"?'contained':'outlined'} onClick={sortClicked}>{sortSelected === 'rating' && sortIcon}Rating</Button>
                                <Button name="price" variant={sortSelected==="price"?'contained':'outlined'} onClick={sortClicked}>{sortSelected === 'price' && sortIcon}Price</Button>
                            </ButtonGroup>
                        </Box>
            }
            <div style={{ margin: '1% 9% 1% 9%' }} className="App">
                <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row", justifyContent: "center" }}>
                    {adventures.length === 0 && <h3>No results found.</h3>}
                    {isLoaded && adventures.map((item, index) => (
                        <EntityBasicCard bookingEntity={item} onlyTypeForDeleteVisible={"ADVENTURES"} subscribedEntities={subscribedEntities} key={index} searchParams={searchParams}/>
                    ))}
                </div>
            </div>
        </>
    );
}
