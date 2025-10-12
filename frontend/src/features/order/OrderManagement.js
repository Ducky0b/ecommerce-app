import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { getCurrentOrders } from "./orderSlice";
import { fDateTime } from "../../utils/formatTime";
import { fNumber } from "../../utils/numberFormat";
import OrderDialogDetail from "./OrderDialogDetail";

function OrderManagement() {
  const { user } = useAuth();
  const [orderTab, setOrderTab] = useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(getCurrentOrders());
    }
  }, [user, dispatch]);

  const { currentOrder } = useSelector((state) => state.order);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedOrder(null);
  };

  const statusList = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xử lý" },
    { key: "processing", label: "Đang xử lý" },
    { key: "shipping", label: "Vận chuyển" },
    { key: "delivered", label: "Đã vận chuyển" },
    { key: "completed", label: "Hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  const getFilteredOrders = () => {
    const statusFilter = statusList[orderTab].key;
    if (statusFilter === "all") return currentOrder;
    return currentOrder.filter((order) => order.status === statusFilter);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "completed" && "delivered":
        return "success";
      case "pending":
        return "warning";
      case "processing" && "shipping":
        return "info";
      case "cancelled":
        return "error";
      case "active":
        return "success";
      case "inactive":
        return "default";
      default:
        return "default";
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipping":
        return "Đang vận chuyển";
      case "delivered":
        return "Đã vận chuyển";
      case "cancelled":
        return "Đã hủy";
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      default:
        return status;
    }
  };
  return (
    <Box mt={5}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý đơn hàng
      </Typography>

      <Tabs
        value={orderTab}
        onChange={(e, newValue) => setOrderTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        textColor="inherit"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        {statusList.map((status) => (
          <Tab
            key={status.key}
            label={status.label}
            sx={{ textTransform: "none" }}
          />
        ))}
      </Tabs>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 1 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <strong>#</strong>
              </TableCell>
              <TableCell>
                <strong>Ngày đặt</strong>
              </TableCell>
              <TableCell>
                <strong>Sản phẩm</strong>
              </TableCell>
              <TableCell>
                <strong>Trạng thái</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Tổng tiền</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Thao tác</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredOrders().length > 0 ? (
              getFilteredOrders().map((order, index) => (
                <TableRow key={order._id} hover>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{fDateTime(order.createdAt)}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {order.items.map((item) => item.productId?.name).join(", ")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="medium">
                      {fNumber(order.totalAmount)} đ
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenDetail(order)}
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Không có đơn hàng nào
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <OrderDialogDetail
        open={openDetail}
        onClose={handleCloseDetail}
        order={selectedOrder}
      />
    </Box>
  );
}

export default OrderManagement;
