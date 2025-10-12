import { BrowserRouter } from "react-router-dom";
import Router from "./routes/index";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeProvider from "./theme/ThemeProvider";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
