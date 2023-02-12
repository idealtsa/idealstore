import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { Fragment } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard/dashboard-layout';


const Page = () => (
  <Fragment>
    <Head>
      <title>
        Dashboard | Ideal Store
      </title>
    </Head>
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


Page.getLayout = (page) => (
  <DashboardLayout>
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