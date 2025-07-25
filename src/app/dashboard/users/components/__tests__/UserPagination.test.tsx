import { render, screen, fireEvent } from '@testing-library/react'
import { UserPagination } from '../UserPagination'

describe('UserPagination', () => {
  const mockOnPageChange = jest.fn()

  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 100,
    pageSize: 20,
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
      <UserPagination {...defaultProps} totalPages={1} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('disables previous button on first page', () => {
    render(<UserPagination {...defaultProps} currentPage={1} />)
    
    const prevButton = screen.getByText('Previous')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<UserPagination {...defaultProps} currentPage={5} />)
    
    const nextButton = screen.getByText('Next')
    expect(nextButton).toBeDisabled()
  })

  it('calls onPageChange when next button is clicked', () => {
    render(<UserPagination {...defaultProps} currentPage={1} />)
    
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange when previous button is clicked', () => {
    render(<UserPagination {...defaultProps} currentPage={3} />)
    
    const prevButton = screen.getByText('Previous')
    fireEvent.click(prevButton)
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('shows correct page range', () => {
    render(<UserPagination {...defaultProps} currentPage={3} />)
    
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