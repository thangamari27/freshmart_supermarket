import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Tab, Tabs, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.js';
import { useCart } from '../context/CartContext.js';
import { productsService } from '../services/productsService.js';
import { ordersService } from '../services/ordersService.js';
import ProductCard from '../components/ProductCard.js';
import ShoppingCart from '../components/ShoppingCart.js';
import CheckoutModal from '../components/CheckoutModal.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import OrderStatusBadge from '../components/OrderStatusBadge.js';

const Dashboard = () => {
  const { user } = useAuth();
  const { items: cartItems, isCartOpen: showCart, toggleCart, clearCart, getCartTotal } = useCart();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false); 
  const [orderLoading, setOrderLoading] = useState(false); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        productsService.getAllProducts(),
        ordersService.getUserOrders()
      ]);

      setProducts(productsRes.data.data.products);
      setOrders(ordersRes.data.data.orders);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback demo data
      setProducts([
        { id: 1, name: 'Fresh Apples', price: 120, stock: 50, image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', category: 'Fruits', description: 'Crisp and sweet red apples' },
        { id: 2, name: 'Organic Milk', price: 65, stock: 30, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', category: 'Dairy', description: 'Fresh organic whole milk' },
        { id: 3, name: 'Whole Wheat Bread', price: 45, stock: 20, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', category: 'Bakery', description: 'Freshly baked whole wheat bread' },
        { id: 4, name: 'Fresh Tomatoes', price: 40, stock: 100, image: 'https://images.unsplash.com/photo-1546470427-e26264d4e9ec?w=400', category: 'Vegetables', description: 'Farm fresh red tomatoes' },
        { id: 5, name: 'Brown Eggs', price: 80, stock: 45, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', category: 'Dairy', description: 'Free range brown eggs' },
        { id: 6, name: 'Orange Juice', price: 95, stock: 25, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', category: 'Beverages', description: 'Fresh squeezed orange juice' },
        { id: 7, name: 'Bananas', price: 50, stock: 80, image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400', category: 'Fruits', description: 'Ripe yellow bananas' },
        { id: 8, name: 'Cheddar Cheese', price: 150, stock: 15, image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400', category: 'Dairy', description: 'Aged cheddar cheese' }
      ]);
      setOrders([
        { id: 1, date: '2025-10-05', total: 450, status: 'Delivered', items: 5 },
        { id: 2, date: '2025-10-08', total: 280, status: 'Processing', items: 3 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Open Checkout Modal
  const handleProceedToCheckout = () => {
    setShowCheckout(true);
    toggleCart(); // Close cart sidebar
  };

  // Confirm Order from Checkout Modal
  const handleConfirmOrder = async (orderDetails) => {
    try {
      setOrderLoading(true);

      const orderData = {
        user_id: user?.id,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: Number(item.price || 0),
          total_price: Number(item.price || 0) * item.quantity
        })),
        total_amount: Number(getCartTotal() || 0),
        order_details: {
          customer_name: orderDetails.customer_name,
          phone_number: orderDetails.phone_number,
          delivery_address: orderDetails.delivery_address,
          special_instructions: orderDetails.special_instructions
        }
      };

      await ordersService.createOrder(orderData);

      // Clear cart and close modal
      clearCart();
      setShowCheckout(false);
      setOrderSuccess(true);

      // Refresh orders immediately
      const ordersRes = await ordersService.getUserOrders();
      setOrders(ordersRes.data.data.orders);

      setTimeout(() => setOrderSuccess(false), 5000);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  const formatOrderDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(p => p.category))];

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="bg-light min-vh-100 py-4">
      <Container>
        {/* Welcome Section */}
        <Card className="shadow-sm mb-4 border-0">
          <Card.Body className="bg-success text-white rounded">
            <Row className="align-items-center">
              <Col md={8}>
                <h2 className="mb-2">Welcome back, {user?.name || 'Customer'}! 👋</h2>
                <p className="mb-0">Explore our fresh products and enjoy shopping</p>
              </Col>
              <Col md={4} className="text-md-end mt-3 mt-md-0">
                <div className="bg-white bg-opacity-25 rounded p-3 d-inline-block">
                  <h5 className="mb-0">Cart Items: {cartItems.length}</h5>
                  <small>Total: ₹{Number(getCartTotal() || 0).toFixed(2)}</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {orderSuccess && (
          <Alert variant="success" dismissible onClose={() => setOrderSuccess(false)}>
            <i className="bi bi-check-circle-fill me-2"></i>
            Order placed successfully! Check your order history below.
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultActiveKey="products" className="mb-4">
          {/* Products Tab */}
          <Tab eventKey="products" title={<span><i className="bi bi-grid me-2"></i>Products</span>}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <Form.Select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="text-capitalize">
                          {cat === 'all' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>

                <Row>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Col key={product.id} md={6} lg={4} xl={3} className="mb-4">
                        <ProductCard product={product} />
                      </Col>
                    ))
                  ) : (
                    <Col className="text-center py-5">
                      <i className="bi bi-inbox display-1 text-muted"></i>
                      <p className="text-muted mt-3">No products found</p>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Tab>

          {/* Orders Tab */}
          <Tab eventKey="orders" title={<span><i className="bi bi-bag-check me-2"></i>My Orders</span>}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                {orders.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover>
                      <thead className="table-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Items Count</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td className="fw-bold">#{order.id}</td>
                            <td>{formatOrderDate(new Date(order.created_at))}</td>
                            <td>{order.item_count} items</td>
                            <td className="text-success fw-bold">₹{Number(order.total_amount)?.toFixed(2)}</td>
                            <td><OrderStatusBadge status={order.status} /></td>
                            <td>
                              <button className="btn btn-sm btn-outline-success">
                                <i className="bi bi-eye"></i> View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-bag-x display-1 text-muted"></i>
                    <p className="text-muted mt-3">No orders yet. Start shopping!</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>

          {/* Profile Tab */}
          {/* <Tab eventKey="profile" title={<span><i className="bi bi-person me-2"></i>Profile</span>}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Row>
                  <Col md={4} className="text-center mb-4">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                      <i className="bi bi-person-circle text-success" style={{ fontSize: '5rem' }}></i>
                    </div>
                    <h4>{user?.full_name || 'Customer'}</h4>
                    <p className="text-muted">{user?.email}</p>
                  </Col>
                  <Col md={8}>
                    <h5 className="mb-3">Account Information</h5>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" defaultValue={user?.name} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" defaultValue={user?.email} readOnly />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="tel" placeholder="Enter phone number" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Delivery Address</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter delivery address" />
                      </Form.Group>
                      <button type="button" className="btn btn-success">
                        <i className="bi bi-save me-2"></i>
                        Update Profile
                      </button>
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab> */}
        </Tabs>
      </Container>

      {/* Shopping Cart Sidebar */}
      <ShoppingCart 
        show={showCart} 
        handleClose={toggleCart}
        onCheckout={handleProceedToCheckout} // Updated for checkout modal
      />

      {/* Checkout Modal */}
      <CheckoutModal
        show={showCheckout}
        handleClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        total={getCartTotal()}
        onConfirmOrder={handleConfirmOrder}
        loading={orderLoading}
      />
    </div>
  );
};

export default Dashboard;
