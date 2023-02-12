import { useContext } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Box, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import {  signIn, signOut } from "next-auth/react"

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open,user,isLogin, ...other } = props;
  const authContext = {
  }

  // const handleSignOut = async () => {
  //   onClose?.();

  //   // Check if authentication with Zalter is enabled
  //   // If not enabled, then redirect is not required
  //   if (!ENABLE_AUTH) {
  //     return;
  //   }

  //   // Check if auth has been skipped
  //   // From sign-in page we may have set "skip-auth" to "true"
  //   // If this has been skipped, then redirect to "sign-in" directly
  //   const authSkipped = globalThis.sessionStorage.getItem('skip-auth') === 'true';

  //   if (authSkipped) {
  //     // Cleanup the skip auth state
  //     globalThis.sessionStorage.removeItem('skip-auth');

  //     // Redirect to sign-in page
  //     Router
  //       .push('/sign-in')
  //       .catch(console.error);
  //     return;
  //   }

  //   try {
  //     // This can be call inside AuthProvider component, but we do it here for simplicity
  //     await auth.signOut();

  //     // Update Auth Context state
  //     authContext.signOut();

  //     // Redirect to sign-in page
  //     Router
  //       .push('/sign-in')
  //       .catch(console.error);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: { width: '300px' }
      }}
      {...other}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">
          Account
        </Typography>
       { isLogin&&<Typography
          color="text.secondary"
          variant="body2"
        >
          {user.name}
        </Typography>}
      </Box>
      <MenuList
        disablePadding
        sx={{
          '& > *': {
            '&:first-of-type': {
              borderTopColor: 'divider',
              borderTopStyle: 'solid',
              borderTopWidth: '1px'
            },
            padding: '12px 16px'
          }
        }}
      >
        {isLogin?<MenuItem onClick={signOut}>
          Sign out
        </MenuItem>:<MenuItem onClick={signIn}>
          Sign in
        </MenuItem>}
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
