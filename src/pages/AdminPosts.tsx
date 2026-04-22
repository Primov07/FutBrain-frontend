import React from 'react';

const AdminPosts: React.FC = () => {
  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Управление на публикации</h2>
        <div className="header-actions">
          <button className="btn-refresh" title="Обнови таблицата"><i className="fas fa-sync-alt"></i></button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Автор</th>
              <th>Съдържание (откъс)</th>
              <th>Дата на публикуване</th>
              <th>Харесвания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ivan_Ivanov</td>
              <td>Днес беше страхотен ден за футбола...</td>
              <td>10.04.2024</td>
              <td>15</td>
              <td className="actions">
                <button className="btn-delete" title="Изтрий"><i className="fas fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminPosts;
