const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes mounting
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/seo', require('./routes/seo'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cms', require('./routes/cms'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/payments', require('./routes/payments'));

// Basic health check route
app.get('/', (req, res) => {
  res.send('Cleannes Home Cleaning API is running...');
});

// Seed data function to prepopulate database if empty
const seedDatabase = async () => {
  try {
    const User = require('./models/User');
    const Service = require('./models/Service');
    const Blog = require('./models/Blog');
    const Review = require('./models/Review');
    const SEO = require('./models/SEO');

    // 1. Seed Users
    const userCount = await User.countDocuments();
    let seededAdmin, seededCustomer;
    if (userCount === 0) {
      console.log('Seeding initial users...');
      seededAdmin = await User.create({
        name: 'Cleannes Admin',
        email: 'admin@cleannes.com',
        password: 'admin123',
        role: 'admin'
      });
      seededCustomer = await User.create({
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'user123',
        role: 'customer'
      });
      console.log('Users seeded! Admin: admin@cleannes.com (admin123), Customer: john@gmail.com (user123)');
    } else {
      seededAdmin = await User.findOne({ role: 'admin' });
      seededCustomer = await User.findOne({ role: 'customer' });
    }

    // 2. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('Seeding initial services...');
      const services = [
        {
          name: 'Regular Domestic Cleaning',
          description: 'Basic cleaning tasks in homes such as dusting, vacuuming, mopping floors, cleaning bathrooms, and kitchens.',
          price: 11999,
          category: 'Deep Cleaning',
          subcategory: 'Home Residential Cleaning',
          features: [
            'We Don\'t Cut Corners, We Clean Them',
            'Dusting & vacuuming bedrooms/living rooms',
            'Mopping floors and wiping down surfaces',
            'Cleaning bathroom counters, toilets, and showers',
            'Washing kitchen counters, sink, and exterior appliances'
          ],
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop'
        },
        {
          name: 'Carpet & Upholstery Cleaning',
          description: 'Recover 100% of your rental deposit with our expert carpet cleaning agents. We supply all materials with eco-friendly sanitizing.',
          price: 23999,
          category: 'Deep Cleaning',
          subcategory: 'Sofa & Carpet Cleaning',
          features: [
            'Hot water extraction treatment',
            'Stain removal and deodorizing',
            'Sanitization & allergen extraction',
            'Safe for pets and children'
          ],
          image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=600&auto=format&fit=crop'
        },
        {
          name: 'Office Cleaning Solutions',
          description: 'Ensure a clean, hygienic, and productive workplace with our professional commercial deep cleaning team.',
          price: 34999,
          category: 'Deep Cleaning',
          subcategory: 'Office Cleaning',
          features: [
            'Sanitization of workstations & keyboard items',
            'Disinfection of communal pantry and restrooms',
            'Trash collection & recyclables sorting',
            'Glass divider and window cleaning'
          ],
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop'
        },
        {
          name: 'Villa Deep Cleaning',
          description: 'Premium, detailed cleanup for large luxury properties, including hard-to-reach spaces and detailed appliance sanitization.',
          price: 49999,
          category: 'Deep Cleaning',
          subcategory: 'Villas Cleaning',
          features: [
            'High ceiling dusting and light fixture detailing',
            'Intensive bathroom lime scale removal',
            'Inside cabinets, ovens, and fridge cleaning',
            'Pressure washing balconies and driveways'
          ],
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop'
        },
        {
          name: 'Bed Bugs Thermal Treatment',
          description: 'Complete eradication of bed bugs from your mattresses, sofas, and carpets using safe thermal heat processes.',
          price: 19999,
          category: 'Pest Control',
          subcategory: 'Bed Bugs Control',
          features: [
            'Inspection of mattress seams & headboards',
            'High-pressure steam extermination',
            'Residual treatment barrier protection',
            'Free follow-up inspection in 14 days'
          ],
          image: 'https://images.unsplash.com/photo-1587349913856-3b9045fc06ba?q=80&w=600&auto=format&fit=crop'
        },
        {
          name: 'Termite Protection barrier',
          description: 'Long-term sub-soil chemical treatment to protect your property foundation from destructive wood termites.',
          price: 39999,
          category: 'Pest Control',
          subcategory: 'Termite Control',
          features: [
            'Soil drilling & termiticide injection',
            'Wall perimeter barrier sealing',
            '5-year structural warranty certificate',
            'Safe, non-odor chemicals'
          ],
          image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop'
        }
      ];

      await Service.create(services);
      console.log('Services seeded!');
    }

    // 3. Seed Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('Seeding initial blogs...');
      const blogs = [
        {
          title: '5 Simple Steps to Keep Your Home Dust-Free Daily',
          content: 'Keeping your house dust-free requires a systematic approach. First, understand where dust accumulates: carpets, curtains, and high shelving. Start by shaking out fabrics outside, then work your way top-to-bottom. Vacuum using a HEPA filter to catch micro-particles, and use microfiber cloths that hold dirt rather than redistributing it. Finally, consider implementing a shoes-off policy at the front door to prevent outdoor allergens from entering your home...',
          category: 'Cleaning Tips',
          tags: ['dust-free', 'housework', 'hygiene'],
          author: 'Brooklyn Simmons',
          seoTitle: 'How to Keep Home Dust Free - Cleannes',
          seoDescription: 'Discover the top 5 steps to maintain a clean, dust-free residential home. Microfiber cloths, HEPA filters, and daily routines analyzed.',
          seoKeywords: 'dusting tips, home cleanliness, how to dust, clean house',
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop'
        },
        {
          title: 'Why Professional Deep Cleaning Wins Over DIY',
          content: 'While regular sweeping and wiping are important, professional deep cleaning addresses micro-bacterial build-up in vents, grout lines, and behind appliances. Specialized heavy-duty tools like hot-water extractors, vapor steam cleansers, and industrial HEPA systems can lift grime that standard household chemicals simply cannot touch. Investing in professional cleaners twice a year extends the lifespan of your fixtures, carpets, and upholstery, saving thousands of dollars in the long run...',
          category: 'Industry News',
          tags: ['deep clean', 'professional services', 'grime removal'],
          author: 'Cleannes Experts',
          seoTitle: 'DIY vs Professional Deep Cleaning - Cleannes',
          seoDescription: 'Why hire professional cleaning services? Explore the scientific benefits of sanitization, allergen extraction, and heavy machinery.',
          seoKeywords: 'deep cleaning, professional cleaning, DIY cleaning comparison',
          image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=600&auto=format&fit=crop'
        },
        {
          title: 'Common Household Pests and How to Deal with Them',
          content: 'Pests like termites, bed bugs, and cockroaches thrive in hidden dark areas. Early detection is key to avoiding structural and health damage. In this guide, we detail how to inspect damp pipe lines, kitchen drawer joints, and drywall corners for signs of infestation. Learn standard sealing techniques, moisture removal practices, and when it is absolutely necessary to call certified pest exterminators to handle chemical controls safely...',
          category: 'Pest Control',
          tags: ['bugs', 'termites', 'home defense'],
          author: 'Certified Exterminators',
          seoTitle: 'Household Pest Identification and Solutions - Cleannes',
          seoDescription: 'Learn how to detect termites, bed bugs, and rodents early, apply home defense solutions, and arrange professional pest control.',
          seoKeywords: 'pest control, bed bugs, termite control, house inspection',
          image: 'https://images.unsplash.com/photo-1587349913856-3b9045fc06ba?q=80&w=600&auto=format&fit=crop'
        }
      ];

      await Blog.create(blogs);
      console.log('Blogs seeded!');
    }

    // 4. Seed Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0 && seededCustomer) {
      console.log('Seeding initial reviews...');
      const firstService = await Service.findOne();
      const reviews = [
        {
          user: seededCustomer._id,
          rating: 5,
          comment: 'Outstanding job! Cleannes arrived exactly on time and worked tirelessly to clean our 3-bedroom apartment. The bathrooms look completely brand new. I will definitely be booking again next month!',
          service: firstService ? firstService._id : null,
          status: 'Approved',
          isFeatured: true
        },
        {
          user: seededCustomer._id,
          rating: 4,
          comment: 'We booked the Sofa and Carpet Cleaning. The agents removed red wine stains that had been there for six months. Highly professional and friendly service.',
          service: firstService ? firstService._id : null,
          status: 'Approved',
          isFeatured: true
        }
      ];

      await Review.create(reviews);
      console.log('Reviews seeded!');
    }

    // 5. Seed default Page SEO
    const seoCount = await SEO.countDocuments();
    if (seoCount === 0) {
      console.log('Seeding initial SEO tags...');
      const seoTags = [
        {
          page: 'home',
          title: 'Cleannes | Professional Home Cleaning & Pest Control Services',
          description: 'Welcome to Cleannes. We provide outstanding residential, commercial, villa, and upholstery cleaning, alongside licensed pest control.',
          keywords: 'cleaning service, home cleaning, pest control, villa cleaning, cleannes'
        },
        {
          page: 'about',
          title: 'About Cleannes | Our Mission to Provide Spotless Living Spaces',
          description: 'Learn about Cleannes founders, our eco-friendly cleaning standards, certified cleaning agents, and why we are Hawaii\'s top rated service.',
          keywords: 'cleannes team, cleaning company history, eco cleaning'
        },
        {
          page: 'services',
          title: 'Our Cleaning Services & Pricing plans - Cleannes',
          description: 'Browse our standard deep cleaning, carpet cleaning, office sanitization, bed bug thermal heat treatments, and customized pricing packages.',
          keywords: 'cleaning prices, booking sofa wash, bedbug exterminator'
        },
        {
          page: 'blog',
          title: 'Latest Cleaning Guides, Tips & Pest Controls - Cleannes Blog',
          description: 'Stay updated with expert tips on sanitization, keeping your living room dust free, and preventing household insect infestations.',
          keywords: 'cleaning blog, pest control advice, dusting tips'
        }
      ];

      await SEO.create(seoTags);
      console.log('SEO tags seeded!');
    }

    // 6. Seed Categories
    const Category = require('./models/Category');
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('Seeding initial categories...');
      const categories = [
        {
          name: 'Deep Cleaning',
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600',
          isActive: true,
          subcategories: [
            { name: 'Home Residential Cleaning', isActive: true },
            { name: 'Office Cleaning', isActive: true },
            { name: 'Villas Cleaning', isActive: true },
            { name: 'Apartments Cleaning', isActive: true },
            { name: 'Sofa & Carpet Cleaning', isActive: true }
          ]
        },
        {
          name: 'Pest Control',
          image: 'https://images.unsplash.com/photo-1587349913856-3b9045fc06ba?q=80&w=600',
          isActive: true,
          subcategories: [
            { name: 'General Pest Control', isActive: true },
            { name: 'Termite Control', isActive: true },
            { name: 'Bed Bugs Control', isActive: true }
          ]
        }
      ];
      await Category.create(categories);
      console.log('Categories seeded!');
    }

    // 7. Seed CMS content
    const CMS = require('./models/CMS');
    const cmsCount = await CMS.countDocuments();
    if (cmsCount === 0) {
      console.log('Seeding initial CMS sections...');
      
      // Hero section CMS
      await CMS.create({
        section: 'hero',
        data: {
          badge: 'BEST CLEANING SERVICE IN TOWN',
          title: 'Professional Home & Office Cleaning Services',
          subtitle: 'Recover 100% of your sanity and deposit with our expert cleaning agents. We supply all eco-friendly sanitizing materials.',
          buttonText: 'BOOK SERVICE NOW',
          phone: '+91 98765 43210',
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200'
        }
      });

      // About section CMS
      await CMS.create({
        section: 'about',
        data: {
          badge: 'ABOUT OUR COMPANY',
          title: 'We Are Professional House Cleaners & Disinfectors',
          description: 'Cleannes is built on the foundation of spotless details. Since our inception in Hawaii, we have completed over 1,500+ deep cleans. Our teams are certified, vetted, background checked, and fully insured, ensuring high standards.',
          features: [
            '100% Safe Eco-Friendly Chemicals',
            'Vetted & Background Checked Crew',
            'Full Liability Insurance Covered',
            'Satisfaction Guarantee (72h Free Redo)'
          ],
          experienceYears: '12+',
          experienceText: 'Years of Spotless Quality Services'
        }
      });

      // Footer CMS
      await CMS.create({
        section: 'footer',
        data: {
          description: 'Cleannes India \'s leading residential and commercial cleaning provider. Certified eco-friendly chemicals, professional machines. Serving Mumbai, Delhi, Bangalore & more.',
          copyright: '© 2026 Cleannes Services India Pvt. Ltd. All Rights Reserved.',
          address: 'Koramangala, Bengaluru, Karnataka 560034',
          phone: '+91 98765 43210',
          email: 'support@cleannes.in'
        }
      });

      console.log('CMS sections seeded!');
    }

    // 8. Seed global settings
    const Settings = require('./models/Settings');
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      console.log('Seeding initial settings...');
      
      await Settings.create({
        key: 'business_info',
        value: {
          name: 'Cleannes Cleaning Services India Pvt. Ltd.',
          phone: '+91 98765 43210',
          email: 'support@cleannes.in',
          address: 'Koramangala, Bengaluru, Karnataka 560034'
        }
      });

      await Settings.create({
        key: 'gateway_keys',
        value: {
          stripePublicKey: 'pk_test_mock_stripe_public_key_123',
          stripeSecretKey: 'sk_test_mock_stripe_secret_key_123',
          razorpayKeyId: 'rzp_test_mock_razorpay_key_123',
          razorpayKeySecret: 'rzp_sec_mock_razorpay_secret_123',
          sandboxMode: true
        }
      });

      await Settings.create({
        key: 'features',
        value: {
          enableStripe: true,
          enableRazorpay: false,
          enableCashOnDelivery: true,
          enableSMSNotifications: false,
          enableBlogSystem: true
        }
      });

      console.log('Settings seeded!');
    }

  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
};

// Listen on MongoDB connection to trigger seed
const mongoose = require('mongoose');
mongoose.connection.once('open', () => {
  seedDatabase();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in mode on port ${PORT}`);
});
