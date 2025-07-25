import { render, screen, fireEvent } from '@testing-library/react'
import { UserSearchBar } from '../UserSearchBar'

describe('UserSearchBar', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with default placeholder', () => {
    render(<UserSearchBar value="" onChange={mockOnChange} />)
    
    const input = screen.getByPlaceholderText('Search users...')
    expect(input).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(
      <UserSearchBar 
        value="" 
        onChange={mockOnChange} 
        placeholder="Custom placeholder" 
      />
    )
    
    const input = screen.getByPlaceholderText('Custom placeholder')
    expect(input).toBeInTheDocument()
  })

  it('displays the search icon', () => {
    render(<UserSearchBar value="" onChange={mockOnChange} />)
    
    // The search icon is a Lucide React SVG component
    const searchIcon = document.querySelector('svg')
    expect(searchIcon).toBeInTheDocument()
  })

  it('calls onChange when input value changes', () => {
    render(<UserSearchBar value="" onChange={mockOnChange} />)
    
    const input = screen.getByPlaceholderText('Search users...')
    fireEvent.change(input, { target: { value: 'test search' } })
    
    expect(mockOnChange).toHaveBeenCalledWith('test search')
  })

  it('displays the current value', () => {
    render(<UserSearchBar value="current value" onChange={mockOnChange} />)
    
    const input = screen.getByPlaceholderText('Search users...')
    expect(input).toHaveValue('current value')
  })

  it('applies custom className', () => {
    render(
      <UserSearchBar 
        value="" 
        onChange={mockOnChange} 
        className="custom-class" 
      />
    )
    
    const container = screen.getByPlaceholderText('Search users...').parentElement
    expect(container).toHaveClass('custom-class')
  })
}) 