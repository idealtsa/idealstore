import React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import moment from 'moment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { getToken } from "next-auth/jwt"
import { useSession, getSession } from "next-auth/react"
import { useRouter } from 'next/router';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';


export default function UserProfilePage({data}) {
    
  const router = useRouter();
  const { data: session, status } = useSession()
    
  const [ userEmail, setUserEmail ] = React.useState('');
  const [ userName, setUserName ] = React.useState('');
  const [ tokenExpiration, setTokenExpiration ] = React.useState('');
console.log("profile",JSON.stringify(session))
  React.useEffect(() => {            
              
     if(!session) {
      router.push('/') ;                         
     }   
     else {   
      setUserEmail(session.user.email)
      setUserName(session.user.name)
      setTokenExpiration(session.expires)
       console.log(session)
     }                
  
  }, [session])
  
  // R E N D E R   P A G E

  if (session) {
    return (
      <>
      <Container maxWidth="lg" align="center">
            
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card sx={{ maxWidth: 305 }}>           
              
                <CardContent>
                <Typography variant="h4" sx={{mb: 5}}>
                  User Profile
                </Typography>

                <ListItemButton>
                  <ListItemIcon>
                  <PermIdentityOutlinedIcon/>
                  </ListItemIcon>
                  <ListItemText primary={userName} />
                </ListItemButton>

                <ListItemButton>
                  <ListItemIcon>
                  <EmailOutlinedIcon/>
                  </ListItemIcon>
                  <ListItemText primary={userEmail} />
                </ListItemButton>

                <ListItemButton>
                  <ListItemIcon>
                  <TokenOutlinedIcon/>
                  </ListItemIcon>
                  <ListItemText primary={moment(tokenExpiration).format('MM/DD/YYYY hh:mm')} />
                </ListItemButton>

      
                </CardContent>
              </Card>

          </Grid>
          <Grid item xs={4}>
            <Card sx={{ maxWidth: 305 }}>              
                <CardContent>
                  <Typography variant="h4" >
                  Password
                  </Typography>

                  <KeyOutlinedIcon sx={{fontSize: '78px'}}/>
                    
                    <Typography variant="body2" align="left">
                    Make your password stronger, or change it if someone else knows it.
                    </Typography>
                </CardContent>
              </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ maxWidth: 305 }}>           
              <CardContent>
                <Typography variant="h4" >
                  Settings
                </Typography>

                <SettingsOutlinedIcon sx={{fontSize: '78px'}}/>
                  
                <Typography variant="body2" align="left">
                Personalize your account settings and see how your data is used.
                </Typography>
                
              </CardContent>
            </Card>

          </Grid>
          <Grid item xs={8}>

          </Grid>
        </Grid>
                
        </Container>
      </>
    );
  }
  else return <Typography variant="h3" align="center"> Access Denied </Typography>
    
}

export async function getServerSideProps(context) {
  const { req, res } = context;

  try {    
    const secret = process.env.NEXTAUTH_SECRET
    const token = await getToken({ req, secret })   
    setTimeout(() => {
      console.log('token', token)  
    }, 1000);
    
  } catch (e) {
    console.log('getServerSideProps Token Error')
  }
  
  
  return {
    props: {      
      data: []
    },
  };
}
  