import ProductCard from "../../features/product/ProductCard";
import { Box, Grid, Button, Typography } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";

function CategorySection({ products, category, onViewMore }) {
  if (!products || products.length === 0) return null;

  const displayProducts = products.slice(0, 12);

  return (
    <Box sx={{ mb: { xs: 4, md: 6 }, mt: { xs: 4, md: 6 } }}>
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
              {category}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ ml: { xs: 1 } }}>
        <Grid container spacing={1}>
          {displayProducts.map((product) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={product._id}>
              <ProductCard products={product} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {products.length > 2 && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIos />}
            onClick={() => onViewMore(category)}
          >
            Xem Thêm sản phẩm
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CategorySection;
