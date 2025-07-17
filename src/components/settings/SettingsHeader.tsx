const SettingsHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-green-800">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de l'application
        </p>
      </div>
    </div>
  );
};

export default SettingsHeader;