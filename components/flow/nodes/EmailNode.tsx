import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Mail } from 'lucide-react';

interface EmailNodeProps {
    data: {
        label: string;
        config?: {
            to?: string;
            subject?: string;
            body?: string;
        };
    };
    selected?: boolean;
}

const EmailNode: React.FC<EmailNodeProps> = ({ data, selected }) => {
    return (
        <div className={`min-w-[220px] shadow-xl rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border transition-[box-shadow,transform,border-color,background-color] duration-300 overflow-hidden ${selected ? 'border-rose-500 shadow-rose-500/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:border-rose-300 dark:hover:border-rose-500/50'}`}>
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3.5 !h-3.5 !bg-slate-300 dark:!bg-slate-600 !border-2 !border-white dark:!border-slate-800 shadow-sm"
            />

            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-rose-400 p-2.5 flex items-center gap-2">
                <Mail size={16} className="text-white" />
                <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">
                    Send Email
                </span>
            </div>

            {/* Body */}
            <div className="p-4 bg-transparent space-y-2.5">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{data.label}</div>
                <div className="flex flex-col gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50 truncate">
                    <span className="font-bold text-rose-600 dark:text-rose-400 px-1">To: {data.config?.to || 'user@example.com'}</span>
                    <span className="truncate font-medium px-1 text-slate-500 dark:text-slate-400">Sub: {data.config?.subject || 'Notification'}</span>
                </div>
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3.5 !h-3.5 !bg-rose-400 !border-2 !border-white dark:!border-slate-800 shadow-sm hover:scale-125 transition-transform"
            />
        </div>
    );
};

export default memo(EmailNode);
