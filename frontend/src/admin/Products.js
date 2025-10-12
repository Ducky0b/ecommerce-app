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
  TablePagination,
  TableRow,
  Typography,
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteProduct, getProducts } from "../features/product/productSlice";

function Products({
  products,
  totalPages,
  currentPage,
  handlePageChange,
  handleOpenDialog,
  getTotalStock,
}) {
  const dispatch = useDispatch();
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Quản lý sản phẩm</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("addProduct")}
        >
          Thêm sản phẩm
        </Button>
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
                  <TableCell>ID</TableCell>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Màu sắc & Size</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Tổng tồn kho</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Chỉnh sửa/ Xoá</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.slice(0, 10).map((product, index) => (
                  <TableRow key={product._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <img src={product.thumbnail} width="40" height="40" />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {product.variants.map((variant, vi) =>
                        variant.sizes.map((s, si) => (
                          <Box
                            key={`${vi}-${si}`}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 0.5,
                            }}
                          >
                            <span>
                              {variant.color} - {s.size} (Kho: {s.stock})
                            </span>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                handleOpenDialog("editVariant", {
                                  productId: product._id,
                                  variant,
                                })
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))
                      )}
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        {Number(product.price).toLocaleString()} đ
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            handleOpenDialog("editPrice", {
                              productId: product._id,
                              price: product.price,
                            })
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{product.categoryId?.name}</TableCell>
                    <TableCell>{getTotalStock(product)}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          getTotalStock(product) > 0 ? "Tồn kho" : "Hết hàng"
                        }
                        color={getTotalStock(product) > 0 ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenDialog("editProduct", product)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => dispatch(deleteProduct(product._id))}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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

export default Products;
