import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Divider } from "@mui/material";
import ImageUploader from "../../image_uploader/ImageUploader.js";
import { CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import AddingAdditionalService from "../common/AddingAdditionalService.js";
import AddingRulesOfConduct from "../common/AddingRulesOfConduct.js";
import Autocomplete from '@mui/material/Autocomplete';
import { addNewPriceListForEntityId, getPricelistByEntityId } from '../../../service/PricelistService.js';
import { getAllPlaces } from '../../../service/PlaceService.js';
import { editCottageById, getCottageById } from '../../../service/CottageService.js';
import AddingRooms from './AddingRooms.js';
import { getAllPictureBase64ForEntityId } from "../../../service/PictureService.js";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { Input } from '@mui/material';


import { MAX_NUMBER_OF_IMAGES_TO_UPLOAD, _fillImageListFromBase64Images, _getImagesInJsonBase64 } from "../common/images_utils.js";
import { _getAdditionalServicesJson, _handleAddAdditionalServiceChip, _setInitialAdditionalServices } from "../common/additional_services_utils.js";
import { _getRuleNamesJson, _handleAddRuleChip, _setInitialRulesOfConduct } from "../common/rules_of_conduct_utils.js";
import { propsLocationStateFound } from '../../forbiddenNotFound/notFoundChecker.js';
import { userLoggedInAsCottageOwner } from '../../../service/UserService.js';
import { _getRoomsJson, _handleAddRoomChip, _setInitialRooms } from './adding_rooms_utils.js';

export default function EditCottage(props) {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoadingCottage, setLoadingCottage] = useState(true);
  const [isLoadingPricelist, setLoadingPricelist] = useState(true);
  const [isLoadingPlaces, setLoadingPlaces] = useState(true);
  const [isLoadinBase64Images, setLoadingBase64Images] = useState(true);
  const [cottageBasicData, setCottageBasicData] = useState({});
  const [pricelistData, setPricelistData] = useState({});
  const [places, setPlaces] = useState([]);
  const [message, setMessage] = useState("");

  const history = useHistory();

  /////////////////////error message////////////////////
  const [open, setOpen] = React.useState(false);
  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  //-------------------------------------------------------------------------------------
  const [images, setImages] = React.useState([]);
  const [base64Images, setBase64Images] = useState([]);

  const onChange = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  //-------------------------------------------------------------------------------------
  const [additionalServices, setAdditionalServices] = React.useState([
  ]);

  const handleDeleteAdditionalServiceChip = (chipToDelete) => {
    console.log(chipToDelete);
    console.log(additionalServices);
    setAdditionalServices((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleAddAdditionalServiceChip = (data) => {
    _handleAddAdditionalServiceChip(data, additionalServices, setAdditionalServices);
  }
  //-------------------------------------------------------------------------------------
  const [checked, setChecked] = React.useState(false);
  const [rulesOfConduct, setRulesOfConduct] = React.useState([]);
  const handleRuleCheckedChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleDeleteRuleChip = (chipToDelete) => {
    setRulesOfConduct((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleAddRuleChip = (data) => {
    _handleAddRuleChip(data, rulesOfConduct, setRulesOfConduct, checked);
  }
  //-------------------------------------------------------------------------------------

  const [rooms, setRooms] = React.useState([
  ]);

  const handleDeleteRoomChip = (chipToDelete) => {
    console.log(chipToDelete);
    setRooms((chips) => chips.filter((chip) => chip.roomNum !== chipToDelete.roomNum));
  };

  const handleAddRoomChip = (data) => {
    _handleAddRoomChip(data, rooms, setRooms);
  }
  //---------------------------------



  ///////////////// PLACES ///////////////////////////
  const [selectedPlaceZip, setSelectedPlaceZip] = useState('');
  const [indexFirstPlace, setIndexPlace] = useState(-1);
  let allPlacesList;

  const placeOnChange = (event, newValue) => {
    if (newValue != null && newValue != undefined && newValue != '') {
      setSelectedPlaceZip(newValue.zip);
    } else {
      setSelectedPlaceZip('');
    }
  }
  const getAllPlacesForTheList = () => {
    let newArray = []
    for (let plac of places) {
      newArray.push({ 'label': plac.cityName + ',' + plac.zipCode + ',' + plac.stateName, 'zip': plac.zipCode });

    }
    allPlacesList = newArray;
  }
  const getIndexPl = () => {

    let i = 0;
    for (let plac of places) {
      if (plac.zipCode == cottageBasicData.place.zipCode) {

        return allPlacesList[i];
      }
      i++;
    };
    return allPlacesList[i];
  }
  ///////////////////////////////////////////////////

  const onFormSubmit = data => {
    const cottageRate = cottageBasicData.entityCancelationRate;
    let zip = cottageBasicData.place.zipCode;
    if (selectedPlaceZip != null && selectedPlaceZip != undefined && selectedPlaceZip != '') {
      zip = selectedPlaceZip;
    }
    let id = cottageBasicData.id;
    const editedCottage = {
      cottageId: id,
      entityCancelationRate: cottageRate,
      name: data.name,
      address: data.address,
      place: {
        stateName: "",
        cityName: "",
        zipCode: zip
      },
      version: cottageBasicData.version,
      promoDescription: data.promoDescription,
      entityCancelationRate: data.entityCancelationRate,
      additionalServices: _getAdditionalServicesJson(additionalServices),
      rooms: _getRoomsJson(rooms),
      rulesOfConduct: _getRuleNamesJson(rulesOfConduct),
      images: _getImagesInJsonBase64(images),
    }
    editedCottage.entityCancelationRate = cottageRate;
    let newPricelistData = pricelistData;
    newPricelistData.entityPricePerPerson = parseInt(data.costPerNight);
    newPricelistData.additionalServices = _getAdditionalServicesJson(additionalServices);
    setPricelistData(newPricelistData);
    editCottageById(cottageBasicData.id, editedCottage).then(result => {

      addNewPriceListForEntityId(cottageBasicData.id, pricelistData).then(result => {
        history.push({
          pathname: "/showCottageProfile",
          state: { bookingEntityId: cottageBasicData.id }
        })
      }).catch(resError => {
        setMessage(resError.response.data);
        handleClick();
        return;
      })
    }).catch(resError => {
      setMessage(resError.response.data);
      handleClick();
      return;
    })
  }

  useEffect(() => {
    if (propsLocationStateFound(props, history) && userLoggedInAsCottageOwner) {

      getCottageById(props.history.location.state.cottageId).then(res => {
        setCottageBasicData(res.data);
        _setInitialRooms(res.data.rooms, setRooms);
        _setInitialRulesOfConduct(res.data.rulesOfConduct, setRulesOfConduct);
        setLoadingCottage(false);
      })
      getAllPictureBase64ForEntityId(props.history.location.state.cottageId).then(res => {
        setBase64Images(res.data);
        setLoadingBase64Images(false);
      });
      getPricelistByEntityId(props.history.location.state.cottageId).then(result => {
        setPricelistData(result.data);
        _setInitialAdditionalServices(result.data.additionalServices, setAdditionalServices);
        setLoadingPricelist(false);
      })

      getAllPlaces().then(results => {

        setPlaces(results.data);
        setLoadingPlaces(false);
      })
    }
  }, []);

  useEffect(() => {
    if (isLoadinBase64Images) {
      return;
    }
    _fillImageListFromBase64Images(setImages, base64Images);
  }, [isLoadinBase64Images]);


  if (isLoadingCottage || isLoadingPricelist || isLoadingPlaces || isLoadinBase64Images) { return <div className="App"><CircularProgress /></div> }

  return (
    <div style={{ backgroundColor: 'aliceblue', margin: '5%', padding: '1%', borderRadius: '10px', height: '100%' }} >
      {getAllPlacesForTheList()}
      <div style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '15%', padding: '1%', borderRadius: '10px', width: '15%' }} >
        Edit Cottage
      </div>
      <br />
      <Divider />
      <br />
      <ImageUploader images={images} maxNumber={MAX_NUMBER_OF_IMAGES_TO_UPLOAD} onChange={onChange} />
      <br />
      <h4 style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', marginLeft: "15%" }}>Basic Information About Cottage</h4>

      <Box sx={{ marginTop: '1%', marginLeft: '11%', marginRight: '5%', width: '90%' }}
        component="form"
        onSubmit={handleSubmit(onFormSubmit)}>
        <Box
          sx={{
            '& .MuiTextField-root': { m: 1, width: '28ch' },
          }}
          style={{ display: "flex", flexDirection: "row" }}
        >

          <div style={{ display: "flex", flexDirection: "row", color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'left', backgroundColor: 'rgb(191, 230, 255)', marginLeft: '4%', padding: '1%', borderRadius: '10px', width: '30%', height: '100%', minWidth: "320px" }} >
            <table>
              <tr>
                <td>
                  <TextField
                    id="outlined-textarea"
                    label="Cottage Name"
                    placeholder="Cottage Name"
                    name="name"
                    defaultValue={cottageBasicData.name}
                    onChange={e => {
                      let data = cottageBasicData;
                      data.name = e.target.value;
                      setCottageBasicData(data);
                    }}
                    multiline
                    size="small"
                    {...register("name", { required: true, maxLength: 50 })}
                    style={{ width: '200px' }}
                  />

                </td>
              </tr>
              <tr><td>{errors.name && <p style={{ color: '#ED6663', fontSize: "10px" }}>Please check name: maxLength 50</p>}</td></tr>
              <tr>
                <td>
                  <TextField
                    id="outlined-textarea"
                    label="Address"
                    placeholder="Address"
                    multiline
                    defaultValue={cottageBasicData.address}
                    name="address"
                    onChange={e => {
                      let dataAdd = cottageBasicData;
                      dataAdd.address = e.target.value;
                      setCottageBasicData(dataAdd);
                    }}
                    size="small"
                    {...register("address", { required: true, maxLength: 50 })}
                    style={{ width: '200px' }}
                  />

                </td>
              </tr>
              <tr><td> {errors.address && <p style={{ color: '#ED6663', fontSize: "10px" }}>Please check address: maxLength 50</p>}</td></tr>
              <tr>
                <td>
                  <Grid item>
                    <Autocomplete
                      disablePortal
                      id="place"
                      size="small"
                      name="place"
                      value={getIndexPl()}
                      options={allPlacesList}
                      selectedPlaceZip={cottageBasicData.place.zipCode}
                      onChange={placeOnChange}
                      renderInput={(params) => <TextField {...params} label="Place" />}
                    />
                  </Grid>

                </td>
              </tr>
            </table>
          </div>




          <div style={{ display: 'block', color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'left', backgroundColor: 'rgb(191, 230, 255)', marginLeft: '4%', marginBottom: "1%", padding: '1%', borderRadius: '10px', width: '40%', height: '100%', minWidth: "300px" }} >
            <table>
              <tr>
                <td>
                  <FormControl sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">Cost Per Night</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      size="small"
                      name="costPerNight"
                      type="number"
                      defaultValue={pricelistData.entityPricePerPerson}
                      onChange={e => {
                        let data = pricelistData;
                        let cost = parseInt(e.target.value);
                        if (cost === NaN) alert("Greska");
                        else {
                          data.entityPricePerPerson = cost;
                        }
                        setPricelistData(data);
                      }}
                      placeholder="Cost Per Night"
                      startAdornment={<InputAdornment position="start">€</InputAdornment>}
                      label="Cost Per Night"
                      {...register("costPerNight", { required: true, min: 1, max: 100000 })}
                    />
                  </FormControl>

                </td>
              </tr>
              <tr>{errors.costPerNight && <p style={{ color: '#ED6663', fontSize: "10px" }}>Please check cost per night between 1-100000€</p>}</tr>


              <tr>
                <td>
                  <TextField
                    size="small"
                    id="outlined-multiline-static"
                    label="Promo Description"
                    name="promoDescription"
                    multiline
                    rows={2}
                    onChange={e => {
                      let data = cottageBasicData;
                      data.promoDescription = e.target.value;
                      setCottageBasicData(data);
                    }}
                    defaultValue={cottageBasicData.promoDescription}
                    placeholder="Promo Description"
                    {...register("promoDescription", { maxLength: 250 })}
                    style={{ width: '200px' }}
                  />
                </td>
              </tr>
              <tr> {errors.promoDescription && <p style={{ color: '#ED6663', fontSize: "10px" }}>Max num of characters is 250.</p>}
              </tr>
              <tr>
                <td>
                  <Typography id="input-slider" gutterBottom>
                    Cancelation Rate
                  </Typography>
                  <Input
                    defaultValue={cottageBasicData.entityCancelationRate}
                    size="small"
                    onChange={e => {
                      let data = cottageBasicData;
                      let cost = parseFloat(e.target.value);
                      if (cost === NaN) alert("Greska");
                      else {
                        data.entityCancelationRate = cost;
                      }
                      setCottageBasicData(data);

                    }}
                    type="number"
                    name="entityCancelationRate"
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 50,
                      type: 'number',
                      'aria-labelledby': 'input-slider',
                    }}
                  />
                </td>
              </tr>
            </table>

          </div>

        </Box>
      </Box>
      <Box style={{ display: "flex", flexDirection: "row" }}>
        <AddingAdditionalService data={additionalServices} onDeleteChip={handleDeleteAdditionalServiceChip} onSubmit={handleAddAdditionalServiceChip} float="left" />
        <AddingRooms data={rooms} onDeleteChip={handleDeleteRoomChip} onSubmit={handleAddRoomChip} float="left" />
        <AddingRulesOfConduct data={rulesOfConduct} onDeleteChip={handleDeleteRuleChip} onSubmit={handleAddRuleChip} ruleChecked={checked} handleRuleCheckedChange={handleRuleCheckedChange} float="left" />            
      </Box>

      <Box style={{ display: "flex", flexDirection: "row" }}>
        <Button type="submit" onClick={handleSubmit(onFormSubmit)} variant="contained" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '33.5%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
          Save
        </Button>
        <Button variant="contained" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '2%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}
          onClick={() => {
            reset(
              {
                name: cottageBasicData.name,
                address: cottageBasicData.address,
                costPerNight: pricelistData.entityPricePerPerson,
                entityCancelationRate: cottageBasicData.entityCancelationRate,
                promoDescription: cottageBasicData.promoDescription,
              }, {
              keepDefaultValues: false,
              keepErrors: true,
            }
            );
            _setInitialRulesOfConduct(cottageBasicData.rulesOfConduct, setRulesOfConduct);
            _setInitialRooms(cottageBasicData.rooms, setRooms);
            _setInitialAdditionalServices(pricelistData.additionalServices, setAdditionalServices);
            _fillImageListFromBase64Images(setImages, base64Images);
          }}>
          Reset
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Box>

    </div>
  );
}