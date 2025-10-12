import {
  Box,
  Card,
  CardContent,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useState } from "react";
import { deleteUser, getAllUsers } from "../features/user/userSlice";
import { useDispatch } from "react-redux";

function Customers({ customers, totalPages, currentPage }) {
  const [visibleCustomers, setVisibleCustomers] = useState({});
  const dispatch = useDispatch();
  const toggleVisibility = (id) => {
    setVisibleCustomers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const maskData = (data, type = "text") => {
    if (!data) return "";
    if (type === "email") {
      // Ẩn một phần email
      const [name, domain] = data.split("@");
      return name.slice(0, 2) + "****@" + domain;
    }
    if (type === "phone") {
      // Ẩn số điện thoại, chỉ hiện 3 số đầu + 2 số cuối
      return data.slice(0, 3) + "*****" + data.slice(-2);
    }
    if (type === "money") {
      // Ẩn tiền: chỉ hiện vài số
      return data.toString().slice(0, 1) + "****đ";
    }
    return "****";
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Quản lý khách hàng
      </Typography>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell align="center">Tổng đơn hàng</TableCell>
                  <TableCell>Tổng chi tiêu</TableCell>
                  <TableCell>Xoá</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer, index) => {
                  const isVisible = visibleCustomers[customer._id] || false;
                  return (
                    <TableRow key={customer._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell align="center">{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell align="center">
                        {customer.totalOrders}
                      </TableCell>
                      <TableCell>
                        {Number(customer.totalSpent).toLocaleString()}đ
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => dispatch(deleteUser(customer._id))}
                          color="error"
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
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => {
                dispatch(getAllUsers({ page: value }));
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

export default Customers;
