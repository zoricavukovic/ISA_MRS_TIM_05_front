import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}


export default function RatingEntity(prop) {
  let text = false
  if(prop.text == "undefined" || prop.text == true)
    text = true;
  if(prop.size != "undefined")

  return (

    <Box
      sx={{
        width: 200,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Rating
        name="text-feedback"
        value={prop.value}
        readOnly
        size={prop.size != "undefined"?prop.size:''}
        precision={0.5}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {text && <Box sx={{ ml: 2 }}><h3>{labels[prop.value]}</h3></Box>}
    </Box>
  );
}


export function ControlledRating(prop) {
  return (
    <span>
      <Rating
        name="hover-feedback"
        value={prop.value}
        precision={0.5}
        getLabelText={getLabelText}
        onChange={prop.onChange}
        onChangeActive={prop.onChangeActive}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {
        prop.value !== null && (
          <Box sx={{ ml: 2 }}>{labels[prop.hover !== -1 ? prop.hover : prop.value]}</Box>
        )
      }

    </span>
  );
}