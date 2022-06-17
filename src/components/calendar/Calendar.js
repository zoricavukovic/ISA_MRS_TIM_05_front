import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import { indigo, teal, red } from '@mui/material/colors';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import "react-datepicker/dist/react-datepicker.css"
import { getCalendarValuesForAllOwnerEntitiesById } from "../../service/CalendarService";
import { useHistory } from "react-router-dom";
import { userLoggedInAsOwner } from "../../service/UserService";
import { getCurrentUser } from "../../service/AuthService";
import { makeStyles } from "@material-ui/core";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    MonthView,
    WeekView,
    AllDayPanel,
    ViewSwitcher,
    Appointments,
    Toolbar,
    DateNavigator,
    TodayButton,
    Resources,
    AppointmentTooltip,
    CurrentTimeIndicator,
} from '@devexpress/dx-react-scheduler-material-ui';
import CalendarForEntityChooser from "./CalendarForEntityChooser";
import { Grid, Typography } from "@mui/material";


const resources = [{
    fieldName: 'type',
    title: 'type',
    instances: [
        { id: 'fast reservation', text: 'fast reservation', color: indigo },
        { id: 'regular reservation', text: 'regular reservation', color: teal },
        { id: 'unavailable', text: 'unavailable', color: red },
    ]
}];


const useStyles = makeStyles({
    timeTableCell: {
        height: "300px"
    }
});

const RowComponent = (props) => {
    const classes = useStyles();
    return (
        <AllDayPanel.Row {...props} className={classes.timeTableCell} />
    );
}


const RenderOneMonth = (props) => {

    const currDate = new Date(props.year, props.monthIndex);

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography variant="h6" align="center" color={indigo} fontWeight={"bold"}>{props.monthName}</Typography>
            </div>
            <div>
                <Paper>
                    <Scheduler
                        data={props.data}
                    >
                        <ViewState
                            currentDate={currDate}
                        />
                        <MonthView />
                        <Toolbar />
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
            </div>

        </div>
    );
}



export default function Calendar() {

    const history = useHistory();
    const [data, setData] = useState();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [yearViewChoosen, setYearViewChoosen] = useState(false);
    const [currYear, setCurrYear] = useState(2022);


    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const switchView = () => {
        setYearViewChoosen(!yearViewChoosen);
    }


    useEffect(() => {
        if (userLoggedInAsOwner(history)) {
            refreshPage();
        }
    }, []);


    const refreshPage = () => {
        getCalendarValuesForAllOwnerEntitiesById(getCurrentUser().id)
            .then(res => {
                setData(res.data);
                setIsLoadingData(false);
            });
    }

    const moveOneYearLeft = () => {
        setCurrYear(currYear - 1);
    }
    const moveOneYearRight = () => {
        setCurrYear(currYear + 1);
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
                <CalendarForEntityChooser handleDrawerClose={handleDrawerClose} open={open} />

                <div style={{ justifyContent: "right", display: "flex", flexDirection: "row" }}>
                    <Button onClick={handleDrawerOpen} edge="end" sx={{ ...(open && { display: 'none' }) }} style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '10%' }}>
                        <EventAvailableIcon />
                        <ChevronRightIcon />
                    </Button>
                </div>
                <br />
                <br />
                {
                    (yearViewChoosen) ? (
                        <div>
                            <div style={{ justifyContent: "right", display: "flex", flexDirection: "row" }}>
                                <Button onClick={switchView} style={{ color: 'black', fontSize: '14px', border: '1px solid grey', textAlign: 'center', marginTop: '1%', marginRight: '2%', borderRadius: '5px', width: '13%' }}>
                                    MONTH/WEEK
                                </Button>
                            </div>
                            <div style={{ justifyContent: "center", display: "flex", flexDirection: "row" }}>
                                <Button onClick={moveOneYearLeft}>
                                    <ChevronLeftIcon />
                                </Button>
                                <Typography variant="h5" align="center" color={indigo} fontWeight={"bold"}>{currYear}</Typography>
                                <Button onClick={moveOneYearRight}>
                                    <ChevronRightIcon />
                                </Button>
                            </div>
                            <br/>
                            <br/>
                            <Grid
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                container
                                spacing={2}
                            >
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={0} year={currYear} monthName={"January"} />
                                </Grid>
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={1} year={currYear} monthName={"February"} />
                                </Grid>
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={2} year={currYear} monthName={"March"} />
                                </Grid>
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={3} year={currYear} monthName={"April"} />
                                </Grid>
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={4} year={currYear} monthName={"May"} />
                                </Grid>
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={5} year={currYear} monthName={"June"} />
                                </Grid>
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={6} year={currYear} monthName={"July"} />
                                </Grid>
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={7} year={currYear} monthName={"August"} />
                                </Grid>
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={8} year={currYear} monthName={"September"} />
                                </Grid>
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={9} year={currYear} monthName={"October"} />
                                </Grid>
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={10} year={currYear} monthName={"November"} />
                                </Grid>
                                <Grid item md={4} lg={4} xs={6}>
                                    <RenderOneMonth data={data} monthIndex={11} year={currYear} monthName={"December"} />
                                </Grid>

                            </Grid>
                        </div>
                    ) :
                        (
                            <div>
                                <div style={{ justifyContent: "right", display: "flex", flexDirection: "row" }}>
                                    <Button onClick={switchView} style={{ color: 'black', fontSize: '14px', border: '1px solid grey', textAlign: 'center', marginTop: '1%', marginRight: '2%', borderRadius: '5px', width: '12%' }}>
                                        YEAR
                                    </Button>
                                </div>
                                <Paper>
                                    <Scheduler
                                        data={data}
                                    >
                                        <ViewState
                                            defaultCurrentDate={new Date()}
                                        />
                                        <WeekView
                                            startDayHour={6}
                                            endDayHour={21}
                                        />
                                        <MonthView />
                                        <AllDayPanel
                                            rowComponent={RowComponent}
                                        />
                                        <Toolbar />
                                        <ViewSwitcher />
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
                            </div>
                        )
                }
            </Box >
        );
    }
}