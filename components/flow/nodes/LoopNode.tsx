import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Repeat } from 'lucide-react';

interface LoopNodeProps {
    data: {
        label: string;
        config?: {
            loopType?: string;
            collection?: string;
        };
    };
    selected?: boolean;
}

const LoopNode: React.FC<LoopNodeProps> = ({ data, selected }) => {
    return (
        <div className={`min-w-[220px] shadow-xl rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border transition-[box-shadow,transform,border-color,background-color] duration-300 overflow-hidden ${selected ? 'border-indigo-500 shadow-indigo-500/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-500/50'}`}>
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3.5 !h-3.5 !bg-slate-300 dark:!bg-slate-600 !border-2 !border-white dark:!border-slate-800 shadow-sm"
            />

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 p-2.5 flex items-center gap-2">
                <Repeat size={16} className="text-white" />
                <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">
                    Loop Array
                </span>
            </div>

            {/* Body */}
            <div className="p-4 bg-transparent space-y-2.5">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{data.label}</div>
                <div className="text-[10px] font-mono bg-slate-50/80 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50 flex flex-col items-center">
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold mb-1 uppercase tracking-wider text-[9px]">{data.config?.loopType || 'For Each'}</span>
                    <span className="text-[10px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md shadow-sm mt-1 max-w-[170px] truncate border border-slate-200/60 dark:border-slate-700/60">
                        {data.config?.collection || 'itemsList'}
                    </span>
                </div>
            </div>

            {/* Dual Output Handles */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="loop"
                style={{ left: '30%', background: '#6366f1' }} // Indigo for Loop Iteration
                className="!w-3.5 !h-3.5 !border-2 !border-white dark:!border-slate-800 shadow-sm hover:scale-125 transition-transform"
            />

            <Handle
                type="source"
                position={Position.Bottom}
                id="done"
                style={{ left: '70%', background: '#94a3b8' }} // Slate for Done
                className="!w-3.5 !h-3.5 !border-2 !border-white dark:!border-slate-800 shadow-sm hover:scale-125 transition-transform"
            />

            {/* Floating Labels for Handles */}
            <div className="flex justify-between px-6 pb-2 text-[8px] font-extrabold uppercase tracking-widest text-slate-400">
                <span className="text-indigo-500">Loop Item</span>
                <span className="text-slate-500">Done</span>
            </div>
        </div>
    );
};

export default memo(LoopNode);
