import { alpha, Box, Paper, Typography } from "@mui/material";
import { fData } from "../utils/numberFormat";
function RejectionFiles({ fileRejections }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: "error.light",
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.88),
      }}
    >
      {fileRejections.map(({ file, erorrs }) => {
        const { path, size } = file;
        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {fData(size)}
            </Typography>

            {erorrs.map((error) => {
              <Typography key={error.code} variant="caption" component="p">
                - {erorrs.message}
              </Typography>;
            })}
          </Box>
        );
      })}
    </Paper>
  );
}

export default RejectionFiles;
