import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from ".";
import type { AccessoryDTO } from ".";

const accessoriesUrl = `${BASE_URL}/accessories`;

const AdminAccessories: React.FC = () => {
	const [accessories, setAccessories] = React.useState<AccessoryDTO[]>([]);
	const navigate = useNavigate();

	React.useEffect(() => {
		fetch(accessoriesUrl)
			.then((response) => response.json())
			.then((data: AccessoryDTO[]) => {
				setAccessories(data);
			})
			.catch((err) => console.error(err));
	}, []);

	async function deleteAccessory(id: string) {
		if (window.confirm("Сигурни ли сте, че искате да изтриете този аксесоар?")) {
			try {
				const response = await fetch(`${accessoriesUrl}/${id}`, {
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

	return (
		<section className="data-section">
			<div className="section-header">
				<h2>Управление на аксесоари (Магазин)</h2>
				<div className="header-actions">
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
						{accessories.length > 0 ? (
							accessories.map((a) => (
								<tr key={a.id}>
									<td>
										<img src={a.photo} alt={a.name} className="table-img" />
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
