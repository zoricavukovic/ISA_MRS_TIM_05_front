import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import ShipOwner from "../../../icons/shipOwner.png";
import CottageOwner from "../../../icons/cottageOwner.png";
import Instructor from "../../../icons/instructor.png";
import PersonIcon from '@mui/icons-material/Person';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Button from "@mui/material/Button";


let columns = [
    { field: 'id', headerName: 'User ID', width: 110 },
    { field: 'User', headerName: 'User', width: 200 },
    { field: 'Email', headerName: 'Email', width: 350 },
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
                else if (params.value === "ROLE_SHIP_OWNER") {
                    return (
                        <img style={{ width: "45px" }} src={ShipOwner}></img>
                    );
                }
                else if (params.value === "ROLE_CLIENT") {
                    return (
                        <PersonIcon
                            style={{ fontSize: 45, color: "rgba(108,168,146,255)" }} />
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
    {
        field: 'Profile',
        headerName: 'Profile',
        width: 120,
        renderCell: (params) => {
            return (
                <div>
                    <Button variant="contained" style={{ color: 'white', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgba(17,16,29,255)', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '18%' }}>
                        Profile
                    </Button>
                </div>

            );
        }
    },
    {
        field: 'Entities',
        headerName: 'User Entities',
        width: 120,
        renderCell: (params) => {
            return (
                <div>
                    {
                        params.value ?
                            (
                                <Button variant="contained" style={{ color: 'white', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgba(17,16,29,255)', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '18%' }}>
                                    Entities
                                </Button>
                            ) :
                            (
                                <span></span>
                            )
                    }
                </div>

            );
        }
    },
    {
        field: 'Delete',
        headerName: 'Delete user',
        width: 120,
        renderCell: (params) => {
            return (
                <div>
                    <Button>
                        <BackspaceIcon style={{ fontSize: 25, color: "rgb(212,28, 28)" }} />
                    </Button>
                </div>

            );
        }
    },
];





export default function UsersDataGrid(props) {

    return (
        <div >
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

                style={{ height: '650px' }}
                rows={props.rows}
                columns={columns}
                disableColumnSelector
                onCellClick={props.handleOnCellClick}
            />
        </div>
    );
}