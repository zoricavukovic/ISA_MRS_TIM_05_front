import React, { useState } from "react";
import Button from '@mui/material/Button';
import { DialogContent, DialogTitle} from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogActions } from "@mui/material";
import Alert from '@mui/material/Alert';
import { logicalDeleteUserById } from "../../../service/UserService";
import { Snackbar } from "@mui/material";
import { TextField } from "@mui/material";
import { DialogContentText } from "@mui/material";
import { getCurrentUser } from "../../../service/AuthService";


export default function ConfirmPassDialog(props)  {

    const [password, setPassword] = useState("");
    const onPasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const [openAlertMessage, setOpenAlertMessage] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");

    const handleCloseAlert = (_event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlertMessage(false);
    };


    const logicalDeleteUserRequest = () => {
        console.log("ussao za brisanje");
        console.log(props.selectedId);
        if (props.selectedId === null) {
            props.handleCloseConfirmPassDialog();
            return;
        }
        logicalDeleteUserById(props.selectedId, getCurrentUser().id, password).then(res => {
            setPassword("");
            setTypeAlert("success");
            setMessage("Successfully deleted user.");
            setOpenAlertMessage(true);
        }).catch(res => {
            setPassword("");
            setTypeAlert("error");
            setMessage(res.response.data);
            setOpenAlertMessage(true);
        });
    }

    return (
        <div>
            <Dialog open={props.openedConfirmPassDialog} onClose={props.handleCloseConfirmPassDialog}>
                <DialogTitle>Confirm Deleting</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To delete this user, please enter your password for security reasons.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        value={password}
                        onChange={onPasswordChange}
                        id="name"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleCloseConfirmPassDialog}>Cancel</Button>
                    <Button onClick={logicalDeleteUserRequest}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openAlertMessage} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={typeAlert} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
