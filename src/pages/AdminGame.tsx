import React from "react";
import { toast } from "react-toastify";
import { BASE_URL } from ".";
import type { PlayerDTO } from ".";

const AdminGame: React.FC = () => {
	const [players, setPlayers] = React.useState<PlayerDTO[]>([]);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [totalVotes, setTotalVotes] = React.useState<number>(0);

	const fetchGameStatus = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${BASE_URL}/players`);
			if (!response.ok) throw new Error("Грешка при зареждане на данните.");
			const data: PlayerDTO[] = await response.json();

			if (data) {
				// Сортиране по брой гласове (низходящ ред)
				const sortedPlayers = [...data].sort((a, b) => b.users.length - a.users.length);
				
				let votes = 0;
				data.forEach((p) => {
					votes += p.users.length;
				});
				
				setPlayers(sortedPlayers);
				setTotalVotes(votes);
			}
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		fetchGameStatus();
	}, [fetchGameStatus]);

	const handleForceEnd = async () => {
		if (
			window.confirm(
				"Сигурни ли сте, че искате да прекратите играта ПРИНУДИТЕЛНО? Всички награди ще бъдат раздадени според текущото класиране и ще започне нова седмица.",
			)
		) {
			try {
				setIsLoading(true);
				const response = await fetch(`${BASE_URL}/players/force-end`, {
					method: "POST",
					credentials: "include",
				});
				const json = await response.json();

				if (!response.ok) {
					toast.error(json.message);
				} else {
					toast.success(json.message);
					fetchGameStatus();
				}
			} catch (err: any) {
				toast.error(err.message);
			} finally {
				setIsLoading(false);
			}
		}
	};

	if (isLoading) return <div className="admin-content">Зареждане...</div>;

	return (
		<section className="data-section">
			<div className="section-header">
				<h2>Текущо класиране в играта</h2>
				<div className="header-actions">
					<div className="stat-badge">
						Общо гласове: {totalVotes}
					</div>
					<button
						className="btn-refresh"
						onClick={fetchGameStatus}
						title="Опресни данните"
					>
						<i className="fas fa-sync-alt"></i>
					</button>
				</div>
			</div>

			<div className="table-responsive mt-20">
				<table className="admin-table">
					<thead>
						<tr>
							<th>Позиция</th>
							<th>Снимка</th>
							<th>Играч</th>
							<th>Клуб</th>
							<th>Гласове</th>
							<th>Процент</th>
						</tr>
					</thead>
					<tbody>
						{players.length > 0 ? (
							players.map((p, index) => {
								const percentage = totalVotes > 0 ? ((p.users.length / totalVotes) * 100).toFixed(1) : 0;
								return (
									<tr key={p.id} className={index === 0 && p.users.length > 0 ? "leader-row" : ""}>
										<td style={{ fontWeight: 'bold' }}>
											{index === 0 && p.users.length > 0 ? <i className="fas fa-crown" style={{ color: '#ffd700' }}></i> : index + 1}
										</td>
										<td>
											<img src={p.playerImg} alt={p.name} className="table-img" />
										</td>
										<td style={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>{p.name}</td>
										<td>{p.club}</td>
										<td className="text-primary-blue" style={{ fontWeight: 'bold' }}>{p.users.length}</td>
										<td>
											<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
												<div style={{ flex: 1, height: '8px', background: 'var(--off-white)', borderRadius: '4px', overflow: 'hidden' }}>
													<div style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary-blue)' }}></div>
												</div>
												<span>{percentage}%</span>
											</div>
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan={6} style={{ textAlign: "center" }}>Няма добавени играчи.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="admin-danger-zone">
				<h3><i className="fas fa-exclamation-triangle"></i> Принудително финализиране на седмицата</h3>
				<p className="text-light">
					Това действие ще обяви <strong>{players[0]?.name || "някой"}</strong> за победител и ще раздаде наградите веднага.
				</p>
				<button 
					className="btn-force-end" 
					onClick={handleForceEnd}
				>
					ПРИКЛЮЧИ ТЕКУЩАТА СЕДМИЦА
				</button>
			</div>
		</section>
	);
};

export default AdminGame;
