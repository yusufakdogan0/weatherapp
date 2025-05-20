import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@gmail.com' }
        });

        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        // Create admin user
        const admin = await prisma.user.create({
            data: {
                email: 'admin@gmail.com',
                password: hashedPassword,
                name: 'admin',
                role: 'ADMIN'
            }
        });
        
        console.log('Admin created successfully:', {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role
        });
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();