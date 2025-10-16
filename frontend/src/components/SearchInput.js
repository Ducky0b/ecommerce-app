import { useState } from "react";
import { alpha, styled } from "@mui/material/styles";
import { InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { getProducts } from "../features/product/productSlice";
import { useNavigate } from "react-router-dom";

const SearchContainer = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 5,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginLeft: theme.spacing(2),
  width: "100%",
  maxWidth: 320,
  marginRight: 20,
  display: "flex",
  alignItems: "center",
  boxShadow: "inset 0 0 2px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  flex: 1,
  padding: theme.spacing(0.8, 1.5),
  fontSize: "0.95rem",
  "& .MuiInputBase-input::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 0.8,
  },
}));

function SearchInput() {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?name=${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <SearchContainer onSubmit={onSubmit}>
      <StyledInput
        placeholder="Tìm kiếm sản phẩm..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <IconButton type="submit" size="small" sx={{ p: "6px" }}>
        <SearchIcon sx={{ color: "black" }} />
      </IconButton>
    </SearchContainer>
  );
}

export default SearchInput;
