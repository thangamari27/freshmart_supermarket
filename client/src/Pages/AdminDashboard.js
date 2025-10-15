import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Tabs, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.js';
import { productsService } from '../services/productsService.js';
import { ordersService } from '../services/ordersService.js';
import { usersService } from '../services/usersService.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import OrderStatusBadge from '../components/OrderStatusBadge.js';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    stock_quantity: '',
    category: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      
      // Use Promise.allSettled instead of Promise.all to handle individual failures
      const [productsRes, ordersRes, usersRes] = await Promise.allSettled([
        productsService.getAllProducts(),
        ordersService.getAllOrders(),
        usersService.getAllUsers()
      ]);
      

      // Handle products response
      if (productsRes.status === 'fulfilled' && 
          productsRes.value && 
          productsRes.value.data && 
          productsRes.value.data.data && 
          productsRes.value.data.data.products) {
        
        setProducts(productsRes.value.data.data.products);
      } else {
        console.warn('⚠️ Products API failed or structure invalid, using demo products');
        setProducts([
          { 
            id: 1, 
            name: 'Fresh Apples', 
            price: 120, 
            stock_quantity: 50, 
            category: 'Fruits', 
            description: 'Crisp red apples', 
            image_url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400' 
          },
          { 
            id: 2, 
            name: 'Organic Milk', 
            price: 65, 
            stock_quantity: 30, 
            category: 'Dairy', 
            description: 'Fresh organic milk', 
            image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' 
          }
        ]);
      }

      // Handle orders response
      if (ordersRes.status === 'fulfilled' && 
          ordersRes.value && 
          ordersRes.value.data && 
          ordersRes.value.data.data && 
          ordersRes.value.data.data.orders) {
        
        setOrders(ordersRes.value.data.data.orders);
      } else {
        console.warn('⚠️ Orders API failed or structure invalid, using demo orders');
        setOrders([
          { 
            id: 1, 
            customer_name: 'John Doe', 
            order_date: '2025-10-05', 
            total_amount: 450, 
            status: 'Delivered', 
            items_count: 5 
          },
          { 
            id: 2, 
            customer_name: 'Jane Smith', 
            order_date: '2025-10-08', 
            total_amount: 280, 
            status: 'Processing', 
            items_count: 3 
          }
        ]);
      }

      // Handle users response
      if (usersRes.status === 'fulfilled' && usersRes.value && usersRes.value.data) {
        
        setUsers(usersRes.value.data);
      } else {
        console.warn('⚠️ Users API failed or structure invalid, using demo users');
        setUsers([
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', joinDate: '2025-09-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', joinDate: '2025-09-20' }
        ]);
      }

    } catch (error) {
      console.error('❌ Unexpected error in fetchAllData:', error);
      // This should rarely happen now since we're using Promise.allSettled
    } finally {
      setLoading(false);
      
    }
  };

  // Add useEffect to log state changes
  useEffect(() => {
    
  }, [products]);

  useEffect(() => {
    
  }, [orders]);

  useEffect(() => {
    
  }, [users]);
  
  const handleProductModalOpen = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || '',
        price: product.price || '',
        stock_quantity: product.stock_quantity || '',
        category: product.category || '',
        description: product.description || '',
        image_url: product.image_url || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        price: '',
        stock_quantity: '',
        category: '',
        description: '',
        image_url: ''
      });
    }
    setShowProductModal(true);
  };

  const handleProductModalClose = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      stock_quantity: '',
      category: '',
      description: '',
      image_url: ''
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsService.updateProduct(editingProduct.id, productForm);
      } else {
        await productsService.createProduct(productForm);
      }
      fetchAllData();
      handleProductModalClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsService.deleteProduct(id);
        fetchAllData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersService.updateOrderStatus(orderId, newStatus);
      fetchAllData();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue: orders.reduce((sum, order) => {
      // Safely convert to number, default to 0 if invalid
      const amount = order.total_amount ? parseFloat(order.total_amount) : 0;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0)
  };

  // console.log('🎨 Rendering AdminDashboard with:', {
  //   productsCount: products.length,
  //   ordersCount: orders.length,
  //   usersCount: users.length,
  //   loading
  // });

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  const formatOrderDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <Container fluid>
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold">Admin Dashboard</h2>
          <p className="text-muted">Welcome back, {user?.name || 'Admin'}</p>
          {/* Debug info - remove in production */}
          {/* <div style={{ fontSize: '12px', color: '#666', background: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
            <strong>Debug Info:</strong> Products: {products.length} | Orders: {orders.length} | Users: {users.length}
          </div> */}
        </div>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded p-3 me-3">
                  <i className="bi bi-box-seam text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Products</h6>
                  <h3 className="mb-0">{stats.totalProducts}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                  <i className="bi bi-bag-check text-success" style={{ fontSize: '2rem' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Orders</h6>
                  <h3 className="mb-0">{stats.totalOrders}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 rounded p-3 me-3">
                  <i className="bi bi-people text-info" style={{ fontSize: '2rem' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Users</h6>
                  <h3 className="mb-0">{stats.totalUsers}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 rounded p-3 me-3">
                  <i className="bi bi-currency-rupee text-warning" style={{ fontSize: '2rem' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Revenue</h6>
                  <h3 className="mb-0">₹{Number(stats.totalRevenue || 0).toFixed(2)}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs defaultActiveKey="products" className="mb-4">
          {/* Products Management Tab */}
          <Tab eventKey="products" title={<span><i className="bi bi-box-seam me-2"></i>Products</span>}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Products Management</h5>
                <Button variant="success" onClick={() => handleProductModalOpen()}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Product
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table hover>
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>
                            <img 
                              src={product.image_url || 'https://via.placeholder.com/50'} 
                              alt={product.name}
                              className="rounded"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          </td>
                          <td className="fw-bold">{product.name}</td>
                          <td>
                            <Badge bg="secondary">{product.category}</Badge>
                          </td>
                          <td className="text-success fw-bold">₹{(Number(product.price) || 0).toFixed(2)}</td>
                          <td>
                            <Badge bg={product.stock_quantity > 10 ? 'success' : product.stock_quantity > 0 ? 'warning' : 'danger'}>
                              {product.stock_quantity}
                            </Badge>
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleProductModalOpen(product)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          {/* Orders Management Tab */}
          <Tab eventKey="orders" title={<span><i className="bi bi-bag-check me-2"></i>Orders</span>}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Orders Management</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table hover>
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Items Count</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="fw-bold">#{order.id}</td>
                          <td>{order.customer_name || 'N/A'}</td>
                          <td>{formatOrderDate(new Date(order.created_at))}</td>
                          <td>{order.item_count}</td>
                          <td className="text-success fw-bold">₹{(Number(order.total_amount) || 0).toFixed(2)}</td>
                          <td>
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td>
                            <Form.Select 
                              size="sm" 
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              style={{ width: '150px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </Form.Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          {/* Users Management Tab */}
          {/* <Tab eventKey="users" title={<span><i className="bi bi-people me-2"></i>Users</span>}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Users Management</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table hover>
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Join Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userItem) => (
                        <tr key={userItem.id}>
                          <td>{userItem.id}</td>
                          <td className="fw-bold">{userItem.name}</td>
                          <td>{userItem.email}</td>
                          <td>
                            <Badge bg={userItem.role === 'admin' ? 'danger' : 'info'} className="text-capitalize">
                              {userItem.role}
                            </Badge>
                          </td>
                          <td>{new Date(userItem.joinDate).toLocaleDateString()}</td>
                          <td>
                            <Button variant="outline-primary" size="sm">
                              <i className="bi bi-eye"></i> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab> */}
        </Tabs>
      </Container>

      {/* Product Modal */}
      <Modal show={showProductModal} onHide={handleProductModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProductSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm({...productForm, stock_quantity: parseInt(e.target.value)})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                value={productForm.image_url}
                onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleProductModalClose}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;