import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useToastStore } from '../store/toastStore';


const ErrorToast: React.FC = () => {
  const toasts = useToastStore( s => s.toasts);
  const removeToast = useToastStore( s => s.removeToast);

  return (
    <ToastContainer position="top-end" className="p-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          bg={toast.type}
          onClose={() => removeToast(toast.id)}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">{toast.type.toUpperCase()}</strong>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default ErrorToast;
