import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import { BASE_URL } from ".";

const PostAdd: React.FC = () => {
	const { user } = useAuth();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim() || !content.trim()) {
			toast.error("Моля, попълнете всички полета.");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`${BASE_URL}/posts`, {
				credentials: "include",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					content,
					user: user?.id, 
				}),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Публикацията беше създадена успешно!");
				navigate("/posts");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error("Грешка:", error);
			toast.error("Възникна неочаквана грешка.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container">
			<div className="section-header">
				<h2>Създай нова публикация</h2>
			</div>

			<div className="admin-form-container" style={{ maxWidth: "100%", marginTop: "20px" }}>
				<form onSubmit={handleSubmit} className="admin-form">
					<div className="form-group">
						<label htmlFor="title">Заглавие</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Въведете заглавие на публикацията..."
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="content">Съдържание</label>
						<textarea
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Напишете нещо тук..."
							rows={10}
							required
							style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
						></textarea>
					</div>

					<div className="form-actions">
						<button
							type="submit"
							className="btn-save"
							disabled={isLoading}
						>
							{isLoading ? "Публикуване..." : "Публикувай"}
						</button>
						<button
							type="button"
							className="btn-cancel"
							onClick={() => navigate("/posts")}
						>
							Отказ
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PostAdd;
