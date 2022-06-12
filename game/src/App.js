import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axios";

const App = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token") ? true : false;

  const logout = () => {
    axiosInstance.post("logout/", {}).then((res) => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      axiosInstance.defaults.headers["Authorization"] = null;
      navigate("/login");
    });
  };
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Kółko i krzyżyk</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              {isAuthenticated ? (
                <NavDropdown
                  menuVariant="dark"
                  title={localStorage.getItem("username")}
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item eventKey="logout" onClick={logout}>
                    Wyloguj się
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="login">
                    <Nav.Link>Zaloguj się</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="register">
                    <Nav.Link>Zarejestruj się</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default App;
