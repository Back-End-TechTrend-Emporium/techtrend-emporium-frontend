import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../src/App'
import { AuthProvider } from '../src/auth/AuthContext'

describe('App', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => null),
        removeItem: vi.fn(() => null),
        clear: vi.fn(() => null),
      },
      writable: true,
    })
  })

  it('renders the main app component', async () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <App />
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    )
    await waitFor(() => expect(screen.getByText('Tech Trend Emporium')).toBeInTheDocument())
  })
})