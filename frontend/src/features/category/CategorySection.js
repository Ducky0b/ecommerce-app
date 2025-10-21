import { useState } from "react";
import ProductCard from "../../features/product/ProductCard";
import {
  Box,
  Grid,
  Button,
  Typography,
  MenuItem,
  FormControl,
} from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import FormProvider from "../../components/form/FormProvider";
import FSelect from "../../components/form/FSelect";

function CategorySection({ products, category, onViewMore }) {
  const methods = useForm({
    defaultValues: {
      sortPrice: "",
    },
  });
  const { watch } = methods;
  const sortOption = watch("sortPrice");

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    if (sortOption === "lowToHigh") return priceA - priceB;
    if (sortOption === "highToLow") return priceB - priceA;
    return 0;
  });

  const displayProducts = sortedProducts.slice(0, 12);
  if (!products || products.length === 0) return null;
  return (
    <FormProvider methods={methods}>
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

          <FormControl sx={{ minWidth: 150 }}>
            <FSelect name="sortPrice" label="Lọc theo giá" size="small">
              <MenuItem value="lowToHigh">Giá thấp → cao</MenuItem>
              <MenuItem value="highToLow">Giá cao → thấp</MenuItem>
            </FSelect>
          </FormControl>
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

        {products?.length > 2 && onViewMore && (
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
    </FormProvider>
  );
}

export default CategorySection;
