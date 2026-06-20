import { ActivityIndicator, View, useWindowDimensions } from 'react-native';
import { VictoryArea, VictoryAxis, VictoryChart, VictoryTheme } from 'victory-native';
import { Text } from '@/components/ui/Text';
import type { SalesPoint } from '@/types';

interface DashboardSalesChartProps {
  sales: SalesPoint[];
  loading: boolean;
}

export function DashboardSalesChart({ sales, loading }: DashboardSalesChartProps) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width - 64, 1040);
  const chartData = sales.map((point, index) => ({ x: index + 1, y: point.revenue }));

  return (
    <View className="gap-2 rounded-lg border border-border bg-card px-4 pb-2 pt-4">
      <Text variant="h3">Ventas</Text>
      {loading ? (
        <ActivityIndicator className="my-8" />
      ) : chartData.length > 1 ? (
        <VictoryChart
          width={chartWidth}
          height={200}
          theme={VictoryTheme.grayscale}
          padding={{ top: 16, bottom: 40, left: 50, right: 16 }}
        >
          <VictoryAxis tickCount={Math.min(chartData.length, 6)} style={axisStyle} />
          <VictoryAxis dependentAxis tickFormat={formatTick} style={dependentAxisStyle} />
          <VictoryArea
            data={chartData}
            interpolation="monotoneX"
            style={{ data: { fill: 'rgba(24,24,27,0.08)', stroke: '#18181b', strokeWidth: 2 } }}
          />
        </VictoryChart>
      ) : (
        <View className="items-center py-10">
          <Text variant="small">Sin datos en este periodo</Text>
        </View>
      )}
    </View>
  );
}

const axisStyle = {
  axis: { stroke: 'transparent' },
  tickLabels: { fontSize: 10, fill: '#94a3b8' },
  grid: { stroke: 'transparent' },
};

const dependentAxisStyle = {
  axis: { stroke: 'transparent' },
  tickLabels: { fontSize: 10, fill: '#94a3b8' },
  grid: { stroke: '#f1f5f9', strokeDasharray: '4' },
};

function formatTick(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value);
}
