import { Alert, AlertTitle } from '@mui/material'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react'
import { useSelector } from 'react-redux'
import PaymentForm from './PaymentForm';

// 从环境变量读取 publishable key；在缺失时避免初始化以防止运行时错误
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const StripePayment = () => {
  const { clientSecret } = useSelector((state) => state.auth);
  const { totalPrice } = useSelector((state) => state.cart);
  const { selectedId: selectedUserCheckoutAddress } = useSelector((state) => state.addresses);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  // 仅在存在 publishable key 时初始化 Stripe；否则展示错误提示
  const stripePromise = React.useMemo(() => {
    try {
      return publishableKey ? loadStripe(publishableKey) : null;
    } catch (_) {
      return null;
    }
  }, []);

  return (
    <>
      {!publishableKey && (
        <Alert severity="error">
          <AlertTitle>Stripe initialization failed</AlertTitle>
          Missing publishable key. Please set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in .env.
        </Alert>
      )}

      {publishableKey && clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm clientSecret={clientSecret} totalPrice={totalPrice} addressId={selectedUserCheckoutAddress} />
        </Elements>
      )}
    </>
  )
}

export default StripePayment;