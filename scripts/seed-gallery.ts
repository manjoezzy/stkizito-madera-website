import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  // Check if gallery items already exist
  const count = await db.galleryItem.count();
  if (count > 0) {
    console.log(`Gallery already has ${count} items. Skipping seed.`);
    return;
  }

  const items = [
    {
      title: 'Campus Grounds',
      description: 'Aerial view of the St. Kizito\'s Technical Institute - Madera campus in Soroti City.',
      imageUrl: '/images/campus.png',
      category: 'campus',
      eventDate: '2024-06-15',
      isPublished: true,
    },
    {
      title: 'Graduation Ceremony 2024',
      description: 'Graduates celebrate their achievement at the annual graduation ceremony.',
      imageUrl: '/images/graduation.png',
      category: 'graduation',
      eventDate: '2024-11-20',
      isPublished: true,
    },
    {
      title: 'Open Day Celebrations',
      description: 'Students and parents explore our facilities during the annual open day event.',
      imageUrl: '/images/gallery-openday.png',
      category: 'openday',
      eventDate: '2024-03-10',
      isPublished: true,
    },
    {
      title: 'Community Outreach Programme',
      description: 'Our students giving back to the community through practical skills outreach in Soroti.',
      imageUrl: '/images/gallery-outreach.png',
      category: 'outreach',
      eventDate: '2024-09-05',
      isPublished: true,
    },
    {
      title: 'Inter-School Sports Day',
      description: 'Students compete in various sports during the annual inter-school athletics competition.',
      imageUrl: '/images/gallery-sports.png',
      category: 'sports',
      eventDate: '2024-07-22',
      isPublished: true,
    },
    {
      title: 'Workshop Training Session',
      description: 'Hands-on practical training in the building construction workshop.',
      imageUrl: '/images/about-workshop.png',
      category: 'campus',
      eventDate: '2024-05-18',
      isPublished: true,
    },
  ];

  for (const item of items) {
    await db.galleryItem.create({ data: item });
  }

  console.log(`Seeded ${items.length} gallery items.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
