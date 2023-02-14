import { useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { useSession } from "next-auth/react";
import Head from "next/head";
const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 280,
  },
}));
export const DashboardLayout = (props) => {
  const { children, title, description } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      return null;
    },
  });
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar
        user={session?.user}
        isLogin={session && true}
        onSidebarOpen={() => setSidebarOpen(true)}
      />
      <DashboardSidebar
        user={session?.user}
        isLogin={session && true}
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </>
  );
};
