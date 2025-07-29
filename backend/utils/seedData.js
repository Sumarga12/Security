// utils/seedData.js
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const User = require('../models/User');

const services = [
  {
    id: 'hc1',
    category: 'General Cleaning',
    name: 'General House Cleaning',
    price: 2000,
    description: 'Thorough cleaning of all rooms, dusting, vacuuming, mopping, and surface sanitization.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hc2',
    category: 'Kitchen',
    name: 'Kitchen Deep Cleaning',
    price: 2500,
    description: 'Deep cleaning of countertops, appliances, cabinets, sinks, and floors for a sparkling kitchen.',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hc3',
    category: 'Bathroom',
    name: 'Bathroom Cleaning',
    price: 1800,
    description: 'Disinfection and scrubbing of toilets, showers, sinks, mirrors, and tiles.',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hc4',
    category: 'Carpet & Upholstery',
    name: 'Carpet & Upholstery Cleaning',
    price: 3000,
    description: 'Professional cleaning and stain removal for carpets, rugs, and upholstered furniture.',
    imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hc5',
    category: 'Windows',
    name: 'Window & Glass Cleaning',
    price: 1200,
    description: 'Streak-free cleaning of windows, glass doors, and mirrors.',
    imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hc6',
    category: 'Move-In/Move-Out',
    name: 'Move-In/Move-Out Cleaning',
    price: 3500,
    description: 'Comprehensive cleaning for homes before moving in or after moving out.',
    imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hc7',
    category: 'Sofa & Mattress',
    name: 'Sofa & Mattress Cleaning',
    price: 2200,
    description: 'Deep cleaning and sanitization of sofas and mattresses to remove dust and allergens.',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hc8',
    category: 'Outdoor',
    name: 'Balcony & Outdoor Area Cleaning',
    price: 1600,
    description: 'Sweeping, washing, and tidying up balconies, patios, and outdoor spaces.',
    imageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd8?auto=format&fit=crop&w=800&q=80'
  }
];

const testimonials = [
  {
    name: 'Priya Sharma',
    quote: 'I booked a deep cleaning for my apartment and was amazed at the results. The team was punctual, professional, and left my home spotless!',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Rahul Verma',
    quote: 'The kitchen cleaning service was fantastic. Every corner was sparkling clean, and the staff was very friendly.',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Sita Karki',
    quote: 'I highly recommend their move-out cleaning. It made getting my security deposit back so much easier!',
    imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
  {
    name: 'Amit Joshi',
    quote: 'The bathroom cleaning was thorough and left everything smelling fresh. Will definitely use this service again.',
    imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg'
  },
  {
    name: 'Meena Thapa',
    quote: 'My carpets and sofa look brand new after their cleaning service. Great attention to detail!',
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

const seedData = async () => {
  try {
    // Clear existing data
    await Service.deleteMany({});
    await Testimonial.deleteMany({});

    // Insert services
    await Service.insertMany(services);
    console.log('✅ Services seeded successfully');

    // Insert testimonials
    await Testimonial.insertMany(testimonials);
    console.log('✅ Testimonials seeded successfully');

    // Create default admin user if not exists
    const adminEmail = 'admin@homeglam.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: 'admin123'
      });
      console.log('✅ Admin user created successfully');
    }

    console.log('🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

module.exports = seedData; 
module.exports = seedData; 