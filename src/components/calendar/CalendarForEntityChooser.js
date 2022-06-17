import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";
import { userLoggedInAsOwner } from "../../service/UserService";
import { getCurrentUser } from "../../service/AuthService";
import { styled, useTheme } from "@mui/material/styles";
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { getAllBookingEntitiesByOwnerId } from "../../service/BookingEntityService";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

  
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

export default function CalendarForEntityChooser(props) {

    const [selectedEntityId, setSelectedEntityId] = React.useState(null);
    const theme = useTheme();
    const [entities, setEntities] = React.useState([]);
    const [isLoadingEntities, setIsLoadingEntities] = useState(true);
    const history = useHistory();

    function onChangeValueName(event) {
        setSelectedEntityId(event.target.value);
    };

    const showCalendarForEntity = () => {
        if (selectedEntityId == null)
            return;
        history.push({
            pathname:"/calendarForEntity",
            state: {
                bookingEntityId: selectedEntityId
            }
        });
    }

    const loadEntitiesFromCurrentOwner = () => {
        getAllBookingEntitiesByOwnerId(getCurrentUser().id)
            .then(res => {
                setEntities(res.data);
                setIsLoadingEntities(false);
            })
    }

    useEffect(() => {
        if (userLoggedInAsOwner(history)) {
            loadEntitiesFromCurrentOwner();
        }
    }, []);


    if (isLoadingEntities) {
        return <div className="App">Loading...</div>
    }
    return (
        <Drawer
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                },
            }}
            variant="persistent"
            anchor="right"
            open={props.open}
        >
            <DrawerHeader>
                <IconButton onClick={props.handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                <ListItem key={"EntityName"} disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ArrowCircleDownIcon/>
                        </ListItemIcon>
                        <ListItemText primary={"Entity name"} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"combo"} disablePadding>
                    <table onChange={onChangeValueName}
                        style={{ marginLeft: "7%", marginTop: "1%", minWidth: '200px', color: 'rgb(5, 30, 52)' }}>
                        {entities.map((item) => (
                            <tr>
                                <td><input type="radio" value={item.id} name="name" /> {item.name}</td>
                            </tr>
                        ))}
                    </table>

                </ListItem>
                <Divider />
                <Button onClick={showCalendarForEntity}>Show calendar</Button>
            </List>
        </Drawer>
    );

}