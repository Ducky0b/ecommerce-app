import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  VisibilityOff as ViewOffIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteOrder, getAllOrders } from "../features/order/orderSlice";

function Orders({
  orders,
  totalPages,
  currentPage,
  getStatusText,
  getStatusColor,
  handleOpenDialog,
}) {
  const dispatch = useDispatch();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Quản lý đơn hàng
      </Typography>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Chỉnh sửa/ Xoá</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={order._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.userId?.name}</TableCell>
                    <TableCell>{order.userId?.email}</TableCell>
                    <TableCell>
                      {Number(order.totalAmount).toLocaleString()}đ
                    </TableCell>
                    <TableCell align="center">
                      {Number(order.totalProduct).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenDialog("editOrder", order)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => dispatch(deleteOrder(order._id))}
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
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => {
                dispatch(getAllOrders({ page: value }));
              }}
              color="primary"
              shape="rounded"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Orders;
