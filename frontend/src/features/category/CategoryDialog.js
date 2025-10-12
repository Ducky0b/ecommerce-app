import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { FormProvider, FTextField } from "../../components/form";
import { createCategory, updateCategory } from "./categorySlice";

function CategoryDialog({
  openDialog,
  dialogType,
  categoryForm,
  categories,
  handleCloseDialog,
}) {
  const dispatch = useDispatch();
  const [parentCategory, setParentCategory] = useState("");
  const parentCategories = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );

  const childCategories = useMemo(() => {
    if (!parentCategory) return [];
    return categories.filter(
      (c) => c.parentId && String(c.parentId._id) === String(parentCategory)
    );
  }, [categories, parentCategory]);

  const defaultValues = {
    name: "",
    description: "",
    parentId: "",
  };

  const methods = useForm({
    defaultValues,
  });
  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    if (openDialog && categoryForm) {
      const currentCat = categories.find((c) => c._id === categoryForm._id);

      const parentCatId = currentCat?.parentId?._id || "";

      setParentCategory(parentCatId);

      reset({
        name: currentCat?.name || "",
        description: currentCat?.description || "",
        parentId: parentCatId,
      });
    }
  }, [openDialog, categoryForm, categories, reset]);

  const onSubmit = (data) => {
    if (dialogType === "addCategory") {
      dispatch(createCategory(data));
    } else if (dialogType === "editCategory") {
      dispatch(
        updateCategory({
          id: categoryForm._id,
          name: data.name,
          description: data.description,
          parentId: data.parentId || null,
        })
      );
    }
    handleCloseDialog();
  };
  const getTitle = () =>
    dialogType === "addCategory" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục";
  return (
    <Dialog
      open={openDialog && ["addCategory", "editCategory"].includes(dialogType)}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{getTitle()}</DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <FTextField
            name="parentId"
            label="Nhóm danh mục"
            select
            margin="dense"
            value={parentCategory}
            disabled={!parentCategory}
            onChange={(e) => {
              const newParent = e.target.value;
              setParentCategory(newParent);
              reset({ ...watch(), parentId: newParent });
            }}
          >
            {parentCategories.map((parent) => (
              <MenuItem key={parent._id} value={parent._id}>
                {parent.name}
              </MenuItem>
            ))}
          </FTextField>

          <FTextField
            name="name"
            label="Tên danh mục"
            margin="dense"
            fullWidth
          />

          <FTextField
            name="description"
            label="Mô tả"
            margin="dense"
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button type="submit" variant="contained">
            {dialogType === "addCategory" ? "Thêm" : "Cập nhật"}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

export default CategoryDialog;
