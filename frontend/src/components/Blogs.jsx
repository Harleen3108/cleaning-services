import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fallbackBlogs = [
    {
      _id: '1',
      title: '5 Simple Steps to Keep Your Home Dust-Free Daily',
      content: 'Keeping your house dust-free requires a systematic approach. First, understand where dust accumulates: carpets, curtains, and high shelving. Start by shaking out fabrics outside, then work your way top-to-bottom. Vacuum using a HEPA filter to catch micro-particles, and use microfiber cloths that hold dirt rather than redistributing it. Finally, consider implementing a shoes-off policy at the front door to prevent outdoor allergens from entering your home. Cleaning daily with these tips will drastically improve indoor air quality and make your home sparkling clean.',
      category: 'Cleaning Tips',
      tags: ['dust-free', 'housework', 'hygiene'],
      author: 'Brooklyn Simmons',
      seoTitle: 'How to Keep Home Dust Free - Cleannes',
      seoDescription: 'Discover the top 5 steps to maintain a clean, dust-free residential home. Microfiber cloths, HEPA filters, and daily routines analyzed.',
      seoKeywords: 'dusting tips, home cleanliness, how to dust, clean house',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Why Professional Deep Cleaning Wins Over DIY',
      content: 'While regular sweeping and wiping are important, professional deep cleaning addresses micro-bacterial build-up in vents, grout lines, and behind appliances. Specialized heavy-duty tools like hot-water extractors, vapor steam cleansers, and industrial HEPA systems can lift grime that standard household chemicals simply cannot touch. Investing in professional cleaners twice a year extends the lifespan of your fixtures, carpets, and upholstery, saving thousands of dollars in the long run. Professional cleaning ensures sanitization and germ-free spaces.',
      category: 'Industry News',
      tags: ['deep clean', 'professional services', 'grime removal'],
      author: 'Cleannes Experts',
      seoTitle: 'DIY vs Professional Deep Cleaning - Cleannes',
      seoDescription: 'Why hire professional cleaning services? Explore the scientific benefits of sanitization, allergen extraction, and heavy machinery.',
      seoKeywords: 'deep cleaning, professional cleaning, DIY cleaning comparison',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      title: 'Common Household Pests and How to Deal with Them',
      content: 'Pests like termites, bed bugs, and cockroaches thrive in hidden dark areas. Early detection is key to avoiding structural and health damage. In this guide, we detail how to inspect damp pipe lines, kitchen drawer joints, and drywall corners for signs of infestation. Learn standard sealing techniques, moisture removal practices, and when it is absolutely necessary to call certified pest exterminators to handle chemical controls safely. Protect your home and villa layout from structural ruin.',
      category: 'Pest Control',
      tags: ['bugs', 'termites', 'home defense'],
      author: 'Certified Exterminators',
      seoTitle: 'Household Pest Identification and Solutions - Cleannes',
      seoDescription: 'Learn how to detect termites, bed bugs, and rodents early, apply home defense solutions, and arrange professional pest control.',
      seoKeywords: 'pest control, bed bugs, termite control, house inspection',
      image: 'https://images.unsplash.com/photo-1587349913856-3b9045fc06ba?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await apiCall('/blogs');
        if (res.success && res.data.length > 0) {
          setBlogs(res.data);
        } else {
          setBlogs(fallbackBlogs);
        }
      } catch (err) {
        console.error('Failed to load blogs, displaying fallbacks', err);
        setBlogs(fallbackBlogs);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const handleSelectBlog = (blog) => {
    setSelectedBlogId(blog._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // SEO Meta Tags Dynamic Update
    if (blog.seoTitle) {
      document.title = blog.seoTitle;
    } else {
      document.title = `${blog.title} | Cleannes Blog`;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && blog.seoDescription) {
      metaDescription.setAttribute('content', blog.seoDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && blog.seoKeywords) {
      metaKeywords.setAttribute('content', blog.seoKeywords);
    }
  };

  const handleBackToList = () => {
    setSelectedBlogId(null);
    document.title = 'Cleannes | Professional Home Cleaning & Pest Control Services';
  };

  const selectedBlog = blogs.find(b => b._id === selectedBlogId);

  if (loading) {
    return <div className="loading-state">Loading latest news articles...</div>;
  }

  return (
    <section className="blog-section" id="blog">
      <div className="container">
        {!selectedBlog ? (
          <>
            <div className="section-header text-center">
              <span className="section-label">LATEST NEWS & BLOG</span>
              <h2 className="section-title">Stay Updated with Our Cleaning Insights</h2>
            </div>

            {/* Blog Grid */}
            <div className="blog-grid">
              {blogs.map((blog) => (
                <article key={blog._id} className="blog-card" onClick={() => handleSelectBlog(blog)}>
                  <div className="blog-card-img-holder">
                    <img src={blog.image} alt={blog.title} />
                    <span className="blog-card-category">{blog.category}</span>
                  </div>
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      <span>
                        <Calendar size={14} />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        <User size={14} />
                        {blog.author}
                      </span>
                    </div>
                    <h3 className="blog-card-title">{blog.title}</h3>
                    <p className="blog-card-excerpt">
                      {blog.content.substring(0, 120)}...
                    </p>
                    <button className="blog-read-more-link">
                      READ MORE &gt;
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          /* Blog Detail View */
          <div className="blog-detail-container">
            <button className="blog-back-btn" onClick={handleBackToList}>
              <ArrowLeft size={16} /> <span>Back to Blog List</span>
            </button>

            <div className="blog-detail-header">
              <span className="blog-detail-category">{selectedBlog.category}</span>
              <h1 className="blog-detail-title">{selectedBlog.title}</h1>
              
              <div className="blog-detail-meta">
                <span>
                  <Calendar size={16} />
                  Posted on {new Date(selectedBlog.createdAt).toLocaleDateString()}
                </span>
                <span>
                  <User size={16} />
                  Written by {selectedBlog.author}
                </span>
              </div>
            </div>

            <div className="blog-detail-img-box">
              <img src={selectedBlog.image} alt={selectedBlog.title} className="blog-detail-img" />
            </div>

            <div className="blog-detail-body">
              {selectedBlog.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="blog-p">{paragraph}</p>
              ))}
            </div>

            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div className="blog-detail-tags">
                <Tag size={16} className="tag-icon" />
                <span className="tags-label">Tags:</span>
                {selectedBlog.tags.map((tag, i) => (
                  <span key={i} className="blog-tag-badge">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
