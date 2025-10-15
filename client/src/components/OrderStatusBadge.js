import React from 'react';
import { Badge } from 'react-bootstrap';

const OrderStatusBadge = ({ status }) => {
  const getStatusVariant = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Badge bg={getStatusVariant()} className="text-capitalize">
      {status || 'Unknown'}
    </Badge>
  );
};

export default OrderStatusBadge;