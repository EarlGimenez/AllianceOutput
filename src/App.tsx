// F4 BookIt
import Box from "@mui/material/Box";
import "./styles/tailwind.css";
import { AppRoutes } from "./routes";

const App = () => {
  return (
    <Box
      sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      }}
      >
      <AppRoutes />
    </Box>
  );
};

export default App;
