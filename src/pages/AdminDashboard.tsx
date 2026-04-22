import React from "react";
import { Link } from "react-router-dom";
import { BASE_URL, type AccessoryDTO, type PlayerDTO } from ".";

const playersUrl = `${BASE_URL}/players/count`;
const usersUrl = `${BASE_URL}/users/count`;
const postsUrl = `${BASE_URL}/posts`;

const AdminDashboard: React.FC = () => {
	const [usersCount, setUsersCount] = React.useState<number>(0);
	const [playersCount, setPlayersCount] = React.useState<number>(0);

	React.useEffect(() => {
    fetch(playersUrl, {
      credentials: "include"
    })
			.then((response) => response.json())
			.then((data) => setPlayersCount(data.count))
			.catch((err) => console.error(err));

    fetch(usersUrl, {
      credentials: "include"
    })
			.then((response) => response.json())
			.then((data) => {
				setUsersCount(data.count);
			})
			.catch((err) => console.error(err));
	}, []);

	console.log(playersCount);
	console.log(usersCount);

	return (
		<>
			<h1>Общ преглед на системата</h1>
			<p className="admin-welcome-text">
				Добре дошли в административния панел на FutBrain. Тук можете да
				управлявате всички аспекти на платформата.
			</p>

			{/* Статистика */}
			<section className="stats-grid">
				<div className="stat-card">
					<div className="stat-icon">
						<i className="fas fa-user-friends"></i>
					</div>
					<div className="stat-info">
						<h3>{usersCount}</h3>
						<p>Общо потребители</p>
					</div>
				</div>
				<div className="stat-card">
					<div className="stat-icon">
						<i className="fas fa-paper-plane"></i>
					</div>
					<div className="stat-info">
						<h3>853</h3>
						<p>Публикации</p>
					</div>
				</div>
				<div className="stat-card">
					<div className="stat-icon">
						<i className="fas fa-futbol"></i>
					</div>
					<div className="stat-info">
						<h3>{playersCount}</h3>
						<p>Играчи</p>
					</div>
				</div>
				<div className="stat-card warning">
					<div className="stat-icon">
						<i className="fas fa-exclamation-triangle"></i>
					</div>
					<div className="stat-info">
						<h3>12</h3>
						<p>Чакащи доклади</p>
					</div>
				</div>
			</section>

			<div className="data-section">
				<div className="section-header">
					<h2>Бързи връзки</h2>
				</div>
				<div className="stats-grid">
					<Link
						to="/admin/players/add"
						className="stat-card stat-link"
					>
						<div className="stat-icon stat-icon-bg">
							<i className="fas fa-user-plus"></i>
						</div>
						<div className="stat-info">
							<h3>Добави играч</h3>
							<p>Създаване на нов профил</p>
						</div>
					</Link>
					<Link
						to="/admin/posts"
						className="stat-card stat-link"
					>
						<div className="stat-icon stat-icon-bg">
							<i className="fas fa-edit"></i>
						</div>
						<div className="stat-info">
							<h3>Преглед публикации</h3>
							<p>Управление на съдържание</p>
						</div>
					</Link>
				</div>
			</div>
		</>
	);
};

export default AdminDashboard;
