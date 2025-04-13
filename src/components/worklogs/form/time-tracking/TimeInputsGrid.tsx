
import React from 'react';
import TimeInput from './TimeInput';

const TimeInputsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      <TimeInput name="departure" label="Départ" />
      <TimeInput name="arrival" label="Arrivée" />
      <TimeInput name="end" label="Fin de chantier" />
      <TimeInput name="breakTime" label="Pause (hh:mm)" />
    </div>
  );
};

export default TimeInputsGrid;
