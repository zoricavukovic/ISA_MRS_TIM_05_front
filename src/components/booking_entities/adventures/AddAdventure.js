import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import AddingAdditionalService from "../common/AddingAdditionalService.js";
import AddingRulesOfConduct from "../common/AddingRulesOfConduct.js";
import AddingEquipment from "../common/AddingEquipment.js";
import { useForm } from "react-hook-form";
import { Divider } from "@mui/material";
import ImageUploader from "../../image_uploader/ImageUploader.js";
import { useHistory } from "react-router-dom";
import { getAllPlaces } from "../../../service/PlaceService.js";
import { addNewAdventure } from "../../../service/AdventureService.js";
import { getCurrentUser } from '../../../service/AuthService.js';
import { userLoggedInAsInstructor } from "../../../service/UserService.js";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { MAX_NUMBER_OF_IMAGES_TO_UPLOAD, _fillImageListFromBase64Images, _getImagesInJsonBase64 } from "../common/images_utils.js";
import { _getAdditionalServicesJson, _handleAddAdditionalServiceChip, _setInitialAdditionalServices } from "../common/additional_services_utils.js";
import { _getFishingEquipmentNamesJson, _handleAddFishingEquipmentChip, _setInitialFishingEquipment } from "../common/fishiing_equipment_utils.js";
import { _getRuleNamesJson, _handleAddRuleChip, _setInitialRulesOfConduct } from "../common/rules_of_conduct_utils.js";

export default function AddAdventure() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isLoading, setLoading] = useState(true);
    const history = useHistory();
    const [message, setMessage] = useState("");
  
    /////////////////////error message////////////////////
    const [open, setOpen] = React.useState(false);
    const handleClose = (_event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };
  
    const handleClick = () => {
      setOpen(true);
    };

    //-------------------------------------------------------------------------------------
    const [images, setImages] = React.useState([]);

    const onChange = (imageList, addUpdateIndex) => {
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };
    //-------------------------------------------------------------------------------------
    const [additionalServices, setAdditionalServices] = React.useState([
    ]);

    const handleDeleteAdditionalServiceChip = (chipToDelete) => {
        setAdditionalServices((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

    const handleAddAdditionalServiceChip = (data) => {
        _handleAddAdditionalServiceChip(data, additionalServices, setAdditionalServices);
    }
    //-------------------------------------------------------------------------------------
    const [fishingEquipment, setFishingEquipment] = React.useState([
    ]);

    const handleDeleteFishingEquipmentChip = (chipToDelete) => {
        console.log(chipToDelete);
        setFishingEquipment((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

    const handleAddFishingEquipmentChip = (data) => {
        _handleAddFishingEquipmentChip(data, fishingEquipment, setFishingEquipment);
    }
    //-------------------------------------------------------------------------------------
    const [checked, setChecked] = React.useState(false);
    const [rulesOfConduct, setRulesOfConduct] = React.useState([]);
    const handleRuleCheckedChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleDeleteRuleChip = (chipToDelete) => {
        setRulesOfConduct((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

    const handleAddRuleChip = (data) => {
        _handleAddRuleChip(data, rulesOfConduct, setRulesOfConduct, checked);
    }
    //-------------------------------------------------------------------------------------
    const [places, setPlaces] = React.useState([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState('');
    const [hiddenError, setHiddenError] = useState("none");
    let allPlacesList;

    const placeOnChange = (event, newValue) => {
        if (newValue != null && newValue != undefined && newValue != '') {
            setSelectedPlaceId(newValue.id);
        } else {
            setSelectedPlaceId('');
        }
    }
    //------------------------------------------------------------------------------------



    const onFormSubmit = data => {
        if (selectedPlaceId != null && selectedPlaceId != undefined && selectedPlaceId != '') {
            setHiddenError("none");
        } else {
            setHiddenError("block");
            return;
        }
        const newAdventure = {
            instructorId: getCurrentUser().id,
            name: data.name,
            address: data.address,
            placeId: selectedPlaceId,
            costPerPerson: data.costPerPerson,
            maxNumOfPersons: data.maxNumOfPersons,
            promoDescription: data.promoDescription,
            shortBio: data.shortBio,
            entityCancelationRate: data.entityCancelationRate,
            additionalServices: _getAdditionalServicesJson(additionalServices),
            fishingEquipment: _getFishingEquipmentNamesJson(fishingEquipment),
            rulesOfConduct: _getRuleNamesJson(rulesOfConduct),
            images: _getImagesInJsonBase64(images),
        }
        console.log(newAdventure);
        addNewAdventure(newAdventure)
            .then(res => {
                history.push({
                    pathname: "./showAdventureProfile",
                    state: { bookingEntityId: res.data }
                });
            })
            .catch(res => {
              
                console.log(res.response.data);
                setMessage(res.response.data);
                handleClick();
                return;
            });


    }
    useEffect(() => {
        if (userLoggedInAsInstructor(history)) {
            getAllPlaces()
                .then(res => {
                    setPlaces(res.data);
                    setLoading(false);
                })
        }
    }, [])


    const getAllPlacesForTheList = () => {
        let newArray = [];
        for (let place of places) {
            newArray.push({ 'label': place.cityName + ',' + place.zipCode + ',' + place.stateName, 'id': place.id });
        }
        allPlacesList = newArray;
    }

    if (isLoading) {
        return <div className="App">Loading...</div>
    }
    return (
        <div style={{ backgroundColor: 'aliceblue', margin: '1% 9% 1% 9%', padding: '1%', borderRadius: '10px', height: '100%' }} >
            {getAllPlacesForTheList()}
            <div style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '42%', padding: '1%', borderRadius: '10px', width: '15%' }} >
                New adventure
            </div>
            <br />
            <Divider />
            <br />
            <ImageUploader images={images} maxNumber={MAX_NUMBER_OF_IMAGES_TO_UPLOAD} onChange={onChange} />
            <br />


            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onFormSubmit)}
            >
                <h4 style={{ color: 'rgb(5, 30, 52)', textAlign: 'center', fontWeight: 'bold' }}>Basic Information About Adventure</h4>

                <Grid
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    container
                    spacing={2}
                >
                    <Grid item xs={12} sm={12}>
                        <TextField
                            name="name"
                            id="name"
                            label="Name"
                            placeholder="Name"
                            multiline
                            size="small"
                            style={{ width: '300px' }}
                            {...register("name", { required: true, maxLength: 50 })}
                        />
                    </Grid>
                    {errors.name && <p style={{ color: '#ED6663' }}>Please check the adventure name</p>}
                    <Grid item xs={12} sm={12}>
                        <TextField
                            name="address"
                            id="address"
                            label="Address"
                            placeholder="Address"
                            multiline
                            size="small"
                            style={{ width: '300px' }}
                            {...register("address", { required: true, maxLength: 50 })}
                        />
                    </Grid>
                    {errors.address && <p style={{ color: '#ED6663' }}>Please check the address name</p>}
                    <Grid item xs={12} sm={12}>
                        <Autocomplete
                            disablePortal
                            id="place"
                            options={allPlacesList}
                            sx={{ width: '300px' }}
                            onChange={placeOnChange}
                            renderInput={(params) => <TextField {...params} label="Place" />}
                        />
                    </Grid>
                    <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenError }}>Please check place.</p>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            name="costPerPerson"
                            id="costPerPerson"
                            type="number"
                            label="Cost Per Person €"
                            placeholder="Cost Per Person €"
                            style={{ width: '300px' }}
                            {...register("costPerPerson", { required: true, min: 1, max: 100000 })}
                        />
                    </Grid>
                    {errors.costPerPerson && <p style={{ color: '#ED6663' }}>Please check cost per person</p>}
                    <Grid item xs={12} sm={12}>
                        <TextField
                            type="number"
                            name="maxNumOfPersons"
                            label="Max Num Of Persons"
                            placeholder="Max No. Of Persons"
                            style={{ width: '300px' }}
                            {...register(
                                "maxNumOfPersons",
                                { required: true, min: 1, max: 10000 },
                            )}
                        />
                    </Grid>
                    {errors.maxNumOfPersons && <p style={{ color: '#ED6663' }}>Enter num between 1 and 1000</p>}
                    <Grid item xs={12} sm={12}>
                        <TextField
                            name="promoDescription"
                            size="small"
                            id="promoDescription"
                            label="Promo Description"
                            multiline
                            rows={3}
                            {...register("promoDescription", { maxLength: 250 })}
                            placeholder="Promo Description"
                            style={{ width: '300px' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            name="shortBio"
                            size="small"
                            id="shortBio"
                            label="Short Bio"
                            multiline
                            rows={3}
                            {...register("shortBio", { maxLength: 250 })}
                            placeholder="Short Bio"
                            style={{ width: '300px' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            type="number"
                            name="entityCancelationRate"
                            label="Entity Cancelation Rate %"
                            placeholder="Entity Cancelation Rate %"
                            style={{ width: '300px' }}
                            {...register("entityCancelationRate", { required: true, min: 0, max: 100 })}
                        />
                    </Grid>
                    {errors.entityCancelationRate && <p style={{ color: '#ED6663' }}>Enter number between 0 and 100</p>}

                </Grid>
                <br />


                <Box style={{ display: "flex", flexDirection: "row" }}>
                    <AddingAdditionalService data={additionalServices} onDeleteChip={handleDeleteAdditionalServiceChip} onSubmit={handleAddAdditionalServiceChip} float="left" />
                    <AddingEquipment data={fishingEquipment} onDeleteChip={handleDeleteFishingEquipmentChip} onSubmit={handleAddFishingEquipmentChip} float="left" />
                    <AddingRulesOfConduct data={rulesOfConduct} onDeleteChip={handleDeleteRuleChip} onSubmit={handleAddRuleChip} ruleChecked={checked} handleRuleCheckedChange={handleRuleCheckedChange} float="left" />
                </Box>

                <Box style={{ display: "flex", flexDirection: "row" }}>
                    <Button type="submit" onSubmit={handleSubmit(onFormSubmit)} variant="contained" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '33.5%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '2%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}
                        onClick={() => {
                            reset(
                                {
                                    name: "",
                                    address: "",
                                    maxNumOfPersons: 0,
                                    entityCancelationRate: 0,
                                    shortBio: "",
                                    promoDescription: "",
                                    costPerPerson: 0,
                                }, {
                                keepDefaultValues: false,
                                keepErrors: true,
                            }
                            );
                        }}
                    >
                        Reset
                    </Button>
                </Box>


            </Box >
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div >
    );
}