import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";
import MusicNoteIcon from "@mui/icons-material/MusicNote"; // Tạm dùng TikTok icon


export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>

      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
      >
        Liên Hệ
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        textAlign="center"
        mb={5}
      >
        Chúng tôi rất vui được lắng nghe ý kiến, phản hồi và hỗ trợ bạn trong
        quá trình mua sắm.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOnIcon color="primary" sx={{ mr: 2 }} />
                <Typography>
                  <b>Địa chỉ:</b> Ấp Hải Vân , Xã Long Hải , TP.HCM
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <Typography>
                  <b>Hotline/Zalo:</b> 0772560639
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Typography>
                  <b>Email:</b> vanviet28052002@gmail.com
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <AccessTimeIcon color="primary" sx={{ mr: 2 }} />
                <Typography>
                  <b>Thời gian hỗ trợ:</b> 8h30 – 21h00 (Tất cả các ngày trong
                  tuần)
                </Typography>
              </Box>

              <Box mt={3}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Kết nối với chúng tôi
                </Typography>
                <Box display="flex" gap={3} flexWrap="wrap">
                  <Box display="flex" alignItems="center">
                    <FacebookIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>Facebook</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <MusicNoteIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography>TikTok</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Gửi tin nhắn cho chúng tôi
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: 500,
                }}
              >
                <TextField
                  label="Họ và tên"
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label="Nội dung"
                  variant="outlined"
                  required
                  multiline
                  rows={4}
                  fullWidth
                />
                <Button type="submit" variant="contained" size="large">
                  Gửi liên hệ
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
