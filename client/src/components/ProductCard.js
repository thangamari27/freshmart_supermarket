import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      navigate('/login');
      return;
    }
    
    addToCart(product);
  };

  return (
    <Card className="h-100 shadow-sm hover-shadow transition">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={product?.image_url || 'https://dummyimage.com/300x200/4a5568/f3f3f3&text=Product'} 
          alt={product.name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        {product.stock_quantity < 10 && product.stock_quantity > 0 && (
          <Badge bg="warning" className="position-absolute top-0 end-0 m-2">
            Low Stock
          </Badge>
        )}
        {product.stock_quantity === 0 && (
          <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
            Out of Stock
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-truncate" title={product.name}>
          {product.name}
        </Card.Title>
        <Card.Text className="text-muted small mb-2">
          {product.category || 'Grocery'}
        </Card.Text>
        <Card.Text className="text-truncate small" style={{ minHeight: '40px' }}>
          {product.description || 'Quality product for your daily needs'}
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="text-success mb-0">₹{product.price}</h5>
            <small className="text-muted">Stock: {product.stock_quantity || 0}</small>
          </div>
          <Button 
            variant="success" 
            className="w-100"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
          >
            <i className="bi bi-cart-plus me-2"></i>
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;