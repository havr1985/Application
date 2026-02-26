import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import * as argon2 from 'argon2';
import {
  VisibilityEvent,
  Event,
} from '../modules/events/entities/event.entity';
import { AppDataSource } from '../../data-source';

const main = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected');

    await runSeed(AppDataSource);

    await AppDataSource.destroy();
    console.log('📦 Database connection closed');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

main();

export const runSeed = async (dataSource: DataSource): Promise<void> => {
  console.log('🌱 Seeding started...\n');
  const userRepository = dataSource.getRepository(User);
  const eventRepository = dataSource.getRepository(Event);

  // Check if data already exists
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('⏭️  Seed data already exists, skipping...');
    return;
  }

  console.log('🌱 Seeding database...');

  // --- Users ---
  const hashedPassword = await argon2.hash('password123');

  const user1 = userRepository.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: hashedPassword,
  });

  const user2 = userRepository.create({
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: hashedPassword,
  });

  const [savedUser1, savedUser2] = await userRepository.save([user1, user2]);

  console.log('✅ Users seeded: john@example.com, jane@example.com');
  console.log('   Password for both: password123');

  // --- Events ---
  const now = new Date();

  const event1 = eventRepository.create({
    title: 'Tech Conference 2026',
    description:
      'Annual technology conference featuring the latest innovations in AI and machine learning. Join industry leaders for keynotes, workshops, and networking opportunities.',
    dateTime: new Date(now.getFullYear(), now.getMonth() + 1, 15, 9, 0),
    location: 'Convention Center, San Francisco',
    capacity: 500,
    visibility: VisibilityEvent.PUBLIC,
    organizer: savedUser1,
    participants: [savedUser2],
  });

  const event2 = eventRepository.create({
    title: 'Community Networking Meetup',
    description:
      'Connect with local professionals and expand your network. Casual atmosphere with drinks and snacks provided. Great opportunity to meet like-minded people.',
    dateTime: new Date(now.getFullYear(), now.getMonth() + 1, 20, 18, 30),
    location: 'Downtown Coffee Shop',
    capacity: 30,
    visibility: VisibilityEvent.PUBLIC,
    organizer: savedUser2,
    participants: [savedUser1],
  });

  const event3 = eventRepository.create({
    title: 'Design Workshop',
    description:
      'Hands-on workshop covering modern UI/UX design principles. Bring your laptop and get ready to create stunning interfaces using the latest design tools.',
    dateTime: new Date(now.getFullYear(), now.getMonth() + 1, 25, 14, 0),
    location: 'Creative Space Studio',
    capacity: 20,
    visibility: VisibilityEvent.PUBLIC,
    organizer: savedUser1,
    participants: [],
  });

  await eventRepository.save([event1, event2, event3]);

  console.log('✅ Events seeded: 3 public events');
  console.log('');
  console.log('🎉 Seed completed successfully!');
};
