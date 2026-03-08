import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  removeNode: (nodeId: string) => void;
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;

  // History State
  past: { nodes: Node[]; edges: Edge[] }[];
  future: { nodes: Node[]; edges: Edge[] }[];
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      nodes: [
        {
          id: 'start',
          type: 'trigger',
          position: { x: 250, y: 50 },
          data: {
            label: 'Start Automation',
            config: { cron: '* * * * *' }
          },
          selected: false
        }
      ],
      edges: [],

      past: [],
      future: [],

      saveHistory: () => {
        set((state) => {
          // Limit history to 50 steps
          const newPast = [...state.past, { nodes: state.nodes, edges: state.edges }];
          if (newPast.length > 50) newPast.shift();

          return {
            past: newPast,
            future: []
          };
        });
      },

      undo: () => {
        set((state) => {
          if (state.past.length === 0) return state;

          const previous = state.past[state.past.length - 1];
          const newPast = state.past.slice(0, -1);

          return {
            nodes: previous.nodes,
            edges: previous.edges,
            past: newPast,
            future: [{ nodes: state.nodes, edges: state.edges }, ...state.future]
          };
        });
      },

      redo: () => {
        set((state) => {
          if (state.future.length === 0) return state;

          const next = state.future[0];
          const newFuture = state.future.slice(1);

          return {
            nodes: next.nodes,
            edges: next.edges,
            past: [...state.past, { nodes: state.nodes, edges: state.edges }],
            future: newFuture
          };
        });
      },

      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
      },

      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },

      onConnect: (connection) => {
        get().saveHistory();
        set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
      },

      setNodes: (nodes) => {
        get().saveHistory();
        set({ nodes });
      },
      setEdges: (edges) => set({ edges }),

      updateNodeData: (nodeId, newData) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              return { ...node, data: { ...node.data, ...newData } };
            }
            return node;
          }),
        });
      },

      removeNode: (nodeId) => {
        get().saveHistory();
        set({
          nodes: get().nodes.filter((node) => node.id !== nodeId),
          edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
        });
      },

      activeNodeId: null,
      setActiveNodeId: (id) => set({ activeNodeId: id }),
    }),
    {
      name: 'automation-visualizer-storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges
      }), // Only persist active nodes and edges, ignore history
    }
  )
);
