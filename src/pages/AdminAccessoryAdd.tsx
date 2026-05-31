import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from ".";

const AdminAccessoryAdd: React.FC = () => {
	const [name, setName] = React.useState<string>("");
	const [price, setPrice] = React.useState<number>(0);
	const [endDate, setEndDate] = React.useState<string>("");
	const [type, setType] = React.useState<number>(1);
	const [image, setImage] = React.useState<File | null>(null);
	const [imagePreview, setImagePreview] = React.useState<string | null>(null);
	const navigate = useNavigate();

	React.useEffect(() => {
		if (!image) {
			setImagePreview(null);
			return;
		}
		const objectUrl = URL.createObjectURL(image);
		if (image.name.split(".").pop() != "webp") {
			toast.error("Файлът трябва да бъде в .webp формат.");
		}

		setImagePreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [image]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData: FormData = new FormData(e.currentTarget);

		try {
			const res = await fetch(`${BASE_URL}/accessories/`, {
				credentials: "include",
				method: "POST",
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

	return (
		<>
			<div className="section-header">
				<h2>Добави нов аксесоар</h2>
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
							onChange={(e) => setEndDate(e.target.value)}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="accessory-img">Снимка на аксесоара</label>
						<div className="file-input-wrapper">
							<button
								type="button"
								className="btn-file"
							>
								<i className="fas fa-upload"></i> Избери снимка
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
						<label>Преглед на снимката</label>
						<div
							className="club-logo-display"
							id="accessory-image-preview"
						>
							{imagePreview ?
								<img
									src={imagePreview}
									alt="Преглед на снимката"
								/>
							:	<p>Няма избрана снимка</p>}
						</div>
					</div>

					<div className="form-actions">
						<button
							type="submit"
							className="btn-save"
							disabled={
								!image ||
								image.name.split(".").pop() != "webp" ||
								!name.trim() ||
								price < 0 ||
								!endDate
							}
						>
							Запази аксесоара
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

export default AdminAccessoryAdd;
