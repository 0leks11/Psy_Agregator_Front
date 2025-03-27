import React from 'react';
import { Link } from 'react-router-dom';

// Expects a therapist object prop: { id, user: { first_name, last_name }, experience_years, bio, profile_picture }
const TherapistCard = ({ therapist }) => {
  const defaultImage = '/path/to/default/avatar.png'; // Add a default avatar in public/assets

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', width: '300px', display: 'flex', flexDirection: 'column' }}>
      <img
        src={therapist.profile_picture || defaultImage}
        alt={`${therapist.user.first_name} ${therapist.user.last_name}`}
        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px' }}
      />
      <h3 style={{ textAlign: 'center', margin: '5px 0' }}>
        {therapist.user.first_name} {therapist.user.last_name}
      </h3>
      <p style={{ textAlign: 'center', color: '#555', fontSize: '0.9em' }}>
        {therapist.experience_years} years of experience
      </p>
      <p style={{ fontSize: '0.9em', flexGrow: 1, marginBottom: '15px' }}>
        {therapist.bio ? therapist.bio.substring(0, 100) + '...' : 'No bio provided.'} {/* Shorten bio */}
      </p>
      <Link
         to={`/therapists/${therapist.id}`}
         style={{ textDecoration: 'none', background: '#007bff', color: 'white', padding: '8px 12px', borderRadius: '4px', textAlign: 'center', display: 'block' }}
       >
         View Profile
      </Link>
    </div>
  );
};

export default TherapistCard;