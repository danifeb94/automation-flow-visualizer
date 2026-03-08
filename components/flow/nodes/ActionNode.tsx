import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';

export default function ActionNode({ data, selected }: any) {
  return (
    <div className={`min-w-[220px] shadow-xl rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border transition-[box-shadow,transform,border-color,background-color] duration-300 overflow-hidden ${selected ? 'border-blue-500 shadow-blue-500/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-500/50'}`}>
      {/* Target Handle agar bisa menerima input dari Trigger */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3.5 !h-3.5 !bg-slate-300 dark:!bg-slate-600 !border-2 !border-white dark:!border-slate-800 shadow-sm"
      />

      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-2.5 flex items-center gap-2">
        <Zap size={16} className="text-white fill-white/50" />
        <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">Action</span>
      </div>

      <div className="p-4 bg-transparent space-y-2.5">
        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{data.label}</div>
        <div className="flex bg-slate-50/80 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50 p-2 items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Run</span>
          <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400 truncate">{data.config?.plugin || 'No Action Selected'}</span>
        </div>
      </div>

      {/* Source Handle agar bisa lanjut ke aksi berikutnya */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3.5 !h-3.5 !bg-blue-500 !border-2 !border-white dark:!border-slate-800 shadow-sm hover:!bg-blue-600 transition-colors"
      />
    </div>
  );
}
