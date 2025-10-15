import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from '../context/AuthContext.js';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!formData.email || !formData.password) {
    setError('Please fill in all fields');
    return;
  }

  setLoading(true);

  try {
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Get user from sessionStorage instead of immediate access
      setTimeout(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 100);
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  } catch (err) {
    setError('An unexpected error occurred. Please try again.');
    console.error('Login error:', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-2 mb-2">
                    <i className="bi bi-person-circle text-success" style={{ fontSize: '3rem', width:"72px" }}></i>
                  </div>
                  <h2 className=" fw-bold">Welcome Back</h2>
                  <p className="text-muted">Login to your FreshMart account</p>
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <InputGroup.Text
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer", background: "white" }}
                      >
                        {<i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      label="Remember me"
                    />
                  </Form.Group>

                  <Button 
                    variant="success" 
                    type="submit" 
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-success text-decoration-none fw-bold">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </Form>

                <hr className="my-4" />

                <div className="text-center">
                  <Link to="/" className="text-muted text-decoration-none">
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Home
                  </Link>
                </div>
              </Card.Body>
            </Card>

            {/* Demo Credentials Info */}
            {/* <Card className="mt-3 border-success">
              <Card.Body className="p-3">
                <h6 className="text-success mb-2">
                  <i className="bi bi-info-circle me-2"></i>
                  Demo Credentials
                </h6>
                <small className="text-muted d-block">Customer: customer@demo.com / password123</small>
                <small className="text-muted d-block">Admin: admin@demo.com / admin123</small>
              </Card.Body>
            </Card> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;