import { Alert, Box, Card, CardContent, Grid, Typography } from "@mui/material";

function Analytics({ orders }) {
  // Tổng doanh thu
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  // Tổng sản phẩm bán được
  const totalProductsSold = orders.reduce((sum, order) => {
    if (!order.items) return sum;
    return sum + order.items.reduce((subSum, item) => subSum + (item.quantity || 0), 0);
  }, 0);

  // Số đơn hoàn thành
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  // Tỷ lệ hoàn thành
  const completionRate =
    orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Thống kê & Báo cáo
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Tính năng thống kê chi tiết đang được phát triển. Hiện tại hiển thị
        thông tin cơ bản.
      </Alert>

      <Grid container spacing={3}>
        {/* Tổng doanh thu */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tổng doanh thu
              </Typography>
              <Typography variant="h3" color="primary">
                {totalRevenue.toLocaleString()} đ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Đơn hàng hoàn thành */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Đơn hàng hoàn thành
              </Typography>
              <Typography variant="h5" color="success.main">
                {completedOrders}
              </Typography>
              <Typography color="textSecondary">
                Tỷ lệ hoàn thành: {completionRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tổng sản phẩm đã bán */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tổng sản phẩm đã bán
              </Typography>
              <Typography variant="h3" color="warning.main">
                {totalProductsSold}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Analytics;
