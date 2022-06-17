import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { DialogContent, DialogTitle, Divider } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogActions } from "@mui/material";
import Alert from '@mui/material/Alert';
import { getAllNewAccountRequests, giveResponseForNewAccountRequest, userLoggedInAsSuperAdminOrAdminWithResetedPassword } from "../../service/UserService";
import { DataGrid } from "@mui/x-data-grid";
import { Checkbox, TextareaAutosize } from "@mui/material";
import { Snackbar } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { useHistory } from "react-router-dom";
import { Typography } from "@mui/material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ShipOwner from "../../icons/shipOwner.png";
import CottageOwner from "../../icons/cottageOwner.png";
import Instructor from "../../icons/instructor.png";
import UserInfoGrid from "../user/UserInfoGrid";


function RenderUserType(props) {
    return (
        <div style={{
            backgroundColor: 'aliceblue',
            color: 'rgb(5, 30, 52)',
            padding: '1%',
            border: '1px solid rgb(244, 177, 77)',
            borderRadius: '10px',
            height: '100px',
            width: '120px',
            display: 'flex',
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'column'
        }} >
            <img src={props.ownerTypeImg}></img>
            <Typography gutterBottom sx={{ mt: '1%' }} style={{ fontWeight: "bold", fontSize: '15px' }} color='rgb(5, 30, 52)'>
                {props.ownerTypeText}
            </Typography>
        </div>
    );
}


function ReviewDialog(props) {

    const [adminResponse, setAdminResponse] = useState('');
    const [hiddenErrorResponse, setHiddenErrorResponse] = useState("none");

    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");

    const [checkedAllowAdding, setCheckedAllowAdding] = useState(false);
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

    const handleAdminResponseToDeleteRequest = () => {
        if (!checkAdminResponseLength())
            return;

        let obj = props.newRequest;
        obj.adminResponse = adminResponse;
        obj.accepted = checkedAllowAdding;
        console.log("Ispisissssssssss");
        console.log(obj);

        giveResponseForNewAccountRequest(obj)
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

    const RenderUserImgByType = () => {
        if (props.newRequest.user.userType.name === "ROLE_COTTAGE_OWNER") {
            return (<RenderUserType ownerTypeImg={CottageOwner} ownerTypeText="Cottage owner"/>);
        } else if (props.newRequest.user.userType.name === "ROLE_INSTRUCTOR") {
            return (<RenderUserType ownerTypeImg={Instructor} ownerTypeText="Instructor"/>);
        } else if (props.newRequest.user.userType.name === "ROLE_SHIP_OWNER") {
            return (<RenderUserType ownerTypeImg={ShipOwner} ownerTypeText="Ship owner"/>);
        }
        return <div></div>
    }

    return (
        <div>
            <Dialog open={props.openReviewDialog} onClose={props.handleCloseReviewDialog} md>
                <DialogTitle>Process New Account Request</DialogTitle>
                <Divider />
                <DialogContent>
                    <div style={{width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                        <RenderUserImgByType />    
                    </div>
                    <UserInfoGrid userData={props.newRequest.user} />
                    <br />
                    <div>
                        <h3 style={{ color: 'rgb(5, 30, 52)' }}>User reason for creating acount</h3>
                        <Box style={{ width: '100%', display: "flex", gap: '4px', flexDirection: "row", color: 'white', backgroundColor: 'rgba(17,16,29,255)', borderTopRightRadius: '10px', borderBottomRightRadius: '10px', borderTopLeftRadius: '20px' }}>
                            <Avatar sx={{ color: 'white', bgcolor: 'green' }}>{props.newRequest.user.firstName[0]}</Avatar>
                            <Typography variant="subtitle1">
                                {props.newRequest.user.firstName + ' ' + props.newRequest.user.lastName}
                            </Typography>
                        </Box>
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            value={props.newRequest.user.reason}
                            name="reason"
                            style={{ width: '98%' }}
                            disabled
                            readOnly
                        />
                    </div>
                    <Divider sx={{ borderBottomWidth: 5 }} />
                    <br />
                    <Typography>Check the box if you want to accept this request</Typography>
                    <Checkbox
                        checked={checkedAllowAdding}
                        defaultChecked={checkedAllowAdding}
                        onChange={e => { setCheckedAllowAdding(e.target.checked) }}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <br />
                    <br />
                    {!checkedAllowAdding ?
                        (
                            <div>
                                <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>Enter response here:<br /></Typography>
                                <Typography style={{ fontSize: '10px' }} variant="caption">Note: This response will be sent to user: {props.newRequest.user.email}</Typography>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={4}
                                    value={adminResponse}
                                    placeholder="Enter the reason why you dont allow this user to register his account..."
                                    onChange={e => { setAdminResponse(e.target.value) }}
                                    autoFocus
                                    style={{ width: 300 }}
                                />
                                <p style={{ color: '#ED6663', fontSize: "11px", display: hiddenErrorResponse }}>Response can have max 1024 chars</p>
                            </div>
                        ) : (<div></div>)
                    }
                </DialogContent>
                <Divider />
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


export default function ReviewNewAccountRequests() {

    const [openReviewDialog, setOpenReviewDialog] = useState();
    const [isLoadingNewAccountRequests, setLoadingNewAccountRequests] = useState(true);
    const [newAccountRequests, setNewAccountRequests] = useState();
    const [selectedNewAccountRequest, setNewAccountRequest] = useState(null);
    const history = useHistory();

    let rows = [];
    let columns = [
        { field: 'id', headerName: 'User ID', width: 120 },
        { field: 'User', headerName: 'User', width: 200 },
        { field: 'Email', headerName: 'Email', width: 400 },
        {
            field: 'Type',
            headerName: 'Type',
            width: 120,
            renderCell: (params) => {
                const IconByType = (props) => {
                    if (params.value === "ROLE_COTTAGE_OWNER") {
                        return (
                            <img style={{ width: "45px" }} src={CottageOwner}></img>
                        );
                    }
                    else if (params.value === "ROLE_INSTRUCTOR") {
                        return (
                            <img style={{ width: "45px" }} src={Instructor}></img>
                        );
                    }
                    else if (params.value === "ROLE_SHIP_OWNER") {
                        return (
                            <img style={{ width: "45px" }} src={ShipOwner}></img>
                        );
                    }
                }
                return (
                    <div>
                        <IconByType />
                    </div>
                );
            }
        },
        { field: 'Processed', headerName: 'Processed', type: 'boolean', width: 120 }
    ];

    const handleCloseReviewDialog = () => {
        setOpenReviewDialog(false);
        setNewAccountRequest(null);
        loadUnprocessed();
    }
    const handleOpenReviewDialog = () => {
        setOpenReviewDialog(true);
    }

    const fillRowsWithData = () => {
        let newRows = [];
        for (let r of newAccountRequests) {
            let rowToAdd = {
                'id': r.user.id,
                'User': r.user.firstName + ' ' + r.user.lastName,
                'Email': r.user.email,
                'Type': r.user.userType.name,
                'Processed': r.processed
            }
            newRows.push(rowToAdd);
        }
        rows = newRows;
    }

    const loadUnprocessed = () => {
        setLoadingNewAccountRequests(true);
        getAllNewAccountRequests()
            .then(res => {
                setNewAccountRequests(res.data);
                setLoadingNewAccountRequests(false);
            })
    }

    const findDeleteRequestByIndex = (index) => {
        for (let r of newAccountRequests) {
            if (r.user.id === index) return r;
        }
    }

    const handleOnSelectRow = (index) => {
        let deleteRequest = findDeleteRequestByIndex(index);
        setNewAccountRequest(deleteRequest);
        handleOpenReviewDialog();
    }

    useEffect(() => {
        if (userLoggedInAsSuperAdminOrAdminWithResetedPassword(history)) {
            loadUnprocessed();
        }
    }, [])

    if (isLoadingNewAccountRequests) {
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
                <h3 color="rgba(17,16,29,255)">New account requests</h3>
                <br />
                {(selectedNewAccountRequest !== null) ?
                    (<ReviewDialog
                        openReviewDialog={openReviewDialog}
                        handleCloseReviewDialog={handleCloseReviewDialog}
                        newRequest={selectedNewAccountRequest}
                    />
                    ) : (<div></div>)
                }
                <div >
                    <Divider sx={{ borderBottomWidth: 5, color: "rgba(17,16,29,255)" }} />
                    {newAccountRequests.length === true ? (
                        <h5 style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', marginLeft: "15%" }}>There are no new account requests.</h5>
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