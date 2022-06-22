import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import { CircularProgress, DialogContentText} from "@mui/material";
import { getPricelistByEntityId } from '../../service/PricelistService';
import { getAdditionalServicesByReservationId } from '../../service/AdditionalService';
import { addReport, getReportByReservationId } from '../../service/ReportService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Checkbox from '@mui/material/Checkbox';
import AddTaskIcon from '@mui/icons-material/AddTask';
import InfoIcon from '@mui/icons-material/Info';
import RecommendIcon from '@mui/icons-material/Recommend';
import { CancelSharp, Circle, CircleOutlined, CircleSharp, Grade } from '@mui/icons-material';
import { cancelReservationById } from '../../service/ReservationService';
import { createComplaint, getComplaintByReservationId } from '../../service/ComplaintService';
import { createRating, getRatingByReservationId } from '../../service/RatingService';
import { ControlledRating } from '../Rating';

export default function ReservationCardForClient(props) {
    const history = useHistory();
    const [openComplaint, setOpenComplaint] = React.useState(false);
    const [openShowComplaint, setOpenShowComplaint] = React.useState(false);
    const [isLoading, setLoading] = React.useState(true);
    const [reservationCost, setReservationCost] = React.useState(0);
    const [additionalServices, setAdditionalServices] = React.useState({});
    const [pricelist, setPricelist] = useState([]);
    const [reservationStatus, setReservationStatus] = useState('');
    const [canCancel, setCanCancel] = useState(false);
    const [hasRating, setHasRating] = useState(false);
    const [openRating, setOpenRating] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [rating, setRating] = useState({});

    ///////////////////////////////////////////////////
    const [hasComplaint, setHasComplaint] = useState(false);
    const [complaint, setComplaint] = useState(null);
    ///////////////////////////////////////////////////////////////////

    const [dates, setDates] = React.useState({
        startDate:null,
        endDate:null
    });
  
    const [message, setMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("success");
    const handleClick = () => {
      setOpenComplaint(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenComplaint(false);
    };
    const handleCloseShowReport = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpenShowComplaint(false);
    };
    const handleCloseSnackbar = (event, reason) =>{
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnackbar(false);
    };

    function showReservation(){
        history.push({
            pathname: "/showReservationDetailsForClient",
            state: 
            { 
              reservation: props.reservation,
              additionalServices: additionalServices,
              pricelist: pricelist
            }
        })
    };

    const cancelReservation = ()=>{
      setMessage("Reservation canceled successfuly");
        cancelReservationById(props.reservation.id).then(res=>{
            console.log("USPESNO OBRISAN");
            setOpenCancelDialog(false);
            setOpenSnackbar(true);
            window.location.reload(false);
        }
        )
    }
    

    function createReport(event){
      event.preventDefault()
      setOpenComplaint(true);
    };
    function showReport(event){
      event.preventDefault()
      setOpenShowComplaint(true);
    };

    const onRatingChangeFn=(event,newValue)=>{
      let rat = rating;
      console.log("USAO U IZMENU RATINGA: "+newValue);
      rat.value = newValue;
      setRating(rat);
    }

    const sendRating=(event)=>{
      setMessage("Rating added successfuly");
      event.preventDefault();
      console.log('Napravi Rating');
      let rat = rating;
      rat.reviewDate = new Date();
      setRating(rat);
      createRating(rat).then(res=>{
        console.log("Uspesno napravio rating");
        setOpenRating(false);
        setOpenSnackbar(true);
        setOpenRating(false);
        setHasRating(true);
      });
    }

    const sendComplaint=(event)=>{
      setMessage("Complaint successfuly sent.");
      event.preventDefault();
      console.log('USAOOO');
      createComplaint(complaint).then(res=>{
        console.log("uspesno poslaoo");
        setHasComplaint(true);
        setOpenComplaint(false);
        setOpenSnackbar(true);
      });
    }
    
    useEffect(() => {
        console.log("CAAAAOOOOOO");
        setCanCancel(false);
        console.log(props.reservation);
        let end = new Date(props.reservation.startDate);
        end.setDate(end.getDate() + props.reservation.numOfDays);
        console.log('start date:'+new Date(props.reservation.startDate));
        console.log('end date:'+end);
        let currDate = new Date();
        if(new Date(props.reservation.startDate).getTime() <= currDate.getTime() &&  currDate.getTime()< end.getTime())
            setReservationStatus('Started');
        else if(new Date(props.reservation.startDate).getTime() > currDate.getTime()){
            setReservationStatus('Not started');
            const oneDay = 60 * 60 * 24 * 1000;
            console.log(props.reservation);
            
            if(new Date(props.reservation.startDate).getTime() > new Date(currDate.getTime()+oneDay*3)){
              console.log("Moze da otkaze!");
              setCanCancel(true);
            }
        }
        else
            setReservationStatus('Finished');
        setDates({
            startDate: new Date(props.reservation.startDate),
            endDate:end
        });
        getRatingByReservationId(props.reservation.id).then(res => {
          setHasRating(true);
        }).catch(error =>{
          setHasRating(false);
        });

        getPricelistByEntityId(props.reservation.bookingEntity.id).then(res => {
            setPricelist(res.data);
            getAdditionalServicesByReservationId(props.reservation.id).then(addServices => {
              setAdditionalServices(addServices.data);
              let updatedResCost = 0;
              if (props.reservation.fastReservation == true){
                updatedResCost = props.reservation.cost;
                setReservationCost(updatedResCost);
              }else{
                let updatedResCost = res.data.entityPricePerPerson*props.reservation.numOfDays*props.reservation.numOfPersons;
                setReservationCost(updatedResCost);
              }
              if (addServices.data.length>0){
                for (let addService of addServices.data){
                  updatedResCost += addService.price;
                }
              }
              setReservationCost(updatedResCost);
              getComplaintByReservationId(props.reservation.id).then(res => {
                setHasComplaint(true);
                setComplaint(res.data);
                setLoading(false);
              }).catch(error => {
                setHasComplaint(false);
                setLoading(false);
              });
               
        });
        });
        
    }, [,props.reservation])

    if (isLoading) { return <div className="App"><CircularProgress /></div> }
  return (
    <Card  style={{marginRight:"2%", marginLeft:"2%", marginBottom:"2%"}} sx={{ maxWidth: 400, minWidth:320}}>
      <CardContent>
      <Dialog open={openCancelDialog} onClose={()=>setOpenCancelDialog(false)}>
                        <DialogTitle>Confirm dialog</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <b>Are you sure you want to cancel this reservation?<br/>You wont be able to reserve this entity at selected date</b>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>setOpenCancelDialog(false)}>Cancel</Button>
                            <Button onClick={cancelReservation}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
      <Dialog open={openComplaint} onClose={handleClose} sx={{minWidth:500}}>
            <form onSubmit={sendComplaint}>
            <DialogTitle>Create Reservation Complaint</DialogTitle>
            <DialogContent>
            <Divider style={{margin:"2%"}}></Divider>
                 <Typography variant="body2" style={{backgroundColor: 'rgb(252, 234, 207)', borderRadius: '10px', paddingLeft: '1%', paddingBottom: '0.1%', paddingTop: '0.1%', margin: '1%', minWidth:'350px'}}>
                    
                    <h4 style={{color:'rgb(5, 30, 52)'}}>Description:
                    </h4>
                    <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    // value = {()=>{if(complaint != null)return complaint.description
                    //                 return ""}}
                    name="description"
                    onChange={e => {
                        let comp = {
                          description : e.target.value,
                          reservation: props.reservation
                        };
                        setComplaint(comp);
                    }}
                    style={{ width: 200 }}
                    required
                    />
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button type='button' onClick={handleClose}>Cancel</Button>
                <Button type='submit'>Save</Button>
            </DialogActions>
            </form>
        </Dialog>
        <Dialog open={openShowComplaint} onClose={handleClose} sx={{minWidth:500}}>
      <DialogTitle>Complaint Details</DialogTitle>
      <DialogContent>
        {complaint && <Typography variant="body2" style={{backgroundColor: 'rgb(252, 234, 207)', borderRadius: '10px', paddingLeft: '1%', paddingBottom: '0.1%', paddingTop: '0.1%', margin: '1%', minWidth:'350px'}}>
            <h4 style={{color:'rgb(5, 30, 52)'}}>Desciption:
            </h4>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              disabled
              defaultValue={complaint.description}
              name="description"
              style={{ width: 200 }}
            />
        </Typography>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseShowReport}>Close</Button>
      </DialogActions>
    </Dialog>


    <Dialog open={openRating} onClose={()=>setOpenRating(false)} sx={{minWidth:500}}>
    <form onSubmit={sendRating}>
            <DialogTitle>Give rating</DialogTitle>
            <DialogContent>
            <Divider style={{margin:"2%"}}></Divider>
                 <Typography variant="body2" style={{backgroundColor: 'rgb(252, 234, 207)', borderRadius: '10px', paddingLeft: '1%', paddingBottom: '0.1%', paddingTop: '0.1%', margin: '1%', minWidth:'350px'}}>
                    
                    <h4 style={{color:'rgb(5, 30, 52)'}}>Comment:</h4>
                    <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    name="description"
                    onChange={e => {
                        let rat = rating;
                        rat.comment = e.target.value;
                        rat.reservation = props.reservation;
                        setRating(rat);
                    }}
                    style={{ width: 200 }}
                    required
                    />

                    <h4 style={{color:'rgb(5, 30, 52)'}}>Rating:</h4>
                    <ControlledRating  onChange={onRatingChangeFn} required/>

                </Typography>
            </DialogContent>
            <DialogActions>
                <Button type='button' onClick={()=>setOpenRating(false)}>Cancel</Button>
                <Button type='submit'>Save</Button>
            </DialogActions>
            </form>
    </Dialog>
        <Typography style={{textAlign:"left", color: 'rgb(5, 30, 52)'}} gutterBottom variant="h6" component="div">
          Reservation Details
        </Typography>
        <table style={{textAlign:"left", width:'100%'}} >
            <tr>
                <th style={{color: 'rgb(5, 30, 52)', backgroundColor:"aliceblue", padding:"3%", fontWeight:"normal"}}>Check-in</th>
                <th style={{color: 'rgb(5, 30, 52)', backgroundColor:"aliceblue", padding:"3%", fontWeight:"normal"}}>Check-out</th>
            </tr>
            <tr>
                <td variant="h6" style={{color: 'rgb(5, 30, 52)', borderRight: "solid 2px aliceblue", paddingBottom:"2%", fontWeight:"bold"}}>{
                new Intl.DateTimeFormat("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit"
                  }).format(dates.startDate)
                  }
                </td>
                <td variant="h6" style={{color: 'rgb(5, 30, 52)', paddingBottom:"2%", fontWeight:"bold"}}>{
                new Intl.DateTimeFormat("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit"
                  }).format(dates.endDate)
                  }
                </td>
            </tr>
            <tr>
                <td style={{color: 'rgb(5, 30, 52)', borderRight: "solid 2px aliceblue", fontWeight:"lighter"}}>{
                    new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit'}).format(dates.startDate)
                
                  }
                </td>
                <td style={{color: 'rgb(5, 30, 52)', padding:"0%", fontWeight:"lighter"}}>{
                new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit'}).format(dates.endDate)
                
                  }
                </td>
            </tr>
        </table>
        <br/>
        <table style={{color: 'rgb(5, 30, 52)', textAlign:"left", whiteSpace: "nowrap"}}>
            <tr>
                <th style={{fontWeight:"normal"}}>Total length of stay:</th>
            </tr>
            <tr>
            <td style={{paddingBottom:"2%", fontWeight:"bold"}}>{props.reservation.numOfDays} nights</td>
            </tr>
        </table>
        <Divider style={{margin:"2%"}}></Divider>
       <table style={{color: 'rgb(5, 30, 52)', textAlign:"left", whiteSpace: "nowrap"}}>
            <tr>
                <th style={{fontWeight:"normal"}}>Total num of persons:</th>
            </tr>
            <tr>
            <td style={{paddingBottom:"2%", fontWeight:"bold"}}>{props.reservation.numOfPersons}</td>
            </tr>
        </table>
       <Divider style={{margin:"2%"}}></Divider>
       <table style={{color: 'rgb(5, 30, 52)', textAlign:"left", whiteSpace: "nowrap"}}>
            <tr>
                <th style={{fontWeight:"normal"}}>Entity type:</th>
            </tr>
            <tr>
            <td style={{paddingBottom:"2%", fontWeight:"bold"}}>{props.reservation.bookingEntity.entityType}</td>
            </tr>
        </table>
        
        <Card style={{color: 'rgb(5, 30, 52)', backgroundColor:"aliceblue", margin:"2%"}}>
            <table style={{whiteSpace: "nowrap"}}>
                <tr>
                    <th><h4>{props.reservation.bookingEntity.name}</h4></th>
                    <th style={{paddingLeft:"3%"}}>€ {props.reservation.cost}</th>
                </tr>
                
            </table>
        </Card>
        <div style={{display:'flex'}}>
            <h4 style={{margin:'0px', fontWeight:'normal'}}>Status:</h4>&nbsp;<p style={{margin:'0px', fontWeight:'bold'}}>{reservationStatus} &nbsp;</p><CircleSharp style={{color:(reservationStatus === 'Started'?'green':reservationStatus==='Not started'?'orange':'red'), fontSize:'medium'}}/>


        </div>
      </CardContent>
      <CardActions>
      {props.details === "true" ? (
          <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row" }}>
              <Button size="small" onClick={showReservation}><ReadMoreIcon fontSize="large" style={{margin:"5px"}}/> Details</Button>
              
              {canCancel === true && <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row" }}> 
                                <Button size="small" onClick={()=>setOpenCancelDialog(true)}><CancelSharp fontSize="medium" style={{margin:"5px"}}/> Cancel</Button>
                            </div>}
              {hasComplaint === true ? (<div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row" }}> 
                <Button size="small" onClick={showReport}><InfoIcon fontSize="medium" style={{margin:"5px"}}/> Complain</Button>
              </div>):(
                <>
                  {reservationStatus === "Finished" && <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row" }}>
                      <Button size="small" onClick={createReport}><AddTaskIcon fontSize="medium" style={{margin:"5px"}}/> Complain</Button></div>
                  }
                </>
              )}
              {!hasRating && reservationStatus === "Finished" && <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row" }}> 
                                <Button size="small" onClick={()=>setOpenRating(true)}><Grade fontSize="medium" style={{margin:"5px"}}/> Rate</Button>
                            </div>}
   </div>
           
          ):(<div>
            {additionalServices.length === 0 ? (
                <Card style={{color: 'rgb(5, 30, 52)', minWidth:"200px", backgroundColor:"aliceblue", margin:"2%"}}>
                  No additional services
                </Card>
            ):(
            <Card style={{color: 'rgb(5, 30, 52)', backgroundColor:"aliceblue", margin:"2%"}}>
              <table style={{whiteSpace: "nowrap", minWidth:"200px", textAlign:"left"}}>
                 
                  <tr>
                      <th><h4>Additional services</h4></th>
                  </tr>
                  
                    {additionalServices.map(service=> {
                      if (additionalServices.length == 0){
                        return <tr style={{textAlign:"left", paddingLeft:"1%"}}>
                          <td>No additional services</td>
                          </tr>
                      }else{
                        return <tr style={{textAlign:"left", paddingLeft:"1%"}}>
                        <td>{service.serviceName} /<b>{service.price} €</b></td>
                        </tr>
                      }
                        
                    })}
                  
              </table>
            </Card>)}
          </div>)}
       
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={typeAlert} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </CardActions>
    </Card>
  );
}