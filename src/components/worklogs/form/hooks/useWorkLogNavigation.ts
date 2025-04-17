
import { useNavigate } from 'react-router-dom';

export const useWorkLogNavigation = () => {
  const navigate = useNavigate();
  
  const handleCancel = () => {
    navigate('/worklogs');
  };

  return {
    handleCancel
  };
};
