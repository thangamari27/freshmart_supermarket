import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

const CheckoutModal = ({ show, handleClose, cartItems, total, onConfirmOrder, loading }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    delivery_address: '',
    special_instructions: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required';
    }
    if (!formData.delivery_address.trim()) {
      newErrors.delivery_address = 'Delivery address is required';
    }
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirmOrder(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Order Details</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-4">
            <h6>Order Summary</h6>
            <div className="small text-muted">
              {cartItems.length} items • Total: ₹{total.toFixed(2)}
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Customer Name *</Form.Label>
            <Form.Control
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              isInvalid={!!errors.customer_name}
              placeholder="Enter your full name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.customer_name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              isInvalid={!!errors.phone_number}
              placeholder="Enter 10-digit phone number"
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone_number}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Delivery Address *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="delivery_address"
              value={formData.delivery_address}
              onChange={handleChange}
              isInvalid={!!errors.delivery_address}
              placeholder="Enter complete delivery address"
            />
            <Form.Control.Feedback type="invalid">
              {errors.delivery_address}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Special Instructions</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="special_instructions"
              value={formData.special_instructions}
              onChange={handleChange}
              placeholder="Any special delivery instructions"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Placing Order...
              </>
            ) : (
              'Place Order'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CheckoutModal;