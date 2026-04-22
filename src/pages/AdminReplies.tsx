import React from 'react';

const AdminReplies: React.FC = () => {
  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Управление на отговори</h2>
        <div className="header-actions">
          <button className="btn-refresh" title="Обнови таблицата"><i className="fas fa-sync-alt"></i></button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Потребител</th>
              <th>Към коментар</th>
              <th>Отговор</th>
              <th>Дата</th>
              <th>Харесвания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ivan_Ivanov</td>
              <td>#102</td>
              <td>Съгласен съм с теб!</td>
              <td>11.04.2024</td>
              <td>2</td>
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

export default AdminReplies;
