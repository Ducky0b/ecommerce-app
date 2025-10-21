import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/product/productSlice"; // action fetch products
import { slugify } from "../utils/slugtify";
import ProductList from "../features/product/ProductList";
import { Box, FormControl, MenuItem, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import FormProvider from "../components/form/FormProvider";
import FSelect from "../components/form/FSelect";
import CategorySection from "../features/category/CategorySection";

function ProductPage() {
  const [page, setPage] = useState(1);
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

  // const handlePageChange = (e, value) => {
  //   if (childSlug) {
  //     const child = categories.find(
  //       (c) => slugify(c.name) === childSlug && c.parentId
  //     );
  //     if (child) {
  //       dispatch(
  //         getProducts({ categoryId: child._id, page: value, limit: 12 })
  //       );
  //     }
  //   } else {
  //     const parent = categories.find(
  //       (c) => !c.parentId && slugify(c.name) === parentSlug
  //     );
  //     if (parent) {
  //       const children = categories.filter(
  //         (c) => c.parentId && String(c.parentId._id) === String(parent._id)
  //       );
  //       dispatch(
  //         getProducts({
  //           categoryIds: children.map((c) => c._id),
  //           page: value,
  //           limit: 12,
  //         })
  //       );
  //     }
  //   }
  // };
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
  return (
    <CategorySection
      products={sortedProducts}
      category={
        childSlug
          ? categories.find((c) => slugify(c.name) === childSlug)?.name
          : categories.find((c) => slugify(c.name) === parentSlug)?.name
      }
    />
  );
}

export default ProductPage;
