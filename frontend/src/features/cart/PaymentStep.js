import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Paper,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  AccountBalance as BankIcon,
  LocalShipping as CodIcon,
} from "@mui/icons-material";
import { fNumber } from "../../utils/numberFormat";
import { createOrder } from "../order/orderSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "./cartSlice";
import { generateBankQR } from "../../app/bankQRService";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

function PaymentStep({ finalTotal, setActiveStep }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qrUrl, setQrUrl] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [errorQR, setErrorQR] = useState(null);

  const { handleSubmit, watch, getValues, control } = useFormContext();
  const values = getValues();
  const selectedPayment = watch("paymentMethod");

  const handlePaymentChange = async (value) => {
    if (value === "bank") {
      setLoadingQR(true);
      setErrorQR(null);
      setQrUrl(null);
      try {
        const qrDataUrl = await generateBankQR({
          accountNo: "6001205307464",
          accountName: "VO VAN VIET",
          acqId: 970405,
          addInfo: `Thanh toan don hang`,
          amount: finalTotal,
        });
        setQrUrl(qrDataUrl);
      } catch (err) {
        setErrorQR("Không thể tạo mã QR, vui lòng thử lại!");
      } finally {
        setLoadingQR(false);
      }
    } else {
      setQrUrl(null);
    }
  };

  const onSubmit = (data) => {
    dispatch(createOrder(data));
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <Card elevation={2} sx={{ maxWidth: 600, mx: "auto" }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <PaymentIcon color="primary" />
            Xác nhận đặt hàng
          </Typography>

          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Phương thức thanh toán
              </Typography>

              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" sx={{ width: "100%" }}>
                    <RadioGroup
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handlePaymentChange(e.target.value);
                      }}
                      sx={{ gap: 2 }}
                    >
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          cursor: "pointer",
                          border:
                            selectedPayment === "cod"
                              ? "2px solid"
                              : "1px solid",
                          borderColor:
                            selectedPayment === "cod"
                              ? "primary.main"
                              : "divider",
                          bgcolor:
                            selectedPayment === "cod"
                              ? "primary.50"
                              : "transparent",
                        }}
                      >
                        <FormControlLabel
                          value="cod"
                          control={<Radio />}
                          sx={{ margin: 0, width: "100%" }}
                          label={
                            <Box sx={{ ml: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <CodIcon
                                  color={
                                    selectedPayment === "cod"
                                      ? "primary"
                                      : "action"
                                  }
                                />
                                <Typography variant="h6" fontSize="1rem">
                                  Thanh toán khi nhận hàng (COD)
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Thanh toán bằng tiền mặt khi nhận hàng
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          cursor: "pointer",
                          border:
                            selectedPayment === "bank"
                              ? "2px solid"
                              : "1px solid",
                          borderColor:
                            selectedPayment === "bank"
                              ? "primary.main"
                              : "divider",
                          bgcolor:
                            selectedPayment === "bank"
                              ? "primary.50"
                              : "transparent",
                        }}
                      >
                        <FormControlLabel
                          value="bank"
                          control={<Radio />}
                          sx={{ margin: 0, width: "100%" }}
                          label={
                            <Box sx={{ ml: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <BankIcon
                                  color={
                                    selectedPayment === "bank"
                                      ? "primary"
                                      : "action"
                                  }
                                />
                                <Typography variant="h6" fontSize="1rem">
                                  Chuyển khoản ngân hàng
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Quét mã QR hoặc chuyển khoản qua ngân hàng
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </RadioGroup>
                  </FormControl>
                )}
              />

              {selectedPayment === "bank" && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  {loadingQR && <Typography>Đang tạo mã QR...</Typography>}
                  {errorQR && (
                    <Typography color="error.main">{errorQR}</Typography>
                  )}
                  {qrUrl && !loadingQR && (
                    <>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Quét mã QR để thanh toán:
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <img
                          src={qrUrl}
                          alt="QR VietQR"
                          style={{ width: 500, maxWidth: "100%" }}
                        />
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Thông tin đơn hàng
              </Typography>
              <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="body2" mb={1}>
                  <strong>Người nhận:</strong> {values.fullName}
                </Typography>
                <Typography variant="body2" mb={1}>
                  <strong>SĐT:</strong> {values.phone}
                </Typography>
                <Typography variant="body2" mb={1}>
                  <strong>Email:</strong> {values.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Địa chỉ:</strong> {values.address}, {values.ward},{" "}
                  {values.district}, {values.city}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 2,
                  bgcolor: "error.50",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6">Tổng thanh toán:</Typography>
                <Typography variant="h6" color="error.main" fontWeight="bold">
                  {fNumber(finalTotal)} đ
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setActiveStep(1)}
              sx={{ flex: 1 }}
            >
              Quay lại
            </Button>
            <Button
              type="button"
              variant="contained"
              color="success"
              sx={{ flex: 1 }}
              startIcon={<CheckIcon />}
              onClick={handleSubmit(onSubmit)}
            >
              Đặt hàng ngay
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default PaymentStep;