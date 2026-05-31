import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from ".";
import type { AccessoryDTO } from ".";

const accessoriesUrl = `${BASE_URL}/accessories`;

const AdminAccessories: React.FC = () => {
	const [accessories, setAccessories] = React.useState<AccessoryDTO[]>([]);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(true);
	const navigate = useNavigate();

	React.useEffect(() => {
		fetch(accessoriesUrl)
			.then((response) => response.json())
			.then((data: AccessoryDTO[]) => {
				setAccessories(data);
				setIsLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setIsLoading(false);
			});
	}, []);

	async function deleteAccessory(id: string) {
		if (window.confirm("Сигурни ли сте, че искате да изтриете този аксесоар?")) {
			try {
				const response = await fetch(`${accessoriesUrl}/${id}`, {
					credentials: "include",
					method: "DELETE",
				});
				if (response.ok) {
					setAccessories(accessories.filter((a) => a.id !== id));
					toast.success("Аксесоарът беше изтрит успешно.");
				} else {
					toast.error("Грешка при изтриването на аксесоара.");
				}
			} catch (err) {
				console.error("Error deleting accessory:", err);
				toast.error("Грешка при изтриването на аксесоара.");
			}
		}
	}

	const getTypeName = (type: number) => {
		switch (type) {
			case 1:
				return "Топка";
			case 2:
				return "Значка";
			case 3:
				return "Обувки";
			default:
				return "Друго";
		}
	};

	const filteredAccessories = accessories.filter(a => 
		a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		getTypeName(a.type).toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (isLoading) return <div className="admin-content">Зареждане...</div>;

	return (
		<section className="data-section">
			<div className="section-header">
				<h2>Управление на аксесоари (Магазин)</h2>
				<div className="header-actions">
					<div className="header-search">
						<i className="fas fa-search"></i>
						<input 
							type="text" 
							placeholder="Търси аксесоар..." 
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Link to="/admin/accessories/add" className="btn-add">
						<i className="fas fa-plus"></i> Добави нов аксесоар
					</Link>
				</div>
			</div>
			<div className="table-responsive">
				<table className="admin-table">
					<thead>
						<tr>
							<th>Снимка</th>
							<th>Име</th>
							<th>Тип</th>
							<th>Цена (FutCoins)</th>
							<th>Крайна дата</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
						{filteredAccessories.length > 0 ? (
							filteredAccessories.map((a) => (
								<tr key={a.id}>
									<td>
										<img src={a.photo.startsWith('http') ? a.photo : `${BASE_URL}${a.photo.replace('..', '')}`} alt={a.name} className="table-img" 
											onError={(e) => { (e.target as HTMLImageElement).src = '/img/logo.png'; }}
										/>
									</td>
									<td>{a.name}</td>
									<td>{getTypeName(a.type)}</td>
									<td>{a.price}</td>
									<td>{new Date(a.endDate).toLocaleDateString("bg-BG")}</td>
									<td className="actions">
										<button
											className="btn-edit"
											title="Редактирай"
											onClick={() => navigate(`/admin/accessories/update/${a.id}`)}
										>
											<i className="fas fa-edit"></i>
										</button>
										<button
											className="btn-delete"
											title="Изтрий"
											onClick={() => deleteAccessory(a.id)}
										>
											<i className="fas fa-trash"></i>
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} style={{ textAlign: "center" }}>
									Няма намерени аксесоари.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default AdminAccessories;
