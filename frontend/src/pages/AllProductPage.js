import ProductCard from "../features/product/ProductCard";
import { Box, Grid, Typography, Pagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts } from "../features/product/productSlice";
import BannerSlider from "../components/BannerSlider";

function AllProductPage() {
  const [page, setPage] = useState(1);
  const { products, totalPages } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const handlePageChange = (e, value) => {
    setPage(value);
  };
  useEffect(() => {
    dispatch(getProducts({ page, limit: 12 }));
  }, [page, dispatch]);
  return (
    <Box>
      <BannerSlider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: { xs: 2, md: 3 },
          pb: 2,
          borderBottom: "2px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: "1.5rem", md: "2rem" },
                fontWeight: "bold",
                color: "black",
              }}
            >
              Tất cả sản phẩm
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={1} sx={{ px: { xs: 1, md: 6 } }}>
        {products.map((product) => (
          <Grid item xs={6} md={2} key={product._id}>
            <ProductCard products={product} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          shape="rounded"
        />
      </Box>
    </Box>
  );
}

export default AllProductPage;
