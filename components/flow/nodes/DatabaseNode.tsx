import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database } from 'lucide-react';

interface DatabaseNodeProps {
    data: {
        label: string;
        config?: {
            connectionString?: string;
            query?: string;
        };
    };
    selected?: boolean;
}

const DatabaseNode: React.FC<DatabaseNodeProps> = ({ data, selected }) => {
    return (
        <div className={`min-w-[220px] shadow-xl rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border transition-[box-shadow,transform,border-color,background-color] duration-300 overflow-hidden ${selected ? 'border-slate-700 shadow-slate-700/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:border-slate-400 dark:hover:border-slate-500/50'}`}>
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3.5 !h-3.5 !bg-slate-300 dark:!bg-slate-600 !border-2 !border-white dark:!border-slate-800 shadow-sm"
            />

            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-2.5 flex items-center gap-2">
                <Database size={16} className="text-white" />
                <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">
                    Database Query
                </span>
            </div>

            {/* Body */}
            <div className="p-4 bg-transparent space-y-2.5">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{data.label}</div>
                <div className="flex flex-col gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <span className="truncate break-all px-1">Query: <span className="text-slate-700 dark:text-slate-300 font-semibold">{data.config?.query || 'SELECT * FROM users'}</span></span>
                </div>
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3.5 !h-3.5 !bg-slate-700 !border-2 !border-white dark:!border-slate-800 shadow-sm hover:scale-125 transition-transform"
            />
        </div>
    );
};

export default memo(DatabaseNode);
