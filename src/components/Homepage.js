import { VpnKey } from '@material-ui/icons';
import { Login } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { getCurrentUser } from '../service/AuthService';
import { getTopRatedCottages } from '../service/CottageService';
import EntityBasicCard from './EntityBasicCard';
import { getTopRatedShips } from '../service/ShipService';
import { getTopRatedAdventures } from '../service/AdventureService';
import cottageCover from "../icons/cottageCover.jpg";
import boatCover from "../icons/boatCover.jpg";
import adventureCover from "../icons/adventureCover.jpg";
import { getAllSubscribedEntities } from '../service/BookingEntityService';

export default function Homepage() {
    const history = useHistory();
    const [curUser, setCurUser] = useState(null);
    const [hotCottages, setHotCottages] = useState([]);
    const [hotBoats, setHotBoats] = useState([]);
    const [hotAdventures, setHotAdventures] = useState([]);
    const [subscribedEntities, setSubscribedEntities] = useState([]);

    useEffect(() => {
        setCurUser(getCurrentUser());
        getTopRatedCottages().then(res=>{
            setHotCottages(res.data);
        })
        getTopRatedShips().then(res=>{
          setHotBoats(res.data);
        })
        getTopRatedAdventures().then(res=>{
          setHotAdventures(res.data);
        })
        if(getCurrentUser() != null && Object.keys(getCurrentUser()).length !== 0)
        {     getAllSubscribedEntities(getCurrentUser().id).then(res => {
                setSubscribedEntities(res.data);
                console.log(res.data);
            });
        }
    }, []);

    const goToLogin = (event) =>{
         history.push("/login");
    }

    const goToRegistration = (event) =>{
         history.push("/registration");
    }

    const openEntityView = (event, type) =>{
      event.preventDefault();
      if(type === 'Cottages')
        history.push("/showCottages");
      else if(type === 'Boats')
        history.push("/showBoats");
      else if(type === 'Adventures')
        history.push("/showAdventures");
    }

    const images = [
        {
          url: cottageCover,
          title: 'Cottages',
          width: '33%',
        },
        {
          url: boatCover,
          title: 'Boats',
          width: '33%',
        },
        {
          url: adventureCover,
          title: 'Adventures',
          width: '33%',
        },
      ];
      
      const ImageButton = styled(ButtonBase)(({ theme }) => ({
        position: 'relative',
        height: 200,
        [theme.breakpoints.down('sm')]: {
          width: '100% !important', // Overrides inline-style
          height: 100,
        },
        '&:hover, &.Mui-focusVisible': {
          zIndex: 1,
          '& .MuiImageBackdrop-root': {
            opacity: 0.15,
          },
          '& .MuiImageMarked-root': {
            opacity: 0,
          },
          '& .MuiTypography-root': {
            border: '4px solid currentColor',
          },
        },
      }));
      
      const ImageSrc = styled('span')({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
      });
      
      const Image = styled('span')(({ theme }) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
      }));
      
      const ImageBackdrop = styled('span')(({ theme }) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
      }));
      
      const ImageMarked = styled('span')(({ theme }) => ({
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
      }));

    return (
        <div className="App">
            <div style={{margin:'50px auto',marginBottom:'0px', width:'80%', backgroundColor:'rgb(5, 30, 52)', padding:'2%', borderRadius:'8px'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h1 style={{ color:'white'}}>Explore new places and gain new experiences with us.</h1>
                </Grid>
                <Grid item xs={12}>
                    <h3 style={{ color:'white'}}>Find best cottages, boats and adventures for reservation.</h3>
                </Grid>
                { curUser == null &&
                <Grid item xs={6} style={{marginTop:'20px'}}>
                    <Button variant='contained' style={{backgroundColor:'rgb(244, 177, 77)', color:'rgb(5, 30, 52)', marginRight:'20px'}} onClick={goToLogin} startIcon={<VpnKey/>}>Log in</Button>
                    <Button variant='contained' style={{backgroundColor:'grey', color:'white'}} startIcon={<Login/>} onClick={goToRegistration}>Register</Button>
                </Grid>
                }
            </Grid>
            </div>
            <div style={{margin:'10px auto', width:'80%', backgroundColor:'white', borderRadius:'8px'}}>
                <h2 style={{padding:'1%'}}>Browse by entity type</h2>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%', margin:'0px auto' }}>
                {images.map((image) => (
                    <ImageButton
                        onClick={(event)=>{openEntityView(event, image.title)}}
                        focusRipple
                        key={image.title}
                        style={{
                            width: image.width,
                        }}
                    >
                    <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
                    <ImageBackdrop className="MuiImageBackdrop-root" />
                    <Image>
                        <Typography
                        component="span"
                        variant="subtitle1"
                        color="inherit"
                        sx={{
                            position: 'relative',
                            p: 4,
                            pt: 2,
                            pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                        }}
                        >
                        {image.title}
                        <ImageMarked className="MuiImageMarked-root" />
                        </Typography>
                    </Image>
                    </ImageButton>
                ))}
                </Box>
            </div>
            <div style={{margin:'10px auto', width:'80%', backgroundColor:'white', borderRadius:'8px'}} >
                <h2 style={{padding:'1%', paddingLeft:'2.6%', paddingBottom:'0px'}}>Hot cottages</h2>
                <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row", justifyContent: "center", padding:'0px' }}>
                    {hotCottages.length === 0 && <h3>No results found.</h3>}
                    {
                    hotCottages.map((item, index) => (
                        <EntityBasicCard bookingEntity={item} key={index} searchParams={null} subscribedEntities={subscribedEntities}/>
                    ))}
                </div>
            </div>
            <div style={{margin:'10px auto', width:'80%', backgroundColor:'white', borderRadius:'8px'}}>
                <h2 style={{padding:'1%', paddingLeft:'2.6%', paddingBottom:'0px'}}>Hot boats</h2>
                <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row", justifyContent: "center" }}>
                    {hotBoats.length === 0 && <h3>No results found.</h3>}
                    {
                    hotBoats.map((item, index) => (
                        <EntityBasicCard bookingEntity={item} key={index} searchParams={null} subscribedEntities={subscribedEntities}/>
                    ))}
                </div>
            </div>
            <div style={{margin:'10px auto', width:'80%', backgroundColor:'white', borderRadius:'8px'}}>
                <h2 style={{padding:'1%', paddingLeft:'2.6%', paddingBottom:'0px'}}>Hot adventures</h2>
                <div style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row", justifyContent: "center" }}>
                    {hotAdventures.length === 0 && <h3>No results found.</h3>}
                    {
                    hotAdventures.map((item, index) => (
                        <EntityBasicCard bookingEntity={item} key={index} searchParams={null} subscribedEntities={subscribedEntities}/>
                    ))}
                </div>
            </div>
        </div>
    );
}
