import React, { useEffect, useState } from "react";
import Home from "../../map/GoogleMap";
import Box from "@mui/material/Box";
import { useHistory } from "react-router-dom";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import RatingEntity from "../../Rating";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { getAdventureById } from "../../../service/AdventureService";
import { checkIfCanEditEntityById } from "../../../service/BookingEntityService";
import { getPricelistByEntityId } from "../../../service/PricelistService";
import Chip from '@mui/material/Chip';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { propsLocationStateFound } from "../../forbiddenNotFound/notFoundChecker";
import RenderImageSlider from "../../image_slider/RenderImageSlider.js";
import { getCurrentUser } from "../../../service/AuthService";
import { findAllClientsWithActiveReservations, getAvailableFastReservationsByBookingEntityId, reserveFastReservation } from "../../../service/ReservationService";
import { getRatingsByEntityId } from "../../../service/RatingService";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, Tooltip } from "@mui/material";
import { DateRangeOutlined, Favorite, FavoriteBorder } from "@mui/icons-material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import StyledAvatar from "../../StyledAvatar";
import { subscribeClientWithEntity, unsubscribeClientWithEntity } from "../../../service/UserService";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Approved from "../../../icons/approval.png";
import NotApproved from "../../../icons/notApprowed.png"
import CreateReservationForClient from '../../reservations/CreateReservationForClient';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function AdventureAdditionalInfo(props) {
    return (
        <CardContent>
            <Box sx={{ width: '100%', maxWidth: 350, bgcolor: 'background.paper' }}>
                <Box sx={{ my: 2, mx: 3 }}>
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography gutterBottom variant="h5" component="div" style={{ color: 'rgb(5, 30, 52)', marginLeft: '2.5%' }}>
                                {props.header}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Divider variant="middle" />
                <Box sx={{ m: 2, ml: 2.5 }}>
                    <Stack sx={{
                        mb: 2,
                        pb: 1,
                        display: 'grid',
                        gap: 1,
                        gridTemplateRows: 'repeat(2, 1fr)',
                    }} direction="column" spacing={1}>
                        {props.additionalData}
                    </Stack>
                </Box>
            </Box>
        </CardContent>
    )
}


function RenderRulesOfConduct(props) {
    return (
        props.rulesOfConduct.map((page) => (
            <Button disabled style={{ borderRadius: '10px', backgroundColor: 'rgb(252, 234, 207)', color: 'black' }} key={page.ruleName}>
                <table>
                        <tr>
                        <th><Typography textAlign="left">{page.ruleName}</Typography></th>
                            <th>
                            
                                {page.allowed == true ? (
                                    <img style={{height:'70%', width:'70%'}} src={Approved}></img>):(
                                    <img style={{height:'70%', width:'70%'}} src={NotApproved}></img>  
                                )}
                            </th>
                            
                        </tr>
                    </table>
            </Button>
        ))
    )
}
function RenderAdditionalServices(props) {
    return (
        props.additionalServices.map((service) => (
            <Button style={{ borderRadius: '10px', backgroundColor: 'rgb(252, 234, 207)', color: 'black' }} key={service.name}>
                <Typography textAlign="center">{service.serviceName + "    " + service.price + " €"}</Typography>
            </Button>
        ))
    )
}
function RenderFishingEquipment(props) {
    return (
        props.fishingEquipment.map((e) => (
            <Button style={{ borderRadius: '10px', backgroundColor: 'rgb(252, 234, 207)', color: 'black' }} key={e.equipmentName}>
                <Typography textAlign="center">{e.equipmentName}</Typography>
            </Button>
        ))
    )
}

function AdventureActions(props) {

    const [openDialogCreate, setOpenDialogCreate] = React.useState(false);


    const editAdventure = (event) => {
        event.preventDefault();
        checkIfCanEditEntityById(props.adventureId)
            .then(res => {
                props.history.push({
                    pathname: "/editAdventure",
                    state: { bookingEntityId: props.adventureId }
                });
            })
            .catch(res => {
                props.setMessage(res.response.data);
                props.handleClick();
                return;
            });
    };

    const showCalendarForEntity = (event) => {
        event.preventDefault();
        getAdventureById(props.adventureId).then(res => {
            props.history.push({
                pathname: "/calendarForEntity",
                state: { bookingEntityId: props.adventureId }
            })
        }).catch(res => {
            props.setMessage(res.response.data);
            props.handleClick();
            return;
        });
        
    }
    const showFastReservations = (event) => {
        event.preventDefault();
        getAdventureById(props.adventureId).then(res => {
            props.history.push({
                pathname: "/addFastReservation",
                state: { bookingEntityId: props.adventureId } 
            })
        }).catch(res => {
            props.setMessage(res.response.data);
            props.handleClick();
            return;
        });
    };

    const createReservationForClient = (event) => {
        event.preventDefault();
        findAllClientsWithActiveReservations(props.adventureId).then(res => {
            if (res.data.length !== 0){
                setOpenDialogCreate(true);
            }
            else{
                props.setMessage("Don't have clients with active reservations.");
                props.handleClick();
            }
        });
    }

    return (
        <CardActions disableSpacing>
            <CreateReservationForClient bookingEntityId={props.adventureId} openDialog={openDialogCreate}/>
            <IconButton onClick={showCalendarForEntity}>
                <Chip icon={<CalendarMonthIcon />} label="Calendar" />
            </IconButton>

            <IconButton value="module" aria-label="module" onClick={editAdventure}>
                <Chip icon={<EditIcon />} label="Edit Adventure" />
            </IconButton>
            <IconButton value="module" aria-label="module" onClick={showFastReservations}>
                <Chip icon={<LocalFireDepartmentIcon />} label="Create Action" />
            </IconButton>
            <IconButton value="module" aria-label="module" onClick={createReservationForClient}>
                <Chip icon={<EventAvailableIcon />} label="Create Reservation For Client" />
            </IconButton>
            <ExpandMore
                expand={props.expanded}
                onClick={props.handleExpandClick}
                aria-expanded={props.expanded}
                label="Show more information"
                aria-label="show more"
            >
                <ExpandMoreIcon />
            </ExpandMore>
        </CardActions>
    )
}



export default function AdventureProfile(props) {

    const [expanded, setExpanded] = React.useState(false);

    const [pricelistData, setPricelistData] = useState({});
    const [adventureData, setAdventureData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [isLoadingPricelist, setLoadingPricelist] = useState(true);
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [hasAuthority, setHasAuthority] = useState(false);
    const [fastReservations, setFastReservations] = useState([]);
    const [clientReviews, setClientReviews] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [selectedFastReservation, setSelectedFastReservation] = useState({});
    const [typeAlert, setTypeAlert] = useState("success");
    let adventureId;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const FastReserve = (fastReservation)=> {
        getAdventureById(adventureData.id).then(res => {
            console.log(fastReservation);
            setSelectedFastReservation(fastReservation);
            setOpenDialog(true);
        }).catch(res => {
            handleClick();
            setMessage(res.response.data);
            setTypeAlert("error");
            return;

        })
        
    }

    const confirmReservation = ()=>{
        getAdventureById(adventureData.id).then(res => {
            console.log(getCurrentUser());
            selectedFastReservation.client = getCurrentUser();
            reserveFastReservation(selectedFastReservation).then(res=>{
                console.log("Adding temp res success");
                console.log(res.data);
                setOpenDialog(false);
                let fRes = fastReservations;
                fRes = fRes.filter(elem => elem.id != selectedFastReservation.id);
                console.log(fRes);
                setFastReservations(fRes);
                setTypeAlert("success");
                handleClick();
                setMessage("Successfully reserved entity.");
            }).catch(res=>{
                console.log("Adding temp res failed");
                handleClick();
                setTypeAlert("error");
                setMessage(res.response.data);
            });
        }).catch(res => {
            handleClick();
            setTypeAlert("error");
            setMessage(res.response.data);
            return;

        })
        
    } 

    const reserveBookingEntity = () => {
        getAdventureById(adventureData.id).then(res => {
            console.log("Evo me");
            console.log(props.searchParams);
            history.push({
            pathname: "/newReservation",
            state: {
                bookingEntityId: props.location.state.bookingEntityId,
                searchParams: {}
            }
        })
        }).catch(res => {
            handleClick();
            setTypeAlert("error");
            setMessage(res.response.data);
            return;

        })
        
    }

    const subscribe =()=>{
        getAdventureById(adventureData.id).then(res => {
            subscribeClientWithEntity(getCurrentUser().id, adventureData.id).then(res=>{
                console.log("Uspesno sub");
                console.log(res.data);
                if(typeof(props.setSubscribedEntities) !== "undefined" )
                    props.setSubscribedEntities(res.data);
                else
                    setIsSubscribed(true);
            });
        }).catch(res => {
            handleClick();
            setTypeAlert("error");
            setMessage(res.response.data);
            return;

        })
        
        
    }

    const unsubscribe =()=>{
        getAdventureById(adventureData.id).then(res => {
            unsubscribeClientWithEntity(getCurrentUser().id, adventureData.id).then(res=>{
                console.log("Uspesno unsub");
                console.log(res.data);
                if(typeof(props.setSubscribedEntities) !== "undefined" )
                    props.setSubscribedEntities(res.data);
                else
                setIsSubscribed(false);
            });
        }).catch(res => {
            handleClick();
            setTypeAlert("error");
            setMessage(res.response.data);
            return;

        })
       
    }


    useEffect(() => {
        setIsSubscribed(props.location.state.subscribed);

        if (propsLocationStateFound(props, history)) {
            console.log(props.location.state.rating);
            getAdventureById(props.location.state.bookingEntityId).then(res => {
                setAdventureData(res.data);
                if(res.data.instructor.id == getCurrentUser().id)
                    setHasAuthority(true);
                setLoading(false);
            }).catch(res => {
                handleClick();
                setTypeAlert("error");
                setMessage(res.response.data);
                console.log(res.response.data);
                history.push('/adventures');

            })
            getPricelistByEntityId(props.location.state.bookingEntityId).then(result => {
                setPricelistData(result.data);
                setLoadingPricelist(false);
            })
            getAvailableFastReservationsByBookingEntityId(props.location.state.bookingEntityId).then(res=>{
                console.log(res.data);
                setFastReservations(res.data);
            });
    
            getRatingsByEntityId(props.location.state.bookingEntityId).then(res=>{
                console.log(res.data);
                setClientReviews(res.data);
    
            })
        }
    }, [])

    if (isLoading || isLoadingPricelist) {
        return <div className="App">Loading...</div>
    }
    else {
        { adventureId = props.location.state.bookingEntityId }
        return (
            <Card style={{ margin: "1% 9% 1% 9%" }} sx={{}}>
                <RenderImageSlider pictures={adventureData.pictures}/>
                <br />
                <CardHeader
                    title={<div style={{display:'flex'}}><h2>{adventureData.name}</h2>
                        <div style={{marginLeft:'30px', marginTop:'8px'}}>
                            <RatingEntity value={props.location.state.rating} text={false} size="large"/>
                        </div>
                    </div>}
                    subheader={<h3><LocationOnIcon/>{adventureData.address + ", " + adventureData.place.cityName + ", " + adventureData.place.zipCode + ", " + adventureData.place.stateName}</h3>}

                    action={
                        <>
                        {getCurrentUser().userType.name == "ROLE_CLIENT"?(
                        <>
                        <Button onClick={reserveBookingEntity} disabled={getCurrentUser().penalties>2?true:false} variant='contained' size='large' /*style={{backgroundColor:'rgb(244, 177, 77)', color:'rgb(5, 30, 52)'}}*/>
                            Reserve
                        </Button>
                        {isSubscribed?
                                        <Button  size="large" style={{marginLeft:'5px', padding:'0px'}} onClick={unsubscribe}><Tooltip title="Unsubscribe"><Favorite fontSize="large" style={{ margin: "5px" }} /></Tooltip></Button>:
                                        <Button size="large" style={{ margin: "5px", padding:'0px' }} onClick={subscribe}><Tooltip title="Subscribe"><FavoriteBorder fontSize="large"  /></Tooltip></Button>
                        }
                        </>):(<></>)}
                        </>
                    }
                
                />
                {hasAuthority &&
                    <AdventureActions
                        history={history}
                        expanded={expanded}
                        adventureId={adventureId}
                        setMessage={setMessage}
                        handleClick={handleClick}
                        handleExpandClick={() => handleExpandClick()}
                    />
                }

            <hr></hr>
            {fastReservations.length > 0 && 
                <>
                <div >
                    <h3 style={{marginLeft:'40px'}}>Available fast reservations:</h3>
                        <List direction={'row'} component={Stack} style={{marginLeft:'20px', overflow:'auto', maxHeight:'200px'}} >
                            {fastReservations.map((res,index) =>(
                                <ListItem style={{minWidth:'250px', maxWidth:'250px'}}>
                                    <Grid container style={{background:'rgb(5, 30, 52)', color:'white', borderRadius:'10px', margin:'5px', padding:'20px'}}>
                                        <Grid item xs>
                                            <Grid container>
                                                <Grid item>
                                                    <DateRangeOutlined size='medium'/>
                                                </Grid>
                                                <Grid item>
                                                    <Typography gutterBottom variant="subtitle1" component="div">
                                                        {res.startDate}
                                                    </Typography>
                                                </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container>
                                                <Grid item xs={6}> 
                                                    <Typography gutterBottom variant="subtitle1" component="div">
                                                        {res.numOfDays} Days
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}> 
                                                    <Grid container>
                                                        <Grid item>
                                                            <PersonIcon size='medium'/> 
                                                        </Grid>
                                                        <Grid item>
                                                        <Typography gutterBottom variant="subtitle1" component="div">
                                                            {res.numOfPersons} 
                                                        </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid> 
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                        <Typography variant="subtitle1" component="div">
                                            {res.cost*res.numOfDays*res.numOfPersons}€
                                        </Typography>
                                            {getCurrentUser().userType.name == "ROLE_CLIENT"?(
                                                <Button onClick={() =>FastReserve(res)} disabled={getCurrentUser().penalties>2?true:false} variant='contained' style={{backgroundColor:'rgb(244, 177, 77)', color:'rgb(5, 30, 52)'}}>
                                                    Reserve Now
                                                </Button>
                                            ):(<></>)}
                                        </Grid>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            ))}
                        </List>
                </div>
                <hr></hr>
                </>
            }
                    <Dialog open={openDialog} onClose={()=>setOpenDialog(false)}>
                    <DialogTitle>Please Confirm Reservation</DialogTitle>
                    <DialogContent>
                        {Object.keys(selectedFastReservation).length > 0 &&
                        <DialogContentText>
                            Reservation type:<b>{String(adventureData.entityType).toLowerCase()}</b> <br></br>
                            Name: <b>{adventureData.name} </b>             <br></br>
                            Place: <b>{adventureData.place.cityName+", "+adventureData.place.stateName}</b>    <br></br>
                            Start date and time: <b>{selectedFastReservation.startDate}</b><br></br>
                            Days: <b>{selectedFastReservation.numOfDays}</b><br></br>
                            Number of persons: <b>{selectedFastReservation.numOfPersons}</b><br></br>
                            Additional services selected:<b>{selectedFastReservation.additionalServices.length!=0? selectedFastReservation.additionalServices.map(service=>{
                                return service.serviceName + " "+service.price+"€, ";
                            }):<p>None</p>}</b><br></br>
                            Price: <b>{selectedFastReservation.cost+"€"}</b>
                        </DialogContentText>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={confirmReservation}>Confirm</Button>
                    </DialogActions>
                </Dialog>
                <div>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: 'wrap' }}>

                            <Typography variant="body2" color="text.secondary" style={{ width: '30%', backgroundColor: 'aliceblue', borderRadius: '10px', paddingLeft: '1%', paddingTop: '0.2%', paddingBottom: '0.1%', margin: '2%' }}>
                                <h4>Promo Description: </h4><h3>{adventureData.promoDescription} </h3>
                            </Typography>
                                <Grid item xs={12} sm={4} style={{ width: '30%'}} minWidth="200px">
                                    <AdventureAdditionalInfo
                                        header="Rules of conduct"
                                        additionalData={<RenderRulesOfConduct rulesOfConduct={adventureData.rulesOfConduct} />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} minWidth="300px">
                                    <AdventureAdditionalInfo
                                        header="Additional services"
                                        additionalData={<RenderAdditionalServices additionalServices={pricelistData.additionalServices} />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} style={{ width: '30%'}} minWidth="200px">
                                    <AdventureAdditionalInfo
                                        header="Fishing equipment"
                                        additionalData={<RenderFishingEquipment fishingEquipment={adventureData.fishingEquipment} />}
                                    />
                                </Grid>
                            <Typography variant="body2" color="text.secondary" style={{ width: '30%', backgroundColor: 'rgb(252, 234, 207)', borderRadius: '10px', paddingLeft: '1%', paddingBottom: '0.2%', paddingTop: '0.2%', margin: '2%' }}>
                                <h4>Short Bio: </h4><h3>{adventureData.shortBio} </h3>
                            </Typography>
                    </div>
                </div>

                <hr></hr>
                <Grid container spacing={2} style={{ marginTop:'10px', marginBottom:'20px', marginLeft:'40px'}}>
                    <Grid item xs={'auto'} md={4} lg={4} style={{ overflow:'auto'}}>
                        <h3>Location on map:</h3>
                        <Typography variant="body2" style={{ width: '50%', minWidth: "400px", borderRadius: '10px', paddingBottom: '0.2%', paddingTop: '0.2%', marginTop:'10px' }}>
                        <Home long={adventureData.place.longitude} lat={adventureData.place.lat}></Home>

                        </Typography>
                    </Grid >
                    <Grid item xs={6} style={{marginBottom:'50px', height:'100%', marginLeft:'40px'}}>
                        <h3 >Reviews from clients:</h3>
                        <Typography style={{ borderRadius: '10px', marginRight: '2%', marginTop:'10px', overflow:'auto', height:'100%' }}>
                            {clientReviews.length > 0?  clientReviews.map((review, index)=>(
                                <Card variant="outlined" style={{width:'100%'}}>
                                    <React.Fragment>
                                        <CardContent>
                                        <Typography variant="h5" component="div">
                                            <StyledAvatar user= {review.owner}/>
                                            {review.owner.firstName+" "+review.owner.lastName}
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }}>
                                            <RatingEntity value={review.value} text={true} />
                                        </Typography>
                                        <Typography variant="body2">
                                           {review.comment}
                                        </Typography>
                                        </CardContent>
                                    </React.Fragment>
                                </Card>
                            )):<h4>Not yet reviewed</h4>}
                        </Typography>
                    </Grid>
                </Grid>
                   
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={typeAlert} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            </Card>

        );
    }
}
