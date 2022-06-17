import React, {useEffect, useState} from 'react';
import {createTheme, styled, ThemeProvider} from "@mui/material/styles";
import {Alert, Autocomplete, CircularProgress, FormControl, Grid, InputAdornment, InputLabel, List, NativeSelect, Snackbar, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from "date-fns";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import {useHistory} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { editUserById, getAllUsers, getUserById } from '../../service/UserService';
import { getAllPlaces, getPlaceById } from '../../service/PlaceService';
import { userLoggedIn } from '../../service/UserService';
import { getCurrentUser } from '../../service/AuthService';
import CaptainIcon from '../../icons/captainOrange.png';
import Checkbox from '@mui/material/Checkbox';
import { DateRangeOutlined, Domain, Person, Phone, Place } from '@mui/icons-material';
import { Calendar } from 'react-date-range';
import LoyaltyProgramToolTip from "../loyaltyProgram/LoyaltyProgramsToolTip";
import {getCurrentLoyaltyProgram} from '../../service/LoyaltyProgramService';

function EditUserProfile(props) {


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
    const [changedUserData, setChangedUserData] = useState({});
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [isLoading2, setLoading2] = useState(true);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [allPlacesList,setAllPlacesList] = useState([]);
    const [openDate,setOpenDate] = useState(false);
    const [dateOfBirth,setDateOfBirth] = useState(new Date());
    const history = useHistory();
    const [checked, setChecked] = React.useState();
    const [loyaltyProgram, setLoyaltyProgram] = useState(null);
    const [isLoadingLoyaltyProgram, setIsLoadingLoyaltyProgram] = useState(true);
  

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    
    const avatar = <Avatar
        alt="Zorica Vukovic"
        src="./slika.jpeg"
        style={{ float: "left", marginLeft: '2%', marginRight: '2%' }}
        sx={{ flexGrow: 1, width: 150, height: 150 }}
        maxRows={4}
    />

    useEffect(() => {
        if (userLoggedIn(history)) {
            getUserById(getCurrentUser().id).then(res => {
                setUserData(res.data);
                setDateOfBirth(new Date(res.data.dateOfBirth));
                setChangedUserData(res.data);
                setLoading(false);
                if (res.data.userType.name === "ROLE_SHIP_OWNER"){
                    console.log(res.data.captain);
                    setChecked(res.data.captain);
                }
            });
            getCurrentLoyaltyProgram().then(res => {
                setLoyaltyProgram(res.data);
                setIsLoadingLoyaltyProgram(false);
            });
            
            getAllPlaces().then(results =>{
                setPlaces(results.data);
                setLoading2(false);
            });
        }
    }, []);

    useEffect(() => {
        console.log("USER DATA");
        console.log(userData);
        if(Object.keys(userData).length !== 0){
            setSelectedPlaceId(userData.place.id);
            setSelectedPlace({ 'label': userData.place.cityName + ',' + userData.place.zipCode + ',' + userData.place.stateName, 'id': userData.place.id });
        }
    }, [userData]);

    const [open, setOpen] = React.useState(false);

    const showNotification = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };

    const saveChanges = (event) => {
        event.preventDefault();
        let changedData = changedUserData;
        changedData.dateOfBirth = dateOfBirth;
        changedData.place.id = selectedPlaceId;
        setChangedUserData(changedData);
        console.log("CHanged user data:",changedData);
        editUserById(getCurrentUser().id, changedData).then(res=>{
            console.log("Uspesno!!");
            console.log(res.data);
            showNotification();
        }).catch(res=>{
            console.log("Greska!!");
        })
    };

    const reset = (event)=>{
        setState( { key: Date.now() } );
        setDateOfBirth(new Date(userData.dateOfBirth));
    }

    const makeChange = (event)=>{
        var value = event.target.value;
        if(event.target.name === "dateOfBirth"){
            let year = parseInt(value.split(',')[0]);
            let month = parseInt(value.split(',')[1]);
            let day = parseInt(value.split(',')[2]);
            value = [year,month,day];
        }
        setChangedUserData(prevState => ({
            ...prevState,
            [event.target.name]: value
        }));
    }

    useEffect(() => {
        getAllPlacesForTheList();
    },[places])

    const handleDatePick = (date) =>{
        console.log("Usao u picker");
        date.setHours(12);
        setDateOfBirth(date); 
        setOpenDate(false);
      }

    const placeOnChange = (event, newValue) => {
        event.preventDefault();
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
        setAllPlacesList(newArray);
      }

    const SubmitButton = <ListItemButton button type="submit" component="button"  style={{backgroundColor:"rgb(244,177,77)",color:"white",textAlign:"center", borderRadius: 7}}>
        <ListItemText
            sx={{ my: 0 }}
            primary="Save Changes"
            primaryTypographyProps={{
                fontSize: 20,
                fontWeight: 'medium',
                letterSpacing: 0,
            }}
        />
    </ListItemButton>

    const [state,setState] = useState({
        key : Date.now()
    });


    if (isLoading || isLoading2 || isLoadingLoyaltyProgram) { return <div className="App"><CircularProgress /></div> }
    return (

        <div className="App" key={state.key}>

            <div style={{ backgroundColor: 'aliceblue',display:'flex',  margin: '10% auto', marginBottom:'20px', borderRadius: '10px',width:'55%', minHeight: '100px', padding:'2%' }} >
                <Grid container style={{justifyContent:'center', alignItems:'center'}}>
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
                            style={{marginTop:'10px'}}
                            sx={{ mr: 2, display: { xs: 'none', color: 'black', md: 'flex'} }}

                        >
                            {userData.userType.name.substring(userData.userType.name.indexOf('_')+1)}
                        </Typography>
                    </Grid>
                
                {userData.userType.name !== "ROLE_ADMIN" && userData.userType.name !== "ROLE_SUPER_ADMIN"? (
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
                                        <>
                                        {(userData.userType.name === "ROLE_SHIP_OWNER")? (
                                            <ListItem component="div" disablePadding>
                                               <img style={{marginLeft:'8%'}} src={CaptainIcon}></img>
                                                <ListItemText
                                                    primary={" Captain"}
                                                    primaryTypographyProps={{
                                                        color: 'primary',
                                                        fontSize: 20,
                                                        fontWeight: 'medium',
                                                        variant: 'body2',
                                                    }}
                                                />
                                                 <Checkbox
                                                    checked={checked}
                                                    onChange={handleChange}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                    
                                                />

                                        </ListItem>
                                       ):(
                                           <div></div>
                                       )}
                                       </>
                                    </FireNav>
                                </Paper>
                            </ThemeProvider>
                        </Box>
                    </Grid>
                ) : (<div></div>)}
                </Grid>
            </div>
            <div style={{margin:'0px auto', width:'30%'}}>
            <form onSubmit={saveChanges}>
                <Grid container spacing={2} style={{backgroundColor: 'aliceblue', margin:'0px auto' , borderRadius: '10px' ,justifyContent:"center" ,alignItems:"center", paddingBottom:'30px'}} >
                        <Grid item xs={12} style={{margin:'0px 10%'}}>
                            <h3 style={{ margin:'0px'}}>Personal informations:</h3>
                        </Grid>
                        <Grid item xs="auto">
                            <TextField
                                id="outlined-read-only-input"
                                label="First Name"
                                defaultValue={userData.firstName}
                                name="firstName"
                                onChange={makeChange}
                                InputProps={{
                                    readOnly: false,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                        )
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs="auto">
                            <TextField
                                id="outlined-read-only-input"
                                label="Last Name"
                                defaultValue={userData.lastName}
                                name="lastName"
                                onChange={makeChange}
                                InputProps={{
                                    readOnly: false,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                        )
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs="auto">
                            <TextField
                                id="outlined-read-only-input"
                                label="Phone Number"
                                defaultValue={userData.phoneNumber}
                                name="phoneNumber"
                                onChange={makeChange}
                                InputProps={{
                                    readOnly: false,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone />
                                        </InputAdornment>
                                        )
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs="auto">
                            <><TextField style={{/*margin:'10px 10px'*/ }} onClick={()=>setOpenDate(!openDate)} label='Date of birth' placeholder={`${format(dateOfBirth, "dd.MM.yyyy.")}`} 
                                value={`${format(dateOfBirth, "dd.MM.yyyy.")}`}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <DateRangeOutlined />
                                        </InputAdornment>
                                    )
                                    }}
                                    />
                                    {openDate && <div style={{
                                            position:"absolute",
                                            zIndex:99999,
                                            backgroundColor:"white",
                                            border:"1px solid rgb(5, 30, 52)"
                                        }}
                                        
                                        >
                                        <Calendar
                                            editableDateInputs={true}
                                            date={dateOfBirth}
                                            onChange={handleDatePick}
                                        />
                                        </div>
                                    }
                            </>
                        </Grid>
                        <Grid item xs={11} zeroMinWidth>
                            <Autocomplete
                                disablePortal
                                id="place"
                                options={allPlacesList}
                                defaultValue={selectedPlace}
                                onChange={placeOnChange}
                                renderInput={(params) => <TextField {...params} label="Place" 
                                                            placeholder="Where are you going?"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Place />
                                                                </InputAdornment>
                                                                )
                                                            }}
                                                        />}
                                required
                                isOptionEqualToValue={(option, value) => option.label === value.label}
                            />
                        </Grid>
                        <Grid item xs={11} style={{justifyContent:'center', alignItems:'center'}}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Address"
                                defaultValue={userData.address}
                                name="address"
                                onChange={makeChange}
                                style={{width:'100%'}}
                                InputProps={{
                                    readOnly: false,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Domain />
                                        </InputAdornment>
                                        )
                                }}
                            />
                        </Grid>
                        <Grid item xs="auto">
                            <Paper elevation={0} sx={{ maxWidth: 290 }}>
                                <FireNav component="nav" disablePadding>
                                    {SubmitButton}
                                    <Divider />
                                    <Divider />
                                </FireNav>
                            </Paper>
                        </Grid>
                        <Grid item xs="auto">
                            <Paper elevation={0} sx={{marginLeft:10, maxWidth: 290 }}>
                                <FireNav component="nav" disablePadding>
                                    <ListItemButton component="a" type='button' onClick={reset} style={{backgroundColor:"rgb(5, 30, 52)",color:"white",textAlign:"center", borderRadius: 7}}>
                                        <ListItemText
                                            sx={{ my: 0 }}
                                            primary="Reset"
                                            primaryTypographyProps={{
                                                fontSize: 20,
                                                fontWeight: 'medium',
                                                letterSpacing: 0,
                                            }}
                                        />
                                    </ListItemButton>
                                    <Divider />
                                    <Divider />
                                </FireNav>
                            </Paper>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Profile edited successfuly!
                </Alert>
            </Snackbar>
        </div>

    );
}

export default EditUserProfile;
