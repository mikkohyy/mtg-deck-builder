import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Component from './Component'

test('renders right content', () => {
  render(<Component text={'test text'} />)

  const text = screen.getByText('Props text: test text')
  expect(text).toBeDefined()
})