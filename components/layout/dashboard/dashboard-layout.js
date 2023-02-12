import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { useSession } from "next-auth/react";

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
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      setLogin(false);
    },
  });
  const [isLogin, setLogin] = useState(status === "authenticated");
  useEffect(() => {
    setLogin(status === "authenticated");
  }, [status]);

  return (
    <AuthGuard>
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
        isLogin={isLogin}
        onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar
        user={session?.user}
        isLogin={isLogin}
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </AuthGuard>
  );
};
