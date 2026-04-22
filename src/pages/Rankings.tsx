import React from 'react';

const Rankings: React.FC = () => {
  return (
    <>
      <title>Класации – FutBrain</title>
      <section className="data-section">
        <div className="section-header">
          <h2>Топ потребители (FutCoins)</h2>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Място</th>
                <th>Потребител</th>
                <th>Спечелени точки</th>
                <th>Публикации</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="rank-badge rank-1">1</span></td>
                <td>SoccerFan99</td>
                <td><strong>15 450</strong></td>
                <td>24</td>
              </tr>
              <tr>
                <td><span className="rank-badge rank-2">2</span></td>
                <td>TacticsMaster</td>
                <td><strong>12 800</strong></td>
                <td>18</td>
              </tr>
              <tr>
                <td><span className="rank-badge rank-3">3</span></td>
                <td>GoalHunter</td>
                <td><strong>10 200</strong></td>
                <td>42</td>
              </tr>
              <tr>
                <td><span className="rank-badge">4</span></td>
                <td>DerbyDay</td>
                <td>9 850</td>
                <td>15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="data-section">
        <div className="section-header">
          <h2>Най-популярни публикации</h2>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Място</th>
                <th>Заглавие</th>
                <th>Автор</th>
                <th>Харесвания</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="rank-badge rank-1">1</span></td>
                <td>Прогнози за дербито на Северен Лондон</td>
                <td>DerbyDay</td>
                <td>256</td>
              </tr>
              <tr>
                <td><span className="rank-badge rank-2">2</span></td>
                <td>Кой ще спечели Златната обувка?</td>
                <td>SoccerFan99</td>
                <td>124</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Rankings;
