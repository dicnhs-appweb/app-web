'use client';

import {Label, Pie, PieChart} from 'recharts';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {useProductStore} from '@/features/auth/product/store/useRawMaterialStore';

export function OperationalTotalChart() {
  const {product} = useProductStore();

  const threshold = 0.05; // 5% threshold
  const sortedData = [
    ...product.rawMaterials.map((material, index) => ({
      name: material.ingredientName,
      cost: material.costPerUnit * material.quantityNeededPerUnit,
      fill: `hsl(var(--chart-${(index % 5) + 1}))`,
      type: 'Raw Material',
    })),
    ...product.overheadExpenses.map((expense, index) => ({
      name: expense.expenseCategory,
      cost: expense.costPerUnit,
      fill: `hsl(var(--chart-${((index + product.rawMaterials.length) % 5) + 1}))`,
      type: 'Overhead',
    })),
  ].sort((a, b) => b.cost - a.cost);

  const totalCost = sortedData.reduce((sum, item) => sum + item.cost, 0);

  const chartData = sortedData.reduce<
    Array<{
      name: string;
      cost: number;
      fill: string;
      type: string;
    }>
  >((acc, item) => {
    if (item.cost / totalCost >= threshold) {
      acc.push(item);
    } else {
      const otherIndex = acc.findIndex(i => i.name === 'Other');
      if (otherIndex === -1) {
        acc.push({
          name: 'Other',
          cost: item.cost,
          fill: `hsl(var(--chart-6))`,
          type: 'Mixed',
        });
      } else {
        acc[otherIndex].cost += item.cost;
      }
    }
    return acc;
  }, []);

  const chartConfig: ChartConfig = {
    cost: {
      label: 'Cost',
    },
    ...Object.fromEntries(
      chartData.map(item => [
        item.name,
        {
          label: item.name,
          color: item.fill,
        },
      ])
    ),
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-md">Operational Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[450px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="cost"
              nameKey="name"
              label={({name, percent}) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius="80%"
              innerRadius="50%"
            >
              <Label
                content={({viewBox}) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold fill-foreground"
                        >
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'PHP',
                          }).format(totalCost)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Cost
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
