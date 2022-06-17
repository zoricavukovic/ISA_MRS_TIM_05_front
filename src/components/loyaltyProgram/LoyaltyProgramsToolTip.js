import React, { useEffect, useState } from "react";
import { DialogContent, DialogTitle } from '@mui/material';
import Divider from '@mui/material/Divider';
import Tooltip from "@mui/material/Tooltip";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import Dialog from '@mui/material/Dialog';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function LoyaltyProgramToolTip({loyaltyProgram}) {

    const [open, setOpen] = React.useState(true);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Tooltip
            title={
                <Dialog open={open} onClose={handleClose} md>
                    <DialogTitle>Loyalty program</DialogTitle>
                    <Divider />
                    <DialogContent>
                        Users of bookingApp.com can get additional bonuses and discounts when they collect enough points. U can get points after successfull reservation. Discount and bonuses are applied on every reservation.
                        <br />
                        <br />
                        <b>Here is the current programs</b>
                        <Divider />
                        <div style={{ contentAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <span>
                                <MilitaryTechIcon style={{ fontSize: "40px", color: "brown" }} />
                                Bronze program - at least {loyaltyProgram.bronzeLimit} points needed.
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Clients discount: {loyaltyProgram.clientBronzeDiscount} %
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Owners bonus: {loyaltyProgram.ownerBronzeBonus} %
                            <Divider />
                            <br />
                            <span>
                                <MilitaryTechIcon style={{ fontSize: "40px", color: "gray" }} />
                                Silver program - at least {loyaltyProgram.silverLimit} points needed.
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Clients discount: {loyaltyProgram.clientSilverDiscount} %
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Owners bonus: {loyaltyProgram.ownerSilverBonus} %
                            <Divider />
                            <br />
                            <span>
                                <MilitaryTechIcon style={{ fontSize: "40px", color: "orange" }} />
                                Gold program - at least {loyaltyProgram.goldLimit} points needed.
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Clients discount: {loyaltyProgram.clientGoldDiscount} %
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Owners bonus: {loyaltyProgram.ownerGoldBonus} %
                            <Divider sx={{ borderBottomWidth: 2 }} />
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Clients gain {loyaltyProgram.clientPointsPerReservation} points for every reservation
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Owners gain {loyaltyProgram.ownerPointsPerReservation} points for every reservation

                        </div>
                    </DialogContent>
                </Dialog>
            }
        >
            <HelpOutlineIcon onMouseOver={handleClickOpen} />
        </Tooltip>
    );
}

