import React from 'react';
import './Projects.css';

const projects = [
  {
    id: 1,
    title: 'AI Image Generator',
    description: 'Generate stunning images using artificial intelligence',
    tags: ['React', 'OpenAI', 'Tailwind'],
  },
  {
    id: 2,
    title: 'E-Commerce Platform',
    description: 'Full-stack shopping experience with real-time updates',
    tags: ['Next.js', 'Stripe', 'MongoDB'],
  },
  {
    id: 3,
    title: 'Portfolio 2025',
    description: 'Minimalist design with smooth animations',
    tags: ['Vite', 'Framer', 'CSS'],
  },
  {
    id: 4,
    title: 'TaskFlow',
    description: 'Productivity app with drag-and-drop boards',
    tags: ['Vue', 'Pinia', 'DnD'],
  },
];

const Projects = () => {
  return (
    <section id="projects">
      <div className="container">
        <h2 className="section-title reveal-on-scroll">Featured Projects</h2>
        <div className="projects-grid stagger-children">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <div className="image-placeholder"></div>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <button className="project-link">View Case Study →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;