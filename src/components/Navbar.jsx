import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo" onClick={() => scrollTo('home')}>
          &lt;Portfolio /&gt;
        </div>
        <div className="nav-links">
          <a
            href="#home"
            className={active === 'home' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              scrollTo('home');
            }}
          >
            Home
          </a>
          <a
            href="#about"
            className={active === 'about' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              scrollTo('about');
            }}
          >
            About
          </a>
          <a
            href="#projects"
            className={active === 'projects' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              scrollTo('projects');
            }}
          >
            Projects
          </a>
          <a
            href="#contact"
            className={active === 'contact' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              scrollTo('contact');
            }}
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;