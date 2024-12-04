import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cancel = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const handleCancelation = async () => {
        try {
            const response = await axios.post('/api/order/cancelTransaction', { orderId });
            if (response.data.success) {
                toast.info('Transaction canceled successfully.');
            } else {
                toast.error('Failed to cancel the transaction.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while canceling the transaction.');
        }
    };

    useEffect(() => {
        if (orderId) {
            handleCancelation();
        }
    }, [orderId]);

    return <div>Canceling your transaction...</div>;
};

export default Cancel;
