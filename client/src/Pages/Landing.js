import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productsService } from '../services/productsService.js';
import ProductCard from '../components/ProductCard.js';
import LoadingSpinner from '../components/LoadingSpinner.js';

const Landing = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsService.getAllProducts();
      const products = Array.isArray(response.data.data.products)
      ? response.data.data.products
      : [];
      
      setFeaturedProducts(products.slice(0, 6));
    } catch (error) {
      console.error('Error fetching products:', error);
      // Demo data fallback
      setFeaturedProducts([
        { id: 1, name: 'Fresh Apples', price: 120, stock: 50, image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', category: 'Fruits' },
        { id: 2, name: 'Organic Milk', price: 65, stock: 30, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', category: 'Dairy' },
        { id: 3, name: 'Whole Wheat Bread', price: 45, stock: 20, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', category: 'Bakery' },
        { id: 4, name: 'Fresh Tomatoes', price: 40, stock: 100, image: 'https://images.unsplash.com/photo-1546470427-e26264d4e9ec?w=400', category: 'Vegetables' },
        { id: 5, name: 'Brown Eggs', price: 80, stock: 45, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', category: 'Dairy' },
        { id: 6, name: 'Orange Juice', price: 95, stock: 25, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', category: 'Beverages' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-success text-white py-5" style={{ minHeight: '500px' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4">Welcome to FreshMart</h1>
              <p className="lead mb-4">
                Your one-stop destination for fresh groceries and daily essentials. 
                Quality products delivered right to your doorstep.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/register" variant="light" size="lg">
                  <i className="bi bi-person-plus me-2"></i>
                  Get Started
                </Button>
                <Button as={Link} to="/login" variant="outline-light" size="lg">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Button>
              </div>
              <div className="mt-4">
                <Row className="text-center">
                  <Col xs={4}>
                    <h3 className="mb-0">500+</h3>
                    <small>Products</small>
                  </Col>
                  <Col xs={4}>
                    <h3 className="mb-0">10K+</h3>
                    <small>Customers</small>
                  </Col>
                  <Col xs={4}>
                    <h3 className="mb-0">24/7</h3>
                    <small>Support</small>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col lg={6}>
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" 
                alt="Shopping"
                className="img-fluid rounded shadow-lg"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="mb-5">
          <Col md={4} className="text-center mb-4">
            <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
              <i className="bi bi-truck text-success" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4>Free Delivery</h4>
            <p className="text-muted">On orders above ₹500</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
              <i className="bi bi-shield-check text-success" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4>Quality Guaranteed</h4>
            <p className="text-muted">Fresh products every day</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
              <i className="bi bi-clock-history text-success" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4>Fast Service</h4>
            <p className="text-muted">Same day delivery available</p>
          </Col>
        </Row>

        {/* Featured Products */}
        <div className="mb-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Featured Products</h2>
            <p className="text-muted">Discover our best-selling items</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <Row>
              {featuredProducts.map((product) => (
                <Col key={product.id} md={6} lg={4} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center mt-4">
            <Button as={Link} to="/register" variant="success" size="lg">
              View All Products
            </Button>
          </div>
        </div>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col md={4} className="mb-3">
              <h5 className="mb-3">
                <i className="bi bi-cart-check-fill me-2"></i>
                FreshMart
              </h5>
              <p className="text">
                Your trusted partner for fresh groceries and daily essentials.
              </p>
            </Col>
            <Col md={4} className="mb-3">
              <h6 className="mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link to="/" className="text text-decoration-none link-light ">Home</Link></li>
                <hr></hr>
                <li><Link to="/login" className="text text-decoration-none link-light">Login</Link></li>
                <hr></hr>
                <li><Link to="/register" className="text text-decoration-none link-light">Register</Link></li>
              </ul>
            </Col>
            <Col md={4} className="mb-3">
              <h6 className="mb-3">Contact Us</h6>
              <p className="text mb-1">
                <i className="bi bi-envelope me-2"></i>
                support@freshmart.com
              </p>
              <hr></hr>
              <p className="text mb-1">
                <i className="bi bi-telephone me-2"></i>
                +91 1234567890
              </p>
              <hr></hr>
              <p className="text">
                <i className="bi bi-geo-alt me-2"></i>
                Tirunelveli, Tamil Nadu, India
              </p>
            </Col>
          </Row>
          <hr className="border-secondary" />
          <div className="text-center text">
            <p className="mb-0">&copy; 2025 FreshMart. All rights reserved.</p>
          </div>
        </Container>
      </footer>

    </div>
  );
};

export default Landing