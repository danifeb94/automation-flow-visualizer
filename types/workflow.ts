export type NodeType = 'trigger' | 'action' | 'condition';

export interface NodeData {
  label: string;
  type: NodeType;
  config: {
    cron?: string;      // Untuk Trigger
    command?: string;   // Untuk SSH/Shell Action
    url?: string;       // Untuk HTTP Action
    method?: string;    // GET, POST, dll
  };
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
}
