import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/api/api', () => ({
  createOrder: vi.fn(),
  getMenus: vi.fn(),
  getQueue: vi.fn(),
  loginAdmin: vi.fn(),
  createMenu: vi.fn(),
  updateMenu: vi.fn(),
  deleteMenu: vi.fn(),
  createUser: vi.fn(),
  getUsers: vi.fn(),
}));

vi.mock('../../src/socket', () => ({
  default: { on: vi.fn(), off: vi.fn() },
}));

import * as api from '../../src/api/api';
import MenuItem from '../../src/components/MenuItem';
import MenusManagement from '../../src/components/MenusManagement';
import UsersManagement from '../../src/components/UsersManagement';
import AdminLogin from '../../src/pages/AdminLogin';

describe('Fonctions et composants du frontend', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("création d'une commande: envoie le menu réel au backend", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ id: 21 }),
    });

    const realApi = await vi.importActual('../../src/api/api');
    await realApi.createOrder(7);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/orders',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ menu_id: 7 }),
      })
    );
  });

  test("MenuItem affiche un prix numérique formaté et permet la sélection", () => {
    const onSelect = vi.fn();
    render(
      <MenuItem
        menu={{ id: 3, name: 'Pasta carbonara', description: 'Plat du jour', price: '12.5', image: '' }}
        isSelected
        onSelect={onSelect}
      />
    );

    expect(screen.getByText('Pasta carbonara')).toBeInTheDocument();
    expect(screen.getByText('12.50€')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Pasta carbonara'));
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  test("MenusManagement refuse un menu sans nom ou prix", () => {
    render(<MenusManagement menus={[]} onMenusUpdate={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '+ Ajouter Menu' }));
    fireEvent.submit(screen.getByText('Nom du menu').closest('form'));

    expect(screen.getByText('Le nom et le prix sont requis')).toBeInTheDocument();
  });

  test("UsersManagement valide un mot de passe trop court", async () => {
    api.getUsers.mockResolvedValue([]);
    render(<UsersManagement />);
    await waitFor(() => expect(api.getUsers).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: '+ Ajouter Utilisateur' }));
    fireEvent.change(screen.getByPlaceholderText('Ex: jean123'), { target: { value: 'jean123' } });
    fireEvent.change(screen.getByPlaceholderText('Minimum 6 caractères'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

    expect(await screen.findByText('Le mot de passe doit contenir au moins 6 caractères')).toBeInTheDocument();
  });

  test("AdminLogin affiche une validation si les identifiants sont vides", () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );
    fireEvent.submit(screen.getByRole('button', { name: 'Sign In' }).closest('form'));

    expect(screen.getByText('❌ Veuillez remplir tous les champs')).toBeInTheDocument();
  });
});
