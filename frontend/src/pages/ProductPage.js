import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/product/productSlice"; // action fetch products
import { slugify } from "../utils/slugtify";
import ProductList from "../features/product/ProductList";
import BannerSlider from "../components/BannerSlider";
import { Box, Typography } from "@mui/material";

function ProductPage() {
  const { parentSlug, childSlug } = useParams();
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);
  const { products, currentPage, totalPage } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const parent = categories.find(
      (c) => !c.parentId && slugify(c.name) === parentSlug
    );
    if (!parent) return;

    if (childSlug) {
      const child = categories.find(
        (c) =>
          c.parentId &&
          String(c.parentId._id) === String(parent._id) &&
          slugify(c.name) === childSlug
      );
      if (child) {
        dispatch(getProducts({ categoryId: child._id, page: 1, limit: 12 }));
      }
    } else {
      const children = categories.filter(
        (c) => c.parentId && String(c.parentId._id) === String(parent._id)
      );
      if (children.length > 0) {
        dispatch(
          getProducts({
            categoryIds: children.map((c) => c._id),
            page: 1,
            limit: 12,
          })
        );
      }
    }
  }, [parentSlug, childSlug, categories, dispatch]);

  const handlePageChange = (e, value) => {
    if (childSlug) {
      const child = categories.find(
        (c) => slugify(c.name) === childSlug && c.parentId
      );
      if (child) {
        dispatch(
          getProducts({ categoryId: child._id, page: value, limit: 12 })
        );
      }
    } else {
      const parent = categories.find(
        (c) => !c.parentId && slugify(c.name) === parentSlug
      );
      if (parent) {
        const children = categories.filter(
          (c) => c.parentId && String(c.parentId._id) === String(parent._id)
        );
        dispatch(
          getProducts({
            categoryIds: children.map((c) => c._id),
            page: value,
            limit: 12,
          })
        );
      }
    }
  };

  return (
    <>
      <BannerSlider />
      <Box
        sx={{
          textAlign: "center",
          py: 2,
          mb: 4,
          borderBottom: "2px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textTransform: "uppercase" }}
        >
          {childSlug
            ? categories.find((c) => slugify(c.name) === childSlug)?.name
            : categories.find((c) => slugify(c.name) === parentSlug)?.name}
        </Typography>
      </Box>

      <ProductList
        products={products}
        currentPage={currentPage}
        totalPages={totalPage}
        handlePageChange={handlePageChange}
      />
    </>
  );
}

export default ProductPage;
