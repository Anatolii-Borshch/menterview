import React from 'react';
import type { SystemStatus } from '../../api/systemApi';

interface SystemStatusCardProps {
  status: SystemStatus | null;
  loading: boolean;
}

interface StatusBadgeProps {
  isHealthy: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isHealthy }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
      isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}
  >
    {isHealthy ? '✓ Healthy' : '✗ Offline'}
  </span>
);

export const SystemStatusCards: React.FC<SystemStatusCardProps> = ({ status, loading }) => {
  if (loading || !status) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {['api', 'database', 'workers', 'manager'].map((skeletonKey) => (
          <div key={skeletonKey} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">API Server</h3>
          <StatusBadge isHealthy={status.api.isHealthy} />
        </div>
        <p className="text-gray-600 text-sm">{status.api.status}</p>
        {status.api.error && (
          <p className="text-red-600 text-xs mt-2">{status.api.error}</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Database</h3>
          <StatusBadge isHealthy={status.database.isConnected} />
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Status: {status.database.status}</p>
          <p>Users: <span className="font-semibold text-gray-900">{status.database.userCount}</span></p>
          <p>Sessions: <span className="font-semibold text-gray-900">{status.database.sessionCount}</span></p>
          <p>Questions: <span className="font-semibold text-gray-900">{status.database.questionCount}</span></p>
        </div>
        {status.database.error && (
          <p className="text-red-600 text-xs mt-2">{status.database.error}</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Worker Service</h3>
          <StatusBadge isHealthy={status.workers.isHealthy} />
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Status: {status.workers.status}</p>
          <p>
            Active Workers:{' '}
            <span className="font-semibold text-gray-900">
              {status.workers.activeWorkers}/{status.workers.maxWorkers}
            </span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${(status.workers.activeWorkers / status.workers.maxWorkers) * 100}%`,
              }}
            ></div>
          </div>
        </div>
        {status.workers.error && (
          <p className="text-red-600 text-xs mt-2">{status.workers.error}</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Worker Manager</h3>
          <StatusBadge isHealthy={status.manager.isHealthy} />
        </div>
        <p className="text-gray-600 text-sm">{status.manager.status}</p>
        {status.manager.error && (
          <p className="text-red-600 text-xs mt-2">{status.manager.error}</p>
        )}
      </div>
    </div>
  );
};
