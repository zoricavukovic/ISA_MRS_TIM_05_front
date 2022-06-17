import React, { Component, useState, useEffect } from 'react';
import '../App.css';
import UserProfile from "./user/UserProfile";
import EditUserProfile from "./user/EditUserProfile";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

import ShowCottageProfile from "./booking_entities/cottages/ShowCottageProfile";
import AddCottage from "./booking_entities/cottages/AddCottage";
import EditCottage from "./booking_entities/cottages/EditCottage";

import ShowShipProfile from "./booking_entities/ships/ShowShipProfile";
import AddShip from "./booking_entities/ships/AddShip";
import EditShip from "./booking_entities/ships/EditShip";

import AdventureProfile from './booking_entities/adventures/AdventureProfile';
import AddAdventure from './booking_entities/adventures/AddAdventure';
import EditAdventure from './booking_entities/adventures/EditAdventure';

import Sidebar from "./Sidebar";
import Login from './Login';
import Registration from './user/Registration';
import ChooseAccType from './user/ChooseAccType';
import RegistrationForm from './user/RegistrationForm';

import ShowReservationsOwner from "./reservations/ShowReservationsOwner.js";
import ShowReservationsDetails from "./reservations/ReservationDetails";
import ShowFastReservations from "./reservations/ShowFastReservations";
import AddFastReservation from './reservations/AddFastReservation';

import ShowAllEntitiesForOwner from './ShowAllEntitiesForOwner';

import ShowBoats from "./entities_view/ShowBoats";
import ShowCottages from './entities_view/ShowCottages';
import ShowAdventures from './entities_view/ShowAdventures';

import CalendarForEntity from './calendar/CalendarForEntity';
import NotFoundPage404 from './forbiddenNotFound/NotFoundPage404';
import ForbiddenPage403 from './forbiddenNotFound/ForbiddenPage403';
import NewReservation from './reservations/NewReservationPage';
import ChangePassword from './ChangePassword';
import searchForReservation from './SearchForReservation';
import AddAdmin from './admin/AddAdmin';
import MyReservations from './reservations/MyReservations';
import ShowReservationsDetailsForClient from './reservations/ReservationDetailsForClient';
import Reports from './analytics/Reports';
import ReviewReservationReport from './admin/ReviewReservationReports';
import ReviewRatingsAdmin from './admin/ReviewRatingsAdmin';
import ReviewComplaints from './admin/ReviewComplaints';
import ReviewDeleteAccountRequests from './admin/ReviewDeleteAccountRequests';
import AllRequestsCards from './admin/AllRequests';
import ReviewNewAccountRequests from './admin/ReviewNewAccountRequests';
import AcceptedAccount from './user/AcceptedAccount';
import Homepage from './Homepage';
import LoyaltyProgramForm from './loyaltyProgram/LoyaltyProgramForm';
import SystemRevenue from './admin/SystemRevenue';
import LikedEntities from './LikedEntities';
import Calendar from "./calendar/Calendar";
import ReviewAllUsers from "./admin/allUsers/AllUsers";


function App() {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        if (window.localStorage.getItem('user') === null) {
            setCurrentUser({})
        } else {
            setCurrentUser(JSON.parse(window.localStorage.getItem('user')));
        }
    }, []);

    const setNewUser = (newUser) => {
        setCurrentUser(newUser);
    }

    return (
        <>
            <Router>
                <Sidebar curUser={currentUser} setCurUser={setNewUser} />
                <Switch>
                    <Route path="/homepage" component={Homepage} />
                    <Route path="/showBoats" component={ShowBoats} />
                    <Route path="/showCottages" component={ShowCottages} />
                    <Route path="/showAdventures" component={ShowAdventures} />

                    <Route path="/adventures" component={ShowAllEntitiesForOwner} />
                    <Route path="/cottages" component={ShowAllEntitiesForOwner} />
                    <Route path="/ships" component={ShowAllEntitiesForOwner} />

                    <Route path="/userProfile" component={UserProfile} />
                    <Route path="/editUserProfile" component={EditUserProfile} />

                    <Route path="/showCottageProfile" component={ShowCottageProfile} />
                    <Route path="/addCottage" component={AddCottage} />
                    <Route path="/editCottage" component={EditCottage} />
                    
                    <Route path="/login" ><Login setCurrentUser={setNewUser} /></Route>

                    <Route path="/showShipProfile" component={ShowShipProfile} />
                    <Route path="/addShip" component={AddShip} />
                    <Route path="/editShip" component={EditShip} />
                    <Route path="/likedEntites" component={LikedEntities} />


                    {/* <Route path="/login" ><Login setCurrentUser={setCurrentUser}/></Route> */}
                    <Route path="/registration" ><Registration/></Route>
                    <Route path="/chooseAccType" ><ChooseAccType/></Route>
                    <Route path="/registrationForm" ><RegistrationForm/></Route>
                    <Route path="/activatedAccount/:email" ><AcceptedAccount/></Route>
                    

                    <Route path="/showReservationsOwner" component={ShowReservationsOwner} />
                    <Route path="/showReservationDetails" component={ShowReservationsDetails} />
                    <Route path="/showReservationDetailsForClient" component={ShowReservationsDetailsForClient} />

                    <Route path="/showFastReservations" component={ShowFastReservations} />
                    <Route path="/addFastReservation" component={AddFastReservation} />

                    <Route path="/showAdventureProfile" component={AdventureProfile} />
                    <Route path="/addAdventure" component={AddAdventure} />
                    <Route path="/editAdventure" component={EditAdventure} />
                    <Route path="/newReservation" component={NewReservation} />
                    <Route path="/search" component={searchForReservation} />
                    <Route path="/myReservations" component={MyReservations} />

                    <Route path="/analytics" component={Reports} />


                    <Route path="/calendarForEntity" component={CalendarForEntity} />
                    <Route path="/notFoundPage" component={NotFoundPage404} />
                    <Route path="/forbiddenPage" component={ForbiddenPage403} />

                    <Route path="/changePassword" component={ChangePassword} />
                    <Route path="/addAdmin" component={AddAdmin} />
                    <Route path="/adminHomePage" component={AllRequestsCards} />
                    <Route path="/reviewReservationReportsAdmin" component={ReviewReservationReport} />
                    <Route path="/reviewRatingsAdmin" component={ReviewRatingsAdmin} />
                    <Route path="/reviewComplaintsAdmin" component={ReviewComplaints} />
                    <Route path="/reviewDeleteAccountRequests" component={ReviewDeleteAccountRequests} />
                    <Route path="/allRequestsCardsForAdmin" component={AllRequestsCards} />
                    <Route path="/reviewNewAccountRequests" component={ReviewNewAccountRequests} />
                    <Route path="/loyaltyProgram" component={LoyaltyProgramForm}/>
                    <Route path="/systemRevenue" component={SystemRevenue} />
                    <Route path="/calendar" component={Calendar} />
                    <Route path="/allUsers" component={ReviewAllUsers} />
                    <Redirect to="/homepage"></Redirect>
                </Switch>
            </Router>
        </>
    );
}

export default App;
