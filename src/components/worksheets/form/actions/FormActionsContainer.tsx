
import React from 'react';

interface FormActionsContainerProps {
  children: React.ReactNode;
}

const FormActionsContainer: React.FC<FormActionsContainerProps> = ({ children }) => {
  return (
    <div className="flex justify-between">
      {children}
    </div>
  );
};

export default FormActionsContainer;
