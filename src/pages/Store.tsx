import React from "react";
import type { AccessoryDTO } from "../dtos/accessory";
import { BASE_URL } from ".";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Store: React.FC = () => {
	const [accessories, setAccessories] = React.useState<AccessoryDTO[]>([]);
	const [userAccessories, setUserAccessories] = React.useState<string[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [activeFilter, setActiveFilter] = React.useState("Всички");
	const { user, setUser } = useAuth();
	const navigate = useNavigate();

	React.useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const [accRes, userAccRes] = await Promise.all([
					fetch(`${BASE_URL}/accessories`),
					user ?
						fetch(`${BASE_URL}/accessories/user/${user.id}`)
					:	Promise.resolve({ json: () => [], ok: true } as any),
				]);

				const accData = await accRes.json();
				const userAccData =
					user && userAccRes.ok ? await userAccRes.json() : [];

				setAccessories(accData);
				setUserAccessories(userAccData);
			} catch (err) {
				toast.error("Грешка при зареждане на аксесоарите");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [user]);

	const getTypeName = (type: number) => {
		switch (type) {
			case 1:
				return "Топка";
			case 2:
				return "Значка";
			case 3:
				return "Обувки";
			default:
				return "Аксесоар";
		}
	};

	const getIcon = (type: number) => {
		switch (type) {
			case 1:
				return "fas fa-image";
			case 2:
				return "fas fa-magic";
			case 3:
				return "fas fa-shield-halved";
			default:
				return "fas fa-box";
		}
	};

	const userAccessoryIds = userAccessories.map((a) => a);
	const filteredAccessories = accessories.filter((acc) => {
		if (userAccessoryIds.includes(acc.id) || new Date(acc.endDate) < new Date())
			return false;

		const matchesSearch = acc.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());

		if (activeFilter === "Всички") return matchesSearch;
		if (activeFilter === "Топки") return matchesSearch && acc.type === 1;
		if (activeFilter === "Значки") return matchesSearch && acc.type === 2;
		if (activeFilter === "Обувки") return matchesSearch && acc.type === 3;
		return matchesSearch;
	});

	const handlePurchase = async (accessoryId: string) => {
		if (!user) {
			toast.error("Трябва да сте вписани, за да купувате аксесоари!");
			navigate("/login");
			return;
		}

		const accessory = accessories.find((a) => a.id === accessoryId);
		if (user.futcoins < accessory!.price) {
			toast.error("Нямате достатъчно средства за тази покупка!");
			return;
		}

		try {
			const response = await fetch(`${BASE_URL}/accessories/buy`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ accessoryId, userId: user.id }),
			});

			const data = await response.json();
			if (response.ok) {
        setUser({ ...user, futcoins: user.futcoins - accessory!.price });
        filteredAccessories.filter((a) => a.id !== accessoryId);
        toast.success("Аксесоарът е закупен успешно!");
			} else {
				toast.error(data.message || "Грешка при покупката.");
			}
		} catch (err) {
			toast.error("Възникна грешка при връзката със сървъра.");
		}
	};

	return (
		<>
			<title>Магазин за аксесоари – FutBrain</title>
			<section className="section-header section-header-no-border">
				<h1 className="text-light-green">Магазин за аксесоари</h1>
				<p className="text-light-green">Купи нови аксесоари за твоя профил.</p>
			</section>

			<div className="search-box mb-10 w-full">
				<input
					type="text"
					placeholder="Търси аксесоари по име..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<button type="button">
					<i className="fas fa-search"></i>
				</button>
			</div>

			<div className="filters">
				{["Всички", "Топки", "Значки", "Обувки"].map((filter) => (
					<button
						key={filter}
						className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
						onClick={() => setActiveFilter(filter)}
					>
						{filter}
					</button>
				))}
			</div>

			<div className="store-grid">
				{isLoading ?
					<p className="text-white">Зареждане...</p>
				: filteredAccessories.length > 0 ?
					filteredAccessories.map((acc) => (
						<div
							key={acc.id}
							className="item-card"
						>
							<div
								className={`item-preview ${acc.type === 1 ? "item-preview-gradient" : ""}`}
							>
								{acc.photo ?
									<img
										src={`${BASE_URL}/accessories/${acc.id}.webp`}
										alt={acc.name}
										style={{ maxWidth: "100%", maxHeight: "100%" }}
									/>
								:	<i
										className={`${getIcon(acc.type)} ${acc.type === 1 ? "text-white" : ""}`}
									></i>
								}
								<span className="item-tag">{getTypeName(acc.type)}</span>
							</div>
							<div className="item-info">
								<h3>{acc.name}</h3>
								<span className="item-price">
									{acc.price.toLocaleString()} FC
								</span>
								<button
									className="btn-buy"
									onClick={() => handlePurchase(acc.id)}
								>
									Купи сега
								</button>
							</div>
						</div>
					))
				:	<p className="no-results-msg">Няма нови аксесоари за закупуване.</p>}
			</div>
		</>
	);
};

export default Store;
