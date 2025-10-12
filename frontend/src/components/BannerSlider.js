import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const bannerSlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop",
    title: "Bộ Sưu Tập Mùa Hè 2024",
    subtitle: "Khuyến mãi lên đến 50% - Free Ship toàn quốc",
    buttonText: "Mua Ngay",
    overlay: "linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&h=400&fit=crop",
    title: "Xu Hướng Thời Trang Mới",
    subtitle: "Phong cách trẻ trung, năng động cho Gen Z",
    buttonText: "Khám Phá",
    overlay:
      "linear-gradient(45deg, rgba(25,118,210,0.4), rgba(25,118,210,0.2))",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop",
    title: "Phụ Kiện Cao Cấp",
    subtitle: "Hoàn thiện phong cách - Chất lượng Châu Âu",
    buttonText: "Xem Thêm",
    overlay: "linear-gradient(45deg, rgba(76,175,80,0.4), rgba(76,175,80,0.2))",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop",
    title: "Black Friday Sale",
    subtitle: "Giảm giá sốc 70% - Chỉ còn 3 ngày!",
    buttonText: "Mua Ngay",
    overlay: "linear-gradient(45deg, rgba(244,67,54,0.5), rgba(244,67,54,0.2))",
  },
];

function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => setCurrentSlide(index);
  const goToPrev = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
  const goToNext = () =>
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);

  return (
    <Box sx={{ position: "relative", mx: 2, py: 8 }}>
      <Paper
        elevation={4}
        sx={{
          height: { xs: 250, sm: 350, md: 450 },
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {bannerSlides.map((slide, index) => (
          <Box
            key={slide.id}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              backgroundImage: `${slide.overlay}, url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  textAlign: "center",
                  color: "white",
                  px: { xs: 2, md: 4 },
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
                    fontWeight: "bold",
                    mb: 2,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.3rem", md: "1.5rem" },
                    mb: 4,
                    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {slide.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: { xs: 3, md: 5 },
                    py: { xs: 1.5, md: 2 },
                    fontSize: { xs: "0.9rem", md: "1.1rem" },
                    borderRadius: 50,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  {slide.buttonText}
                </Button>
              </Box>
            </Container>
          </Box>
        ))}

        {/* Navigation Arrows */}
        <IconButton
          onClick={goToPrev}
          sx={{
            position: "absolute",
            left: { xs: 8, md: 16 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.2)",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.3)",
            },
          }}
        >
          <ArrowBackIos />
        </IconButton>
        <IconButton
          onClick={goToNext}
          sx={{
            position: "absolute",
            right: { xs: 8, md: 16 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.2)",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.3)",
            },
          }}
        >
          <ArrowForwardIos />
        </IconButton>

        {/* Dots Indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
          }}
        >
          {bannerSlides.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: currentSlide === index ? 24 : 12,
                height: 12,
                borderRadius: 6,
                bgcolor:
                  currentSlide === index ? "white" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

export default BannerSlider;
