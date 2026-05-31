import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from ".";

const playersUrl = `${BASE_URL}/players`;

import type { PlayerDTO } from ".";

const AdminPlayers: React.FC = () => {
	const [players, setPlayers] = React.useState<PlayerDTO[]>([]);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [searchQuery, setSearchQuery] = React.useState("");

	const fetchPlayers = React.useCallback(() => {
		setIsLoading(true);
		fetch(playersUrl)
			.then((response) => response.json())
			.then((data: PlayerDTO[]) => {
				setPlayers(data);
				setIsLoading(false);
			})
			.catch((err) => {
				toast.error((err as any).message);
				setIsLoading(false);
			});
	}, []);

	React.useEffect(() => {
		fetchPlayers();
	}, [fetchPlayers]);

	async function deletePlayer(id: string) {
		if (window.confirm("Сигурни ли сте, че искате да изтриете този играч?")) {
			try {
				setIsLoading(true);
				const response = await fetch(`${playersUrl}/${id}`, {
					method: "DELETE",
					credentials: "include",
				});
				const json = await response.json();
				if (!response.ok) toast.error(json.message);
				else {
					setPlayers(players.filter((p) => p.id !== id));
					setIsLoading(false);
					toast.success(json.message);
				}
			} catch (err) {
				toast.error((err as any).message);
			}
		}
	}

	const filteredPlayers = players.filter(p => 
		p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		p.club.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (isLoading) return <div className="admin-content">Зареждане...</div>;

	return (
		<section className="data-section">
			<div className="section-header">
				<h2>База данни с играчи</h2>
				<div className="header-actions">
					<div className="header-search">
						<i className="fas fa-search"></i>
						<input 
							type="text" 
							placeholder="Търси играч или клуб..." 
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<button 
						className="btn-refresh" 
						onClick={fetchPlayers}
						title="Опресни данните"
					>
						<i className="fas fa-sync-alt"></i>
					</button>
					<Link
						to="/admin/players/add"
						className="btn-add"
					>
						<i className="fas fa-plus"></i> Добави нов играч
					</Link>
				</div>
			</div>
			<div className="table-responsive">
				<table className="admin-table">
					<thead>
						<tr>
							<th>Снимка</th>
							<th>Име</th>
							<th>Клуб</th>
							<th>Лого на клуб</th>
							<th>Последователи</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
						{filteredPlayers.length > 0 ? (
							filteredPlayers.map((p) => {
								return (
									<tr key={p.id}>
										<td>
											<img
												src={p.playerImg}
												alt={p.name}
												className="table-img"
											/>
										</td>
										<td>{p.name}</td>
										<td>{p.club}</td>
										<td>
											<img
												src={p.clubImg}
												alt={p.club}
												className="club-logo-sm"
											/>
										</td>
										<td>{p.users.length}</td>
										<td className="actions">
											<Link
												to={`/admin/players/update/${p.id}`}
												className="btn-edit"
												title="Редактирай"
											>
												<i className="fas fa-edit"></i>
											</Link>
											<button
												className="btn-delete"
												title="Изтрий"
												onClick={() => deletePlayer(p.id)}
											>
												<i className="fas fa-trash"></i>
											</button>
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan={6} style={{ textAlign: "center" }}>Няма намерени играчи.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default AdminPlayers;
