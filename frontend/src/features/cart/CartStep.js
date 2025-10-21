import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Container,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { fNumber } from "../../utils/numberFormat";
import { removeCartItem, updateCartItemQuantity } from "./cartSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

function CartStep({ cartItems, setActiveStep, setFinalTotal }) {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [discount, setDiscount] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const discountList = {
    SAVE10: 0.1, // 10% tổng đơn
    FREESHIP: 30000, // giảm 30k phí ship
    VOUCHER50: 50000, // giảm cố định 50k
  };
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productId?.price * item.quantity,
    0
  );

  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const discountAmount = discount < 1 ? subtotal * discount : discount;
  const finalTotal = subtotal - discountAmount + shippingFee;
  useEffect(() => {
    setFinalTotal(finalTotal);
  }, [setFinalTotal, finalTotal]);

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();

    if (!code) {
      setDiscountError("Vui lòng nhập mã giảm giá");
      setSuccessMessage("");
      return;
    }

    if (discountList[code]) {
      setDiscountError("");
      setSuccessMessage(`Áp dụng mã ${code} thành công!`);

      const value = discountList[code];
      setDiscount(value);
    } else {
      setDiscount(0);
      setSuccessMessage("");
      setDiscountError("Mã giảm giá không hợp lệ hoặc đã hết hạn");
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{
          maxWidth: "100%",
          margin: 0,
          width: "100%",
        }}
      >
        <Grid item xs={12} lg={6}>
          <Card elevation={2} sx={{ height: "fit-content", width: "100%" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                }}
              >
                <CartIcon color="primary" />
                Giỏ hàng của bạn ({cartItems.length} sản phẩm)
              </Typography>

              {cartItems.map((item) => (
                <Box key={item._id} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} sm={2} md={3} lg={2}>
                      <Box
                        sx={{
                          width: { xs: 60, sm: 80, md: 100 },
                          height: { xs: 60, sm: 80, md: 100 },
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                          src={item.productId.thumbnail}
                          alt={item.name}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={9} sm={6} md={5} lg={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          fontWeight: 600,
                          lineHeight: 1.3,
                          mb: 0.5,
                        }}
                      >
                        {item.productId.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        Size: {item.size} | Màu: {item.color}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "error.main",
                          fontSize: { xs: "0.85rem", sm: "0.875rem" },
                          mt: 1,
                        }}
                      >
                        {fNumber(item.productId.price)} đ
                      </Typography>
                    </Grid>

                    <Grid item xs={7} sm={3} md={2} lg={2}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          width: "fit-content",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            dispatch(
                              updateCartItemQuantity({
                                userId: user.data._id,
                                itemId: item._id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            dispatch(
                              updateCartItemQuantity({
                                userId: user.data._id,
                                itemId: item._id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>

                    <Grid item xs={5} sm={1} md={2} lg={2}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          dispatch(
                            removeCartItem({
                              userId: user.data._id,
                              itemId: item._id,
                            })
                          )
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>

                  {cartItems.indexOf(item) < cartItems.length - 1 && (
                    <Divider sx={{ mt: 2 }} />
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card
            elevation={2}
            sx={{
              height: "fit-content",
              position: { lg: "sticky" },
              top: { lg: 20 },
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Thanh toán đơn hàng
              </Typography>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập mã giảm giá"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  error={!!discountError}
                  helperText={discountError}
                  InputProps={{
                    endAdornment: (
                      <Button
                        size="small"
                        // onClick={handleApplyDiscount}
                      >
                        Áp dụng
                      </Button>
                    ),
                  }}
                />
                {successMessage && (
                  <Alert
                    severity="success"
                    sx={{ mt: 1, fontSize: "0.875rem" }}
                  >
                    {successMessage}
                  </Alert>
                )}
              </Box>

              <List dense>
                <ListItem sx={{ px: 0, justifyContent: "space-between" }}>
                  <ListItemText primary="Tạm tính" />
                  <Typography>{fNumber(subtotal)}</Typography>
                </ListItem>

                {discount > 0 && (
                  <ListItem sx={{ px: 0, justifyContent: "space-between" }}>
                    <ListItemText primary="Giảm giá" />
                    <Typography color="success.main">
                      -{fNumber(discountAmount)}
                    </Typography>
                  </ListItem>
                )}

                <ListItem sx={{ px: 0, justifyContent: "space-between" }}>
                  <ListItemText primary="Phí vận chuyển" />
                  <Typography
                    color={shippingFee === 0 ? "success.main" : "inherit"}
                  >
                    {shippingFee === 0 ? "Miễn phí" : fNumber(shippingFee)}
                  </Typography>
                </ListItem>
              </List>

              {shippingFee > 0 && subtotal < 500000 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Mua thêm {fNumber(500000 - subtotal)} đ để được miễn phí vận
                  chuyển!
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Tổng cộng:</Typography>
                <Typography variant="h6" color="error.main">
                  {fNumber(finalTotal)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => setActiveStep(1)}
              >
                Tiến hành thanh toán
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CartStep;
