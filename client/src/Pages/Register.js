import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import "bootstrap-icons/font/bootstrap-icons.css";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.full_name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // ✅ Send all fields including confirmPassword
      const result = await register(formData);

      if (result.success) {
        setTimeout(() => {
          const user = JSON.parse(sessionStorage.getItem('user'));
          navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
        }, 100);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={7} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-2 mb-2">
                    <i className="bi bi-person-plus text-success" style={{ fontSize: '3rem', width:"72px" }}></i>
                  </div>
                  <h2 className="fw-bold">Create Account</h2>
                  <p className="text-muted">Join FreshMart today</p>
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="full_name"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

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

                  <Row>
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              name="confirmPassword"
                              placeholder="Confirm password"
                              value={formData.confirmPassword}
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
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Account Type</Form.Label>
                    <Form.Select 
                      name="role" 
                      value={formData.role} 
                      onChange={handleChange}
                    >
                      <option value="customer">Customer</option>
                    </Form.Select>
                    {/* <Form.Text className="text-muted">
                      For demo purposes, you can register as an admin
                    </Form.Text> */}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      label="I agree to the Terms and Conditions"
                      required
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check me-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-success text-decoration-none fw-bold">
                        Login
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;