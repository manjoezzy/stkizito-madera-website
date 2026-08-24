const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  console.log('Seeding gallery items and events...\n');

  // === Gallery Items ===

  // Presidential Launch photos (category: 'openday')
  const galleryItems = await db.galleryItem.createMany({
    data: [
      {
        title: "Presidential Launch of New Administration and Workshops",
        description:
          "His Excellency the President of Uganda officially launched the new administration block and modern vocational workshops at St. Kizito's Technical Institute, Madera on March 4, 2013. The ceremony was attended by government officials, education leaders, and the community.",
        imageUrl: "/uploads/gallery/presidential-launch-1.jpg",
        category: "openday",
        eventDate: "2013-03-04",
        isPublished: true,
      },
      {
        title: "Presidential Launch - Ceremony Proceedings",
        description:
          "The Presidential launch ceremony brought together dignitaries from across Uganda to witness the commissioning of new infrastructure aimed at advancing technical and vocational education in the Teso sub-region.",
        imageUrl: "/uploads/gallery/presidential-launch-2.jpg",
        category: "openday",
        eventDate: "2013-03-04",
        isPublished: true,
      },
      {
        title: "Presidential Launch - Workshop Tour",
        description:
          "During the launch, the President toured the newly constructed workshops equipped with modern tools for electrical installation, plumbing, building construction, and automotive mechanics training.",
        imageUrl: "/uploads/gallery/presidential-launch-3.jpg",
        category: "openday",
        eventDate: "2013-03-04",
        isPublished: true,
      },
      {
        title: "Presidential Launch - Community Gathering",
        description:
          "Hundreds of community members, students, and well-wishers gathered at St. Kizito's Technical Institute to witness this historic occasion marking a new chapter in technical education for Madera and the greater Soroti region.",
        imageUrl: "/uploads/gallery/presidential-launch-4.jpg",
        category: "openday",
        eventDate: "2013-03-04",
        isPublished: true,
      },
    ],
  });
  console.log(`Created ${galleryItems.count} presidential launch gallery items`);

  // Practical class photos (category: 'academic')
  const practicalPhotos = await db.galleryItem.createMany({
    data: [
      {
        title: "Electrical Installation Class - Practical Examinations",
        description:
          "Students undertaking practical examinations in the Electrical Installation department, demonstrating their skills in wiring, circuit installation, and electrical safety standards.",
        imageUrl: "/uploads/gallery/electrical-practical-exams.jpeg",
        category: "academic",
        isPublished: true,
      },
      {
        title: "Plumbing Class - Practical Training",
        description:
          "Plumbing students during hands-on practical sessions, learning pipe fitting, water system installation, and sanitation fixtures as part of their vocational training programme.",
        imageUrl: "/uploads/gallery/plumbing-practical.jpeg",
        category: "academic",
        isPublished: true,
      },
    ],
  });
  console.log(
    `Created ${practicalPhotos.count} practical class gallery items`
  );

  // Other photos
  const otherPhotos = await db.galleryItem.createMany({
    data: [
      {
        title: "Games and Sports Day",
        description:
          "Students participating in inter-departmental games and sports competitions, fostering teamwork, physical fitness, and healthy competition among the student body.",
        imageUrl: "/uploads/gallery/games-sports.jpeg",
        category: "sports",
        isPublished: true,
      },
      {
        title: "Madera Campus View",
        description:
          "A scenic view of the St. Kizito's Technical Institute campus in Madera, Soroti City, showcasing the institute's serene learning environment and well-maintained grounds.",
        imageUrl: "/uploads/gallery/madera-campus-4.jpg",
        category: "campus",
        isPublished: true,
      },
    ],
  });
  console.log(`Created ${otherPhotos.count} other gallery items`);

  // === Events ===

  const presidentialLaunchEvent = await db.event.create({
    data: {
      title:
        "Presidential Launch of New Administration and Workshops",
      description:
        "On March 4, 2013, His Excellency the President of the Republic of Uganda officially commissioned the new administration block and state-of-the-art vocational workshops at St. Kizito's Technical Institute, Madera. This historic event marked a significant milestone in the institute's commitment to delivering quality technical and vocational education and training (TVET) in the Teso sub-region. The newly launched facilities included modern workshops for electrical installation, plumbing, building construction, and automotive mechanics, equipped with industry-standard tools and equipment. The ceremony was attended by senior government officials, Members of Parliament, education stakeholders, religious leaders, and the local community. In his remarks, the President emphasized the importance of practical skills development in driving Uganda's economic growth and creating employment opportunities for the youth. The launch also included the unveiling of a plaque, guided tours of the new facilities, and cultural performances by students.",
      category: "openday",
      eventDate: "2013-03-04",
      eventTime: "10:00",
      location:
        "St. Kizito's Technical Institute, Madera - Soroti City",
      bannerUrl: "/uploads/gallery/presidential-launch-1.jpg",
      isPublished: true,
    },
  });
  console.log(
    `Created event: ${presidentialLaunchEvent.title} (id: ${presidentialLaunchEvent.id})`
  );

  const practicalExamsEvent = await db.event.create({
    data: {
      title: "Student Practical Examinations",
      description:
        "Students from various departments including Electrical Installation and Plumbing undertake their practical examinations. These hands-on assessments test the competencies students have acquired throughout their training, ensuring they meet the standards set by the Directorate of Industrial Training (DIT) and the Ministry of Education and Sports.",
      category: "academic",
      isPublished: true,
    },
  });
  console.log(
    `Created event: ${practicalExamsEvent.title} (id: ${practicalExamsEvent.id})`
  );

  const sportsDayEvent = await db.event.create({
    data: {
      title: "Inter-Departmental Games and Sports Day",
      description:
        "An exciting day of competitive sports and games featuring students from all departments. Activities include football, volleyball, athletics, and various indoor games. The annual sports day promotes physical fitness, teamwork, and camaraderie among students.",
      category: "campus",
      isPublished: true,
    },
  });
  console.log(
    `Created event: ${sportsDayEvent.title} (id: ${sportsDayEvent.id})`
  );

  console.log(
    '\nSeeding complete! Total: 8 gallery items, 3 events.'
  );
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
