'use client';

import { useEffect, useState } from 'react';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';
import { Input, Badge, Skeleton, Modal, Button } from '@/components/ui';
import api from '@/lib/api';
import { User } from '@/types';
import { formatDate, cn } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, [currentPage, search]);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(currentPage));
      params.append('limit', '10');
      if (search) params.append('search', search);

      const response = await api.get(`/users?${params.toString()}`);
      setUsers(response.data.data.data || response.data.data);
      setTotalPages(response.data.data.meta?.totalPages || 1);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await api.patch(`/users/${userId}`, { role });
      await loadUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/users/${userId}`, { isActive: !isActive });
      await loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Usuários</h1>
        <p className="text-text-secondary">
          Gerencie os usuários da plataforma
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-medium text-text-secondary">
                Usuário
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">
                Função
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">
                Cadastro
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">
                Status
              </th>
              <th className="text-right p-4 font-medium text-text-secondary">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><Skeleton className="h-6 w-20" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                  <td className="p-4"><Skeleton className="h-6 w-16" /></td>
                  <td className="p-4"><Skeleton className="h-8 w-20 ml-auto" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-secondary">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {user.firstName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-text-secondary">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                    </Badge>
                  </td>
                  <td className="p-4 text-text-secondary">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4">
                    <Badge variant={user.isActive ? 'success' : 'error'}>
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                        title={user.isActive ? 'Desativar' : 'Ativar'}
                      >
                        {user.isActive ? (
                          <UserX className="w-4 h-4 text-error" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-success" />
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                        title="Alterar função"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                'w-10 h-10 rounded-lg font-medium transition-colors',
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'bg-surface hover:bg-surface-hover'
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Role Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Alterar Função do Usuário"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-medium text-lg">
                  {selectedUser.firstName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                <p className="text-sm text-text-secondary">{selectedUser.email}</p>
              </div>
            </div>

            <div>
              <p className="text-text-secondary mb-4">
                Função atual: <Badge variant={selectedUser.role === 'ADMIN' ? 'default' : 'secondary'}>
                  {selectedUser.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                </Badge>
              </p>

              <div className="flex gap-4">
                <Button
                  onClick={() => updateUserRole(selectedUser.id, 'USER')}
                  variant={selectedUser.role === 'USER' ? 'primary' : 'secondary'}
                  disabled={selectedUser.role === 'USER'}
                >
                  Definir como Usuário
                </Button>
                <Button
                  onClick={() => updateUserRole(selectedUser.id, 'ADMIN')}
                  variant={selectedUser.role === 'ADMIN' ? 'primary' : 'secondary'}
                  disabled={selectedUser.role === 'ADMIN'}
                >
                  Definir como Admin
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
