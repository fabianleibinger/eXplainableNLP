import React, {createContext, useState} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

import AppShell from "./components/navigation/AppShell";
import Welcome from "./components/welcome/welcome";
import Authentication from "./components/authentication/authenticate";
import Register from "./components/authentication/register";
import Dashboard from "./components/dashboard/dashboard";
import Dataset from "./components/datasets/dataset";
import Role from "./components/authentication/role";
import Expectations from "./components/authentication/expectations";
import Profile from "./components/navigation/profile";
import Statistics from "./components/statistics/Statistics";
import Explorations from "./components/explorations/explorations";

import './App.css';

export const API_URL = "http://localhost:8000";

export const LoginContext = createContext({
  logedIn: false,
  setLogin: () => {},
});

export const RoleContext = createContext({
  role: "explorer",
  setRole: () => {},
});

export const StaffContext = createContext({
  staff: false,
  setStaff: () => {},
});

function App() {
  const [logedIn, setLogin] = useState(
    sessionStorage.getItem("logedIn") ? true : false
  );
  const [role, setRole] = useState(
    sessionStorage.getItem("role") ?? "explorer"
  );
  const [staff, setStaff] = useState(
    sessionStorage.getItem("staff") === "true" ? true : false
  );

  const commonRoutes = [
    <Route path={"/"} element={<Dashboard />} />,
    role === "analyst" && <Route path={"/dataset"} element={<Dataset />} />,
    <Route path={"/role"} element={<Role />} />,
    <Route path={"/Expectations"} element={<Expectations />} />,
    <Route path={"/exploration"} element={<Explorations />} />,
    <Route path={"/profile"} element={<Profile />} />,
    <Route path={"/*"} element={<Navigate to={"/"} />} />,
  ];

  const staffRoutes = [
    ...commonRoutes,
    <Route path={"/statistics"} element={<Statistics />} />,
  ];

  const routesToRender = staff === true ? staffRoutes : commonRoutes;

  return (
    <LoginContext.Provider value={{ logedIn, setLogin }}>
      <RoleContext.Provider value={{ role, setRole }}>
        <StaffContext.Provider value={{ staff, setStaff }}>
          <div className="App">
            <BrowserRouter>
              {logedIn ? (
                <Routes>
                  <Route path={"/"} element={<AppShell />}>
                    <Route path={"/"} element={<Dashboard />} />
                    {routesToRender}
                  </Route>
                </Routes>
              ) : (
                <Routes>
                  <Route path={"/"} element={<Welcome />} />
                  <Route path={"/auth"} element={<Authentication />} />
                  <Route path={"/register"} element={<Register />} />
                  <Route path={"/*"} element={<Navigate to={"/"} />} />
                </Routes>
              )}
            </BrowserRouter>
          </div>
        </StaffContext.Provider>
      </RoleContext.Provider>
    </LoginContext.Provider>
  );
}

export default App;
