import { ActivityIndicator, View } from 'react-native';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { formatDashboardMoney } from './dashboard-utils';
import type { AnalyticsOverview } from '@/types';

interface DashboardKpiCardsProps {
  overview?: AnalyticsOverview;
  loading: boolean;
}

export function DashboardKpiCards({ overview, loading }: DashboardKpiCardsProps) {
  if (loading) return <ActivityIndicator className="my-4" />;
  if (!overview) return null;

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <KpiCard label="Ingresos" value={formatDashboardMoney(overview.revenue)} pct={overview.revenueChange} />
        <KpiCard label="Ordenes" value={String(overview.orders)} pct={overview.ordersChange} />
      </View>
      <View className="flex-row gap-3">
        <KpiCard label="Ticket promedio" value={formatDashboardMoney(overview.avgTicket)} pct={overview.avgTicketChange} />
        <View className="flex-1" />
      </View>
    </View>
  );
}

function KpiCard({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <View className="flex-1 gap-1 rounded-lg border border-border bg-card p-4">
      <Text variant="xs" className="uppercase tracking-widest text-muted-foreground">{label}</Text>
      <Text className="text-2xl font-bold text-foreground">{value}</Text>
      <ChangeChip pct={pct} />
    </View>
  );
}

function ChangeChip({ pct }: { pct: number }) {
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <View className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${up ? 'bg-emerald-100' : 'bg-red-100'}`}>
      <Icon size={11} color={up ? '#059669' : '#dc2626'} />
      <Text className={`text-xs font-semibold ${up ? 'text-emerald-700' : 'text-red-600'}`}>
        {up ? '+' : ''}{pct}%
      </Text>
    </View>
  );
}
