import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { Skeleton } from '../../components/common/Skeleton';
import { FiActivity } from 'react-icons/fi';

export const ActivityLogsList = () => {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    dashboardService
      .getActivityLogs({ page, limit: 15 })
      .then((res) => {
        setLogs(res.data || []);
        setMeta(res.meta);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <FiActivity className="text-blue-400" />
            <span>System Activity Audit Logs</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Audit log of system actions, user logins, and operational updates</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <Skeleton height="h-12" count={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-900/60">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Module</th>
                  <th className="py-4 px-6">Action Performed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-200">
                        {log.user?.name || 'System / Guest'}
                        {log.user?.email && <div className="text-xs text-slate-400 font-normal">{log.user.email}</div>}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="purple">{log.module}</Badge>
                      </td>
                      <td className="py-4 px-6 text-slate-200 text-xs font-mono">{log.action}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      No system activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-slate-800">
            <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={(p) => setPage(p)} />
          </div>
        )}
      </div>
    </div>
  );
};
