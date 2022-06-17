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
import { CircularProgress} from "@mui/material";
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


export default function ReservationBasicCard(props) {
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [openShowReport, setOpenShowReport] = React.useState(false);
    const [openNotification, setOpenNotification] = React.useState(false);
    const [isLoading, setLoading] = React.useState(true);
    const [isLoadingAddServices, setLoadingAddServices] = React.useState(true);
    const [isLoadingReport, setLoadingReport] = React.useState(true);
    const [reservationCost, setReservationCost] = React.useState(0);
    const [additionalServices, setAdditionalServices] = React.useState({});
    const [pricelist, setPricelist] = useState([]);

    ///////////////////////////////////////////////////
    const [reported, setReported] = useState();
    const [report, setReport] = useState();
    ////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////
    const [checkedCome, setCheckedCome] = React.useState(false);
    const [checkedPenalizeClient, setCheckedPenalizeClient] = React.useState(false);
    const [reason, setReason] = React.useState("");
    const [processed, setProcessed] = React.useState("");
    ///////////////////////////////////////////////////////////////////

    const [dates, setDates] = React.useState({
        startDate:null,
        endDate:null
    });
  
    const [message, setMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");
    const handleClick = () => {
      setOpenNotification(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };
    const handleCloseShowReport = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpenShowReport(false);
    };

    const handleCloseNotification=(event)=>{
        setOpenNotification(false);
    }

    const handleChangeCome = (event) => {
      setCheckedCome(event.target.checked);
    };
    const handleChangePenalizeClient = (event) => {
      setCheckedPenalizeClient(event.target.checked);
    };

    function showReservation(){
        history.push({
            pathname: "/showReservationDetails",
            state: 
            { 
              reservation: props.reservation,
              additionalServices: additionalServices,
              pricelist: pricelist
            }
        })
    };
    function createReport(){
      setOpen(true);
    };
    function showReport(){
      setOpenShowReport(true);
    };

    function handleCreateReport(){
      console.log("report");
      console.log(props.reservation.id);
        let report = {
          "clientCome": checkedCome,
          "comment": reason,
          "penalizeClient": checkedPenalizeClient,
          "reservationId": props.reservation.id
        }
        addReport(report).then(result => {
          setTypeAlert("success");
          setMessage("Successfully send report");
          handleClick();
          setOpen(false);
          
        }).catch(resError => {
          setTypeAlert("error");
          setMessage(resError.response.data);
          handleClick();
          return;
        })

    };
    
    const [reservationStatus, setReservationStatus] = useState('');

    useEffect(() => {
        
      let end = new Date(props.reservation.startDate);
      let currDate = new Date();
      if(new Date(props.reservation.startDate).getTime() <= currDate.getTime() &&  currDate.getTime()< end.getTime())
          setReservationStatus('Started');

      end.setDate(end.getDate() + props.reservation.numOfDays);
      setDates({
          startDate: new Date(props.reservation.startDate),
          endDate:end
      });
      getPricelistByEntityId(props.reservation.bookingEntity.id).then(res => {
          setPricelist(res.data);
          getAdditionalServicesByReservationId(props.reservation.id).then(addServices => {
            setAdditionalServices(addServices.data);
            if (props.reservation.fastReservation == true){
              let updatedResCost = props.reservation.cost;
              setReservationCost(updatedResCost);
            }
            else{
              let updatedResCost = res.data.entityPricePerPerson*props.reservation.cost;
              if (addServices.data.length>0){
                for (let addService of addServices.data){
                  updatedResCost += addService.price;
                }
              }
              setReservationCost(updatedResCost);
            }
            
            getReportByReservationId(props.reservation.id).then(reported => {
              setReported(true);
              setReport(reported.data);
              setLoadingAddServices(false);
              setCheckedCome(reported.data.clientCome);
              setCheckedPenalizeClient(reported.data.penalizeClient);
              setReason(reported.data.comment);
              setProcessed(reported.data.processed);
              setLoadingReport(false);
              setLoading(false);
            }).catch(error => {
              setReported(false);
              setLoadingAddServices(false);
              setLoadingReport(false);
              setLoading(false);
            });
             
      });
          
      });
      
  }, [typeAlert])
    

    useEffect(() => {
        
        let end = new Date(props.reservation.startDate);
        let currDate = new Date();
        if(new Date(props.reservation.startDate).getTime() <= currDate.getTime() &&  currDate.getTime()< end.getTime())
            setReservationStatus('Started');

        end.setDate(end.getDate() + props.reservation.numOfDays);
        setDates({
            startDate: new Date(props.reservation.startDate),
            endDate:end
        });
        getPricelistByEntityId(props.reservation.bookingEntity.id).then(res => {
            setPricelist(res.data);
            getAdditionalServicesByReservationId(props.reservation.id).then(addServices => {
              setAdditionalServices(addServices.data);
              if (props.reservation.fastReservation == true){
                let updatedResCost = props.reservation.cost;
                setReservationCost(updatedResCost);
              }
              else{
                let updatedResCost = res.data.entityPricePerPerson*props.reservation.cost;
                if (addServices.data.length>0){
                  for (let addService of addServices.data){
                    updatedResCost += addService.price;
                  }
                }
                setReservationCost(updatedResCost);
              }
              
              getReportByReservationId(props.reservation.id).then(reported => {
                setReported(true);
                setReport(reported.data);
                setLoadingAddServices(false);
                setCheckedCome(reported.data.clientCome);
                setCheckedPenalizeClient(reported.data.penalizeClient);
                setReason(reported.data.comment);
                setProcessed(reported.data.processed);
                setLoadingReport(false);
                setLoading(false);
              }).catch(error => {
                setReported(false);
                setLoadingAddServices(false);
                setLoadingReport(false);
                setLoading(false);
              });
               
        });
            
        });
        
    }, [props.reservation])
    if (isLoading || isLoadingAddServices || isLoadingReport) { return <div className="App"><CircularProgress /></div> }
  return (
    <Card  style={{marginRight:"2%", marginLeft:"2%", marginBottom:"2%"}} sx={{ maxWidth: 400, minWidth:250}}>
      <CardContent>

        
        
      <Dialog open={open} onClose={handleClose} sx={{minWidth:500}}>
      <DialogTitle>Create Report</DialogTitle>
      <DialogContent>
      <Card style={{color: 'rgb(5, 30, 52)', backgroundColor:"aliceblue", margin:"2%"}}>
            <table style={{whiteSpace: "nowrap"}}>
                <tr>
                    <th><h4>{props.reservation.bookingEntity.name}</h4></th>
                    <th style={{paddingLeft:"3%"}}>€ {props.reservation.cost} / {props.reservation.numOfDays} nights</th>
                </tr>
                
            </table>
      </Card>
      <table style={{textAlign:"left", marginLeft:"18%"}}>

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
        
       <Divider style={{margin:"2%"}}></Divider>
    
        
        <Typography variant="body2" style={{backgroundColor: 'rgb(252, 234, 207)', borderRadius: '10px', paddingLeft: '1%', paddingBottom: '0.1%', paddingTop: '0.1%', margin: '1%', minWidth:'350px'}}>
            <h3 style={{color:'rgb(5, 30, 52)'}}>Please create reservation report</h3>
            <h4 style={{color:'rgb(5, 30, 52)'}}>Did the clients come?
            <Checkbox
              checked={checkedCome}
              defaultChecked={checkedCome}
              onChange={handleChangeCome}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            </h4>
            <h4 style={{color:'rgb(5, 30, 52)'}}>Notes for administrator to see
            </h4>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              value = {reason}
              name="reason"
              onChange={e => {
                setReason(e.target.value);
              }}
              style={{ width: 200 }}
            />
            <h4 style={{color:'rgb(5, 30, 52)'}}>Penalize client
            <Checkbox
              checked={checkedPenalizeClient}
              onChange={handleChangePenalizeClient}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            </h4>
            
        </Typography>


      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreateReport}>Save</Button>
      </DialogActions>
    </Dialog>


    <Dialog open={openShowReport} onClose={handleClose} sx={{minWidth:500}}>
      <DialogTitle>Show Report Details</DialogTitle>
      <DialogContent>
      <Card style={{color: 'rgb(5, 30, 52)', backgroundColor:"aliceblue", margin:"2%"}}>
            <table style={{whiteSpace: "nowrap"}}>
                <tr>
                    <th><h4>{props.reservation.bookingEntity.name}</h4></th>
                    <th style={{paddingLeft:"3%"}}>€ {props.reservation.cost} / {props.reservation.numOfDays} nights</th>
                </tr>
                
            </table>
      </Card>
      <table style={{textAlign:"left", marginLeft:"18%"}}>

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
        
       <Divider style={{margin:"2%"}}></Divider>
    
        
        <Typography variant="body2" style={{backgroundColor: 'rgb(252, 234, 207)', borderRadius: '10px', paddingLeft: '1%', paddingBottom: '0.1%', paddingTop: '0.1%', margin: '1%', minWidth:'350px'}}>
            <h3 style={{color:'rgb(5, 30, 52)'}}>Please create reservation report</h3>
            <h4 style={{color:'rgb(5, 30, 52)'}}>Did the clients come?
            <Checkbox
              defaultChecked={checkedCome}
              disabled
              inputProps={{ 'aria-label': 'controlled' }}
            />
            </h4>
            <h4 style={{color:'rgb(5, 30, 52)'}}>Notes for administrator to see
            </h4>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              disabled
              defaultValue={reason}
              name="reason"
              style={{ width: 200 }}
            />
            <h4 style={{color:'rgb(5, 30, 52)'}}>Penalize client
            <Checkbox
              defaultChecked = {checkedPenalizeClient}
              disabled
              inputProps={{ 'aria-label': 'controlled' }}
            />
            </h4>
            {processed ? (
               <h4 style={{color:'rgb(5, 30, 52)', marginBottom:'1%'}}> <RecommendIcon />Report approved by admin 
               </h4>
            ):(<h4 style={{color:'rgb(5, 30, 52)', marginBottom:'1%'}}>Report not approved by admin
            </h4>)}
           
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseShowReport}>Close</Button>
      </DialogActions>
    </Dialog>

        <Typography style={{textAlign:"left", color: 'rgb(5, 30, 52)'}} gutterBottom variant="h6" component="div">
          Reservation Details
        </Typography>
        <table style={{textAlign:"left"}}>
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
                <th>Selected:</th>
            </tr>
            <tr>
            <td style={{paddingBottom:"2%", fontWeight:"normal"}}>{props.reservation.bookingEntity.name}</td>
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
        
      </CardContent>
      <CardActions>
      {props.details === "true" ? (
          <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row" }}>
              <Button size="small" onClick={showReservation}><ReadMoreIcon fontSize="large" style={{margin:"5px"}}/> Details</Button>
              
              {reported === true ? (<div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row" }}> 
                <Button size="small" onClick={showReport}><InfoIcon fontSize="medium" style={{margin:"5px"}}/> Report</Button>
              
              </div>):(
                <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row" }}>
                  {dates.endDate.getFullYear() > new Date(Date.now()).getFullYear() || (dates.endDate.getFullYear() == new Date(Date.now()).getFullYear() && (dates.endDate.getMonth()+1) > (new Date(Date.now()).getMonth()+1) || (dates.endDate.getFullYear() == new Date(Date.now()).getFullYear() && (dates.endDate.getMonth()+1) == (new Date(Date.now()).getMonth()+1) && dates.endDate.getUTCDate() > new Date(Date.now()).getUTCDate())) ? (
                  <div></div>):(
                      <Button size="small" onClick={createReport}><AddTaskIcon fontSize="medium" style={{margin:"5px"}}/> Report</Button>
              
                  )} </div>
              )}
              {/* {reservationStatus !== '' ? (<div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row" }}> 
                <Button size="small" onClick={showReport}><InfoIcon fontSize="medium" style={{margin:"5px"}}/> Report</Button>
              
              </div>):(
                <></>
              )} */}
            
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
       
        <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={typeAlert} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      </CardActions>
    </Card>
  );
}