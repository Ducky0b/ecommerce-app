import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Alert,
} from "@mui/material";
import { ShoppingBag as ShopIcon } from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import { getCurrentUser } from "../features/user/userSlice";
import { getAllOrders } from "../features/order/orderSlice";
import { useNavigate } from "react-router-dom";
import CategorySection from "../features/category/CategorySection";
import { getCategories } from "../features/category/categorySlice";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { categories, isLoading, error } = useSelector(
    (state) => state.category
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getCurrentUser());
    }

    dispatch(getCategories({ page: 1, limit: 100 }));
    dispatch(getAllOrders());
  }, [dispatch, user]);

  if (isLoading || !categories?.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  const handleViewMore = (category) => {
    navigate(`/products/${category.toLowerCase()}`);
  };

  const parentCategories = categories.filter(
    (c) => !c.parentId && !c.isDeleted
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Có lỗi xảy ra khi tải danh mục: {error}
          </Alert>
        )}

        {!isLoading && (
          <>
            <Box
              sx={{
                m: { xs: 0 },
                textAlign: "center",
                p: { xs: 3, md: 4 },
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 3,
                color: "white",
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                🔥 Sản Phẩm Hot Nhất Tuần
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Cập nhật xu hướng thời trang mới nhất - Được yêu thích nhất bởi
                khách hàng
              </Typography>
            </Box>

            {parentCategories.map((parent) => {
              const childProducts = categories
                .filter(
                  (c) => c.parentId?._id?.toString() === parent._id.toString()
                )
                .flatMap((c) => c.products || []);
              return (
                <CategorySection
                  key={parent._id}
                  category={parent.name}
                  products={childProducts}
                  onViewMore={handleViewMore}
                />
              );
            })}

            {parentCategories.length === 0 && (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <ShopIcon
                  sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  🛍️ Chưa có sản phẩm nào
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sản phẩm đang được cập nhật. Vui lòng quay lại sau!
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default HomePage;
