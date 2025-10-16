import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { getProducts } from "../features/product/productSlice";
import ProductList from "../features/product/ProductList";

function SearchProduct() {
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const { products, isLoading, error, totalPages, totalProducts } = useSelector(
    (state) => state.products
  );
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("name");

  const handlePageChange = (e, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (keyword) {
      dispatch(getProducts({ page, name: keyword }));
    }
  }, [dispatch, keyword]);

  return (
    <Container sx={{ mt: 5, mb: 8 }}>
      <Typography variant="h7" fontWeight={600} gutterBottom>
        Kết quả tìm kiếm cho:{" "}
        <Typography component="span" color="primary">
          "{keyword}"
        </Typography>
      </Typography>

      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" textAlign="center" sx={{ mt: 4 }}>
          {error.message || "Có lỗi xảy ra khi tìm kiếm sản phẩm."}
        </Typography>
      )}

      {!isLoading && !error && products.length === 0 && (
        <Typography textAlign="center" sx={{ mt: 4 }}>
          Không tìm thấy sản phẩm nào phù hợp.
        </Typography>
      )}

      <ProductList
        products={products}
        totalPages={totalPages}
        currentPage={page}
        handlePageChange={handlePageChange}
      />
    </Container>
  );
}

export default SearchProduct;
