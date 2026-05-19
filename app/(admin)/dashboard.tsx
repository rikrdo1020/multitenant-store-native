import { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { VictoryArea, VictoryAxis, VictoryChart, VictoryTheme } from 'victory-native';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import {
  useAnalyticsOverview,
  useAnalyticsSales,
  useAnalyticsTopProducts,
  type DateRange,
} from '@/hooks/api/use-analytics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48;

const RANGES: { label: string; value: DateRange }[] = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
];

function fmt(value: number | null | undefined) {
  const n = value ?? 0;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toFixed(2)}`;
}

function ChangeChip({ pct }: { pct: number | null | undefined }) {
  const up = (pct ?? 0) >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  const val = pct ?? 0;
  return (
    <View className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${up ? 'bg-emerald-100' : 'bg-red-100'}`}>
      <Icon size={11} color={up ? '#059669' : '#dc2626'} />
      <Text className={`text-xs font-semibold ${up ? 'text-emerald-700' : 'text-red-600'}`}>
        {up ? '+' : ''}{val}%
      </Text>
    </View>
  );
}

function KpiCard({
  label,
  value,
  pct,
}: {
  label: string;
  value: string;
  pct: number;
}) {
  return (
    <View className="flex-1 rounded-2xl bg-card border border-border p-4 gap-1">
      <Text variant="xs" className="uppercase tracking-widest text-muted-foreground">{label}</Text>
      <Text className="text-2xl font-bold text-foreground">{value}</Text>
      <ChangeChip pct={pct} />
    </View>
  );
}

function RangeSelector({
  selected,
  onChange,
}: {
  selected: DateRange;
  onChange: (r: DateRange) => void;
}) {
  return (
    <View className="flex-row gap-1 bg-muted rounded-xl p-1">
      {RANGES.map((r) => (
        <TouchableOpacity
          key={r.value}
          onPress={() => onChange(r.value)}
          className={`flex-1 rounded-lg py-1.5 items-center ${selected === r.value ? 'bg-background shadow-sm' : ''}`}
        >
          <Text
            className={`text-sm font-medium ${selected === r.value ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            {r.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function DashboardScreen() {
  const [range, setRange] = useState<DateRange>(30);

  const groupBy = range === 7 ? 'day' : range === 30 ? 'day' : 'week';

  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = useAnalyticsOverview(range);
  const { data: sales, isLoading: salesLoading, refetch: refetchSales } = useAnalyticsSales(range, groupBy);
  const { data: topProducts, isLoading: productsLoading, refetch: refetchProducts } = useAnalyticsTopProducts(range, 5);

  const isRefreshing = overviewLoading || salesLoading || productsLoading;

  function handleRefresh() {
    refetchOverview();
    refetchSales();
    refetchProducts();
  }

  const chartData = (sales ?? []).map((s, i) => ({ x: i + 1, y: s.revenue }));

  return (
    <ScreenWrapper scroll safeArea>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
      >
        <View className="px-6 pt-6 pb-10 gap-6">
          {/* Header */}
          <View className="gap-1">
            <Text variant="h1">Dashboard</Text>
            <Text variant="small">Resumen de tu tienda</Text>
          </View>

          {/* Range selector */}
          <RangeSelector selected={range} onChange={setRange} />

          {/* KPI cards */}
          {overviewLoading ? (
            <ActivityIndicator className="my-4" />
          ) : overview ? (
            <View className="gap-3">
              <View className="flex-row gap-3">
                <KpiCard
                  label="Ingresos"
                  value={fmt(overview.revenue)}
                  pct={overview.revenueChange}
                />
                <KpiCard
                  label="Órdenes"
                  value={String(overview.orders)}
                  pct={overview.ordersChange}
                />
              </View>
              <View className="flex-row gap-3">
                <KpiCard
                  label="Ticket promedio"
                  value={fmt(overview.avgTicket)}
                  pct={overview.avgTicketChange}
                />
                <View className="flex-1" />
              </View>
            </View>
          ) : null}

          {/* Sales chart */}
          <View className="rounded-2xl bg-card border border-border px-4 pt-4 pb-2 gap-2">
            <Text variant="h3">Ventas</Text>
            {salesLoading ? (
              <ActivityIndicator className="my-8" />
            ) : chartData.length > 1 ? (
              <VictoryChart
                width={CHART_WIDTH}
                height={200}
                theme={VictoryTheme.grayscale}
                padding={{ top: 16, bottom: 40, left: 50, right: 16 }}
              >
                <VictoryAxis
                  tickCount={Math.min(chartData.length, 6)}
                  style={{
                    axis: { stroke: 'transparent' },
                    tickLabels: { fontSize: 10, fill: '#94a3b8' },
                    grid: { stroke: 'transparent' },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
                  style={{
                    axis: { stroke: 'transparent' },
                    tickLabels: { fontSize: 10, fill: '#94a3b8' },
                    grid: { stroke: '#f1f5f9', strokeDasharray: '4' },
                  }}
                />
                <VictoryArea
                  data={chartData}
                  style={{
                    data: {
                      fill: 'rgba(99,102,241,0.12)',
                      stroke: '#6366f1',
                      strokeWidth: 2,
                    },
                  }}
                  interpolation="monotoneX"
                />
              </VictoryChart>
            ) : (
              <View className="items-center py-10">
                <Text variant="small">Sin datos en este período</Text>
              </View>
            )}
          </View>

          {/* Top products */}
          <View className="gap-3">
            <Text variant="h3">Top productos</Text>
            {productsLoading ? (
              <ActivityIndicator className="my-4" />
            ) : (topProducts ?? []).length === 0 ? (
              <View className="rounded-2xl bg-card border border-border p-6 items-center">
                <Text variant="small">Sin datos en este período</Text>
              </View>
            ) : (
              <View className="rounded-2xl bg-card border border-border overflow-hidden">
                {(topProducts ?? []).map((p, i) => (
                  <View
                    key={p.productId}
                    className={`flex-row items-center px-4 py-3 gap-3 ${i !== 0 ? 'border-t border-border' : ''}`}
                  >
                    <Text className="text-muted-foreground w-5 text-sm font-semibold">{i + 1}</Text>
                    {p.imageUrl ? (
                      <Image
                        source={{ uri: p.imageUrl }}
                        className="w-10 h-10 rounded-xl bg-muted"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-10 h-10 rounded-xl bg-muted" />
                    )}
                    <View className="flex-1">
                      <Text className="font-medium text-foreground" numberOfLines={1}>{p.name}</Text>
                      <Text variant="xs">{p.units} unidades</Text>
                    </View>
                    <Text className="font-semibold text-foreground">{fmt(p.revenue)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
