import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import {
  LocalShipping as ShippingIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { fNumber } from "../../utils/numberFormat";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FTextField } from "../../components/form";

function ShippingStep({ cartItems, finalTotal, setActiveStep }) {
  const { currentUser } = useSelector((state) => state.user);
  const { reset, watch } = useFormContext();

  useEffect(() => {
    if (currentUser) {
      reset({
        fullName: currentUser.name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        city: currentUser.city || "",
        district: currentUser.district || "",
        ward: currentUser.ward || "",
        address: currentUser.address || "",
        paymentMethod: "cod",
      });
    }
  }, [currentUser, reset]);

  const values = watch();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card elevation={2}>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <ShippingIcon color="primary" />
              Thông tin giao hàng
            </Typography>

            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={6}>
                <FTextField name="fullName" label="Họ và tên" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FTextField name="phone" label="Số điện thoại" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FTextField name="email" label="Email" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FTextField name="city" label="Tỉnh/Thành Phố" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FTextField name="district" label="Quận/Huyện" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FTextField name="ward" label="Phường/Xã" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FTextField name="address" label="Số nhà" fullWidth multiline />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ width: { xs: "100%", md: "90vw" }, margin: "0 auto" }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ textAlign: "center" }} gutterBottom>
                Xác nhận đơn hàng
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CartIcon color="primary" />
                  Tổng sản phẩm ({cartItems.length} sản phẩm)
                </Typography>

                {cartItems.slice(0, 2).map((item) => (
                  <Box key={item._id} sx={{ display: "flex", mb: 1 }}>
                    <Box sx={{ width: 80, height: 80, mr: 2 }}>
                      <img
                        src={item.productId?.thumbnail}
                        alt={item.productId?.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={600}>
                        {item.productId?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        SL: {item.quantity} × {fNumber(item.productId.price)} đ
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {cartItems.length > 2 && (
                  <Typography variant="body2" color="text.secondary">
                    ...và {cartItems.length - 2} sản phẩm khác
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Tổng cộng:</Typography>
                <Typography variant="h6" color="error.main">
                  {fNumber(finalTotal)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(0)}
                  sx={{ flex: 1 }}
                >
                  Quay lại
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(2)}
                  sx={{ flex: 1 }}
                  disabled={
                    !values.fullName ||
                    !values.phone ||
                    !values.address ||
                    !values.email ||
                    !values.city ||
                    !values.district ||
                    !values.ward
                  }
                >
                  Tiếp tục
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}

export default ShippingStep;
