import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));


export default function AddingAdditionalServiceWithoutAmount(props) {

  return (
    <Box
      sx={{ ml: '6%', width: '100%', maxWidth: 350, bgcolor: 'background.paper' }}
    >
      <Box sx={{ my: 2, mx: 3 }}>
        <Grid container alignItems="left" display="flex" flexDirection="column" justifyContent="left">
          <Grid item xs>
            <Typography gutterBottom variant="h5" component="div" style={{ color: 'rgb(5, 30, 52)', marginLeft: '2.5%' }}>
              Additional Services
            </Typography>
          </Grid>
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
            {props.addServ.map((data) => {
              return (
                <ListItem key={data.key}>
                  <Chip
                    label={"Service: " + data.serviceName}
                    onClick={() => props.onDeleteChip(data)}
                  />
                </ListItem>
              );
            })}
        </Paper>
        </Grid>

      </Box>
      <Divider variant="middle" />

      <Box sx={{ m: 2, ml: 2.5 }}>
        <Typography gutterBottom variant="body1">
          Added Additional Services
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
          {props.addedServ.map((data) => {
              return (
                <ListItem key={data.key}>
                  <Chip
                    label={"Service: " + data.serviceName}
                    onDelete={() => props.onDeleteAddedChip(data)}
                  />
                </ListItem>
              );
            })}
        </Paper>

      </Box>

    </Box>
  );
}