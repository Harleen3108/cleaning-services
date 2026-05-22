import React from 'react';

const team = [
  { name: 'Alen Walker', role: 'Clean Specialist', img: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=250&auto=format&fit=crop' },
  { name: 'Leslie Alexander', role: 'Pest Controller', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop' },
  { name: 'Wade Warren', role: 'Villa Super Clean', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop' },
];

const Team = () => (
  <section className="team-members-section">
    <div className="container">
      <span className="section-label">EXPERT CREW</span>
      <h2 className="section-title">Our Professional Expert Team</h2>
      <div className="team-grid">
        {team.map((m) => (
          <div className="team-card" key={m.name}>
            <img src={m.img} alt={m.name} />
            <h4>{m.name}</h4>
            <p>{m.role}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Team;
