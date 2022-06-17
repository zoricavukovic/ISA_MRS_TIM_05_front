import React, { useEffect, useState, useRef } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import InsightsIcon from '@mui/icons-material/Insights';
import TextField from '@mui/material/TextField';
import Chart from "react-apexcharts";
import { CircularProgress } from "@mui/material";
import { getAllBookingEntitiesByOwnerId } from '../../service/BookingEntityService';
import { getCurrentUser } from '../../service/AuthService.js';
import { getAnalysisWeekByBookintEntityId } from '../../service/CalendarService';
import { getAnalysisMonthByBookintEntityId } from '../../service/CalendarService';
import { getAnalysisYearByBookintEntityId } from '../../service/CalendarService';
import GradeIcon from '@mui/icons-material/Grade';
import Autocomplete from '@mui/material/Autocomplete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Reports() {
    const [loading, setLoading] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState();
    const [categ, setCateg] = React.useState();

    const [timeChoosen, setTimeChoosen] = React.useState("week");
    function onChangeValueTime(event) {
      setTimeChoosen(event.target.value);
    }
    
    function DisplayAverageRate(props){
      return <div>
        <div style={{   width:'auto',
                        backgroundColor: 'aliceblue',
                        color: 'rgb(5, 30, 52)',
                        padding:'1%',
                        marginTop: '5%',
                        marginLeft:'7%',
                        marginRight:'70%',
                        border: '1px solid rgb(244, 177, 77)',
                        borderRadius: '10px'
                    }} 
        >
        <table>
            <tr>
                <th>{props.entity.data.name}</th>
            </tr>
            <tr>
                <td style={{fontWeight: 'bold',  fontSize: '1.5em'}}><GradeIcon style={{marginTop:'2%'}}/> {Math.round(props.entity.data.averageRating*100)/100}</td>
            </tr>
        </table>
            
    
        </div>
             
    </div>
    }

    const [chartsResLoading, setChartsResLoading] = React.useState(true);
    const [numOfRes, setNumOfRes] = React.useState([]);
    const [sumCosts, setSumCost] = React.useState([]);
    const [selectedEntity, setSelectedEntity] = React.useState();
    const [optionsBox, setOptionsBox] = React.useState([]);
    const [name, setName] = React.useState();

    useEffect(() => {

      getAllBookingEntitiesByOwnerId(getCurrentUser().id)
        .then(res => {
            if (res.data.length === 0)
                return;
            
            let optBox = [];
            let idSelectedEntity = -1;
            for (let opt of res.data){
              if (selectedEntity != undefined || selectedEntity != null){
                  if (opt.name === selectedEntity.label){
                    console.log(opt);
                    idSelectedEntity = opt.id;
                  }
              }
              optBox.push({'label': opt.name, 'id': opt.name, 'data': opt});
    
            }
            setOptionsBox(optBox);
            if (isLoading !== 1){
              setSelectedEntity(optBox[0]);
            }
            
            if (timeChoosen === "week"){
              if (isLoading !== 1){
              
                console.log(optBox[0].data.id);
                getAnalysisWeekByBookintEntityId(optBox[0].data.id).then( reservations => {
              
                  let cat = [];
                  let numOfReservation = [];
                  let sum = [];
                  for (let res of reservations.data){
                    console.log(res);
                      cat.push(res.textValue);
                      numOfReservation.push(res.numOfReservationPerWeek);
                      sum.push(res.sumCost);
                  }
                  
                  setCateg(cat);
                  setNumOfRes(numOfReservation);
                  setSumCost(sum);
                  setChartsResLoading(false);
                  
                })
            
              }else{
                console.log(idSelectedEntity);
                getAnalysisWeekByBookintEntityId(idSelectedEntity).then( reservations => {
                
                  let cat = [];
                  let numOfReservation = [];
                  let sum = [];
                  for (let res of reservations.data){
                      cat.push(res.textValue);
                      numOfReservation.push(res.numOfReservationPerWeek);
                      sum.push(res.sumCost);
                  }
                  
                  setCateg(cat);
                  setNumOfRes(numOfReservation);
                  console.log(numOfReservation);
                  setSumCost(sum);
                  setChartsResLoading(false);
                  
                })
              }
            }
            else if (timeChoosen === "month"){
              getAnalysisMonthByBookintEntityId(idSelectedEntity).then( reservations => {
                let cat = [];
                let numOfReservation = [];
                let sum = [];
                for (let res of reservations.data){
                    cat.push(res.textValue);
                    numOfReservation.push(res.numOfReservationPerMonth);
                    sum.push(res.sumCost);
                }
                
                setCateg(cat);
                setNumOfRes(numOfReservation);
                setSumCost(sum);
                setChartsResLoading(false);
                
              })
            }
            else if (timeChoosen === "year"){
              
              getAnalysisYearByBookintEntityId(idSelectedEntity).then( reservations => {
                let cat = [];
                let numOfReservation = [];
                let sum = [];
                for (let res of reservations.data){
                    cat.push(res.textValue);
                    numOfReservation.push(res.numOfReservationPerYear);
                    sum.push(res.sumCost);
                }
                
                setCateg(cat);
                setNumOfRes(numOfReservation);
                setSumCost(sum);
                setChartsResLoading(false);
                
              })
            }
            setIsLoading(1);
            setLoading(false);
        });
      }, [timeChoosen, name]);
  
    if (loading || chartsResLoading) return <><CircularProgress /></> 
    return (
        <div>
            <Container >
                <Box style={{marginTop:'2%', padding:'1%', borderRadius: '10px', display: "flex", flexWrap: 'wrap', flexDirection: "row"}} sx={{ bgcolor: 'aliceblue', width:'100%' }}>
                    <div style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', margin: '1%', marginLeft: '13.5%', padding: '1%', borderRadius: '10px', width: '15%', display: "flex", flexWrap: 'wrap', flexDirection: "row"}} >
                        <InsightsIcon/>
                        <div style={{marginTop:'1%', marginLeft:'3%'}}>Dashboard</div>
                        
                    </div>
                    <Autocomplete
                    id="selectedEntity"
                    size="small"
                    options={optionsBox}
                    sx={{ width: '250px' }}
                    defaultValue={selectedEntity}
                    style={{marginTop:'1%', marginLeft:'35%'}}
                    onChange={(event, newValue) => {
                      if (newValue != null && newValue != undefined && newValue != '') {
                        setSelectedEntity(newValue);
                        setName(newValue);

                    } else {
                      setSelectedEntity(optionsBox[0]);
                      setName(optionsBox[0]);
                    }
                    }}
                    renderInput={(params) => <TextField {...params} label="Select Entity" 
                                                  placeholder="Select entity"
                                                  
                                              />}
                    isOptionEqualToValue={(option, value) => option.label === value.label}
                    //{...register("place")}
                />
                </Box>
                <Box style={{ marginTop:'1%', marginLeft:'7%', padding:'1%', borderRadius: '10px'}}>
                    <div style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', float:'left', padding: '1%', borderRadius: '10px', width: '15%', display: "flex", marginLeft:"7%"}} >
                        <GradeIcon/>
                        <div style={{marginTop:'3%', marginLeft:'5%'}}>Avg. Rating</div>
                    </div>
                    
                      <DisplayAverageRate entity={selectedEntity}/>
                      <div style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', margin: '1%', marginLeft: '7%', padding: '1%', borderRadius: '10px', width: '30%'}} >
                        
                          <div style={{fontWeight: 'bold', textAlign: 'center', marginTop:'1%', marginLeft:'3%', display: "flex", flexWrap: 'wrap', flexDirection: "row"}}><AccessTimeIcon/> Choose Date Period For Report</div>
                          
                        <table onChange={onChangeValueTime}
                            style={{display: "flex", flexDirection: "row", flexWrap: 'wrap', marginLeft:"7%", marginTop:"1%", minWidth:'200px', color: 'rgb(5, 30, 52)'}}>
                            <tr>
                                <td><input type="radio" value="week" name="time" />Week</td>
                            </tr>
                            <tr>
                                <td><input type="radio" value="month" name="time" />Month</td>
                            </tr>
                            <tr>
                                <td><input type="radio" value="year" name="time" />Year</td>
                            </tr>
                          </table>
                        </div>
                     
                     
                      <div style={{display: "flex", flexDirection: "row", flexWrap: 'wrap', justifyContent:'left', marginLeft:"7%", marginTop:"1%", minWidth:'200px', color: 'rgb(5, 30, 52)'}}>
                      <Chart
                        options={
                          {
                            chart: {
                              id: "basic-bar",
                              foreColor:'rgb(5, 30, 52)'
                            },
                            xaxis: {
                              categories: categ
                            },
                            fill:{
                              colors: ['rgb(244, 177, 77)']
                            },
                            title:{
                              text:"Num Of Res Per " + timeChoosen[0].toUpperCase() + timeChoosen.slice(1),
                              align:'center',
                              margin:20,
                              offsetY:20,
                              style:{
                                fontSize:'18px'
                              }
                            }
                          }
                        }
                        series={[
                          {
                            name: "Num Of Res Per " + timeChoosen,
                            data: numOfRes
                          }
                        ]}
                        type="bar"
                        stacked= "false"
                        width="470"
                        zoom= {{
                          type: 'x',
                          enabled: true,
                          autoScaleYaxis: true
                        }}
                        toolbar={ {
                          autoSelected: 'zoom'
                        }}
                      />

<Chart
                        options={
                          {
                            chart: {
                              id: "basic-bar", 
                              foreColor:'rgb(5, 30, 52)',
                              colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800']
                            },
                            colors: ['rgb(5, 30, 52)'],
                            xaxis: {
                              categories: categ
                            },
                            fill:{
                              colors: ['rgb(244, 177, 77)']
                            },
                           
                            title:{
                              text:"Total Sum Per " + timeChoosen[0].toUpperCase() + timeChoosen.slice(1),
                              align:'center',
                              margin:20,
                              offsetY:20,
                              style:{
                                fontSize:'18px'
                              }
                            }
                          }
                        }
                        series={[
                          {
                            name: "Total Sum",
                            data: sumCosts
                          }
                        ]}
                        type="area"
                        stacked= "false"
                        width="470"
                        zoom= {{
                          type: 'x',
                          enabled: true,
                          autoScaleYaxis: true
                        }}
                        toolbar={ {
                          autoSelected: 'zoom'
                        }}
                      />
                    </div>
                      
                </Box>
                
            </Container>
            
        </div>

    );
}