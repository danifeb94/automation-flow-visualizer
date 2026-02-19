import { Handle, Position } from '@xyflow/react';
import { Clock } from 'lucide-react';

export default function TriggerNode({ data }: any) {
  return (
    <div className="min-w-[150px] shadow-lg rounded-lg bg-white border-2 border-amber-500 overflow-hidden">
      {/* Handle Target (Input) di sisi kiri */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-2 h-2 !bg-slate-300" 
      />

      <div className="bg-amber-500 p-2 flex items-center gap-2">
        <Clock size={14} className="text-white" />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Trigger</span>
      </div>
      <div className="p-3 bg-white">
        <div className="text-sm font-semibold text-slate-700">{data.label}</div>
        <div className="text-[10px] text-slate-400 mt-1 italic">{data.config?.cron || 'No schedule set'}</div>
      </div>

      {/* Handle Source (Output) di sisi kanan */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-2 h-2 !bg-amber-500" 
      />
    </div>
  );
}
