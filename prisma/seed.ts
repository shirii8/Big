import { PrismaClient, Category } from '@prisma/client'

const prisma = new PrismaClient()

const UPPERS = [
  { id: 'u-001', name: 'NEON VAPOR',     category: Category.SNEAKERS, price: 6400, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151261/WhatsApp_Image_2026-04-01_at_02.28.39_1_bqptrs.jpg' },
  { id: 'u-002', name: 'CARBON SHIELD',  category: Category.SNEAKERS, price: 8200, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151261/WhatsApp_Image_2026-04-01_at_02.28.39_yrd7i8.jpg' },
  { id: 'u-003', name: 'ARCTIC MINT',    category: Category.CASUAL,   price: 5900, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151260/WhatsApp_Image_2026-04-01_at_02.28.39_2_nbdalk.jpg' },
  { id: 'u-004', name: 'DESERT PHANTOM', category: Category.SNEAKERS, price: 7100, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151260/WhatsApp_Image_2026-04-01_at_02.28.40_kgvxv4.jpg' },
  { id: 'u-005', name: 'ONYX GRID',      category: Category.SPORTS,   price: 6800, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151260/WhatsApp_Image_2026-04-01_at_02.28.41_trc3nv.jpg' },
  { id: 'u-006', name: 'COBALT CORE',    category: Category.CASUAL,   price: 5500, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151260/WhatsApp_Image_2026-04-01_at_02.28.40_2_k1xiwk.jpg' },
  { id: 'u-007', name: 'LAVA SHELL',     category: Category.SPORTS,   price: 7900, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151259/WhatsApp_Image_2026-04-01_at_02.28.41_2_ekqxok.jpg' },
  { id: 'u-008', name: 'IRON MESH',      category: Category.SNEAKERS, price: 8500, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151259/WhatsApp_Image_2026-04-01_at_02.28.41_1_qc3d2i.jpg' },
  { id: 'u-009', name: 'GHOST WHITE',    category: Category.CASUAL,   price: 6200, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.42_3_rchhdv.jpg' },
  { id: 'u-010', name: 'FOREST TRACKER', category: Category.SNEAKERS, price: 7400, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.43_1_fvxhqe.jpg' },
  { id: 'u-011', name: 'CYBER PULSE',    category: Category.SPORTS,   price: 8800, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.42_mhygsi.jpg' },
  { id: 'u-012', name: 'VINTAGE SLAB',   category: Category.CASUAL,   price: 5200, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.42_1_byhuzb.jpg' },
  { id: 'u-013', name: 'NIGHT RAID',     category: Category.SNEAKERS, price: 9200, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.43_uggnck.jpg' },
  { id: 'u-014', name: 'ZENITH BLUE',    category: Category.SPORTS,   price: 6900, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151261/WhatsApp_Image_2026-04-01_at_02.28.39_yrd7i8.jpg' },
  { id: 'u-015', name: 'STORM BREAKER',  category: Category.SNEAKERS, price: 8400, image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151260/WhatsApp_Image_2026-04-01_at_02.28.39_2_nbdalk.jpg' },
]

const SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']

async function main() {
  console.log('Seeding products...')

  for (const upper of UPPERS) {
    // Upsert product — safe to re-run
    const product = await prisma.product.upsert({
      where: { id: upper.id },
      update: { name: upper.name, category: upper.category, image: upper.image },
      create: {
        id: upper.id,
        name: upper.name,
        description: '',
        category: upper.category,
        image: upper.image,
      },
    })

    // Create one variant per size
    for (const size of SIZES) {
      await prisma.productVariant.upsert({
        where: { productId_size: { productId: product.id, size } },
        update: { price: upper.price, stock: 50 },
        create: {
          productId: product.id,
          size,
          price: upper.price,
          stock: 50,
        },
      })
    }

    console.log(`✓ ${upper.name}`)
  }

  console.log('Done.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())