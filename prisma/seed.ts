import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.size.deleteMany();
  await prisma.color.deleteMany();

  // Criar categorias
  await prisma.category.createMany({
    data: [
      { name: 'Category 1' },
      { name: 'Category 2' },
      { name: 'Category 3' },
    ],
  });
  const categories = await prisma.category.findMany();

  // Criar tamanhos
  await prisma.size.createMany({
    data: [{ name: 'Small' }, { name: 'Medium' }, { name: 'Large' }],
  });
  const sizes = await prisma.size.findMany();

  // Criar cores
  await prisma.color.createMany({
    data: [
      { name: 'Red', code: '#FF0000' },
      { name: 'Blue', code: '#0000FF' },
      { name: 'Green', code: '#00FF00' },
    ],
  });
  const colors = await prisma.color.findMany();

  // Criar produtos com quantidades, imagens e categorias
  for (let i = 0; i < 50; i++) {
    const productName = `Product ${i}`;
    const sku = `SKU-${i}`;
    const path = `${productName.replace(/\s/g, '-')}-${sku}`;

    await prisma.product.create({
      data: {
        sku: sku,
        name: productName,
        description: `Description for ${productName}`,
        composition: `Composition for ${productName}`,
        price: Math.random() * 100,
        discount: Math.random() * 10,
        path: path,
        category: {
          connect: {
            id: categories[Math.floor(Math.random() * categories.length)].id,
          },
        },
        quantities: {
          create: [
            {
              color: {
                connect: {
                  id: colors[Math.floor(Math.random() * colors.length)].id,
                },
              },
              size: {
                connect: {
                  id: sizes[Math.floor(Math.random() * sizes.length)].id,
                },
              },
              units: Math.floor(Math.random() * 100),
            },
          ],
        },
        images: {
          create: [
            {
              url: `https://lyamarababys.s3.sa-east-1.amazonaws.com/product-images/conj02.png`,
              main: true,
            },
            {
              url: `https://lyamarababys.s3.sa-east-1.amazonaws.com/product-images/conj02.png`,
              main: false,
            },
            {
              url: `https://lyamarababys.s3.sa-east-1.amazonaws.com/product-images/conj02.png`,
              main: false,
            },
          ],
        },
      },
    });
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
