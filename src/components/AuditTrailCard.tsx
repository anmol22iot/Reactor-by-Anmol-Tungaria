import React from 'react';
import { FileText, Database } from 'lucide-react';
import { AuditRecord } from '../types';

interface AuditTrailCardProps {
  records: AuditRecord[];
}

export const AuditTrailCard: React.FC<AuditTrailCardProps> = ({ records }) => {
  // If no records yet (idle), show default benchmark records for presentation preview
  const displayRecords: AuditRecord[] = records.length > 0 ? records : [
    { id: '1', time: '16:02:12', tool: 'check_inventory', result: '83% (415 un.)', status: 'SUCCESS', latencyMs: 120 },
    { id: '2', time: '16:02:15', tool: 'select_supplier', result: 'Supplier A', status: 'SUCCESS', latencyMs: 180 },
    { id: '3', time: '16:02:22', tool: 'place_order', result: 'CAPACITY_REJECT', status: 'FAILURE', latencyMs: 450 },
    { id: '4', time: '16:02:23', tool: 'eval_failure', result: 'Confirmed', status: 'SUCCESS', latencyMs: 90 },
    { id: '5', time: '16:02:25', tool: 'replan_optimizer', result: 'Supp. B + C', status: 'SUCCESS', latencyMs: 310 },
    { id: '6', time: '16:02:28', tool: 'execute_orders', result: 'PO-8819/8820', status: 'SUCCESS', latencyMs: 240 },
  ];

  return (
    <div className="bg-[#0f1420] border border-[#1a233a] rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          Execution Tool Audit Trail
        </span>
        <span className="text-[10px] font-mono text-slate-300 font-semibold flex items-center gap-1">
          <Database className="w-3 h-3 text-cyan-300" />
          FastAPI / SQLite Sync
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="text-[9px] text-slate-300 uppercase border-b border-[#1a233a] pb-1 font-bold tracking-wider">
            <tr>
              <th className="py-1">Time</th>
              <th className="py-1">Action Tool</th>
              <th className="py-1">Result</th>
              <th className="py-1 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141b2d] text-slate-200">
            {displayRecords.map((r) => {
              const isFail = r.status === 'FAILURE';
              return (
                <tr key={r.id} className={isFail ? 'bg-rose-950/30' : ''}>
                  <td className={`py-1.5 ${isFail ? 'text-rose-200 font-bold' : 'text-slate-300 font-medium'}`}>
                    {r.time}
                  </td>
                  <td>
                    <code className={isFail ? 'text-rose-200 font-bold' : 'text-cyan-300 font-medium'}>
                      {r.tool}
                    </code>
                  </td>
                  <td className={isFail ? 'text-rose-100 font-semibold' : 'text-slate-200 font-medium'}>
                    {r.result}
                  </td>
                  <td className={`py-1.5 text-right font-bold ${isFail ? 'text-rose-200' : 'text-emerald-300'}`}>
                    {r.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
