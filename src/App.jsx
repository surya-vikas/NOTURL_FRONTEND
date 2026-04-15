import { Route, Routes } from "react-router-dom";
import GlobalApiLoader from "./components/GlobalApiLoader";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import UnifiedWorkspace from "./pages/UnifiedWorkspace";

function App() {
  return (
    <>
      <GlobalApiLoader />
      <Routes>
        <Route path="/" element={<UnifiedWorkspace />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<UnifiedWorkspace />} />
      </Routes>
    </>
  );
}

export default App;
