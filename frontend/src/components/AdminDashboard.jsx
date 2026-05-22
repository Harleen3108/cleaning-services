import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import { 
  BarChart, Users, Calendar, Settings, Tag, ShieldCheck, 
  MessageSquare, PlusCircle, Trash2, Edit, CheckCircle, XCircle,
  Bell, CreditCard, Eye, ShieldAlert, Check, X, Star, Layout, RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState(null);
  
  // Dynamic categories & subcategories states
  const [categories, setCategories] = useState([]);
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catSubs, setCatSubs] = useState('');
  const [catFile, setCatFile] = useState(null);
  const [editingCatId, setEditingCatId] = useState(null);

  // Services states
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceMinPrice, setServiceMinPrice] = useState('299');
  const [serviceMaxPrice, setServiceMaxPrice] = useState('499');
  const [serviceIsActive, setServiceIsActive] = useState(true);
  const [serviceCat, setServiceCat] = useState('');
  const [serviceSub, setServiceSub] = useState('');
  const [serviceFeatures, setServiceFeatures] = useState('');
  const [serviceImage, setServiceImage] = useState('');
  const [serviceFile, setServiceFile] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Bookings states
  const [bookings, setBookings] = useState([]);
  const [assigningStaffId, setAssigningStaffId] = useState(null);
  const [staffName, setStaffName] = useState('');
  const [disapprovingBookingId, setDisapprovingBookingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedBookingForMap, setSelectedBookingForMap] = useState(null);

  // Payments states
  const [payments, setPayments] = useState([]);
  const [paymentFilterStatus, setPaymentFilterStatus] = useState('');
  const [paymentFilterStart, setPaymentFilterStart] = useState('');
  const [paymentFilterEnd, setPaymentFilterEnd] = useState('');

  // Users states
  const [users, setUsers] = useState([]);
  const [viewingUserBookings, setViewingUserBookings] = useState(null);
  const [userBookingsList, setUserBookingsList] = useState([]);

  // Reviews states
  const [reviews, setReviews] = useState([]);

  // Blogs states
  const [blogs, setBlogs] = useState([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCat, setBlogCat] = useState('Cleaning Tips');
  const [blogTags, setBlogTags] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogSeoTitle, setBlogSeoTitle] = useState('');
  const [blogSeoDesc, setBlogSeoDesc] = useState('');
  const [blogSeoKeys, setBlogSeoKeys] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogFile, setBlogFile] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);

  // SEO Page state
  const [seoPage, setSeoPage] = useState('home');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // CMS Section State
  const [cmsSection, setCmsSection] = useState('hero');
  const [cmsData, setCmsData] = useState({});

  // Notifications State
  const [notifTargetUser, setNotifTargetUser] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState('general');

  // Settings State
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [enableStripe, setEnableStripe] = useState(true);
  const [enableCash, setEnableCash] = useState(true);

  // General States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      const res = await apiCall('/analytics/dashboard');
      if (res.success) setStats(res.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await apiCall('/categories');
      if (res.success) {
        setCategories(res.data);
        if (res.data.length > 0 && !serviceCat) {
          setServiceCat(res.data[0].name);
          if (res.data[0].subcategories.length > 0) {
            setServiceSub(res.data[0].subcategories[0].name);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadServices = async () => {
    try {
      const res = await apiCall('/services');
      if (res.success) setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBookings = async () => {
    try {
      const res = await apiCall('/bookings/admin');
      if (res.success) setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPayments = async () => {
    try {
      let queryStr = `?status=${paymentFilterStatus}`;
      if (paymentFilterStart) queryStr += `&startDate=${paymentFilterStart}`;
      if (paymentFilterEnd) queryStr += `&endDate=${paymentFilterEnd}`;
      
      const res = await apiCall(`/payments${queryStr}`);
      if (res.success) setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await apiCall('/reviews/admin');
      if (res.success) setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await apiCall('/auth/users');
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBlogs = async () => {
    try {
      const res = await apiCall('/blogs');
      if (res.success) setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSEO = async () => {
    try {
      const res = await apiCall(`/seo/${seoPage}`);
      if (res.success && res.data) {
        setSeoTitle(res.data.title || '');
        setSeoDesc(res.data.description || '');
        setSeoKeywords(res.data.keywords || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadCMS = async () => {
    try {
      const res = await apiCall(`/cms/${cmsSection}`);
      if (res.success && res.data) {
        setCmsData(res.data);
      } else {
        setCmsData({});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await apiCall('/settings');
      if (res.success && res.data) {
        const info = res.data.business_info || {};
        const keys = res.data.gateway_keys || {};
        const flags = res.data.features || {};

        setBusinessName(info.name || '');
        setBusinessPhone(info.phone || '');
        setBusinessEmail(info.email || '');
        setBusinessAddress(info.address || '');

        setStripePublicKey(keys.stripePublicKey || '');
        setStripeSecretKey(keys.stripeSecretKey || '');

        setEnableStripe(flags.enableStripe !== false);
        setEnableCash(flags.enableCashOnDelivery !== false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStats();
    loadCategories();
    loadServices();
    loadBookings();
    loadPayments();
    loadReviews();
    loadUsers();
    loadBlogs();
    loadSEO();
    loadCMS();
    loadSettings();
  }, []);

  useEffect(() => {
    loadSEO();
  }, [seoPage]);

  useEffect(() => {
    loadCMS();
  }, [cmsSection]);

  useEffect(() => {
    loadPayments();
  }, [paymentFilterStatus, paymentFilterStart, paymentFilterEnd]);

  useEffect(() => {
    if (selectedBookingForMap) {
      const timer = setTimeout(() => {
        const container = document.getElementById('admin-map-container');
        if (container && window.L) {
          const map = window.L.map(container).setView([selectedBookingForMap.latitude, selectedBookingForMap.longitude], 14);
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          window.L.marker([selectedBookingForMap.latitude, selectedBookingForMap.longitude]).addTo(map)
            .bindPopup(`<b>${selectedBookingForMap.name || 'Customer'}</b><br/>${selectedBookingForMap.formattedAddress}`)
            .openPopup();
          
          return () => {
            map.remove();
          };
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedBookingForMap]);

  // Handle Category submit
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      let res;
      if (catFile) {
        const formData = new FormData();
        formData.append('name', catName);
        formData.append('subcategories', catSubs);
        formData.append('image', catFile);
        
        if (editingCatId) {
          res = await apiCall(`/categories/${editingCatId}`, 'PUT', formData, true);
          setMessage('Category updated successfully');
        } else {
          res = await apiCall('/categories', 'POST', formData, true);
          setMessage('Category created successfully');
        }
      } else {
        const subList = catSubs.split(',').map(s => s.trim()).filter(s => s.length > 0);
        const payload = {
          name: catName,
          subcategories: subList,
          image: catImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600'
        };
        if (editingCatId) {
          res = await apiCall(`/categories/${editingCatId}`, 'PUT', payload);
          setMessage('Category updated successfully');
        } else {
          res = await apiCall('/categories', 'POST', payload);
          setMessage('Category created successfully');
        }
      }
      
      if (res.success) {
        setCatName('');
        setCatImage('');
        setCatSubs('');
        setCatFile(null);
        setEditingCatId(null);
        loadCategories();
      }
    } catch (err) {
      setError(err.message || 'Category operation failed');
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCatId(cat._id);
    setCatName(cat.name);
    setCatImage(cat.image || '');
    setCatSubs(cat.subcategories.map(s => s.name).join(', '));
    setCatFile(null);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiCall(`/categories/${id}`, 'DELETE');
      setMessage('Category deleted successfully');
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle service operations
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      let res;
      if (serviceFile) {
        const formData = new FormData();
        formData.append('name', serviceName);
        formData.append('description', serviceDesc);
        formData.append('minPrice', serviceMinPrice);
        formData.append('maxPrice', serviceMaxPrice);
        formData.append('isActive', serviceIsActive);
        formData.append('category', serviceCat);
        formData.append('subcategory', serviceSub);
        formData.append('features', serviceFeatures);
        formData.append('image', serviceFile);

        if (editingServiceId) {
          res = await apiCall(`/services/${editingServiceId}`, 'PUT', formData, true);
          setMessage('Service updated successfully');
        } else {
          res = await apiCall('/services', 'POST', formData, true);
          setMessage('Service created successfully');
        }
      } else {
        const payload = {
          name: serviceName,
          description: serviceDesc,
          minPrice: Number(serviceMinPrice),
          maxPrice: Number(serviceMaxPrice),
          isActive: serviceIsActive,
          category: serviceCat,
          subcategory: serviceSub,
          features: serviceFeatures.split(',').map(f => f.trim()),
          image: serviceImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600'
        };

        if (editingServiceId) {
          res = await apiCall(`/services/${editingServiceId}`, 'PUT', payload);
          setMessage('Service updated successfully');
        } else {
          res = await apiCall('/services', 'POST', payload);
          setMessage('Service created successfully');
        }
      }
      
      if (res.success) {
        setServiceName('');
        setServiceDesc('');
        setServicePrice('');
        setServiceMinPrice('299');
        setServiceMaxPrice('499');
        setServiceIsActive(true);
        setServiceFeatures('');
        setServiceImage('');
        setServiceFile(null);
        setEditingServiceId(null);
        loadServices();
        loadStats();
      }
    } catch (err) {
      setError(err.message || 'Service operation failed');
    }
  };

  const handleEditService = (service) => {
    setEditingServiceId(service._id);
    setServiceName(service.name);
    setServiceDesc(service.description);
    setServiceMinPrice(service.minPrice || service.price || 299);
    setServiceMaxPrice(service.maxPrice || Math.round((service.minPrice || service.price || 299) * 1.5) || 499);
    setServiceIsActive(service.isActive !== false);
    setServiceCat(service.category);
    setServiceSub(service.subcategory);
    setServiceFeatures(service.features ? service.features.join(', ') : '');
    setServiceImage(service.image || '');
    setServiceFile(null);
  };

  const handleToggleServiceActive = async (service) => {
    try {
      const currentActive = service.isActive !== false;
      const res = await apiCall(`/services/${service._id}`, 'PUT', { isActive: !currentActive });
      if (res.success) {
        setMessage(`Service status changed successfully.`);
        loadServices();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await apiCall(`/services/${id}`, 'DELETE');
      setMessage('Service deleted successfully');
      loadServices();
      loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle booking staff assignment and status updates
  const handleAssignStaffSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiCall(`/bookings/${assigningStaffId}/status`, 'PUT', { staff: staffName });
      if (res.success) {
        setMessage(`Staff '${staffName}' assigned successfully.`);
        setAssigningStaffId(null);
        setStaffName('');
        loadBookings();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateBookingStatus = async (id, status, statusReason = '') => {
    try {
      const res = await apiCall(`/bookings/${id}/status`, 'PUT', { status, statusReason });
      if (res.success) {
        setMessage(`Booking status updated to ${status}`);
        loadBookings();
        loadStats();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle user block status & delete
  const handleToggleUserBlock = async (id) => {
    try {
      const res = await apiCall(`/auth/users/${id}/block`, 'PUT');
      if (res.success) {
        setMessage('User block status toggled');
        loadUsers();
        loadStats();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? All bookings history will remain logged.')) return;
    try {
      await apiCall(`/auth/users/${id}`, 'DELETE');
      setMessage('User account permanently deleted.');
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewUserBookings = async (user) => {
    setViewingUserBookings(user);
    try {
      const res = await apiCall(`/auth/users/${user._id}/bookings`);
      if (res.success) {
        setUserBookingsList(res.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle reviews approvals
  const handleReviewStatus = async (id, status, isFeatured = false) => {
    try {
      const res = await apiCall(`/reviews/${id}/status`, 'PUT', { status, isFeatured });
      if (res.success) {
        setMessage('Review status updated successfully');
        loadReviews();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Blog creation
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      let res;
      if (blogFile) {
        const formData = new FormData();
        formData.append('title', blogTitle);
        formData.append('content', blogContent);
        formData.append('category', blogCat);
        formData.append('tags', blogTags);
        formData.append('author', blogAuthor || 'Cleannes Staff');
        formData.append('seoTitle', blogSeoTitle);
        formData.append('seoDescription', blogSeoDesc);
        formData.append('seoKeywords', blogSeoKeys);
        formData.append('image', blogFile);

        if (editingBlogId) {
          res = await apiCall(`/blogs/${editingBlogId}`, 'PUT', formData, true);
          setMessage('Blog post updated successfully');
        } else {
          res = await apiCall('/blogs', 'POST', formData, true);
          setMessage('Blog post published successfully');
        }
      } else {
        const payload = {
          title: blogTitle,
          content: blogContent,
          category: blogCat,
          tags: blogTags.split(',').map(t => t.trim()),
          author: blogAuthor || 'Cleannes Staff',
          seoTitle: blogSeoTitle,
          seoDescription: blogSeoDesc,
          seoKeywords: blogSeoKeys,
          image: blogImage || 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=600'
        };

        if (editingBlogId) {
          res = await apiCall(`/blogs/${editingBlogId}`, 'PUT', payload);
          setMessage('Blog post updated successfully');
        } else {
          res = await apiCall('/blogs', 'POST', payload);
          setMessage('Blog post published successfully');
        }
      }

      if (res.success) {
        setBlogTitle('');
        setBlogContent('');
        setBlogTags('');
        setBlogAuthor('');
        setBlogSeoTitle('');
        setBlogSeoDesc('');
        setBlogSeoKeys('');
        setBlogImage('');
        setBlogFile(null);
        setEditingBlogId(null);
        loadBlogs();
        loadStats();
      }
    } catch (err) {
      setError(err.message || 'Blog operation failed');
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogTitle(blog.title);
    setBlogContent(blog.content);
    setBlogCat(blog.category);
    setBlogTags(blog.tags ? blog.tags.join(', ') : '');
    setBlogAuthor(blog.author || '');
    setBlogSeoTitle(blog.seoTitle || '');
    setBlogSeoDesc(blog.seoDescription || '');
    setBlogSeoKeys(blog.seoKeywords || '');
    setBlogImage(blog.image || '');
    setBlogFile(null);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await apiCall(`/blogs/${id}`, 'DELETE');
      setMessage('Blog post deleted');
      loadBlogs();
      loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle SEO Updates
  const handleSEOSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await apiCall('/seo', 'POST', { page: seoPage, title: seoTitle, description: seoDesc, keywords: seoKeywords });
      if (res.success) {
        setMessage('SEO tags updated successfully');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle CMS Updates
  const handleCmsSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await apiCall('/cms', 'POST', { section: cmsSection, data: cmsData });
      if (res.success) {
        setMessage(`CMS Section '${cmsSection.toUpperCase()}' successfully saved.`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCmsDataChange = (key, value) => {
    setCmsData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Send Notification Alerts
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await apiCall('/notifications', 'POST', {
        user: notifTargetUser || null,
        title: notifTitle,
        message: notifMessage,
        type: notifType
      });
      if (res.success) {
        setMessage('Notification alert dispatched successfully.');
        setNotifTitle('');
        setNotifMessage('');
        setNotifTargetUser('');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Save Settings Panel
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await apiCall('/settings', 'POST', {
        key: 'business_info',
        value: { name: businessName, phone: businessPhone, email: businessEmail, address: businessAddress }
      });
      await apiCall('/settings', 'POST', {
        key: 'gateway_keys',
        value: { stripePublicKey, stripeSecretKey, sandboxMode: true }
      });
      await apiCall('/settings', 'POST', {
        key: 'features',
        value: { enableStripe, enableCashOnDelivery: enableCash }
      });
      setMessage('Global Settings and gateways keys updated successfully.');
      loadSettings();
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter dynamic subcategories when category changes
  const selectedCategoryObj = categories.find(c => c.name === serviceCat);
  const availableSubcategories = selectedCategoryObj ? selectedCategoryObj.subcategories : [];

  return (
    <section className="admin-section">
      <div className="admin-container">
        
        {/* Admin Navigation Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-profile-meta">
            <div className="admin-avatar">A</div>
            <div>
              <h3>Admin Console</h3>
              <p>Dynamic Manager</p>
            </div>
          </div>

          <nav className="admin-sidebar-nav">
            <button className={activeTab === 'analytics' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('analytics'); setMessage(''); setError(''); }}>
              <BarChart size={16} /> <span>Business Analytics</span>
            </button>
            <button className={activeTab === 'categories' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('categories'); setMessage(''); setError(''); }}>
              <Layout size={16} /> <span>Dynamic Categories</span>
            </button>
            <button className={activeTab === 'services' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('services'); setMessage(''); setError(''); }}>
              <PlusCircle size={16} /> <span>Service Catalog</span>
            </button>
            <button className={activeTab === 'bookings' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('bookings'); setMessage(''); setError(''); }}>
              <Calendar size={16} /> <span>Bookings Ledger</span>
            </button>
            <button className={activeTab === 'payments' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('payments'); setMessage(''); setError(''); }}>
              <CreditCard size={16} /> <span>Payments & Revenue</span>
            </button>
            <button className={activeTab === 'users' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('users'); setMessage(''); setError(''); }}>
              <Users size={16} /> <span>Registered Clients</span>
            </button>
            <button className={activeTab === 'reviews' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('reviews'); setMessage(''); setError(''); }}>
              <MessageSquare size={16} /> <span>Reviews Moderator</span>
            </button>
            <button className={activeTab === 'blogs' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('blogs'); setMessage(''); setError(''); }}>
              <Tag size={16} /> <span>SEO Blog Manager</span>
            </button>
            <button className={activeTab === 'seo' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('seo'); setMessage(''); setError(''); }}>
              <Settings size={16} /> <span>SEO Config</span>
            </button>
            <button className={activeTab === 'cms' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('cms'); setMessage(''); setError(''); }}>
              <Layout size={16} /> <span>CMS Panel</span>
            </button>
            <button className={activeTab === 'notifications' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('notifications'); setMessage(''); setError(''); }}>
              <Bell size={16} /> <span>Dispatch Alerts</span>
            </button>
            <button className={activeTab === 'settings' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => { setActiveTab('settings'); setMessage(''); setError(''); }}>
              <Settings size={16} /> <span>Settings Panel</span>
            </button>
          </nav>
        </aside>

        {/* Dashboard Work Area */}
        <main className="admin-content-area">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {/* TAB: Business Analytics & Stats */}
          {activeTab === 'analytics' && stats && (
            <div className="analytics-view">
              <h2>Executive Dashboard Overview</h2>
              
              <div className="stats-metric-grid">
                <div className="metric-card">
                  <span className="metric-title">Total Revenue</span>
                  <span className="metric-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
                  <span className="metric-note">Processed via Razorpay / COD</span>
                </div>
                <div className="metric-card">
                  <span className="metric-title">Total Bookings</span>
                  <span className="metric-value">{stats.totalBookings}</span>
                  <span className="metric-note">{stats.statusBreakdown.Pending} Pending requests</span>
                </div>
                <div className="metric-card">
                  <span className="metric-title">Registered Clients</span>
                  <span className="metric-value">{stats.totalCustomers}</span>
                  <span className="metric-note">Dynamic user records</span>
                </div>
                <div className="metric-card">
                  <span className="metric-title">Catalog Size</span>
                  <span className="metric-value">{stats.totalServices} Services</span>
                  <span className="metric-note">Across {categories.length} dynamic categories</span>
                </div>
              </div>

              <div className="charts-split-grid">
                {/* SVG Page Load Chart */}
                <div className="chart-container-box">
                  <h3>Visitor Traffic by Page</h3>
                  <div className="chart-bar-layout">
                    {Object.entries(stats.visitorStats).map(([pg, count]) => {
                      const maxVal = Math.max(...Object.values(stats.visitorStats), 1);
                      const heightPercent = (count / maxVal) * 100;
                      return (
                        <div key={pg} className="bar-column">
                          <div className="bar-tooltip">{count} visits</div>
                          <div className="bar-fill" style={{ height: `${heightPercent}%` }}></div>
                          <span className="bar-label">{pg.toUpperCase()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Service Booking Breakdown */}
                <div className="chart-container-box">
                  <h3>Popular Services Ordered</h3>
                  <div className="service-breakdown-list">
                    {Object.keys(stats.serviceDistribution).length === 0 ? (
                      <p>No bookings made yet.</p>
                    ) : (
                      Object.entries(stats.serviceDistribution).map(([name, count]) => {
                        const total = Object.values(stats.serviceDistribution).reduce((a, b) => a + b, 0);
                        const pct = ((count / total) * 100).toFixed(0);
                        return (
                          <div key={name} className="distribution-row">
                            <span className="dist-name">{name}</span>
                            <div className="dist-bar-bg">
                              <div className="dist-bar-fill" style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="dist-val">{count} ({pct}%)</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Status Breakdown Indicators */}
              <div className="status-indicators-box">
                <h3>Order Status Breakdown</h3>
                <div className="indicator-row-grid">
                  <div className="ind-item ind-pending">
                    <span>Pending:</span> <strong>{stats.statusBreakdown.Pending}</strong>
                  </div>
                  <div className="ind-item ind-confirmed">
                    <span>Confirmed:</span> <strong>{stats.statusBreakdown.Confirmed}</strong>
                  </div>
                  <div className="ind-item ind-completed">
                    <span>Completed:</span> <strong>{stats.statusBreakdown.Completed}</strong>
                  </div>
                  <div className="ind-item ind-cancelled">
                    <span>Cancelled:</span> <strong>{stats.statusBreakdown.Cancelled}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Dynamic Category Management */}
          {activeTab === 'categories' && (
            <div className="categories-view">
              <h2>Dynamic Category & Subcategories Management</h2>
              <p className="tab-desc">Everything added here is saved dynamically in MongoDB and populates all dropdowns and landing views.</p>
              
              <div className="editor-layout-grid">
                <form onSubmit={handleCategorySubmit} className="editor-form">
                  <h3>{editingCatId ? 'Edit Category' : 'Create New Category'}</h3>
                  
                  <div className="form-group">
                    <label>Category Display Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={catName} 
                      onChange={(e) => setCatName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group w-50">
                      <label>Image File (Upload to Cloudinary)</label>
                      <input 
                        type="file" 
                        key={catFile ? catFile.name : 'empty'}
                        className="form-input" 
                        accept="image/*"
                        onChange={(e) => setCatFile(e.target.files[0])} 
                      />
                    </div>
                    <div className="form-group w-50">
                      <label>Or Cover Image URL</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. https://images.unsplash.com/..."
                        value={catImage} 
                        onChange={(e) => setCatImage(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subcategories (comma-separated list)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Home Residential, Office, Sofa & Carpet, Villas"
                      value={catSubs} 
                      onChange={(e) => setCatSubs(e.target.value)} 
                      required
                    />
                  </div>

                  <button type="submit" className="editor-submit-btn margin-top-sm">
                    {editingCatId ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'}
                  </button>

                  {editingCatId && (
                    <button type="button" className="editor-cancel-btn" onClick={() => { setEditingCatId(null); setCatName(''); setCatImage(''); setCatSubs(''); }}>
                      Cancel
                    </button>
                  )}
                </form>

                <div className="editor-listing-box">
                  <h3>Active Categories ({categories.length})</h3>
                  <div className="items-scroll-list">
                    {categories.map(c => (
                      <div key={c._id} className="listing-item-card">
                        <img src={c.image} alt={c.name} className="listing-item-thumb" />
                        <div className="listing-item-info">
                          <h4>{c.name}</h4>
                          <p>{c.subcategories.map(s => s.name).join(' | ')}</p>
                        </div>
                        <div className="listing-item-actions">
                          <button onClick={() => handleEditCategory(c)} className="edit-btn"><Edit size={16} /></button>
                          <button onClick={() => handleDeleteCategory(c._id)} className="delete-btn"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Service Catalog */}
          {activeTab === 'services' && (
            <div className="services-view">
              <h2>Dynamic Service Catalog Management</h2>
              
              <div className="editor-layout-grid">
                <form onSubmit={handleServiceSubmit} className="editor-form">
                  <h3>{editingServiceId ? 'Edit Cleaning Service' : 'Add New Cleaning Service'}</h3>
                  
                  <div className="form-group">
                    <label>Service Display Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={serviceName} 
                      onChange={(e) => setServiceName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      className="form-textarea" 
                      rows="3"
                      value={serviceDesc} 
                      onChange={(e) => setServiceDesc(e.target.value)} 
                      required
                    ></textarea>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group w-50">
                      <label>Min Estimated Price (₹)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={serviceMinPrice} 
                        onChange={(e) => setServiceMinPrice(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group w-50">
                      <label>Max Estimated Price (₹)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={serviceMaxPrice} 
                        onChange={(e) => setServiceMaxPrice(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group w-50">
                      <label>Category (Dynamic DB)</label>
                      <select 
                        className="form-select" 
                        value={serviceCat} 
                        onChange={(e) => {
                          setServiceCat(e.target.value);
                          const cat = categories.find(c => c.name === e.target.value);
                          if (cat && cat.subcategories.length > 0) {
                            setServiceSub(cat.subcategories[0].name);
                          }
                        }}
                      >
                        {categories.map(c => (
                          <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group w-50">
                      <label>Subcategory (Dynamic DB)</label>
                      <select 
                        className="form-select" 
                        value={serviceSub}
                        onChange={(e) => setServiceSub(e.target.value)}
                      >
                        {availableSubcategories.map(s => (
                          <option key={s._id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={serviceIsActive}
                        onChange={(e) => setServiceIsActive(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                      <span className="toggle-label" style={{ marginLeft: '50px' }}>Service is Active</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Key Features (comma-separated bullets)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Vacuum cleaning, Stain removal, Eco chemical sanitizing"
                      value={serviceFeatures} 
                      onChange={(e) => setServiceFeatures(e.target.value)} 
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group w-50">
                      <label>Image File (Upload to Cloudinary)</label>
                      <input 
                        type="file" 
                        key={serviceFile ? serviceFile.name : 'empty'}
                        className="form-input" 
                        accept="image/*"
                        onChange={(e) => setServiceFile(e.target.files[0])} 
                      />
                    </div>
                    <div className="form-group w-50">
                      <label>Or Image URL</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. https://images.unsplash.com/..."
                        value={serviceImage} 
                        onChange={(e) => setServiceImage(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="action-button-row margin-top-sm">
                    <button type="submit" className="editor-submit-btn">
                      {editingServiceId ? 'UPDATE SERVICE' : 'CREATE SERVICE'}
                    </button>
                    {editingServiceId && (
                      <button 
                        type="button" 
                        className="editor-cancel-btn" 
                        onClick={() => { 
                          setEditingServiceId(null); 
                          setServiceName(''); 
                          setServiceDesc(''); 
                          setServiceMinPrice('299'); 
                          setServiceMaxPrice('499'); 
                          setServiceIsActive(true); 
                          setServiceFeatures(''); 
                          setServiceImage(''); 
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="editor-listing-box">
                  <h3>Catalog Items ({services.length})</h3>
                  <div className="items-scroll-list">
                    {services.map(s => {
                      const isSvcActive = s.isActive !== false;
                      const minPriceVal = s.minPrice || s.price || 299;
                      const maxPriceVal = s.maxPrice || Math.round(minPriceVal * 1.5) || 499;
                      return (
                        <div key={s._id} className={`listing-item-card ${!isSvcActive ? 'deactivated-service-item' : ''}`}>
                          <img src={s.image} alt={s.name} className="listing-item-thumb" />
                          <div className="listing-item-info">
                            <h4>{s.name}</h4>
                            <p>{s.category} &rarr; ₹{minPriceVal.toLocaleString('en-IN')} - ₹{maxPriceVal.toLocaleString('en-IN')}</p>
                            <span className={`badge-indicator ${isSvcActive ? 'badge-active' : 'badge-inactive'}`}>
                              {isSvcActive ? 'Active' : 'Deactivated'}
                            </span>
                          </div>
                          <div className="listing-item-actions">
                            <button 
                              type="button"
                              onClick={() => handleToggleServiceActive(s)} 
                              className={`status-quick-toggle ${isSvcActive ? 'btn-active' : 'btn-inactive'}`}
                              title={isSvcActive ? 'Deactivate Service' : 'Activate Service'}
                            >
                              Toggle
                            </button>
                            <button onClick={() => handleEditService(s)} className="edit-btn"><Edit size={16}/></button>
                            <button onClick={() => handleDeleteService(s._id)} className="delete-btn"><Trash2 size={16}/></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Bookings Ledger */}
          {activeTab === 'bookings' && (
            <div className="bookings-view">
              <h2>Bookings Ledger</h2>
              
              {assigningStaffId && (
                <form onSubmit={handleAssignStaffSubmit} className="editor-form bg-dark-glass margin-bottom-md animate-scale-in">
                  <h3>Assign Staff for Booking #{assigningStaffId.substring(18)}</h3>
                  <div className="form-group">
                    <label>Enter Cleaner/Staff Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Wade Warren or Alen Walker" 
                      value={staffName} 
                      onChange={(e) => setStaffName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="action-button-row">
                    <button type="submit" className="editor-submit-btn">ASSIGN STAFF</button>
                    <button type="button" className="editor-cancel-btn" onClick={() => setAssigningStaffId(null)}>Cancel</button>
                  </div>
                </form>
              )}

              {disapprovingBookingId && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateBookingStatus(disapprovingBookingId, 'Disapproved', rejectionReason);
                    setDisapprovingBookingId(null);
                    setRejectionReason('');
                  }} 
                  className="editor-form bg-dark-glass margin-bottom-md animate-scale-in"
                >
                  <h3>Disapprove Service Request #{disapprovingBookingId.substring(18)}</h3>
                  <div className="form-group">
                    <label>Reason for Disapproval (Sends automated Email & WhatsApp notification)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Service slot fully booked / Cleaner unavailable in your area" 
                      value={rejectionReason} 
                      onChange={(e) => setRejectionReason(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="action-button-row">
                    <button type="submit" className="editor-submit-btn" style={{ backgroundColor: '#ef4444' }}>SUBMIT DISAPPROVAL</button>
                    <button type="button" className="editor-cancel-btn" onClick={() => setDisapprovingBookingId(null)}>Cancel</button>
                  </div>
                </form>
              )}

              {/* Selected Leaflet Map View Modal */}
              {selectedBookingForMap && (
                <div className="modal-overlay">
                  <div className="modal-content booking-modal-box animate-scale-in" style={{ maxWidth: '600px', padding: '2rem' }}>
                    <button className="modal-close-btn" onClick={() => setSelectedBookingForMap(null)}>
                      <X size={20} />
                    </button>
                    <h3 style={{ marginBottom: '0.5rem' }}>Location Map</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <strong>Customer:</strong> {selectedBookingForMap.name || selectedBookingForMap.user?.name} <br/>
                      <strong>Address:</strong> {selectedBookingForMap.formattedAddress}
                    </p>
                    <div id="admin-map-container" className="admin-leaflet-container" style={{ height: '300px' }}></div>
                    <button className="success-close-btn" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => setSelectedBookingForMap(null)}>
                      Close Map
                    </button>
                  </div>
                </div>
              )}

              <div className="table-responsive-box">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID / Date</th>
                      <th>Customer Contact</th>
                      <th>Service Details & Description</th>
                      <th>Est Surcharge & Status</th>
                      <th>Staff Assigned</th>
                      <th>Action Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => {
                      const totalAmtVal = b.totalAmount || 0;
                      return (
                        <tr key={b._id}>
                          <td>
                            <span className="t-bold">{b._id.substring(18)}</span>
                            <span className="t-sub">{new Date(b.dateTime).toLocaleString('en-IN')}</span>
                          </td>
                          <td>
                            <span className="t-bold">{b.name || b.user?.name || 'Deleted Account'}</span>
                            <span className="t-sub">{b.phone || b.user?.phone || 'N/A'}</span>
                            <span className="t-sub">{b.email || b.user?.email || 'N/A'}</span>
                          </td>
                          <td>
                            <span className="t-bold">{b.service?.name || 'Deleted Service'}</span>
                            <span className="t-sub">{b.service?.category} &rarr; {b.description || 'No description provided'}</span>
                            {b.formattedAddress && (
                              <div style={{ marginTop: '0.4rem', borderLeft: '2px solid #3b82f6', paddingLeft: '0.5rem' }}>
                                <span className="t-sub" style={{ fontSize: '0.75rem', display: 'block', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {b.formattedAddress}
                                </span>
                                {b.latitude && b.longitude && (
                                  <button 
                                    onClick={() => setSelectedBookingForMap(b)} 
                                    className="small-edit-btn" 
                                    style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem', marginTop: '0.2rem' }}
                                  >
                                    View Pinned Map
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className="t-bold">₹{totalAmtVal.toLocaleString('en-IN')}</span>
                            <span className={`status-badge stat-${b.status.toLowerCase()}`}>{b.status}</span>
                            {b.statusReason && (
                              <span className="t-sub" style={{ color: '#ef4444', fontStyle: 'italic', display: 'block', maxWidth: '150px' }}>
                                Reason: {b.statusReason}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="t-bold text-italic">{b.staff || 'Unassigned'}</span>
                            <button onClick={() => { setAssigningStaffId(b._id); setStaffName(b.staff || ''); }} className="small-edit-btn">Assign</button>
                          </td>
                          <td>
                            <div className="action-button-row">
                              {b.status === 'Pending' && (
                                <>
                                  <button className="action-btn text-success" onClick={() => handleUpdateBookingStatus(b._id, 'Approved')} title="Approve Booking">
                                    <CheckCircle size={16} /> Approve
                                  </button>
                                  <button className="action-btn text-danger" onClick={() => { setDisapprovingBookingId(b._id); setRejectionReason(''); }} title="Disapprove Booking">
                                    <XCircle size={16} /> Disapprove
                                  </button>
                                </>
                              )}
                              {b.status === 'Approved' && (
                                <button className="action-btn text-blue" onClick={() => handleUpdateBookingStatus(b._id, 'Completed')} title="Mark Completed">
                                  <ShieldCheck size={16} /> Complete
                                </button>
                              )}
                              {b.status !== 'Cancelled' && b.status !== 'Completed' && b.status !== 'Disapproved' && (
                                <button className="action-btn text-danger" onClick={() => handleUpdateBookingStatus(b._id, 'Cancelled')} title="Cancel Booking">
                                  <XCircle size={16} /> Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Payments & Transaction Logs */}
          {activeTab === 'payments' && (
            <div className="payments-view">
              <h2>Payments Transaction Auditing</h2>
              
              <div className="filters-header-row bg-dark-glass margin-bottom-md">
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Filter Status</label>
                    <select className="form-select" value={paymentFilterStatus} onChange={(e) => setPaymentFilterStatus(e.target.value)}>
                      <option value="">All Payments</option>
                      <option value="Success">Success</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" className="form-input" value={paymentFilterStart} onChange={(e) => setPaymentFilterStart(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="date" className="form-input" value={paymentFilterEnd} onChange={(e) => setPaymentFilterEnd(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="table-responsive-box">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Customer Details</th>
                      <th>Service Details</th>
                      <th>Method</th>
                      <th>Amount Paid</th>
                      <th>Logged Date</th>
                      <th>Status Pill</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p._id}>
                        <td><span className="t-bold">{p.paymentId}</span></td>
                        <td>
                          <span className="t-bold">{p.user?.name || 'Deleted Account'}</span>
                          <span className="t-sub">{p.user?.email || 'N/A'}</span>
                        </td>
                        <td>
                          <span className="t-bold">{p.booking?.service?.name || 'Deleted Service'}</span>
                          <span className="t-sub">Order #{p.booking?._id?.substring(18) || 'Deleted'}</span>
                        </td>
                        <td><span className="t-bold">{p.method}</span></td>
                        <td><span className="t-bold font-lg">₹{p.amount?.toLocaleString('en-IN')}</span></td>
                        <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge pay-${p.status.toLowerCase()}`}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Registered Clients & Booking History */}
          {activeTab === 'users' && (
            <div className="users-view">
              <h2>Registered Customers & Account States</h2>

              {viewingUserBookings && (
                <div className="user-history-modal bg-dark-glass margin-bottom-md animate-scale-in">
                  <div className="modal-header-row">
                    <h3>Booking History for {viewingUserBookings.name}</h3>
                    <button className="close-badge-btn" onClick={() => setViewingUserBookings(null)}><X size={16} /></button>
                  </div>
                  <div className="table-responsive-box margin-top-sm">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Service Scheduled</th>
                          <th>Date & Time</th>
                          <th>Financial Amount</th>
                          <th>Account Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBookingsList.map(b => (
                          <tr key={b._id}>
                            <td>{b._id.substring(18)}</td>
                            <td>{b.service?.name}</td>
                            <td>{new Date(b.dateTime).toLocaleString()}</td>
                            <td>${b.totalAmount}</td>
                            <td><span className={`status-badge stat-${b.status.toLowerCase()}`}>{b.status}</span></td>
                          </tr>
                        ))}
                        {userBookingsList.length === 0 && (
                          <tr><td colSpan="5" className="text-center text-muted">No scheduled services logged.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="table-responsive-box">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Status State</th>
                      <th>Registered On</th>
                      <th>Action Commands</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td><span className="t-bold">{u.name}</span></td>
                        <td>{u.email}</td>
                        <td><span className={`status-badge role-${u.role}`}>{u.role.toUpperCase()}</span></td>
                        <td>
                          <span className={`status-badge ${u.status === 'blocked' ? 'pay-failed' : 'stat-completed'}`}>
                            {u.status?.toUpperCase() || 'ACTIVE'}
                          </span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-button-row">
                            <button onClick={() => handleViewUserBookings(u)} className="action-btn text-blue" title="View Booking History"><Eye size={16} /></button>
                            <button onClick={() => handleToggleUserBlock(u._id)} className="action-btn text-warning" title={u.status === 'blocked' ? 'Unblock User' : 'Block User'}><ShieldAlert size={16} /></button>
                            <button onClick={() => handleDeleteUser(u._id)} className="action-btn text-danger" title="Delete User Permanently"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Reviews Moderation */}
          {activeTab === 'reviews' && (
            <div className="reviews-view">
              <h2>Reviews Moderation & Testimonials</h2>
              <div className="table-responsive-box">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Rating & Comment</th>
                      <th>Approval Status</th>
                      <th>Promote Testimonial</th>
                      <th>Action Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(r => (
                      <tr key={r._id}>
                        <td>
                          <span className="t-bold">{r.user?.name || 'Deleted Account'}</span>
                          <span className="t-sub">{r.user?.email || 'N/A'}</span>
                        </td>
                        <td>
                          <div className="stars-row">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                          <p className="review-comment-cell">"{r.comment}"</p>
                        </td>
                        <td>
                          <span className={`status-badge review-${r.status.toLowerCase()}`}>{r.status}</span>
                        </td>
                        <td>
                          <button
                            className={r.isFeatured ? 'featured-toggle-btn active' : 'featured-toggle-btn'}
                            onClick={() => handleReviewStatus(r._id, r.status, !r.isFeatured)}
                          >
                            <Star size={14} className="inline-icon" /> {r.isFeatured ? 'Testimonial Star' : 'Feature as Review'}
                          </button>
                        </td>
                        <td>
                          <div className="action-button-row">
                            {r.status !== 'Approved' && (
                              <button className="action-btn text-success" onClick={() => handleReviewStatus(r._id, 'Approved', r.isFeatured)}>Approve</button>
                            )}
                            {r.status !== 'Rejected' && (
                              <button className="action-btn text-danger" onClick={() => handleReviewStatus(r._id, 'Rejected', r.isFeatured)}>Reject</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Blog Manager */}
          {activeTab === 'blogs' && (
            <div className="blogs-view">
              <h2>SEO Blog Posts Manager</h2>
              
              <div className="editor-layout-grid">
                <form onSubmit={handleBlogSubmit} className="editor-form">
                  <h3>{editingBlogId ? 'Edit SEO Article' : 'Compose SEO Article'}</h3>

                  <div className="form-group">
                    <label>Article Title</label>
                    <input type="text" className="form-input" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label>Body Content</label>
                    <textarea className="form-textarea" rows="8" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} required></textarea>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select className="form-select" value={blogCat} onChange={(e) => setBlogCat(e.target.value)}>
                        <option value="Cleaning Tips">Cleaning Tips</option>
                        <option value="Pest Control">Pest Control</option>
                        <option value="Industry News">Industry News</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Author</label>
                      <input type="text" className="form-input" value={blogAuthor} onChange={(e) => setBlogAuthor(e.target.value)} placeholder="Cleannes Staff" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input type="text" className="form-input" placeholder="hygiene, bedrooms, mop" value={blogTags} onChange={(e) => setBlogTags(e.target.value)} />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group w-50">
                      <label>Cover Image File (Upload to Cloudinary)</label>
                      <input 
                        type="file" 
                        key={blogFile ? blogFile.name : 'empty'}
                        className="form-input" 
                        accept="image/*"
                        onChange={(e) => setBlogFile(e.target.files[0])} 
                      />
                    </div>
                    <div className="form-group w-50">
                      <label>Or Cover Image URL</label>
                      <input type="text" className="form-input" placeholder="e.g. https://images.unsplash.com/..." value={blogImage} onChange={(e) => setBlogImage(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-divider-line">SEO Metadata Headers</div>

                  <div className="form-group">
                    <label>SEO Title Tag</label>
                    <input type="text" className="form-input" placeholder="Google search title" value={blogSeoTitle} onChange={(e) => setBlogSeoTitle(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>SEO Meta Description</label>
                    <textarea className="form-textarea" rows="2" placeholder="Google search summary description snippet" value={blogSeoDesc} onChange={(e) => setBlogSeoDesc(e.target.value)}></textarea>
                  </div>

                  <div className="form-group">
                    <label>SEO Keywords</label>
                    <input type="text" className="form-input" placeholder="cleaning, dust" value={blogSeoKeys} onChange={(e) => setBlogSeoKeys(e.target.value)} />
                  </div>

                  <button type="submit" className="editor-submit-btn margin-top-sm">
                    {editingBlogId ? 'UPDATE ARTICLE' : 'PUBLISH ARTICLE'}
                  </button>
                </form>

                <div className="editor-listing-box">
                  <h3>Active News Articles ({blogs.length})</h3>
                  <div className="items-scroll-list">
                    {blogs.map(b => (
                      <div key={b._id} className="listing-item-card">
                        <div className="listing-item-info">
                          <h4>{b.title}</h4>
                          <p>{b.category} &bull; By {b.author}</p>
                        </div>
                        <div className="listing-item-actions">
                          <button onClick={() => handleEditBlog(b)} className="edit-btn"><Edit size={16} /></button>
                          <button onClick={() => handleDeleteBlog(b._id)} className="delete-btn"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SEO Global Config */}
          {activeTab === 'seo' && (
            <div className="seo-view">
              <h2>SEO Dashboard Config</h2>
              <p className="tab-desc">Configure search engine optimization meta-tags globally for static client landing pages.</p>

              <form onSubmit={handleSEOSubmit} className="editor-form seo-form-width">
                <div className="form-group">
                  <label>Select Page Identifier</label>
                  <select className="form-select" value={seoPage} onChange={(e) => setSeoPage(e.target.value)}>
                    <option value="home">Home Page</option>
                    <option value="about">About Page</option>
                    <option value="services">Services Listing Page</option>
                    <option value="blog">Blog Feed Page</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Page Title Tag (HTML &lt;title&gt;)</label>
                  <input type="text" className="form-input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Meta Description Content</label>
                  <textarea className="form-textarea" rows="4" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} required></textarea>
                </div>

                <div className="form-group">
                  <label>Meta Keywords</label>
                  <input type="text" className="form-input" placeholder="e.g. cleaning, villa cleaning, pest control" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} />
                </div>

                <button type="submit" className="editor-submit-btn margin-top-sm">
                  SAVE SEO METADATA
                </button>
              </form>
            </div>
          )}

          {/* TAB: CMS Content Management */}
          {activeTab === 'cms' && (
            <div className="cms-view">
              <h2>Dynamic CMS Content (No Code Updates)</h2>
              <p className="tab-desc">Edit page contents dynamically. Changes propagate instantly to client landing components.</p>

              <div className="cms-section-selector margin-bottom-md">
                <span className="section-label">Select Landing Section:</span>
                <div className="btn-tab-row margin-top-sm">
                  <button className={cmsSection === 'hero' ? 'mini-tab-btn active' : 'mini-tab-btn'} onClick={() => setCmsSection('hero')}>Hero Banner</button>
                  <button className={cmsSection === 'about' ? 'mini-tab-btn active' : 'mini-tab-btn'} onClick={() => setCmsSection('about')}>About Company</button>
                  <button className={cmsSection === 'footer' ? 'mini-tab-btn active' : 'mini-tab-btn'} onClick={() => setCmsSection('footer')}>Footer Details</button>
                </div>
              </div>

              <form onSubmit={handleCmsSubmit} className="editor-form cms-form-width bg-dark-glass animate-scale-in">
                <h3>Edit Section [{cmsSection.toUpperCase()}]</h3>
                
                {cmsSection === 'hero' && (
                  <>
                    <div className="form-group">
                      <label>Badge Callout Text</label>
                      <input type="text" className="form-input" value={cmsData.badge || ''} onChange={(e) => handleCmsDataChange('badge', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Main Hero Title</label>
                      <input type="text" className="form-input" value={cmsData.title || ''} onChange={(e) => handleCmsDataChange('title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Subtitle Paragraph</label>
                      <textarea className="form-textarea" rows="3" value={cmsData.subtitle || ''} onChange={(e) => handleCmsDataChange('subtitle', e.target.value)}></textarea>
                    </div>
                    <div className="form-group">
                      <label>Button Display Text</label>
                      <input type="text" className="form-input" value={cmsData.buttonText || ''} onChange={(e) => handleCmsDataChange('buttonText', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Background Banner Image URL</label>
                      <input type="text" className="form-input" value={cmsData.image || ''} onChange={(e) => handleCmsDataChange('image', e.target.value)} />
                    </div>
                  </>
                )}

                {cmsSection === 'about' && (
                  <>
                    <div className="form-group">
                      <label>About Section Badge</label>
                      <input type="text" className="form-input" value={cmsData.badge || ''} onChange={(e) => handleCmsDataChange('badge', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Section Title Header</label>
                      <input type="text" className="form-input" value={cmsData.title || ''} onChange={(e) => handleCmsDataChange('title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Detailed Description Body</label>
                      <textarea className="form-textarea" rows="6" value={cmsData.description || ''} onChange={(e) => handleCmsDataChange('description', e.target.value)}></textarea>
                    </div>
                    <div className="form-group">
                      <label>Experience Label Value</label>
                      <input type="text" className="form-input" value={cmsData.experienceYears || ''} onChange={(e) => handleCmsDataChange('experienceYears', e.target.value)} placeholder="e.g. 12+" />
                    </div>
                    <div className="form-group">
                      <label>Experience Brief Caption</label>
                      <input type="text" className="form-input" value={cmsData.experienceText || ''} onChange={(e) => handleCmsDataChange('experienceText', e.target.value)} />
                    </div>
                  </>
                )}

                {cmsSection === 'footer' && (
                  <>
                    <div className="form-group">
                      <label>Footer Brief Description</label>
                      <textarea className="form-textarea" rows="3" value={cmsData.description || ''} onChange={(e) => handleCmsDataChange('description', e.target.value)}></textarea>
                    </div>
                    <div className="form-group">
                      <label>Contact Phone Number</label>
                      <input type="text" className="form-input" value={cmsData.phone || ''} onChange={(e) => handleCmsDataChange('phone', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Support Email Address</label>
                      <input type="email" className="form-input" value={cmsData.email || ''} onChange={(e) => handleCmsDataChange('email', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Physical HQ Address</label>
                      <input type="text" className="form-input" value={cmsData.address || ''} onChange={(e) => handleCmsDataChange('address', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Copyright Disclaimer Footer</label>
                      <input type="text" className="form-input" value={cmsData.copyright || ''} onChange={(e) => handleCmsDataChange('copyright', e.target.value)} />
                    </div>
                  </>
                )}

                <button type="submit" className="editor-submit-btn margin-top-sm">
                  SAVE CMS SECTION CONTENT
                </button>
              </form>
            </div>
          )}

          {/* TAB: Notifications Broadcaster */}
          {activeTab === 'notifications' && (
            <div className="notifications-view">
              <h2>Dispatch Customer Alerts & Notifications</h2>
              <p className="tab-desc">Send individual account scheduling alerts or broadcast promotional offers to all users.</p>

              <form onSubmit={handleNotificationSubmit} className="editor-form seo-form-width bg-dark-glass">
                <h3>Broadcast Notification Form</h3>

                <div className="form-group">
                  <label>Target User ID (leave blank to broadcast to ALL customers)</label>
                  <select className="form-select" value={notifTargetUser} onChange={(e) => setNotifTargetUser(e.target.value)}>
                    <option value="">[Broadcast Alert to Everyone]</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Alert Title Header</label>
                  <input type="text" className="form-input" placeholder="e.g. Schedule Update / Weekend Offer" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Alert Message Description</label>
                  <textarea className="form-textarea" rows="4" placeholder="Type notification content..." value={notifMessage} onChange={(e) => setNotifMessage(e.target.value)} required></textarea>
                </div>

                <div className="form-group">
                  <label>Alert Segment Category</label>
                  <select className="form-select" value={notifType} onChange={(e) => setNotifType(e.target.value)}>
                    <option value="general">General Notification</option>
                    <option value="booking">Booking Update</option>
                    <option value="offer">Special Offer / Promotion</option>
                  </select>
                </div>

                <button type="submit" className="editor-submit-btn margin-top-sm">
                  DISPATCH NOTIFICATION ALERT
                </button>
              </form>
            </div>
          )}

          {/* TAB: Settings Panel */}
          {activeTab === 'settings' && (
            <div className="settings-view">
              <h2>Global Business settings & Gateways Keys</h2>
              <p className="tab-desc">Control live credentials and features switches without changing any code.</p>

              <form onSubmit={handleSettingsSubmit} className="editor-form bg-dark-glass">
                <h3>Business Core Coordinates</h3>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Legal Business Name</label>
                    <input type="text" className="form-input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Public Support Phone</label>
                    <input type="text" className="form-input" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Public Support Email</label>
                    <input type="email" className="form-input" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Physical Address HQ</label>
                    <input type="text" className="form-input" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} required />
                  </div>
                </div>

                <div className="form-divider-line margin-top-md">Stripe Gateway integration Sandbox</div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Stripe Sandbox Public Key</label>
                    <input type="text" className="form-input" value={stripePublicKey} onChange={(e) => setStripePublicKey(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Stripe Sandbox Secret Key</label>
                    <input type="password" className="form-input" value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} />
                  </div>
                </div>

                <div className="form-divider-line margin-top-md">Live Platform Modules Activations</div>
                <div className="form-group margin-top-sm flex-row-align">
                  <input type="checkbox" id="stripe_toggle" className="big-checkbox" checked={enableStripe} onChange={(e) => setEnableStripe(e.target.checked)} />
                  <label htmlFor="stripe_toggle" className="inline-label">Enable Stripe Payment Credit Card Invoicing</label>
                </div>
                <div className="form-group flex-row-align">
                  <input type="checkbox" id="cod_toggle" className="big-checkbox" checked={enableCash} onChange={(e) => setEnableCash(e.target.checked)} />
                  <label htmlFor="cod_toggle" className="inline-label">Enable Cash / Local Payment After Cleaning Services Completed</label>
                </div>

                <button type="submit" className="editor-submit-btn margin-top-md">
                  SAVE PLATFORM SETTINGS
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default AdminDashboard;
