import React, { useState, useEffect } from 'react'
import { Grid, Paper, Avatar, TextField, Button, Typography, Link, Checkbox, FormControlLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useHistory, useParams} from 'react-router-dom';
import VerifiedIcon from "../../icons/verified.png";
import { EmailOutlined } from '@mui/icons-material';
import { activateAccount } from '../../service/UserService';

export default function AcceptedAccount() {
    const {email} = useParams();
    const history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const [status, setStatus] = useState();

    const paperStyle = { padding: 20, height: '70vh', width: 400, margin: "5% auto" }
 
    function goToLogin(){
        history.push('/login');
    }

    useEffect(() => {
        console.log(email);
        if (EmailOutlined===null || email==="" || email===undefined) {
          return;
        }
        activateAccount(email)
        .then(res => {
            setStatus(1);
            setLoading(false);
        })
        .catch(res => {
            setStatus(0);
            setLoading(false);
        });
      }, []);

    if (isLoading) {
       return <div className="App">Loading...</div>
    }
    return (
        <div className='App'>
        {status === 1 ? ( 
            <Grid >
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <img src={VerifiedIcon}></img>
                        <h2>Account Activated</h2>
                        <br></br>
                        <br></br>
                        <h3>Hi, </h3>
                        <br></br>
                        <h4>Thank you, your email has been verified. Your account is now active. </h4>
                        <h4>Please use the link below to login to your account. </h4>
                        <br></br>
                        <button onClick={goToLogin} style={{ width:'70%', color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'aliceblue', padding: '3%', borderRadius: '10px' }}>
                            <h2> LOGIN TO YOUR ACCOUNT </h2>
                        </button>
                       
                    
                    </Grid>
                    <br></br>
                    <br></br>
                    <Grid align='center'>
                        <h4 color='rgb(5, 30, 52)' justifyContent="center">Thank you for choosing Booking App.</h4>
                    </Grid>
                </Paper>
            </Grid>
        ):(
            <Grid>
                 <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        
                        <h2>This email is already activated or not exist.</h2>
                    
                    </Grid>
                    
                </Paper>
            </Grid>
        )}
        </div>
    )
}