import React from 'react';
import { FullscreenControl, Placemark, YMaps, Map, ZoomControl } from "react-yandex-maps";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

export default function Home(props){
    const [longitude, setLongitude] = useState();
    const [latitude, setLatitude] = useState();
    const [isLoading, setLoading] = useState(true);
    
    useEffect(() => {
        if (props === undefined || props === null) return;
        setLongitude(props.long);
        setLatitude(props.lat);
        setLoading(false);
    }, [])

    function alertic(event){
        let coords = event._sourceEvent.originalEvent.coords;
        console.log(event);
        //alert(coords);
        
    }
    
if (isLoading) return <div className="App"><CircularProgress /></div>
    return <YMaps style={{borderRadius:"10px"}} query={{ lang: 'en_RU' }}>
        <div>
            <Map onClick={alertic} width={'500px'} height='500px' defaultState={{
                    center:[latitude, longitude],
                    zoom:6,
            }}>
                
            <Placemark geometry={[latitude, longitude]}></Placemark>
            <FullscreenControl options={{float:"left"}}></FullscreenControl>
            <ZoomControl options={{float:"left"}}></ZoomControl>
            </Map>
            
        </div>
    </YMaps>
}
