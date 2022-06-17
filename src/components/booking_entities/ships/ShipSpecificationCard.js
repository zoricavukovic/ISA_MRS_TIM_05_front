import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useForm } from "react-hook-form";
import CrewIcon from "../../../icons/crew.png";
import CaptainIcon from "../../../icons/captain.png";

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ShipSpecificationCard(props) {

  return (
    <Box
      sx={{ ml: '6%', width: '100%', maxWidth: 350, bgcolor: 'background.paper' }}
    >
      <Box >
        <Divider sx={{ mb: '5%'}} flexItem variant="middle" color='rgb(5, 30, 52)' style={{borderBottomWidth: 2, borderRadius:"10px"}}/>
           
        <Grid style={{ display: "flex", flexDirection: "row", flexWrap: 'wrap' }} container alignItems="left" display="flex" flexDirection="column" justifyContent="left">
            <img src={CrewIcon}></img>
            <table style={{float:"left"}}>
                <tr><th style={{float:"left", fontSize:"12px", fontWeight:"normal"}} color='rgb(5, 30, 52)'>GUESTS</th></tr>
  <tr><td style={{float:"left", fontSize:"17px", fontWeight:"bold"}} color='rgb(5, 30, 52)'>{props.ship.maxNumOfPersons}</td></tr>
            </table>
            <Divider sx={{ ml: '3%', mr:'3%'}} orientation="vertical" flexItem variant="middle" />
            <img src={CaptainIcon}></img>
            <table style={{float:"left"}}>
                <tr><th style={{float:"left", fontSize:"12px", fontWeight:"normal"}} color='rgb(5, 30, 52)'>CREW</th></tr>
                <tr><td style={{float:"left", fontSize:"17px", fontWeight:"bold"}} color='rgb(5, 30, 52)'>1</td></tr>
            </table>
        </Grid>
        <Divider sx={{ mt: '7%'}} flexItem variant="middle" color='rgb(5, 30, 52)' style={{borderBottomWidth: 2, borderRadius:"10px"}}/>
        <Typography gutterBottom sx={{ marginLeft: '2.5%', mt: '5%'}} style={{fontWeight:"bold"}} color='rgb(5, 30, 52)'>
          SPECIFICATION
        </Typography>
        <Typography style={{ display: "flex", flexDirection: "row", flexWrap: 'wrap',fontWeight:"bold" }} container alignItems="left" display="flex" flexDirection="row" justifyContent="left" gutterBottom sx={{ marginLeft: '2.5%', mt: '5%'}} color='rgb(5, 30, 52)'>
            <table >
                <tr>
                    <th style={{fontSize:"12px", fontWeight:"normal"}} color='rgb(5, 30, 52)'>LENGTH</th>
                </tr>
            </table>
            <table style={{width:"100%"}}>
                <tr>
                    <th float="right" style={{fontSize:"17px", fontWeight:"bold", marginRight:"10%", float:"right"}} sx={{ marginLeft: '2.5%'}} color='rgb(5, 30, 52)'>{props.ship.length}m</th>
                </tr>
            </table>
            
        </Typography>
        <Typography style={{ display: "flex", flexDirection: "row", flexWrap: 'wrap', fontWeight:"bold" }} container alignItems="left" display="flex" flexDirection="row" justifyContent="left" gutterBottom sx={{ marginLeft: '2.5%', mt: '5%'}}  color='rgb(5, 30, 52)'>
            <table >
                <tr>
                    <th justifyContent="left" style={{fontSize:"12px", fontWeight:"normal", width:"100%"}} color='rgb(5, 30, 52)'>MAX SPEED</th>
                </tr>
            </table>
            <table style={{width:"100%"}}>
                <tr>
  <th style={{fontSize:"17px", fontWeight:"bold", marginRight:"10%", float:"right"}} sx={{ marginLeft: '2.5%'}} color='rgb(5, 30, 52)'>{props.ship.maxSpeed}</th>
                </tr>
            </table>
            
        </Typography>
        <Typography style={{ display: "flex", flexDirection: "row", flexWrap: 'wrap', fontWeight:"bold" }} container alignItems="left" display="flex" flexDirection="row" justifyContent="left" gutterBottom sx={{ marginLeft: '2.5%', mt: '5%'}} color='rgb(5, 30, 52)'>
            <table >
                <tr>
                    <th style={{fontSize:"12px", fontWeight:"normal"}} color='rgb(5, 30, 52)'>ENGINE</th>
                </tr>
            </table>
            <table style={{width:"100%"}}>
                <tr>
  <th float="right" style={{fontSize:"12px", fontWeight:"bold", marginRight:"10%", float:"right"}} sx={{ marginLeft: '2.5%'}} color='rgb(5, 30, 52)'>{props.ship.engineNum + " " + props.ship.enginePower + "kW"}</th>
                </tr>
            </table>
            
        </Typography>
        
      </Box>
    </Box>
  );
}