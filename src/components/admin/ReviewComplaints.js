import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { DialogContent, DialogTitle, Divider } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogActions } from "@mui/material";
import Alert from '@mui/material/Alert';
import { userLoggedInAsSuperAdminOrAdminWithResetedPassword } from "../../service/UserService";
import { PROCESSED, UNPROCESSED } from "../../service/ReportService";
import { DataGrid } from "@mui/x-data-grid";
import { Card, TextareaAutosize } from "@mui/material";
import { Snackbar } from "@mui/material";
import { getAllComplaintsForViewByType, giveResponseForComplaint } from "../../service/ComplaintService";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { useHistory } from "react-router-dom";
import { Typography } from "@mui/material";


function ReviewDialog(props) {

    let startDate = new Date(props.complaint.reservation.startDate);
    let endDate = new Date(props.complaint.reservation.startDate);

    const history = useHistory();

    const [adminResponse, setAdminResponse] = useState('');
    const [hiddenErrorResponse, setHiddenErrorResponse] = useState("none");

    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");

    const [requestSent, setRequestSent] = useState(false);

    const handleCloseAlert = () => {
        setOpenAlert(false);
    }

    const checkAdminResponseLength = () => {
        if (adminResponse.length < 1024) {
            setHiddenErrorResponse("none");
            return true;
        } else {
            setHiddenErrorResponse("block");
            return false;
        }
    }

    const showUserProfile = (event, userId) => {
        event.preventDefault();
        history.push({
            pathname: "/userProfile",
            state: { userId: userId }
        })
    };

    const handleAdminResponseToComplaint = () => {
        if (!checkAdminResponseLength())
            return;

        let obj = props.complaint;
        obj.adminResponse = adminResponse;

        giveResponseForComplaint(obj)
            .then(res => {
                setTypeAlert("success");
                setAlertMessage("Successfuly sent response to client and owner");
                setOpenAlert(true);
                setRequestSent(true);
            })
            .catch(err => {
                setTypeAlert("error");
                setAlertMessage("Error massage: " + err.response.data);
                setOpenAlert(true);
                setRequestSent(true);
            });
    }

    const setDates = () => {
        endDate.setDate(endDate.getDate() + props.complaint.reservation.numOfDays);
    }

    return (
        <div>
            <Dialog open={props.openReviewDialog} onClose={props.handleCloseReviewDialog} sm>
                {setDates()}
                <DialogTitle>Process Complaint</DialogTitle>
                <Divider/>
                <DialogContent>
                    <label>Reservation details</label>
                    <Card style={{ color: 'rgb(5, 30, 52)', backgroundColor: "aliceblue" }}>
                        <table style={{ whiteSpace: "nowrap" }}>
                            <tr>
                                <th><h5>{props.complaint.reservation.bookingEntity.name}</h5></th>
                                <th style={{ paddingLeft: "3%" }}>€ {props.complaint.reservation.cost} / {props.complaint.reservation.numOfDays} day(s)</th>
                            </tr>
                        </table>
                    </Card>
                    <table style={{ textAlign: "left" }}>
                        <tr>
                            <th style={{ color: 'rgb(5, 30, 52)', backgroundColor: "aliceblue" , fontWeight: "normal" }}>Check-in</th>
                            <th style={{ color: 'rgb(5, 30, 52)', backgroundColor: "aliceblue", fontWeight: "normal" }}>Check-out</th>
                        </tr>
                        <tr>
                            <td variant="h6" style={{ color: 'rgb(5, 30, 52)', borderRight: "solid 2px aliceblue", paddingBottom: "2%" }}>
                                {new Intl.DateTimeFormat("en-GB", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit"
                                }).format(startDate)
                                }
                            </td>
                            <td variant="h6" style={{ color: 'rgb(5, 30, 52)', paddingBottom: "2%" }}>
                                {new Intl.DateTimeFormat("en-GB", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit"
                                }).format(endDate)
                                }
                            </td>
                        </tr>
                        <tr>
                            <td style={{ color: 'rgb(5, 30, 52)', borderRight: "solid 2px aliceblue", fontWeight: "lighter" }}>
                                {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(startDate)}
                            </td>
                            <td style={{ color: 'rgb(5, 30, 52)', padding: "0%", fontWeight: "lighter" }}>
                                {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(endDate)}
                            </td>
                        </tr>
                    </table>

                    <Divider style={{ margin: "2%" }}></Divider>

                
                    <div>
                        <h3 style={{ color: 'rgb(5, 30, 52)' }}>Client complaint</h3>
                        <Box style={{ width: '100%', display: "flex", gap: '4px', flexDirection: "row", color: 'white', backgroundColor: 'rgba(17,16,29,255)', borderTopRightRadius:'10px',borderBottomRightRadius:'10px',borderTopLeftRadius:'20px'}}>
                            <Avatar sx={{ color: 'white', bgcolor: deepOrange[500] }}>{props.complaint.reservation.client.firstName[0]}</Avatar>
                            <Typography button onClick={(event) => showUserProfile(event, props.complaint.reservation.client.id)} variant="subtitle1">
                                {props.complaint.reservation.client.firstName + ' ' + props.complaint.reservation.client.lastName}
                            </Typography>
                        </Box>
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            value={props.complaint.clientComment}
                            name="reason"
                            style={{ width: '98%' }}
                            disabled
                            readOnly
                        />
                    </div>

                    <br />
                    <Divider sx={{ borderBottomWidth: 5 }} />
                    <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>Enter response here:<br /></Typography>
                    <Typography style={{ fontSize: '10px' }} variant="caption">Note: This response will be send to owner: {props.complaint.owner.email} and client: {props.complaint.reservation.client.email}</Typography>
                    <br />
                    {props.complaint.processed ?
                        (
                            <div>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={4}
                                    value={props.complaint.adminResponse}
                                    style={{ width: 300}}
                                    disabled
                                    readOnly
                                />
                            </div>
                        )
                        :
                        (
                            <div>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={4}
                                    value={adminResponse}
                                    placeholder="Enter response..."
                                    onChange={e => { setAdminResponse(e.target.value) }}
                                    autoFocus
                                    style={{ width: 300 }}
                                />
                                <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenErrorResponse }}>Response can have max 1024 chars</p>
                            </div>
                        )}
                </DialogContent>

                <DialogActions>
                    {!props.complaint.processed && !requestSent ?
                        (<Button onClick={handleAdminResponseToComplaint}>Send response</Button>) : (<div></div>)
                    }
                    <Button onClick={props.handleCloseReviewDialog}>Cancel</Button>
                </DialogActions>

            </Dialog>
            <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={typeAlert} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}


export default function ReviewComplaints() {

    const [openReviewDialog, setOpenReviewDialog] = useState();
    const [isLoadingComplaints, setLoadingComplaints] = useState(true);
    const [complaints, setComplaints] = useState();
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const history = useHistory();

    let rows = [];
    let columns = [
        { field: 'id', headerName: 'Complaint ID', width: 150 },
        { field: 'Owner', headerName: 'Owner', width: 200 },
        { field: 'BookingEntity', headerName: 'BookintEntity', width: 200 },
        { field: 'Client', headerName: 'Client', width: 200 },
        { field: 'Complaint', headerName: 'Client Complaint', width: 200 },
        { field: 'Processed', headerName: 'Processed', type: 'boolean', width: 200 }

    ];

    const handleCloseReviewDialog = () => {
        setOpenReviewDialog(false);
        setSelectedComplaint(null);
        loadUnprocessed();
    }
    const handleOpenReviewDialog = () => {
        setOpenReviewDialog(true);
    }

    const fillRowsWithData = () => {
        let newRows = [];
        for (let r of complaints) {
            let comment = r.clientComment;
            if (comment > 15)
                comment = comment.slice(0, 15) + '...';
            let rowToAdd = {
                'id': r.id,
                'Owner': r.owner.firstName + ' ' + r.owner.lastName,
                'BookingEntity': r.reservation.bookingEntity.name,
                'Client': r.reservation.client.firstName + ' ' + r.reservation.client.lastName,
                'Complaint': comment,
                'Processed': r.processed
            }
            newRows.push(rowToAdd);
        }
        rows = newRows;
    }


    const loadProcessed = () => {
        setLoadingComplaints(true);
        getAllComplaintsForViewByType(PROCESSED)
            .then(res => {
                setComplaints(res.data);
                setLoadingComplaints(false);
            })
    }
    const loadUnprocessed = () => {
        setLoadingComplaints(true);
        getAllComplaintsForViewByType(UNPROCESSED)
            .then(res => {
                setComplaints(res.data);
                setLoadingComplaints(false);
            })
    }

    const findComplaintByIndex = (index) => {
        for (let r of complaints) {
            if (r.id === index) return r;
        }
    }

    const handleOnSelectRow = (index) => {
        let complaint = findComplaintByIndex(index);
        setSelectedComplaint(complaint);
        handleOpenReviewDialog();
    }

    useEffect(() => {
        if (userLoggedInAsSuperAdminOrAdminWithResetedPassword(history)) {
            loadUnprocessed();
        }
    }, [])

    if (isLoadingComplaints) {
        return <div className="App">Loading...</div>
    }
    else {

        { fillRowsWithData() }

        return (
            <Box
                alignItems="center"
                justifyContent="center"
                style={{ margin: '1% 11% 1% 20%' }}
            >
                <h3 color="rgba(17,16,29,255)">Review complaints</h3>
                <Divider sx={{ borderBottomWidth: 5, color: "rgba(17,16,29,255)" }} />
                <br/>
                <Box style={{ display: "flex", flexDirection: "row", margin: "1% auto 1% 40%" }}>
                    <Button variant="contained" onClick={loadProcessed} style={{ color: 'white', backgroundColor: 'rgba(38,166,154,255)', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
                        Processed
                    </Button>
                    <Button variant="contained" onClick={loadUnprocessed} style={{ color: 'white', backgroundColor: 'rgb(252,38, 38)', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
                        Unprocessed
                    </Button>
                </Box>
                {(selectedComplaint !== null) ?
                    (<ReviewDialog
                        openReviewDialog={openReviewDialog}
                        handleCloseReviewDialog={handleCloseReviewDialog}
                        complaint={selectedComplaint}
                    />
                    ) : (<div></div>)
                }
                <div>
                    {complaints.length === true ? (
                        <h5 style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', marginLeft: "15%" }}>There are no complaints.</h5>

                    ) : (
                        <DataGrid
                            sx={{
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "rgba(17,16,29,255)",
                                    color: "white",
                                },
                                "& .MuiDataGrid-virtualScrollerRenderZone": {
                                    "& .MuiDataGrid-row": {
                                        "&:nth-child(2n)": { backgroundColor: "rgb(208,208,208)" }
                                    }
                                },
                                '& .MuiDataGrid-menuIcon': {
                                    backgroundColor: 'white'
                                },
                                '& .MuiDataGrid-sortIcon': {
                                    color: 'white',

                                },
                            }}


                            style={{ height: '450px' }}
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableColumnSelector
                            onSelectionModelChange={item => { handleOnSelectRow(item["0"]) }}
                        />
                    )}
                </div>

            </Box>
        )
    }
}