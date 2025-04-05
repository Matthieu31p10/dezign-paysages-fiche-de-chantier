
import React from 'react';
import { Navigate } from 'react-router-dom';
import WorkLogDetail from './detail/WorkLogDetail';

// This file simply redirects to the actual component in the detail folder
const WorkLogDetailWrapper = () => {
  return <WorkLogDetail />;
};

export default WorkLogDetailWrapper;
