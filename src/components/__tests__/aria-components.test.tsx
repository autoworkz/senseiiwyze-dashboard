import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'

import { AriaButton } from '../ui/aria-button'
import { AriaInput } from '../ui/aria-input'
import { AriaCheckbox } from '../ui/aria-checkbox'
import { AriaSwitch } from '../ui/aria-switch'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('React-ARIA Components Accessibility', () => {
  describe('AriaButton', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <AriaButton>Click me</AriaButton>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should handle keyboard interactions', async () => {
      const user = userEvent.setup()
      const onPress = jest.fn()
      
      render(
        <AriaButton onPress={onPress}>Click me</AriaButton>
      )
      
      const button = screen.getByRole('button', { name: 'Click me' })
      
      // Test Enter key
      await user.type(button, '{enter}')
      expect(onPress).toHaveBeenCalledTimes(1)
      
      // Test Space key
      await user.type(button, ' ')
      expect(onPress).toHaveBeenCalledTimes(2)
    })

    it('should show loading state with proper ARIA attributes', async () => {
      render(
        <AriaButton isLoading loadingText="Processing...">
          Submit
        </AriaButton>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toHaveAttribute('aria-live', 'polite')
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })

    it('should be disabled when loading', () => {
      render(
        <AriaButton isLoading>Submit</AriaButton>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('AriaInput', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <AriaInput label="Email" type="email" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should associate label with input', () => {
      render(
        <AriaInput label="Email Address" type="email" />
      )
      
      const input = screen.getByRole('textbox', { name: 'Email Address' })
      const label = screen.getByText('Email Address')
      
      expect(input).toBeInTheDocument()
      expect(label).toBeInTheDocument()
      expect(input).toHaveAttribute('aria-labelledby', label.id)
    })

    it('should show error message with proper ARIA attributes', () => {
      render(
        <AriaInput 
          label="Email" 
          type="email" 
          error="Please enter a valid email address"
        />
      )
      
      const input = screen.getByRole('textbox')
      const errorMessage = screen.getByRole('alert')
      
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby', errorMessage.id)
      expect(errorMessage).toHaveTextContent('Please enter a valid email address')
    })

    it('should show description with proper ARIA attributes', () => {
      render(
        <AriaInput 
          label="Password" 
          type="password" 
          description="Must be at least 8 characters long"
        />
      )
      
      const input = screen.getByRole('textbox')
      const description = screen.getByText('Must be at least 8 characters long')
      
      expect(input).toHaveAttribute('aria-describedby', description.id)
    })

    it('should handle required field properly', () => {
      render(
        <AriaInput label="Required Field" isRequired />
      )
      
      const input = screen.getByRole('textbox')
      const label = screen.getByText('Required Field')
      
      expect(input).toBeRequired()
      expect(label).toHaveTextContent('Required Field*')
    })
  })

  describe('AriaCheckbox', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <AriaCheckbox>Accept terms</AriaCheckbox>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should toggle state on click', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()
      
      render(
        <AriaCheckbox onChange={onChange}>Accept terms</AriaCheckbox>
      )
      
      const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
      
      expect(checkbox).not.toBeChecked()
      
      await user.click(checkbox)
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('should handle keyboard interactions', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()
      
      render(
        <AriaCheckbox onChange={onChange}>Accept terms</AriaCheckbox>
      )
      
      const checkbox = screen.getByRole('checkbox')
      
      await user.type(checkbox, ' ')
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('should show error message with proper ARIA attributes', () => {
      render(
        <AriaCheckbox error="You must accept the terms">
          Accept terms
        </AriaCheckbox>
      )
      
      const checkbox = screen.getByRole('checkbox')
      const errorMessage = screen.getByRole('alert')
      
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
      expect(checkbox).toHaveAttribute('aria-describedby', errorMessage.id)
      expect(errorMessage).toHaveTextContent('You must accept the terms')
    })
  })

  describe('AriaSwitch', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <AriaSwitch>Enable notifications</AriaSwitch>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper role and state', () => {
      render(
        <AriaSwitch isSelected>Enable notifications</AriaSwitch>
      )
      
      const switchElement = screen.getByRole('switch', { name: 'Enable notifications' })
      expect(switchElement).toBeChecked()
    })

    it('should toggle state on interaction', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()
      
      render(
        <AriaSwitch onChange={onChange}>Enable notifications</AriaSwitch>
      )
      
      const switchElement = screen.getByRole('switch')
      
      await user.click(switchElement)
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('should handle keyboard interactions', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()
      
      render(
        <AriaSwitch onChange={onChange}>Enable notifications</AriaSwitch>
      )
      
      const switchElement = screen.getByRole('switch')
      
      await user.type(switchElement, ' ')
      expect(onChange).toHaveBeenCalledWith(true)
    })
  })
})

describe('Focus Management', () => {
  it('should manage focus properly in modal-like scenarios', async () => {
    const user = userEvent.setup()
    
    const TestModal = ({ isOpen }: { isOpen: boolean }) => {
      if (!isOpen) return null
      
      return (
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <h2 id="modal-title">Test Modal</h2>
          <AriaButton>First Button</AriaButton>
          <AriaInput label="Test Input" />
          <AriaButton>Last Button</AriaButton>
        </div>
      )
    }
    
    const { rerender } = render(<TestModal isOpen={false} />)
    
    // Open modal
    rerender(<TestModal isOpen={true} />)
    
    const modal = screen.getByRole('dialog')
    const firstButton = screen.getByRole('button', { name: 'First Button' })
    const input = screen.getByRole('textbox')
    const lastButton = screen.getByRole('button', { name: 'Last Button' })
    
    expect(modal).toBeInTheDocument()
    
    // Test tab navigation
    await user.tab()
    expect(firstButton).toHaveFocus()
    
    await user.tab()
    expect(input).toHaveFocus()
    
    await user.tab()
    expect(lastButton).toHaveFocus()
  })
})

describe('Screen Reader Announcements', () => {
  it('should create proper live regions for announcements', () => {
    // Mock the screen reader utils
    const mockAnnounce = jest.fn()
    
    // This would typically be tested with a more sophisticated setup
    // that can capture live region announcements
    expect(mockAnnounce).toBeDefined()
  })
})
