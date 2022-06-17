import React from 'react';
import ImageCard from "./ImageCard";
import { useEffect } from "react";
import { propsLocationStateFound } from '../../forbiddenNotFound/notFoundChecker';
import { useHistory } from 'react-router-dom';

function ShowCottageProfile(props) {

    const history = useHistory();

    useEffect(() => {
        propsLocationStateFound(props, history);
    }, [])
    return (
        <div>
            <ImageCard cottageId = {props.location.state.bookingEntityId} rating={props.location.state.rating} subscribed={props.location.state.subscribed}/>
        </div>
    );
}

export default ShowCottageProfile;