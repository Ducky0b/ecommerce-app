import { useState } from "react";
import { FCheckbox, FormProvider, FTextField } from "../components/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import useAuth from "../hooks/useAuth";

import {
  Link,
  useLocation,
  useNavigate,
  Link as RouterLink,
} from "react-router-dom";
import {
  Alert,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import VisiblityIcon from "@mui/icons-material/Visibility";
import VisiblityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const defaultValues = {
  username: "",
  password: "",
  remember: true,
};

function LoginPage() {
  const auth = useAuth();
  const location = useLocation();
  const navigation = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const from = location.state?.from?.pathname || "/";
    let { username, password } = data;

    try {
      await auth.login({ username, password }, () => {
        navigation(from, { replace: true });
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
        md={7}
        component={Paper}
        elevation={6}
        square
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ maxWidth: 400, p: 4, width: "100%" }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
            Đăng nhập
          </Typography>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {!!errors.responseError && (
                <Alert severity="error">{errors.responseError.message}</Alert>
              )}
              <Alert severity="info">
                Bạn chưa có tài khoản?{" "}
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Đăng ký ngay
                </Link>
              </Alert>
              <FTextField name="username" label="Username" />
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
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ my: 2 }}
            >
              <FCheckbox name="remember" label="Remember me" />
              <Link component={RouterLink} variant="subtitle2">
                Forgot password?
              </Link>
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Login
            </LoadingButton>
          </FormProvider>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
