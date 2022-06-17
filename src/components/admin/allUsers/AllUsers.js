import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";
import { getAllUsers, userLoggedInAsSuperAdminOrAdminWithResetedPassword } from "../../../service/UserService";
import { useHistory } from "react-router-dom";
import UsersDataGrid from "./UsersDataGrid";
import ConfirmPassDialog from "./ConfirmPassDialog";

let rows = [];


export default function ReviewAllUsers() {

    const history = useHistory();
    const [isLoadingAllUsers, setLoadingAllUsers] = useState(true);
    const [allUsers, setAllUsers] = useState();
    const [selectedId, setSelectedId] = useState(null);

    //------------------------CONFIRM PASS----------------------
    const [openedConfirmPassDialog, setOpenedConfirmPassDialog] = React.useState(false);
    const handleClickOpenConfirmPassDialog = () => {
        setOpenedConfirmPassDialog(true);
    };
    const handleCloseConfirmPassDialog = () => {
        setSelectedId(null);
        setOpenedConfirmPassDialog(false);
        loadUsers();
    };
    //-----------------------------------------------------------------------------

    const deleteUserById = (id) => {
        console.log("postavaljam novi id na: " + id);
        setSelectedId(id);
        handleClickOpenConfirmPassDialog();
    }

    const findUserByIndex = (index) => {
        for (let u of allUsers) {
            if (u.id === index) return u;
        }
    }


    const showEntitiesForOwner = (id) => {
        let user = findUserByIndex(id);
        let locationUrl = ''; 
        if (user.userType.name === "ROLE_INSTRUCTOR") {
            locationUrl = "/showAdventures"; 
        } else if (user.userType.name === "ROLE_COTTAGE_OWNER") {
            locationUrl = "/showCottages";
        } else if (user.userType.name === "ROLE_SHIP_OWNER") {
            locationUrl = "/showBoats";
        }
        history.push({
            pathname: locationUrl,
            state: {ownerId: id},
        });
    }

    const showUserProfile = (id) => {
        history.push({
            pathname:'/userProfile',
            state: {userId: id}
        });
    }

    const handleOnCellClick = (params) => {
        if (params.field === "Profile") {
            showUserProfile(params.id);
        } else if (params.field === "Delete") {
            deleteUserById(params.id);
        } else if (params.field === 'Entities') {
            showEntitiesForOwner(params.id);
        }
    }


    const fillRowsWithData = () => {
        let newRows = [];
        for (let r of allUsers) {
            if (r.userType.name === "ROLE_ADMIN" || r.userType.name === "ROLE_SUPER_ADMIN")
                continue;

            let showEntities = true;
            if (r.userType.name === "ROLE_CLIENT")
                showEntities = false;

            let rowToAdd = {
                'id': r.id,
                'User': r.firstName + ' ' + r.lastName,
                'Email': r.email,
                'Type': r.userType.name,
                'Entities': showEntities
            }
            newRows.push(rowToAdd);
        }
        rows = newRows;
    }


    const loadUsers = () => {
        setLoadingAllUsers(true);
        getAllUsers().then(res => {
            setAllUsers(res.data);
            setLoadingAllUsers(false);
        })
    }

    useEffect(() => {
        if (userLoggedInAsSuperAdminOrAdminWithResetedPassword(history)) {
            loadUsers();
        }
    }, [])

    if (isLoadingAllUsers) {
        return <div className="App">Loading...</div>
    }
    else {
        { fillRowsWithData() }

        return (
            <Box
                alignItems="center"
                justifyContent="center"
                style={{ margin: '1% 5% 1% 20%' }}
            >
                <ConfirmPassDialog
                    handleClickOpenConfirmPassDialog={handleClickOpenConfirmPassDialog}
                    handleCloseConfirmPassDialog={handleCloseConfirmPassDialog}
                    loadUsers={loadUsers}
                    selectedId={selectedId}
                    openedConfirmPassDialog={openedConfirmPassDialog}
                />

                <h3 color="rgba(17,16,29,255)">All users</h3>
                <br />
                <Divider sx={{ borderBottomWidth: 2, color: "rgba(17,16,29,255)" }} />
                <br />
                <UsersDataGrid allUsers={allUsers} rows={rows} handleOnCellClick={handleOnCellClick} />
            </Box>
        )
    }
}