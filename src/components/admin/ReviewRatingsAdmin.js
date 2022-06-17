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
import { Checkbox, TextareaAutosize } from "@mui/material";
import { Snackbar } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { Typography } from "@mui/material";

import { deleteReviewById, getAllRatingsForViewByType, putReviewForPublication } from "../../service/RatingService"
import { useHistory } from "react-router-dom";
import RatingEntity from "../Rating";


function ReviewDialog(props) {

    const history = useHistory();

    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");

    const [requestSent, setRequestSent] = useState(false);
    const [checkedForPublic, setCheckedForPublic] = useState(false);

    const handleCloseAlert = () => {
        setOpenAlert(false);
    }

    const handleAdminProccesedReview = () => {

        if (checkedForPublic) {
            putReviewForPublication(props.review)
                .then(res => {
                    setTypeAlert("success");
                    setAlertMessage("Review approved. Successfuly sent email to owner");
                    setOpenAlert(true);
                    setRequestSent(true);
                })
                .catch(err => {
                    setTypeAlert("error");
                    setAlertMessage("Error massage: " + err.response.data);
                    setOpenAlert(true);
                    setRequestSent(true);
                });
        } else {
            deleteReviewById(props.review.id)
                .then(res => {
                    setTypeAlert("success");
                    setAlertMessage("This review is successfully deleted.");
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
    }


    const showUserProfile = (event, userId) => {
        console.log("???");
        console.log(userId);
        console.log("???");
        event.preventDefault();
        history.push({
            pathname: "/userProfile",
            state: { userId: userId }
        })
    };
    const showBookingEntity = (event) => {
        event.preventDefault();
        let entityType = props.review.reservation.bookingEntity.entityType;
        let urlPath = ''
        if (entityType === "ADVENTURE")
            urlPath = '/showAdventureProfile';
        else if (entityType === 'COTTAGE')
            urlPath = '/showCottageProfile';
        else
            urlPath = '/showShipProfile';
        history.push({
            pathname: urlPath,
            state: { bookingEntityId: props.review.reservation.bookingEntity.id }
        });
    }


    return (
        <div>
            <Box>
                <Dialog open={props.openReviewDialog} onClose={props.handleCloseReviewDialog} sm>
                    <DialogTitle>Review rating</DialogTitle>
                    <DialogContent>
                        <Divider />
                        <Typography button onClick={showBookingEntity} variant="subtitle1" style={{ color: 'rgb(5, 30, 52)' }}>
                            BookingEntity: {props.review.reservation.bookingEntity.name}
                        </Typography>
                        <Typography button onClick={(event) => showUserProfile(event, props.review.owner.id)} variant="subtitle1" style={{ color: 'rgb(5, 30, 52)' }}>
                            Owner: {props.review.owner.firstName + " " + props.review.owner.lastName}
                        </Typography>
                        <Divider />
                        <br />
                        <div style={{ borderStyle: 'solid 3px', borderColor: 'rgba(17,16,29,255)' }}>
                            <Box style={{ color: 'white', backgroundColor: 'rgba(17,16,29,255)', borderRadius: '10px' }}>
                                <Box style={{ width: '100%', display: "flex", gap: '4px', flexDirection: "row" }}>
                                    <Avatar sx={{ color: 'white', bgcolor: deepOrange[500] }}>{props.review.reservation.client.firstName[0]}</Avatar>
                                    <Typography button onClick={(event) => showUserProfile(event, props.review.reservation.client.id)} variant="subtitle1">
                                        {props.review.reservation.client.firstName + ' ' + props.review.reservation.client.lastName}
                                    </Typography>
                                </Box>
                            </Box>

                            <RatingEntity value={props.review.value} />
                            <TextareaAutosize
                                aria-label="minimum height"
                                minRows={4}
                                value={props.review.comment}
                                style={{ width: 400 }}
                                disabled
                                readOnly
                            />
                            <Typography sx={{ fontSize: '10px' }}>{props.review.reviewDate}</Typography>

                            <br />
                            <br />
                            <Divider sx={{ borderBottomWidth: 5 }} />
                            <br />
                            <Box style={{ width: '100%', display: "flex", gap: '4px', flexDirection: "row" }}>
                                <Typography style={{ color: 'rgba(17,16,29,255)', fontSize: '16px', fontWeight: 'bold' }}>Do you want to make this review public?</Typography>
                                {
                                    props.review.processed ?
                                        (<Checkbox
                                            defaultChecked={true}
                                            readOnly
                                            disabled
                                        />) : (
                                            <Checkbox
                                                checked={checkedForPublic}
                                                defaultChecked={checkedForPublic}
                                                onChange={e => { setCheckedForPublic(e.target.checked) }}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        )
                                }
                            </Box>
                            <br />
                        </div>
                    </DialogContent>

                    <DialogActions>
                        <Divider />
                        {!props.review.processed && !requestSent ?
                            (<Button onClick={handleAdminProccesedReview}>Save</Button>) : (<div></div>)
                        }
                        <Button onClick={props.handleCloseReviewDialog}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
                    <Alert onClose={handleCloseAlert} severity={typeAlert} sx={{ width: '100%' }}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </div>
    )
}


export default function ReviewRatingsAdmin() {

    const [openReviewDialog, setOpenReviewDialog] = useState();
    const [isLoadingReviews, setLoadingReviews] = useState(true);
    const [reviews, setReviews] = useState();
    const [selectedReview, setSelectedReview] = useState(null);
    const history = useHistory();

    let rows = [];
    let columns = [
        { field: 'id', headerName: 'Review ID', width: 80 },
        { field: 'Client', headerName: 'Client', width: 180 },
        { field: 'Owner', headerName: 'Owner', width: 180 },
        { field: 'BookingEntity', headerName: 'BookingEntity', width: 180 },
        { field: 'ReviewDate', headerName: 'ReviewDate', width: 180 },
        { field: 'Rating', headerName: 'Rating', type: 'number', width: 150 },
        { field: 'Processed', headerName: 'Processed', type: 'boolean', width: 150 }
    ];

    const handleCloseReviewDialog = () => {
        setOpenReviewDialog(false);
        setSelectedReview(null);
        loadUnprocessed();
    }
    const handleOpenReviewDialog = () => {
        setOpenReviewDialog(true);
    }

    const fillRowsWithData = () => {
        let newRows = [];
        for (let r of reviews) {
            let rowToAdd = {
                'id': r.id,
                'Client': r.reservation.client.firstName + ' ' + r.reservation.client.lastName,
                'Owner': r.owner.firstName + ' ' + r.owner.lastName,
                'BookingEntity': r.reservation.bookingEntity.name,
                'ReviewDate': r.reviewDate,
                'Rating': r.value,
                'Processed': r.processed
            }
            newRows.push(rowToAdd);
        }
        rows = newRows;
    }


    const loadProcessed = () => {
        setLoadingReviews(true);
        getAllRatingsForViewByType(PROCESSED)
            .then(res => {
                setReviews(res.data);
                setLoadingReviews(false);
            })
    }
    const loadUnprocessed = () => {
        setLoadingReviews(true);
        getAllRatingsForViewByType(UNPROCESSED)
            .then(res => {
                setReviews(res.data);
                setLoadingReviews(false);
            })
    }

    const findReviewByIndex = (index) => {
        for (let r of reviews) {
            if (r.id === index) return r;
        }
    }

    const handleOnSelectRow = (index) => {
        let review = findReviewByIndex(index);
        setSelectedReview(review);
        handleOpenReviewDialog();
    }

    useEffect(() => {
        if (userLoggedInAsSuperAdminOrAdminWithResetedPassword(history)) {
            loadUnprocessed();
        }
    }, [])

    if (isLoadingReviews) {
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
                <h3 color="rgba(17,16,29,255)">Review client ratings</h3>
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
                {(selectedReview !== null) ?
                    (<ReviewDialog
                        openReviewDialog={openReviewDialog}
                        handleCloseReviewDialog={handleCloseReviewDialog}
                        review={selectedReview}
                    />
                    ) : (<div></div>)
                }
                <div>
                    {reviews.length === true ? (
                        <h5 style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', marginLeft: "15%" }}>There are no reviews.</h5>

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