const stripe = require('stripe')('sk_test_51IeDvNSACUKPl95IzajsHJPBYPdheA3MOXUrayAi5XqsDYVgw8QW7G3aoQrw7ElAnEoMwDMhr8ww5yiV8qeZYlqV005BoM4wIe')

exports.handler = async (event) => {
    const {typeName, arguments} = event

    if (typeName !== 'Mutation') {
        throw new Error('Request is not a function')
    }
    if (!arguments?.amount) {
        throw new Error('Amount argument is required')
    }

    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: arguments.amount,
        currency: 'inr'
    })
    return {
        clientSecret: paymentIntent.client_secret,
    }
};
