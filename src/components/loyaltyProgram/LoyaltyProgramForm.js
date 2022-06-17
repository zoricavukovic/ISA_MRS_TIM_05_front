import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { getAllPlaces } from "../../service/PlaceService";
import { checkIfEmailAlreadyExist, userLoggedInAsSuperAdmin } from "../../service/UserService";

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';

import 'react-phone-input-2/lib/material.css'

import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { FormControl } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { Typography } from "@mui/material";
import { DialogActions } from "@material-ui/core";
import Button from '@mui/material/Button';
import { userLoggedInAsSuperAdminOrAdminWithResetedPassword } from "../../service/UserService";
import { getCurrentLoyaltyProgram, saveNewLoyaltyProgram } from "../../service/LoyaltyProgramService";

export default function LoyaltyProgramForm() {


    const history = useHistory();
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    const [loyaltyProgram, setLoyaltyProgram] = useState(null);
    const [isLoadingLoyaltyProgram, setIsLoadingLoyaltyProgram] = useState(true);

    const bronzeProgramPoints = useRef({});
    bronzeProgramPoints.current = watch("bronzeLimit", 0);
    const silverProgramPoints = useRef({});
    silverProgramPoints.current = watch("silverLimit", 0);
    const goldProgramPoints = useRef({});
    goldProgramPoints.current = watch("goldLimit", 0);

    const bronzeClient = useRef({});
    bronzeClient.current = watch("bronzeClientDiscount", 0);
    const silverClient = useRef({});
    silverClient.current = watch("silverClientDiscount", 0);
    const goldClient = useRef({});
    goldClient.current = watch("goldClientDiscount", 0);

    const bronzeOwner = useRef({});
    bronzeOwner.current = watch("bronzeOwnerBonus", 0);
    const silverOwner = useRef({});
    silverOwner.current = watch("silverOwnerBonus", 0);
    const goldOwner = useRef({});
    goldOwner.current = watch("goldOwnerBonus", 0);


    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState("");

    const [open, setOpen] = React.useState(true);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        history.push('/allRequestsCardsForAdmin');
    };

    useEffect(() => {
        if (userLoggedInAsSuperAdminOrAdminWithResetedPassword(history)) {
            getCurrentLoyaltyProgram().then(res => {
                setLoyaltyProgram(res.data);
                setIsLoadingLoyaltyProgram(false);
            })
        }
    }, []);

    const onFormSubmit = data => {
        let obj = {
            bronzeLimit: data.bronzeLimit,
            silverLimit: data.silverLimit,
            goldLimit: data.goldLimit,
            clientBronzeDiscount: data.bronzeClientDiscount,
            clientSilverDiscount: data.silverClientDiscount,
            clientGoldDiscount: data.goldClientDiscount,
            ownerBronzeBonus: data.bronzeOwnerBonus,
            ownerSilverBonus: data.silverOwnerBonus,
            ownerGoldBonus: data.goldOwnerBonus,
            clientPointsPerReservation: data.clientPoints,
            ownerPointsPerReservation: data.ownersPoints,
        };

        saveNewLoyaltyProgram(obj)
            .then(res => {
                setTypeAlert("success");
                setAlertMessage("Successfully created new loyalty program");
                setOpenAlert(true);
            })
            .catch(err => {
                setTypeAlert("error");
                setAlertMessage("Error happened on server. Please try again.");
                setOpenAlert(true);
            });
    }


    if (isLoadingLoyaltyProgram) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                style={{ margin: '1% auto 1% auto', padding: '1%', width: '100%', borderRadius: '10px' }}
                fullWidth
                maxWidth="md"
                titleStyle={{ textAlign: "center" }}
            >
                <DialogTitle>
                    <Typography variant="h5" align="center">Loyalty Program</Typography>
                </DialogTitle>
                <Divider />
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(onFormSubmit)}
                    style={{ width: '100%' }}
                >
                    <DialogContent>
                        <Typography style={{ fontWeight: "bold", color: "brown" }}>Bronze program</Typography>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <MilitaryTechIcon style={{ fontSize: "40px", color: "brown" }} />
                            <div>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Points for bronze program</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        name="bronzeLimit"
                                        type="number"
                                        id="bronzeLimit"
                                        defaultValue={loyaltyProgram.bronzeLimit}
                                        placeholder="Bronze limit"
                                        label="Bronze points"
                                        {...register("bronzeLimit", {
                                            required: "Specify bronze limit",
                                            validate: value =>
                                                parseInt(value) < parseInt(silverProgramPoints.current) ||
                                                "Bronze points limit should be lesser than silver and gold points",
                                            min: {
                                                value: 1,
                                                message: "Min value of points is 1"
                                            },
                                            max: {
                                                value: 1000,
                                                message: "Max value of points is 1000"
                                            }
                                        })}
                                    />
                                </FormControl>
                                {errors.bronzeLimit && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.bronzeLimit.message}</p>}
                            </div>

                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <div>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Clients Discount %</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        id="bronzeClientDiscount"
                                        name="bronzeClientDiscount"
                                        type="number"
                                        defaultValue={loyaltyProgram.clientBronzeDiscount}
                                        placeholder="Clients Discount %"
                                        label="Clients Discount %"
                                        {...register("bronzeClientDiscount", {
                                            required: "Specify bronze discount for client",
                                            validate: value =>
                                                parseInt(value) < parseInt(silverClient.current) ||
                                                "Bronze discount for client should be lesser than silver and gold discount",
                                            min: {
                                                value: 0.1,
                                                message: "Min value of percentages is 0.1%"
                                            },
                                            max: {
                                                value: 50,
                                                message: "Max value of percentages is 50%"
                                            }
                                        })}
                                    />
                                </FormControl>
                                {errors.bronzeClientDiscount && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.bronzeClientDiscount.message}</p>}
                            </div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <div>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Owners Bonus %</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        id="bronzeOwnerBonus"
                                        name="bronzeOwnerBonus"
                                        type="number"
                                        placeholder="Owners Bonus %"
                                        defaultValue={loyaltyProgram.ownerBronzeBonus}
                                        label="Owners Bonus %"
                                        {...register("bronzeOwnerBonus", {
                                            required: "Specify bronze bonus for owners",
                                            validate: value =>
                                                parseInt(value) < parseInt(silverOwner.current) ||
                                                "Bronze bonus for owner should be lesser than silver and gold bonuses",
                                            min: {
                                                value: 0.1,
                                                message: "Min value of percentages is 0.1%"
                                            },
                                            max: {
                                                value: 50,
                                                message: "Max value of percentages is 50%"
                                            }
                                        })}
                                    />
                                </FormControl>
                                {errors.bronzeOwnerBonus && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.bronzeOwnerBonus.message}</p>}
                            </div>
                        </div>
                        <Divider sx={{ borderBottomWidth: 2 }} />
                        <br />
                        <Typography style={{ fontWeight: "bold", color: "grey" }}>Silver program</Typography>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <MilitaryTechIcon style={{ fontSize: "40px", color: "grey" }} />
                            <div>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Points for silver program</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        name="silverLimit"
                                        type="number"
                                        id="silverLimit"
                                        defaultValue={loyaltyProgram.silverLimit}
                                        placeholder="Silver limit"
                                        label="Silver points"
                                        {...register("silverLimit", {
                                            required: "Specify silver limit",
                                            validate: value =>
                                                parseInt(value) < parseInt(goldProgramPoints.current) ||
                                                "Silver points limit should be lesser than gold limit and greater than bronze limit",
                                            min: {
                                                value: 1,
                                                message: "Min value of points is 1"
                                            },
                                            max: {
                                                value: 1000,
                                                message: "Max value of points is 1000"
                                            }
                                        })}
                                    />
                                </FormControl>
                                {errors.silverLimit && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.silverLimit.message}</p>}
                            </div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <div>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Clients Discount %</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        id="silverClientDiscount"
                                        name="silverClientDiscount"
                                        type="number"
                                        placeholder="Clients Discount %"
                                        defaultValue={loyaltyProgram.clientSilverDiscount}
                                        label="Clients Discount %"
                                        {...register("silverClientDiscount", {
                                            required: "Specify silver discount for client",
                                            validate: value =>
                                                parseInt(value) < parseInt(goldClient.current) ||
                                                "Silver discount for client should be lesser than gold discount",
                                            min: {
                                                value: 0.1,
                                                message: "Min value of percentages is 0.1%"
                                            },
                                            max: {
                                                value: 50,
                                                message: "Max value of percentages is 50%"
                                            }
                                        })}
                                    />
                                </FormControl>
                                {errors.silverClientDiscount && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.silverClientDiscount.message}</p>}
                            </div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <div>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Owners Bonus %</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        id="silverOwnerBonus"
                                        name="silverOwnerBonus"
                                        type="number"
                                        defaultValue={loyaltyProgram.ownerSilverBonus}
                                        placeholder="Owners Bonus %"
                                        label="Owners Bonus %"
                                        {...register("silverOwnerBonus", {
                                            required: "Specify silver bonus for owners",
                                            validate: value =>
                                                parseInt(value) < parseInt(goldOwner.current) ||
                                                "Silver bonus for owner should be lesser than gold bonuse",
                                            min: {
                                                value: 0.1,
                                                message: "Min value of percentages is 0.1%"
                                            },
                                            max: {
                                                value: 50,
                                                message: "Max value of percentages is 50%"
                                            }
                                        })}
                                    />
                                </FormControl>
                                {errors.silverOwnerBonus && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.silverOwnerBonus.message}</p>}
                            </div>
                        </div>
                        <Divider sx={{ borderBottomWidth: 2 }} />
                        <br />
                        <Typography style={{ fontWeight: "bold", color: "orange" }}>Gold program</Typography>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <MilitaryTechIcon style={{ fontSize: "40px", color: "orange" }} />
                            <div>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Points for gold program</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        name="goldLimit"
                                        type="number"
                                        id="goldLimit"
                                        placeholder="Gold limit"
                                        defaultValue={loyaltyProgram.goldLimit}
                                        label="Gold points"
                                        {...register("goldLimit", {
                                            required: "Specify gold limit",
                                            validate: value =>
                                                parseInt(value) > parseInt(silverProgramPoints.current) ||
                                                "Gold points limit should be greater than silver and bronze points limits",
                                            min: {
                                                value: 1,
                                                message: "Min value of points is 1"
                                            },
                                            max: {
                                                value: 1000,
                                                message: "Max value of points is 1000"
                                            }
                                        })}
                                    />
                                </FormControl>
                                {errors.goldLimit && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.goldLimit.message}</p>}
                            </div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <div>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Clients Discount %</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        id="goldClientDiscount"
                                        name="goldClientDiscount"
                                        type="number"
                                        defaultValue={loyaltyProgram.clientGoldDiscount}
                                        placeholder="Clients Discount %"
                                        label="Clients Discount %"
                                        {...register("goldClientDiscount", {
                                            required: "Specify gold discount for client",
                                            validate: value =>
                                                parseInt(value) > parseInt(silverClient.current) ||
                                                "Gold discount for client should be greater than silver discount",
                                            min: {
                                                value: 0.1,
                                                message: "Min value of percentages is 0.1%"
                                            },
                                            max: {
                                                value: 50,
                                                message: "Max value of percentages is 50%"
                                            }
                                        })}
                                    />
                                </FormControl>
                                {errors.goldClientDiscount && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.goldClientDiscount.message}</p>}
                            </div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <div>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Owners Bonus %</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        id="goldOwnerBonus"
                                        name="goldOwnerBonus"
                                        type="number"
                                        placeholder="Owners Bonus %"
                                        defaultValue={loyaltyProgram.ownerGoldBonus}
                                        label="Owners Bonus %"
                                        {...register("goldOwnerBonus", {
                                            required: "Specify gold bonus for owners",
                                            validate: value =>
                                                parseInt(value) > parseInt(silverOwner.current) ||
                                                "Gold bonus for owner should be greater than silver bonuse",
                                            min: {
                                                value: 0.1,
                                                message: "Min value of percentages is 0.1%"
                                            },
                                            max: {
                                                value: 50,
                                                message: "Max value of percentages is 50%"
                                            }
                                        })}
                                    />
                                </FormControl>
                                {errors.goldOwnerBonus && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.goldOwnerBonus.message}</p>}
                            </div>
                        </div>
                        <Divider sx={{ borderBottomWidth: 2 }} />
                        <br />
                        <Typography style={{ textAlign: "center", fontWeight: "bold" }}>Determine how much points users make per reservation</Typography>
                        <br />
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }} >
                            <div>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Points for clients</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        name="clientPoints"
                                        type="number"
                                        defaultValue={loyaltyProgram.clientPointsPerReservation}
                                        placeholder="Points for clients"
                                        label="Points for clients"
                                        {...register("clientPoints", {
                                            required: "Specify points for client",
                                            min: {
                                                value: 1,
                                                message: "Min value of points is 1"
                                            },
                                            max: {
                                                value: 1000,
                                                message: "Max value of points is 1000"
                                            }
                                        })}
                                    />
                                </FormControl>
                                {errors.clientPoints && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.clientPoints.message}</p>}
                            </div>
                            <div>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Points for owners</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        name="ownersPoints"
                                        type="number"
                                        placeholder="Points for owners"
                                        defaultValue={loyaltyProgram.ownerPointsPerReservation}
                                        label="Points for owners"
                                        {...register("ownersPoints", {
                                            required: "Specify points for owners",
                                            min: {
                                                value: 1,
                                                message: "Min value of points is 1"
                                            },
                                            max: {
                                                value: 1000,
                                                message: "Max value of points is 1000"
                                            }
                                        })}
                                    />
                                </FormControl>
                                {errors.ownersPoints && <p style={{ color: '#ED6663', fontSize: '12px' }}>{errors.ownersPoints.message}</p>}
                            </div>
                        </div>
                        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={typeAlert} sx={{ width: '100%' }}>
                                {alertMessage}
                            </Alert>
                        </Snackbar>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" onSubmit={handleSubmit(onFormSubmit)} variant="contained">Save</Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                reset(
                                    {
                                        bronzeClientDiscount: loyaltyProgram.clientBronzeDiscount,
                                        bronzeLimit: loyaltyProgram.bronzeLimit,
                                        bronzeOwnerBonus: loyaltyProgram.ownerBronzeBonus,
                                        clientPoints: loyaltyProgram.clientPointsPerReservation,
                                        goldClientDiscount: loyaltyProgram.clientGoldDiscount,
                                        goldLimit: loyaltyProgram.goldLimit,
                                        goldOwnerBonus: loyaltyProgram.ownerGoldBonus,
                                        ownersPoints: loyaltyProgram.ownerPointsPerReservation,
                                        silverClientDiscount: loyaltyProgram.clientSilverDiscount,
                                        silverLimit: loyaltyProgram.silverLimit,
                                        silverOwnerBonus: loyaltyProgram.ownerSilverBonus
                                    }, {
                                    keepDefaultValues: false,
                                    keepErrors: false,
                                }
                                );
                            }}
                        >
                            Reset
                        </Button>
                        <Button variant="contained" onClick={handleClose}>Close</Button>

                    </DialogActions>
                </Box>
            </Dialog>
        </div >
    );



}

/**
 * bronzeClientDiscount: "1"
bronzeLimit: "34"
bronzeOwnerBonus: "4"
clientPoints: "3"
goldClientDiscount: "3"
goldLimit: "77"
goldOwnerBonus: "6"
ownersPoints: "23"
silverClientDiscount: "2"
silverLimit: "54"
silverOwnerBonus: "5"
 */