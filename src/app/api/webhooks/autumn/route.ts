import { NextRequest, NextResponse } from 'next/server';
import { paymentSessionStorage } from '@/lib/payment-session-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('autumn-signature') || request.headers.get('x-autumn-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Parse the webhook payload
    let event;
    try {
      // Simple JSON parsing for now - you may need to verify signature differently
      event = JSON.parse(body);
      
      // TODO: Implement proper signature verification based on Autumn's documentation
      // This is a placeholder - actual verification depends on Autumn's webhook signing method
      console.log('Received webhook event:', event.type);
      
    } catch (err) {
      console.error('Webhook parsing failed:', err);
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  console.log('Checkout completed:', session);
  
  try {
    // Update session status in our storage
    if (session.id) {
      paymentSessionStorage.updateStatus(session.id, 'completed', {
        stripeSessionId: session.id,
        customerId: session.customer,
        subscriptionId: session.subscription,
        paymentStatus: session.payment_status,
      });
    }
    
    // Here you would typically:
    // 1. Update user's subscription status in your database
    // 2. Send welcome email
    // 3. Set up user's organization
    // 4. Grant access to features
    
    console.log('Successfully processed checkout completion');
  } catch (error) {
    console.error('Error processing checkout completion:', error);
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('Subscription created:', subscription);
  
  // Update your database with the new subscription
  try {
    // await createUserSubscription({
    //   customerId: subscription.customer,
    //   subscriptionId: subscription.id,
    //   status: subscription.status,
    //   planId: subscription.metadata.planId,
    //   currentPeriodEnd: subscription.current_period_end,
    // });
    
    console.log('Successfully processed subscription creation');
  } catch (error) {
    console.error('Error processing subscription creation:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('Subscription updated:', subscription);
  
  // Update subscription status in your database
  try {
    // await updateUserSubscription({
    //   subscriptionId: subscription.id,
    //   status: subscription.status,
    //   currentPeriodEnd: subscription.current_period_end,
    //   cancelAtPeriodEnd: subscription.cancel_at_period_end,
    // });
    
    console.log('Successfully processed subscription update');
  } catch (error) {
    console.error('Error processing subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('Subscription deleted:', subscription);
  
  // Handle subscription cancellation
  try {
    // await updateUserSubscription({
    //   subscriptionId: subscription.id,
    //   status: 'canceled',
    // });
    
    // You might also want to:
    // - Downgrade user's access
    // - Send cancellation email
    // - Archive user data
    
    console.log('Successfully processed subscription deletion');
  } catch (error) {
    console.error('Error processing subscription deletion:', error);
  }
}

async function handlePaymentSucceeded(invoice: any) {
  console.log('Payment succeeded:', invoice);
  
  // Handle successful payment
  try {
    // await recordPayment({
    //   customerId: invoice.customer,
    //   subscriptionId: invoice.subscription,
    //   amount: invoice.amount_paid,
    //   currency: invoice.currency,
    //   invoiceId: invoice.id,
    // });
    
    console.log('Successfully processed payment success');
  } catch (error) {
    console.error('Error processing payment success:', error);
  }
}

async function handlePaymentFailed(invoice: any) {
  console.log('Payment failed:', invoice);
  
  try {
    // Update session status if we have the session ID
    if (invoice.checkout_session_id) {
      paymentSessionStorage.updateStatus(invoice.checkout_session_id, 'failed', {
        failureReason: invoice.failure_reason,
        invoiceId: invoice.id,
      });
    }
    
    // Handle failed payment
    // await recordFailedPayment({
    //   customerId: invoice.customer,
    //   subscriptionId: invoice.subscription,
    //   amount: invoice.amount_due,
    //   reason: invoice.failure_reason,
    //   invoiceId: invoice.id,
    // });
    
    // You might also want to:
    // - Send payment failure notification
    // - Temporarily suspend access
    // - Request payment method update
    
    console.log('Successfully processed payment failure');
  } catch (error) {
    console.error('Error processing payment failure:', error);
  }
}
