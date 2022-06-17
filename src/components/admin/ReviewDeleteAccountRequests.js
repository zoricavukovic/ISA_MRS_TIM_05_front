import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { DialogContent, DialogTitle, Divider } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogActions } from "@mui/material";
import Alert from '@mui/material/Alert';
import {userLoggedInAsSuperAdminOrAdminWithResetedPassword } from "../../service/UserService";
import { DataGrid } from "@mui/x-data-grid";
import { Checkbox, TextareaAutosize } from "@mui/material";
import { Snackbar } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { useHistory } from "react-router-dom";
import { getAllUnprocessedDeleteAccountRequests, giveResponseForDeleteAccountRequest } from "../../service/DeleteAccountRequestService";
import { Typography } from "@mui/material";

function ReviewDialog(props) {


    const history = useHistory();

    const [adminResponse, setAdminResponse] = useState('');
    const [hiddenErrorResponse, setHiddenErrorResponse] = useState("none");

    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");

    const [checkedAllowDeleting, setCheckedAllowDeleting] = useState(false);
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

    const handleAdminResponseToDeleteRequest = () => {
        if (!checkAdminResponseLength())
            return;

        let obj = props.deleteRequest;
        obj.adminResponse = adminResponse;
        obj.accepted = checkedAllowDeleting;

        giveResponseForDeleteAccountRequest(obj)
            .then(res => {
                setTypeAlert("success");
                setAlertMessage("Successfuly sent response to user");
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

    return (
        <div>
            <Dialog open={props.openReviewDialog} onClose={props.handleCloseReviewDialog} sm>
                <DialogTitle>Process Delete Request</DialogTitle>
                <Divider />
                <DialogContent>
                    <div>
                        <h3 style={{ color: 'rgb(5, 30, 52)' }}>User reason for deleting acount</h3>
                        <Box style={{ width: '100%', display: "flex", gap: '4px', flexDirection: "row", color: 'white', backgroundColor: 'rgba(17,16,29,255)', borderTopRightRadius: '10px', borderBottomRightRadius: '10px', borderTopLeftRadius: '20px' }}>
                            <Avatar sx={{ color: 'white', bgcolor: deepOrange[500] }}>{props.deleteRequest.user.firstName[0]}</Avatar>
                            <Typography button onClick={(event) => showUserProfile(event, props.deleteRequest.user.id)} variant="subtitle1">
                                {props.deleteRequest.user.firstName + ' ' + props.deleteRequest.user.lastName}
                            </Typography>
                        </Box>
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            value={props.deleteRequest.reason}
                            name="reason"
                            style={{ width: '98%' }}
                            disabled
                            readOnly
                        />
                    </div>

                    <br />
                    <Divider sx={{ borderBottomWidth: 5 }} />
                    <br />
                    <Typography>Check the box if you want to delete this user account</Typography>
                    <Checkbox
                        checked={checkedAllowDeleting}
                        defaultChecked={checkedAllowDeleting}
                        onChange={e => { setCheckedAllowDeleting(e.target.checked) }}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <br/>
                    <br/>
                    {!checkedAllowDeleting ?
                        (
                            <div>
                                <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>Enter response here:<br /></Typography>
                                <Typography style={{ fontSize: '10px' }} variant="caption">Note: This response will be sent to user: {props.deleteRequest.user.email}</Typography>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={4}
                                    value={adminResponse}
                                    placeholder="Enter the reason why you dont allow this user to delete his account..."
                                    onChange={e => { setAdminResponse(e.target.value) }}
                                    autoFocus
                                    style={{ width: 300 }}
                                />
                                <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenErrorResponse }}>Response can have max 1024 chars</p>
                            </div>
                        ) : (<div></div>)
                    }
                </DialogContent>
                <Divider/>
                <DialogActions>
                    {!requestSent ? (<Button onClick={handleAdminResponseToDeleteRequest}>Send response</Button>) : (<div></div>)}
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


export default function ReviewDeleteAccountRequests() {

    const [openReviewDialog, setOpenReviewDialog] = useState();
    const [isLoadingDeleteRequests, setLoadingDeleteRequests] = useState(true);
    const [deleteRequests, setDeleteRequests] = useState();
    const [selectedDeleteRequest, setSelectedDeleteRequest] = useState(null);
    const history = useHistory();

    let rows = [];
    let columns = [
        { field: 'id', headerName: 'Request ID', width: 200 },
        { field: 'User', headerName: 'User', width: 250 },
        { field: 'Reason', headerName: 'Reason For Deleting', width: 250 },
        { field: 'Processed', headerName: 'Processed', type: 'boolean', width: 250 }

    ];

    const handleCloseReviewDialog = () => {
        setOpenReviewDialog(false);
        setSelectedDeleteRequest(null);
        loadUnprocessed();
    }
    const handleOpenReviewDialog = () => {
        setOpenReviewDialog(true);
    }

    const fillRowsWithData = () => {
        let newRows = [];
        for (let r of deleteRequests) {
            let reason = r.reason;
            if (reason > 20)
                reason = reason.slice(0, 20) + '...';
            let rowToAdd = {
                'id': r.id,
                'User': r.user.firstName + ' ' + r.user.lastName,
                'Reason': reason,
                'Processed': r.processed
            }
            newRows.push(rowToAdd);
        }
        rows = newRows;
    }

    const loadUnprocessed = () => {
        setLoadingDeleteRequests(true);
        getAllUnprocessedDeleteAccountRequests()
            .then(res => {
                setDeleteRequests(res.data);
                setLoadingDeleteRequests(false);
            })
    }

    const findDeleteRequestByIndex = (index) => {
        for (let r of deleteRequests) {
            if (r.id === index) return r;
        }
    }

    const handleOnSelectRow = (index) => {
        let deleteRequest = findDeleteRequestByIndex(index);
        setSelectedDeleteRequest(deleteRequest);
        handleOpenReviewDialog();
    }

    useEffect(() => {
        if (userLoggedInAsSuperAdminOrAdminWithResetedPassword(history)) {
            loadUnprocessed();
        }
    }, [])

    if (isLoadingDeleteRequests) {
        return <div className="App">Loading...</div>
    }
    else {

        { fillRowsWithData() }

        return (
            <Box
                alignItems="center"
                justifyContent="center"
                style={{ margin: '1% 11% 1% 25%' }}
            >
                <h3 color="rgba(17,16,29,255)">Review deleting account requests</h3>
                <br/>

                {(selectedDeleteRequest !== null) ?
                    (<ReviewDialog
                        openReviewDialog={openReviewDialog}
                        handleCloseReviewDialog={handleCloseReviewDialog}
                        deleteRequest={selectedDeleteRequest}
                    />
                    ) : (<div></div>)
                }
                <div style={{width: '90%'}}>
                    <Divider sx={{ borderBottomWidth: 5, color: "rgba(17,16,29,255)" }} />
                    {deleteRequests.length === true ? (
                        <h5 style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', marginLeft: "15%" }}>There are no delete requests.</h5>
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