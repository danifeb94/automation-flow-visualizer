import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';

export default function ActionNode({ data }: any) {
  return (
    <div className="min-w-[150px] shadow-lg rounded-lg bg-white border-2 border-blue-500 overflow-hidden">
      {/* Target Handle agar bisa menerima input dari Trigger */}
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-slate-300" />
      
      <div className="bg-blue-500 p-2 flex items-center gap-2">
        <Zap size={14} className="text-white fill-white" />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Action</span>
      </div>
      
      <div className="p-3 bg-white">
        <div className="text-sm font-semibold text-slate-700">{data.label}</div>
        <div className="text-[9px] text-blue-600 font-mono mt-1 bg-blue-50 px-1 rounded inline-block">
          {data.config?.plugin || 'No Action Selected'}
        </div>
      </div>

      {/* Source Handle agar bisa lanjut ke aksi berikutnya */}
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-blue-500" />
    </div>
  );
}
