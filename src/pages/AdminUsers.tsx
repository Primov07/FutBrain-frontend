import React from 'react';

const AdminUsers: React.FC = () => {
  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Управление на потребители</h2>
        <div className="header-actions">
          <button className="btn-refresh" title="Обнови таблицата"><i className="fas fa-sync-alt"></i></button>
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
            <tr>
              <td><img src="/img/logo.png" alt="User" className="table-img user-avatar-circle" /></td>
              <td>Ivan_Ivanov</td>
              <td>ivan@example.com</td>
              <td>1 200</td>
              <td><span className="status-active">Админ</span></td>
              <td className="actions">
                <button className="btn-edit" title="Редактирай"><i className="fas fa-edit"></i></button>
                <button className="btn-delete" title="Изтрий"><i className="fas fa-trash"></i></button>
              </td>
            </tr>
            <tr>
              <td><img src="/img/logo.png" alt="User" className="table-img user-avatar-circle" /></td>
              <td>SoccerFan</td>
              <td>fan@example.com</td>
              <td>450</td>
              <td><span className="status-active status-user">Потребител</span></td>
              <td className="actions">
                <button className="btn-edit" title="Редактирай"><i className="fas fa-edit"></i></button>
                <button className="btn-delete" title="Изтрий"><i className="fas fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminUsers;
