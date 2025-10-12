import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ProductCard from "./ProductCard";
import Pagination from "@mui/material/Pagination";
import { Typography } from "@mui/material";

function ProductList({ products, currentPage, totalPages, handlePageChange }) {
  return (
    <div>
      {products && products.length > 0 ? (
        <>
          <Grid container spacing={1}>
            {products.map((product) => (
              <Grid key={product._id} size={{ xs: 6, md: 2 }}>
                <ProductCard products={product} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
            />
          </Box>
        </>
      ) : (
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 3, fontStyle: "italic", color: "text.secondary" }}
        >
          Không có sản phẩm nào
        </Typography>
      )}
    </div>
  );
}

export default ProductList;
