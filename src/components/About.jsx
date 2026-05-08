import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="reveal-on-scroll">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text stagger-children">
            <p>
              I'm a passionate developer with 5+ years of experience building
              web applications that users love.
            </p>
            <p>
              My journey started with a curiosity for how things work on the
              internet, and it evolved into a career focused on creating
              intuitive, performant digital experiences.
            </p>
            <p>
              When I'm not coding, you'll find me exploring new tech,
              contributing to open source, or mentoring aspiring developers.
            </p>
            <div className="skill-tags">
              <span>React</span>
              <span>Vue</span>
              <span>Node.js</span>
              <span>TypeScript</span>
              <span>Tailwind</span>
              <span>Figma</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;