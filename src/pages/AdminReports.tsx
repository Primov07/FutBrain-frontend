import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '.';
import { toast } from 'react-toastify';

interface ReportDTO {
    id: string;
    content: string;
    from: { username: string };
    sentDate: string;
    targetType: string;
    status: string;
}

const AdminReports: React.FC = () => {
    const [reports, setReports] = React.useState<ReportDTO[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/reports`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Грешка при зареждане на докладите.');
            const data = await response.json();
            setReports(data);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchReports();
    }, []);

    if (isLoading) return <div className="admin-content">Зареждане...</div>;

    return (
        <section className="data-section">
            <div className="section-header">
                <h2>Управление на доклади</h2>
                <button className="btn-refresh" onClick={fetchReports}>
                    <i className="fas fa-sync-alt"></i>
                </button>
            </div>

            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>От потребител</th>
                            <th>Тип обект</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                <tr key={report.id}>
                                    <td>{new Date(report.sentDate).toLocaleDateString('bg-BG')}</td>
                                    <td>{report.from?.username || 'Система'}</td>
                                    <td>{report.targetType}</td>
                                    <td>
                                        <span className={`status-active ${
                                            report.status === 'Pending' ? 'status-user' : 
                                            report.status === 'Resolved' ? 'status-active' : 'status-banned'
                                        }`}>
                                            {report.status === 'Pending' ? 'Чакащ' : 
                                             report.status === 'Resolved' ? 'Одобрен' : 'Отхвърлен'}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/admin/reports/${report.id}`} className="btn-edit">
                                            <i className="fas fa-eye"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center' }}>Няма налични доклади.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminReports;
