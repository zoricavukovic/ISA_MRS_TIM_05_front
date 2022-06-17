import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
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
import { get, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import AddingAdditionalService from "../common/AddingAdditionalService.js";
import AddingRulesOfConduct from "../common/AddingRulesOfConduct.js";
import AddingNavigationalEquipment from "./AddingNavigationalEquipment.js"
import Autocomplete from '@mui/material/Autocomplete';
import { addNewPriceListForEntityId, getPricelistByEntityId } from '../../../service/PricelistService.js';
import { getAllPlaces } from '../../../service/PlaceService.js';
import { editShipById, getShipById } from '../../../service/ShipService.js';
import AddingEquipment from '../common/AddingEquipment';
import { getAllPictureBase64ForEntityId } from "../../../service/PictureService.js";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { propsLocationStateFound } from '../../forbiddenNotFound/notFoundChecker.js';
import { userLoggedInAsShipOwner } from '../../../service/UserService.js';
import { Input } from '@mui/material';

import { MAX_NUMBER_OF_IMAGES_TO_UPLOAD, _fillImageListFromBase64Images, _getImagesInJsonBase64 } from "../common/images_utils.js";
import { _getAdditionalServicesJson, _handleAddAdditionalServiceChip, _setInitialAdditionalServices } from "../common/additional_services_utils.js";
import { _getFishingEquipmentNamesJson, _handleAddFishingEquipmentChip, _setInitialFishingEquipment } from "../common/fishiing_equipment_utils.js";
import { _getRuleNamesJson, _handleAddRuleChip, _setInitialRulesOfConduct } from "../common/rules_of_conduct_utils.js";
import { _getNavigationalEquipmentNamesJson, _handleAddNavigationalEquipmentChip, _setInitialNavigationalEquipment } from './adding_navigational_equipment_utils.js';


export default function EditShip(props) {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoadingShip, setLoadingShip] = useState(true);
  const [isLoadingPricelist, setLoadingPricelist] = useState(true);
  const [isLoadingPlaces, setLoadingPlaces] = useState(true);
  const [isLoadinBase64Images, setLoadingBase64Images] = useState(true);
  const [shipBasicData, setShipBasicData] = useState({});
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
    setAdditionalServices((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleAddAdditionalServiceChip = (data) => {
    _handleAddAdditionalServiceChip(data, additionalServices, setAdditionalServices);
  }
  //-------------------------------------------------------------------------------------
  const [fishingEquipment, setFishingEquipment] = React.useState([
  ]);

  const handleDeleteFishingEquipmentChip = (chipToDelete) => {
    console.log(chipToDelete);
    setFishingEquipment((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleAddFishingEquipmentChip = (data) => {
    _handleAddFishingEquipmentChip(data, fishingEquipment, setFishingEquipment);
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

  const [navigationalEquipment, setNavigationalEquipment] = React.useState([
  ]);

  const handleDeleteNavigationalEquipmentChip = (chipToDelete) => {
    console.log(chipToDelete);
    setNavigationalEquipment((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleAddNavigationalEquipmentChip = (data) => {
    _handleAddNavigationalEquipmentChip(data, navigationalEquipment, setNavigationalEquipment);
  }

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
      if (plac.zipCode == shipBasicData.place.zipCode) {

        return allPlacesList[i];
      }
      i++;
    };
    return allPlacesList[i];
  }
  ///////////////////////////////////////////////////

  const onFormSubmit = data => {
    const shipRate = shipBasicData.entityCancelationRate;
    const costPerPerson = pricelistData.entityPricePerPerson;
    console.log(shipBasicData.version);
    let zip = shipBasicData.place.zipCode;
    if (selectedPlaceZip != null && selectedPlaceZip != undefined && selectedPlaceZip != '') {
      zip = selectedPlaceZip;
    }
    let id = shipBasicData.id;
    const editedShip = {
      shipId: id,
      entityCancelationRate: shipRate,
      name: data.name,
      address: data.address,
      place: {
        stateName: "",
        cityName: "",
        zipCode: zip
      },
      version: shipBasicData.version,
      engineNum: data.engineNum,
      shipType: data.shipType,
      length: shipBasicData.length,
      maxSpeed: shipBasicData.maxSpeed,
      enginePower: data.enginePower,
      maxNumOfPersons: data.maxNumOfPersons,
      promoDescription: data.promoDescription,
      entityCancelationRate: data.entityCancelationRate,
      additionalServices: _getAdditionalServicesJson(additionalServices),
      fishingEquipment: _getFishingEquipmentNamesJson(fishingEquipment),
      navigationalEquipment: _getNavigationalEquipmentNamesJson(navigationalEquipment),
      rulesOfConduct: _getRuleNamesJson(rulesOfConduct),
      images: _getImagesInJsonBase64(images),
    }
    console.log(editedShip);
    editedShip.entityCancelationRate = shipRate;
    let newPricelistData = pricelistData;
    newPricelistData.entityPricePerPerson = parseInt(data.costPerNight);
    newPricelistData.additionalServices = _getAdditionalServicesJson(additionalServices);
    newPricelistData.bookingEntityId = shipBasicData.id;
    setPricelistData(newPricelistData);

    editShipById(shipBasicData.id, editedShip).then(result => {

      addNewPriceListForEntityId(shipBasicData.id, newPricelistData).then(result => {
        history.push({
          pathname: "/showShipProfile",
          state: { bookingEntityId: shipBasicData.id }
        })
      }).catch(resError => {
        console.log("Greska!!");
        setMessage(resError.response.data);
        handleClick();
        return;
      })
    }).catch(resError => {
      //console.log(resError.response.data.message);
      setMessage(resError.response.data);
      handleClick();
      return;
    })
  }

  useEffect(() => {
    if (propsLocationStateFound(props, history) && userLoggedInAsShipOwner(history)) {
      getShipById(props.location.state.shipId).then(res => {
        console.log(res.data.version);
        setShipBasicData(res.data);
        _setInitialFishingEquipment(res.data.fishingEquipment, setFishingEquipment);
        _setInitialNavigationalEquipment(res.data.navigationalEquipment, setNavigationalEquipment);
        _setInitialRulesOfConduct(res.data.rulesOfConduct, setRulesOfConduct);
        setLoadingShip(false);
      })
      getAllPictureBase64ForEntityId(props.location.state.shipId).then(res => {
        setBase64Images(res.data);
        setLoadingBase64Images(false);
      });
      getPricelistByEntityId(props.history.location.state.shipId).then(result => {
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


  if (isLoadingShip || isLoadingPricelist || isLoadingPlaces || isLoadinBase64Images) { return <div className="App"><CircularProgress /></div> }

  return (
    <div style={{ backgroundColor: 'aliceblue', margin: '5%', padding: '1%', borderRadius: '10px', height: '100%' }} >
      {getAllPlacesForTheList()}
      <div style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '15%', padding: '1%', borderRadius: '10px', width: '15%' }} >
        Edit Ship
      </div>
      <br />
      <Divider />
      <br />
      <ImageUploader images={images} maxNumber={MAX_NUMBER_OF_IMAGES_TO_UPLOAD} onChange={onChange} />
      <br />
      <h4 style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', marginLeft: "15%" }}>Basic Information About Ship</h4>

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
                    label="Ship Name"
                    placeholder="Ship Name"
                    name="name"
                    defaultValue={shipBasicData.name}
                    onChange={e => {
                      let data = shipBasicData;
                      data.name = e.target.value;
                      setShipBasicData(data);
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
                    defaultValue={shipBasicData.address}
                    name="address"
                    onChange={e => {
                      let dataAdd = shipBasicData;
                      dataAdd.address = e.target.value;
                      setShipBasicData(dataAdd);
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
                      selectedPlaceZip={shipBasicData.place.zipCode}
                      onChange={placeOnChange}
                      renderInput={(params) => <TextField {...params} label="Place" />}
                    />
                  </Grid>

                </td>
              </tr>
              <tr>
                <td>
                  <TextField
                    id="outlined-textarea"
                    label="Ship Type"
                    placeholder="Ship Type"
                    multiline
                    defaultValue={shipBasicData.shipType}
                    name="shipType"
                    onChange={e => {
                      let dataAdd = shipBasicData;
                      dataAdd.shipType = e.target.value;
                      setShipBasicData(dataAdd);
                    }}
                    size="small"
                    {...register("shipType", { required: true, maxLength: 30 })}
                    style={{ width: '200px' }}
                  />

                </td>
              </tr>
              <tr><td> {errors.shipType && <p style={{ color: '#ED6663', fontSize: "10px" }}>Please check ship type: maxLength 30</p>}</td></tr>

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
                      let data = shipBasicData;
                      data.promoDescription = e.target.value;
                      setShipBasicData(data);
                    }}
                    defaultValue={shipBasicData.promoDescription}
                    placeholder="Promo Description"
                    {...register("promoDescription", { maxLength: 250 })}
                    style={{ width: '200px' }}
                  />
                </td>
              </tr>
              <tr> {errors.promoDescription && <p style={{ color: '#ED6663', fontSize: "10px" }}>Max num of characters is 250.</p>}
              </tr>
              <tr>
                <tr>
                  <td>
                    <TextField
                      id="outlined-textarea"
                      label="Engine Name"
                      placeholder="Engine Name"
                      multiline
                      defaultValue={shipBasicData.engineNum}
                      name="engineNum"
                      onChange={e => {
                        let dataAdd = shipBasicData;
                        dataAdd.engineNum = e.target.value;
                        setShipBasicData(dataAdd);
                      }}
                      size="small"
                      {...register("engineNum", { required: true, maxLength: 30 })}
                      style={{ width: '200px' }}
                    />

                  </td>
                </tr>
                <tr><td> {errors.engineNum && <p style={{ color: '#ED6663', fontSize: "10px" }}>Please check engine name: maxLength 30</p>}</td></tr>

              </tr>
            </table>
          </div>

          <div style={{ display: 'block', color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'left', backgroundColor: 'rgb(191, 230, 255)', marginLeft: '4%', marginBottom: "1%", padding: '1%', borderRadius: '10px', width: '40%', height: '100%', minWidth: "300px" }} >
            <table>
              <tr>
                <td>
                  <Typography id="input-slider" gutterBottom sx={{ m: 1 }}>
                    Ship Length (m)
                  </Typography>
                </td>
                <td>
                  <Input sx={{ m: 1 }}
                    defaultValue={shipBasicData.length}
                    style={{ minWidth: "50px" }}
                    onChange={e => {
                      let data = shipBasicData;
                      let cost = parseFloat(e.target.value);
                      if (cost === NaN) alert("Greska");
                      else {
                        data.length = cost;
                      }
                      setShipBasicData(data);

                    }}
                    type="number"
                    name="length"
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 500,
                      type: 'number',
                      'aria-labelledby': 'input-slider',
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Typography id="input-slider" gutterBottom sx={{ m: 1 }}>
                    Max Speed (ft)
                  </Typography>
                </td>
                <td>
                  <Input sx={{ m: 1 }}
                    style={{ minWidth: "50px" }}
                    defaultValue={shipBasicData.maxSpeed}
                    size="small"
                    onChange={e => {
                      let data = shipBasicData;
                      let cost = parseFloat(e.target.value);
                      if (cost === NaN) alert("Greska");
                      else {
                        data.maxSpeed = cost;
                      }
                      setShipBasicData(data);

                    }}
                    type="number"
                    name="maxSpeed"
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 300,
                      type: 'number',
                      'aria-labelledby': 'input-slider',
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <Typography id="input-slider" gutterBottom sx={{ m: 1 }}>
                    Engine Power (kW)
                  </Typography>
                </td>
                <td>
                  <Input sx={{ m: 1 }}
                    style={{ minWidth: "50px" }}
                    defaultValue={shipBasicData.enginePower}
                    size="small"
                    onChange={e => {
                      let data = shipBasicData;
                      data.enginePower = e.target.value;

                      setShipBasicData(data);

                    }}
                    type="number"
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 10000,
                      type: 'number',
                      'aria-labelledby': 'input-slider',
                    }}
                    name="enginePower"
                    {...register("enginePower", { required: true, maxNumber: 10000 })}
                  />
                </td>

              </tr>
              <tr>
                <td>
                  <Typography id="input-slider" gutterBottom sx={{ m: 1 }}>
                    Max Num Of Persons
                  </Typography>
                </td>
                <td>
                  <Input sx={{ m: 1 }}
                    style={{ minWidth: "50px" }}
                    defaultValue={shipBasicData.maxNumOfPersons}
                    size="small"
                    onChange={e => {
                      let data = shipBasicData;
                      data.maxNumOfPersons = e.target.value;

                      setShipBasicData(data);

                    }}
                    type="number"
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 100,
                      type: 'number',
                      'aria-labelledby': 'input-slider',
                    }}
                    name="maxNumOfPersons"
                    {...register("maxNumOfPersons", { required: true })}
                  />
                </td>

              </tr>
              <tr><td>
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
                  <Typography id="input-slider" gutterBottom sx={{ m: 1 }}>
                    Cancelation Rate
                  </Typography>
                </td>
                <td>
                  <Input sx={{ m: 1 }}
                    style={{ minWidth: "50px" }}
                    defaultValue={shipBasicData.entityCancelationRate}
                    size="small"
                    onChange={e => {
                      let data = shipBasicData;
                      let cost = parseFloat(e.target.value);
                      if (cost === NaN) alert("Greska");
                      else {
                        data.entityCancelationRate = cost;
                      }
                      setShipBasicData(data);

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

      <Box style={{ display: "flex", flexDirection: "row", color: 'rgb(5, 30, 52)', backgroundColor: 'rgb(191, 230, 255)', marginLeft: '15%', marginTop: "3%", marginBottom: "1%", padding: '1%', borderRadius: '10px', width: '70%', height: '100%', minWidth: "500px" }}>
        <AddingAdditionalService style={{ marginLeft: '5%' }} data={additionalServices} onDeleteChip={handleDeleteAdditionalServiceChip} onSubmit={handleAddAdditionalServiceChip} float="left" />
        <AddingRulesOfConduct data={rulesOfConduct} onDeleteChip={handleDeleteRuleChip} onSubmit={handleAddRuleChip} ruleChecked={checked} handleRuleCheckedChange={handleRuleCheckedChange} float="left" />
      </Box>
      <Box style={{ display: "flex", flexDirection: "row", color: 'rgb(5, 30, 52)', backgroundColor: 'rgb(191, 230, 255)', marginLeft: '15%', marginTop: "3%", marginBottom: "1%", padding: '1%', borderRadius: '10px', width: '70%', height: '100%', minWidth: "500px" }}>
        <AddingEquipment style={{ marginLeft: '5%' }} data={fishingEquipment} onDeleteChip={handleDeleteFishingEquipmentChip} onSubmit={handleAddFishingEquipmentChip} float="left" />
        <AddingNavigationalEquipment data={navigationalEquipment} onDeleteChip={handleDeleteNavigationalEquipmentChip} onSubmit={handleAddNavigationalEquipmentChip} float="left" />
      </Box>

      <Box style={{ display: "flex", flexDirection: "row" }}>
        <Button type="submit" onClick={handleSubmit(onFormSubmit)} variant="contained" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '33.5%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}>
          Save
        </Button>
        <Button variant="contained" style={{ color: 'rgb(5, 30, 52)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(244, 177, 77)', marginLeft: '2%', marginTop: '1%', padding: '1%', borderRadius: '10px', width: '15%' }}
          onClick={() => {
            reset(
              {
                name: shipBasicData.name,
                address: shipBasicData.address,
                costPerNight: pricelistData.entityPricePerPerson,
                entityCancelationRate: shipBasicData.entityCancelationRate,
                promoDescription: shipBasicData.promoDescription,
              }, {
              keepDefaultValues: false,
              keepErrors: true,
            }
            );
            _setInitialRulesOfConduct(shipBasicData.rulesOfConduct, setRulesOfConduct);
            _setInitialFishingEquipment(shipBasicData.fishingEquipment, setFishingEquipment);
            _setInitialNavigationalEquipment(shipBasicData.navigationalEquipment, setNavigationalEquipment);
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