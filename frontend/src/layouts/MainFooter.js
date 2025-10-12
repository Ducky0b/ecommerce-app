import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";


function MainFooter() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" p={1}>
      {"Copyright by "}
      <Link color="inherit">VFashion</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default MainFooter;
