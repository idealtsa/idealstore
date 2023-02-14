import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';

const Page = () => {
  const { data: session } = useSession()
  // console.log("Session", JSON.stringify(session, null, 2))

  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, [session]);

  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return null;
  } else {
  if (session) {
    return (
      <Fragment>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
         
          {/* <Container maxWidth={false}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
                <Budget />
              </Grid>
              <Grid
                item
                xl={3}
                lg={3}
                sm={6}
                xs={12}
              >
                <TotalCustomers />
              </Grid>
              <Grid
                item
                xl={3}
                lg={3}
                sm={6}
                xs={12}
              >
                <TasksProgress />
              </Grid>
              <Grid
                item
                xl={3}
                lg={3}
                sm={6}
                xs={12}
              >
                <TotalProfit sx={{ height: '100%' }} />
              </Grid>
              <Grid
                item
                lg={8}
                md={12}
                xl={9}
                xs={12}
              >
                <Sales />
              </Grid>
              <Grid
                item
                lg={4}
                md={6}
                xl={3}
                xs={12}
              >
                <TrafficByDevice sx={{ height: '100%' }} />
              </Grid>
              <Grid
                item
                lg={4}
                md={6}
                xl={3}
                xs={12}
              >
                <LatestProducts sx={{ height: '100%' }} />
              </Grid>
              <Grid
                item
                lg={8}
                md={12}
                xl={9}
                xs={12}
              >
                <LatestOrders />
              </Grid>
            </Grid>
          </Container> */}
        </Box>
      </Fragment>
    )
  }
  return <p>Access Denied</p>}

}


Page.getLayout = (page) => (
  <DashboardLayout title="IDEAL STORE | Dashboard " description=" ">
    {page}
  </DashboardLayout>
);

Page.auth = 
{
  role: "admin",
  loading: <div>loading</div>,
  unauthorized: "/login-with-different-user", // redirect to this url
}

export default Page;


export async function getServerSideProps(context) {
  return {
    props: {
      session: await getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  }
}