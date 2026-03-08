import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Globe } from 'lucide-react';

interface HttpNodeProps {
    data: {
        label: string;
        config?: {
            method?: string;
            url?: string;
        };
    };
    selected?: boolean;
}

const HttpNode: React.FC<HttpNodeProps> = ({ data, selected }) => {
    return (
        <div className={`min-w-[220px] shadow-xl rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border transition-[box-shadow,transform,border-color,background-color] duration-300 overflow-hidden ${selected ? 'border-teal-500 shadow-teal-500/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:border-teal-300 dark:hover:border-teal-500/50'}`}>
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3.5 !h-3.5 !bg-slate-300 dark:!bg-slate-600 !border-2 !border-white dark:!border-slate-800 shadow-sm"
            />

            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-400 p-2.5 flex items-center gap-2">
                <Globe size={16} className="text-white" />
                <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">
                    HTTP Request
                </span>
            </div>

            {/* Body */}
            <div className="p-4 bg-transparent space-y-2.5">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{data.label}</div>
                <div className="flex gap-2 text-[10px] font-mono bg-slate-50/80 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50 truncate items-center">
                    <span className="font-bold text-teal-600 dark:text-teal-400 px-1">{data.config?.method || 'GET'}</span>
                    <span className="truncate text-slate-500 dark:text-slate-400 font-semibold">{data.config?.url || 'https://api.example.com'}</span>
                </div>
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3.5 !h-3.5 !bg-teal-400 !border-2 !border-white dark:!border-slate-800 shadow-sm hover:!bg-teal-500 transition-colors"
            />
        </div>
    );
};

export default memo(HttpNode);
