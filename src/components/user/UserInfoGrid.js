import { Grid, InputAdornment, List, TextField } from '@mui/material';
import React from 'react';
import { AlternateEmail, DateRangeOutlined, Domain, LocationOn, Person, Phone, Public } from "@mui/icons-material";

export default function UserInfoGrid(props) {

    const dateOfBirth = new Date(props.userData.dateOfBirth[0], props.userData.dateOfBirth[1], props.userData.dateOfBirth[2]);

    return (
        <Grid container spacing={2} style={{ margin: '0px auto', backgroundColor: 'aliceblue', borderRadius: '10px', justifyContent: "center", alignItems: "center", paddingBottom: '30px' }} >
            <Grid item xs={12} style={{ margin: '0px 5%' }}>
                <h3 style={{ margin: '0px' }}>Personal informations:</h3>
            </Grid>
            <Grid item xs="auto">
                <TextField
                    id="outlined-read-only-input"
                    label="First Name"
                    defaultValue={props.userData.firstName}
                    InputProps={{
                        readOnly: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person />
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs="auto">
                <TextField
                    id="outlined-read-only-input"
                    label="Last Name"
                    defaultValue={props.userData.lastName}
                    InputProps={{
                        readOnly: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person />
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs="auto">
                <TextField
                    id="outlined-read-only-input"
                    label="Email Address"
                    defaultValue={props.userData.email}
                    InputProps={{
                        readOnly: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <AlternateEmail />
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs="auto">
                <TextField
                    id="outlined-read-only-input"
                    label="Phone Number"
                    defaultValue={props.userData.phoneNumber}
                    InputProps={{
                        readOnly: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Phone />
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs="auto">
                {
                    dateOfBirth === undefined || dateOfBirth === null || dateOfBirth === '' ?
                        (
                            <TextField
                                id="outlined-read-only-input"
                                label="Date Of Birth"
                                defaultValue={""}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRangeOutlined />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        ) :
                        (
                            <TextField
                                id="outlined-read-only-input"
                                label="Date Of Birth"

                                defaultValue={new Intl.DateTimeFormat("en-GB", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit"
                                }).format(dateOfBirth)}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRangeOutlined />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )
                }
            </Grid>
            <Grid item xs="auto">
                <TextField
                    id="outlined-read-only-input"
                    label="Address"
                    defaultValue={props.userData.address}
                    InputProps={{
                        readOnly: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocationOn />
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs="auto">
                <TextField
                    id="outlined-read-only-input"
                    label="Place"
                    defaultValue={props.userData.place.cityName + ", " + props.userData.place.zipCode}
                    InputProps={{
                        readOnly: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Domain />
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs="auto">
                <TextField
                    id="outlined-read-only-input"
                    label="State"
                    defaultValue={props.userData.place.stateName}
                    InputProps={{
                        readOnly: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Public />
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
        </Grid>
    )
}