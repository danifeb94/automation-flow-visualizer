'use client';

import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
  Node, // Import Node untuk typing
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import Custom Nodes & Store
import TriggerNode from '@/components/flow/nodes/TriggerNode';
import ActionNode from '@/components/flow/nodes/ActionNode';
import { useWorkflowStore } from '@/store/useWorkflowStore';

// Icons
import { 
  Settings2, 
  Play, 
  Save, 
  Database, 
  Zap, 
  Info, 
  MousePointer2,
  Download
} from 'lucide-react';

// 1. Definisikan struktur data node agar TypeScript tidak bingung
interface WorkflowNodeData {
  label: string;
  config?: {
    cron?: string;
    command?: string;
    plugin?: string;
  };
  [key: string]: any; // Allow for other dynamic data
}

function FlowEditor() {
  const { 
    nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, updateNodeData 
  } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = useMemo(() => ({
    trigger: TriggerNode,
    action: ActionNode,
  }), []);

  // 2. Gunakan Type Casting agar TypeScript tahu data.label pasti string
  const selectedNode = nodes.find((node) => node.selected) as Node<WorkflowNodeData> | undefined;

  // --- Fitur Export ke JSON ---
  const handleExport = () => {
    const workflowData = {
      project_name: "Automation Workflow Export",
      developer: "Dani", //
      exported_at: new Date().toLocaleString(),
      canvas_data: {
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type,
          label: n.data.label,
          config: n.data.config
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target
        }))
      }
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLabelChange = (val: string) => {
    if (selectedNode) updateNodeData(selectedNode.id, { label: val });
  };

  const handleConfigChange = (key: string, val: string) => {
    if (selectedNode) {
      const currentConfig = selectedNode.data.config || {};
      updateNodeData(selectedNode.id, { 
        config: { ...currentConfig, [key]: val } 
      });
    }
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    
    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      position,
      data: { 
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        config: type === 'trigger' ? { cron: '* * * * *' } : { plugin: 'ssh_exec', command: '' }
      },
    };
    
    setNodes([...nodes, newNode]);
  }, [screenToFlowPosition, nodes, setNodes]);

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="flex h-14 items-center justify-between border-b bg-white px-6 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Settings2 size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800 leading-none">AUTOMATION V1.0</h1>
            <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Workflow Orchestrator</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95"
          >
            <Download size={14} /> Export JSON
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95">
            <Play size={14} /> Run Simulation
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-white p-5 flex flex-col gap-6">
          <div>
            <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Node Library</h2>
            <div className="space-y-3">
              <div 
                className="group flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-amber-500 hover:shadow-md transition-all bg-white"
                draggable onDragStart={(e) => onDragStart(e, 'trigger')}
              >
                <div className="p-2 rounded-lg bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Database size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Trigger</span>
                  <span className="text-[9px] text-slate-400 italic">Cron / Event</span>
                </div>
              </div>

              <div 
                className="group flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-blue-500 hover:shadow-md transition-all bg-white"
                draggable onDragStart={(e) => onDragStart(e, 'action')}
              >
                <div className="p-2 rounded-lg bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Zap size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Action</span>
                  <span className="text-[9px] text-slate-400 italic">SSH / HTTP</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 relative bg-[#f8fafc]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background 
              color="#e2e8f0" 
              gap={30} 
              variant={BackgroundVariant.Dots} 
            />
            <Controls />
            <MiniMap 
              style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} 
              zoomable pannable 
            />
          </ReactFlow>
        </main>

        <aside className="w-80 border-l bg-white p-6 overflow-y-auto">
          <h2 className="mb-6 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Configuration</h2>
          
          {selectedNode ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Display Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                  // 3. Tambahkan "as string" untuk memastikan tipe datanya benar
                  value={(selectedNode.data.label as string) || ''} 
                  onChange={(e) => handleLabelChange(e.target.value)}
                />
              </div>

              {selectedNode.type === 'trigger' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Cron Schedule</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-amber-50/30 border border-amber-100 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-sm"
                    placeholder="* * * * *"
                    value={(selectedNode.data.config?.cron as string) || ''} 
                    onChange={(e) => handleConfigChange('cron', e.target.value)}
                  />
                </div>
              )}

              {selectedNode.type === 'action' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Execution Script</label>
                  <textarea 
                    className="w-full px-4 py-2 bg-blue-50/30 border border-blue-100 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all h-40 resize-none shadow-sm"
                    placeholder="#!/bin/bash..."
                    value={(selectedNode.data.config?.command as string) || ''} 
                    onChange={(e) => handleConfigChange('command', e.target.value)}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-60">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 mb-4 border border-slate-100">
                <MousePointer2 size={24} />
              </div>
              <p className="text-xs text-slate-400 font-medium px-6 leading-relaxed">
                Pilih sebuah blok di canvas untuk mengatur konfigurasi eksekusinya.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
}
