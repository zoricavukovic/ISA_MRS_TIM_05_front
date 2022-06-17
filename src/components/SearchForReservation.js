
import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm } from "react-hook-form";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from "date-fns";
import { getAllPlaces } from "../service/PlaceService.js";
import { getCurrentUser } from "../service/AuthService.js";
import { ControlledRating } from "./Rating.js";
import { useHistory } from "react-router-dom";
import { CircularProgress, Grid, InputAdornment } from "@mui/material";
import { DateRangeOutlined, Euro, FilterList, Person, Place, Restore } from "@mui/icons-material";
import { DateRange, Calendar } from "react-date-range";
import { Search } from "@material-ui/icons";

export default function SearchForReservation({setSearchParams,setFilterParams, type}){
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register:register2, handleSubmit:handleSubmit2, reset:reset2, formState: { errors:errors2 } } = useForm();
  const [openDate,setOpenDate] = useState(false);
  const [openFilter,setOpenFilter] = useState(false);
  const [resetKey,setResetKey] = useState(new Date());
  const [places, setPlaces] = React.useState([]);
  const [isLoadingPlace, setLoadingPlace] = useState(true);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [ratingValue, setRatingValue] = React.useState('');
  const [hover, setHover] = React.useState(-1);
  const history = useHistory();


  const oneDay = 60 * 60 * 24 * 1000;
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + oneDay),
    key: 'selection',
  });
  

  useEffect(() => {
      getAllPlaces()
          .then(res => {
              setPlaces(res.data);
              setLoadingPlace(false);
          })
  }, [])

  const onSearch = data => {
    console.log("Search");
    data.placeId = selectedPlaceId;
    if(type !== "adventure"){
      selectionRange.startDate.setHours(12);
      selectionRange.endDate.setHours(12);
      data.startDate = selectionRange.startDate;
      data.endDate = selectionRange.endDate;
    }
    else{
      startDate.setHours(12);
      data.startDate = startDate;
      data.endDate = null;
    }
   
    if(data.numOfPersons != null)
      data.numOfPersons = parseInt(data.numOfPersons);
    if(data.numOfPersons === "")
      data.numOfPersons = null;
    console.log(data);
    setSearchParams(data);
  }
  const resetFn = data => {
    setFilterParams({minCost:NaN, maxCost:NaN, rating:null});
    reset();
    reset2();
    setResetKey(new Date());
    setSelectedPlaceId(null);
    setRatingValue('');
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + oneDay),
      key: 'selection',
    });
    setStartDate(new Date());
    setSearchParams({});
  }

  const toggleFilter = data =>{
    if(!openFilter == false)
      setFilterParams({minCost:NaN, maxCost:NaN, rating:null});
    setOpenFilter(!openFilter);
  }

  const onFilter = data =>{
    data.minCost = parseInt(data.minCost);
    data.maxCost = parseInt(data.maxCost);
    data.rating = ratingValue;
    console.log(data);
    if(data.minCost < data.maxCost || isNaN(data.minCost) || isNaN(data.maxCost)){
      setFilterParams(data);
    }
  }

  const onChangeFn = (event, newValue) => {
    setRatingValue(newValue);
  }
  const onChangeActiveFn = (event, newHover) => {
    setHover(newHover);
  }
  let allPlacesList;
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
    allPlacesList = newArray;
  }

  const  handleSelect=(ranges)=>{
    setSelectionRange(ranges.selection);
    var difference = ranges.selection.endDate.getTime() - ranges.selection.startDate.getTime();
    var daysBetweenDates = Math.ceil(difference/(1000*3600*24));
    console.log(daysBetweenDates);
    if(daysBetweenDates == 0)
        daysBetweenDates = 1;
    
  };

  const handleDateChange=(event)=>{
    console.log(event.target.value);

  }

  const style = {
    TextFieldInputProps:{
      padding: '6px'
    }
  };

  const dateRangePicker = <><TextField style={{/*margin:'10px 10px'*/ }} onClick={()=>setOpenDate(!openDate)} label='Date range' placeholder={`${format(selectionRange.startDate, "dd.MM.yyyy.")} to ${format(selectionRange.endDate, "dd.MM.yyyy.")}`} 
                              value={`${format(selectionRange.startDate, "dd.MM.yyyy.")} to ${format(selectionRange.endDate, "dd.MM.yyyy.")}`}
                              InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <DateRangeOutlined />
                                    </InputAdornment>
                                  )
                                }}
                              size="small"
                                  />
                                  {openDate && <div style={{
                                          position:"absolute",
                                          zIndex:99999,
                                          backgroundColor:"white",
                                          border:"1px solid rgb(5, 30, 52)"
                                      }}
                                      >
                                      <DateRange
                                        onBlur={()=>setOpenDate(!openDate)}
                                        editableDateInputs={true}
                                        ranges={[selectionRange]}
                                        onChange={handleSelect}
                                        minDate={new Date()}
                                      />
                                    </div>
                                  }
                          </>
  const [startDate, setStartDate] = useState(new Date());

  const handleDatePick = (date) =>{
    console.log("Usao u picker");
    setStartDate(date); 
    setOpenDate(false);
  }

  const datePicker = <><TextField style={{/*margin:'10px 10px'*/ }} onClick={()=>setOpenDate(!openDate)} label='Date picker' placeholder={`${format(startDate, "dd.MM.yyyy.")}`} 
                          value={`${format(startDate, "dd.MM.yyyy.")}`}
                          InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <DateRangeOutlined />
                                </InputAdornment>
                              )
                            }}
                          size="small"
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
                                    date={startDate}
                                    onChange={handleDatePick}
                                  />
                                </div>
                              }
                        </>


  if(isLoadingPlace){
    return <CircularProgress/>

  }
  return (
    <div className="header" key={resetKey}>
      <div style={{ padding: "10px", margin: "20px auto", marginBottom:'0px', width: "55%", backgroundColor: "aliceblue", borderRadius: "5px" }}>
                {getAllPlacesForTheList()}
          <form onSubmit={handleSubmit(onSearch)}>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }} alignItems="center" justifyContent="center">
            <Grid item xs="auto" >
                {type === "adventure"?datePicker:dateRangePicker}
              </Grid>
              <Grid item xs="auto">
                <Autocomplete
                    disablePortal
                    id="place"
                    size="small"
                    options={allPlacesList}
                    sx={{ width: '250px' }}
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
                    isOptionEqualToValue={(option, value) => option.label === value.label}
                    //{...register("place")}
                />
              </Grid>
              <Grid item xs="auto">
                                  <TextField
                                      name="numOfPersons"
                                      id="numOfPersons"
                                      type="number"
                                      label="Number Of Persons"
                                      placeholder="-"
                                      InputProps={{ 
                                        inputProps: { min: 1, max: 50 } ,
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <Person/>
                                          </InputAdornment>
                                        )
                                      }}
                                      size="small"
                                      style={{ width: '200px' }}
                                      {...register("numOfPersons", { min: 1, max: 100000 })}
                                  />
                                </Grid>
                <Grid item xs="auto">
                  <Button  type="submit" label="Extra Soft" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', borderRadius: '10px', margin: '1%', backgroundColor: 'rgb(244, 177, 77)' }}>
                      <Search />Search
                  </Button>
                </Grid>
                <Grid item xs="auto">
                  <Button onClick={toggleFilter} type="button" label="Extra Soft" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', borderRadius: '10px', margin: '1%', backgroundColor: 'rgb(244, 177, 77)' }}>
                    <FilterList/>Filter
                  </Button>
                </Grid>
                <Grid item xs="auto">
                  <Button onClick={resetFn} type="button" label="Extra Soft" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', borderRadius: '10px', margin: '1%', backgroundColor: 'rgb(244, 177, 77)' }}>
                      <Restore/>Reset
                  </Button>
                </Grid>
            </Grid>
          </form>
       </div>
       {openFilter && <div style={{margin:'5px auto', width:'33%', backgroundColor: "aliceblue", borderRadius: "5px", padding:'11px'}}>
                              <form onSubmit={handleSubmit2(onFilter)}>
                              <Grid container rowSpacing={2} alignItems="center" justifyContent="center" columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                                
                                <Grid  item sx='auto'>
                                    <TextField
                                          name="minCost"
                                          id="minCost"
                                          type="number"
                                          InputProps={{ inputProps: { min: 0, max: 1000000 },
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <Euro/>
                                                          </InputAdornment>
                                                        )
                                          }}
                                          size="small"
                                          label="Min Cost"
                                          placeholder="-"
                                          style={{ width: '200px' }}
                                          {...register2("minCost", { min: 0, max: 100000 })}
                                      />
                                </Grid>
                                <Grid item sx='auto'>
                                  <TextField
                                        name="maxCost"
                                        id="maxCost"
                                        type="number"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0, max: 1000000 },
                                                      startAdornment: (
                                                        <InputAdornment position="start">
                                                          <Euro/>
                                                        </InputAdornment>
                                                      ) 
                                        }}
                                        label="Max Cost"
                                        placeholder="-"
                                        style={{ width: '200px' }}
                                        
                                        {...register2("maxCost", { min: 0, max: 100000 })}
                                    />
                                  
                                </Grid>     
                                <Grid item sx='auto'>
                                  <ControlledRating onChange={onChangeFn}/>
                                </Grid>
                                <Grid item xs="auto">
                                  <Button type="submit" label="Extra Soft" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', borderRadius: '10px', margin: '1%', backgroundColor: 'rgb(244, 177, 77)' }}>
                                      Apply
                                  </Button>
                                </Grid>
                              </Grid>
                              </form>
                            </div>
            }
    </div>
  );
};
