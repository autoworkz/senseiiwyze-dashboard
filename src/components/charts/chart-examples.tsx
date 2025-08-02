"use client"

import { LineChart, BarChart, AreaChart, DonutChart, ComboChart, DonutCenterContent } from '@/components/charts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Sample data for demonstrations
const timeSeriesData = [
  { month: 'Jan', revenue: 4000, users: 240, conversions: 24 },
  { month: 'Feb', revenue: 3000, users: 198, conversions: 22 },
  { month: 'Mar', revenue: 5000, users: 320, conversions: 28 },
  { month: 'Apr', revenue: 4500, users: 290, conversions: 26 },
  { month: 'May', revenue: 6000, users: 410, conversions: 35 },
  { month: 'Jun', revenue: 5500, users: 380, conversions: 32 }
]

const categoryData = [
  { name: 'Design', value: 30, color: '#8b5cf6' },
  { name: 'Development', value: 45, color: '#10b981' },
  { name: 'Marketing', value: 20, color: '#f59e0b' },
  { name: 'Sales', value: 15, color: '#ef4444' }
]

const performanceData = [
  { metric: 'Speed', current: 85, target: 90 },
  { metric: 'Quality', current: 92, target: 95 },
  { metric: 'Efficiency', current: 78, target: 85 },
  { metric: 'Satisfaction', current: 88, target: 90 }
]

export function ChartExamples() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Chart Pattern Library</h1>
        <p className="text-muted-foreground">
          Comprehensive collection of chart components with consistent theming and presets.
        </p>
      </div>

      {/* Line Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Line Charts</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <LineChart
            data={timeSeriesData}
            lines={[
              { dataKey: 'revenue', name: 'Revenue', color: '#8b5cf6' },
              { dataKey: 'users', name: 'Users', color: '#10b981' }
            ]}
            xAxisKey="month"
            title="Revenue & Users Trend"
            description="Monthly performance metrics"
            showLegend
            showYAxis
            size="md"
          />
          
          <LineChart
            data={timeSeriesData}
            lines={[{ dataKey: 'conversions', name: 'Conversions', strokeWidth: 3 }]}
            xAxisKey="month"
            title="Conversion Rate"
            size="sm"
            showGrid={false}
          />
        </div>
      </section>

      {/* Bar Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Bar Charts</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <BarChart
            data={performanceData}
            bars={[
              { dataKey: 'current', name: 'Current', color: '#3b82f6' },
              { dataKey: 'target', name: 'Target', color: '#e5e7eb' }
            ]}
            xAxisKey="metric"
            title="Performance vs Target"
            description="Current performance against targets"
            showLegend
            showYAxis
            layout="vertical"
            size="md"
          />
          
          <BarChart
            data={timeSeriesData}
            bars={[{ dataKey: 'revenue', name: 'Revenue' }]}
            xAxisKey="month"
            title="Monthly Revenue"
            size="sm"
            layout="vertical"
          />
        </div>
      </section>

      {/* Area Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Area Charts</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <AreaChart
            data={timeSeriesData}
            areas={[
              { dataKey: 'revenue', name: 'Revenue', fillOpacity: 0.2, stackId: '1' },
              { dataKey: 'users', name: 'Users', fillOpacity: 0.2, stackId: '1' }
            ]}
            xAxisKey="month"
            title="Stacked Performance"
            description="Cumulative metrics over time"
            showLegend
            showYAxis
            size="md"
          />
          
          <AreaChart
            data={timeSeriesData}
            areas={[{ dataKey: 'conversions', fillOpacity: 0.1 }]}
            xAxisKey="month"
            title="Conversion Trend"
            size="sm"
            showGrid={false}
          />
        </div>
      </section>

      {/* Donut Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Donut Charts</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <DonutChart
            data={categoryData}
            title="Team Distribution"
            description="Breakdown by department"
            showLegend
            size="md"
            centerContent={
              <DonutCenterContent
                value="110"
                label="Total Members"
              />
            }
          />
          
          <DonutChart
            data={categoryData.slice(0, 2)}
            title="Primary Focus"
            size="sm"
            centerContent={
              <DonutCenterContent
                value="75%"
                label="Tech Focus"
              />
            }
          />
          
          <DonutChart
            data={categoryData}
            showCard={false}
            size="sm"
            centerContent={
              <DonutCenterContent
                value="100%"
                label="Complete"
              />
            }
          />
        </div>
      </section>

      {/* Combo Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Combination Charts</h2>
        <div className="grid gap-6">
          <ComboChart
            data={timeSeriesData}
            series={[
              { type: 'bar', dataKey: 'revenue', name: 'Revenue', yAxisId: 'left' },
              { type: 'line', dataKey: 'conversions', name: 'Conversions', yAxisId: 'right', strokeWidth: 3 }
            ]}
            xAxisKey="month"
            title="Revenue vs Conversions"
            description="Dual-axis comparison of key metrics"
            showLegend
            showYAxis
            showRightYAxis
            leftYAxisLabel="Revenue ($)"
            rightYAxisLabel="Conversions"
            size="lg"
          />
          
          <ComboChart
            data={timeSeriesData}
            series={[
              { type: 'area', dataKey: 'users', name: 'User Base', fillOpacity: 0.1 },
              { type: 'line', dataKey: 'conversions', name: 'Conversions', strokeWidth: 2 }
            ]}
            xAxisKey="month"
            title="User Growth & Conversions"
            showLegend
            showYAxis
            size="md"
          />
        </div>
      </section>

      {/* Chart Presets Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Chart Presets</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Analytics preset */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Analytics Preset</CardTitle>
              <CardDescription>Quick dashboard metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={timeSeriesData}
                lines={[{ dataKey: 'revenue' }]}
                xAxisKey="month"
                showCard={false}
                showGrid={true}
                showXAxis={true}
                showYAxis={false}
                showTooltip={true}
                showLegend={false}
                size="sm"
              />
            </CardContent>
          </Card>

          {/* Simple preset */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Simple Preset</CardTitle>
              <CardDescription>Clean minimal charts</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={performanceData.slice(0, 3)}
                bars={[{ dataKey: 'current' }]}
                xAxisKey="metric"
                showCard={false}
                showGrid={true}
                showXAxis={true}
                showYAxis={false}
                showTooltip={true}
                showLegend={false}
                size="sm"
                layout="vertical"
              />
            </CardContent>
          </Card>

          {/* Minimal preset */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Minimal Preset</CardTitle>
              <CardDescription>Ultra-clean sparklines</CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChart
                data={timeSeriesData}
                areas={[{ dataKey: 'conversions', fillOpacity: 0.1 }]}
                xAxisKey="month"
                showCard={false}
                showGrid={false}
                showXAxis={true}
                showYAxis={false}
                showTooltip={true}
                showLegend={false}
                size="sm"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Guidelines</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Chart Selection Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Line Charts</h4>
                <p className="text-sm text-muted-foreground">
                  Perfect for time series data, trends, and continuous data visualization.
                  Use for showing changes over time or relationships between variables.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Bar Charts</h4>
                <p className="text-sm text-muted-foreground">
                  Ideal for comparing discrete categories or showing rankings.
                  Use horizontal layout for long category names.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Area Charts</h4>
                <p className="text-sm text-muted-foreground">
                  Great for showing volume/magnitude changes over time.
                  Stack areas to show part-to-whole relationships.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Donut Charts</h4>
                <p className="text-sm text-muted-foreground">
                  Use for part-to-whole relationships with 2-7 categories.
                  Add center content for key metrics or totals.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theming & Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Responsive Sizing</h4>
                <p className="text-sm text-muted-foreground">
                  Use size='sm' for dashboard cards, 'md' for standard charts, 
                  and 'lg' for detailed analysis views.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Color System</h4>
                <p className="text-sm text-muted-foreground">
                  Charts automatically adapt to light/dark themes using semantic colors.
                  Override with custom colors when brand consistency is needed.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Accessibility</h4>
                <p className="text-sm text-muted-foreground">
                  All charts include proper ARIA labels and roles.
                  Color combinations meet WCAG contrast requirements.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Charts use optimized animations and lazy loading.
                  Large datasets automatically use sampling and virtualization.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}