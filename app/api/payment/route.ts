import { SquareClient } from "square";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

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

    // At this point, TypeScript knows paymentResult is a Payment object
    return NextResponse.json({ success: true, payment: paymentResult });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Failed to process payment", details: error },
      { status: 500 }
    );
  }
}

interface Customer {
  id?: string;
  emailAddress: string;
  givenName?: string;
  phoneNumber?: string;
}

export const findCustomer = async (emailAddress: string) => {
  try {
    const response = await client.customers.search({
      query: {
        filter: {
          emailAddress: {
            exact: emailAddress,
          },
        },
      },
    });

    if (response.customers && response.customers.length > 0) {
      return response.customers[0];
    }

    return null;
  } catch (error) {
    console.error("Error finding customer:", error);
    return { error: "Failed to find customer" };
  }
};

export const createCustomer = async (customerData: Customer) => {
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

interface PaymentData {
  sourceId: string;
  amount: number;
  customerId?: string;
  locationId?: string;
  orderId?: string;
  referenceId?: string;
  note?: string;
  appFee?: number;
  buyerEmailAddress?: string;
}

export const createPayment = async (paymentData: PaymentData) => {
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
