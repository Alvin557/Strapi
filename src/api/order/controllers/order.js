'use strict';
const stripe = require("stripe")('sk_test_51PEZVuFIp5XO4imURCwHtc6vXtq2oCgLbhVd8ipnl7LnBfNBfjHOXiXe1TqphTeRw7seh5toXmEaacsWAQUNByEf00fuXq7JcH');

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { total } = ctx.request.body; // Get total amount from the request body
    console.log('Received total amount:', total); // Log the received total amount

    try {
      const CLIENT_URL = 'http://localhost:5173'; // Replace with your frontend URL

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${CLIENT_URL}/success`,
        cancel_url: `${CLIENT_URL}?success=false`,
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order", // You can customize the name as needed
            },
            unit_amount: Math.round(total * 100), // Convert total to cents
          },
          quantity: 1, // Set quantity to 1
        }],
      });
      console.log('Created Stripe session:', session); // Log the created Stripe session

      // You can save additional data like session ID to your database if needed

      return { stripeSession: session };
    } catch (error) {
      console.error('Error creating order:', error); // Log the error
      ctx.response.status = 500;
      return { error };
    }
  }
}));
