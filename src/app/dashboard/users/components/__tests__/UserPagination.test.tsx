import { render, screen, fireEvent } from '@testing-library/react'
import { UserPagination } from '../UserPagination'

describe('UserPagination', () => {
  const mockOnPageChange = jest.fn()

  const defaultProps = {
    pagination: {
      page: 1,
      pageSize: 20,
      total: 100,
    },
    onPageChange: mockOnPageChange,
  }

  beforeEach(() => {
    mockOnPageChange.mockClear()
  })

  it('renders pagination when there are multiple pages', () => {
    render(<UserPagination {...defaultProps} />)
    
    expect(screen.getByText('Showing 1 to 20 of 100 results')).toBeInTheDocument()
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('does not render when there is only one page', () => {
    const { container } = render(
      <UserPagination {...defaultProps} pagination={{ page: 1, pageSize: 20, total: 15 }} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('disables previous button on first page', () => {
    render(<UserPagination {...defaultProps} pagination={{ page: 1, pageSize: 20, total: 100 }} />)
    
    const prevButton = screen.getByText('Previous')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<UserPagination {...defaultProps} pagination={{ page: 5, pageSize: 20, total: 100 }} />)
    
    const nextButton = screen.getByText('Next')
    expect(nextButton).toBeDisabled()
  })

  it('calls onPageChange when next button is clicked', () => {
    render(<UserPagination {...defaultProps} pagination={{ page: 1, pageSize: 20, total: 100 }} />)
    
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange when previous button is clicked', () => {
    render(<UserPagination {...defaultProps} pagination={{ page: 3, pageSize: 20, total: 100 }} />)
    
    const prevButton = screen.getByText('Previous')
    fireEvent.click(prevButton)
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('shows correct page range', () => {
    render(<UserPagination {...defaultProps} pagination={{ page: 3, pageSize: 20, total: 100 }} />)
    
    expect(screen.getByText('Showing 41 to 60 of 100 results')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <UserPagination {...defaultProps} className="custom-class" />
    )
    
    const pagination = container.firstChild
    expect(pagination).toHaveClass('custom-class')
  })
}) 