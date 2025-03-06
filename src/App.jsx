import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { AppKitProvider } from "./config";
import { ConnectKitProvider } from "connectkit"; // Add this import
import NavigationBar from "./components/NavigationBar";
import LandingPage from "./components/LandingPage";
import CreateChama from "./pages/CreateChama";
import JoinChama from "./pages/JoinChama";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";

function App() {
  return (
    <AppKitProvider>
      <ConnectKitProvider> {/* Add ConnectKitProvider */}
        <Router>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              backgroundColor: '#f5f5f5' // Optional: Add background color
            }}
          >
            <NavigationBar />
            
            <Box sx={{ 
              flex: 1,
              py: 4, // Add vertical padding
              px: { xs: 2, sm: 4 } // Add responsive horizontal padding
            }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/create-chama" element={<CreateChama />} />
                <Route path="/join-chama" element={<JoinChama />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Box>

            <Footer />
          </Box>
        </Router>
      </ConnectKitProvider>
    </AppKitProvider>
  );
}

export default App;
