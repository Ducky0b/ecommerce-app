import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { FormProvider, FTextField } from "../components/form";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import VisiblityIcon from "@mui/icons-material/Visibility";
import VisiblityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string().required("Password is required"),
  passwordConfirmation: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Password must match"),
});

const defaultValues = {
  username: "",
  name: "",
  phone: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

function RegisterPage() {
  const auth = useAuth();
  const navigation = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    let { username, name, phone, email, password } = data;

    try {
      await auth.register({ username, name, phone, email, password }, () => {
        navigation("/", { replace: true });
      });
    } catch (error) {
      reset();
      setError("responseError", error);
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh", mb: 2 }}>
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: { xs: "none", md: "flex" },
          overflow: "hidden",
          minHeight: "100vh",
          mr: 10,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&h=800&fit=crop"
          alt="Login Banner"
          style={{
            width: 600,
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        component={Paper}
        elevation={6}
        square
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ maxWidth: 400, p: 4, width: "100%" }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
            Đăng ký
          </Typography>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {!!errors.responseError && (
                <Alert severity="error">{errors.responseError.message}</Alert>
              )}
              <Alert severity="info">
                Bạn có tài khoản?{" "}
                <Link
                  variant="subtitle2"
                  component={RouterLink}
                  to="/login"
                  color="error"
                >
                  Đăng nhập ngay
                </Link>
              </Alert>

              <FTextField name="username" label="User name" />
              <FTextField name="name" label="Full name" />
              <FTextField name="phone" label="Phone" />
              <FTextField name="email" label="Email address" />

              <FTextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisiblityIcon />
                        ) : (
                          <VisiblityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FTextField
                name="passwordConfirmation"
                label="Password Confirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPasswordConfirmation(!showPasswordConfirmation)
                        }
                        edge="end"
                      >
                        {showPasswordConfirmation ? (
                          <VisiblityIcon />
                        ) : (
                          <VisiblityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Register
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Box>
      </Grid>
    </Grid>
  );
}

export default RegisterPage;
