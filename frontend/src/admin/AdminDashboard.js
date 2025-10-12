import { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  CssBaseline,
  MenuItem,
  IconButton,
  Menu,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as ProductIcon,
  ShoppingCart as OrderIcon,
  People as CustomersIcon,
  BarChart as AnalyticsIcon,
  Category as CategoryIcon,
  AccountCircle,
  ExitToApp,
} from "@mui/icons-material";
import Products from "./Products";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  createProduct,
  getProducts,
  updateProduct,
} from "../features/product/productSlice";
import Customers from "./Customers";
import Orders from "./Orders";
import { getAllOrders, updateStatusOrder } from "../features/order/orderSlice";
import Analytics from "./Analytics";
import Dashboard from "./Dashboard";
import Categories from "./Categories";
import { getAllUsers } from "../features/user/userSlice";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../features/category/categorySlice";
import ProductDialog from "../features/product/ProductDialog";
import CategoryDialog from "../features/category/CategoryDialog";
import OrderDialog from "../features/order/OrderDialog";
import useAuth from "../hooks/useAuth";

const drawerWidth = 185;

function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [page, setPage] = useState(1);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts({ page }));
    dispatch(getAllUsers({ page }));
    dispatch(getAllOrders());
    dispatch(getCategories({ page, limit: 20 }));
  }, [dispatch, page]);

  const { products, isLoading, totalPages, totalProducts } = useSelector(
    (state) => state.products
  );
  const { categories, totalPagesCategories } = useSelector(
    (state) => state.category
  );
  const { users, totalPagesUsers } = useSelector((state) => state.user);
  const { orders, totalPagesOrders } = useSelector((state) => state.order);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    thumbnail: "",
    color: "",
    imageUrl: "",
    size: "",
    stock: "",
    sku: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    parentId: "",
  });
  const [orderForm, setOrderForm] = useState({
    status: "pending",
  });

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, key: "dashboard" },
    { text: "Sản phẩm", icon: <ProductIcon />, key: "products" },
    { text: "Danh mục", icon: <CategoryIcon />, key: "categories" },
    { text: "Đơn hàng", icon: <OrderIcon />, key: "orders" },
    { text: "Khách hàng", icon: <CustomersIcon />, key: "customers" },
    { text: "Thống kê", icon: <AnalyticsIcon />, key: "analytics" },
  ];

  function getTotalStock(products) {
    if (!products || !Array.isArray(products.variants)) return 0;

    return products.variants.reduce((variantSum, variant) => {
      const sizeStock = (variant.sizes || []).reduce((sizeSum, size) => {
        return sizeSum + (size.stock || 0);
      }, 0);
      return variantSum + sizeStock;
    }, 0);
  }

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };
  const handlePageChange = (e, value) => {
    setPage(value);
  };
  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    if (item && type === "editProduct") {
      setProductForm({
        _id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.categoryId?._id,
        thumbnail: item.thumbnail,
        color: item.variants[0].color,
        imageUrl: item.variants[0].imageUrl,
        size: item.variants[0].sizes[0].size,
        stock: item.variants[0].sizes[0].stock,
        sku: item.variants[0].sizes[0].sku,
      });
    } else if (item && type === "editCategory") {
      const parentCatId = item.parentId?._id || "";

      setCategoryForm({
        _id: item._id,
        name: item.name,
        description: item.description,
        parentId: parentCatId,
      });
    } else if (type === "addCategory") {
      setCategoryForm({
        name: "",
        description: "",
        parentId: "",
      });
    } else if (type === "addProduct") {
      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "",
        thumbnail: "",
        color: "",
        imageUrl: "",
        size: "",
        stock: "",
        sku: "",
      });
    } else if (item && type === "editVariant") {
      setProductForm({
        _id: item.productId,
        color: item.variant?.color || "",
        size: item.variant?.sizes?.[0]?.size || "",
        stock: item.variant?.sizes?.[0]?.stock || "",
        sku: item.variant?.sizes?.[0]?.sku || "",
      });
    } else if (item && type === "editPrice") {
      setProductForm({
        _id: item.productId,
        price: item.price,
      });
    } else if (item && type === "editOrder") {
      setSelectedOrder(item);
      setOrderForm({ status: item.status });
    } else {
      console.log("Unknown type", type, item);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      thumbnail: "",
      color: "",
      imageUrl: "",
      size: "",
      stock: "",
      sku: "",
    });
    setCategoryForm({
      name: "",
      description: "",
    });
    setOrderForm({ status: "pending" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed" && "delivered":
        return "success";
      case "pending":
        return "warning";
      case "processing" && "shipping":
        return "info";
      case "cancelled":
        return "error";
      case "active":
        return "success";
      case "inactive":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipping":
        return "Đang vận chuyển";
      case "delivered":
        return "Đã vận chuyển";
      case "cancelled":
        return "Đã hủy";
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      default:
        return status;
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <Dashboard
            products={products}
            totalProducts={totalProducts}
            orders={orders}
            users={users}
            categories={categories}
            getStatusText={getStatusText}
            getStatusColor={getStatusColor}
            getTotalStock={getTotalStock}
          />
        );
      case "products":
        return (
          <Products
            products={products}
            totalPages={totalPages}
            currentPage={page}
            handlePageChange={handlePageChange}
            handleOpenDialog={handleOpenDialog}
            getTotalStock={getTotalStock}
          />
        );
      case "categories":
        return (
          <Categories
            categories={categories}
            totalPages={totalPagesCategories}
            currentPage={page}
            handlePageChange={handlePageChange}
            handleOpenDialog={handleOpenDialog}
          />
        );
      case "orders":
        return (
          <Orders
            orders={orders}
            totalPages={totalPagesOrders}
            currentPage={page}
            getStatusText={getStatusText}
            getStatusColor={getStatusColor}
            handleOpenDialog={handleOpenDialog}
          />
        );
      case "customers":
        return (
          <Customers
            customers={users}
            totalPages={totalPagesUsers}
            currentPage={page}
          />
        );
      case "analytics":
        return <Analytics orders={orders} />;
      default:
        return (
          <Dashboard
            products={products}
            orders={orders}
            users={users}
            getStatusText={getStatusText}
            getStatusColor={getStatusColor}
            getTotalStock={getTotalStock}
          />
        );
    }
  };

  const handleLogout = async () => {
    await logout(() => navigate("/"));
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              <ListItemText>Đăng xuất</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  selected={currentTab === item.key}
                  onClick={() => handleTabChange(item.key)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>

      <ProductDialog
        openDialog={openDialog}
        dialogType={dialogType}
        productForm={productForm}
        handleCloseDialog={handleCloseDialog}
        categories={categories}
      />
      <CategoryDialog
        openDialog={openDialog}
        dialogType={dialogType}
        categories={categories}
        categoryForm={categoryForm}
        handleCloseDialog={handleCloseDialog}
      />
      <OrderDialog
        openDialog={openDialog}
        dialogType={dialogType}
        orderForm={orderForm}
        selectedOrder={selectedOrder}
        handleCloseDialog={handleCloseDialog}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;
