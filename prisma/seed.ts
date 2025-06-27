import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default header settings
  await prisma.headerSetting.upsert({
    where: { id: 'default-header' },
    update: {},
    create: {
      id: 'default-header',
      headerLogo: 'https://res.cloudinary.com/dc6svbdh9/image/upload/v1746335068/header/tsvfm6pvfwpbpyqdtxwn.svg',
      emailLogo: 'https://res.cloudinary.com/dc6svbdh9/image/upload/v1746693785/logo_ouegg7.png',
    },
  })

  // Create default SEO settings
  await prisma.seoSetting.upsert({
    where: { id: 'default-seo' },
    update: {},
    create: {
      id: 'default-seo',
      siteName: 'CozyCommerce',
      title: 'CozyCommerce - Your Online Store',
      description: 'Discover amazing products at CozyCommerce',
      keywords: 'ecommerce, online store, shopping',
    },
  })

  // Create sample categories
  const electronicsCategory = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      title: 'Electronics',
      slug: 'electronics',
      image: '/images/categories/categories-01.png',
      description: 'Latest electronic gadgets and devices',
    },
  })

  const fashionCategory = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      title: 'Fashion',
      slug: 'fashion',
      image: '/images/categories/categories-02.png',
      description: 'Trendy fashion items',
    },
  })

  // Create sample products
  const product1 = await prisma.product.upsert({
    where: { slug: 'wireless-headphones' },
    update: {},
    create: {
      title: 'Wireless Headphones',
      slug: 'wireless-headphones',
      shortDescription: 'High-quality wireless headphones with noise cancellation',
      description: 'Premium wireless headphones with advanced noise cancellation technology',
      price: 199.99,
      discountedPrice: 149.99,
      quantity: 50,
      sku: 'WH-001',
      categoryId: electronicsCategory.id,
    },
  })

  const product2 = await prisma.product.upsert({
    where: { slug: 'casual-tshirt' },
    update: {},
    create: {
      title: 'Casual T-Shirt',
      slug: 'casual-tshirt',
      shortDescription: 'Comfortable cotton t-shirt for everyday wear',
      description: 'Soft cotton t-shirt perfect for casual occasions',
      price: 29.99,
      discountedPrice: 24.99,
      quantity: 100,
      sku: 'TS-001',
      categoryId: fashionCategory.id,
    },
  })

  // Create product variants
  await prisma.productVariant.upsert({
    where: { id: 'variant-1' },
    update: {},
    create: {
      id: 'variant-1',
      color: 'Black',
      image: '/images/products/product-1-bg-1.png',
      size: 'M',
      isDefault: true,
      productId: product1.id,
    },
  })

  await prisma.productVariant.upsert({
    where: { id: 'variant-2' },
    update: {},
    create: {
      id: 'variant-2',
      color: 'White',
      image: '/images/products/product-1-bg-2.png',
      size: 'L',
      isDefault: false,
      productId: product1.id,
    },
  })

  // Create product tags
  await prisma.productTag.upsert({
    where: { id: 'tag-1' },
    update: {},
    create: {
      id: 'tag-1',
      tag: 'Wireless',
      productId: product1.id,
    },
  })

  await prisma.productTag.upsert({
    where: { id: 'tag-2' },
    update: {},
    create: {
      id: 'tag-2',
      tag: 'Noise Cancellation',
      productId: product1.id,
    },
  })

  // Create hero banners
  await prisma.heroBanner.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      bannerName: 'Summer Sale',
      bannerImage: '/images/hero/hero-01.png',
      slug: 'summer-sale',
      productId: product1.id,
    },
  })

  // Create countdown
  await prisma.countdown.upsert({
    where: { id: 'countdown-1' },
    update: {},
    create: {
      id: 'countdown-1',
      title: 'Flash Sale',
      image: '/images/countdown/countdown-01.png',
      subtitle: 'Limited Time Offer',
      date: '2024-12-31T23:59:59Z',
      productId: product1.id,
    },
  })

  const categories = [
    {
      title: 'Smartphones',
      slug: 'smartphones',
      image: '/images/categories/categories-01.png',
      description: 'Latest and greatest smartphones.',
    },
    {
      title: 'Laptops',
      slug: 'laptops',
      image: '/images/categories/categories-02.png',
      description: 'High performance laptops for work and play.',
    },
    {
      title: 'Headphones',
      slug: 'headphones',
      image: '/images/categories/categories-03.png',
      description: 'Noise-cancelling and wireless headphones.',
    },
    {
      title: 'Wearables',
      slug: 'wearables',
      image: '/images/categories/categories-04.png',
      description: 'Smartwatches and fitness trackers.',
    },
    {
      title: 'Cameras',
      slug: 'cameras',
      image: '/images/categories/categories-05.png',
      description: 'DSLRs, mirrorless, and action cameras.',
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const allCategories = await prisma.category.findMany();

  for (const cat of allCategories) {
    await prisma.product.create({
      data: {
        title: `Sample Product for ${cat.title}`,
        slug: `sample-product-${cat.slug}`,
        shortDescription: `This is a sample product for ${cat.title}`,
        description: `Detailed description for ${cat.title}`,
        price: 99.99,
        discountedPrice: 79.99,
        quantity: 10,
        sku: `SKU-${cat.slug}`,
        categoryId: cat.id,
      },
    });
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
