import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogActions } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { getCurrentSystemRevenuePercentage, saveNewSystemRevenuePercentage, getSystemRevenueForPeriod, getSystemRevenueAll } from "../../service/SystemRevenuePercentagesService";
import { userLoggedInAsSuperAdminOrAdminWithResetedPassword } from "../../service/UserService";
import { Typography } from "@mui/material";
import { Divider, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { FormControl } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import EuroIcon from '@mui/icons-material/Euro';
import "react-datepicker/dist/react-datepicker.css";
import styles from '../calendar/datePickerStyle.module.css';
import DatePicker from "react-datepicker";
import Chart from "react-apexcharts";
import { setDefaultLocale } from "react-datepicker";


export default function SystemRevenue() {

    const history = useHistory();
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [open, setOpen] = React.useState(false);
    const [systemRevenuePercentage, setSystemRevenuePercentage] = useState();
    const [isLoadingSystemRevenuePercentage, setIsLoadingSystemRevenuePercentage] = useState(true);

    const [systemRevenueInPeriod, setSystemRevenueInPeriod] = useState();
    const [isLoadingSystemRevenueInPeriod, setIsLoadingSystemRevenueInPeriod] = useState(true);


    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");


    //----------------------------------------------------------------

    const [startDatePicker, setStartDatePicker] = useState(new Date());
    const [endDatePicker, setEndDatePicker] = useState(new Date());
    const [hiddenStartDateError, setHiddenStartDateError] = useState("none");
    const [hiddenEndDateError, setHiddenEndDateError] = useState("none");
    const [hiddenErrorDateBefore, setHiddenErrorDateBefore] = useState("none");

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
        return year + "-" + month + "-" + day;
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

    const onStartDateChangeDatePicker = (date) => {
        setStartDatePicker(date);
    }
    const onEndDateChangeDatePicker = (date) => {
        setEndDatePicker(date);
    }
    //------------------------------------------------------------------


    let series = [];
    const options = {
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: ['Cottages', 'Adventures', 'Ships'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };


    const searchRevenueInPeriod = (date) => {
        if (!checkStartDateSelected() || !checkEndDateSelected())
            return;

        if (!checkDateBefore())
            return;

        const startDate = createFormatedDateFromString(startDatePicker.toLocaleDateString());
        const endDate = createFormatedDateFromString(endDatePicker.toLocaleDateString());

        setIsLoadingSystemRevenueInPeriod(true);
        getSystemRevenueForPeriod(startDate, endDate).then(res => {
            setSystemRevenueInPeriod(res.data);
            setIsLoadingSystemRevenueInPeriod(false);
        })

    }


    const handleOpenRevenueDialog = () => {
        setOpen(true);
    }
    const handleCloseRevenueDialog = () => {
        loadSystemPercentage();
        setOpen(false);
        setOpenAlert(false);
    }

    const onFormSubmit = data => {
        let obj = {
            percentage: data.revenuePercentage,
        };
        saveNewSystemRevenuePercentage(obj)
            .then(res => {
                setTypeAlert("success");
                setAlertMessage("Successfully set new system revenue percentage");
                setOpenAlert(true);
            })
            .catch(err => {
                setTypeAlert("error");
                setAlertMessage("Error happened on server. Please try again.");
                setOpenAlert(true);
            });
    }

    const loadSystemPercentage = () => {
        setIsLoadingSystemRevenuePercentage(true);
        getCurrentSystemRevenuePercentage().then(res => {
            setSystemRevenuePercentage(res.data);
            setIsLoadingSystemRevenuePercentage(false);
        });
    }
    const loadRevenueInTotal = () => {
        setIsLoadingSystemRevenueInPeriod(true);
        getSystemRevenueAll().then(res => {
            setSystemRevenueInPeriod(res.data);
            setIsLoadingSystemRevenueInPeriod(false);
        })
    }

    useEffect(() => {
        if (userLoggedInAsSuperAdminOrAdminWithResetedPassword(history)) {
            loadSystemPercentage();
            loadRevenueInTotal();
        }
    }, []);

    if (isLoadingSystemRevenuePercentage || isLoadingSystemRevenueInPeriod) {
        return <div>Loading...</div>
    }
    else {
        {series = [systemRevenueInPeriod.cottagesRevenue, systemRevenueInPeriod.adventuresRevenue, systemRevenueInPeriod.shipsRevenue ]}
        return (
            <div style={{ margin: "1% 5% 1% 20%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ backgroundColor: 'aliceblue', borderRadius: '10px' }}>
                    The percentage that the system takes
                    <br />
                    <Button variant="contained" onClick={handleOpenRevenueDialog} style={{ color: 'rgb(5, 30, 52)', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
                        {systemRevenuePercentage.percentage} %
                    </Button>
                </div>

                <Dialog open={open} onClose={handleCloseRevenueDialog} sm>
                    <DialogTitle>
                        <Typography variant="h5" align="center">System revenue percentage</Typography>
                    </DialogTitle>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit(onFormSubmit)}
                        style={{ width: '100%' }}
                    >
                        <DialogContent>
                            <Divider />
                            <br />
                            <br />
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                <EuroIcon style={{ fontSize: "40px", color: "rgb(244, 177, 77)" }} />
                                <div>
                                    <FormControl sx={{ m: 1 }}>
                                        <InputLabel>System revenue percentage</InputLabel>
                                        <OutlinedInput
                                            size="small"
                                            name="revenuePercentage"
                                            type="number"
                                            id="revenuePercentage"
                                            defaultValue={systemRevenuePercentage.percentage}
                                            placeholder="System revenue percentage"
                                            label="System revenue percentage"
                                            {...register("revenuePercentage", {
                                                required: "Specify system revenue percentage",
                                                validate: value =>
                                                    value.toString() != systemRevenuePercentage.percentage.toString() ||
                                                    "Please select different value",
                                                min: {
                                                    value: 1,
                                                    message: "Min value of percentages is 1%"
                                                },
                                                max: {
                                                    value: 90,
                                                    message: "Max value of percentages is 90%"
                                                }
                                            })}
                                        />
                                    </FormControl>
                                    {errors.revenuePercentage && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.revenuePercentage.message}</p>}
                                </div>
                            </div>
                            <br />
                            <br />
                            <Divider />
                        </DialogContent>
                        <DialogActions>
                            <Button type="submit" onSubmit={handleSubmit(onFormSubmit)} variant="contained">Save</Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    reset(
                                        {
                                            revenuePercentage: systemRevenuePercentage.percentage,
                                        }, {
                                        keepDefaultValues: false,
                                        keepErrors: false,
                                    }
                                    );
                                }}
                            >
                                Reset
                            </Button>
                            <Button variant="contained" onClick={handleCloseRevenueDialog}>Close</Button>
                        </DialogActions>
                    </Box>
                    <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseRevenueDialog}>
                        <Alert onClose={handleCloseRevenueDialog} severity={typeAlert} sx={{ width: '100%' }}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                </Dialog>

                <br />
                <br />
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", borderRadius: '10px' }}>
                    <label className={styles.labelNames} for="startDatePicker" >Select start date:</label>
                    <div>
                        <DatePicker
                            wrapperClassName={styles.datePicker}
                            id="startDatePicker"
                            selected={startDatePicker}
                            maxDate={new Date()}
                            onChange={onStartDateChangeDatePicker}
                            dateFormat='yyyy-MM-dd'
                        />
                        <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenStartDateError }}>Please select start date.</p>
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <label className={styles.labelNames} for="endDatePicker">Select end date:</label>
                    <div>
                        <DatePicker
                            wrapperClassName={styles.datePicker}
                            id="endDatePicker"
                            selected={endDatePicker}
                            maxDate={new Date()}
                            onChange={onEndDateChangeDatePicker}
                            dateFormat='yyyy-MM-dd'
                        />
                        <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenEndDateError }}>Please select end date.</p>
                        <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenErrorDateBefore }}>End date should be greater than start date.</p>
                    </div>
                    &nbsp;&nbsp;
                    <Button variant="contained" onClick={searchRevenueInPeriod} style={{ color: 'rgb(5, 30, 52)', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', borderRadius: '10px' }}>
                        Search
                    </Button>
                    <Button variant="contained" onClick={loadRevenueInTotal} style={{ color: 'rgb(5, 30, 52)', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', borderRadius: '10px' }}>
                        Alltime revenue
                    </Button>
                </div>
                <br />
                <Divider sx={{ borderBottomWidth: 2 }} />
                <br />
                <br />
                <div style={{ display: "flex", flexDirection: "row", color: "#062c9d", justifyContent: "center" }} >
                    <h2>BookingApp.com earned {systemRevenueInPeriod.total} € in total</h2>
                </div>
                <br />
                <br />
                <br />
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }} >
                    <Chart options={options} series={series} type="pie" width="500px" />
                </div>
            </div>
        );
    }
}