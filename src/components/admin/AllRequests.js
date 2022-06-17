import React, { useEffect, useRef, useState } from 'react'
import { getAllRequests } from '../../service/AdminService';
import { makeStyles } from "@material-ui/core/styles";

import styles from './AllRequests.module.css';

import Badge from '@mui/material/Badge';
import { Box } from '@mui/system';
import { Divider } from '@mui/material';
import ReviewsIcon from '@mui/icons-material/Reviews';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useHistory } from 'react-router-dom';
import { userLoggedInAsSuperAdminOrAdminWithResetedPassword} from "../../service/UserService";
import { Button } from 'bootstrap';


const useStyles = makeStyles((theme) => ({
    badge: {
        fontSize: 30
    }
}));


export default function AllRequestsCards() {

    const history = useHistory();
    const classes = useStyles();
    const [allRequests, setAllRequests] = useState();
    const [isLoadingRequests, setLoadingRequests] = useState(true);

    const ownerReportRef = useRef(null);

    const openOwnerReports = (event) => {
        history.push("/reviewReservationReportsAdmin");
    }
    const openClientComplaints = (event) => {
        history.push("/reviewComplaintsAdmin");
    }
    const openDeleteAccountRequests = (event) => {
        history.push("/reviewDeleteAccountRequests");
    }
    const openClientRatingsReviews = (event) => {
        history.push("/reviewRatingsAdmin");
    }
    const openNewAccountRequests = (event) => {
        history.push("/reviewNewAccountRequests");
    }

    useEffect(() => {
        if (userLoggedInAsSuperAdminOrAdminWithResetedPassword(history)) {
            getAllRequests().then(res => {
                setAllRequests(res.data);
                setLoadingRequests(false);
            });
        }
    }, [])

    if (isLoadingRequests) {
        return <div>Loading...</div>
    }
    else{
    return (
        <div style={{ margin: '3% 9% 1% 20%' }}>
            <Box style={{ display: "flex", justifyContent: "center", flexDirection: "row", flexWrap: 'wrap', color: "white" }}>
                <div className={styles.card}>
                    <Box onClick={openOwnerReports} className={styles.card__content}>
                        <Badge
                            badgeContent={allRequests.reservationReportsCounter}
                            color="primary"
                        >
                            <h3 className={styles.card__header}>Owners reports</h3>
                        </Badge>

                        <br />
                        <br />
                        <br />
                        <br />
                        <ReviewsIcon style={{ fontSize: 125 }} />
                        <br />
                        <p>Give response to reports sent by owners.</p>
                    </Box>
                </div>
                <div className={styles.card}>
                   <Box onClick={openClientComplaints} className={styles.card__content}>
                        <Badge
                            badgeContent={allRequests.clientComplaintsCounter}
                            color="primary"
                        >
                            <h3 className={styles.card__header}>Client complaints</h3>
                        </Badge>

                        <br />
                        <br />
                        <br />
                        <br />
                        <SentimentVeryDissatisfiedIcon style={{ fontSize: 125 }} />
                        <br />
                        <p>Give response to complaints sent by clients.</p>
                    </Box>
                </div>


                <div className={styles.card}>
                    <Box onClick={openClientRatingsReviews} className={styles.card__content}>
                        <Badge
                            badgeContent={allRequests.clientRatingsCounter}
                            color="primary"
                        >
                            <h3 className={styles.card__header}>Client reviews</h3>
                        </Badge>

                        <br />
                        <br />
                        <br />
                        <br />
                        <StarHalfIcon style={{ fontSize: 125 }} />
                        <br />
                        <p>Determine which reviews will be published.</p>
                    </Box>
                </div>

                <div className={styles.card}>
                    <Box onClick={openDeleteAccountRequests} className={styles.card__content}>
                        <Badge
                            badgeContent={allRequests.deleteAccountRequests}
                            color="primary"
                        >
                            <h3 className={styles.card__header}>Delete account requests</h3>
                        </Badge>

                        <br />
                        <br />
                        <br />
                        <br />
                        <PersonRemoveIcon style={{ fontSize: 125 }} />
                        <br />
                        <p>Determine which account will be deleted.</p>
                    </Box>
                </div>

                <div className={styles.card}>
                    <Box onClick={openNewAccountRequests} className={styles.card__content}>
                        <Badge
                            badgeContent={allRequests.newAccountRequests}
                            color="primary"
                        >
                            <h3 className={styles.card__header}>New registation requests</h3>
                        </Badge>

                        <br />
                        <br />
                        <br />
                        <br />
                        <PersonAddAlt1Icon style={{ fontSize: 125 }} />
                        <br />
                        <p>Review new registation requests.</p>
                    </Box>
                </div>
            </Box>
        </div>

    );}
}