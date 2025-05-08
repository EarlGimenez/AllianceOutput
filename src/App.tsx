// F4 BookIt
import Box from "@mui/material/Box";
import "./styles/tailwind.css";
import { AppRoutes } from "./routes";

const App = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <AppRoutes />
    </Box>
  );
};

export default App;
