import React from 'react';

const AdminComments: React.FC = () => {
  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Управление на коментари</h2>
        <div className="header-actions">
          <button className="btn-refresh" title="Обнови таблицата"><i className="fas fa-sync-alt"></i></button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Потребител</th>
              <th>Към публикация</th>
              <th>Коментар</th>
              <th>Дата</th>
              <th>Харесвания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SoccerFan</td>
              <td>#001</td>
              <td>Много добра статия!</td>
              <td>10.04.2024</td>
              <td>5</td>
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

export default AdminComments;
