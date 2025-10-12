import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
      >
        Về Chúng Tôi
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        textAlign="center"
        mb={5}
      >
        Khám phá hành trình và sứ mệnh của chúng tôi trong ngành thời trang.
      </Typography>

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent
              sx={{
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 3, md: 4 },
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Chào mừng bạn đến với VFashion
              </Typography>
              <Typography>
                Nơi mang đến những sản phẩm thời trang chất lượng, hợp xu hướng
                và giá cả phải chăng.
              </Typography>
              <Typography>
                Với sứ mệnh <b>“Mặc đẹp – Sống chất – Thể hiện cá tính”</b>,
                chúng tôi không chỉ bán quần áo mà còn truyền tải phong cách
                sống hiện đại, trẻ trung và năng động đến từng khách hàng.
              </Typography>
              <Typography>
                Tại <b>VFashion</b>, bạn sẽ tìm thấy:
              </Typography>
              <ul style={{ paddingLeft: "20px", marginTop: 0 }}>
                <li>
                  Bộ sưu tập đa dạng từ áo, quần, váy đến phụ kiện thời trang.
                </li>
                <li>Nhiều mẫu mã, màu sắc, size phù hợp cho mọi vóc dáng.</li>
                <li> Sản phẩm được tuyển chọn kỹ càng, chất liệu bền đẹp.</li>
                <li> Giao hàng nhanh chóng, đổi trả dễ dàng.</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
