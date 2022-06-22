import React, {useEffect, useState, useRef} from 'react';
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
import { createUser } from '../../service/UserService';
import { getAllPlaces } from '../../service/PlaceService';
import { userLoggedIn } from '../../service/UserService';
import CaptainIcon from '../../icons/captainOrange.png';
import Checkbox from '@mui/material/Checkbox';
import { DateRangeOutlined, Domain, Person, Phone, Place } from '@mui/icons-material';
import { Calendar } from 'react-date-range';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from "react-hook-form";
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { propsLocationStateFound } from "../forbiddenNotFound/notFoundChecker";


function RegistrationForm(props) {


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
    const [changedUserData, setChangedUserData] = useState({
        "firstName":"",
        "lastName": "",
        "dateOfBirth":null,
        "place":{
            "id":0
        },
        "password":"",
        "address":"",
        "email":"",
        "userTypeValue": null,
        "id": 1,
        "retypedPassword":"",
        "captain": false,
        "reason": ""
        });
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
    

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const [reasonText, setReason] = React.useState("");
    const handleChangeR = (event) => {
      console.log(event.target.value);
      setReason(event.target.value);
    };
    
    useEffect(() => {  
        getAllPlaces().then(results =>{
                setPlaces(results.data);
                setSelectedPlaceId(results.data[0].id);
                setLoading2(false);
        })
        
        
    }, []);

            //setSelectedPlaceId(userData.place.id);
            //setSelectedPlace({ 'label': userData.place.cityName + ',' + userData.place.zipCode + ',' + userData.place.stateName, 'id': userData.place.id });
        

    const [open, setOpen] = React.useState(false);

    

    const [openDialog, setOpenDialog] = React.useState(true);
 
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const [message, setMessage] = React.useState("");
    const handleClick = () => {
        setOpen(true);
    };

    const [type, setType] = React.useState("success");

    const [hiddenErrorPhone, setHiddenErrorPhone] = useState("none");
    const [hiddenErrorRetype, setHiddenErrorRetype] = useState("none");
    
    const saveChanges = (event) => {
        console.log(reasonText);
        event.preventDefault();
        let changedData = changedUserData;
        changedData.dateOfBirth = dateOfBirth;
        changedData.place.id = selectedPlaceId;
        changedData.reason = reasonText;
        if ((changedData.phoneNumber).match(/^[0-9]+$/) == null|| changedData.phoneNumber.length < 7 || changedData.phoneNumber.length > 10){
            setHiddenErrorPhone("block");
            return;
        }
        setHiddenErrorPhone("none");
        console.log(retypedPassword);
        if (newPassword.current !== retypedPassword.current || newPassword.current.length < 8){
            setHiddenErrorRetype("block");
            return;
        }
        setHiddenErrorRetype("none");
        changedData.password = newPassword.current;
        changedData.userTypeValue = history.location.state.userType;
        changedData.captain = checked;
        setChangedUserData(changedData);
        
        createUser(changedData).then(res=>{
            setType("success");
            if (history.location.state.userType === "ROLE_CLIENT"){
                setMessage("Successfuly created user! Check your email for activation.");
            }else{
                setMessage("Successfuly created user! Wait for administrator to allow account.");
            }
            handleClick();
            history.push("/login");

        }).catch(res=>{
            console.log(res);
            setType("error");
            setMessage(res.response.data);
            handleClick();
            return;
        })
    };

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



    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    //----------------password-----------------------/
    const newPassword = useRef({});
    const retypedPassword = useRef({});
    newPassword.current = watch("newPassword", "");
    retypedPassword.current = watch("retypedPassword", "");

    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    //------------------------------------------

    const SubmitButton = <ListItemButton button type="submit" component="button"  style={{marginLeft:'22%', backgroundColor:"rgb(244,177,77)",color:"white",textAlign:"center", borderRadius: 7}}>
        <ListItemText
            sx={{ my: 0 }}
            primary="Register"
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


    if (isLoading2) { return <div className="App"><CircularProgress /></div> }
    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            style={{ margin: '1% auto 1% auto', padding: '1%', width: '50%', borderRadius: '10px' }}
            fullWidth
            maxWidth="sm"
        >
            
            <div className="App" key={state.key} style={{backgroundColor: 'aliceblue'}}>
            <Grid style={{ padding:'5%', display: "flex", flexDirection: "row", flexWrap: 'wrap' }} container alignItems="left" display="flex" flexDirection="column" justifyContent="center">
              
                <Typography sx={{ marginLeft: '2.5%', mt: '1%'}} style={{fontWeight:"bold", fontSize:'20px'}} color='rgb(5, 30, 52)'>
                Registration Form
                </Typography>
                <Divider />
               
            </Grid>
                <div style={{margin:'0px auto', width:'80%'}}>
                <form onSubmit={saveChanges}>
                    <Grid container spacing={2} style={{backgroundColor: 'aliceblue', margin:'0px auto' , borderRadius: '10px' ,justifyContent:"center" ,alignItems:"center", paddingBottom:'30px'}} >
                                <table>
                                    <tr>
                                        <TextField
                                            id="outlined-read-only-input"
                                            label="First Name"
                                            placeholder="First Name"
                                            name="firstName"
                                            onChange={makeChange}
                                            style={{margin:"2%"}}
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
                                    </tr>
                                    <tr>
                                        <TextField
                                            id="outlined-read-only-input"
                                            label="Last Name"
                                            style={{margin:"2%"}}
                                            placeholder="Last Name"
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
                                    </tr>
                                    <tr>
                                        <TextField
                                            id="outlined-read-only-input"
                                            label="Email"
                                            name="email"
                                            style={{margin:"2%"}}
                                            placeholder="Email"
                                            onChange={makeChange}
                                            InputProps={{
                                                readOnly: false,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon />
                                                    </InputAdornment>
                                                    )
                                            }}
                                            required
                                        />
                                    </tr>
                                    <tr>
                                        <TextField
                                            id="outlined-read-only-input"
                                            label="Phone Number"
                                            name="phoneNumber"
                                            style={{margin:"2%"}}
                                            placeholder="Phone Number"
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
                                    </tr>
                                    <tr>
                                        <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenErrorPhone }}>Please check valid phone number. (length 7-10)</p>
                                    </tr>
                                    <tr>
                                        <TextField onClick={()=>setOpenDate(!openDate)} label='Date of birth' placeholder={`${format(dateOfBirth, "dd.MM.yyyy.")}`} 
                                            value={`${format(dateOfBirth, "dd.MM.yyyy.")}`}
                                            style={{margin:"2%"}}
                                            //placeholder="Date Of Birth"
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
                                    </tr>

                                    <tr>
                                        <TextField
                                            required
                                            id="outlined-required"
                                            label="Address"
                                            name="address"
                                            placeholder="Address"
                                            onChange={makeChange}
                                            style={{margin:"2%"}}
                                            InputProps={{
                                                readOnly: false,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Domain />
                                                    </InputAdornment>
                                                    )
                                            }}
                                        />
                                    </tr>
                                    <tr>
                                        <Autocomplete
                                            disablePortal
                                            id="place"
                                            options={allPlacesList}
                                            style={{margin:"2%", marginRight:'15%'}}
                                            onChange={placeOnChange}
                                            renderInput={(params) => <TextField {...params} label="Place" 
                                                                        placeholder="Place"
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
                                    </tr>
                                    <tr>
                                        {(history.location.state.userType === "ROLE_SHIP_OWNER")? (
                                            <table>
                                                <tr>
                                                    <td>
                                                        <img style={{marginLeft:'10%'}} src={CaptainIcon}></img>
                                                    </td>
                                                    <td>
                                                        <ListItemText
                                                            primary={" Captain"}
                                                            primaryTypographyProps={{
                                                                color: 'primary',
                                                                fontSize: 20,
                                                                fontWeight: 'medium',
                                                                variant: 'body2',
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Checkbox
                                                            onChange={handleChange}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            
                                                        />
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            ):(
                                            <div></div>
                                        )}
                                    </tr>
                                    <tr>
                                        {history.location.state.userType !== "ROLE_CLIENT" ? (
                                            <table>
                                                <tr>
                                                    <td>
                                                        <TextField
                                                            id="outlined-multiline-flexible"
                                                            label="Reason For Creating Profile"
                                                            multiline
                                                            maxRows={4}
                                                            style={{margin:"2%", width:'111%'}}
                                                            value={reasonText}
                                                            onChange={handleChangeR}
                                                        />
                                                    </td>
                                                    
                                                </tr>
                                            </table>
                                        ):(<></>)}
                                    </tr>
                                    <tr>
                                        {errors.reason && <p style={{ color: '#ED6663' }}>Max length of reason is 250 chars.</p>}
                                    </tr>
                                    <tr>
                                        <TextField
                                            required
                                            id="outlined-required"
                                            label="Type password"
                                            placeholder="Type password"
                                            type={showNewPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            onChange={makeChange}
                                            style={{margin:'2%', marginRight:'15%'}}
                                            InputProps={{
                                                readOnly: false,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <KeyIcon />
                                                    </InputAdornment>
                                                    ),
                                                    endAdornment:(
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowNewPassword}
                                                            >
                                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                            }}
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
                                    </tr>
                                    <tr>
                                        {errors.newPassword && <p style={{ color: '#ED6663' }}>{errors.newPassword.message}</p>}
                                    </tr>
                                    <tr>
                                        <TextField
                                            required
                                            type="password"
                                            id="outlined-required"
                                            label="Retype password"
                                            placeholder="Retype password"
                                            name="retypedPassword"
                                            onChange={makeChange}
                                            style={{margin:'2%'}}
                                            InputProps={{
                                                readOnly: false,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <KeyIcon />
                                                    </InputAdornment>
                                                    )
                                            }}
                                        
                                            {...register("retypedPassword", {
                                                validate: value =>
                                                    value === newPassword.current || "The passwords do not match."
                                            })}
                                        />
                                    </tr>
                                    <tr>
                                        <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenErrorRetype }}>The passwords do not match.</p>
                                    </tr>
                                    <tr>
                                    <FireNav component="nav" disablePadding>
                                        {SubmitButton}
                                    </FireNav>
                                    </tr>
                                </table>
                           
                        
                        
                        </Grid>

                    </form>
                </div>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            </div>
        </Dialog>

    );
}

export default RegistrationForm;
