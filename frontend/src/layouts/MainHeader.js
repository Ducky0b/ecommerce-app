import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import useAuth from "../hooks/useAuth";
import { Fragment, useEffect, useRef, useState } from "react";
import { Button, Collapse, CssBaseline, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import MiniCart from "../features/cart/MiniCart";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart } from "../features/cart/cartSlice";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { getCategories } from "../features/category/categorySlice";
import { slugify } from "../utils/slugtify";
import AccountMenu from "../features/user/AccountMenu";
import { getCurrentUser } from "../features/user/userSlice";

import SearchInput from "../components/SearchInput";

function MainHeader() {
  const [navItems, setNavItems] = useState([]);
  const [page, setPage] = useState(1);
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [elevate, setElevate] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const [openMainIndex, setOpenMainIndex] = useState(null); // index của menu cấp 1 đang mở
  const [openSubIndex, setOpenSubIndex] = useState(null); // index của submenu cấp 2 đang hover
  const desktopMenuRef = useRef(null);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleCategories = (categories) => {
    const order = ["TOPS", "BOTTOM", "OUTERWEAR", "ACCESSORIES"];
    const parents = categories.filter((c) => !c.parentId);

    const sortedParents = [...parents].sort((a, b) => {
      const indexA = order.indexOf(a.name.toUpperCase());
      const indexB = order.indexOf(b.name.toUpperCase());

      return (
        (indexA === -1 ? Infinity : indexA) -
        (indexB === -1 ? Infinity : indexB)
      );
    });

    const items = sortedParents.map((parent) => ({
      label: `${parent.name}+`,
      path: `/products/${slugify(parent.name)}`,
      categoryId: parent._id,
      subItems: categories
        .filter(
          (child) =>
            child.parentId && String(child.parentId._id) === String(parent._id)
        )
        .map((c) => ({
          label: c.name,
          path: `/products/${slugify(parent.name)}/${slugify(c.name)}`,
          categoryId: c._id,
        })),
    }));
    items.push({
      label: "ALL+",
      path: "/products/all",
    });
    setNavItems([
      { label: "Trang chủ", path: "/" },
      { label: "Sản phẩm", path: "/products", subItems: items },
      { label: "Giới thiệu", path: "/about" },
      { label: "Liên hệ", path: "/contact" },
    ]);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setElevate(true);
      } else {
        setElevate(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(getCart(user.data?._id || user._id));
      dispatch(getCurrentUser());
    } else {
      dispatch(clearCart());
    }
    dispatch(getCategories({ page, limit: 20 }));
  }, [user, dispatch]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      handleCategories(categories);
    }
  }, [categories]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(e.target)
      ) {
        setOpenMainIndex(null);
        setOpenSubIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderMenuNavItems = (items, parentKey = "") => {
    return items.map((item, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;
      const hasSub = !!item.subItems;
      const level = key.split("-").length;

      return (
        <Fragment key={key}>
          <ListItem disablePadding>
            <ListItemButton
              {...(!hasSub
                ? { component: RouterLink, to: item.path ?? "#" }
                : {})}
              onClick={
                hasSub
                  ? () =>
                      setOpenMenus((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                  : () => setMobileOpen(false)
              }
              sx={{ pl: 1 + level * 3 }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  color: "black",
                  fontSize: "1rem",
                  fontWeight: parentKey ? 400 : 500,
                }}
              />
              {hasSub && (openMenus[key] ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>

          {hasSub && (
            <Collapse in={!!openMenus[key]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuNavItems(item.subItems, key)}
              </List>
            </Collapse>
          )}
        </Fragment>
      );
    });
  };

  const DesktopMenu = ({ items }) => {
    return (
      <Box
        ref={desktopMenuRef}
        sx={{
          display: { xs: "none", sm: "flex" },
          gap: 1,
          alignItems: "center",
        }}
      >
        {items.map((item, index) => {
          const hasSub = !!item.subItems;
          const isOpen = openMainIndex === index;

          const handleMainClick = (e) => {
            if (hasSub) {
              e.preventDefault();
              setOpenMainIndex(isOpen ? null : index);
              setOpenSubIndex(null);
            }
          };

          return (
            <Box key={index} sx={{ position: "relative" }}>
              <Button
                {...(!hasSub
                  ? { component: RouterLink, to: item.path ?? "#" }
                  : {})}
                onClick={handleMainClick}
                aria-haspopup={hasSub ? "true" : undefined}
                aria-expanded={isOpen ? "true" : undefined}
                sx={{ color: "#000" }}
              >
                {item.label}
              </Button>

              {hasSub && isOpen && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    bgcolor: "white",
                    boxShadow: 3,
                    borderRadius: 1,
                    minWidth: 240,
                    p: 1,
                    zIndex: 20,
                  }}
                >
                  {item.subItems.map((sub, subIndex) => {
                    const hasSub2 = !!sub.subItems;
                    const isSubOpen = openSubIndex === subIndex;

                    return (
                      <Box
                        key={subIndex}
                        sx={{ position: "relative" }}
                        onMouseEnter={() =>
                          hasSub2 && setOpenSubIndex(subIndex)
                        }
                        onMouseLeave={() => hasSub2 && setOpenSubIndex(null)}
                      >
                        <Button
                          {...(!hasSub2
                            ? { component: RouterLink, to: sub.path ?? "#" }
                            : {})}
                          onClick={(e) => {
                            if (hasSub2) {
                              e.preventDefault();
                              setOpenSubIndex(isSubOpen ? null : subIndex);
                            } else {
                              setOpenMainIndex(null);
                            }
                          }}
                          sx={{
                            color: "#000",
                            justifyContent: "flex-start",
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          {sub.label}
                        </Button>

                        {hasSub2 && isSubOpen && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: "100%",
                              bgcolor: "white",
                              boxShadow: 3,
                              borderRadius: 1,
                              minWidth: 220,
                              p: 1,
                              zIndex: 30,
                            }}
                          >
                            {sub.subItems.map((sub3, sub3Index) => (
                              <Button
                                key={sub3Index}
                                component={RouterLink}
                                to={sub3.path ?? "#"}
                                onClick={() => {
                                  setOpenSubIndex(null);
                                  setOpenMainIndex(null);
                                }}
                                sx={{
                                  color: "#000",
                                  justifyContent: "flex-start",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                {sub3.label}
                              </Button>
                            ))}
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  const drawer = (
    <Box sx={{ width: 260 }} role="presentation">
      <List>{renderMenuNavItems(navItems)}</List>
    </Box>
  );

  return (
    <Box sx={{ mb: 5 }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: elevate ? "#f8f8f8" : "transparent",
          color: "black",
          boxShadow: elevate ? "0 2px 10px rgba(0,0,0,0.2)" : "none",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <DesktopMenu items={navItems} />

          <Box sx={{ flexGrow: 1 }} />

          <SearchInput />

          {isAuthenticated && user ? (
            <AccountMenu />
          ) : (
            <Button component={RouterLink} to="/login" sx={{ color: "#000" }}>
              <Typography variant="subtitle3">Login</Typography>
            </Button>
          )}

          <Box sx={{ ml: 1 }}>
            <MiniCart />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        transitionDuration={300}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default MainHeader;
