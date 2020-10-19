import { useEffect, useState } from "react";
import useRequest from '../../hooks/use-request';
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
        },
        onSuccess: (payment) => console.log(payment),
    });


    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(msLeft / 1000);
        }
        findTimeLeft();
        const int = setInterval(() => {
            findTimeLeft();
        }, 1000);

        return () => {
            clearInterval(int);
        }
    }, []);

    if (timeLeft < 0) {
        return (
            <div>Order Expired</div>
        );
    }

    return (
        <div>
            {timeLeft} seconds left until order expires
            <StripeCheckout
                token={({ id }) => {
                    doRequest({token: id});
                }}
                stripeKey="pk_test_51Hag5UClhISbsWoPb91N2o3QVReI2RkwOhv7mRaGKo18PCrP3LUdpTIM5qIKkruFpjgNbK3yu4JGkPyzNH6TxDxa00I4WXIqmK"
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    );

}

OrderShow.getInitialProps = async (ctx, client) => {
    const { orderId } = ctx.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return {
        order: data,
    };
}

export default OrderShow;