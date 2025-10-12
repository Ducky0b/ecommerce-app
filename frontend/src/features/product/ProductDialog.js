import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct } from "../product/productSlice";
import { FormProvider, FTextField } from "../../components/form";
function ProductDialog({
  openDialog,
  dialogType,
  productForm,
  handleCloseDialog,
  categories,
}) {
  const [parentCategory, setParentCategory] = useState("");
  const dispatch = useDispatch();
  const parentCategories = categories.filter((c) => !c.parentId);

  const childCategories = useMemo(() => {
    if (!parentCategory) return [];
    return categories.filter(
      (child) =>
        child.parentId && String(child.parentId._id) === String(parentCategory)
    );
  }, [categories, parentCategory]);

  const defaultValues = {
    name: "",
    description: "",
    price: "",
    category: "",
    thumbnail: "",
    color: "",
    imageUrl: "",
    size: "",
    stock: "",
    sku: "",
  };

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    if (openDialog && productForm) {
      const childCat = categories.find((c) => c._id === productForm.category);
      const parentCat = childCat?.parentId?._id || "";
      setParentCategory(parentCat);
      reset(productForm);
    }
  }, [openDialog, productForm, categories, reset]);

  const onSubmit = (data) => {
    if (dialogType === "addProduct") {
      dispatch(createProduct({ ...data, categoryId: data.category }));
    } else if (dialogType === "editPrice") {
      dispatch(updateProduct({ id: data._id, price: data.price }));
    } else if (dialogType === "editVariant") {
      dispatch(
        updateProduct({
          id: data._id,
          color: data.color,
          size: data.size,
          stock: data.stock,
          sku: data.sku,
        })
      );
    } else if (dialogType === "editProduct") {
      dispatch(
        updateProduct({
          id: data._id,
          name: data.name,
          description: data.description,
          price: data.price,
          categoryId: data.category,
          thumbnail: data.thumbnail,
          color: data.color,
          imageUrl: data.imageUrl,
          size: data.size,
          stock: data.stock,
          sku: data.sku,
        })
      );
    }
    handleCloseDialog();
  };
  const getTitle = () => {
    switch (dialogType) {
      case "addProduct":
        return "Thêm sản phẩm mới";
      case "editProduct":
        return "Chỉnh sửa sản phẩm";
      case "editPrice":
        return "Chỉnh sửa giá";
      case "editVariant":
        return "Chỉnh sửa màu sắc & size";
      default:
        return "Sản phẩm";
    }
  };

  return (
    <Dialog
      open={
        openDialog &&
        ["addProduct", "editProduct", "editPrice", "editVariant"].includes(
          dialogType
        )
      }
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{getTitle()}</DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {(dialogType === "addProduct" || dialogType === "editProduct") && (
            <>
              <FTextField name="name" label="Tên sản phẩm" margin="dense" />
              <FTextField name="description" label="Mô tả" margin="dense" />

              <FTextField
                name="parentCategory"
                label="Nhóm danh mục"
                margin="dense"
                select
                value={parentCategory}
                onChange={(e) => {
                  setParentCategory(e.target.value);
                  reset({ ...watch(), category: "" });
                }}
              >
                {parentCategories.map((parent) => (
                  <MenuItem key={parent._id} value={parent._id}>
                    {parent.name}
                  </MenuItem>
                ))}
              </FTextField>

              {parentCategory && childCategories.length > 0 && (
                <FTextField
                  name="category"
                  label="Danh mục"
                  margin="dense"
                  select
                >
                  {childCategories.map((child) => (
                    <MenuItem key={child._id} value={child._id}>
                      {child.name}
                    </MenuItem>
                  ))}
                </FTextField>
              )}

              <FTextField
                name="thumbnail"
                label="Hình ảnh sản phẩm (thumbnail)"
                margin="dense"
              />
            </>
          )}

          {(dialogType === "editPrice" ||
            dialogType === "addProduct" ||
            dialogType === "editProduct") && (
            <FTextField name="price" label="Giá" type="number" margin="dense" />
          )}

          {(dialogType === "editVariant" ||
            dialogType === "addProduct" ||
            dialogType === "editProduct") && (
            <>
              <FTextField name="color" label="Màu sắc" margin="dense" />
              {(dialogType === "addProduct" ||
                dialogType === "editProduct") && (
                <FTextField
                  name="imageUrl"
                  label="Hình ảnh theo màu"
                  margin="dense"
                />
              )}
              <FTextField name="size" label="Size" margin="dense" />
              <FTextField
                name="stock"
                label="Số lượng"
                type="number"
                margin="dense"
              />
              <FTextField name="sku" label="Mã SKU" margin="dense" />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" type="submit">
            {dialogType === "addProduct" ? "Thêm" : "Cập nhật"}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

export default ProductDialog;
