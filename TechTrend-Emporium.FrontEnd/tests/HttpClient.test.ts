import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { HttpClient } from '../src/lib/HttpClient'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

// Mock environment variables
vi.mock('import.meta.env', () => ({
  VITE_API_BASE_URL: 'https://localhost:7101/api'
}))

describe('HttpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset singleton
    HttpClient['_instance'] = null

    // Create mock axios instance
    const mockAxiosInstance = {
      defaults: {
        baseURL: 'https://localhost:7101/api',
        headers: { "Content-Type": "application/json" },
        timeout: 10000
      }
    }

    // Mock axios.create
    mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance)
  })

  it('should create a singleton instance', () => {
    const instance1 = HttpClient.instance
    const instance2 = HttpClient.instance
    expect(instance1).toBe(instance2)
  })

  it('should have correct baseURL', () => {
    const instance = HttpClient.instance
    expect(instance.defaults.baseURL).toBe('https://localhost:7101/api')
  })
})