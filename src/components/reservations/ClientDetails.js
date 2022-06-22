import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import { CircularProgress, Divider} from "@mui/material";
import Grid from '@mui/material/Grid';
import EmailIcon from '@mui/icons-material/Email';
import { getUserById } from '../../service/UserService';
import DoNotDisturbOffIcon from '@mui/icons-material/DoNotDisturbOff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function ClientDetails(props) {
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(true);
    const [userData, setUserData] = useState({});
    const [message, setMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");
    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const showUserProfile = (event) => {
        event.preventDefault();
        history.push({
          pathname: "/userProfile",
          state: { userId: userData.id } 
      })
      };
    
    
    useEffect(() => {
      if (props === null || props === undefined){
        history.push('/login');
      }
      console.log(props.reservation);
      if(props.reservation.client == null)
        {
          setLoading(false);
          return;
        }
        getUserById(props.reservation.client.id).then(res => {
            setUserData(res.data);
            console.log(res.data);
            setLoading(false);
        }).catch(res => {
          return <div>This user isn't part of this system.</div>
        })
    }, [])
    if (isLoading) { return <div className="App"><CircularProgress /></div> }
    if(Object.keys(userData)==0){return <h1>Not yet reserved</h1>}
  return (
    <Grid button onClick={showUserProfile} textAlign="left" sx={{ width: "100%"}} style={{marginTop:"3%"}}>
    <Grid item xs={12} md={6}>
            <Card sx={{display: 'flex'}}>
           
                <CardContent sx={{flex: 1}}>
                    <Typography component="h2" variant="h4" style={{color: 'rgb(5, 30, 52)'}}>
                        {userData.firstName} {userData.lastName}
                    </Typography>
                    <Typography component="h2" variant="h6" style={{color: 'rgb(5, 30, 52)'}}>
                        <EmailIcon size="small" style={{color:'rgb(244, 177, 77)'}}></EmailIcon> {userData.email}
                    </Typography>
                    <Typography variant="subtitle1" style={{color: 'rgb(5, 30, 52)'}}>
                        <LocationOnIcon size="small" style={{color:'rgb(244, 177, 77)'}}></LocationOnIcon> {userData.address}, {userData.place.zipCode} {userData.place.cityName}, {userData.place.stateName}
                    </Typography>
                    <Divider style={{marginTop:"1%"}}/>
                    <Typography  component="h3" variant="h7" style={{color: 'rgb(5, 30, 52)'}}>
                        <EmojiEventsIcon size="small" style={{color:'rgb(244, 177, 77)'}}></EmojiEventsIcon> {userData.loyaltyProgram} : {userData.loyaltyPoints} loyalty points
                    </Typography>
                    <Divider style={{marginTop:"1%"}}/>
                    <Typography component="h3" variant="h7" style={{color: 'rgb(5, 30, 52)'}}>
                        <DoNotDisturbOffIcon size="small" style={{color:'rgb(244, 177, 77)'}}></DoNotDisturbOffIcon> Penalties: {userData.penalties}
                    </Typography>
                    <br/>
                    <Typography button onClick={showUserProfile} variant="subtitle1" style={{color: 'rgb(5, 30, 52)'}}>
                        More details...
                    </Typography>
                </CardContent>
                
            </Card>
    </Grid>
</Grid>

  );
}