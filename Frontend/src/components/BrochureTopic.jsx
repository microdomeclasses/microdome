import React from 'react'
import Brochure from './Brochure.jsx';

const BrochureTopic = ({ topic, brochures }) => {
  return (
    <div className="mt-4">
      <div className="space-y-3">
        {brochures.map((note) => (
          <Brochure
            key={note.id || note.title}
            url={note.file}
            title={note.title}
          />
        ))}
      </div>
    </div>
  );
};

export default BrochureTopic;


