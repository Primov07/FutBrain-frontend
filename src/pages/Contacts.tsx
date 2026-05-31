import React from 'react';
import { toast } from 'react-toastify';
import { BASE_URL } from '.';

const Contacts: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return toast.error("Моля, попълнете абсолютно всички полета!");
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.message || "Грешка при изпращане.");
      }
    } catch (err) {
      toast.error("Грешка при връзка със сървъра.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <title>Контакти – FutBrain</title>
      <section className="section-header section-header-no-border text-center">
        <h1 className="text-light-green">Контакти</h1>
        <p className="text-light-green">Имате въпрос или предложение? Свържете се с нас.</p>
      </section>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Свържете се с нас</h2>
          <p>Нашият екип е тук, за да ви помогне с всякакви въпроси относно платформата FutBrain.</p>
          
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <span>primov0701@gmail.com</span>
          </div>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>Пловдив, България</span>
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

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Вашето име</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Име и фамилия" 
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Имейл адрес</label>
            <input 
              type="email" 
              id="email" 
              placeholder="example@mail.com" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Тема</label>
            <input 
              type="text" 
              id="subject" 
              placeholder="Тема на съобщението" 
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Съобщение</label>
            <textarea 
              id="message" 
              rows={5} 
              placeholder="Напишете вашето съобщение тук..."
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="btn-submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Изпращане...' : 'Изпрати съобщение'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Contacts;
