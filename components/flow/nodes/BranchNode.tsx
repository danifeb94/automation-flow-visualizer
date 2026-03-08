import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

interface BranchNodeProps {
    data: {
        label: string;
        config?: {
            condition?: string;
        };
    };
    selected?: boolean;
}

const BranchNode: React.FC<BranchNodeProps> = ({ data, selected }) => {
    return (
        <div className={`min-w-[220px] shadow-xl rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border transition-[box-shadow,transform,border-color,background-color] duration-300 overflow-hidden ${selected ? 'border-purple-500 shadow-purple-500/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-500/50'}`}>
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3.5 !h-3.5 !bg-slate-300 dark:!bg-slate-600 !border-2 !border-white dark:!border-slate-800 shadow-sm"
            />

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-400 p-2.5 flex items-center gap-2">
                <GitBranch size={16} className="text-white" />
                <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">
                    Branch
                </span>
            </div>

            {/* Body */}
            <div className="p-4 bg-transparent space-y-2.5">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{data.label}</div>
                <div className="text-[10px] font-mono bg-slate-50/80 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50 text-center flex items-center justify-center gap-1.5">
                    <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[8px]">IF</span>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold truncate">{data.config?.condition || 'condition == true'}</span>
                </div>
            </div>

            {/* Dual Output Handles */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="true"
                style={{ left: '30%', background: '#22c55e' }} // Green for True
                className="!w-3.5 !h-3.5 !border-2 !border-white dark:!border-slate-800 shadow-sm hover:scale-125 transition-transform"
            />

            <Handle
                type="source"
                position={Position.Bottom}
                id="false"
                style={{ left: '70%', background: '#ef4444' }} // Red for False
                className="!w-3.5 !h-3.5 !border-2 !border-white dark:!border-slate-800 shadow-sm hover:scale-125 transition-transform"
            />

            {/* Floating Labels for Handles */}
            <div className="flex justify-between px-6 pb-2 text-[9px] font-extrabold uppercase tracking-widest">
                <span className="text-green-500 dark:text-green-400 bg-green-50/50 dark:bg-transparent px-1.5 py-0.5 rounded">Yes</span>
                <span className="text-red-500 dark:text-red-400 bg-red-50/50 dark:bg-transparent px-1.5 py-0.5 rounded">No</span>
            </div>
        </div>
    );
};

export default memo(BranchNode);
