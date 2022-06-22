import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { FormControlLabel,FormControl, FormLabel } from '@mui/material'
import AddingAdditionalServiceWithoutAmount from "../AddingAdditionServicesWithoutAmount";
import {getBookingEntityById, getBookingEntityByIdForCardView} from '../../service/BookingEntityService.js';
import { getCurrentUser } from '../../service/AuthService.js';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { format } from "date-fns";
import Chip from '@mui/material/Chip';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import IconButton from '@mui/material/IconButton';
import { getPricelistByEntityId } from '../../service/PricelistService';
import { addNewFastReservation } from '../../service/ReservationService';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import CardHeader from "@mui/material/CardHeader";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShipOwner from "../../icons/shipOwner.png";
import CottageOwner from "../../icons/cottageOwner.png";
import Instructor from "../../icons/instructor.png";
import Tooltip from '@mui/material/Tooltip';
import { DateRangeOutlined } from '@mui/icons-material';
import { Calendar } from 'react-date-range';

const Input = styled(MuiInput)`
  width: 42px;
`;
export default function AddFastReservation(props) {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoading, setLoading] = useState(true);
  const [isLoadingPricelist, setLoadingPricelist] = useState(true);
  const [entityBasicData, setEntityBasicData] = useState({});
  const [pricelistData, setPricelistData] = useState({});
  const [message, setMessage] = React.useState("");
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [openDate,setOpenDate] = useState(false);
  const history = useHistory();
  const oneDay = 60 * 60 * 24 * 1000;

  const [fastResData, setFastResData] = React.useState(
    {
      "id":0,
      "entityPricePerPerson": 0,
      "startDate": new Date(new Date().toLocaleString()),
      "additionalServices": [], 
      "bookingEntity": null
    }
   );

   /////////////////TIME/////////////////////////////////
   const [times, setTimes] = useState([]);
   const [checkedTime, setCheckedTime] = useState({});

   var availableTimes = [{
    text:"9 AM",
    value:"09:00:00",
    available:true
    },
    {
        text:"1 PM",
        value:"13:00:00",
        available:true
    },
    {
        text:"5 PM",
        value:"17:00:00",
        available:true
    },
    {
        text:"9 PM",
        value:"21:00:00",
        available:true
    }];

    const radioButtonChanged=(event)=>{
      event.preventDefault();
      setCheckedTime(availableTimes.find(time => time.value === event.target.value));

  };

   ////////////////ERROR MESSAGE/////////////////////////
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

    //////////////////DATE TIME PICKER /////////////////////////
    const [value, setValue] = React.useState(new Date());

    const handleChange = (newValue) => {
      setValue(newValue);
    };
    ////////////////////////////////////////////////////////////

    //////////////////ADITIONAL SERVICES////////////////////////
    const [additionalServices, setAdditionalServices] = React.useState([
    ]);

    const [startAdditionalServices, setStartAdditionalServices] = React.useState([]);

    const [addedAdditionalServices, setAddedAdditionalServices] = React.useState([
    ]);

    const handleDeleteAdditionalServiceChip = (chipToDelete) => {
        setAdditionalServices((chips) => chips.filter((chip) => chip.serviceName !== chipToDelete.serviceName));
       
        let newKey = 1;
        if (addedAdditionalServices.length != 0) {
            
            newKey = Math.max.apply(Math, addedAdditionalServices.map(chip => chip.key)) + 1;    
        }
        let newObj = {
          "key": newKey,
          "serviceName": chipToDelete.serviceName
        };
        let newChipData = [...addedAdditionalServices];
        newChipData.push(newObj);
        setAddedAdditionalServices(newChipData);
    };

    const handleDeleteAddedAdditionalServiceChip = (chipToDelete) => {
      setAddedAdditionalServices((chips) => chips.filter((chip) => chip.serviceName !== chipToDelete.serviceName));
      let addSer = additionalServices;
      addSer.push(chipToDelete);
      setAdditionalServices(addSer);
  };
    const getAddedAdditionalServicesJson = () => {
        if (addedAdditionalServices.length === 0) {
            return []
        }
        let retVal = [];
        for (let service of addedAdditionalServices) {
          console.log(service);
          for (let trueService of startAdditionalServices) {
              console.log(trueService);
              if (trueService.serviceName === service.serviceName){
                retVal.push({
                    serviceName : service.serviceName,
                    price : 0.0,
                    id: trueService.id
                });
              }
          }
      
        }
        return retVal;
    }
    ////////////////////////////////////////////

    const showCalendarForEntity = (event) => {
      event.preventDefault();
      history.push({
          pathname: "/calendarForEntity",
          state: { bookingEntityId: entityBasicData.id }
      })
    }

    const returnToBookingEntitieProfile = (event) => {
      event.preventDefault();
      history.goBack();
    }

    ///////////////////////////////////////////////////////////////////////////


    const onFormSubmit = data => {
      
      if (getCurrentUser() == null || getCurrentUser() == undefined || (getCurrentUser().userType.name!=="ROLE_COTTAGE_OWNER" && getCurrentUser().userType.name!=="ROLE_SHIP_OWNER" && getCurrentUser().userType.name!== "ROLE_INSTRUCTOR")) {
        history.push('/forbiddenPage');
      }
      let newDate = fastResData.startDate;
      
      console.log(newDate.getDate());
      let date = [newDate.getFullYear(), newDate.getMonth()+1, newDate.getDate(), parseInt(checkedTime.value.split(':')[0]), 0];
    
      console.log(date);

      if(entityBasicData.entityType == "ADVENTURE")
        data.numNights = 0;

      let newFastReservation={
        canceled:false,
        fastReservation: true,
        numOfDays: data.numNights,
        numOfPersons: data.maxNumPeople,
        cost: parseFloat(data.cost),
        startDate: date,
        additionalServices: getAddedAdditionalServicesJson(),
        bookingEntity: entityBasicData, 
        version: 1
      }
      console.log(newFastReservation);
      addNewFastReservation(newFastReservation).then(res => {
        console.log(entityBasicData)
        history.goBack();
      }).catch(error => {
          setMessage(error.response.data);
          handleClick();
      });
  }

  
  useEffect(() => {
    if (getCurrentUser() === null || getCurrentUser() === undefined){
      history.push('/forbiddenPage');
    }
    if (props.history.location.state === null || props.history.location.state === undefined){
        return;
    }
    getBookingEntityById(props.history.location.state.bookingEntityId).then(res => {
      console.log(res.data);
      setEntityBasicData(res.data);
      for(var time of availableTimes){
        if(time.available == true){
            setCheckedTime(time);
            break;
        }  
      }
      console.log("Prosao 1");
      let unaDates = []
      for(let unDate of res.data.allUnavailableDates)
          unaDates.push(new Date(unDate[0],unDate[1]-1,unDate[2],unDate[3],unDate[4]));
      
      console.log("Prosao 2");
      findNextAvailableDate(unaDates);
      setUnavailableDates(unaDates);
      console.log(unaDates);

      setLoading(false);
    }).catch(error => {
        setMessage(error.response.data);
        handleClick();
        history.goBack(2);
    });

    getPricelistByEntityId(props.history.location.state.bookingEntityId).then(res => {
      console.log(res.data);
      let pricel = res.data;
      console.log(getCurrentUser().userType);
      if(getCurrentUser().userType.name == "ROLE_SHIP_OWNER"){
          let captainService = {
              id:-1,
              serviceName:"Captain",
              price:100
          }
          pricel.additionalServices.push(captainService);
      }
      
      setPricelistData(pricel);

      setAdditionalServices(pricel.additionalServices);
      setStartAdditionalServices(pricel.additionalServices);
      setLoadingPricelist(false);
    }).catch(error => {
        setMessage(error.response.data);
        handleClick();
    });

  }, []);

  const isDateTimeUnavailable = (date, unavDates)=>{
    date.setHours(12);
    return unavDates.some(e =>{ 
        const date1WithoutTime = new Date(date.getTime());
        const date2WithoutTime = new Date(e.getTime());
        date1WithoutTime.setUTCHours(0, 0, 0, 0);
        date2WithoutTime.setUTCHours(0, 0, 0, 0);

        const date1 = new Date(date.getTime());
        const date2 = new Date(e.getTime());
        date1.setUTCHours(9,0,0,0);
        return date1WithoutTime.getTime() === date2WithoutTime.getTime() && date1 > date2;
    })
};

  const findNextAvailableDate=(unavDates)=>{
    var nextAvailableDate = new Date();
    var foundRange = false;
    console.log(unavDates);
    if(unavDates.length > 0)
        while(!foundRange){
            if(isDateTimeUnavailable(nextAvailableDate, unavDates)){
                nextAvailableDate = new Date(nextAvailableDate.getTime()+oneDay);
            }
            else
              foundRange = true;
        }
    let frd = fastResData;
    frd.startDate = nextAvailableDate;
    setFastResData(frd);
}

  const datePicker = <><TextField style={{margin:'10px 10px' }} onClick={()=>setOpenDate(!openDate)} label='Date picker' placeholder={`${format(fastResData.startDate, "dd.MM.yyyy.")}`} 
  value={`${format(fastResData.startDate, "dd.MM.yyyy.")}`}
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
          date={fastResData.startDate}
          onChange={(date)=>{
            let fastres= fastResData;
            fastres.startDate = date;
            setFastResData(fastResData);
             setOpenDate(false);}}
          minDate={new Date()}
          disabledDates={unavailableDates}
          editableDateInputs={true}
          />
      </div>
      }
  </>
  

  if (isLoading || isLoadingPricelist) { return <div className="App"><CircularProgress /></div> }

  return (
    <div style={{ backgroundColor: 'aliceblue', margin: '5%', padding: '1%', borderRadius: '10px', height: '100%' }} >
      <div style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '15%', padding: '1%', borderRadius: '10px', width: '15%' }} >
        Add Fast Reservation
      </div>
      <Box sx={{ marginTop: '1%', marginLeft: '11%', marginRight: '5%', width: '90%' }}
      component="form"
      onSubmit={handleSubmit(onFormSubmit)}>
        <Box
          sx={{
            '& .MuiTextField-root': { m: 1, width: '28ch' },
          }}
          style={{ display: "flex", flexDirection: "row"}}
        >
          
          <div style={{  display: "flex", flexDirection: "row", color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'left', backgroundColor: 'rgb(191, 230, 255)', marginLeft: '4%', padding: '1%', borderRadius: '10px', width: '30%', height: '100%', minWidth:"320px" }} >
          <CardHeader
                style={{marginTop:'20px'}}
                title={<div>
                  {getCurrentUser().userType.name == "ROLE_COTTAGE_OWNER"?
                  (<Tooltip title="Show Cottage"><img toolTip onClick={returnToBookingEntitieProfile} src={CottageOwner}></img></Tooltip>):(
                    <>
                      {getCurrentUser().userType.name == "ROLE_SHIP_OWNER"?
                      (<Tooltip title="Show Ship"><img onClick={returnToBookingEntitieProfile} src={ShipOwner}></img></Tooltip>):(
                        <>
                          {getCurrentUser().userType.name == "ROLE_INSTRUCTOR"?
                      (<Tooltip title="Show Adventure"><img onClick={returnToBookingEntitieProfile} src={Instructor}></img></Tooltip>):(
                          <></>
                        )}
                          </>
                        )}
                      </>
                    )}
                  <div style={{display:'flex'}}><h2>{entityBasicData.name}</h2></div>
                  </div>
                }
                subheader={
                <div>
                  <h3><LocationOnIcon/>{entityBasicData.address + ", " + entityBasicData.place.cityName + ", " + entityBasicData.place.zipCode}</h3>
                  <h3 style={{marginLeft:'7%'}}>{entityBasicData.place.stateName}</h3>
                  <div>
                    <h3 style={{marginLeft:'7%'}}>{"Cost Per Day: " + pricelistData.entityPricePerPerson + "€"}</h3>
                  </div>
                  <div>  
                    <IconButton onClick={showCalendarForEntity}>
                      <Chip icon={<CalendarMonthIcon />} label="Calendar" />
                    </IconButton></div>
                </div>}
                
            
            />
          </div>
          
          <div style={{ display: 'block', color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'left', backgroundColor: 'rgb(191, 230, 255)', marginLeft: '4%', marginBottom:"1%",padding: '1%', borderRadius: '10px', width: '40%', height: '100%', minWidth:"300px" }} >
            <table>
              <tr>
                <td>
                  {datePicker}
                </td>
              </tr>
              <tr>
                <td>
                <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label" style={{margin:"10px 10px"}}>Select time:</FormLabel>
                    {
                        <RadioGroup
                        style={{margin:"10px 20px"}}
                        defaultValue={checkedTime.value}
                        row
                        onChange={radioButtonChanged}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        {availableTimes.map((time,index)=>{
                            return <FormControlLabel value={time.value} control={<Radio />} label={time.text} disabled={!time.available}/>
                        })
                        }
                        
                    </RadioGroup>

                    }
                    
                </FormControl>
                </td>
              </tr>
              {entityBasicData.entityType != "ADVENTURE" && <><tr>
              <FormControl sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount" >Total Num Of Nights</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      size="small"
                      name="numNights"
                      type="number"
                      onChange={e => {
                        let data = fastResData;
                        let days = parseInt(e.target.value);
                        if (days === NaN) alert("Greska");
                        else {
                          data.totalNumLength = days;
                        }
                        setFastResData(data);
                      }}
                      placeholder="Total Num Of Nights"
                      startAdornment={<InputAdornment position="start">night</InputAdornment>}
                      label="Total Num Of Nights"
                      {...register("numNights", { required: true, min: 1, max: 100 })}
                    />
                  </FormControl>
              </tr>
              <tr>{errors.numNights && <p style={{ color: '#ED6663', fontSize:"10px" }}>Please check num of days between 1-100.</p>}</tr>
              </>
              }
              <tr>
                <FormControl sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Max Num Of People</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      size="small"
                      name="maxNumPeople"
                      type="number"
                      InputProps={{ inputProps: { min: 1, max: entityBasicData.entityType != "COTTAGE"?entityBasicData.maxNumOfPersons:50 } }}
                      onChange={e => {
                        let data = fastResData;
                        let people = parseInt(e.target.value);
                        if(entityBasicData.entityType != "COTTAGE" && entityBasicData.maxNumOfPersons<people)
                          e.target.value = entityBasicData.maxNumOfPersons;
                        if(people<0)
                          e.target.value = 0;
                        if (people === NaN) alert("Greska");
                        else {
                          data.numOfPeople = people;
                        }
                        

                        setFastResData(data);
                      }}
                      placeholder="Max Num Of People"
                      label="Max Num Of People"
                      startAdornment={<InputAdornment position="start"></InputAdornment>}
                      {...register("maxNumPeople", { required: true, min: 1, max: entityBasicData.entityType != "COTTAGE"?entityBasicData.maxNumOfPersons:50 })}
                    />
                  </FormControl>
              </tr>
              <tr>{errors.maxNumPeople && <p style={{ color: '#ED6663', fontSize:"10px" }}>Please check num of people between 1-{entityBasicData.entityType != "COTTAGE"?entityBasicData.maxNumOfPersons:50}.</p>}</tr>
               
              <tr>
                <td>
                  <FormControl sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">Cost Per Night</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      size="small"
                      name="cost"
                      type="number"
                      onChange={e => {
                        let data = fastResData;
                        let cos = parseFloat(e.target.value);
                        if (cos === NaN) alert("Greska");
                        else {
                          data.cost = cos;
                        }
                        setPricelistData(data);
                      }}
                      placeholder="Cost"
                      startAdornment={<InputAdornment position="start">€</InputAdornment>}
                      label="Cost Of Fast Reservation"
                      {...register("cost", { required: true, min: 1, max: 100000 })}
                    />
                  </FormControl>
                  
                  </td>
                
                <tr>{errors.cost && <p style={{ color: '#ED6663', fontSize:"10px" }}>Please check cost per between 1-100000€.</p>}</tr>
              
              </tr>
              <tr>
                <td>
                <AddingAdditionalServiceWithoutAmount addServ={additionalServices} addedServ={addedAdditionalServices} onDeleteChip={handleDeleteAdditionalServiceChip} onDeleteAddedChip={handleDeleteAddedAdditionalServiceChip} float="left" />
              
                </td>
              </tr>
              
            </table>

          </div>
          
        </Box>
      </Box>
      <Box style={{ display: "flex", flexDirection: "row" }}>
      <Button type="submit" onClick={handleSubmit(onFormSubmit)} variant="contained" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '33.5%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
          Save
      </Button>
        <Button variant="contained" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '2%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}
        onClick={() => {
          setValue(Date.now());
          reset(
              {
                numNights: 1,
                cost: 1,
                maxNumPeople:1
                
              }, {
              keepDefaultValues: false,
              keepErrors: true,
          }
          
          );
      }}
        >
          Reset
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
      </Box>

    </div>
  );
}