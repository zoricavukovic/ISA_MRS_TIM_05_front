
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { getAllPlaces } from "../../service/PlaceService";
import { checkIfEmailAlreadyExist, userLoggedInAsSuperAdmin } from "../../service/UserService";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';

import 'react-phone-input-2/lib/material.css'
import PhoneInput from 'react-phone-input-2'

import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {addNewAdmin} from "../../service/AdminService";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


export default function AddAdmin() {

    const history = useHistory();
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();


    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");


    const [hiddenEmailAlreadyExistError, setHiddenEmailAlreadyExistError] = useState("none");

    //----------------password-----------------------/
    const newPassword = useRef({});
    newPassword.current = watch("newPassword", "");

    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    //------------------------------------------

    const [phoneValue, setphoneValue] = useState();
    const [hiddenErrorPhone, setHiddenErrorPhone] = useState("none");

    //----------------------------------------------------
    const [open, setOpen] = React.useState(true);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        history.push('/allRequestsCardsForAdmin');
    };
    //----------------------------------------------------------------
    const [places, setPlaces] = React.useState([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState('');
    const [isLoadingPlaces, setLoadingPlaces] = useState(true);
    const [hiddenErrorPlace, setHiddenErrorPlace] = useState("none");
    let allPlacesList;

    const placeOnChange = (event, newValue) => {
        if (newValue != null && newValue != undefined && newValue != '') {
            setSelectedPlaceId(newValue.id);
        } else {
            setSelectedPlaceId('');
        }
    }

    const getAllPlacesForTheList = () => {
        let newArray = [];
        for (let place of places) {
            newArray.push({ 'label': place.cityName + ',' + place.zipCode + ',' + place.stateName, 'id': place.id });
        }
        allPlacesList = newArray;
    }
    //-------------------------------------------------------------------



    const checkPlaceSelected = () => {
        if (selectedPlaceId !== null && selectedPlaceId !== undefined && selectedPlaceId !== '') {
            setHiddenErrorPlace("none");
            return true;
        } else {
            setHiddenErrorPlace("block");
            return false;
        }
    }

    const checkPhoneSelected = () => {
        if (phoneValue !== null && phoneValue !== undefined && phoneValue !== '') {
            setHiddenErrorPhone("none");
            return true;
        } else {
            setHiddenErrorPhone("block");
            return false;
        }
    }

    const emailAddressAlreadyExist = (email) => {
        checkIfEmailAlreadyExist(email)
            .then(res => {
                setHiddenEmailAlreadyExistError("none");
                return false;
            })
            .catch(err => {
                setHiddenEmailAlreadyExistError("block");
                return true;
            })
    }

    const onFormSubmit = data => {
        if (!checkPlaceSelected() || !checkPhoneSelected() || emailAddressAlreadyExist(data.email))
            return;

        let newAdmin = {
            email: data.email,
            name: data.name,
            surname: data.surname,
            phoneNumber: phoneValue,
            address: data.address,
            placeId: selectedPlaceId,
            password: data.newPassword,
            passwordChanged: false
        }
        addNewAdmin(newAdmin)
            .then(res => {
                setTypeAlert("success");
                setAlertMessage(res.data);
                setOpenAlert(true);
            })
            .catch(err => {
                setTypeAlert("error");
                setAlertMessage(err.response.data);
                setOpenAlert(true);
            });
    }


    useEffect(() => {
        if (userLoggedInAsSuperAdmin(history)) {
            getAllPlaces()
                .then(res => {
                    setPlaces(res.data);
                    setLoadingPlaces(false);
                })
        }

    }, []);

    if (isLoadingPlaces) {
        return <div className="App">Loading...</div>
    }
    else {
        { getAllPlacesForTheList() }
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                style={{ margin: '1% auto 1% auto', padding: '1%', width: '100%', borderRadius: '10px' }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add new Admin</DialogTitle>
                <Divider />
                <br />
                <DialogContent>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit(onFormSubmit)}
                        style={{ width: '100%' }}
                    >
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
                                    style={{ width: '300px' }}
                                    {...register("name", {
                                        required: "Please specify name",
                                        maxLength: {
                                            value: 50,
                                            message: "Name field cant be longer than 50 characters"
                                        }
                                    })}
                                />
                            </Grid>
                            {errors.name && <p style={{ color: '#ED6663' }}>{errors.name.message}</p>}
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    name="surname"
                                    id="surname"
                                    label="Surname"
                                    placeholder="Surname"
                                    style={{ width: '300px' }}
                                    {...register("surname", {
                                        required: "Please specify surname",
                                        maxLength: {
                                            value: 50,
                                            message: "Surname field cant be longer than 50 characters"
                                        }
                                    })}
                                />
                            </Grid>
                            {errors.surname && <p style={{ color: '#ED6663' }}>{errors.surname.message}</p>}
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    name="email"
                                    id="email"
                                    label="Email"
                                    placeholder="Email"
                                    style={{ width: '300px' }}
                                    {...register("email", {
                                        required: "Please specify an email",
                                        maxLength: {
                                            value: 50,
                                            message: "Email field cant be longer than 50 characters"
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                                            message: "Invalid email address"
                                        }
                                    })
                                    }
                                />
                            </Grid>
                            {errors.email && <p style={{ color: '#ED6663' }}>{errors.email.message}</p>}
                            <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenEmailAlreadyExistError }}>This email is already taken.</p>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    name="address"
                                    id="address"
                                    label="Address"
                                    placeholder="Address"
                                    style={{ width: '300px' }}
                                    {...register("address", {
                                        required: "Please specify an address",
                                        maxLength: {
                                            value: 50,
                                            message: "Address field cant be longer than 100 characters"
                                        }
                                    })}
                                />
                            </Grid>
                            {errors.address && <p style={{ color: '#ED6663' }}>{errors.address.message}</p>}
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
                            <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenErrorPlace }}>Please check place.</p>
                            <Grid item xs={12} sm={12}>
                                <PhoneInput
                                    country={'rs'}
                                    value={phoneValue}
                                    onChange={setphoneValue}
                                    inputProps={{
                                        name: 'phone',
                                        required: true,
                                    }}
                                />
                            </Grid>
                            <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenErrorPhone }}>Please enter phone number.</p>
                            <Grid item xs={12} sm={12}>
                                <FormControl sx={{ m: 1, width: '250px' }} variant="standard">
                                    <InputLabel>Type password</InputLabel>
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder="Type password"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowNewPassword}
                                                >
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        {...register("newPassword", {
                                            required: "You must specify a password",
                                            minLength: {
                                                value: 8,
                                                message: "Password must have at least 8 characters"
                                            }
                                        })}
                                    />
                                </FormControl>
                            </Grid>
                            {errors.newPassword && <p style={{ color: '#ED6663' }}>{errors.newPassword.message}</p>}

                            <Grid item xs={12} sm={12}>
                                <FormControl sx={{ m: 1, width: '250px' }} variant="standard">
                                    <InputLabel>Retype new password</InputLabel>
                                    <Input
                                        id="retypedPassword"
                                        name="retypedPassword"
                                        type="password"
                                        placeholder="Retype password"
                                        {...register("retypedPassword", {
                                            validate: value =>
                                                value === newPassword.current || "The passwords do not match"
                                        })}
                                    />
                                </FormControl>
                            </Grid>
                            {errors.retypedPassword && <p style={{ color: '#ED6663' }}>{errors.retypedPassword.message}</p>}
                        </Grid>
                        <br />


                        <Box style={{ display: "flex", flexDirection: "row" }}>
                            <Button type="submit" onSubmit={handleSubmit(onFormSubmit)} variant="contained" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '33.5%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '2%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}
                                onClick={handleClose}
                            >
                                Close
                            </Button>

                        </Box>
                        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={typeAlert} sx={{ width: '100%' }}>
                                {alertMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </DialogContent>

            </Dialog >
        );
    }
}