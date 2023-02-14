import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box,  Divider, Drawer,useMediaQuery,Avatar, } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SettingsIcon from '@mui/icons-material/Settings';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CancelIcon from '@mui/icons-material/Cancel';
import { NavItem } from './nav-item';
import StoreIcon from "@mui/icons-material/Store";
import HomeIcon from '@mui/icons-material/Home';
const items = [
  {
    href: '/',
    icon: (<HomeIcon fontSize="small" />),
    title: 'Home'
  },
  {
    href: '/dashboard/',
    icon: (<BarChartIcon fontSize="small" />),
    title: 'Dashboard'
  },
  {
    href: '/dashboard/customers',
    icon: (<PeopleIcon fontSize="small" />),
    title: 'Customers'
  },
  {
    href: '/dashboard/products',
    icon: (<ShoppingBagIcon fontSize="small" />),
    title: 'Products'
  },
  {
    href: '/dashboard/account',
    icon: (<PersonIcon fontSize="small" />),
    title: 'Account'
  },
  {
    href: '/dashboard/settings',
    icon: (<SettingsIcon fontSize="small" />),
    title: 'Settings'
  },
  {
    href: '/dashboard/login',
    icon: (<LockPersonIcon fontSize="small" />),
    title: 'Login'
  },
  {
    href: '/dashboard/register',
    icon: (<PersonAddIcon fontSize="small" />),
    title: 'Register'
  },
  {
    href: '/dashboard/404',
    icon: (<CancelIcon fontSize="small" />),
    title: 'Error'
  }
];

export const DashboardSidebar = (props) => {
  const { open, onClose ,isLogin,user} = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{p:2, display:'d-flex',justifyContent:'center'}}>
               <Avatar
                onClick={() => setOpenAccountPopover(true)}
                sx={{
                  cursor: "pointer",
                  width:'100px',
                  height:'100px',
                }}
                src={user?.image}
              >
                 {!isLogin&&<StoreIcon  fontSize='large' />}
              </Avatar>
            
          </Box>
       
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            mb: 3
          }}
        />
  
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
        </Box>
        <Divider sx={{ borderColor: '#2D3748' }} />
        <Box
          sx={{
            px: 2,
            py: 3
          }}
        >
        
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
