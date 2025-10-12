import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Typography,
  Pagination,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { deleteCategory } from "../features/category/categorySlice";

function Categories({
  categories,
  totalPages,
  currentPage,
  handleOpenDialog,
  handlePageChange,
}) {
  const dispatch = useDispatch();

  const { parentCategories, childCategoriesMap } = useMemo(() => {
    const parents = categories.filter((c) => !c.parentId);
    const childMap = {};

    parents.forEach((parent) => {
      childMap[parent._id] = categories.filter(
        (child) =>
          child.parentId &&
          String(child.parentId._id || child.parentId) === String(parent._id)
      );
    });

    return {
      parentCategories: parents,
      childCategoriesMap: childMap,
    };
  }, [categories]);

  const handleDeleteCategory = (categoryId, isParent = false) => {
    if (isParent) {
      const childCount = childCategoriesMap[categoryId]?.length || 0;
      if (childCount > 0) {
        if (
          window.confirm(
            `Danh mục này có ${childCount} danh mục con. Bạn có chắc muốn xóa tất cả?`
          )
        ) {
          dispatch(deleteCategory(categoryId));
        }
      } else {
        dispatch(deleteCategory(categoryId));
      }
    } else {
      dispatch(deleteCategory(categoryId));
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Quản lý danh mục</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog("addCategory", { parentId: "" })}
          >
            Thêm danh mục con
          </Button>
        </Stack>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    "& .MuiTableCell-root": {
                      fontWeight: "bold",
                      fontSize: "1rem",
                    },
                  }}
                >
                  <TableCell width="50">STT</TableCell>
                  <TableCell width="200">Nhóm danh mục cha</TableCell>
                  <TableCell>Danh mục con</TableCell>
                  <TableCell width="150">Mô tả</TableCell>
                  <TableCell width="100" align="center">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parentCategories.slice(0, 10).map((parentCategory, index) => {
                  const childCategories =
                    childCategoriesMap[parentCategory._id] || [];

                  return (
                    <TableRow key={parentCategory._id}>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1" fontWeight="bold">
                            {parentCategory.name}
                          </Typography>
                          <Chip
                            label={childCategories.length}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>

                      <TableCell>
                        {childCategories.length === 0 ? (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            fontStyle="italic"
                          >
                            Chưa có danh mục con
                          </Typography>
                        ) : (
                          <Box>
                            {childCategories.map((child, childIndex) => (
                              <Box
                                key={child._id}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mb:
                                    childIndex < childCategories.length - 1
                                      ? 1
                                      : 0,
                                  p: 1,
                                  backgroundColor: "#f9f9f9",
                                  borderRadius: 1,
                                  border: "1px solid #e0e0e0",
                                }}
                              >
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                  • {child.name}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleOpenDialog("editCategory", child)
                                  }
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleDeleteCategory(child._id)
                                  }
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {parentCategory.description || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          onClick={() =>
                            handleOpenDialog("editCategory", parentCategory)
                          }
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDeleteCategory(parentCategory._id, true)
                          }
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Categories;
