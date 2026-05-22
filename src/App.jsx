import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  
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
        // Fallback to default projects
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

    document.querySelectorAll('.reveal-on-scroll, .project-card, .stagger-children, .skills-section').forEach((el) => {
      observer.observe(el);
    });

    const hero = document.querySelector('.hero-section');
    if (hero) setTimeout(() => hero.classList.add('loaded'), 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

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
          <div className="nav-links">
            <a href="#home" className={activeSection === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo('home'); }}>Home</a>
            <a href="#about" className={activeSection === 'about' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About</a>
            <a href="#projects" className={activeSection === 'projects' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo('projects'); }}>Projects</a>
            <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Contact</a>
          </div>
        </div>
      </nav>

      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">✨ Welcome to my digital space</div>
            <h1>Hi, I'm <span className="gradient-text">Archie Salburo</span></h1>
            <h2>Creative Web Developer</h2>
            <p>I craft beautiful, performant web experiences with modern technologies. Let's build something amazing together.</p>
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

      {/* ========== ABOUT SECTION WITH SKILL PROGRESS BARS ========== */}
      <section id="about" className="reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-text stagger-children">
              <p>I am a Diploma in Information Technology student with a strong passion for web development and modern technology.</p>
              <p>My interest in technology began with a curiosity about how websites and online systems work, which gradually developed into a commitment to creating responsive, user-friendly, and efficient digital experiences.</p>
              <p>Outside of coding, I enjoy exploring emerging technologies, improving my development skills, and working on creative web projects that expand my knowledge and experience.</p>
            </div>
            
            {/* ========== SKILL PROGRESS BARS ========== */}
            <div className="skills-section stagger-children">
              <h3 className="skills-title">My Skills Proficiency</h3>
              
              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">React</span>
                  <span className="skill-percent">75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill react-fill" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">HTML & CSS</span>
                  <span className="skill-percent">90%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill html-fill" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">JavaScript</span>
                  <span className="skill-percent">70%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill js-fill" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">Node.js</span>
                  <span className="skill-percent">60%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill node-fill" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">TypeScript</span>
                  <span className="skill-percent">55%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill ts-fill" style={{ width: '55%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">Vite</span>
                  <span className="skill-percent">80%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill vite-fill" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">Supabase</span>
                  <span className="skill-percent">65%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill supabase-fill" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">Figma</span>
                  <span className="skill-percent">70%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill figma-fill" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">Git & GitHub</span>
                  <span className="skill-percent">75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill git-fill" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </section>
      

        {/* ========== OTHER EXPERIENCES SECTION ========== */}
      <section id="experiences" className="reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">Other Experiences</h2>
          <div className="experiences-grid">
            
            {/* Experience 1: Qualfon */}
            <div className="experience-card">
              <div className="experience-icon">💼</div>
              <h3>Customer Service Representative</h3>
              <div className="experience-company">Qualfon</div>
              <div className="experience-duration">📅 3 months</div>
              <p>Provided exceptional customer support, handled inquiries, resolved complaints, and maintained high customer satisfaction ratings. Developed strong communication and problem-solving skills in a fast-paced environment.</p>
              <div className="experience-tags">
                <span>Customer Support</span>
                <span>Communication</span>
                <span>Problem Solving</span>
              </div>
            </div>

            {/* Experience 2: Inspiro */}
            <div className="experience-card">
              <div className="experience-icon">🖥️</div>
              <h3>IT Intern</h3>
              <div className="experience-company">Inspiro</div>
              <div className="experience-duration">📅 300 hours</div>
              <p>Assisted in IT infrastructure management, provided technical support, troubleshooting hardware/software issues, and contributed to system maintenance. Gained hands-on experience in real-world IT operations.</p>
              <div className="experience-tags">
                <span>Technical Support</span>
                <span>Troubleshooting</span>
                <span>IT Operations</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ========== PROJECTS SECTION (Dynamic from Supabase) ========== */}
      <section id="projects">
        <div className="container">
          <h2 className="section-title reveal-on-scroll">Featured Projects</h2>
          
          {/* Show error message if any */}
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
              <p>Have a project in mind? I'd love to hear about it. Whether it's a startup, a personal project, or just a chat — reach out!</p>
              <div className="contact-details">
                <p>📧 salburoarchie2005@gmail.com</p>
                <p>📱 +63963-171-9447</p>
                <p>🌍 Philippines</p>
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