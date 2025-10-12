import {
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableBody,
  Chip,
} from "@mui/material";
import {
  Inventory as ProductIcon,
  ShoppingCart as OrderIcon,
  People as CustomersIcon,
  Category as CategoryIcon,
  AttachMoney,
} from "@mui/icons-material";
function Dashboard({
  products,
  totalProducts,
  orders,
  users,
  categories,
  getStatusText,
  getStatusColor,
  getTotalStock,
}) {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );
  const StatCard = ({ title, value, icon, color = "primary" }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </Box>
          <Box color={`${color}.main`}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
  const childCategories = categories.filter((c) => c.parentId);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng sản phẩm"
            value={totalProducts}
            icon={<ProductIcon fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng danh mục"
            value={childCategories.length}
            icon={<CategoryIcon fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Đơn hàng"
            value={orders.length}
            icon={<OrderIcon fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Khách hàng"
            value={users.length}
            icon={<CustomersIcon fontSize="large" />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Doanh thu"
            value={totalRevenue}
            icon={<AttachMoney fontSize="large" />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Đơn hàng gần đây
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Khách hàng</TableCell>
                      <TableCell>Tổng tiền</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Ngày</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.slice(0, 5).map((order, index) => (
                      <TableRow key={order._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{order.userId?.name}</TableCell>
                        <TableCell>
                          {Number(order.totalAmount).toLocaleString()}đ
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(order.status)}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sản phẩm bán chạy
              </Typography>
              <List>
                {products.slice(0, 5).map((product) => (
                  <ListItem key={product._id} divider>
                    <ListItemText
                      primary={product.name}
                      secondary={`${Number(
                        product.price
                      ).toLocaleString()} đ - Stock: ${getTotalStock(product)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
