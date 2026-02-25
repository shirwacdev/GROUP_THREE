import React, { useState } from "react";
import AdminDashboard from "./admin/page";
import Login from "./login/page";
import Register from "./register/page";

const App = () => {
  const [page, setPage] = useState("login");

  if (page === "register") {
    return <Register onBackToLogin={() => setPage("login")} />;
  }

  if (page === "admin") {
    return <AdminDashboard onBackToLogin={() => setPage("login")} />;
  }

  return (
    <Login
      onAdminDemo={() => setPage("admin")}
      onGoRegister={() => setPage("register")}
    />
  );
};

export default App;
