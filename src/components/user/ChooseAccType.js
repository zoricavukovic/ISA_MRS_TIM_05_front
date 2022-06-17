
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { getAllPlaces } from "../../service/PlaceService";
import { checkIfEmailAlreadyExist, userLoggedInAsSuperAdmin } from "../../service/UserService";
import Icon from "../../icons/icon.png";
import ShipOwner from "../../icons/shipOwner.png";
import CottageOwner from "../../icons/cottageOwner.png";
import Instructor from "../../icons/instructor.png";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';

import 'react-phone-input-2/lib/material.css'
import PhoneInput from 'react-phone-input-2'

import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import addNewAdmin from "../../service/AdminService";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import ChooseAccType from "./ChooseAccType";

export default function Registration() {

    const history = useHistory();
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    //----------------------------------------------------
    const [open, setOpen] = React.useState(true);
    
    const handleClose = () => {
        setOpen(false);
    };

    function registerFormCottageOwner(){
        registerForm("ROLE_COTTAGE_OWNER");
    }

    function registerFormShipOwner(){
        registerForm("ROLE_SHIP_OWNER");
    }

    function registerFormInstructor(){
        registerForm("ROLE_INSTRUCTOR");
    }

    function registerForm(type){
        history.push({
            pathname: "/registrationForm",
            state: { userType:  type}
        });
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            style={{ margin: '1% auto 1% auto', padding: '1%', width: '50%', borderRadius: '10px' }}
            fullWidth
            maxWidth="sm"
        >
            <Grid style={{ padding:'5%', display: "flex", flexDirection: "row", flexWrap: 'wrap' }} container alignItems="left" display="flex" flexDirection="column" justifyContent="center">
                <Avatar alt="Remy Sharp" src={Icon} />
                <Typography button gutterBottom sx={{ marginLeft: '2.5%', mt: '1%'}} style={{fontWeight:"bold", fontSize:'20px'}} color='rgb(5, 30, 52)'>
                Nature Booking Registration
                </Typography>
                <Divider />
            </Grid>
            <Grid style={{ padding:'1%', display: "flex", flexDirection: "row", flexWrap: 'wrap' }} container alignItems="left" display="flex" flexDirection="column" justifyContent="center">
                
                <Typography button gutterBottom sx={{ mt: '1%'}} style={{fontWeight:"bold", fontSize:'18px'}} color='rgb(5, 30, 52)'>
                    Choose Account Type
                </Typography>
            </Grid>
            <Grid style={{ padding:'1%', display: "flex", flexDirection: "row", flexWrap: 'wrap' }} container alignItems="left" display="flex" flexDirection="column" justifyContent="center">
                
                <Button display="block">
                <div onClick={registerFormCottageOwner} gutterBottom style={{   width:'auto',
                    backgroundColor: 'aliceblue',
                    color: 'rgb(5, 30, 52)',
                    padding:'1%',
                    border: '1px solid rgb(244, 177, 77)',
                    borderRadius: '10px',
                    height:'120px',
                    width: '120px'
                }} >
                <img src={CottageOwner}></img>
                <Typography sx={{ mt: '1%'}} style={{fontWeight:"bold", fontSize:'15px'}} color='rgb(5, 30, 52)'>
                    Cottage Owner
                </Typography>
                </div>
                </Button>
                <Button display="block">
                <div onClick={registerFormShipOwner} gutterBottom style={{   width:'auto',
                    backgroundColor: 'aliceblue',
                    color: 'rgb(5, 30, 52)',
                    padding:'1%',
                    border: '1px solid rgb(244, 177, 77)',
                    borderRadius: '10px',
                    height:'120px',
                    width: '120px'
                }} >
                <img src={ShipOwner}></img>
                <Typography sx={{ mt: '1%'}} style={{fontWeight:"bold", fontSize:'15px'}} color='rgb(5, 30, 52)'>
                    Ship Owner
                </Typography>
                </div>
                </Button>
                <Button display="block">
                <div onClick={registerFormInstructor} gutterBottom style={{   width:'auto',
                    backgroundColor: 'aliceblue',
                    color: 'rgb(5, 30, 52)',
                    padding:'1%',
                    border: '1px solid rgb(244, 177, 77)',
                    borderRadius: '10px',
                    height:'120px',
                    width: '120px'
                }} >
                <img src={Instructor}></img>
                <Typography sx={{ mt: '1%'}} style={{fontWeight:"bold", fontSize:'15px'}} color='rgb(5, 30, 52)'>
                    Instructor
                </Typography>
                </div>
                </Button>
            </Grid>
        

        </Dialog >
    );
    
}