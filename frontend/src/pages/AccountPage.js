import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { getCurrentUser, updateUser } from "../features/user/userSlice";
import FUploadAvatar from "../components/form/FUploadAvatar";
import { fData } from "../utils/numberFormat";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, FTextField } from "../components/form";
import { useCallback, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const UserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

function ProfileUser() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const defaultValues = {
    name: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    avatarUrl: "",
  };
  
  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data) => {
    dispatch(updateUser({ id: currentUser._id, ...data }));
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          "avatarUrl",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        city: currentUser.city || "",
        district: currentUser.district || "",
        ward: currentUser.ward || "",
        address: currentUser.address || "",
        avatarUrl: currentUser.avatarUrl || "",
      });
    }
  }, [currentUser, reset]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: 1100 },
          mx: "auto",
          px: { xs: 2, md: 0 },
          py: 4,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              elevation={3}
              sx={{ p: 3, textAlign: "center", width: "100%" }}
            >
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                Ảnh đại diện
              </Typography>
              <FUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card
              elevation={3}
              sx={{
                width: "100%",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Thông tin cá nhân
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box
                  sx={{
                    display: "grid",
                    rowGap: 3,
                    columnGap: 2,
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                    },
                  }}
                >
                  <FTextField name="name" label="Họ tên" />
                  <FTextField name="email" label="Email" />
                  <FTextField name="phone" label="Số điện thoại" />
                  <FTextField name="city" label="Thành phố" />
                  <FTextField name="district" label="Quận/Huyện" />
                  <FTextField name="ward" label="Phường/Xã" />
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <FTextField
                      name="address"
                      label="Địa chỉ chi tiết"
                      multiline
                      rows={3}
                      fullWidth
                    />
                  </Box>
                </Box>

                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ minWidth: 220, py: 1.5, borderRadius: 2 }}
                  >
                    {isSubmitting ? "Đang lưu..." : "Lưu thông tin"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
}

export default ProfileUser;