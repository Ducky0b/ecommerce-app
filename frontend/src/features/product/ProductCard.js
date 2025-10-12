import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ products }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/products/detail/${slug}-${products._id}`);
  };

  const slug = products.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <Card
      sx={{
        maxWidth: 300,
        cursor: "pointer",
        transition: "transform 0.3s, box-shadow 0.3s",
        ":hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        },
      }}
      onClick={handleClick}
    >
      <Box
        sx={{
          width: 180,
          height: 230,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        <img
          src={products.thumbnail}
          alt={products.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 0.4s",
          }}
        />
      </Box>
      <CardContent
        sx={{
          textAlign: "center",
        }}
      >
        <Typography
          gutterBottom
          variant="subtitle2"
          noWrap
          sx={{
            maxWidth: 150,
            transition: "color 0.3s",
            ":hover": {
              color: "secondary.main",
            },
          }}
        >
          {products.name}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          {Number(products.price).toLocaleString()} đ
        </Typography>
      </CardContent>
    </Card>
  );
}
