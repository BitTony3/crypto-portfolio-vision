import React from 'react';
import Portfolio from '../components/Portfolio';

const Profile = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-primary">Your Profile</h1>
      <Portfolio />
    </div>
  );
};

export default Profile;