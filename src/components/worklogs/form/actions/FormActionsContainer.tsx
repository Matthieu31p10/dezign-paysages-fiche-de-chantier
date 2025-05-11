
import React from 'react';

interface FormActionsContainerProps {
  children: React.ReactNode;
}

const FormActionsContainer: React.FC<FormActionsContainerProps> = ({ children }) => {
  return (
    <div className="flex justify-between gap-4 mt-6">
      {children}
    </div>
  );
};

export default FormActionsContainer;
