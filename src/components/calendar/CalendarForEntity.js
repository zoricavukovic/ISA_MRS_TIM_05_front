import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import { indigo, teal, red } from '@mui/material/colors';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Grid, TextField, Typography } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { getCalendarValuesByBookintEntityId } from "../../service/CalendarService";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DialogContent, DialogTitle, Divider } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogContentText } from "@mui/material";
import { DialogActions } from "@mui/material";
import { useForm } from "react-hook-form";
import styles from './datePickerStyle.module.css';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useHistory } from "react-router-dom";
import ShipOwner from "../../icons/shipOwner.png";
import CottageOwner from "../../icons/cottageOwner.png";
import Instructor from "../../icons/instructor.png";
import Tooltip from '@mui/material/Tooltip';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    MonthView,
    Appointments,
    Toolbar,
    DateNavigator,
    TodayButton,
    Resources,
    AppointmentTooltip,
    CurrentTimeIndicator,
} from '@devexpress/dx-react-scheduler-material-ui';
import { addNewUnavailableDate, checkOverlapForUnavailableDate, setUnavailablePeriodAsAvailable } from "../../service/UnavailablePeriodService";
import { userLoggedInAsOwner } from "../../service/UserService";
import { propsLocationStateFound } from "../forbiddenNotFound/notFoundChecker";
import { getCurrentUser } from '../../service/AuthService.js';

const resources = [{
    fieldName: 'type',
    title: 'type',
    instances: [
        { id: 'fast reservation', text: 'fast reservation', color: indigo },
        { id: 'regular reservation', text: 'regular reservation', color: teal },
        { id: 'unavailable', text: 'unavailable', color: red },
    ]
}];

export default function CalendarForEntity(props) {


    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    const history = useHistory();
    const [data, setData] = useState();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [startDatePicker, setStartDatePicker] = useState(new Date());
    const [endDatePicker, setEndDatePicker] = useState(new Date());
    const [radioBtnTimeValue, setRadioBtnTimeValue] = React.useState('09:00');

    const [hiddenStartDateError, setHiddenStartDateError] = useState("none");
    const [hiddenEndDateError, setHiddenEndDateError] = useState("none");
    const [hiddenErrorDateBefore, setHiddenErrorDateBefore] = useState("none");
    const [overlapPeriod, setoverlapPeriod] = useState(null);

    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");


    const handleOpenDialog = () => {
        setOpenDialog(true);
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleOpenConfirmDialog = () => {
        setConfirmDialog(true);
    }
    const handleCloseConfirmDialog = () => {
        setConfirmDialog(false);
    }
    const handleCloseAlert = () => {
        setOpenAlert(false);
    }

    const sendUnavailableDateToServer = () => {
        let newPeriod = {
            "entityId": props.location.state.bookingEntityId,
            "startDate": createFormatedDateFromString(startDatePicker.toLocaleDateString()),
            "endDate": createFormatedDateFromString(endDatePicker.toLocaleDateString())
        };
        addNewUnavailableDate(newPeriod)
            .then(res => {
                setTypeAlert("success");
                setAlertMessage("Successfuly set new unavailable dates");
                setOpenAlert(true);
                handleCloseAfterAddingAndRefreshCalendar();
            })
            .catch(err => {
                setTypeAlert("error");
                setAlertMessage("Error happend on server. Check if there exist reservations on this period");
                setOpenAlert(true);
            }
            );

    }

    const handleCloseAfterAddingAndRefreshCalendar = () => {
        refreshPage();
        setConfirmDialog(false);
        setOpenDialog(false);
    }

    const checkStartDateSelected = () => {
        if (startDatePicker !== null && startDatePicker !== undefined && startDatePicker !== '') {
            setHiddenStartDateError("none");
            return true;
        } else {
            setHiddenStartDateError("block");
            return false;
        }
    }
    const checkEndDateSelected = () => {
        if (endDatePicker !== null && endDatePicker !== undefined && endDatePicker !== '') {
            setHiddenEndDateError("none");
            return true;
        } else {
            setHiddenEndDateError("block");
            return false;
        }
    }

    const createFormatedDateFromString = (string) => {
        let tokens = string.split("/");
        let month = tokens[0];
        let day = tokens[1];
        let year = tokens[2];
        if (month.length == 1)
            month = '0' + month;
        if (day.length == 1)
            day = '0' + day;
        return year + "-" + month + "-" + day + " " + radioBtnTimeValue;
    }


    const checkDateBefore = () => {
        let date1 = new Date(startDatePicker);
        let date2 = new Date(endDatePicker);
        if (date2 > date1) {
            setHiddenErrorDateBefore("none");
            return true;
        } else {
            setHiddenErrorDateBefore("block");
            return false;
        }

    }

    const onAddUnavailablePeriodSubmit = (data) => {
        if (!checkStartDateSelected() || !checkEndDateSelected())
            return;

        if (!checkDateBefore())
            return;


        let newPeriod = {
            "entityId": props.location.state.bookingEntityId,
            "startDate": createFormatedDateFromString(startDatePicker.toLocaleDateString()),
            "endDate": createFormatedDateFromString(endDatePicker.toLocaleDateString())
        };

        checkOverlapForUnavailableDate(newPeriod)
            .then(res => {
                if (res.data !== null && res.data !== undefined && res.data !== '') {
                    if (JSON.stringify(res.data) === JSON.stringify(overlapPeriod)) {
                        handleOpenConfirmDialog();
                    } else {
                        setoverlapPeriod(res.data);
                    }
                } else {
                    sendUnavailableDateToServer();
                }
            })

    }

    const [openModifyDialog, setOpenModifyDialog] = useState(false);
    const handleOnCloseModifyDialog = () => {
        setOpenModifyDialog(false);
    }
    const handleOnOpenModifyDialog = () => {
        setOpenModifyDialog(true);
    }


    useEffect(() => {
        if (overlapPeriod != null && overlapPeriod != undefined && overlapPeriod != '') {
            handleOpenConfirmDialog();
        }
    }, overlapPeriod);


    const onStartDateChangeDatePicker = (date) => {
        setStartDatePicker(date);
    }
    const onEndDateChangeDatePicker = (date) => {
        setEndDatePicker(date);
    }

    useEffect(() => {
        if (userLoggedInAsOwner(history) && propsLocationStateFound(props, history))
            refreshPage();
    }, []);

    const refreshPage = () => {
        getCalendarValuesByBookintEntityId(props.location.state.bookingEntityId)
            .then(res => {
                setData(res.data);
                setIsLoadingData(false);
            });
    }

    const handleSetAvailableDate = (item) => {
        let obj = {
            "entityId": props.location.state.bookingEntityId,
            "startDate": item.startDate,
            "endDate": item.endDate
        };
        setUnavailablePeriodAsAvailable(obj)
            .then(res => {
                setTypeAlert("success");
                setAlertMessage("Successfuly set period as available");
                setOpenAlert(true);
                refreshPage();
            })
            .catch(err => {
                setTypeAlert("error");
                setAlertMessage("Error happend on server. Can't set period as available");
                setOpenAlert(true);
            });
    }

    const returnToBookingEntitieProfile = (event) => {
        event.preventDefault();
        history.goBack();
      }


    if (isLoadingData) {
        return <div className="App">Loading...</div>
    }
    else {
        return (

            <Box
                style={{ margin: "1% 9% 1% 15%" }}
                alignItems="center"
                justifyContent="center"
            >
                <Box style={{ display: "flex", flexDirection: "row", margin: "1% auto 1% auto" }}>
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
                    <Button variant="contained" onClick={handleOpenDialog} style={{ color: 'rgb(5, 30, 52)', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
                        Add unavailable period
                    </Button>
                    <Button variant="contained" onClick={handleOnOpenModifyDialog} style={{ color: 'rgb(5, 30, 52)', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
                        Modify unavailable periods
                    </Button>
                </Box>

                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    style={{ margin: '1% auto 1% auto', padding: '1%', width: '100%', borderRadius: '10px' }}
                    fullWidth
                    maxWidth="xs"
                >
                    <DialogTitle>Add unavailable period</DialogTitle>
                    <Divider />
                    <br />
                    <DialogContent
                        style={{ height: '400px' }}
                    >
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit(onAddUnavailablePeriodSubmit)}
                            style={{ width: '100%' }}

                        >

                            <Grid
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                container
                                spacing={2}
                            >
                                <label className={styles.labelNames} for="startDatePicker" >Select start date:</label>
                                <Grid item xs={12} sm={12}>
                                    <DatePicker
                                        wrapperClassName={styles.datePicker}
                                        id="startDatePicker"
                                        selected={startDatePicker}
                                        onChange={onStartDateChangeDatePicker}
                                        minDate={new Date()}
                                        dateFormat='yyyy-MM-dd'
                                    />
                                </Grid>
                                <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenStartDateError }}>Please select start date.</p>
                                <Grid item xs={12} sm={12}>
                                    <FormControl>
                                        <FormLabel id="demo-controlled-radio-buttons-group"

                                        >
                                            <Typography variant="caption">Select the time from which the entity will not be available</Typography>
                                        </FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            value={radioBtnTimeValue}
                                            onChange={(event) => (setRadioBtnTimeValue(event.target.value))}
                                        >
                                            <FormControlLabel value="09:00" control={<Radio />} label="9 AM" />
                                            <FormControlLabel value="13:00" control={<Radio />} label="1 PM" />
                                            <FormControlLabel value="17:00" control={<Radio />} label="5 PM" />
                                            <FormControlLabel value="21:00" control={<Radio />} label="9 PM" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <br />
                                <br />
                                <label className={styles.labelNames} for="endDatePicker">Select end date:</label>
                                <Grid item xs={12} sm={12}>
                                    <DatePicker
                                        wrapperClassName={styles.datePicker}
                                        id="endDatePicker"
                                        selected={endDatePicker}
                                        minDate={(startDatePicker) ? (new Date().setDate(new Date(startDatePicker).getDate() + 1)) : (new Date())}
                                        onChange={onEndDateChangeDatePicker}
                                        dateFormat='yyyy-MM-dd'
                                    />

                                </Grid>
                                <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenEndDateError }}>Please select end date.</p>
                                <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenErrorDateBefore }}>End date should be greater than start date.</p>
                            </Grid>
                            <br />
                            <Divider />
                            <br />
                            <Box style={{ display: "flex", flexDirection: "row" }}>
                                <Button type="submit" onSubmit={handleSubmit(onAddUnavailablePeriodSubmit)} variant="contained" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '33.5%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
                                    Save
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '2%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}
                                    onClick={handleCloseDialog}
                                >
                                    Close
                                </Button>
                            </Box>
                        </Box>
                    </DialogContent>
                </Dialog>




                <Dialog
                    open={openModifyDialog}
                    onClose={handleOnCloseModifyDialog}
                    style={{ margin: '1% auto 1% auto', padding: '1%', width: '100%', borderRadius: '10px' }}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Modify unavailable periods</DialogTitle>
                    <Divider />
                    <DialogContent
                        style={{ height: '400px' }}
                    >
                        <Grid
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            container
                            spacing={2}
                        >
                            <Grid item xs={12} sm={12}>
                                {data.map((item, index) => (

                                    (item.type === "unavailable") ?
                                        (
                                            <div>
                                                <Box style={{ display: "flex", flexDirection: "row" }}>
                                                    <TextField
                                                        id="outlined-read-only-input"
                                                        label="Start date"
                                                        defaultValue={item.startDate}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                    -
                                                    <TextField
                                                        id="outlined-read-only-input"
                                                        label="End date"
                                                        defaultValue={item.endDate}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                    <Button
                                                        variant="contained"
                                                        style={{ color: 'white', fontSize:'9px', textAlign: 'center', backgroundColor: 'rgba(38,166,154,255)', marginLeft: '2%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}
                                                        onClick={() => { handleSetAvailableDate(item)}}
                                                    >
                                                        Set as available
                                                    </Button>
                                                </Box>
                                                <br />
                                            </div>
                                        ) : (<div></div>)
                                ))}
                            </Grid>
                            <br />
                            <Divider />
                            <br />
                            <Grid item xs={12} sm={12}>
                                <Button
                                    variant="contained"
                                    style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '2%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}
                                    onClick={handleOnCloseModifyDialog}
                                >
                                    Close
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>


                <Dialog
                    open={confirmDialog}
                    onClose={handleCloseConfirmDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Confirm adding unavailable dates"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {
                                (overlapPeriod !== undefined && overlapPeriod !== '' && overlapPeriod !== null) ?
                                    (<div>
                                        It looks like there are some unavailable dates that overlap with this dates.
                                        Your entity now won't be available from {overlapPeriod.startDate} to {overlapPeriod.endDate}.
                                        Do you want to proceed?
                                    </div>) :
                                    (<div></div>)
                            }
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={sendUnavailableDateToServer} autoFocus>
                            Yes
                        </Button>
                        <Button onClick={handleCloseConfirmDialog}>No</Button>
                    </DialogActions>
                </Dialog>


                <Paper>
                    {console.log(data)}
                    <Scheduler
                        data={data}
                    >
                        <ViewState
                            defaultCurrentDate={new Date()}
                        />
                        <MonthView />
                        <Toolbar />
                        <DateNavigator />
                        <TodayButton />
                        <Appointments
                        />
                        <AppointmentTooltip
                            showCloseButton
                        />
                        <Resources
                            data={resources}
                        />
                        <CurrentTimeIndicator
                            shadePreviousCells
                            shadePreviousAppointments
                        />
                    </Scheduler>
                </Paper>

                <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
                    <Alert onClose={handleCloseAlert} severity={typeAlert} sx={{ width: '100%' }}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Box>
        );
    }
}