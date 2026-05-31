import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { BASE_URL } from '.';

const Register: React.FC = () => {

  const navigate = useNavigate();

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const object = Object.fromEntries(formData.entries());

    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(object)
    });
    if (!response.ok) toast.error("Грешка при регистрация!");
    else {
      toast.success("Вие се регистрирахте успешно!");
      navigate("/login");
    }
  }
  return (
    <div className="auth-container">
      <title>Регистрация – FutBrain</title>
      <h2>Създай профил</h2>
      <p>Стани част от нашата футболна общност още днес.</p>
      
      <form className="contact-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="reg-username">Потребителско име</label>
          <input type="text" id="reg-username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="reg-email">Имейл адрес</label>
          <input type="email" id="reg-email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="reg-password">Парола</label>
          <input type="password" id="reg-password" name="password" required />
        </div>
        <button type="submit" className="btn-submit btn-full">Регистрация</button>
      </form> 
      
      <div className="auth-footer">
        Вече имаш профил? <Link to="/login">Влез оттук</Link>
      </div>
    </div>
  );
};

export default Register;
