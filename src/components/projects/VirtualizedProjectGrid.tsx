import React, { useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { ProjectInfo } from '@/types/models';
import ProjectCard from './ProjectCard';

interface VirtualizedProjectGridProps {
  projects: ProjectInfo[];
  onSelectProject: (id: string) => void;
  containerHeight?: number;
  containerWidth?: number;
}

interface GridItemProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    projects: ProjectInfo[];
    onSelectProject: (id: string) => void;
    columnsPerRow: number;
  };
}

const GridItem: React.FC<GridItemProps> = ({ columnIndex, rowIndex, style, data }) => {
  const { projects, onSelectProject, columnsPerRow } = data;
  const index = rowIndex * columnsPerRow + columnIndex;
  const project = projects[index];

  if (!project) {
    return <div style={style} />;
  }

  return (
    <div style={{ ...style, padding: '12px' }}>
      <ProjectCard
        project={project}
        onSelect={onSelectProject}
      />
    </div>
  );
};

const VirtualizedProjectGrid: React.FC<VirtualizedProjectGridProps> = ({
  projects,
  onSelectProject,
  containerHeight = 800,
  containerWidth = 1200
}) => {
  const { columnsPerRow, rowCount, columnWidth, rowHeight } = useMemo(() => {
    // Calcul dynamique du nombre de colonnes selon la largeur
    const minCardWidth = 350;
    const gap = 24;
    const cols = Math.max(1, Math.floor((containerWidth - gap) / (minCardWidth + gap)));
    const rows = Math.ceil(projects.length / cols);
    const colWidth = (containerWidth - (gap * (cols + 1))) / cols;
    const rowHeight = 400; // Hauteur fixe pour les cartes

    return {
      columnsPerRow: cols,
      rowCount: rows,
      columnWidth: colWidth,
      rowHeight: rowHeight
    };
  }, [projects.length, containerWidth]);

  const itemData = useMemo(() => ({
    projects,
    onSelectProject,
    columnsPerRow
  }), [projects, onSelectProject, columnsPerRow]);

  if (projects.length === 0) {
    return null;
  }

  return (
    <Grid
      height={Math.min(containerHeight, rowCount * rowHeight)}
      width={containerWidth}
      columnCount={columnsPerRow}
      columnWidth={columnWidth}
      rowCount={rowCount}
      rowHeight={rowHeight}
      itemData={itemData}
      overscanRowCount={2}
      overscanColumnCount={1}
    >
      {GridItem}
    </Grid>
  );
};

export default VirtualizedProjectGrid;