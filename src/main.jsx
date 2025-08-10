import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "sonner";
import "./index.css";
import './styles/fonts.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode> ← Remove esta linha
  <>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
    {/* </React.StrictMode> ← E esta */}
    <Toaster richColors />
  </>
);