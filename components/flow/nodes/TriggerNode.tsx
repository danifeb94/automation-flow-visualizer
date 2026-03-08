import { Handle, Position } from '@xyflow/react';
import { Clock } from 'lucide-react';

export default function TriggerNode({ data, selected }: any) {
  return (
    <div className={`min-w-[200px] shadow-xl rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border transition-[box-shadow,transform,border-color,background-color] duration-300 overflow-hidden ${selected ? 'border-amber-500 shadow-amber-500/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:border-amber-300 dark:hover:border-amber-500/50'}`}>
      {/* Handle Target (Input) di sisi kiri */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3.5 !h-3.5 !bg-slate-300 dark:!bg-slate-600 !border-2 !border-white dark:!border-slate-800 shadow-sm"
      />

      <div className="bg-gradient-to-r from-amber-500 to-amber-400 p-2.5 flex items-center gap-2">
        <Clock size={16} className="text-white" />
        <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">Trigger</span>
      </div>
      <div className="p-4 bg-transparent space-y-2.5">
        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{data.label}</div>
        <div className="flex bg-slate-50/80 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50 p-2 items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Cron</span>
          <span className="text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-500 truncate">{data.config?.cron || 'Not set'}</span>
        </div>
      </div>

      {/* Handle Source (Output) di sisi kanan */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3.5 !h-3.5 !bg-amber-400 !border-2 !border-white dark:!border-slate-800 hover:!bg-amber-500 transition-colors shadow-sm"
      />
    </div>
  );
}
