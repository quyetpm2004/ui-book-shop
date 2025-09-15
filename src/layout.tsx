import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";

function Layout() {
  return (
    <div style={{ background: "oklch(0.95 0 0 / 1)" }}>
      <AppHeader />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
