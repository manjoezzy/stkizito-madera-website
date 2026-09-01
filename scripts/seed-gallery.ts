import { db } from '../src/lib/db';

async function seedGallery() {
  const items = [
    {
      title: 'Workshop Training Session',
      description: 'Students practicing electrical installation skills in our fully equipped workshop.',
      imageUrl: '/images/gallery-workshop.png',
      category: 'campus',
      eventDate: '2025-06-15',
      isPublished: true,
    },
    {
      title: 'Graduation Ceremony 2025',
      description: 'Celebrating the graduating class of 2025 with pride and joy.',
      imageUrl: '/images/gallery-graduation2.png',
      category: 'graduation',
      eventDate: '2025-05-20',
      isPublished: true,
    },
    {
      title: 'Community Outreach - Construction',
      description: 'Students giving back to the community through construction outreach in Soroti.',
      imageUrl: '/images/gallery-community.png',
      category: 'outreach',
      eventDate: '2025-04-10',
      isPublished: true,
    },
    {
      title: 'Campus Grounds',
      description: 'A view of our serene campus located in Soroti City, Eastern Uganda.',
      imageUrl: '/images/gallery-campus2.png',
      category: 'campus',
      eventDate: '2025-03-01',
      isPublished: true,
    },
    {
      title: 'Open Day Celebrations',
      description: 'Prospective students and parents visiting during our annual open day event.',
      imageUrl: '/images/gallery-openday.png',
      category: 'openday',
      eventDate: '2025-02-14',
      isPublished: true,
    },
    {
      title: 'Sports Day',
      description: 'Students competing in various sports during the annual inter-house sports day.',
      imageUrl: '/images/gallery-sports.png',
      category: 'sports',
      eventDate: '2025-01-25',
      isPublished: true,
    },
    {
      title: 'Community Outreach - Health',
      description: 'Students participating in a community health awareness outreach program.',
      imageUrl: '/images/gallery-outreach.png',
      category: 'outreach',
      eventDate: '2024-11-15',
      isPublished: true,
    },
    {
      title: 'Campus Life',
      description: 'Daily life at St. Kizito\'s Technical Institute - Madera, Soroti City.',
      imageUrl: '/images/campus.png',
      category: 'campus',
      eventDate: '2024-10-05',
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

seedGallery().catch(console.error);
