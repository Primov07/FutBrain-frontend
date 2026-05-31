import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from ".";
import type { AccessoryDTO } from ".";

const AdminAccessoryUpdate: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [name, setName] = React.useState<string>("");
	const [price, setPrice] = React.useState<number>(0);
	const [endDate, setEndDate] = React.useState<string>("");
	const [type, setType] = React.useState<number>(1);
	const [image, setImage] = React.useState<File | null>(null);
	const [imagePreview, setImagePreview] = React.useState<string | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		const fetchData = async () => {
			try {
				if (id) {
					const res = await fetch(`${BASE_URL}/accessories/${id}`);
					if (!res.ok) throw new Error("Аксесоарът не е намерен.");
					const accessory: AccessoryDTO = await res.json();

					setName(accessory.name);
					setPrice(accessory.price);
					setType(accessory.type);
					setImagePreview(accessory.photo);
					
					const date = new Date(accessory.endDate);
					const formattedDate = date.toISOString().split("T")[0];
					setEndDate(formattedDate);
				} else throw new Error("Грешка при четенето на аксесоара.");
			} catch (err) {
				toast.error((err as any).message);
				navigate("/admin/accessories");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id, navigate]);

	React.useEffect(() => {
		if (!image) {
			return;
		}
		const objectUrl = URL.createObjectURL(image);
		if (image.name.split(".").pop() != "webp") {
			toast.error("Файлът трябва да бъде в .webp формат.");
		}

		setImagePreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [image]);

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData: FormData = new FormData(e.currentTarget);
		formData.append("id", id || "");

		try {
			const res = await fetch(`${BASE_URL}/accessories/`, {
				credentials: "include",
				method: "PUT",
				body: formData,
			});
			const json = await res.json();
			if (!res.ok) toast.error(json.message);
			else {
				toast.success(json.message);
				navigate("/admin/accessories");
			}
		} catch (err) {
			toast.error((err as any).message);
		}
	};

	if (isLoading) {
		return <div className="admin-content">Зареждане...</div>;
	}

	return (
		<>
			<div className="section-header">
				<h2>Редактирай аксесоар</h2>
			</div>

			<div className="admin-form-container">
				<p className="form-validation-info">
					* Името на аксесоара е задължително и трябва да бъде уникално.<br />
					* Типът на аксесоара и изтичащата дата са задължителни.<br />
					* Цената трябва да бъде естествено число.
				</p>
				<form
					className="admin-form"
					id="accessory-form"
					onSubmit={handleSubmit}
				>
					<div className="form-group">
						<label htmlFor="name">Име на аксесоара</label>
						<input
							type="text"
							id="name"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Въведете име..."
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="price">Цена (FutCoins)</label>
						<input
							type="number"
							id="price"
							name="price"
							value={price}
							onChange={(e) => setPrice(Number(e.target.value))}
							placeholder="Въведете цена..."
							required
							min="0"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="type">Тип</label>
						<select
							id="type"
							name="type"
							required
							value={type}
							onChange={(e) => setType(Number(e.target.value))}
						>
							<option value={1}>Топка</option>
							<option value={2}>Значка</option>
							<option value={3}>Обувки</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="endDate">Крайна дата</label>
						<input
							type="date"
							id="endDate"
							name="endDate"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="accessory-img">
							Снимка на аксесоара (оставете празно, ако не искате промяна)
						</label>
						<div className="file-input-wrapper">
							<button
								type="button"
								className="btn-file"
							>
								<i className="fas fa-upload"></i> Избери нова снимка
							</button>
							<input
								type="file"
								id="accessory-img"
								name="accessoryImg"
								accept="image/*"
								onChange={(e) => setImage(e.target.files?.[0] || null)}
							/>
						</div>
					</div>

					<div className="form-group player-preview-container">
						<label>Текуща/Нова снимка</label>
						<div
							className="club-logo-display"
							id="accessory-image-preview"
						>
							{imagePreview ?
								<img
									src={imagePreview.startsWith('http') ? imagePreview : `${BASE_URL}/accessory.png`}
									alt="Преглед на снимката"
									onError={(e) => {
										(e.target as HTMLImageElement).src = '/img/logo.png';
									}}
								/>
							:	<p>Няма снимка</p>}
						</div>
					</div>

					<div className="form-actions">
						<button
							type="submit"
							className="btn-save"
							disabled={
								(image && image.name.split(".").pop() != "webp") ||
								!name.trim() ||
								price < 0 ||
								!endDate
							}
						>
							Запази промените
						</button>
						<Link
							to="/admin/accessories"
							className="btn-cancel"
						>
							Отказ
						</Link>
					</div>
				</form>
			</div>
		</>
	);
};

export default AdminAccessoryUpdate;
