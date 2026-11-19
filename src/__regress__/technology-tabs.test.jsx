import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../animation/gsap', () => ({
  gsap: { set: vi.fn(), context: (fn) => fn(), registerPlugin: vi.fn() },
  ScrollTrigger: { create: vi.fn(), refresh: vi.fn() },
}))
vi.mock('../hooks/useSectionReveal', () => ({ useSectionReveal: vi.fn() }))

import { TechnologyPage } from '../pages/TechnologyPage'
import { technologyTabs, technologyHeroSection, technologyCtaSection } from '../config/technologySections'

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', window.location.pathname)
})

describe('technology tab configuration', () => {
  it('places every content section in exactly one tab and keeps hero/cta outside tabs', () => {
    const grouped = technologyTabs.flatMap((tab) => tab.sections.map((s) => s.type))
    expect(grouped).toHaveLength(new Set(grouped).size)
    expect(grouped).not.toContain(technologyHeroSection.type)
    expect(grouped).not.toContain(technologyCtaSection.type)
    expect(technologyTabs.length).toBeGreaterThanOrEqual(3)
    expect(technologyTabs.length).toBeLessThanOrEqual(4)
    expect(technologyTabs[technologyTabs.length - 1].sections.map((s) => s.type)).toContain('visualizer')
  })
})

function renderPage(initialHash = '') {
  window.location.hash = initialHash
  return render(
    <MemoryRouter>
      <TechnologyPage />
    </MemoryRouter>,
  )
}

describe('technology page subsection tabs', () => {
  it('shows only the first tab group by default with an accessible tab bar', () => {
    renderPage()
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(technologyTabs.length)
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    const panels = document.querySelectorAll('[role="tabpanel"]')
    expect(panels).toHaveLength(technologyTabs.length)
    expect(panels[0].style.display).not.toBe('none')
    expect(panels[1].style.display).toBe('none')
    expect(screen.getByText('Layered Intelligence Architecture')).toBeTruthy()
  })

  it('switches groups on click and syncs the hash', () => {
    renderPage()
    const lastTab = technologyTabs[technologyTabs.length - 1]
    fireEvent.click(screen.getByRole('tab', { name: lastTab.label }))
    expect(window.location.hash).toBe(`#${lastTab.id}`)
    const panels = document.querySelectorAll('[role="tabpanel"]')
    expect(panels[0].style.display).toBe('none')
    expect(panels[panels.length - 1].style.display).not.toBe('none')
    expect(screen.getByText('Deployment Architecture')).toBeTruthy()
    const launch = screen.getByRole('link', { name: /Launch Visualizer/ })
    expect(launch.getAttribute('href')).toBe('https://visualizer.tvastr.co')
    expect(launch.getAttribute('rel')).toContain('noopener')
  })

  it('selects the initial tab from the URL hash', () => {
    renderPage('#memory-and-runtime')
    const panels = document.querySelectorAll('[role="tabpanel"]')
    expect(panels[1].style.display).not.toBe('none')
    expect(panels[0].style.display).toBe('none')
  })

  it('moves selection with arrow keys', () => {
    renderPage()
    const first = screen.getAllByRole('tab')[0]
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    const tabs = screen.getAllByRole('tab')
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    fireEvent.keyDown(tabs[1], { key: 'ArrowLeft' })
    expect(screen.getAllByRole('tab')[0].getAttribute('aria-selected')).toBe('true')
  })
})
