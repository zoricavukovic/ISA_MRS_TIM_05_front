import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useForm } from "react-hook-form";



const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));


export default function AddingRooms(props) {

  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <Box
      sx={{ ml: '6%', width: '100%', maxWidth: 350, bgcolor: 'background.paper' }}
      component="form"
      noValidate
      onSubmit={handleSubmit(props.onSubmit)}
    >
      <Box sx={{ my: 2, mx: 3 }}>
        <Grid container alignItems="left" display="flex" flexDirection="column" justifyContent="left">
          <Grid item xs>
            <Typography gutterBottom variant="h5" component="div" style={{ color: 'rgb(5, 30, 52)', marginLeft: '2.5%' }}>
              Rooms
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              size="small"
              type="number"
              name="roomNum"
              style={{ width: '60%', marginLeft: '2.5%' }}
              id="roomNum"
              label="Room Num"
              placeholder="Room Num"
              variant="outlined"
              {...register("roomNum", { required: true, min: 1, max: 100})}
            />
            {errors.roomNum && <p style={{ color: '#ED6663' }}>Please enter valid room number (1-100).</p>}
          </Grid>
          <br />
          <Grid item>
            <TextField
              size="small"
              type="number"
              name="numOfBeds"
              style={{ width: '60%', marginLeft: '2.5%' }}
              id="numOfBeds"
              label="Num Of Beds"
              placeholder="Num Of Beds"
              variant="outlined"
              {...register("numOfBeds", { required: true, min: 1, max: 30 })}
            />
            {errors.numOfBeds && <p style={{ color: '#ED6663' }}>Please enter valid num of beds (1-30).</p>}
          </Grid>
          <Grid item>
            <Button
              label="Extra Soft"
              style={{
                color: 'rgb(5, 30, 52)',
                fontWeight: 'bold',
                borderRadius: '10px',
                marginLeft: '2.5%',
                marginTop: '3%',
                backgroundColor: 'rgb(244, 177, 77)'
              }}
              onClick={handleSubmit(props.onSubmit)}
            >
              Add
            </Button>
          </Grid>
        </Grid>

      </Box>
      <Divider variant="middle" />

      <Box sx={{ m: 2, ml: 2.5 }}>
        <Typography gutterBottom variant="body1">
          Added Rooms
        </Typography>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0,
          }}
          component="ul"
        >
          {props.data.map((item) => {
            return (
              <ListItem key={item.key}>
                <Chip
                  label={"Room num: " + item.roomNum + ', Num of beds: ' + item.numOfBeds}
                  onDelete={() => props.onDeleteChip(item)}
                />
              </ListItem>
            );
          })}
        </Paper>

      </Box>

    </Box>
  );
}