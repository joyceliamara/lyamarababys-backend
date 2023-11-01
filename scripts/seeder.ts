import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

(async () => {
  await client.address.deleteMany();
  await client.cart.deleteMany();
  await client.category.deleteMany();
  await client.color.deleteMany();
  await client.contact.deleteMany();
  await client.gender.deleteMany();
  await client.order.deleteMany();
  await client.product.deleteMany();
  await client.productImage.deleteMany();
  await client.quantity.deleteMany();
  await client.size.deleteMany();
  await client.user.deleteMany();

  await client.category.createMany({
    data: ['Roupas', 'Bolsas', 'Brinquedos', 'Acessórios'].map((i) => ({
      name: i,
    })),
  });

  await client.gender.createMany({
    data: ['Feminino', 'Masculino'].map((i) => ({
      name: i,
    })),
  });

  await client.size.createMany({
    data: ['1 ano', '2 anos', '3 anos', 'G', 'M', 'PP', 'Prematuro'].map(
      (i) => ({
        name: i,
      }),
    ),
  });

  await client.color.createMany({
    data: [
      {
        code: '#F8EE95',
        name: 'Amarelo',
      },
      {
        code: '#66DAE1',
        name: 'Azul',
      },
      {
        code: '#D9C490',
        name: 'Bege',
      },
      {
        code: '#F5F5F5',
        name: 'Branco',
      },
      {
        code: '#92EA83',
        name: 'Verde',
      },
      {
        code: '#EEB8BC',
        name: 'Rosa',
      },
      {
        code: '#D85151',
        name: 'Vermelho',
      },
      {
        code: '#8D5A3D',
        name: 'Marrom',
      },
      {
        code: '#EA844B',
        name: 'Laranja',
      },
    ],
  });

  const category = await client.category.findFirst();
  const color = await client.color.findFirst();
  const gender = await client.gender.findFirst();

  await Promise.all(
    Array(50)
      .fill(0)
      .map((i, index) =>
        client.product.create({
          data: {
            name: 'Produto Teste',
            discount: Math.floor(Math.random() * 81),
            price: 160.5,
            subtitle: 'Bolsa com detalhes em bordado rosa',
            sku: index.toString().padStart(6, '1'),
            categories: {
              connect: {
                id: category.id,
              },
            },
            colors: {
              connect: {
                id: color.id,
              },
            },
            genders: {
              connect: {
                id: gender.id,
              },
            },
            images: {
              create: {
                url: 'https://lyamarababys.s3.sa-east-1.amazonaws.com/product-images/conj02.png',
                main: true,
              },
            },
          },
        }),
      ),
  );
})();
