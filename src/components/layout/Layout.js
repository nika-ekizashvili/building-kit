import { useEffect } from "react";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import StatusDashboard from "../ui/StatusDasbhoard";

function Layout({ children }) {
  
  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh" }}>{children}</main>
      <StatusDashboard />
      <Footer />
    </>
  );
}

export default Layout;
