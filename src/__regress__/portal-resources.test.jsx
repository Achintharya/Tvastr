import { describe, it, expect, vi, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../context/auth-context'
import { LicenseContext } from '../context/license-context'

vi.mock('../lib/supabaseClient', () => ({ supabase: { rpc: vi.fn(() => Promise.resolve({ data: [], error: null })) } }))
import { AdminDashboard } from '../pages/AdminDashboard'

const html = readFileSync('public/tvastr-presentation.html', 'utf8')
afterEach(cleanup)

describe('customer presentation viewer', () => {
  it('contains the supplied deck narrative and only one active slide', () => {
    const doc = new JSDOM(html).window.document
    expect(doc.querySelectorAll('.slide')).toHaveLength(13)
    expect(doc.querySelectorAll('.slide:not([hidden])')).toHaveLength(1)
    const copy = doc.body.textContent
    for (const value of ['From rejection records', 'Medhas is the ERP.', 'MIS is also offered standalone', 'VAJRA | NEARING RELEASE', 'No guaranteed ROI', 'Sources and evidence boundaries', 'achintharya@tvastr.co']) expect(copy).toContain(value)
    for (const stale of ['Tvastr RAS', 'Tvastr PI', 'Sub-5s', '100% Data Sovereignty', 'contact@tvastr.com']) expect(copy).not.toContain(stale)
    expect(doc.querySelector('.product-view img').getAttribute('src')).toBe('/presentation-assets/1-piras-overview.png')
  })
  it('supports navigation, hashes, bounds and native keyboard controls', () => {
    const dom = new JSDOM(html, { url: 'https://tvastr.co/tvastr-presentation.html#slide-7', runScripts: 'dangerously', pretendToBeVisual: true })
    const { document, KeyboardEvent } = dom.window
    dom.window.scrollTo = vi.fn()
    expect(document.querySelector('.slide:not([hidden])').id).toBe('slide-7')
    document.getElementById('next').click()
    expect(dom.window.location.hash).toBe('#slide-8')
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    expect(document.getElementById('next').disabled).toBe(true)
    expect(document.getElementById('position').textContent).toBe('13 / 13')
    const select = document.getElementById('jump')
    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    expect(document.getElementById('position').textContent).toBe('13 / 13')
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    expect(document.getElementById('previous').disabled).toBe(true)
    expect(document.querySelectorAll('.slide:not([hidden])')).toHaveLength(1)
    dom.window.close()
  })
})

describe('portal resources', () => {
  it('shows updated marketing summary and ISO placeholder without a fake download', async () => {
    render(<MemoryRouter><AuthContext.Provider value={{ user: { email: 'fixture@example.com' }, signOut: vi.fn() }}><LicenseContext.Provider value={{ isAdmin: true }}><AdminDashboard /></LicenseContext.Provider></AuthContext.Provider></MemoryRouter>)
    await act(async () => {})
    fireEvent.click(screen.getByRole('button', { name: 'Resources' }))
    expect(screen.getByText(/From rejection records to better plant decisions/)).toBeTruthy()
    const link = screen.getByRole('link', { name: 'Open Presentation' })
    expect(link.getAttribute('href')).toBe('/tvastr-presentation.html')
    const heading = screen.getByRole('heading', { name: 'ISO Audit' })
    const card = heading.parentElement.parentElement
    expect(card.textContent).toContain('Coming later')
    expect(card.textContent).toContain('PIRAS, Medhas, MIS and Vajra')
    expect(card.querySelectorAll('a,button')).toHaveLength(0)
  })
})
