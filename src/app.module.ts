import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CategoryModule } from './modules/category/category.module';
import { GenderModule } from './modules/gender/gender.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '7d' },
    }),
    ProductModule,
    UserModule,
    OrderModule,
    PaymentModule,
    CategoryModule,
    GenderModule,
  ],
})
export class AppModule {}
