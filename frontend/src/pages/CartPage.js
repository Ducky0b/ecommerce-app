import { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { ShoppingCart as CartIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";

import ShippingStep from "../features/cart/ShippingStep";
import PaymentStep from "../features/cart/PaymentStep";
import CartStep from "../features/cart/CartStep";

import { useForm } from "react-hook-form";
import { FormProvider } from "../components/form";

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const [activeStep, setActiveStep] = useState(0);
  const [discount, setDiscount] = useState(0);

  const steps = ["Giỏ hàng", "Thông tin giao hàng", "Thanh toán"];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productId?.price * item.quantity,
    0
  );
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const finalTotal = subtotal - discount + shippingFee;

  const methods = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      district: "",
      ward: "",
      paymentMethod: "cod",
    },
  });

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <CartStep cartItems={cartItems} setActiveStep={setActiveStep} />;
      case 1:
        return (
          <ShippingStep
            cartItems={cartItems}
            finalTotal={finalTotal}
            setActiveStep={setActiveStep}
          />
        );
      case 2:
        return (
          <PaymentStep finalTotal={finalTotal} setActiveStep={setActiveStep} />
        );
      default:
        return null;
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <CartIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Giỏ hàng của bạn đang trống
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
          </Typography>
          <Button variant="contained" size="large" sx={{ mt: 2 }}>
            Tiếp tục mua sắm
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <FormProvider methods={methods}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card elevation={1} sx={{ mb: 4 }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {renderStepContent(activeStep)}
      </Container>
    </FormProvider>
  );
};

export default CartPage;
