import React from 'react';
import { Offcanvas, Button, ListGroup, Form } from 'react-bootstrap';
import { useCart } from '../context/CartContext.js';

const ShoppingCart = ({ show, handleClose, onCheckout }) => {
  const { items: cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton className="bg-success text-white">
        <Offcanvas.Title>
          <i className="bi bi-cart3 me-2"></i> Shopping Cart
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-cart-x display-1 text-muted"></i>
            <p className="text-muted mt-3">Your cart is empty</p>
          </div>
        ) : (
          <>
            <ListGroup variant="flush" className="mb-3">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.id} className="px-0">
                  <div className="d-flex align-items-center">
                    <img
                      src={item?.image_url || 'https://dummyimage.com/300x200/4a5568/f3f3f3&text=Product'}
                      alt={item.name}
                      className="rounded"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 text-truncate">{item.name}</h6>
                      <p className="mb-1 text-success fw-bold">₹{item.price?.toFixed(2)}</p>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <Form.Control
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="text-center mx-2"
                          style={{ width: '50px' }}
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>

            <div className="border-top pt-3 mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span className="fw-bold">₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery:</span>
                <span className="text-success">FREE</span>
              </div>
              <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-2">
                <span>Total:</span>
                <span className="text-success">₹{getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="d-grid gap-2">
            
              <Button 
                variant="success" 
                className="w-100 py-2" 
                onClick={onCheckout} 
                disabled={cartItems.length === 0}
              >
                <i className="bi bi-credit-card me-2"></i>
                Proceed to Checkout
              </Button>
              <Button variant="outline-danger" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ShoppingCart;
