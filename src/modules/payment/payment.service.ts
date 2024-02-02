import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      'sk_test_51K9VNBENaXCRDBcgroshr4EXYOj4v1Shb2I0Yge6s9kqR9z3ltCoycd9mRU0xVE8OB7pbt1RkLMkIS9Q1ebtNL7800s6GDnnYn',
    );
  }

  async create() {
    const token = await this.stripe.tokens.create({
      card: {
        exp_month: 12,
        exp_year: 25,
        number: '4242424242424242',
      } as any,
    });

    return { token };

    await this.stripe.charges.create({});

    // const paymentIntent = await this.stripe.paymentIntents.create({
    //   amount: 100,
    //   currency: 'brl',
    //   automatic_payment_methods: {
    //     enabled: true,
    //   },
    // });

    // return {
    //   clientSecret: paymentIntent.client_secret,
    // };
  }
}
