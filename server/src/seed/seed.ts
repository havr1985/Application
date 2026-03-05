import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import * as argon2 from 'argon2';
import {
  VisibilityEvent,
  Event,
} from '../modules/events/entities/event.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
});

async function seed() {
  await AppDataSource.initialize();
  console.log('📦 Database connected\n');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const userRepo = queryRunner.manager.getRepository(User);
    const eventRepo = queryRunner.manager.getRepository(Event);

    // Check if data already exists
    const existingUsers = await userRepo.count();
    if (existingUsers > 0) {
      console.log('⏭️  Seed data already exists, skipping...');
      await queryRunner.commitTransaction();
      return;
    }

    // ==========================================
    // USERS
    // ==========================================
    const hashedPassword = await argon2.hash('password123');
    console.log('🔑 Password for all users: password123');

    const users = await userRepo.save([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
      },
    ]);

    console.log(`✅ Users: ${users.length} created`);

    // ==========================================
    // EVENTS
    // ==========================================
    const now = new Date();

    const events = await eventRepo.save([
      {
        title: 'Tech Conference 2026',
        description:
          'Annual technology conference featuring the latest innovations in AI and machine learning. Join industry leaders for keynotes, workshops, and networking opportunities.',
        dateTime: new Date(now.getFullYear(), now.getMonth() + 1, 15, 9, 0),
        location: 'Convention Center, San Francisco',
        capacity: 500,
        visibility: VisibilityEvent.PUBLIC,
        organizer: users[0],
        participants: [users[1]],
      },
      {
        title: 'Community Networking Meetup',
        description:
          'Connect with local professionals and expand your network. Casual atmosphere with drinks and snacks provided. Great opportunity to meet like-minded people.',
        dateTime: new Date(now.getFullYear(), now.getMonth() + 1, 20, 18, 30),
        location: 'Downtown Coffee Shop',
        capacity: 30,
        visibility: VisibilityEvent.PUBLIC,
        organizer: users[1],
        participants: [users[0]],
      },
      {
        title: 'Design Workshop',
        description:
          'Hands-on workshop covering modern UI/UX design principles. Bring your laptop and get ready to create stunning interfaces using the latest design tools.',
        dateTime: new Date(now.getFullYear(), now.getMonth() + 1, 25, 14, 0),
        location: 'Creative Space Studio',
        capacity: 20,
        visibility: VisibilityEvent.PUBLIC,
        organizer: users[0],
        participants: [],
      },
    ]);

    console.log(`✅ Events: ${events.length} created`);

    // ==========================================
    // COMMIT
    // ==========================================
    await queryRunner.commitTransaction();
    console.log('\n🎉 Seed completed successfully!');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('\n❌ Seed failed:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

seed();
