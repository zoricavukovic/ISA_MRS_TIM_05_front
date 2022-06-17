import React, { useState } from 'react'
import { Grid, Paper, Avatar, TextField, Button, Typography, Link, Checkbox, FormControlLabel } from '@mui/material'
import { makeStyles } from '@mui/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { getCurrentUser, login } from '../service/AuthService';
import { useHistory } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Login({setCurrentUser}) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [badInput, setBadInput] = useState(false);
    const history = useHistory();

    const makeChange = (event) => {
        setBadInput(false);
        setFormData(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }

    const goToRegistration = () => {
        history.push('/registration');
    }

    const submit = (event) => {
        event.preventDefault()
        console.log(formData);

        login(formData).then(res=>{
            console.log("Login success");
            console.log(getCurrentUser());
            setCurrentUser(getCurrentUser());
            let currentUser = getCurrentUser();
            if (currentUser.userType.name === "ROLE_COTTAGE_OWNER"){
                history.push("/cottages");
            }
            else if (currentUser.userType.name === "ROLE_SHIP_OWNER"){
                history.push("/ships");
            }
            else if (currentUser.userType.name === "ROLE_INSTRUCTOR"){
                history.push("/adventures");
            }
            else if (currentUser.userType.name === "ROLE_SUPER_ADMIN"){
                history.push("/adminHomePage");
            }
            else if (currentUser.userType.name === "ROLE_ADMIN") {
                if (currentUser.passwordChanged === false)
                    history.push("/changePassword");
                else
                    history.push("/adminHomePage");
            }
            else {
                history.push("/");
            }

        }).catch(res=>{
            console.log("Login failed");
            setBadInput(true);
        });
        // editUserById(userId, changedUserData).then(res=>{
        //     console.log("Uspesno!!");
        //     console.log(res.data);
        //     alert("Changes saved");
        // }).catch(res=>{
        //     console.log("Greska!!");
        // })

        // if(res)
        //     console.log("Dobro");
        // else
        //     setBadInput(true);

    };

    let useStyles = makeStyles({
        TextField: {
            border: badInput?"1px solid red":NaN
        },
        input: {
             color:badInput?'red':NaN
        }
    });


    const paperStyle = { padding: 20, height: '70vh', width: 400, margin: "5% auto" }
    const avatarStyle = { backgroundColor: 'rgb(244, 177, 77)' }
    let btnstyle = { margin: '10px 0', backgroundColor:'rgb(5, 30, 52)' }


    return (
        <div className='App'>
            <Grid >
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                        <h2>Log in</h2>
                    </Grid>
                    <form onSubmit={submit}>
                        <TextField label='Email' className={useStyles().TextField} inputProps={{ className: useStyles().input }} InputLabelProps={{ className: useStyles().input }} placeholder='Enter email' style={{ marginBottom: '10px' }} name="email" onChange={makeChange} fullWidth required />
                        <TextField label='Password' className={useStyles().TextField} inputProps={{ className: useStyles().input }} InputLabelProps={{ className: useStyles().input }} placeholder='Enter password' type='password' name="password" onChange={makeChange} fullWidth required />
                        {badInput?<Typography padding='5px' color='red'> The email or password you entered is incorrect.</Typography>:<></>}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Remember me"
                        />
                        <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Log in</Button>
                    </form>
                    {/* <Typography >
                     <Link href="#" >
                        Forgot password ?
                    </Link>
                    </Typography> */}
                    <Typography > Do you have an account?&nbsp;
                        <Button onClick={goToRegistration}>
                            <Link color='rgb(5, 30, 52)'>
                                Register
                            </Link>    
                        </Button>
                    </Typography>
                    
                </Paper>
            </Grid>
        </div>
    )
}