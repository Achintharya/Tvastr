/**
 * Regression tests for the lint-fix refactors of AuthContext, LicenseContext,
 * ProtectedRoute and Navbar. Supabase is fully mocked: no network, no real
 * accounts, no customer data.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

// Mutable mock state, reset per test.
const state = {
  session: null,
  sessionPromise: null, // when set, getSession returns this (e.g. never-resolving)
  licenseResult: { data: null, error: null },
  authCb: null,
}

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: () =>
        state.sessionPromise ?? Promise.resolve({ data: { session: state.session } }),
      onAuthStateChange: (cb) => {
        state.authCb = cb
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      signInWithPassword: vi.fn(),
      signOut: vi.fn(() => Promise.resolve({})),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
    from: () => ({
      select: () => ({
        eq: () => ({ single: () => Promise.resolve(state.licenseResult) }),
      }),
    }),
  },
}))

import { AuthProvider } from '../context/AuthContext'
import { LicenseProvider } from '../context/LicenseContext'
import { useLicense } from '../context/license-context'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Navbar } from '../components/navigation/Navbar'

const USER = { id: 'u1', email: 'customer@example.com' }
const SESSION = { user: USER, access_token: 'fake' }
const LICENSE = { tier: 'TIER_1', customer_name: 'Acme Castings', license_key: 'KEY-1' }

function Shell({ protectedProps, children }) {
  return (
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <LicenseProvider>
          <Routes>
            <Route path="/portal" element={<div>LOGIN_PAGE</div>} />
            <Route path="/portal/dashboard" element={<div>DASH_PAGE</div>} />
            <Route
              path="/"
              element={
                <ProtectedRoute {...protectedProps}>
                  <div>SECRET</div>
                </ProtectedRoute>
              }
            />
          </Routes>
          {children}
        </LicenseProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  state.session = null
  state.sessionPromise = null
  state.licenseResult = { data: null, error: null }
  state.authCb = null
})
afterEach(cleanup)

describe('ProtectedRoute', () => {
  it('shows the loader while the session is resolving', () => {
    state.sessionPromise = new Promise(() => {}) // never resolves
    const { container } = render(<Shell />)
    expect(container.querySelector('.forge-loader-container')).toBeTruthy()
    expect(screen.queryByText('SECRET')).toBeNull()
  })

  it('redirects to /portal when there is no session', async () => {
    render(<Shell />)
    expect(await screen.findByText('LOGIN_PAGE')).toBeTruthy()
  })

  it('renders children for an authenticated user with a valid license', async () => {
    state.session = SESSION
    state.licenseResult = { data: LICENSE, error: null }
    render(<Shell protectedProps={{ requiredCapability: 'plant_intelligence' }} />)
    expect(await screen.findByText('SECRET')).toBeTruthy()
  })

  it('shows LockedScreen when the required capability is not granted', async () => {
    state.session = SESSION
    state.licenseResult = { data: LICENSE, error: null }
    render(<Shell protectedProps={{ requiredCapability: 'quantum_leap' }} />)
    expect(await screen.findByText('Feature Locked')).toBeTruthy()
  })

  it('redirects non-admins away from adminOnly routes', async () => {
    state.session = SESSION
    state.licenseResult = { data: LICENSE, error: null }
    render(<Shell protectedProps={{ adminOnly: true }} />)
    expect(await screen.findByText('DASH_PAGE')).toBeTruthy()
  })

  it('shows the license error card only after the 15s grace period', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      state.session = SESSION
      state.licenseResult = { data: null, error: { message: 'boom', code: 'X' } }
      render(<Shell />)
      // Error is present but inside the grace period: content still renders.
      expect(await screen.findByText('SECRET')).toBeTruthy()
      expect(screen.queryByText('License Error')).toBeNull()
      await act(async () => {
        vi.advanceTimersByTime(15100)
      })
      expect(await screen.findByText('License Error')).toBeTruthy()
      expect(screen.getByText('boom')).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })

  it('recovers and hides the error card after sign-out and a healthy sign-in', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      state.session = SESSION
      state.licenseResult = { data: null, error: { message: 'boom', code: 'X' } }
      render(
        <Shell>
          <LicenseProbe />
        </Shell>,
      )
      // Wait for the license fetch to fail before arming the grace timer.
      expect(
        await screen.findByText('tier:null loading:false customer:null'),
      ).toBeTruthy()
      await act(async () => {
        vi.advanceTimersByTime(15100)
      })
      expect(await screen.findByText('License Error')).toBeTruthy()
      // License is only refetched when the user changes: sign out, then
      // back in (fresh user object), with the backend now healthy.
      await act(async () => {
        state.authCb('SIGNED_OUT', null)
      })
      state.licenseResult = { data: LICENSE, error: null }
      await act(async () => {
        state.authCb('SIGNED_IN', { user: { ...USER }, access_token: 'fake2' })
      })
      expect(screen.queryByText('License Error')).toBeNull()
      expect(
        await screen.findByText('tier:TIER_1 loading:false customer:Acme Castings'),
      ).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })
})

function LicenseProbe() {
  const { tier, loading, customerName } = useLicense()
  return (
    <div data-testid="probe">
      {`tier:${tier} loading:${loading} customer:${customerName}`}
    </div>
  )
}

describe('LicenseContext', () => {
  it('resolves tier for a signed-in user', async () => {
    state.session = SESSION
    state.licenseResult = { data: LICENSE, error: null }
    render(<Shell><LicenseProbe /></Shell>)
    expect(
      await screen.findByText('tier:TIER_1 loading:false customer:Acme Castings'),
    ).toBeTruthy()
  })

  it('stays logged-out-clean when there is no user', async () => {
    render(<Shell><LicenseProbe /></Shell>)
    expect(
      await screen.findByText('tier:null loading:false customer:null'),
    ).toBeTruthy()
  })

  it('resets license state on logout', async () => {
    state.session = SESSION
    state.licenseResult = { data: LICENSE, error: null }
    render(<Shell><LicenseProbe /></Shell>)
    expect(
      await screen.findByText('tier:TIER_1 loading:false customer:Acme Castings'),
    ).toBeTruthy()
    await act(async () => {
      state.session = null
      state.authCb('SIGNED_OUT', null)
    })
    // tier/loading/error reset on logout. customerName intentionally
    // mirrors the pre-refactor behavior (it was never reset there either).
    expect(
      await screen.findByText('tier:null loading:false customer:Acme Castings'),
    ).toBeTruthy()
    // After logout the protected page redirects to login
    expect(await screen.findByText('LOGIN_PAGE')).toBeTruthy()
  })
})

function NavbarHarness() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<div>HOME_BODY</div>} />
        <Route path="/technology" element={<div>TECH_BODY</div>} />
      </Routes>
    </>
  )
}

function renderNavbar() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <LicenseProvider>
          <NavbarHarness />
        </LicenseProvider>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('Navbar', () => {
  it('starts unsurfaced at the top and surfaced when already scrolled', async () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    const { container, unmount } = renderNavbar()
    const topDiv = [...container.querySelectorAll('div')].find((d) =>
      d.className.includes('md:px-10'),
    )
    expect(topDiv, 'unsurfaced padding at scrollY=0').toBeTruthy()
    unmount()

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
    const { container: c2 } = renderNavbar()
    const scrolledDiv = [...c2.querySelectorAll('div')].find((d) =>
      d.className.includes('md:px-6') && !d.className.includes('md:px-10'),
    )
    expect(scrolledDiv, 'surfaced padding at scrollY=100').toBeTruthy()
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
  })

  it('closes the mobile menu on route change', async () => {
    renderNavbar()
    await act(async () => {
      screen.getByLabelText('Toggle menu').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    // Drawer open: the mobile drawer link joins the desktop one
    expect(screen.getAllByText('Technology').length).toBe(2)
    const desktopLink = screen.getAllByText('Technology')[0].closest('a')
    await act(async () => {
      desktopLink.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    // Drawer closed: only the desktop link remains
    expect(screen.getAllByText('Technology').length).toBe(1)
  })
})
