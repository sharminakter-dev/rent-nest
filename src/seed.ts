import { PrismaClient, Role, UserStatus, RentalStatus, PaymentStatus } from "@prisma/client";
// import process from "node:process";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // =========================================================
  // 1. CLEAR EXISTING DATA
  // =========================================================

  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.rentalRequest.deleteMany();
  await prisma.property.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️ Existing data cleared.");

  // =========================================================
  // 2. PASSWORD
  // =========================================================

  const hashedPassword = await bcrypt.hash("12345", 10);

  // =========================================================
  // 3. USERS
  // =========================================================

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
      phone: "01700000001",
      address: "Dhaka",
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const landlord1 = await prisma.user.create({
    data: {
      name: "John",
      email: "john@test.com",
      password: hashedPassword,
      phone: "01700000002",
      address: "Gulshan, Dhaka",
      role: Role.LANDLORD,
      status: UserStatus.ACTIVE,
    },
  });

  const landlord2 = await prisma.user.create({
    data: {
      name: "Michael",
      email: "michael@test.com",
      password: hashedPassword,
      phone: "01700000003",
      address: "Banani, Dhaka",
      role: Role.LANDLORD,
      status: UserStatus.ACTIVE,
    },
  });

  const tenant1 = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@test.com",
      password: hashedPassword,
      phone: "01700000004",
      address: "Dhanmondi, Dhaka",
      role: Role.TENANT,
      status: UserStatus.ACTIVE,
    },
  });

  const tenant2 = await prisma.user.create({
    data: {
      name: "Emma",
      email: "emma@test.com",
      password: hashedPassword,
      phone: "01700000005",
      address: "Uttara, Dhaka",
      role: Role.TENANT,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("👤 Users created.");

  // =========================================================
  // 4. PROFILES
  // =========================================================

  await prisma.profile.createMany({
    data: [
      {
        userId: admin.id,
        bio: "RentNest administrator.",
      },
      {
        userId: landlord1.id,
        bio: "Property owner offering comfortable homes for rent.",
      },
      {
        userId: landlord2.id,
        bio: "Experienced landlord with properties across Dhaka.",
      },
      {
        userId: tenant1.id,
        bio: "Looking for a comfortable apartment in Dhaka.",
      },
      {
        userId: tenant2.id,
        bio: "Looking for a modern family-friendly home.",
      },
    ],
  });

  console.log("👤 Profiles created.");

  // =========================================================
  // 5. CATEGORIES
  // =========================================================

  const apartment = await prisma.category.create({
    data: {
      name: "Apartment",
      slug: "apartment",
      description: "Modern apartments for individuals and families.",
    },
  });

  const house = await prisma.category.create({
    data: {
      name: "House",
      slug: "house",
      description: "Standalone houses suitable for families.",
    },
  });

  const studio = await prisma.category.create({
    data: {
      name: "Studio",
      slug: "studio",
      description: "Compact studio properties for single tenants.",
    },
  });

  const luxury = await prisma.category.create({
    data: {
      name: "Luxury",
      slug: "luxury",
      description: "Premium and luxury rental properties.",
    },
  });

  const family = await prisma.category.create({
    data: {
      name: "Family Home",
      slug: "family-home",
      description: "Spacious properties suitable for families.",
    },
  });

  console.log("🏠 Categories created.");

  // =========================================================
  // 6. PROPERTIES
  // =========================================================

  const propertiesData = [
    {
      title: "Modern 3 Bedroom Apartment",
      description:
        "A spacious modern apartment with excellent natural light and comfortable living spaces.",
      image: "/images/properties/property-1.jpg",
      location: "Gulshan, Dhaka",
      bedrooms: 3,
      bathrooms: 2,
      rent: 45000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord1.id,
      categoryId: apartment.id,
    },
    {
      title: "Luxury Family Apartment",
      description:
        "A beautifully designed family apartment located in a peaceful residential area.",
      image: "/images/properties/property-2.jpg",
      location: "Banani, Dhaka",
      bedrooms: 3,
      bathrooms: 3,
      rent: 60000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord2.id,
      categoryId: luxury.id,
    },
    {
      title: "Cozy 2 Bedroom Apartment",
      description:
        "A comfortable apartment suitable for a small family or working professionals.",
      image: "/images/properties/property-3.jpg",
      location: "Dhanmondi, Dhaka",
      bedrooms: 2,
      bathrooms: 2,
      rent: 30000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord1.id,
      categoryId: apartment.id,
    },
    {
      title: "Spacious Family House",
      description:
        "A large family home with spacious bedrooms and a comfortable living room.",
      image: "/images/properties/property-4.jpg",
      location: "Uttara, Dhaka",
      bedrooms: 4,
      bathrooms: 3,
      rent: 50000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord2.id,
      categoryId: family.id,
    },
    {
      title: "Elegant City Apartment",
      description:
        "An elegant apartment with modern facilities and convenient access to the city.",
      image: "/images/properties/property-5.jpg",
      location: "Mirpur, Dhaka",
      bedrooms: 3,
      bathrooms: 2,
      rent: 28000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord1.id,
      categoryId: apartment.id,
    },
    {
      title: "Bright 2 Bedroom Flat",
      description:
        "A bright and airy apartment with two bedrooms and a well-equipped kitchen.",
      image: "/images/properties/property-6.jpg",
      location: "Mohammadpur, Dhaka",
      bedrooms: 2,
      bathrooms: 2,
      rent: 26000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord2.id,
      categoryId: apartment.id,
    },
    {
      title: "Premium Apartment Near University",
      description:
        "A premium apartment in a convenient location, ideal for students and families.",
      image: "/images/properties/property-7.jpg",
      location: "Bashundhara, Dhaka",
      bedrooms: 3,
      bathrooms: 2,
      rent: 42000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord1.id,
      categoryId: luxury.id,
    },
    {
      title: "Comfortable Studio Apartment",
      description:
        "A compact studio apartment designed for comfortable single-person living.",
      image: "/images/properties/property-8.jpg",
      location: "Agrabad, Chattogram",
      bedrooms: 1,
      bathrooms: 1,
      rent: 18000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord2.id,
      categoryId: studio.id,
    },
    {
      title: "Sea View Apartment",
      description:
        "A beautiful apartment with a relaxing view and spacious living area.",
      image: "/images/properties/property-9.jpg",
      location: "Cox's Bazar",
      bedrooms: 2,
      bathrooms: 2,
      rent: 35000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord1.id,
      categoryId: apartment.id,
    },
    {
      title: "Modern Chattogram Apartment",
      description:
        "A modern apartment with comfortable bedrooms and excellent city access.",
      image: "/images/properties/property-10.jpg",
      location: "Khulshi, Chattogram",
      bedrooms: 3,
      bathrooms: 2,
      rent: 32000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord2.id,
      categoryId: apartment.id,
    },
    {
      title: "Affordable Family Flat",
      description:
        "An affordable family-friendly apartment in a quiet residential neighborhood.",
      image: "/images/properties/property-11.jpg",
      location: "Panchlaish, Chattogram",
      bedrooms: 3,
      bathrooms: 2,
      rent: 25000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord1.id,
      categoryId: family.id,
    },
    {
      title: "Luxury Penthouse",
      description:
        "A premium penthouse featuring spacious rooms and modern interior design.",
      image: "/images/properties/property-12.jpg",
      location: "Gulshan, Dhaka",
      bedrooms: 4,
      bathrooms: 4,
      rent: 85000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord2.id,
      categoryId: luxury.id,
    },
    {
      title: "Quiet 1 Bedroom Apartment",
      description:
        "A peaceful one-bedroom apartment suitable for a single tenant or couple.",
      image: "/images/properties/property-13.jpg",
      location: "Wari, Dhaka",
      bedrooms: 1,
      bathrooms: 1,
      rent: 15000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord1.id,
      categoryId: apartment.id,
    },
    {
      title: "Large 4 Bedroom Family Apartment",
      description:
        "A spacious apartment with four bedrooms and multiple bathrooms.",
      image: "/images/properties/property-14.jpg",
      location: "Uttara, Dhaka",
      bedrooms: 4,
      bathrooms: 3,
      rent: 55000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord2.id,
      categoryId: family.id,
    },
    {
      title: "Affordable Student Apartment",
      description:
        "A simple and affordable apartment located close to universities and transport.",
      image: "/images/properties/property-15.jpg",
      location: "Dhanmondi, Dhaka",
      bedrooms: 2,
      bathrooms: 1,
      rent: 20000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord1.id,
      categoryId: apartment.id,
    },
    {
      title: "Modern Executive Apartment",
      description:
        "A stylish apartment designed for professionals who want comfortable city living.",
      image: "/images/properties/property-16.jpg",
      location: "Banani, Dhaka",
      bedrooms: 2,
      bathrooms: 2,
      rent: 48000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord2.id,
      categoryId: luxury.id,
    },
    {
      title: "Peaceful Residential House",
      description:
        "A spacious house located in a quiet residential neighborhood.",
      image: "/images/properties/property-17.jpg",
      location: "Nasirabad, Chattogram",
      bedrooms: 4,
      bathrooms: 3,
      rent: 40000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord1.id,
      categoryId: house.id,
    },
    {
      title: "Compact City Flat",
      description:
        "A practical apartment with all the essential facilities for comfortable living.",
      image: "/images/properties/property-18.jpg",
      location: "Motijheel, Dhaka",
      bedrooms: 2,
      bathrooms: 1,
      rent: 22000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord2.id,
      categoryId: apartment.id,
    },
    {
      title: "Premium Family Residence",
      description:
        "A premium residence with spacious rooms and high-quality finishes.",
      image: "/images/properties/property-19.jpg",
      location: "Baridhara, Dhaka",
      bedrooms: 4,
      bathrooms: 4,
      rent: 75000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord1.id,
      categoryId: luxury.id,
    },
    {
      title: "Cozy Couple Apartment",
      description:
        "A cozy two-bedroom apartment perfect for couples or small families.",
      image: "/images/properties/property-20.jpg",
      location: "Khilgaon, Dhaka",
      bedrooms: 2,
      bathrooms: 2,
      rent: 24000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord2.id,
      categoryId: apartment.id,
    },
    {
      title: "Riverside Apartment",
      description:
        "A peaceful apartment offering a relaxing environment away from busy streets.",
      image: "/images/properties/property-21.jpg",
      location: "Sylhet",
      bedrooms: 3,
      bathrooms: 2,
      rent: 27000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord1.id,
      categoryId: apartment.id,
    },
    {
      title: "Elegant 3 Bedroom Home",
      description:
        "A beautifully maintained home with spacious bedrooms and comfortable common areas.",
      image: "/images/properties/property-22.jpg",
      location: "Rajshahi",
      bedrooms: 3,
      bathrooms: 2,
      rent: 23000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord2.id,
      categoryId: house.id,
    },
    {
      title: "Modern Bachelor Apartment",
      description:
        "A modern apartment suitable for professionals and students.",
      image: "/images/properties/property-23.jpg",
      location: "Bashundhara, Dhaka",
      bedrooms: 1,
      bathrooms: 1,
      rent: 17000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord1.id,
      categoryId: studio.id,
    },
    {
      title: "Luxury 3 Bedroom Residence",
      description:
        "A luxurious residence with modern facilities and spacious interiors.",
      image: "/images/properties/property-24.jpg",
      location: "Khulshi, Chattogram",
      bedrooms: 3,
      bathrooms: 3,
      rent: 50000,
      isAvailable: true,
      isFeatured: true,
      landlordId: landlord2.id,
      categoryId: luxury.id,
    },
    {
      title: "Spacious Budget Apartment",
      description:
        "A spacious and affordable apartment suitable for a family.",
      image: "/images/properties/property-25.jpg",
      location: "Halishahar, Chattogram",
      bedrooms: 3,
      bathrooms: 2,
      rent: 22000,
      isAvailable: true,
      isFeatured: false,
      landlordId: landlord1.id,
      categoryId: family.id,
    },
  ];

  const properties = [];

  for (const property of propertiesData) {
    const createdProperty = await prisma.property.create({
      data: property,
    });

    properties.push(createdProperty);
  }

  console.log(`🏠 ${properties.length} properties created.`);

  // =========================================================
  // 7. RENTAL REQUESTS
  // =========================================================

  // const rental1 = await prisma.rentalRequest.create({
  //   data: {
  //     message: "I am interested in renting this apartment.",
  //     startDate: new Date("2026-09-01"),
  //     durationMonths: 12,
  //     status: RentalStatus.APPROVED,
  //     propertyId: properties[0].id,
  //     tenantId: tenant1.id,
  //   },
  // });

  // const rental2 = await prisma.rentalRequest.create({
  //   data: {
  //     message: "I would like to rent this property for my family.",
  //     startDate: new Date("2026-09-15"),
  //     durationMonths: 12,
  //     status: RentalStatus.ACTIVE,
  //     propertyId: properties[1].id,
  //     tenantId: tenant2.id,
  //   },
  // });

  // const rental3 = await prisma.rentalRequest.create({
  //   data: {
  //     message: "Is this apartment still available?",
  //     startDate: new Date("2026-10-01"),
  //     durationMonths: 6,
  //     status: RentalStatus.PENDING,
  //     propertyId: properties[2].id,
  //     tenantId: tenant1.id,
  //   },
  // });

  // const rental4 = await prisma.rentalRequest.create({
  //   data: {
  //     message: "I would like to rent this property.",
  //     startDate: new Date("2026-09-20"),
  //     durationMonths: 12,
  //     status: RentalStatus.REJECTED,
  //     propertyId: properties[4].id,
  //     tenantId: tenant2.id,
  //   },
  // });

  // const rental5 = await prisma.rentalRequest.create({
  //   data: {
  //     message: "Looking for a long-term family home.",
  //     startDate: new Date("2026-08-01"),
  //     durationMonths: 12,
  //     status: RentalStatus.COMPLETED,
  //     propertyId: properties[8].id,
  //     tenantId: tenant1.id,
  //   },
  // });

  // console.log("Rental requests created.");

  // =========================================================
  // 8. PAYMENTS
  // =========================================================

  // await prisma.payment.create({
  //   data: {
  //     transactionId: "TXN-10001",
  //     amount: properties[0].rent,
  //     paidAt: new Date(),
  //     status: PaymentStatus.SUCCESS,
  //     rentalRequestId: rental1.id,
  //     tenantId: tenant1.id,
  //     landlordId: landlord1.id,
  //   },
  // });

  // await prisma.payment.create({
  //   data: {
  //     transactionId: "TXN-10002",
  //     amount: properties[1].rent,
  //     paidAt: new Date(),
  //     status: PaymentStatus.SUCCESS,
  //     rentalRequestId: rental2.id,
  //     tenantId: tenant2.id,
  //     landlordId: landlord2.id,
  //   },
  // });

  // await prisma.payment.create({
  //   data: {
  //     transactionId: "TXN-10003",
  //     amount: properties[8].rent,
  //     paidAt: new Date("2026-08-01"),
  //     status: PaymentStatus.SUCCESS,
  //     rentalRequestId: rental5.id,
  //     tenantId: tenant1.id,
  //     landlordId: landlord1.id,
  //   },
  // });

  // console.log("Payments created.");

  // =========================================================
  // 9. REVIEWS
  // =========================================================

  // await prisma.review.create({
  //   data: {
  //     rating: 5,
  //     comment:
  //       "Excellent apartment. The property was clean, spacious and exactly as described.",
  //     tenantId: tenant1.id,
  //     propertyId: properties[0].id,
  //     rentalRequestId: rental1.id,
  //   },
  // });

  // await prisma.review.create({
  //   data: {
  //     rating: 4,
  //     comment:
  //       "Very comfortable property in a great location. The landlord was helpful.",
  //     tenantId: tenant1.id,
  //     propertyId: properties[8].id,
  //     rentalRequestId: rental5.id,
  //   },
  // });

  // console.log("Reviews created.");

  // =========================================================
  // 10. SUMMARY
  // =========================================================

  console.log("");
  console.log("====================================");
  console.log("DATABASE SEED COMPLETED");
  console.log("====================================");
  console.log(`Users: ${5}`);
  console.log(`Categories: ${5}`);
  console.log(`Properties: ${properties.length}`);
  // console.log(`Rental Requests: ${5}`);
  // console.log(`Payments: ${3}`);
  // console.log(`Reviews: ${2}`);
  console.log("====================================");
  console.log("");
  console.log("LOGIN USERS");
  console.log("------------------------------------");
  console.log("Admin    : admin@test.com");
  console.log("Landlord : john@test.com");
  console.log("Landlord : michael@test.com");
  console.log("Tenant   : alice@test.com");
  console.log("Tenant   : emma@test.com");
  console.log("------------------------------------");
  console.log("Password : 12345");
  console.log("====================================");
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });