import { URL_PICTURE_PATH } from "../service/PictureService";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { useHistory } from "react-router-dom";
import RatingEntity from "./Rating";
import { getCurrentUser } from "../service/AuthService";
import { logicalDeleteBookingEntityById } from "../service/BookingEntityService";
import { getBookingEntityById } from '../service/BookingEntityService';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import ImageSlider from "./image_slider/ImageSlider";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Euro, Favorite, FavoriteBorder, Unsubscribe } from "@mui/icons-material";
import { subscribeClientWithEntity, unsubscribeClientWithEntity } from "../service/UserService";

export default function EntityBasicCard(props) {

    const history = useHistory();

    ///////////////FOR DELETE///////////////////////////////////////////////
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");
    const [isSubsribed, setIsSubscribed] = React.useState(false);
    const [ownerId, setOwnerId] = React.useState();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        console.log(props);
        if (getCurrentUser() !== null && getCurrentUser() !== undefined) {
            if (getCurrentUser().userType.name === "ROLE_CLIENT") {
                let subsc = [];
                setIsSubscribed(false);   
                console.log(props.subscribedEntities);
                if(props.subscribedEntities != null && props.subscribedEntities != "undefined" && props.subscribedEntities.length > 0){
                    subsc = props.subscribedEntities.some(e=>e.id === props.bookingEntity.id);
                    console.log("IS SUBSRCIBED:"+subsc);   
                    setIsSubscribed(subsc); 
                }
                console.log("IS SUBSRCIBED:"+subsc);     
            }
        }
    }, []);

    React.useEffect(() => {
        getBookingEntityById(props.bookingEntity.id).then(res => {
            if (res.data.entityType === "COTTAGE"){
                setOwnerId(res.data.cottageOwnerDTO.id);
            }
            if (res.data.entityType === "SHIP"){
                setOwnerId(res.data.shipOwner.id);
            }
            if (res.data.entityType === "ADVENTURE"){
                setOwnerId(res.data.instructor.id);
            }
            setOwnerId(res.data.cottageOwnerDTO.id);
            setIsLoading(false);
            
        }).catch(res => {
            setIsLoading(false);
        })
    }, []);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (_event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleClickOpen = (event) => {
        event.stopPropagation();
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const logicDeleteBookingEntity = (event) => {
        event.stopPropagation();
        logicalDeleteBookingEntityById(props.bookingEntity.id, getCurrentUser().id, password).then(res => {
            setPassword("");
            handleClick();
            setTypeAlert("success");
            setMessage("Successfully delete entity " + props.bookingEntity.name);
            window.location.reload();
        }).catch(res => {
            setPassword("");
            setTypeAlert("error");
            console.log(res.response.data);
            setMessage(res.response.data);
            handleClick();
            return;
        })
        setOpenDialog(false);
    }
    ///////////////////////////////////////////////////////////////////////////////////


    const showBookingEntity = (event) => {
        event.stopPropagation();
        //if (getCurrentUser() == undefined || getCurrentUser() == null) return;
        if (props.bookingEntity.entityType === "COTTAGE") {
            history.push({
                pathname: "/showCottageProfile",
                state: { bookingEntityId: props.bookingEntity.id,
                            rating:Math.floor(props.bookingEntity.averageRating * 2) / 2,
                            subscribed:isSubsribed    
                }
            })
        } else if (props.bookingEntity.entityType === "ADVENTURE") {
            history.push({
                pathname: "/showAdventureProfile",
                state: { bookingEntityId: props.bookingEntity.id,
                         rating:Math.floor(props.bookingEntity.averageRating * 2) / 2 ,
                         subscribed:isSubsribed     }
            })
        } else if (props.bookingEntity.entityType === "SHIP")
            history.push({
                pathname: "/showShipProfile",
                state: { bookingEntityId: props.bookingEntity.id,
                         rating:Math.floor(props.bookingEntity.averageRating * 2) / 2 ,
                         subscribed:isSubsribed     
                        }
            })
    };

    const reserveBookingEntity = (event) => {
        event.stopPropagation();
        console.log("Evo me");
        console.log(props.searchParams);
        history.push({
            pathname: "/newReservation",
            state: {
                bookingEntityId: props.bookingEntity.id,
                searchParams: props.searchParams
            }
        })
    }

    const subscribe =(event)=>{
        event.stopPropagation();
        subscribeClientWithEntity(getCurrentUser().id, props.bookingEntity.id).then(res=>{
            console.log("Uspesno sub");
            console.log(res.data);
            if(typeof(props.setSubscribedEntities) !== "undefined" )
                props.setSubscribedEntities(res.data);
            else
                setIsSubscribed(true);
        });
    }

    const unsubscribe =(event)=>{
        event.stopPropagation();
        unsubscribeClientWithEntity(getCurrentUser().id, props.bookingEntity.id).then(res=>{
            console.log("Uspesno unsub");
            console.log(res.data);
            if(typeof(props.setSubscribedEntities) !== "undefined" )
                props.setSubscribedEntities(res.data);
            else
            setIsSubscribed(false);
        });
    }

    if (isLoading) { return <div></div> } 
    return (
        <Card style={{ margin: "2%" }} sx={{ maxWidth: 345 }}>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Deleting</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To delete this entity, please enter your password for security reasons.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                        }}
                        id="name"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={logicDeleteBookingEntity}>Confirm</Button>
                </DialogActions>
            </Dialog>

            {props.bookingEntity.pictures.length === 0 ? (
                <CardMedia
                    onClick={showBookingEntity}
                    component="img"
                    height="140"
                    alt="No Images"
                />
            ) : (
                <div>
                    {
                        props.bookingEntity.pictures.length > 1 ?
                            (
                                <CardMedia>
                                    <ImageSlider imageHeight="25vh" slides={props.bookingEntity.pictures.map((im) => ({ 'image': URL_PICTURE_PATH + im }))} />
                                </CardMedia>
                            ) :
                            (
                                <CardMedia
                                    onClick={showBookingEntity}
                                    component="img"
                                    style={{ height: "26vh" }}
                                    alt="No Images"
                                    image={URL_PICTURE_PATH + props.bookingEntity.pictures[0]}
                                >
                                </CardMedia>
                            )
                    }
                </div>
            )}
            <CardContent  onClick={showBookingEntity}>
                <Typography style={{ textAlign: "left" }} gutterBottom variant="h5" component="div">
                    <div style={{display:'flex'}}>
                        <h3>{props.bookingEntity.name}
                        {getCurrentUser() != null && getCurrentUser().userType.name == "ROLE_CLIENT"?(
                            <>
                        {isSubsribed?
                                    <Button size="small" style={{marginLeft:'5px', padding:'0px'}} onClick={unsubscribe}><Favorite fontSize="large" style={{ margin: "5px" }} /></Button>:
                                    <Button size="small" style={{ margin: "5px", padding:'0px' }} onClick={subscribe}><FavoriteBorder fontSize="large"  /></Button>
                                    }
                                    </>):(<div></div>)}
                                    </h3>
                    </div>
                </Typography>
                <Typography style={{ textAlign: "left" }} gutterBottom variant="h7" component="div">
                   <p><LocationOnIcon size='small'/> {props.bookingEntity.address}, {props.bookingEntity.place.cityName} {props.bookingEntity.place.zipCode}, {props.bookingEntity.place.stateName}</p>
                </Typography>

                <Typography style={{ textAlign: "left" }} gutterBottom variant="h7" component="div">
                    {props.bookingEntity.entityType === "COTTAGE" ? (
                        <div>
                            <text style={{ fontWeight:'bold'  }}>Cost Per Night:</text> <b>{props.bookingEntity.entityPricePerPerson} €</b>
                        </div>

                    ) : (<div>
                        <text style={{ fontWeight:'bold'  }}>Cost Per Person:</text> <b>{props.bookingEntity.entityPricePerPerson} €</b>

                    </div>)}
                </Typography>
                <Typography style={{ textAlign: "left" }} gutterBottom variant="h7" component="div">
                    <RatingEntity value={Math.floor(props.bookingEntity.averageRating * 2) / 2}></RatingEntity>
                </Typography>
                <Typography style={{ textAlign: "left" }} variant="body2" color="text.secondary">
                    {props.bookingEntity.promoDescription}
                </Typography>
            </CardContent>
            <CardActions>
                {/* <Button size="small" onClick={showBookingEntity}><ReadMoreIcon fontSize="large" style={{ margin: "5px" }} /> Details</Button> */}
                {getCurrentUser() !== null &&
                    <span>
                        {getCurrentUser().userType.name === "ROLE_CLIENT"
                            ?
                            (
                                <Button size="large" style={{marginLeft:'5px'}} disabled={getCurrentUser().penalties>2?true:false} onClick={reserveBookingEntity} variant='contained'>Reserve</Button>
                            ) :
                            (
                                <span>
                                    {getCurrentUser().userType.name === "ROLE_ADMIN" || getCurrentUser().userType.name === "ROLE_SUPER_ADMIN" ||  getCurrentUser().id === ownerId ? (
                                    <Button size="small" onClick={handleClickOpen}><DeleteIcon />Delete</Button>
                                    ):(<></>)}
                                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                        <Alert onClose={handleClose} severity={typeAlert} sx={{ width: '100%' }}>
                                            {message}
                                        </Alert>
                                    </Snackbar>
                                </span>
                            )
                        }
                    </span>
                }
            </CardActions>
        </Card>
    );

}