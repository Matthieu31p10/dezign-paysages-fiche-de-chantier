
import React from 'react';
import AddTeamForm from './teams/AddTeamForm';
import TeamsTable from './teams/TeamsTable';

const TeamsManagement = () => {
  return (
    <div className="space-y-6">
      <AddTeamForm />
      <TeamsTable />
    </div>
  );
};

export default TeamsManagement;
