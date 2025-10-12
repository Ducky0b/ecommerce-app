import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import { fNumber } from "../../utils/numberFormat";
import { fDateTime } from "../../utils/formatTime";
function OrderDialogDetail({ open, onClose, order }) {
  if (!order) return null;

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết đơn hàng</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Mã đơn hàng:</strong> {order._id}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Ngày đặt:</strong> {fDateTime(order.createdAt)}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Trạng thái:</strong>{" "}
          <Chip
            label={getStatusText(order.status)}
            color={getStatusColor(order.status)}
            size="small"
          />
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Sản phẩm
        </Typography>
        {order.items.map((item) => (
          <Box
            key={item._id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              p: 1,
              bgcolor: "grey.50",
              borderRadius: 1,
            }}
          >
            <Box
              component="img"
              src={item.productId?.thumbnail}
              alt={item.productId?.name}
              sx={{
                width: 64,
                height: 64,
                objectFit: "cover",
                borderRadius: 1,
                mr: 2,
              }}
            />

            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography variant="body2" fontWeight="medium" noWrap>
                {item.productId?.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Size: {item.size || "—"} | Màu: {item.color || "—"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                SL: {item.quantity}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              fontWeight="medium"
              color="primary"
              sx={{ ml: 2 }}
            >
              {fNumber(item.productId?.price * item.quantity)} đ
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Tổng cộng:</Typography>
          <Typography variant="h6" color="error.main">
            {fNumber(order.totalAmount)} đ
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderDialogDetail;
