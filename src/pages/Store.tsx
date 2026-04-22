import React from 'react';

const Store: React.FC = () => {
  return (
    <>
      <title>Магазин за аксесоари – FutBrain</title>
      <section className="section-header section-header-no-border">
        <h1 className="text-light-green">Магазин за аксесоари</h1>
        <p>Персонализирай своя профил с уникални банери и ефекти.</p>
      </section>

      <div className="filters">
        <button className="filter-btn active">Всички</button>
        <button className="filter-btn">Банери</button>
        <button className="filter-btn">Ефекти</button>
        <button className="filter-btn">Значки</button>
      </div>

      <div className="store-grid">
        <div className="item-card">
          <div className="item-preview">
            <i className="fas fa-image"></i>
            <span className="item-tag">Банер</span>
          </div>
          <div className="item-info">
            <h3>Златен стадион</h3>
            <p>Ексклузивен банер за твоя профил.</p>
            <span className="item-price">500 FC</span>
            <button className="btn-buy">Купи сега</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-preview item-preview-gradient">
            <i className="fas fa-magic text-white"></i>
            <span className="item-tag">Ефект</span>
          </div>
          <div className="item-info">
            <h3>Неоново сияние</h3>
            <p>Анимиран ефект около твоята аватарна снимка.</p>
            <span className="item-price">1,200 FC</span>
            <button className="btn-buy">Купи сега</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-preview">
            <i className="fas fa-shield-halved"></i>
            <span className="item-tag">Значка</span>
          </div>
          <div className="item-info">
            <h3>Експерт по тактика</h3>
            <p>Значка, показваща твоите познания.</p>
            <span className="item-price">300 FC</span>
            <button className="btn-buy">Купи сега</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Store;
