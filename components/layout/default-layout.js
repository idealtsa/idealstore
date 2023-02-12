import { Fragment, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DefaultNavbar } from './default-navbar';
import { useSession } from "next-auth/react";

const DefaultLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

export const DefaultLayout = (props) => {
  const { children } = props;
  return (
    <Fragment>
      <DefaultLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </DefaultLayoutRoot>
      <DefaultNavbar  />
    
    </Fragment>
  );
};
