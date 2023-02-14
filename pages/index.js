import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { getServerSession } from "next-auth/next"
import { useSession } from 'next-auth/react';
import { DefaultLayout } from '@/components/layout/default-layout';
import { authOptions } from './api/auth/[...nextauth]';

const Page = () => {
  const { data: session } = useSession()
  console.log("Session", JSON.stringify(session, null, 2))
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return null;
  } else {
  if (session) {
    return (
      <Fragment>

      </Fragment>
    )
  }
  return <p>Access Denied</p>}

}


Page.getLayout = (page) => (
  <DefaultLayout title="IDEAL STORE | HOME" description=" ">
    {page}
  </DefaultLayout>
);

Page.auth =false

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