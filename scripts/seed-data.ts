import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const { hashSync } = await import('bcrypt-ts');
  
  const existingAdmin = await db.admin.findUnique({ where: { email: 'admin@stkizitos.edu' } });
  if (!existingAdmin) {
    await db.admin.create({
      data: { email: 'admin@stkizitos.edu', password: hashSync('admin123', 10), name: 'System Administrator', role: 'super-admin' },
    });
    console.log('Admin seeded');
  }

  const programmes = ['Building Construction', 'Automotive Mechanics', 'Electrical Installation', 'Plumbing', 'Welding', 'Fashion and Design'];
  const fees: Record<string, number> = { 'Building Construction': 850000, 'Automotive Mechanics': 900000, 'Electrical Installation': 850000, 'Plumbing': 800000, 'Welding': 850000, 'Fashion and Design': 750000 };
  const names = ['James Otim', 'Grace Akello', 'Simon Peter Elobu', 'Sarah Achieng', 'Emmanuel Okello', 'Phoebe Asio', 'David Ochen', 'Helen Apio', 'Robert Mukasa', 'Dinah Amongin', 'Francis Odongo', 'Mary Lalam', 'John Omoding', 'Esther Ikomol', 'Patrick Okello'];
  const districts = ['Soroti', 'Kumi', 'Kaberamaido', 'Amuria', 'Katakwi', 'Pallisa', 'Mbale', 'Jinja', 'Kampala', 'Lira'];
  const qualifications = ['UCE', 'PLE', 'UACE', 'UCE', 'UCE', 'PLE', 'UACE', 'UCE', 'UCE', 'PLE'];
  const statuses = ['pending', 'pending', 'approved', 'approved', 'enrolled', 'rejected', 'pending', 'approved', 'enrolled', 'enrolled', 'pending', 'approved', 'enrolled', 'pending', 'rejected'];

  for (let i = 0; i < 15; i++) {
    const prog = programmes[i % programmes.length];
    const status = statuses[i];
    const seq = Math.floor(Math.random() * 90000) + 10000;
    const ref = `SKT-2025-${seq}`;
    const fee = fees[prog];
    const isPaid = status === 'enrolled' || (status === 'approved' && i % 2 === 0);
    const phone = `07${Math.floor(Math.random() * 90000000 + 10000000)}`;

    const app = await db.admissionApplication.create({
      data: {
        referenceNumber: ref, fullName: names[i], gender: i % 3 === 0 ? 'Female' : 'Male', nationality: 'Ugandan',
        phone, email: `${names[i].toLowerCase().replace(/\s/g, '.')}@gmail.com`,
        district: districts[i % districts.length], address: `${districts[i % districts.length]} Town`,
        nextOfKin: `Parent of ${names[i]}`, nextOfKinPhone: phone,
        qualification: qualifications[i], programme: prog, intakeYear: '2025',
        paymentStatus: isPaid ? 'paid' : 'pending', paymentAmount: fee, paymentMethod: isPaid ? 'schoolpay' : null,
        paidAt: isPaid ? new Date(Date.now() - Math.random() * 30 * 86400000) : null, status,
        lastSchool: `${districts[i % districts.length]} Secondary School`, yearCompleted: String(2020 + (i % 5)),
      },
    });

    if (isPaid) {
      const txRef = `SPY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await db.payment.create({
        data: { transactionRef: txRef, applicationRef: ref, fullName: names[i], phone, email: app.email, amount: fee, status: 'successful', paymentMethod: 'schoolpay', schoolpayTxRef: txRef, schoolpayStatus: 'successful' },
      });
    }

    if (status === 'enrolled') {
      await db.student.create({
        data: { studentNumber: `SKT/2025/${Math.floor(Math.random() * 90000) + 10000}`, applicationId: app.id, fullName: names[i], phone, email: app.email, programme: prog, intakeYear: '2025' },
      });
    }
  }
  console.log('15 applications seeded');

  const events = [
    { title: 'Reporting & Orientation 2025', description: 'New student reporting and orientation for 2025 academic year', category: 'academic', eventDate: '2025-09-01', eventTime: '08:00 AM', location: 'Main Hall' },
    { title: 'Skills Exhibition 2025', description: 'Annual exhibition showcasing student projects from all departments', category: 'showcase', eventDate: '2025-10-15', eventTime: '10:00 AM', location: 'Workshop Grounds' },
    { title: 'End of Term Assessments', description: 'Practical and theory assessments for Term 1', category: 'assessment', eventDate: '2025-11-20', eventTime: '09:00 AM', location: 'Examination Halls' },
    { title: 'Community Outreach Day', description: 'Students give back to the community through service projects', category: 'campus', eventDate: '2025-12-05', eventTime: '08:30 AM', location: 'Madera Village' },
  ];
  for (const ev of events) {
    await db.event.create({ data: { ...ev, isPublished: true } });
  }
  console.log('4 events seeded');

  const msgs = [
    { name: 'John Mukisa', email: 'john.m@gmail.com', phone: '0771234567', subject: 'Admission Inquiry', message: 'I would like to know the admission requirements for the electrical installation programme.' },
    { name: 'Sarah Anyango', email: 'sarah.a@outlook.com', phone: '0782345678', subject: 'Fee Structure', message: 'Could you please send me the fee structure for all certificate programmes?' },
    { name: 'Peter Ojok', email: 'peter.ojok@yahoo.com', phone: '0753456789', subject: 'Application Status', message: 'I applied two weeks ago. My reference number is SKT-2025-45678. Can I check my status?' },
  ];
  for (const m of msgs) {
    await db.contactMessage.create({ data: { ...m } });
  }
  console.log('3 messages seeded');
  console.log('Demo data seeded successfully!');
}

main().catch(console.error).finally(() => db.$disconnect());
