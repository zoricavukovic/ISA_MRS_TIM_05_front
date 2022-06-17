import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function BasicPagination(props) {
  return (
    <Stack spacing={2} style={{alignItems:"center", justifyContent:"center"}}>
      <Pagination count={props.count} />
    </Stack>
  );
}