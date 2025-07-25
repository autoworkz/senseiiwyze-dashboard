import { render, screen, fireEvent } from '@testing-library/react'
import { UserBulkActions } from '../UserBulkActions'

describe('UserBulkActions', () => {
  const mockProps = {
    selectedCount: 0,
    onClearSelection: jest.fn(),
    onExport: jest.fn(),
    onActivate: jest.fn(),
    onSuspend: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when no users are selected', () => {
    const { container } = render(<UserBulkActions {...mockProps} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders bulk actions when users are selected', () => {
    render(<UserBulkActions {...mockProps} selectedCount={3} />)
    
    expect(screen.getByText('3 users selected')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
    expect(screen.getByText('Activate')).toBeInTheDocument()
    expect(screen.getByText('Suspend')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls onClearSelection when clear button is clicked', () => {
    render(<UserBulkActions {...mockProps} selectedCount={2} />)
    
    const clearButton = screen.getByText('Clear selection')
    fireEvent.click(clearButton)
    
    expect(mockProps.onClearSelection).toHaveBeenCalledTimes(1)
  })

  it('calls onExport when export button is clicked', () => {
    render(<UserBulkActions {...mockProps} selectedCount={1} />)
    
    const exportButton = screen.getByText('Export')
    fireEvent.click(exportButton)
    
    expect(mockProps.onExport).toHaveBeenCalledTimes(1)
  })

  it('calls onActivate when activate button is clicked', () => {
    render(<UserBulkActions {...mockProps} selectedCount={1} />)
    
    const activateButton = screen.getByText('Activate')
    fireEvent.click(activateButton)
    
    expect(mockProps.onActivate).toHaveBeenCalledTimes(1)
  })

  it('calls onSuspend when suspend button is clicked', () => {
    render(<UserBulkActions {...mockProps} selectedCount={1} />)
    
    const suspendButton = screen.getByText('Suspend')
    fireEvent.click(suspendButton)
    
    expect(mockProps.onSuspend).toHaveBeenCalledTimes(1)
  })

  it('calls onDelete when delete button is clicked', () => {
    render(<UserBulkActions {...mockProps} selectedCount={1} />)
    
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)
    
    expect(mockProps.onDelete).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    const { container } = render(
      <UserBulkActions {...mockProps} selectedCount={1} className="custom-class" />
    )
    
    const card = container.querySelector('.custom-class')
    expect(card).toBeInTheDocument()
  })
}) 