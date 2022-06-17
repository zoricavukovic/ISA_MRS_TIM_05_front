
import React from "react";
import { useHistory } from "react-router-dom";
import Icon from "../../icons/icon.png";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Divider, Grid } from "@mui/material";
import Typography from '@mui/material/Typography';

export default function Registration() {

    const history = useHistory();
    //----------------------------------------------------
    const [open, setOpen] = React.useState(true);
 
    const handleClose = () => {
        setOpen(false);
    };
    //----------------------------------------------------------------

    function redirectToChooseAcc(){
        history.push('/chooseAccType');
    }

    function registerForm(){
        history.push({
            pathname: "/registrationForm",
            state: { userType:  "ROLE_CLIENT"}
        });
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            style={{ margin: '1% auto 1% auto', padding: '1%', width: '50%', borderRadius: '10px' }}
            fullWidth
            maxWidth="sm"
        >
            <Grid style={{ padding:'5%', display: "flex", flexDirection: "row", flexWrap: 'wrap' }} container alignItems="left" display="flex" flexDirection="column" justifyContent="center">
                <Avatar alt="Remy Sharp" src={Icon} />
                <Typography button gutterBottom sx={{ marginLeft: '2.5%', mt: '1%'}} style={{fontWeight:"bold", fontSize:'20px'}} color='rgb(5, 30, 52)'>
                Nature Booking
                </Typography>
                <Divider />
               
            </Grid>
            <Button onClick={registerForm}>I want to register as a client</Button>
            <Button onClick={redirectToChooseAcc}>I want to register as an owner</Button>
            <br />
        </Dialog >
    );
    
}