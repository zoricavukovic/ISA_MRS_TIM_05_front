import { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Alert, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, List, Snackbar, TextareaAutosize, TextField } from '@mui/material';
import React from 'react';
import CaptainIcon from '../../icons/captainOrange.png';


import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { getUserById, userLoggedIn } from '../../service/UserService';
import { getCurrentUser } from '../../service/AuthService';
import {getCurrentLoyaltyProgram} from '../../service/LoyaltyProgramService';
import { useHistory } from 'react-router-dom';
import { AlternateEmail, DateRangeOutlined, Delete, Domain, LocationOn, Person, Phone, Public } from "@mui/icons-material";
import UserInfoGrid from "./UserInfoGrid";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

import Dialog from '@mui/material/Dialog';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LoyaltyProgramToolTip from "../loyaltyProgram/LoyaltyProgramsToolTip";
import { propsLocationStateFound } from "../forbiddenNotFound/notFoundChecker";
import { hasUserRequest, sendDeleteRequest } from "../../service/DeleteAccountRequestService";


export default function UserProfile(props) {


    const FireNav = styled(List)({
        '& .MuiListItemButton-root': {
            paddingLeft: 24,
            paddingRight: 24,
        },
        '& .MuiListItemIcon-root': {
            minWidth: 0,
            marginRight: 16,
        },
        '& .MuiSvgIcon-root': {
            fontSize: 20,
        },
    });

    const [userData, setUserData] = useState({});
    const [isLoading, setLoading] = useState(true);


    const [loyaltyProgram, setLoyaltyProgram] = useState(null);
    const [isLoadingLoyaltyProgram, setIsLoadingLoyaltyProgram] = useState(true);
    const [openDeleteRequest, setOpenDeleteRequest] = useState(false);
    const [DeleteDisabled, setDeleteDisabled] = useState(false);
    const [requestForm, setRequestForm] = useState({
        // id:null,
        reason:'',
        // processed:false,
        // accepted:false,
        // adminResponse:'',
        user:getCurrentUser(),
    })

    const history = useHistory();
    const avatar = <Avatar
        alt="Zorica Vukovic"
        src="./slika.jpeg"
        style={{ float: "left", marginLeft: '2%', marginRight: '2%' }}
        sx={{ flexGrow: 1, width: 150, height: 150 }}
        maxRows={4}
    />

    useEffect(() => {
        if (propsLocationStateFound(props, history)) {
            getUserById(props.location.state.userId).then(res => {
                setUserData(res.data);
                setLoading(false);
            });
            getCurrentLoyaltyProgram().then(res => {
                setLoyaltyProgram(res.data);
                setIsLoadingLoyaltyProgram(false);
            });
            hasUserRequest(getCurrentUser().id).then(res=>{
                setDeleteDisabled(res.data);
            })
        }
    }, []);

    const handleClose = ()=>{
        setOpenDeleteRequest(false);
    }

    const sendRequest=(event)=>{
        event.preventDefault();
        console.log(requestForm);
        sendDeleteRequest(requestForm).then(res=>{
            setDeleteDisabled(true);
            setSnackbarMessage("Succesfully send delete request.");
            setOpenSnackbar(true);
            setSnackBarType("success");
            handleClose();
        }).chach(res=>{
            setSnackbarMessage(res.data);
            setOpenSnackbar(true);
            setSnackBarType("error");
        })
    }
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackBarType, setSnackBarType] = useState("success");

    if (isLoading || isLoadingLoyaltyProgram) { return <div className="App">Loading...</div> }
    else {
        return (

            <div className="App">
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={()=>setOpenSnackbar(false)}>
                    <Alert onClose={()=>setOpenSnackbar(false)} severity={snackBarType} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
                 <Dialog open={openDeleteRequest} onClose={handleClose} sx={{minWidth:500}}>
                    <form onSubmit={sendDeleteRequest}>
                    <DialogTitle>Create Reservation Complaint</DialogTitle>
                    <DialogContent style={{overflow:'hidden'}}>
                    <Divider style={{margin:"2%"}}></Divider>
                        <Typography variant="body2" style={{backgroundColor: 'rgb(252, 234, 207)', borderRadius: '10px', paddingLeft: '1%', paddingBottom: '0.1%', paddingTop: '0.1%', margin: '1%', minWidth:'370px'}}>
                            
                            <h4 style={{color:'rgb(5, 30, 52)'}}>Reason for deleting:
                            </h4>
                            <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            // value = {()=>{if(complaint != null)return complaint.description
                            //                 return ""}}
                            name="reason"
                            onChange={e => {
                                let req = requestForm;
                                req.reason = e.target.value;
                                setRequestForm(req);
                            }}
                            style={{ width: 200 }}
                            required
                            />
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button type='button' onClick={handleClose}>Cancel</Button>
                        <Button type='submit' onClick={sendRequest}>Send Request</Button>
                    </DialogActions>
                    </form>
                </Dialog>
                <div style={{ backgroundColor: 'aliceblue', display: 'flex', margin: '10% auto', marginBottom: '20px', borderRadius: '10px', width: '55%', minHeight: '100px', padding: '2%' }} >
                    <Grid container style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Grid item xs={12} md={10} lg={8}>
                            {avatar}
                            <div><Typography
                                variant="h5"
                                component="div"
                                style={{ minWidth: '200px', minHeight: '20px' }}
                                sx={{ mr: 2, display: { xs: 'none', color: 'black', fontWeight: "bold", md: 'flex' } }}

                            >
                                {userData.firstName} {userData.lastName}
                            </Typography>
                            </div>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ mr: 2, display: { xs: 'none', color: 'black', md: 'flex' } }}

                            >
                                {userData.email}
                            </Typography>
                            <Typography
                                variant="h7"
                                noWrap
                                component="div"
                                style={{ marginTop: '10px' }}
                                sx={{ mr: 2, display: { xs: 'none', color: 'black', md: 'flex' } }}

                            >
                                {userData.userType.name.substring(userData.userType.name.indexOf('_') + 1)}
                            </Typography>
                        </Grid>
                        {userData.userType.name !== "ROLE_ADMIN" && userData.userType.name !== "ROLE_SUPER_ADMIN" ? (
                            <Grid item xs="auto">
                                <LoyaltyProgramToolTip loyaltyProgram={loyaltyProgram}/>
                                <Box sx={{ display: 'flex', float: 'right' }}>
                                    <ThemeProvider
                                        theme={createTheme({
                                            components: {
                                                MuiListItemButton: {
                                                    defaultProps: {
                                                        disableTouchRipple: true,
                                                    },
                                                },
                                            },
                                            palette: {
                                                mode: 'dark',
                                                primary: { main: 'rgb(102, 157, 246)' },
                                                background: { paper: 'rgb(5, 30, 52)' },
                                            },
                                        })}
                                    >
                                        <Paper elevation={0} sx={{ maxWidth: 290 }}>
                                            <FireNav component="nav" disablePadding aria-disabled="true">
                                                <ListItemButton component="a">
                                                    <ListItemIcon sx={{ fontSize: 20 }}>🔥 Loyalty Type</ListItemIcon>
                                                    <ListItemText
                                                        sx={{ my: 0 }}
                                                        primary={userData.loyaltyProgram}
                                                        primaryTypographyProps={{
                                                            fontSize: 20,
                                                            fontWeight: 'medium',
                                                            letterSpacing: 0,
                                                        }}
                                                    />
                                                </ListItemButton>
                                                <Divider />
                                                <ListItem component="div" disablePadding>
                                                    <ListItemButton sx={{ height: 56 }}>
                                                        <ListItemIcon sx={{ fontSize: 20 }}>
                                                            <FormatListNumberedIcon color="primary" />
                                                            Loyalty Points
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={userData.loyaltyPoints}
                                                            primaryTypographyProps={{
                                                                color: 'primary',
                                                                fontSize: 20,
                                                                fontWeight: 'medium',
                                                                variant: 'body2',
                                                            }}
                                                        />
                                                    </ListItemButton>

                                                </ListItem>
                                                <Divider />
                                                {userData.userType.name === "ROLE_CLIENT" ? (
                                                    <ListItem component="div" disablePadding>
                                                        <ListItemButton sx={{ height: 56 }}>
                                                            <ListItemIcon sx={{ fontSize: 20 }}>
                                                                <FormatListNumberedIcon color="primary" />
                                                                Penalties
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={userData.penalties}
                                                                primaryTypographyProps={{
                                                                    color: 'primary',
                                                                    fontSize: 20,
                                                                    fontWeight: 'medium',
                                                                    variant: 'body2',
                                                                }}
                                                            />
                                                        </ListItemButton>

                                                    </ListItem>
                                                ) : (
                                                    <>
                                                        {(userData.userType.name === "ROLE_SHIP_OWNER" && userData.captain == true) ? (
                                                            <ListItem component="div" disablePadding>
                                                                <ListItemButton sx={{ height: 56 }}>
                                                                    <img src={CaptainIcon}></img>

                                                                    <ListItemText
                                                                        primary={" Captain"}
                                                                        primaryTypographyProps={{
                                                                            color: 'primary',
                                                                            fontSize: 20,
                                                                            fontWeight: 'medium',
                                                                            variant: 'body2',
                                                                        }}
                                                                    />
                                                                </ListItemButton>

                                                            </ListItem>
                                                        ) : (
                                                            <div></div>
                                                        )}
                                                    </>)}
                                            </FireNav>
                                        </Paper>
                                    </ThemeProvider>
                                </Box>
                            </Grid>
                        ) : (<div></div>)}
                    </Grid>
                </div>
                <div style={{ margin: '0px auto', width: '30%' }}>
                    <UserInfoGrid userData={userData} />
                    <div style={{width:'100%', margin:'10px 0px'}}>
                        <Button disabled={DeleteDisabled} style={{backgroundColor:'rgb(244, 177, 77)', color:'rgb(5, 30, 52)', position:'relative', width:'200px', margin:'0px -100px', left:'50%', foreground:''}} variant="contained" startIcon={<Delete></Delete>} onClick={()=>setOpenDeleteRequest(true)}>Delete Account</Button>
                    </div>
                </div>

            </div>

        );
    }
}