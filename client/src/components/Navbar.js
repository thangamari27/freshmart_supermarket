import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.js';
import { useCart } from '../context/CartContext.js';

const NavigationBar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { getCartCount, setShowCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg" className="shadow-sm" fixed="top" style={{position:"sticky"}}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <i className="bi bi-cart-check-fill me-2"></i>
          FreshMart
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/" className="text-white">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="text-white">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-white">
                  <button className="btn btn-light btn-sm">Sign Up</button>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to={isAdmin ? "/admin" : "/dashboard"} className="text-white">
                  Dashboard
                </Nav.Link>
                
                {!isAdmin && (
                  <Nav.Link onClick={() => setShowCart(true)} className="text-white position-relative">
                    <i className="bi bi-cart3 fs-5 "></i>
                    {getCartCount() > 0 && (
                      <Badge 
                        bg="danger" 
                        pill 
                        className="position-absolute top-0 start-100 translate-middle"
                      >
                        {getCartCount()}
                      </Badge>
                    )}
                  </Nav.Link>
                )}

                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" size="sm" id="dropdown-basic">
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name || user?.email}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={isAdmin ? "/admin" : "/dashboard"}>
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;