import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from ".";

interface Club {
	name: string;
	url: string;
}

const clubsUrl: string = `${BASE_URL}/clubs`;

const AdminPlayerAdd: React.FC = () => {
	const [clubs, setClubs] = React.useState<Club[]>([]);
	const [selectedClub, setSelectedClub] = React.useState<Club | null>(null);
	const [playerName, setPlayerName] = React.useState<string>("");
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

	React.useEffect(() => {
		fetch(clubsUrl)
			.then((response) => response.json())
			.then((data: Club[]) => {
				console.log("Fetched clubs:", data);
				setClubs(data);
			})
			.catch((err) => toast.error(err.message));
	}, []);

	const handleClubChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const clubName: string = event.target.value;
		const club: Club | null = clubs.find((c) => c.name === clubName) || null;
		setSelectedClub(club);
	};

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData: FormData = new FormData(e.currentTarget);

		try {
			const res = await fetch(`${BASE_URL}/players/`, {
				credentials: "include",
				method: "POST",
				body: formData,
			});
			const json = await res.json();
			if (!res.ok) toast.error(json.message);
			else toast.success(json.message);
			navigate("/admin/players");
		} catch (err) {
			toast.error((err as any).message);
		}
	};

	return (
		<>
			<div className="section-header">
				<h2>Добави нов играч</h2>
			</div>

			<div className="admin-form-container">
				<p className="form-validation-info">
					* Име на играча и снимка са задължителни.
				</p>
				<form
					className="admin-form"
					id="player-form"
					onSubmit={handleSubmit}
				>
					<div className="form-group">
						<label htmlFor="player-name">Име на играча</label>
						<input
							type="text"
							id="player-name"
							name="playerName"
							onChange={(e) => setPlayerName(e.target.value)}
							placeholder="Въведете име..."
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="player-club">Клуб</label>
						<select
							id="player-club"
							required
							defaultValue=""
							name="club"
							onChange={handleClubChange}
						>
							<option
								value=""
								disabled
							>
								Изберете клуб...
							</option>
							{clubs.map((club) => (
								<option
									key={club.name}
									value={club.name}
								>
									{club.name}
								</option>
							))}
						</select>
					</div>

					<div className="form-group club-preview-container">
						<label>Лого на избрания клуб</label>
						<div
							className="club-logo-display"
							id="club-logo-preview"
						>
							{selectedClub ?
								<img
									src={`${selectedClub.url}`}
									alt={`${selectedClub.name}`}
								/>
							:	<p>Няма избран клуб</p>}
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="player-img">Снимка на играча</label>
						<div className="file-input-wrapper">
							<button
								type="button"
								className="btn-file"
							>
								<i className="fas fa-upload"></i> Избери снимка
							</button>
							<input
								type="file"
								id="player-img"
								name="playerImg"
								accept="image/*"
								onChange={(e) => setImage(e.target.files?.[0] || null)}
							/>
						</div>
					</div>

					<div className="form-group player-preview-container">
						<label>Снимка на избрания играч</label>
						<div
							className="club-logo-display"
							id="player-image-preview"
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
								!playerName.trim() ||
								!selectedClub
							}
						>
							Запази играча
						</button>
						<Link
							to="/admin/players"
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

export default AdminPlayerAdd;
