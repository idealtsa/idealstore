import {useState, useEffect} from 'react';
import { signIn, getProviders, useSession, getCsrfToken } from "next-auth/react";
import Head from 'next/head';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import { getToken } from "next-auth/jwt"
import { blue } from '@mui/material/colors';

export default function Signin({ providers, csrfToken,loginError }) { 
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("Unauthenticated")
    },
  });
  const router = useRouter();
  
 
  const [values, setValues] = useState({
    email: 'majid.qauiub@gmail.com',
    password: '123456',    
    showPassword: false,
    rememberMe: false
  });
      
  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {   
    if (status === "authenticated") {
      router.push('/')
    }    
  }, [status])
  

  const handleRememberMe = (prop) => (event) => {
    setValues({ ...values, rememberMe: !rememberMe });
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = (e) => {
    e.preventDefault();
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

 
  const handleLoginUser = async (e) => {    
    e.preventDefault();

    await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: `${window.location.origin}/auth/profile`,
    });
 
  }

  return (
    <>
    <Head>
    <link rel="shortcut icon" href="/favicon.ico" />
    <title>Full Stack Soup - Next-Auth Demo</title>
    </Head>

    <Container component="main" maxWidth="xs">
      <Grid container align="center">
      <Grid item xs={12}>        
          <Avatar  sx={{ bgcolor: blue[200] }}>
            <LockOutlinedIcon />
          </Avatar>
        </Grid>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5" sx={{mb: 2}}>
            Sign in
          </Typography>
        </Grid>
        {showAlert &&
        <Grid item xs={12}>
          <Typography component="h1" variant="h5" sx={{mb: 2}}>
            <Alert severity="error" onClose={() => {setShowAlert(false)}}>
              <AlertTitle>Warning</AlertTitle>
              Incorrect Email and Password combination
            </Alert>
          </Typography>
        </Grid>
        }

        <Grid item xs={12}>
            <form  noValidate>
            <Grid container spacing={2}>
                
              <Grid item xs={12}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
         
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    placeholder='user@email.com'
                    onChange={handleChange('email')}
                    value={values.email}
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        required
                        label="Password"
                        id="outlined-adornment-password"
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.password}
                        placeholder='123'
                        onChange={handleChange('password')}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              size="large">
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                        
                    />
                  </FormControl>
                
              </Grid>
  
              <Grid item xs={12} align="left">
                  <FormControlLabel
                    control={<Checkbox  color="primary" onChange={handleRememberMe} value={values.rememberMe}/>}
                    label="Remember me"
              />
              </Grid>

              <Grid item xs={12}>

                <Button
                  type="button"
                  fullWidth
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled={(values.email.length === 0 || values.password.length === 0 )}
                  onClick={handleLoginUser}
                 
                >
                  Sign In
                </Button>
            </Grid>         
        
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs align="left">
                  <Link href="\auth\forgot-password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item align="right">
                  <Link href="\register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
                
            </Grid>  
                
            </Grid>         
          </form>
        </Grid>         
         
        <Grid item xs={12}>
          <form  noValidate>        
            <Stack spacing={2} sx={{mt: 8}}>
              {Object.values(providers).map((provider,index) => 
                { return provider.name !== 'Email and Password' ?
                <div key={`${provider.name}-${index}`} >                  
                  <Button size="large" variant="outlined" fullWidth onClick={() => signIn(provider.id)} >
                    Sign in with {provider.name}
                  </Button>
                </div>:null
                }
               )}
            </Stack>           
          </form>
        </Grid> 
      </Grid>

    </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query, req, res } = context;
  var error = ''
  if(Boolean(query.error)) {
    error = query.error
  }
  let csrfToken,providers
  const secret = process.env.NEXTAUTH_SECRET
  try {    
    csrfToken = await getCsrfToken(context);  
    providers= await getProviders()
    return { props: { providers,csrfToken, loginError: error } };
  } catch (e) {
    return { props: { providers,csrfToken, loginError: error } };
  }
  
}