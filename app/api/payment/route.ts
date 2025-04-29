import { SquareClient } from "square";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Customer, Order, PaymentData } from "@/types/intrerface";
import prisma from "@/lib/prisma";

// Handle BigInt serialization for JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: "sandbox", // Change to "production" for live transactions
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.buyerEmailAddress) {
      return NextResponse.json(
        { error: "Buyer email address is required" },
        { status: 400 }
      );
    }

    // Step 1: Try to find the customer
    let customerId = null;
    const foundCustomer = await client.customers.search({
      query: {
        filter: {
          emailAddress: {
            exact: body.buyerEmailAddress,
          },
        },
      },
    });

    // Check if customer exists
    if (foundCustomer?.customers && foundCustomer.customers.length > 0) {
      // Customer found
      customerId = foundCustomer.customers[0].id;
      console.log("Existing customer found:", customerId);
    } else {
      // Customer not found, create a new one
      const newCustomer = await createCustomer({
        emailAddress: body.buyerEmailAddress,
        givenName: body.givenName || undefined,
        phoneNumber: body.phoneNumber || undefined,
      });

      // Check if newCustomer is undefined
      if (!newCustomer) {
        return NextResponse.json(
          { error: "Failed to create customer: Customer is undefined" },
          { status: 500 }
        );
      }

      // Type guard to check if newCustomer has an error property
      if ("error" in newCustomer) {
        return NextResponse.json(
          { error: "Failed to create customer", details: newCustomer.error },
          { status: 500 }
        );
      }

      customerId = newCustomer.id;
      console.log("New customer created:", customerId);
    }

    // Step 2: Create the payment with the customer ID
    const paymentResult = await createPayment({
      ...body,
      customerId: customerId,
    });

    // Check if paymentResult is undefined
    if (!paymentResult) {
      return NextResponse.json(
        { error: "Payment failed: Payment result is undefined" },
        { status: 500 }
      );
    }

    // Type guard to check if paymentResult has an error property
    if ("error" in paymentResult) {
      return NextResponse.json(
        { error: "Payment failed", details: paymentResult.error },
        { status: 500 }
      );
    }

    const postPaymentData = {
      sourceId: body.sourceId,
      amount: body.amount,
      product: body.product,
      order: body.order,
      customerId: customerId,
      locationId: body.locationId,
      orderId: body.orderId,
      referenceId: body.referenceId,
      note: body.note,
      appFee: body.appFee,
      paymentMethod: body.paymentMethod,
      buyerEmailAddress: body.buyerEmailAddress,
      givenName: body.givenName,
      phoneNumber: body.phoneNumber,
      currency: body.currency,
      user_id: body.user_id,
      status: paymentResult.status,
    };

    await postPaymentToDb(postPaymentData);

    if (paymentResult.status === "COMPLETED") {
      const orderData = {
        user_id: body.user_id,
        user_email: body.buyerEmailAddress,
        user_name: body.givenName,
        user_phone: body.phoneNumber,
        product_id: body.product.id,
        product_title: body.product.title,
        product_price: body.product.price,
        date: body.date,
        time: body.time,
        order_status: "COMPLETED",
        currency: body.currency,
      };

      const createdOrder = await createOrder(orderData);

      return NextResponse.json({
        success: true,
        payment: paymentResult,
        order: createdOrder,
      });
    }

    return NextResponse.json({ success: true, payment: paymentResult });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Failed to process payment", details: error },
      { status: 500 }
    );
  }
}

const createCustomer = async (customerData: Customer) => {
  try {
    const res = await client.customers.create({
      idempotencyKey: randomUUID(),
      emailAddress: customerData.emailAddress,
      givenName: customerData.givenName,
      phoneNumber: customerData.phoneNumber,
    });

    if (res.errors) {
      console.error("Error creating customer:", res.errors);
      return { error: "Failed to create customer" };
    }

    return res.customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    return { error: "Failed to create customer" };
  }
};

const createPayment = async (paymentData: PaymentData) => {
  try {
    const res = await client.payments.create({
      sourceId: paymentData.sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(paymentData.amount),
        currency: "USD",
      },
      customerId: paymentData.customerId,
      locationId: paymentData.locationId,
      orderId: paymentData.orderId,
      referenceId: paymentData.referenceId,
      note: paymentData.note,
      buyerEmailAddress: paymentData.buyerEmailAddress,

      ...(paymentData.appFee && {
        appFeeMoney: {
          amount: BigInt(paymentData.appFee),
          currency: "USD",
        },
      }),
    });

    if (res.errors) {
      console.error("Error creating payment:", res.errors);
      return { error: "Failed to create payment" };
    }

    return res.payment;
  } catch (error) {
    console.error("Error creating payment:", error);
    return { error: "Failed to create payment" };
  }
};

// create the order in the database using prisma
const createOrder = async (orderData: Order) => {
  try {
    const order = await prisma.order.create({
      data: {
        user_id: orderData.user_id,
        user_email: orderData.user_email,
        user_name: orderData.user_name,
        user_phone: orderData.user_phone,
        product_id: orderData.product_id,
        product_title: orderData.product_title,
        product_price: orderData.product_price,
        date: new Date(orderData.date),
        time: orderData.time,
        order_status: orderData.order_status,
        currency: orderData.currency,
        note: orderData.note,
        paid_amount: orderData.paid_amount,
      },
    });

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    return { error: "Failed to create order" };
  }
};

const postPaymentToDb = async (paymentData: PaymentData) => {
  try {
    const payment = await prisma.payment.create({
      data: {
        source_id: paymentData.sourceId,
        amount: paymentData.amount,
        product_id: paymentData.product.id,
        order_id: paymentData.order.id,
        payment_method: paymentData.paymentMethod,
        user_email: paymentData.buyerEmailAddress,
        user_id: paymentData.user_id,
        customer_id: paymentData.customerId,
        currency: paymentData.currency,
        status: paymentData.status,
      },
    });

    return payment;
  } catch (error) {
    console.error("Error posting payment to DB:", error);
    return { error: "Failed to post payment to DB" };
  }
};
