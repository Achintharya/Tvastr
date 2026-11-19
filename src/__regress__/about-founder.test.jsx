// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AboutPage } from '../pages/AboutPage'

describe('public About founder attribution', () => {
  it('shows the approved name immediately below Founder and preserves page links', () => {
    render(<MemoryRouter><AboutPage /></MemoryRouter>)
    const label = screen.getByRole('heading', { name: 'Founder' })
    expect(label.nextElementSibling.textContent).toBe('Achintharya Patil')
    expect(screen.getByRole('link', { name: 'Our technology' }).getAttribute('href')).toBe('/technology')
    expect(screen.getByRole('link', { name: 'Explore the products' }).getAttribute('href')).toBe('/')
    cleanup()
  })
})
