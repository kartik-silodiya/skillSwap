import DashboardLayout from '@/components/layout/dashboard-layout';
import ConnectionStatus from '@/components/connection-status';

export default function StatusPage() {
  return (
    <DashboardLayout>
      <ConnectionStatus />
    </DashboardLayout>
  );
}