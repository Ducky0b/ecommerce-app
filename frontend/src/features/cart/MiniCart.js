import {
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  Menu,
  Badge,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MiniCart() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const {
    cartItems = [],
    totalQuantity = 0,
    isLoading,
  } = useSelector((state) => state.cart || {});

  const handleCartClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const isEmpty = !cartItems || cartItems.length === 0;

  const totalAmount =
    cartItems?.reduce((sum, item) => {
      const product = item?.productId; // Đã là object từ populate
      const price = product?.price || 0;
      const quantity = item?.quantity || 0;

      return sum + price * quantity;
    }, 0) || 0;

  return (
    <>
      <IconButton onClick={handleCartClick}>
        <Badge
          badgeContent={totalQuantity || cartItems?.length || 0}
          color="success"
        >
          <ShoppingCartOutlinedIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography variant="subtitle1" align="center" gutterBottom>
          Cart {isLoading && "(Loading...)"}
        </Typography>
        <Divider />

        {isEmpty ? (
          <Box textAlign="center" py={3}>
            <ShoppingCartOutlinedIcon
              sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
            />
            <Typography variant="body2">
              There are currently no products
            </Typography>
          </Box>
        ) : (
          <Box maxHeight={250} overflow="auto" m={2} width={300}>
            {cartItems.map((item, index) => {
              const product = item?.productId;

              return (
                <Box
                  key={item._id || index}
                  display="flex"
                  alignItems="center"
                  mb={1}
                >
                  <img
                    src={product?.thumbnail || "/placeholder.png"}
                    alt={product?.name || "Product"}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      marginRight: 8,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="bold" noWrap>
                      {product?.name || "Unknown Product"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {item.color ? `Color: ${item.color}` : ""}{" "}
                      {item.size ? `| Size: ${item.size}` : ""}
                    </Typography>

                    <Typography variant="caption" display="block">
                      {item?.quantity || 0} x{" "}
                      {(Number(product?.price) || 0).toLocaleString()}₫
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" m={2}>
          <Typography fontWeight="bold">TOTAL:</Typography>
          <Typography fontWeight="bold">
            {(Number(totalAmount) || 0).toLocaleString()}₫
          </Typography>
        </Box>

        <Box display="flex" gap={1} m={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              handleClose();
              navigate("/cart");
            }}
            sx={{ backgroundColor: "#000", color: "#fff" }}
          >
            VIEW CART
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              handleClose();
              navigate("/checkout");
            }}
            sx={{ backgroundColor: "#000", color: "#fff" }}
          >
            CHECK OUT
          </Button>
        </Box>
      </Menu>
    </>
  );
}
