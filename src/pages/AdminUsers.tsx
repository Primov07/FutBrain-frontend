import React from 'react';
import { toast } from 'react-toastify';
import { BASE_URL } from '.';
import type { UserDTO } from '../dtos/user';

const usersUrl = `${BASE_URL}/users`;

const AdminUsers: React.FC = () => {
  const [users, setUsers] = React.useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchUsers = React.useCallback(() => {
    setIsLoading(true);
    fetch(usersUrl, { credentials: 'include' })
      .then((response) => response.json())
      .then((data: UserDTO[]) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error((err as any).message);
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${usersUrl}/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin: !currentStatus }),
        credentials: 'include',
      });
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.message);
      } else {
        toast.success(json.message);
        setUsers(users.map(u => u.id === userId ? { ...u, isAdmin: !currentStatus } : u));
      }
    } catch (err) {
      toast.error((err as any).message);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="admin-content">Зареждане...</div>;

  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Управление на потребители</h2>
        <div className="header-actions">
          <div className="header-search">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Търси потребител..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="btn-refresh" 
            onClick={fetchUsers} 
            title="Обнови таблицата"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Аватар</th>
              <th>Потребителско име</th>
              <th>Имейл</th>
              <th>FutCoins</th>
              <th>Роля</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img 
                      src={user.pictureURL || '/img/logo.png'} 
                      alt="User" 
                      className="table-img user-avatar-circle" 
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.futcoins.toLocaleString()}</td>
                  <td>
                    <span className={`status-active ${!user.isAdmin ? 'status-user' : ''}`}>
                      {user.isAdmin ? 'Админ' : 'Потребител'}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className={user.isAdmin ? 'btn-delete' : 'btn-edit'} 
                      title={user.isAdmin ? 'Премахни админ права' : 'Дай админ права'}
                      onClick={() => toggleAdminStatus(user.id, user.isAdmin)}
                    >
                      <i className={`fas ${user.isAdmin ? 'fa-user-minus' : 'fa-user-shield'}`}></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>Няма намерени потребители.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminUsers;
