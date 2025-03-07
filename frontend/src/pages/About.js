import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About EcoDrive</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="mb-4">
          EcoDrive is a sustainable carpooling platform designed to reduce carbon emissions
          and make transportation more efficient and environmentally friendly.
        </p>
        <p className="mb-4">
          Our mission is to connect drivers and passengers who share similar routes,
          helping to reduce traffic congestion and promote a more sustainable future.
        </p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Our Goals</h2>
          <ul className="list-disc pl-6">
            <li className="mb-2">Reduce carbon emissions through carpooling</li>
            <li className="mb-2">Build a community of environmentally conscious travelers</li>
            <li className="mb-2">Make transportation more affordable and efficient</li>
            <li className="mb-2">Decrease traffic congestion in urban areas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
