import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-layout-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
