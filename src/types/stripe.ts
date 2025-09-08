export interface StripePaymentProps {
  clientSecret: string;
  bookingId: number;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

export interface PaymentFormProps {
  bookingId: number;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string;
  bookingId: number;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

