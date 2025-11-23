import { Button, Step, StepLabel, Stepper } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AddressInfo from './AddressInfo';
import OrderConfirmation from './OrderConfirmation';
import PaymentMethod from './PaymentMethod';
import StripePayment from './StripePayment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAddresses, createOrder, getStripeClientSecretByOrder } from '../../store/actions';
import toast from 'react-hot-toast';

const Checkout = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [createdOrderId, setCreatedOrderId] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, errorMessage } = useSelector((state) => state.errors);
    const { selectedId: selectedUserCheckoutAddress, selectedDetail: selectedAddressDetail } = useSelector((state) => state.addresses);
    const { items: cartItems, totalPrice } = useSelector((state) => state.cart);
    const { paymentMethod } = useSelector((state) => state.payment);
    const { user } = useSelector((state) => state.auth);

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleNext = async () => {
        // Step 0: Address → require selected address
        if (activeStep === 0 && !selectedUserCheckoutAddress) {
            toast.error("Please select checkout address before proceeding.");
            return;
        }

        // Step 1: Order Confirmation → 创建订单
        if (activeStep === 1) {
            try {
                if (!user) {
                    toast.error("Please log in to place order");
                    navigate('/login');
                    return;
                }
                const order = await dispatch(createOrder(selectedUserCheckoutAddress));
                const orderId = order?.orderId || order?.id || null;
                setCreatedOrderId(orderId);
                toast.success('Order created. Select payment method.');
                setActiveStep(2);
                return;
            } catch (err) {
                const msg = err?.message || 'Failed to create order';
                toast.error(msg);
                return;
            }
        }

        // Step 2: Payment Method → 选择 Stripe 并获取 client secret
        if (activeStep === 2) {
            if (!paymentMethod) {
                toast.error('Please select a payment method');
                return;
            }
            if (paymentMethod !== 'Stripe') {
                toast.error('Only Stripe is supported for now');
                return;
            }
            try {
                if (!createdOrderId) {
                    toast.error('Missing order id. Please create order first.');
                    setActiveStep(1);
                    return;
                }
                await dispatch(getStripeClientSecretByOrder(createdOrderId));
                toast.success('Payment initialized');
                setActiveStep(3);
                return;
            } catch (err) {
                const msg = err?.message || 'Failed to initialize payment';
                toast.error(msg);
                return;
            }
        }

        // 默认：进入下一步
        setActiveStep((prevStep) => prevStep + 1);
    };

    const steps = [
        "Address",
        "Order Confirmation",
        "Payment Method",
        "Payment",
    ];

    useEffect(() => {
        try { dispatch(fetchUserAddresses()); } catch (_) {}
    }, [dispatch]);

  return (
    <div className='py-14 min-h-[calc(100vh-100px)]'>
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
                <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>

        <div className='mt-5'>
            {activeStep === 0 && <AddressInfo />}
            {activeStep === 1 && (
                <OrderConfirmation
                    totalPrice={totalPrice}
                    cart={cartItems}
                    address={selectedAddressDetail}
                />
            )}
            {activeStep === 2 && <PaymentMethod />}
            {activeStep === 3 && <StripePayment />}
        </div>

        <div
            className='flex justify-between items-center px-4 fixed z-50 h-24 bottom-0 bg-white left-0 w-full py-4 border-slate-200'
            style={{ boxShadow: "0 -2px 4px rgba(100, 100, 100, 0.15)" }}>
            <button
                disabled={activeStep === 0}
                className={`bg-custom-blue font-semibold px-6 h-10 rounded-md text-white ${activeStep === 0 ? 'opacity-60' : 'cursor-pointer'}`}
                onClick={handleBack}>
                Back
            </button>

            {activeStep !== steps.length - 1 && (
                <button
                    disabled={activeStep === 0 ? !selectedUserCheckoutAddress : false}
                    className={`bg-custom-blue font-semibold px-6 h-10 rounded-md text-white 
                       ${
                        (activeStep === 0 && !selectedUserCheckoutAddress)
                        ? "opacity-60"
                        : "cursor-pointer"
                       }`}
                       onClick={handleNext}>
                    {activeStep === 1 ? 'Confirm' : 'Proceed'}
                </button>
            )}
        </div>
    </div>
  );
}

export default Checkout;