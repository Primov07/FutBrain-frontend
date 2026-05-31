import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import { BASE_URL } from ".";

const Login: React.FC = () => {
	const { setUser } = useAuth();
	const navigate = useNavigate();

	const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData: FormData = new FormData(e.currentTarget);
		const object = Object.fromEntries(formData.entries());

		const response = await fetch(`${BASE_URL}/users/login`, {
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(object),
		});

		const data = await response.json();

    if (!response.ok) {
      return toast.error(data.message || "Грешка при вход!");
    }

		setUser(data.user);
		navigate("/");

		toast.success("Вие успешно си влязохте в профила!");
	};
	return (
		<div className="auth-container">
			<title>Вход – FutBrain</title>
			<h2>Добре дошъл отново</h2>
			<p>Влез в профила си, за да обсъждаш любимите си теми.</p>

			<form
				className="contact-form"
				onSubmit={handleLogin}
			>
				<div className="form-group">
					<label htmlFor="username">Потребителско име</label>
					<input
						type="text"
						id="username"
						name="username"
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Парола</label>
					<input
						type="password"
						id="password"
						name="password"
						required
					/>
				</div>
				<button
					type="submit"
					className="btn-submit btn-full"
				>
					Вход
				</button>
			</form>

			<div className="auth-footer">
				Нямаш профил? <Link to="/register">Регистрирай се тук</Link>
			</div>
		</div>
	);
};

export default Login;
