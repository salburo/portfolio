import React from 'react';
import './Hero.css';

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">✨ Welcome to my digital space</div>
          <h1>
            Hi, I'm <span className="gradient-text">Alex Rivera</span>
          </h1>
          <h2>Creative Developer & UI Engineer</h2>
          <p>
            I craft beautiful, performant web experiences with modern
            technologies. Let's build something amazing together.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={scrollToProjects}>
              View My Work
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Let's Talk
            </button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="floating-shape shape1"></div>
          <div className="floating-shape shape2"></div>
          <div className="floating-shape shape3"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;