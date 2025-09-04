import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface NotificationBarProps {
  notification: Notification | null;
  onClose: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification && notification.duration) {
      const timer = setTimeout(() => {
        onClose();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getAlertVariant = () => {
    return notification.type === 'error' ? 'destructive' : 'default';
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert variant={getAlertVariant()} className="border-l-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <AlertDescription>{notification.message}</AlertDescription>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </Alert>
    </div>
  );
};

export default NotificationBar;