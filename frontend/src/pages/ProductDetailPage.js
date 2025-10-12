import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Divider,
} from "@mui/material";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { addToCart } from "../features/cart/cartSlice";
import useAuth from "../hooks/useAuth";
import { getProductsById } from "../features/product/productSlice";

function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  const { user } = useAuth();
  const { currentProduct, isLoading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.category);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { slugAndId } = useParams();
  const id = slugAndId.split("-").pop();

  useEffect(() => {
    dispatch(getProductsById(id));
  }, [id, dispatch]);

  if (isLoading || !currentProduct || !currentProduct.variants) {
    return <div>Loading...</div>;
  }

  const selectedVariant = currentProduct?.variants?.[selectedColorIndex];
  const selectedSize = selectedVariant?.sizes?.[selectedSizeIndex];

  const relatedProducts =
    categories
      .find(
        (c) =>
          c._id === currentProduct.categoryId ||
          c._id === currentProduct.categoryId?._id
      )
      ?.products.filter((p) => p._id !== currentProduct._id) || [];

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", { state: { from: `/products/detail/${slugAndId}` } });
      return;
    }

    dispatch(
      addToCart({
        userId: user.data?._id,
        productId: currentProduct._id,
        color: selectedVariant.color,
        size: selectedSize.size,
        quantity,
      })
    );
    setQuantity(1);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
          sx={{
            "&:hover": {
              textDecoration: "underline",
              color: "text.secondary",
            },
          }}
        >
          Trang chủ
        </Link>

        <Link
          component={RouterLink}
          to="/products/all"
          underline="hover"
          color="inherit"
          sx={{
            "&:hover": {
              textDecoration: "underline",
              color: "text.secondary",
            },
          }}
        >
          All products
        </Link>
        <Typography color="text.primary">{currentProduct.name}</Typography>
      </Breadcrumbs>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6} sx={{ ml: { md: 10 } }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              component="img"
              src={selectedVariant.imageUrl || currentProduct.thumbnail}
              alt={currentProduct.name}
              sx={{
                width: "100%",
                borderRadius: 2,
                objectFit: "contain",
                maxHeight: 500,
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ ml: { md: 10 } }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {currentProduct.name} - {selectedVariant.color}
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            SKU: {selectedSize?.sku}{" "}
            <span style={{ color: "red" }}>
              {selectedSize?.stock === 0 ? "Sold out" : ""}
            </span>
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Màu sắc:</Typography>
            {currentProduct.variants.map((variant, index) => (
              <Button
                key={variant.color}
                variant={
                  index === selectedColorIndex ? "contained" : "outlined"
                }
                onClick={() => {
                  setSelectedColorIndex(index);
                  setSelectedSizeIndex(0); // reset size khi đổi màu
                }}
              >
                {variant.color}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <Typography variant="body2">Size:</Typography>
            {selectedVariant?.sizes.map((sizeObj, index) => (
              <Button
                key={sizeObj.size}
                variant={index === selectedSizeIndex ? "contained" : "outlined"}
                disabled={sizeObj.stock === 0}
                onClick={() => setSelectedSizeIndex(index)}
                sx={{
                  ...(sizeObj.stock === 0 && {
                    textDecoration: "line-through",
                    color: "text.disabled",
                  }),
                }}
              >
                {sizeObj.size}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
            <IconButton onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ mx: 2 }}>{quantity}</Typography>
            <IconButton onClick={() => setQuantity((q) => q + 1)}>
              <AddIcon />
            </IconButton>
          </Box>

          <Button
            variant="outlined"
            color="primary"
            sx={{ width: 200, mb: 3 }}
            disabled={selectedVariant.sizes.every((s) => s.stock === 0)}
            onClick={handleAddToCart}
          >
            {selectedVariant.sizes.every((s) => s.stock === 0)
              ? "SOLD OUT"
              : "ADD TO CART"}
          </Button>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Mô tả
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {currentProduct.description}
          </Typography>
        </Grid>
      </Grid>

      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Sản phẩm tương tự
          </Typography>
          <Divider sx={{ mb: 1, borderColor: "black" }} />
          <Grid container spacing={2}>
            {relatedProducts.slice(0, 5).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    cursor: "pointer",
                    "&:hover": { boxShadow: 3 },
                  }}
                  onClick={() =>
                    navigate(
                      `/products/detail/${product.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}-${product._id}`
                    )
                  }
                >
                  <Box
                    component="img"
                    src={product.thumbnail}
                    alt={product.name}
                    sx={{
                      width: 180,
                      height: 200,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      bgcolor: "#fff",
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    noWrap
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "180px",
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    {product.price.toLocaleString()} đ
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default ProductDetailPage;
