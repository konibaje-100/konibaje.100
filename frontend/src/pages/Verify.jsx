import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const reference = searchParams.get('reference'); // Extract the reference
    const [paymentVerified, setPaymentVerified] = useState(false);

    console.log('Success:', success);
    console.log('Order ID:', orderId);
    console.log('Reference:', reference);

    const verifyPayment = async () => {
        try {
            if (!token) {
                toast.error('User not authenticated!');
                return navigate('/login');
            }

            // Handle cases where the reference is null
            if (!reference && success === "false") {
                toast.error('Payment failed. Redirecting to cart...');
                await axios.post(
                    backendUrl + '/api/order/verifyStripe',
                    { success, orderId, reference }, // Include reference
                    { headers: { token } }
                );
                return navigate('/cart');
            }

            // Proceed with verification if reference is valid
            const response = await axios.post(
                backendUrl + '/api/order/verifyStripe',
                { success, orderId, reference },
                { headers: { token } }
            );
            console.log(response.data);

            if (response.data.success) {
                setCartItems({});
                toast.success('Payment verified successfully!');
                navigate('/orders');
            } else {
                toast.error('Payment verification failed. Redirecting to cart...');
                navigate('/cart');
            }
        } catch (error) {
            console.log(error);
            toast.error('An error occurred while verifying payment. Redirecting to cart...');
            navigate('/cart');
        }
    };

    useEffect(() => {
        if (token && success && orderId && !paymentVerified) {
            verifyPayment();
            setPaymentVerified(true);
        }
    }, [token, success, orderId, reference, paymentVerified]);

    return <div></div>;
};

export default Verify;
