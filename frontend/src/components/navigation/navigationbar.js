import { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ThemeProvider } from "styled-components";
import theme from "../../styles";

import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { API_URL, LoginContext, RoleContext, StaffContext } from "../../App";
import LogoImage from "./logo.png";

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { logedIn, setLogin } = useContext(LoginContext);
  const { staff, setStaff } = useContext(StaffContext);
  const { role, setRole } = useContext(RoleContext);
  const storedFirstname =
    sessionStorage.getItem("firstname") === null ||
    sessionStorage.getItem("firstname") === ""
      ? staff === true
        ? "Admin"
        : "Anonym"
      : sessionStorage.getItem("firstname");
  const navigate = useNavigate();

  const [pages, setPages] = useState(
    role === "analyst"
      ? staff === true
        ? ["Dashboard", "Explorations", "Statistics"]
        : ["Dashboard", "Explorations"]
      : staff === true
      ? ["Dashboard", "Statistics"]
      : ["Dashboard"]
  );

  useEffect(() => {
    if (staff) {
      if (role === "explorer") {
        setPages(["Dashboard", "Statistics"]);
      } else {
        setPages(["Dashboard", "Explorations", "Statistics"]);
      }
    } else {
      if (role === "explorer") {
        setPages(["Dashboard"]);
      } else {
        setPages(["Dashboard", "Explorations"]);
      }
    }
  }, [role, staff]);

  const settings = ["Profile", "Logout"];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const navPage = (page) => {
    console.log(page);
    if (page === "Dashboard") {
      navigate("/");
    } else if (page === "Datasets") {
      navigate("/dataset");
    } else if (page === "Statistics") {
      navigate("/statistics");
    } else if (page === "Explorations") {
      navigate("/exploration");
    }
  };

  const handleUserLogout = async (e, setting) => {
    e.preventDefault();
    if (setting === "Logout") {
      try {
        await Axios.post(API_URL + "/logout/", null, {
          withCredentials: true,
        }).then(async (response) => {
          if (response.status === 200) {
            document.cookie =
              "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setLogin(false);
            sessionStorage.clear();
          }
        });
        navigate("/");
      } catch (error) {
        if (error.response) {
          // Error-response from the Server
          if (error.response.data.error) {
            alert(error.response.data.error);
          }
        } else if (error.request) {
          alert("No Response from Server");
        } else {
          alert("Error:" + error.message);
        }
      }
    } else if (setting === "Profile") {
      navigate("/profile");
    } else {
      alert("Error: Option not available");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar>
            <img
              alt="Image Alt"
              src={LogoImage}
              style={{ width: "150px", height: "70px", borderRadius: "10px" }}
            />
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu();
                    navPage(page);
                  }}
                  sx={{
                    m: 2,
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Settings" arrow>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                  <AccountCircleIcon
                    sx={{ fontSize: "2rem", color: "white" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 1,
                      color: "white",
                      fontSize: "1.5rem",
                      marginRight: "50px",
                    }}
                  >
                    Hi, {storedFirstname}!
                  </Typography>
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                slotProps={{
                  paper: { style: { minWidth: "150px" } },
                }}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={(e) => {
                      handleCloseNavMenu();
                      handleUserLogout(e, setting);
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
export default ResponsiveAppBar;
