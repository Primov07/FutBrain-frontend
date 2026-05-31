import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import { BASE_URL } from ".";
import type { PostDTO } from "../dtos/post";

const PostUpdate: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { user } = useAuth();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await fetch(`${BASE_URL}/posts/${id}`);
				if (!response.ok) throw new Error("Публикацията не е намерена.");
				const data: PostDTO = await response.json();
				
				// Проверка дали текущият потребител е собственик
				if (user?.id !== data.user.id && !user?.isAdmin) {
					toast.error("Нямате право да редактирате тази публикация.");
					navigate("/posts");
					return;
				}

				setTitle(data.title || "");
				setContent(data.content);
			} catch (err) {
				toast.error((err as any).message);
				navigate("/posts");
			} finally {
				setIsLoading(false);
			}
		};

		if (id && user) fetchPost();
	}, [id, user, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim() || !content.trim()) {
			toast.error("Моля, попълнете всички полета.");
			return;
		}

		setIsUpdating(true);

		try {
			const response = await fetch(`${BASE_URL}/posts`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
					title,
					content,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Публикацията беше обновена успешно!");
				navigate(`/post/${id}`);
			} else {
				toast.error(data.message || "Грешка при обновяване.");
			}
		} catch (error) {
			console.error("Грешка:", error);
			toast.error("Възникна неочаквана грешка.");
		} finally {
			setIsUpdating(false);
		}
	};

	if (isLoading) return <div className="admin-content">Зареждане...</div>;

	return (
		<div className="container">
			<div className="section-header">
				<h2>Редактирай публикация</h2>
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
							disabled={isUpdating}
						>
							{isUpdating ? "Обновяване..." : "Запази промените"}
						</button>
						<button
							type="button"
							className="btn-cancel"
							onClick={() => navigate(`/post/${id}`)}
						>
							Отказ
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PostUpdate;
