import MainHeader from "./MainHeader";
import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import MainFooter from "./MainFooter";
import AlertMsg from "../components/AlertMsg";
import BannerSlider from "../components/BannerSlider";

function MainLayout() {
  return (
    <Stack sx={{ minHeight: "100vh" }}>
      <MainHeader />
      <AlertMsg />
      <BannerSlider />
      <Outlet />
      <Box sx={{ flexGrow: 1 }} />
      <MainFooter />
    </Stack>
  );
}

export default MainLayout;
