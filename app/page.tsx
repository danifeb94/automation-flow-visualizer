'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';

// Import Custom Nodes & Store
import TriggerNode from '@/components/flow/nodes/TriggerNode';
import ActionNode from '@/components/flow/nodes/ActionNode';
import HttpNode from '@/components/flow/nodes/HttpNode';
import BranchNode from '@/components/flow/nodes/BranchNode';
import LoopNode from '@/components/flow/nodes/LoopNode';
import SlackNode from '@/components/flow/nodes/SlackNode';
import EmailNode from '@/components/flow/nodes/EmailNode';
import DatabaseNode from '@/components/flow/nodes/DatabaseNode';
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
  Download,
  Globe,
  GitBranch,
  Repeat,
  Trash2,
  Hash,
  Mail,
  Undo2,
  Redo2,
  Sun,
  Moon
} from 'lucide-react';

function FlowEditor() {
  const {
    nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, updateNodeData,
    removeNode, activeNodeId, setActiveNodeId, undo, redo, past, future
  } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = useMemo(() => ({
    trigger: TriggerNode,
    action: ActionNode,
    http: HttpNode,
    branch: BranchNode,
    loop: LoopNode,
    slack: SlackNode,
    email: EmailNode,
    database: DatabaseNode,
  }), []);

  const [isClient, setIsClient] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Menggunakan 'any' untuk mematikan pengecekan tipe data yang menghambat build di Vercel
  const selectedNode = nodes.find((node) => node.selected) as any;

  // Fungsi Pembantu Validasi yang digunakan oleh Export dan Simulate
  const validateWorkflow = (): boolean => {
    for (const node of nodes) {
      const type = node.type;
      const config: any = node.data.config || {};
      const label = node.data.label;

      if (type === 'trigger' && !config.cron) {
        alert(`Validation Error: Node "${label}" (Trigger) requires a Cron Schedule.`);
        return false;
      }
      if (type === 'action' && !config.command) {
        alert(`Validation Error: Node "${label}" (Action) requires a Script/Command.`);
        return false;
      }
      if (type === 'http' && !config.url) {
        alert(`Validation Error: Node "${label}" (HTTP Request) requires an Endpoint URL.`);
        return false;
      }
      if (type === 'branch' && !config.condition) {
        alert(`Validation Error: Node "${label}" (Branching) requires a Condition.`);
        return false;
      }
      if (type === 'loop' && !config.collection) {
        alert(`Validation Error: Node "${label}" (Loop) requires a Target Array/Collection.`);
        return false;
      }
      if (type === 'slack' && !config.webhookUrl) {
        alert(`Validation Error: Node "${label}" (Slack) requires a Webhook URL.`);
        return false;
      }
      if (type === 'email' && (!config.to || !config.body)) {
        alert(`Validation Error: Node "${label}" (Email) requires To and Body fields.`);
        return false;
      }
      if (type === 'database' && (!config.connectionString || !config.query)) {
        alert(`Validation Error: Node "${label}" (Database) requires Connection String and Query.`);
        return false;
      }
    }
    return true;
  };

  // --- Fitur Export ke JSON ---
  const handleExport = () => {
    // 1. Pre-flight Validation Check
    if (!validateWorkflow()) return;

    // 2. Format JSON Data
    const workflowData = {
      project_name: "Automation Workflow Export",
      developer: "Dani",
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

  // --- Fitur Simulasi Integrasi API ---
  const handleSimulation = async () => {
    // 1. Validasi
    if (!validateWorkflow()) return;

    // 2. Format Payload (Sama dengan Export)
    const workflowData = {
      project_name: "Automation Workflow Simulation",
      developer: "Dani",
      canvas_data: {
        nodes: nodes.map(n => ({ id: n.id, type: n.type, label: n.data.label, config: n.data.config })),
        edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target }))
      }
    };

    // 3. Visual Animation Loop (Simulating Execution)
    setIsSimulating(true);
    for (const node of nodes) {
      setActiveNodeId(node.id);
      // Tunggu 500ms per node untuk efek visual
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setActiveNodeId(null); // Reset setelah selesai animasi

    // 4. Panggil API Mock Backend
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        alert(`✅ SIMULATION SUCCESS: ${result.message} (${result.data_received})`);
      } else {
        alert(`❌ SIMULATION FAILED: ${result.message}`);
      }
    } catch (error) {
      alert(`❌ ERROR: Failed to connect to simulation server.`);
    } finally {
      setIsSimulating(false);
    }
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

    let config = {};
    if (type === 'trigger') config = { cron: '* * * * *' };
    else if (type === 'action') config = { plugin: 'ssh_exec', command: '' };
    else if (type === 'http') config = { method: 'GET', url: '' };
    else if (type === 'branch') config = { condition: 'status == 200' };
    else if (type === 'loop') config = { loopType: 'For Each', collection: '' };
    else if (type === 'slack') config = { webhookUrl: '', channel: '#general', message: '' };
    else if (type === 'email') config = { to: '', subject: '', body: '' };
    else if (type === 'database') config = { connectionString: '', query: '' };

    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      position,
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        config
      },
    };

    setNodes([...nodes, newNode]);
  }, [screenToFlowPosition, nodes, setNodes]);

  const onConnectNode = useCallback((connection: any) => {
    // Validate connections:
    // rule 1: Target cannot be a trigger (Trigger is always the start of a flow)
    const targetNode = nodes.find(n => n.id === connection.target);
    if (targetNode?.type === 'trigger') {
      alert("Validation Error: Cannot connect an output to a Trigger node.");
      return;
    }

    // rule 2: Action cannot be connected to itself (circular check, basic)
    if (connection.source === connection.target) {
      alert("Validation Error: Node cannot connect to itself.");
      return;
    }

    onConnect(connection);
  }, [nodes, onConnect]);

  return (
    <div className="relative h-screen w-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      {/* FLOATING HEADER */}
      <header className="absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl flex h-14 items-center justify-between rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-6 shadow-sm border border-white/40 dark:border-white/10 z-50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-1.5 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Settings2 size={18} />
          </div>
          <div>
            <h1 className="text-[13px] font-extrabold tracking-tight text-slate-800 dark:text-white leading-none">AUTOMATION V1.0</h1>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold mt-0.5 uppercase tracking-widest text-left">Workflow Orchestrator</p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex border-r border-slate-200 dark:border-slate-700 pr-3 mr-1 gap-1">
            <button
              onClick={undo}
              disabled={isSimulating || past.length === 0}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={redo}
              disabled={isSimulating || future.length === 0}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={16} />
            </button>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 mr-1 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={handleExport}
            disabled={isSimulating}
            className="flex items-center gap-2 rounded-xl bg-white/50 dark:bg-slate-800/50 px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 disabled:opacity-50 border border-slate-200/50 dark:border-slate-700/50"
          >
            <Download size={14} /> Export JSON
          </button>

          <button
            onClick={handleSimulation}
            disabled={isSimulating}
            className={`flex items-center gap-2 rounded-xl px-5 py-1.5 text-xs font-bold text-white transition-all shadow-lg active:scale-95
              ${isSimulating ? 'bg-indigo-400 animate-pulse cursor-not-allowed shadow-indigo-200' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-300/50'}
            `}
          >
            <Play size={14} className={isSimulating ? 'animate-spin' : ''} />
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>
      </header>

      {/* FLOATING LEFT SIDEBAR - NODE LIBRARY */}
      <aside className="absolute top-24 left-6 w-64 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 dark:border-white/10 p-5 flex flex-col gap-6 z-40 max-h-[calc(100vh-8rem)] overflow-y-auto hidden md:flex transition-colors duration-300">
        <h2 className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Node Library</h2>
        <div className="space-y-3">
          <div
            className="group flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all bg-white dark:bg-slate-800/50"
            draggable onDragStart={(e) => onDragStart(e, 'trigger')}
          >
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Database size={16} /></div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Trigger</span>
          </div>

          <div
            className="group flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all bg-white dark:bg-slate-800/50"
            draggable onDragStart={(e) => onDragStart(e, 'action')}
          >
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Zap size={16} /></div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Action</span>
          </div>

          <div
            className="group flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md transition-all bg-white dark:bg-slate-800/50"
            draggable onDragStart={(e) => onDragStart(e, 'http')}
          >
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-500 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors"><Globe size={16} /></div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">HTTP Request</span>
          </div>

          <div
            className="group flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all bg-white dark:bg-slate-800/50"
            draggable onDragStart={(e) => onDragStart(e, 'branch')}
          >
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-500 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors"><GitBranch size={16} /></div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Branching</span>
          </div>

          <div
            className="group flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all bg-white dark:bg-slate-800/50"
            draggable onDragStart={(e) => onDragStart(e, 'loop')}
          >
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors"><Repeat size={16} /></div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Loop Array</span>
          </div>

          <div
            className="group flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 hover:border-[#4A154B] dark:hover:border-pink-500 hover:shadow-md transition-all bg-white dark:bg-slate-800/50"
            draggable onDragStart={(e) => onDragStart(e, 'slack')}
          >
            <div className="p-2 rounded-lg bg-[#f0e6f0] dark:bg-pink-500/10 text-[#4A154B] dark:text-pink-400 group-hover:bg-[#4A154B] group-hover:text-white transition-colors"><Hash size={16} /></div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Slack</span>
          </div>

          <div
            className="group flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 hover:border-rose-500 dark:hover:border-rose-500 hover:shadow-md transition-all bg-white dark:bg-slate-800/50"
            draggable onDragStart={(e) => onDragStart(e, 'email')}
          >
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors"><Mail size={16} /></div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Email</span>
          </div>

          <div
            className="group flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 hover:border-slate-700 dark:hover:border-slate-500 hover:shadow-md transition-all bg-white dark:bg-slate-800/50"
            draggable onDragStart={(e) => onDragStart(e, 'database')}
          >
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/30 text-slate-700 dark:text-slate-300 group-hover:bg-slate-700 group-hover:text-white transition-colors"><Database size={16} /></div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Database</span>
          </div>
        </div>
      </aside>

      {/* FULL SCREEN CANVAS */}
      <main className="absolute inset-0 z-0">
        {isClient && (
          <ReactFlow
            nodes={nodes.map((n) => ({
              ...n,
              className: n.id === activeNodeId
                ? `${n.className || ''} ring-4 ring-indigo-500 rounded-2xl shadow-2xl shadow-indigo-400/50 scale-105 z-50 transition-[box-shadow,transform] duration-300`
                : `${n.className || ''} ${activeNodeId ? 'opacity-40 grayscale' : 'opacity-100 grayscale-0'} [&:not(.dragging)]:transition-[opacity,filter] duration-300`
            }))}
            edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnectNode}
            nodeTypes={nodeTypes} onDrop={onDrop} onDragOver={onDragOver}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Background color={theme === 'dark' ? '#334155' : '#cbd5e1'} gap={24} size={2} variant={BackgroundVariant.Dots} />
            <Controls className="!bg-white/80 dark:!bg-slate-800/80 !backdrop-blur-md !border-none !shadow-lg !rounded-xl mb-6 ml-6 [&_button]:!bg-transparent [&_button]:!border-b-slate-200/50 dark:[&_button]:!border-b-slate-700/50 hover:[&_button]:!bg-slate-100 dark:hover:[&_button]:!bg-slate-700/50 [&_path]:!fill-slate-700 dark:[&_path]:!fill-slate-300" />
            <MiniMap
              className="!bg-white/80 dark:!bg-slate-800/80 !backdrop-blur-md !border-none !shadow-xl !rounded-2xl mb-6 mr-6 overflow-hidden"
              maskColor={theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(248, 250, 252, 0.7)'}
              nodeColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
            />
          </ReactFlow>
        )}
      </main>

      {/* FLOATING RIGHT SIDEBAR - CONFIGURATION */}
      {selectedNode && (
        <aside className="absolute top-24 right-6 w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 dark:border-white/10 p-6 flex flex-col z-40 max-h-[calc(100vh-12rem)] overflow-y-auto animate-in fade-in slide-in-from-right-8 duration-300 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Configuration</h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold tracking-wider">{selectedNode.type}</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400"
                value={selectedNode.data?.label || ''}
                onChange={(e) => handleLabelChange(e.target.value)}
              />
            </div>
            {selectedNode.type === 'trigger' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-amber-600 uppercase">Cron Schedule</label>
                <input
                  type="text" className="w-full px-4 py-2 bg-amber-50/30 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-lg text-sm font-mono dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-amber-300/50"
                  value={selectedNode.data?.config?.cron || ''}
                  onChange={(e) => handleConfigChange('cron', e.target.value)}
                />
              </div>
            )}
            {selectedNode.type === 'action' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-blue-600 uppercase">Script</label>
                <textarea
                  className="w-full px-4 py-2 bg-blue-50/30 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-lg text-sm font-mono h-40 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-blue-300/50"
                  value={selectedNode.data?.config?.command || ''}
                  onChange={(e) => handleConfigChange('command', e.target.value)}
                />
              </div>
            )}
            {selectedNode.type === 'http' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-teal-600 uppercase">HTTP Method</label>
                  <select
                    className="w-full px-4 py-2 bg-teal-50/30 dark:bg-teal-500/5 border border-teal-100 dark:border-teal-500/20 rounded-lg text-sm outline-none dark:text-teal-100 focus:ring-2 focus:ring-teal-500/30 transition-all"
                    value={selectedNode.data?.config?.method || 'GET'}
                    onChange={(e) => handleConfigChange('method', e.target.value)}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-teal-600 uppercase">Endpoint URL</label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 bg-teal-50/30 dark:bg-teal-500/5 border border-teal-100 dark:border-teal-500/20 rounded-lg text-sm font-mono dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all placeholder:text-teal-300/50"
                    placeholder="https://api.example.com/v1/users"
                    value={selectedNode.data?.config?.url || ''}
                    onChange={(e) => handleConfigChange('url', e.target.value)}
                  />
                </div>
              </>
            )}
            {selectedNode.type === 'branch' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-600 uppercase">Condition (If statement)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-purple-50/30 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/20 rounded-lg text-sm font-mono dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder:text-purple-300/50"
                  placeholder="status == 200"
                  value={selectedNode.data?.config?.condition || ''}
                  onChange={(e) => handleConfigChange('condition', e.target.value)}
                />
                <p className="text-[10px] text-slate-400">Node akan bercabang jika kondisi di atas benar.</p>
              </div>
            )}
            {selectedNode.type === 'loop' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-indigo-600 uppercase">Loop Type</label>
                  <select
                    className="w-full px-4 py-2 bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-lg text-sm outline-none dark:text-indigo-100 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    value={selectedNode.data?.config?.loopType || 'For Each'}
                    onChange={(e) => handleConfigChange('loopType', e.target.value)}
                  >
                    <option value="For Each">For Each Array Item</option>
                    <option value="While">While Condition is True</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-indigo-600 uppercase">Target Array / Condition</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-lg text-sm font-mono dark:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-indigo-300/50"
                    placeholder="e.g. usersList or count < 5"
                    value={selectedNode.data?.config?.collection || ''}
                    onChange={(e) => handleConfigChange('collection', e.target.value)}
                  />
                </div>
              </>
            )}
            {selectedNode.type === 'slack' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#4A154B] uppercase">Webhook URL</label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 bg-[#f0e6f0]/30 dark:bg-[#4A154B]/10 border border-[#f0e6f0] dark:border-[#4A154B]/30 rounded-lg text-sm outline-none dark:text-pink-100 focus:ring-2 focus:ring-[#4A154B]/40 transition-all placeholder:text-[#4A154B]/50 dark:placeholder:text-[#4A154B]"
                    placeholder="https://hooks.slack.com/..."
                    value={selectedNode.data?.config?.webhookUrl || ''}
                    onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#4A154B] dark:text-pink-400 uppercase">Channel</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-[#f0e6f0]/30 dark:bg-[#4A154B]/10 border border-[#f0e6f0] dark:border-[#4A154B]/30 rounded-lg text-sm outline-none dark:text-pink-100 focus:ring-2 focus:ring-[#4A154B]/40 transition-all placeholder:text-[#4A154B]/50 dark:placeholder:text-[#4A154B]"
                    placeholder="#general"
                    value={selectedNode.data?.config?.channel || ''}
                    onChange={(e) => handleConfigChange('channel', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#4A154B] dark:text-pink-400 uppercase">Message</label>
                  <textarea
                    className="w-full px-4 py-2 bg-[#f0e6f0]/30 dark:bg-[#4A154B]/10 border border-[#f0e6f0] dark:border-[#4A154B]/30 rounded-lg text-sm h-24 outline-none dark:text-pink-100 focus:ring-2 focus:ring-[#4A154B]/40 transition-all placeholder:text-[#4A154B]/50 dark:placeholder:text-[#4A154B]"
                    placeholder="Hello team!"
                    value={selectedNode.data?.config?.message || ''}
                    onChange={(e) => handleConfigChange('message', e.target.value)}
                  />
                </div>
              </>
            )}
            {selectedNode.type === 'email' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-rose-600 uppercase">To Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-rose-50/30 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 rounded-lg text-sm outline-none dark:text-rose-100 focus:ring-2 focus:ring-rose-500/30 transition-all placeholder:text-rose-300/50"
                    placeholder="user@example.com"
                    value={selectedNode.data?.config?.to || ''}
                    onChange={(e) => handleConfigChange('to', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-rose-600 uppercase">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-rose-50/30 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 rounded-lg text-sm outline-none dark:text-rose-100 focus:ring-2 focus:ring-rose-500/30 transition-all placeholder:text-rose-300/50"
                    placeholder="Notification"
                    value={selectedNode.data?.config?.subject || ''}
                    onChange={(e) => handleConfigChange('subject', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-rose-600 uppercase">Body</label>
                  <textarea
                    className="w-full px-4 py-2 bg-rose-50/30 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 rounded-lg text-sm h-32 outline-none dark:text-rose-100 focus:ring-2 focus:ring-rose-500/30 transition-all placeholder:text-rose-300/50"
                    placeholder="Email content..."
                    value={selectedNode.data?.config?.body || ''}
                    onChange={(e) => handleConfigChange('body', e.target.value)}
                  />
                </div>
              </>
            )}
            {selectedNode.type === 'database' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Connection String</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-lg text-sm font-mono outline-none dark:text-slate-200 focus:ring-2 focus:ring-slate-500/40 transition-all placeholder:text-slate-400"
                    placeholder="postgres://user:pass@host:5432/db"
                    value={selectedNode.data?.config?.connectionString || ''}
                    onChange={(e) => handleConfigChange('connectionString', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 uppercase">SQL Query</label>
                  <textarea
                    className="w-full px-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-lg text-sm font-mono h-32 outline-none dark:text-slate-200 focus:ring-2 focus:ring-slate-500/40 transition-all placeholder:text-slate-400"
                    placeholder="SELECT * FROM users;"
                    value={selectedNode.data?.config?.query || ''}
                    onChange={(e) => handleConfigChange('query', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Tombol Hapus Node */}
            <div className="pt-6 border-t border-slate-100/50 dark:border-slate-800 mt-8 !mb-2">
              <button
                onClick={() => removeNode(selectedNode.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50/50 dark:bg-red-500/5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-xl text-xs font-bold transition-all border border-red-100/50 dark:border-red-500/20 hover:border-red-200 dark:hover:border-red-500/30 hover:shadow-sm"
              >
                <Trash2 size={14} /> Hapus Blok Ini
              </button>
            </div>
          </div>
        </aside>
      )}
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
