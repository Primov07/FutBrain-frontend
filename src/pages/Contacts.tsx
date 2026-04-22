import React from 'react';

const Contacts: React.FC = () => {
  return (
    <>
      <title>Контакти – FutBrain</title>
      <section className="section-header section-header-no-border text-center">
        <h1 className="text-light-green">Контакти</h1>
        <p>Имате въпрос или предложение? Свържете се с нас.</p>
      </section>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Свържете се с нас</h2>
          <p>Нашият екип е тук, за да ви помогне с всякакви въпроси относно платформата FutBrain.</p>
          
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <span>support@futbrain.com</span>
          </div>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>София, България</span>
          </div>
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <span>+359 888 123 456</span>
          </div>

          <div className="info-box">
            <h4 className="text-primary-blue mb-10">Важно за общността:</h4>
            <p className="font-small">Ако искаш да докладваш за неуместно съдържание или нарушение на правилата, моля, използвай бутона „Докладвай“ директно под съответната публикация.</p>
          </div>
        </div>

        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Вашето име</label>
            <input type="text" id="name" placeholder="Име и фамилия" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Имейл адрес</label>
            <input type="email" id="email" placeholder="example@mail.com" />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Тема</label>
            <input type="text" id="subject" placeholder="Тема на съобщението" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Съобщение</label>
            <textarea id="message" rows={5} placeholder="Напишете вашето съобщение тук..."></textarea>
          </div>
          <button type="submit" className="btn-submit">Изпрати съобщение</button>
        </form>
      </div>
    </>
  );
};

export default Contacts;
