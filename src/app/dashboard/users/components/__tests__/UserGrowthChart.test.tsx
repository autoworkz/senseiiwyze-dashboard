import { render, screen } from '@testing-library/react'
import { UserGrowthChart } from '../UserGrowthChart'

// Mock Recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ dataKey }: { dataKey: string }) => <div data-testid={`line-${dataKey}`}>{dataKey}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
}))

describe('UserGrowthChart', () => {
  const mockData = [
    { month: 'Jan', users: 100, active: 80 },
    { month: 'Feb', users: 150, active: 120 },
    { month: 'Mar', users: 200, active: 160 },
  ]

  it('renders the chart with data', () => {
    render(<UserGrowthChart data={mockData} />)
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('line-users')).toBeInTheDocument()
    expect(screen.getByTestId('line-active')).toBeInTheDocument()
  })

  it('renders chart components', () => {
    render(<UserGrowthChart data={mockData} />)
    
    expect(screen.getByTestId('x-axis')).toBeInTheDocument()
    expect(screen.getByTestId('y-axis')).toBeInTheDocument()
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    expect(screen.getByTestId('legend')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <UserGrowthChart data={mockData} className="custom-class" />
    )
    
    const chartContainer = container.firstChild
    expect(chartContainer).toHaveClass('custom-class')
  })

  it('renders with empty data', () => {
    render(<UserGrowthChart data={[]} />)
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('has correct container dimensions', () => {
    const { container } = render(<UserGrowthChart data={mockData} />)
    
    const chartContainer = container.firstChild as HTMLElement
    expect(chartContainer).toHaveClass('w-full', 'h-[400px]')
  })
}) 