import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Hash } from 'lucide-react';

interface SlackNodeProps {
    data: {
        label: string;
        config?: {
            webhookUrl?: string;
            channel?: string;
            message?: string;
        };
    };
    selected?: boolean;
}

const SlackNode: React.FC<SlackNodeProps> = ({ data, selected }) => {
    return (
        <div className={`min-w-[220px] shadow-xl rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border transition-[box-shadow,transform,border-color,background-color] duration-300 overflow-hidden ${selected ? 'border-[#4A154B] dark:border-pink-500 shadow-[#4A154B]/20 dark:shadow-pink-500/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:border-[#4A154B]/50 dark:hover:border-pink-500/50'}`}>
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3.5 !h-3.5 !bg-slate-300 dark:!bg-slate-600 !border-2 !border-white dark:!border-slate-800 shadow-sm"
            />

            {/* Header */}
            <div className="bg-gradient-to-r from-[#4A154B] to-[#611f69] p-2.5 flex items-center gap-2">
                <Hash size={16} className="text-white" />
                <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">
                    Slack Notif
                </span>
            </div>

            {/* Body */}
            <div className="p-4 bg-transparent space-y-2.5">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{data.label}</div>
                <div className="flex flex-col gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <span className="font-bold text-[#4A154B] dark:text-pink-400 flex items-center gap-1.5 px-1"><span className="text-slate-400 dark:text-slate-500 font-medium text-[9px] uppercase tracking-wider">Channel:</span> {data.config?.channel || '#general'}</span>
                    <span className="truncate italic text-slate-400 dark:text-slate-500 font-medium px-1">Msg: {data.config?.message || 'Hello team!'}</span>
                </div>
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3.5 !h-3.5 !bg-[#4A154B] !border-2 !border-white dark:!border-slate-800 shadow-sm hover:scale-125 transition-transform"
            />
        </div>
    );
};

export default memo(SlackNode);
