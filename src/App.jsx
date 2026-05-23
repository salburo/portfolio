import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu
  
  // Data states
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      console.log('🟡 Fetching projects from Supabase...');
      setLoadingProjects(true);
      setErrorMessage('');
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('📦 Supabase Response:', { data, error });

        if (error) {
          console.error('❌ Supabase error:', error);
          setErrorMessage(`Database error: ${error.message}`);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log('✅ Projects loaded:', data.length, 'projects');
          setProjects(data);
        } else {
          console.log('⚠️ No projects found in database');
          setProjects([]);
        }
      } catch (error) {
        console.error('❌ Error fetching projects:', error);
        setErrorMessage('Failed to load projects. Please check your database connection.');
        setProjects([
          { id: 1, title: 'AI Image Generator', description: 'Generate stunning images using artificial intelligence' },
          { id: 2, title: 'E-Commerce Platform', description: 'Full-stack shopping experience with real-time updates' },
          { id: 3, title: 'Portfolio 2025', description: 'Minimalist design with smooth animations' },
          { id: 4, title: 'TaskFlow', description: 'Productivity app with drag-and-drop boards' },
        ]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal-on-scroll, .project-card, .stagger-children, .skills-section, .experience-card').forEach((el) => {
      observer.observe(el);
    });

    const hero = document.querySelector('.hero-section');
    if (hero) setTimeout(() => hero.classList.add('loaded'), 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Close menu when clicking a link
  const handleNavClick = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false); // Close menu on mobile
  };

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (submitStatus.message) setSubmitStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }
        ]);

      if (error) throw error;

      setSubmitStatus({ 
        type: 'success', 
        message: 'Thanks for reaching out! Archie will get back to you soon.' 
      });
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus({ type: '', message: '' });
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Oops! Something went wrong. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="app">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo" onClick={() => scrollTo('home')}>
            &lt;Archie /&gt;
          </div>
          
          {/* Hamburger Menu Button - visible on mobile */}
          <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          {/* Navigation Links - becomes dropdown on mobile */}
          <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <a href="#home" className={activeSection === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>Home</a>
            <a href="#about" className={activeSection === 'about' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>About</a>
            <a href="#experiences" className={activeSection === 'experiences' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNavClick('experiences'); }}>Experience</a>
            <a href="#projects" className={activeSection === 'projects' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNavClick('projects'); }}>Projects</a>
            <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Contact</a>
          </div>
        </div>
      </nav>

      {/* Rest of your component remains exactly the same */}
      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">✨ IT Graduate | Developer | VA | Digital Creator</div>
            <h1>Hi, I'm <span className="gradient-text">Archie Salburo</span></h1>
            <h2>IT Graduate | Web Developer | VA & Digital Creator</h2>
            <p>From financial struggles to graduation day — I turned every challenge into fuel for growth. Now I build web experiences, create content, and help brands grow online.</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => scrollTo('projects')}>View My Work</button>
              <button className="btn-secondary" onClick={() => scrollTo('contact')}>Let's Talk</button>
              <button className="btn-resume" onClick={() => window.open('/resume.html', '_blank')}>
                📄 Download Resume
              </button>
            </div>
          </div>
          
          <div className="hero-profile">
            <div className="profile-frame">
              <div className="profile-ring"></div>
              <div className="profile-image-wrapper">
                <img src="prop.jpg" alt="Archie Salburo" className="profile-image"/>
              </div>
            </div>
            <div className="profile-status">
              <span className="status-dot"></span>
              Available for work
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">My Journey</h2>
          <div className="about-content">
            <div className="about-text stagger-children">
              <p>🎓 <strong>I am a proud graduate of Diploma in Information Technology</strong> — a milestone that means more to me than just a piece of paper. It represents countless sleepless nights, unwavering determination, and the courage to keep going when the odds were stacked against me.</p>
              
              <p>💰 <strong>Financially unstable but never broke in spirit.</strong> There were times when I wasn't sure if I could afford the next semester. I worked, saved, sacrificed, and sometimes went without just to stay in school. But every challenge taught me resilience, resourcefulness, and the value of hard work. I learned that your circumstances don't define you — your determination does.</p>
              
              <p>💡 <strong>Why IT?</strong> I fell in love with technology because it offered something my situation couldn't — opportunity. Coding became my escape and my weapon. Every line of code I wrote was a step toward a better future. I discovered that with a laptop and an internet connection, I could build anything, learn anything, and become anything I wanted to be.</p>
              
              <p>🚀 <strong>Today, I stand here not despite my struggles, but because of them.</strong> My journey taught me empathy, grit, and the importance of never giving up. I want to use my skills to build tools that help others, create opportunities for those who feel stuck, and prove that where you start doesn't determine where you can go.</p>
              
              <p>🌟 <strong>To anyone reading this who is struggling:</strong> Keep going. Your breakthrough is closer than you think. Let your hunger for success be louder than your fear of failure.</p>
            </div>
            
            <div className="skills-section stagger-children">
              <h3 className="skills-title">💪 Skills I Built Along The Way</h3>
              
              <div className="skills-subtitle">💻 Technical Development</div>
              
              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">⚛️ React</span>
                  <span className="skill-percent">75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill react-fill" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">🌐 HTML & CSS</span>
                  <span className="skill-percent">90%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill html-fill" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">🟢 JavaScript</span>
                  <span className="skill-percent">70%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill js-fill" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">📦 Node.js</span>
                  <span className="skill-percent">60%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill node-fill" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">🟦 TypeScript</span>
                  <span className="skill-percent">55%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill ts-fill" style={{ width: '55%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">⚡ Vite</span>
                  <span className="skill-percent">80%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill vite-fill" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">🗄️ Supabase</span>
                  <span className="skill-percent">65%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill supabase-fill" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">🎨 Figma</span>
                  <span className="skill-percent">70%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill figma-fill" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">🐙 Git & GitHub</span>
                  <span className="skill-percent">75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill git-fill" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="skills-subtitle">📱 Virtual Assistance & Content Creation</div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">📱 Content Creation</span>
                  <span className="skill-percent">90%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill content-fill" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">✂️ Video Editing</span>
                  <span className="skill-percent">85%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill edit-fill" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">📊 Social Media Management</span>
                  <span className="skill-percent">85%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill smm-fill" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">💼 Virtual Assistance</span>
                  <span className="skill-percent">90%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill va-fill" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">📈 Affiliate Marketing</span>
                  <span className="skill-percent">85%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill affiliate-fill" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">💬 Customer Support</span>
                  <span className="skill-percent">90%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill support-fill" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">📧 Email Management</span>
                  <span className="skill-percent">85%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill email-fill" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experiences" className="reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">Professional Experience</h2>
          <div className="experiences-grid">
            
            <div className="experience-card">
              <div className="experience-icon">📱</div>
              <h3>TikTok Affiliate Creator</h3>
              <div className="experience-company">1.5 Years Experience</div>
              <p>Created engaging content that drove real sales. Learned what makes content go viral, how to build trust with audiences, and how to convert views into revenue through affiliate marketing.</p>
              <div className="experience-tags">
                <span>Content Creation</span>
                <span>Trend Research</span>
                <span>Audience Growth</span>
                <span>Sales Conversion</span>
              </div>
            </div>

            <div className="experience-card">
              <div className="experience-icon">💼</div>
              <h3>Customer Service Representative</h3>
              <div className="experience-company">Qualfon</div>
              <div className="experience-duration">📅 3 months</div>
              <p>Developed strong communication and problem-solving skills while handling customer inquiries and resolving complaints. This experience taught me patience, empathy, and how to stay calm under pressure.</p>
              <div className="experience-tags">
                <span>Customer Support</span>
                <span>Communication</span>
                <span>Problem Solving</span>
              </div>
            </div>

            <div className="experience-card">
              <div className="experience-icon">🖥️</div>
              <h3>IT Intern</h3>
              <div className="experience-company">Inspiro</div>
              <div className="experience-duration">📅 300 hours</div>
              <p>Gained hands-on experience in IT infrastructure, technical support, and system maintenance. This internship bridged the gap between academic learning and real-world application.</p>
              <div className="experience-tags">
                <span>Technical Support</span>
                <span>Troubleshooting</span>
                <span>IT Operations</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="container">
          <h2 className="section-title reveal-on-scroll">Featured Projects</h2>
          
          {errorMessage && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #f87171', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'center' }}>
              <p style={{ color: '#f87171', margin: 0 }}>⚠️ {errorMessage}</p>
            </div>
          )}
          
          {loadingProjects ? (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
              <p>Loading projects...</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="project-icon">
                      <span>📁</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {project.created_at && (
                      <div className="project-date">📅 {formatDate(project.created_at)}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-projects">
                  <p>✨ No projects yet. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Let's work together</h3>
              <p>Have a project in mind? I'd love to hear about it. Whether it's web development, content creation, virtual assistance, or just a chat — reach out!</p>
              <div className="contact-details">
                <p>📧 salburoarchie2005@gmail.com</p>
                <p>📱 +63963-171-9447</p>
                <p>🌍 Panubtuban, Dauin, Negros Oriental, Philippines</p>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              
              {submitStatus.message && (
                <div className={`form-status ${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}
              
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ========== BACK TO TOP BUTTON ========== */}
      {scrolled && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="back-to-top"
          aria-label="Back to top"
        >
          <span>↑</span>
        </button>
      )}

    </div>
  );
};

export default App;