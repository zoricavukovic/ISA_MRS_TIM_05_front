import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm } from "react-hook-form";

import { getAllPlaces } from "../service/PlaceService.js";
import { getAllBookingEntitiesByOwnerId } from "../service/BookingEntityService.js";
import { getAllSearchedEntitiesBySimpleCriteria } from "../service/BookingEntityService.js";
import { getCurrentUser } from "../service/AuthService.js";
import EntityBasicCard from "./EntityBasicCard.js";
import { ControlledRating } from "./Rating.js";
import { useHistory } from "react-router-dom";


export default function ShowAllEntitiesForOwner() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [places, setPlaces] = React.useState([]);
    const [isLoadingPlace, setLoadingPlace] = useState(true);
    const [isLoadingEntites, setLoadingEntities] = useState(true);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const history = useHistory();
    const [entities, setEntities] = useState(null);


    ///////////////RATING//////////////////////
    const [value, setValue] = React.useState('');
    const [hover, setHover] = React.useState(-1);
    const onChangeFn = (event, newValue) => {
        setValue(newValue);
    }
    const onChangeActiveFn = (event, newHover) => {
        setHover(newHover);
    }
    /////////////////////////////////////


    //////////////////////PLACES//////////
    let allPlacesList;
    const placeOnChange = (event, newValue) => {
        console.log(newValue);
        if (newValue != null && newValue != undefined && newValue != '') {
            setSelectedPlaceId(newValue.id);
        } else {
            setSelectedPlaceId(null);
        }
    }
    const getAllPlacesForTheList = () => {
        let newArray = [];
        for (let place of places) {
            newArray.push({ 'label': place.cityName + ',' + place.zipCode + ',' + place.stateName, 'id': place.id });
        }
        allPlacesList = newArray;
    }
    ////////////////////////////////////////

    useEffect(() => {
        if (getCurrentUser() === null || getCurrentUser() === undefined) {
            history.push('/login');
        }
        else {
            getAllBookingEntitiesByOwnerId(getCurrentUser().id)
                .then(res => {
                    setEntities(res.data);
                    setLoadingEntities(false);
                });
            getAllPlaces()
                .then(res => {
                    setPlaces(res.data);
                    setLoadingPlace(false);
                })
        }
    }, [])

    const resetFn = data => {
        getAllBookingEntitiesByOwnerId(getCurrentUser().id)
        .then(res => {
            setEntities(res.data);
        });
    }

    const onSearch = data => {
        let searchCriteria = {
            "ownerId": getCurrentUser().id,
            "name": data.name,
            "address": data.address,
            "placeId": selectedPlaceId,
            "minCostPerPerson": data.minCostPerPerson,
            "maxCostPerPerson": data.maxCostPerPerson,
            "minRating": value,
        };
        console.log("search critearia");
        console.log(searchCriteria);
        let minCost = data.minCostPerPerson;
        let maxCost = data.maxCostPerPerson;
        if (minCost !== "" && maxCost !== "") {
            minCost = parseInt(minCost);
            maxCost = parseInt(maxCost);
            if (minCost > maxCost) {
                alert("Min cost should be less then max cost per person");
                return
            }
        }

        getAllSearchedEntitiesBySimpleCriteria(searchCriteria)
            .then(res => {
                setEntities(res.data);
            }).catch(res => {
                alert("Error happend on server while searching.");
            });
    }

    if (isLoadingPlace || isLoadingEntites) {
        return <div className="App">Loading...</div>
    }
    return (
        <div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", padding: "3", flexDirection: "row", margin: "20px auto", width: "60%", alignItems: "stretch", backgroundColor: "aliceblue", borderRadius: "5px" }}>
                {getAllPlacesForTheList()}
                <TextField
                    name="name"
                    id="name"
                    label="Name"
                    placeholder="Name"
                    size="small"
                    style={{ width: '200px' }}
                    {...register("name", { maxLength: 50 })}
                />
                {errors.name && <p style={{ color: '#ED6663', fontSize: '11px' }}>Please check the name. Max 50 chars</p>}
                <TextField
                    name="address"
                    id="address"
                    label="Address"
                    placeholder="Address"
                    size="small"
                    style={{ width: '200px' }}
                    {...register("address", { maxLength: 50 })}
                />
                {errors.address && <p style={{ color: '#ED6663', fontSize: '11px' }}>Please check the address. Max 50 chars</p>}
                <Autocomplete
                    disablePortal
                    id="place"
                    size="small"
                    options={allPlacesList}
                    sx={{ width: '200px' }}
                    onChange={placeOnChange}
                    renderInput={(params) => <TextField {...params} label="Place" />}
                />
                <TextField
                    name="minCostPerPerson"
                    id="minCostPerPerson"
                    type="number"
                    size="small"
                    label="Min Cost Per Person €"
                    placeholder="Min Cost Per Person €"
                    style={{ width: '200px' }}
                    {...register("minCostPerPerson", { min: 1, max: 100000 })}
                />
                {errors.minCostPerPerson && <p style={{ fontSize: '11px', color: '#ED6663' }}>Min cost per person is num between 1 and 100000</p>}
                <TextField
                    name="maxCostPerPerson"
                    id="maxCostPerPerson"
                    type="number"
                    size="small"
                    label="Max Cost Per Person €"
                    placeholder="Max Cost Per Person €"
                    style={{ width: '200px' }}
                    {...register("maxCostPerPerson", { min: 1, max: 100000 })}
                />
                {errors.maxCostPerPerson && <p style={{ color: '#ED6663', fontSize: '11px' }}>Max cost per person is num between 1 and 100000</p>}
                <ControlledRating value={value} hover={hover} onChange={onChangeFn} onChangeActive={onChangeActiveFn} />
                <Button onClick={handleSubmit(onSearch)} label="Extra Soft" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', borderRadius: '10px', margin: '1%', backgroundColor: 'rgb(244, 177, 77)' }}>
                    Search
                </Button>
                <Button onClick={handleSubmit(resetFn)} label="Extra Soft" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', borderRadius: '10px', margin: '1%', backgroundColor: 'rgb(244, 177, 77)' }}>
                    Reset
                </Button>
            </div>
            <div style={{ textAlign: 'center' }}>
                {entities.length === 1 ?(<p>1 result found.</p>):(<p>{entities.length} results found.</p>)}
            </div>
            <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row", justifyContent: "center" }}>
                {entities.map((item, index) => (
                    <EntityBasicCard bookingEntity={item} key={index} />
                ))}
            </div>
        </div>

    );
}