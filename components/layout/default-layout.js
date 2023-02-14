import { Fragment, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DefaultNavbar } from './default-navbar';
import Head from 'next/head';

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
  const { children,title, description  } = props;
  return (
    <Fragment>
       <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
