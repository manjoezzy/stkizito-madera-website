import { db } from '../src/lib/db';

async function seed() {
  const items = [
    {
      title: 'Electrical Department Workshop',
      description: 'Students practicing hands-on electrical installation in our well-equipped workshop.',
      imageUrl: '/images/electrical-workshop.jpg',
      category: 'campus',
      eventDate: '2025-07-10',
      isPublished: true,
    },
    {
      title: 'Administration Block',
      description: 'Front view of the administration building at St. Kizito\'s Technical Institute - Madera.',
      imageUrl: '/images/admin-building.jpg',
      category: 'campus',
      eventDate: '2025-06-01',
      isPublished: true,
    },
    {
      title: 'Institute Bus',
      description: 'The institute transport bus used for student field trips and community outreach programmes.',
      imageUrl: '/images/institute-bus.jpg',
      category: 'general',
      eventDate: '2025-05-15',
      isPublished: true,
    },
  ];

  for (const item of items) {
    const existing = await db.galleryItem.findFirst({ where: { title: item.title } });
    if (!existing) {
      await db.galleryItem.create({ data: item });
      console.log(`✓ Created: ${item.title}`);
    } else {
      console.log(`- Exists: ${item.title}`);
    }
  }

  const total = await db.galleryItem.count();
  console.log(`\nGallery now has ${total} items.`);
  await db.$disconnect();
}

seed().catch(console.error);
