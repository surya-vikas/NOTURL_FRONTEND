import { Route, Routes } from "react-router-dom";
import GlobalApiLoader from "./components/GlobalApiLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Terms from "./pages/Terms";
import UnifiedWorkspace from "./pages/UnifiedWorkspace";

function App() {
  return (
    <>
      <GlobalApiLoader />
      <Routes>
        <Route path="/" element={<UnifiedWorkspace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UnifiedWorkspace />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<UnifiedWorkspace />} />
      </Routes>
    </>
  );
}

export default App;
