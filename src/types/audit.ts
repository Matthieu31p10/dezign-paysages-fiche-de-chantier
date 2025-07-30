export interface AuditEntry {
  id: string;
  entityType: 'project' | 'worklog' | 'blank_worksheet' | 'personnel' | 'team';
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'archive' | 'restore';
  changes: Record<string, {
    before: any;
    after: any;
  }>;
  userId: string;
  userEmail?: string;
  userName?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AuditLog {
  entries: AuditEntry[];
  totalCount: number;
}

export interface EntityVersion {
  id: string;
  entityType: string;
  entityId: string;
  version: number;
  data: Record<string, any>;
  createdBy: string;
  createdAt: string;
  changes: Record<string, any>;
}