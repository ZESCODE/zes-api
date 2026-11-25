/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  status: {
    current: undefined as
      | { register_enabled?: boolean; self_use_mode_enabled?: boolean }
      | undefined,
  },
}))

vi.mock('@/hooks/use-status', () => ({
  useStatus: () => ({ status: mocks.status.current }),
}))

vi.mock('@/hooks/use-system-config', () => ({
  useSystemConfig: () => ({
    systemName: 'Test Console',
    logo: '/logo.png',
    loading: false,
  }),
}))

vi.mock('@/features/auth/sign-in/components/user-auth-form', () => ({
  UserAuthForm: () => null,
}))

vi.mock('@/features/auth/components/terms-footer', () => ({
  TermsFooter: () => null,
}))

import { SignIn } from '../index'

function renderSignIn() {
  const root = createRootRoute({ component: Outlet })
  const authLayout = createRoute({
    id: '(auth)',
    getParentRoute: () => root,
    component: Outlet,
  })
  const signInRoute = createRoute({
    getParentRoute: () => authLayout,
    path: '/sign-in',
    component: SignIn,
  })
  const signUpRoute = createRoute({
    getParentRoute: () => authLayout,
    path: '/sign-up',
    component: () => null,
  })
  const router = createRouter({
    routeTree: root.addChildren([
      authLayout.addChildren([signInRoute, signUpRoute]),
    ]),
    history: createMemoryHistory({ initialEntries: ['/sign-in'] }),
  })
  return render(<RouterProvider router={router} />)
}

it('shows the sign up link when registration is enabled, even in self-use mode', async () => {
  mocks.status.current = { register_enabled: true, self_use_mode_enabled: true }

  renderSignIn()

  const signUpLink = await screen.findByRole('link', { name: 'Sign up' })

  expect(signUpLink).toBeInTheDocument()
})

it('hides the sign up link when the administrator disables registration', () => {
  mocks.status.current = { register_enabled: false, self_use_mode_enabled: false }

  renderSignIn()

  expect(screen.queryByRole('link', { name: 'Sign up' })).toBeNull()
})
