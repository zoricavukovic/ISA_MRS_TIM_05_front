
import React, { useEffect, useState, useRef } from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { getCurrentUser, setPasswordChangedForUser } from "../service/AuthService";
import { setNewPassword } from "../service/UserService";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


export default function ChangePassword() {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const history = useHistory();

    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");

    const currentPassword = useRef({});
    currentPassword.current = watch("currentPassword", "");

    const newPassword = useRef({});
    newPassword.current = watch("newPassword", "");

    const [show, setShow] = React.useState({
        showCurrentPassword: false,
        showNewPassword: '',
    });

    const handleClose = (_event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    const handleClickShowCurrentPassword = () => {
        setShow({
            ...show,
            showCurrentPassword: !show.showCurrentPassword,
        });
    };

    const handleClickShowNewPassword = () => {
        setShow({
            ...show,
            showNewPassword: !show.showNewPassword,
        });
    };

    const onFormSubmit = data => {
        let request = {
            id: getCurrentUser().id,
            currPassword: data.currentPassword,
            newPassword: data.newPassword
        }
        setNewPassword(request)
            .then(res => {
                setTypeAlert("success");
                setAlertMessage(res.data);
                setOpenAlert(true);
                setPasswordChangedForUser();
            })
            .catch(err => {
                setTypeAlert("error");
                setAlertMessage(err.response.data);
                setOpenAlert(true);
            });
    }

    useEffect(() => {
        if (getCurrentUser() === null || getCurrentUser() === undefined) {
            history.push('/login');
        }
    }, []);

    return (
        <div style={{ margin: '10% 40% 1% 40%', padding: '1%', borderRadius: '10px', height: '40%' }} >

            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onFormSubmit)}
            >
                <FormControl sx={{ m: 1, width: '250px' }} variant="standard">
                    <InputLabel>Type current password</InputLabel>
                    <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={show.showCurrentPassword ? 'text' : 'password'}
                        placeholder="Type current password"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowCurrentPassword}
                                >
                                    {show.showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        {...register("currentPassword", {
                            required: "You must specify a password",
                            maxLength: {
                                value: 50,
                                message: "Password cant be longer than 50 characters"
                            }
                        })}
                    />
                </FormControl>
                {errors.currentPassword && <p style={{ color: '#ED6663' }}>{errors.currentPassword.message}</p>}

                <FormControl sx={{ m: 1, width: '250px' }} variant="standard">
                    <InputLabel>Type new password</InputLabel>
                    <Input
                        id="newPassword"
                        name="newPassword"
                        type={show.showNewPassword ? 'text' : 'password'}
                        placeholder="Type new password"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowNewPassword}
                                >
                                    {show.showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        {...register("newPassword", {
                            validate: value =>
                                value !== currentPassword.current || "Please choose different password",
                            required: "You must specify a password",
                            minLength: {
                                value: 8,
                                message: "Password must have at least 8 characters"
                            }
                        })}
                    />
                </FormControl>
                {errors.newPassword && <p style={{ color: '#ED6663' }}>{errors.newPassword.message}</p>}

                <FormControl sx={{ m: 1, width: '250px' }} variant="standard">
                    <InputLabel>Retype new password</InputLabel>
                    <Input
                        id="retypedPassword"
                        name="retypedPassword"
                        type="password"
                        placeholder="Retype password"
                        {...register("retypedPassword", {
                            validate: value =>
                                value === newPassword.current || "The passwords do not match"
                        })}
                    />
                </FormControl>
                {errors.retypedPassword && <p style={{ color: '#ED6663' }}>{errors.retypedPassword.message}</p>}
                <Button type="submit" onSubmit={handleSubmit(onFormSubmit)} variant="contained" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '33.5%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
                    Save
                </Button>
                <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={typeAlert} sx={{ width: '100%' }}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </div>
    );
}