import { SquareClient, SquareEnvironment } from "square";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Customer, PaymentData } from "@/types/intrerface";
import prisma from "@/lib/prisma";
import { Order, Payment } from "@/lib/generated/prisma";
import axios from "axios";
import { orderEmailHtml, sendOrderEmail } from "@/lib/email";

// Handle BigInt serialization for JSON
(BigInt.prototype as { toJSON?: () => string }).toJSON = function () {
  return this.toString();
};

const client = new SquareClient({
  baseUrl: "https://connect.squareupsandbox.com",
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
  version: "2025-04-16",
});

export async function POST(req: NextRequest) {
  try {
    const body: PaymentData = await req.json();

    if (!body.user.email) {
      return NextResponse.json(
        { error: "Buyer email address is required" },
        { status: 400 }
      );
    }

    // Step 1: Try to find the customer
    let customerId = null;

    const existingCustomer = await findSquareCustomer(body.user.email);

    // Check if existingCustomer is undefined
    if (!existingCustomer) {
      console.error("Failed to find existing customer: Customer is undefined");
      return NextResponse.json(
        { error: "Failed to find existing customer: Customer is undefined" },
        { status: 500 }
      );
    }

    if ("error" in existingCustomer) {
      console.error("Error finding existing customer:", existingCustomer.error);
      return NextResponse.json(
        { error: "Failed to find existing customer" },
        { status: 500 }
      );
    }

    // Add this type guard
    if (!Array.isArray(existingCustomer)) {
      console.error("Expected customer data to be an array");
      return NextResponse.json(
        { error: "Invalid customer data format" },
        { status: 500 }
      );
    }

    if (existingCustomer.length > 0) {
      customerId = existingCustomer?.[0].id;
    } else {
      // Customer not found, create a new one
      const newCustomer = await createCustomer({
        email: body.user.email,
        name: body.user.name || undefined,
        phone: body.user.phone || undefined,
      });

      // Check if newCustomer is undefined
      if (!newCustomer) {
        console.error("Failed to create customer: Customer is undefined");

        return NextResponse.json(
          { error: "Failed to create customer: Customer is undefined" },
          { status: 500 }
        );
      }

      // Type guard to check if newCustomer has an error property
      if ("error" in newCustomer) {
        console.error("Failed to create customer", newCustomer.error);
        return NextResponse.json(
          { error: "Failed to create customer", details: newCustomer.error },
          { status: 500 }
        );
      }

      customerId = newCustomer.id;
    }

    // Step 2: Create the payment with the customer ID
    const paymentResult = await createPaymentAPI({
      ...body,
      customerId: customerId,
    });

    // Check if paymentResult is undefined
    if (!paymentResult) {
      console.error("Payment failed: Payment result is undefined");
      return NextResponse.json(
        { error: "Payment failed: Payment result is undefined" },
        { status: 500 }
      );
    }

    // Type guard to check if paymentResult has an error property
    if ("error" in paymentResult) {
      console.error("Payment failed", paymentResult.error);
      return NextResponse.json(
        { error: "Payment failed", details: paymentResult.error },
        { status: 500 }
      );
    }

    if (paymentResult.status === "COMPLETED") {
      const postPaymentData: Payment = {
        product_id: body.product.id,
        user_id: body.user.id || "",
        user_email: body.user.email,
        customer_id: customerId || "",
        source_id: body.sourceId,
        amount: body.amount,
        currency: paymentResult?.approvedMoney?.currency || body.currency,
        payment_method: paymentResult.sourceType || "",
        status: paymentResult.status,

        // just to fill the data not in used
        id: paymentResult.id || "",
        created_at: new Date(),
        updated_at: new Date(),
        order_id: "",
      };

      const createdPayment = await postPaymentToDb(postPaymentData);

      // Check if createdPayment contains an error
      if ("error" in createdPayment) {
        console.error("Failed to create payment record", createdPayment.error);
        return NextResponse.json(
          {
            error: "Failed to create payment record",
            details: createdPayment.error,
          },
          { status: 500 }
        );
      }

      const orderData: Order = {
        user_id: body.user.id || "",
        product_id: body.product.id,
        payment_id: createdPayment.id,
        user_email: body.user.email,
        user_name: body.user.name || "",
        user_phone: body.user.phone || "",
        product_title: body.product.title,
        product_price: body.product.price,
        date: body.order.date,
        time: body.order.time,
        address: body.order.address || "",
        order_status: "pending",
        currency: paymentResult?.approvedMoney?.currency || body.currency,
        paid_amount: paymentResult?.approvedMoney?.amount || body.amount,
        payment_method: paymentResult.sourceType || "",
        payment_status: paymentResult.status,
        note: body.order.note || "",

        // just to fill the data not in used
        id: "",
        created_at: new Date(),
        updated_at: new Date(),
      };

      const createdOrder = await createOrder(orderData);

      // Check if createdOrder contains an error
      if ("error" in createdOrder) {
        console.error("Failed to create order record", createdOrder.error);
        return NextResponse.json(
          {
            error: "Failed to create order record",
            details: createdOrder.error,
          },
          { status: 500 }
        );
      }

      // Send order confirmation email
      await sendOrderConfirmationEmail({
        ...orderData,
        id: createdOrder.id,
        created_at: createdOrder.created_at,
        updated_at: createdOrder.updated_at,
      });

      return NextResponse.json({
        success: true,
        payment: paymentResult,
        order: createdOrder,
      });
    }

    return NextResponse.json({ success: true, payment: paymentResult });
  } catch (error) {
    console.log("Payment error:", error);

    return NextResponse.json(
      { error: "Failed to process payment", details: error },
      { status: 500 }
    );
  }
}

const findSquareCustomer = async (email: string) => {
  try {
    // Check if the customer already exists
    const existingCustomer = await client.customers.search({
      query: {
        filter: {
          emailAddress: {
            exact: email,
          },
        },
      },
    });

    if (existingCustomer.errors) {
      console.error(
        "Error searching for existing customer:",
        existingCustomer.errors
      );
      return { error: "Failed to search for existing customer" };
    }

    return existingCustomer.customers || [];
  } catch (error) {
    console.error("Error searching for existing customer:", error);
    return NextResponse.json(
      { error: "Failed to search for existing customer", details: error },
      { status: 500 }
    );
  }
};

const createCustomer = async (customerData: Customer) => {
  console.log("Creating customer:", customerData);

  try {
    const res = await client.customers.create({
      idempotencyKey: randomUUID(),
      emailAddress: customerData.email,
      givenName: customerData.name,
      phoneNumber: "+1-212-555-4240",
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

const createPaymentAPI = async (paymentData: PaymentData) => {
  const data = {
    idempotency_key: randomUUID(),
    source_id: paymentData.sourceId,
    amount_money: {
      amount: paymentData.amount,
      currency: "USD",
    },
    autocomplete: true,
    customerId: paymentData.customerId,
    locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
    note: paymentData.order.note,
    buyerEmailAddress: paymentData.user.email,
    buyerPhoneNumber: paymentData.user.phone,
    referenceId: paymentData.user.id,
  };

  try {
    const res = await axios.post(
      "https://connect.squareupsandbox.com/v2/payments",
      data,
      {
        headers: {
          "Square-Version": "2025-04-16",
          Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        },
      }
    );

    if (res.data.errors) {
      console.error("Error creating payment via API:", res.data.errors);
      return { error: "Failed to create payment via API" };
    }

    return res.data.payment;
  } catch (error) {
    console.error("Failed to create payment via API:", error);
    return { error: "Failed to create payment via API" };
  }
};

const postPaymentToDb = async (paymentData: Payment) => {
  try {
    const payment = await prisma.payment.create({
      data: {
        product_id: paymentData.product_id,
        user_id: paymentData.user_id,
        user_email: paymentData.user_email,
        customer_id: paymentData.customer_id,
        source_id: paymentData.source_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_method: paymentData.payment_method,
        status: paymentData.status,
      },
    });

    return payment;
  } catch (error) {
    console.error("Error posting payment to DB:", error);
    return { error: "Failed to post payment to DB" };
  }
};

// create the order in the database using prisma
const createOrder = async (orderData: Order) => {
  try {
    const order = await prisma.order.create({
      data: {
        user_id: orderData.user_id,
        product_id: orderData.product_id,
        payment_id: orderData.payment_id,
        user_email: orderData.user_email,
        user_name: orderData.user_name,
        user_phone: orderData.user_phone,
        product_title: orderData.product_title,
        product_price: orderData.product_price,
        date: new Date(orderData.date),
        time: orderData.time,
        address: orderData.address,
        order_status: orderData.order_status,
        currency: orderData.currency,
        note: orderData.note,
        paid_amount: orderData.paid_amount,
        payment_method: orderData.payment_method,
        payment_status: orderData.payment_status,
      },
    });

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    return { error: "Failed to create order" };
  }
};

const sendOrderConfirmationEmail = async (orderData: Order) => {
  try {
    // send email to the user and bcc to the admin
    const emailPayload = {
      to: orderData.user_email,
      subject: `Order Confirmation - ${orderData.product_title}`,
      html: orderEmailHtml(orderData),
    };

    await sendOrderEmail(emailPayload);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};
