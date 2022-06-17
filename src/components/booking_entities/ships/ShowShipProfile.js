import React from 'react';
import ImageCardForShip from "./ImageCardForShip";
import { useEffect } from "react";
import { propsLocationStateFound } from '../../forbiddenNotFound/notFoundChecker';
import { useHistory } from 'react-router-dom';

function ShowShipProfile(props) {

    const history = useHistory();

    useEffect(() => {
        propsLocationStateFound(props, history);
    }, [])
    return (
        <div>
            <ImageCardForShip shipId = {props.location.state.bookingEntityId} rating={props.location.state.rating} subscribed={props.location.state.subscribed}/>
        </div>
    );
}

export default ShowShipProfile;