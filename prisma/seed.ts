import { PrismaClient, Category } from '../generated/prisma'

const prisma = new PrismaClient()

// ─── Data Source from your constants ───
const PRODUCTS_DATA = [
  { id: "u-001", name: "TANGELO", category: Category.ARC, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/TANGELO_kz90o7.jpg" },
  { id: "u-002", name: "SAKURA", category: Category.ARC, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/SAKURA_fbjawt.jpg" },
  { id: "u-003", name: "OMNITRIX", category: Category.ARC, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/v1775707205/OMNITRIX_k953ys.jpg" },
  { id: "u-004", name: "SAHARA", category: Category.ARC, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/SAHARA_dptugl.jpg" },
  { id: "u-005", name: "IKKA", category: Category.ARC, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/IKKA_pyj8fg.jpg" },
  { id: "u-006", name: "EUPHORIA", category: Category.CARVE, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/EUPHORIA_f5msvc.jpg" },
  { id: "u-007", name: "BRENJAM", category: Category.CARVE, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/BRENJAM_gqdppm.jpg" },
  { id: "u-008", name: "BISKOFF", category: Category.CARVE, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/BISKOFF_snz1bk.jpg" },
  { id: "u-009", name: "GLACIER", category: Category.TANGENT, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/GLACIER_xwrp5m.jpg" },
  { id: "u-010", name: "HAYFIELD", category: Category.TANGENT, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/HAYFIELD_wvwwgk.jpg" },
  { id: "u-011", name: "JADE", category: Category.TANGENT, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/JADE_fwkjt9.jpg" },
  { id: "u-012", name: "RASPUTEEN", category: Category.TANGENT, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/RASPUTEEN_qdxrcd.jpg" },
  { id: "u-013", name: "VOLCANO", category: Category.CARVE, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/VOLCANO_hmavs4.jpg" },
  { id: "u-014", name: "PECADO", category: Category.TANGENT, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/PECADO_bsnwke.jpg" },
  { id: "u-015", name: "WASABI", category: Category.CARVE, price: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/WASABI_cnfms9.jpg" },
]

const SIZES = ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']

async function main() {
  console.log('--- RESETTING_ARCHIVE ---')
  
  // Optional: Clean existing data if you want a fresh start
  // await prisma.productVariant.deleteMany({})
  // await prisma.product.deleteMany({})

  for (const item of PRODUCTS_DATA) {
    // 1. Sync Base Product
    const product = await prisma.product.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        category: item.category,
        image: item.image,
      },
      create: {
        id: item.id,
        name: item.name,
        category: item.category,
        image: item.image,
        description: `TESSCH Modular Upper: ${item.name}. Engineered for the ${item.category} series.`,
      },
    })

    // 2. Sync All 7 Sizes (UK 5 to UK 11)
    for (const size of SIZES) {
      await prisma.productVariant.upsert({
        where: {
          productId_size: {
            productId: product.id,
            size: size,
          },
        },
        update: {
          price: item.price,
          stock: 40, // Matching your FOUNDATION_STOCK
        },
        create: {
          productId: product.id,
          size: size,
          price: item.price,
          stock: 40,
        },
      })
    }
    console.log(`SYNCED >> ${item.name} [${item.category}]`)
  }

  console.log('--- ARCHIVE_SYNC_COMPLETE ---')
}

main()
  .catch((e) => {
    console.error('SYNC_ERROR:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })