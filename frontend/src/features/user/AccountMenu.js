import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Avatar, Divider, Menu, MenuItem } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

function AccountMenu() {
  const avatarRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const { user, logout, isAuthenticated } = useAuth();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleProfileMenuOpen = () => setAnchorEl(avatarRef.current);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = async () => {
    handleMenuClose();
    await logout(() => navigate("/"));
  };

  if (!isAuthenticated || !currentUser) return null;
  return (
    <>
      <Avatar
        ref={avatarRef}
        src={currentUser.avatarUrl ?? ""}
        alt={currentUser.name ?? ""}
        onClick={handleProfileMenuOpen}
        sx={{ cursor: "pointer" }}
      >
        {user.data?.name?.[0] || user.name?.[0] || "V"}
      </Avatar>
      <Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          disablePortal
        >
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              {currentUser.name || user.name || "Guest"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
              {currentUser.username || user.username || ""}
            </Typography>
          </Box>
          <Divider sx={{ borderStyle: "dashed" }} />
          <MenuItem
            onClick={handleMenuClose}
            to={`/cart`}
            component={RouterLink}
            sx={{ mx: 1 }}
          >
            Giỏ hàng
          </MenuItem>

          <MenuItem
            onClick={handleMenuClose}
            to="/order"
            component={RouterLink}
            sx={{ mx: 1 }}
          >
            Đơn hàng
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            to="/account"
            component={RouterLink}
            sx={{ mx: 1 }}
          >
            Tài khoản của tôi
          </MenuItem>
          <Divider sx={{ borderStyle: "dashed" }} />
          <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}

export default AccountMenu;
