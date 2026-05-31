import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '.';

interface ReportDTO {
    id: string;
    content: string;
    from: { username: string };
    sentDate: string;
    targetType: string;
    targetId: string;
    status: string;
}

const AdminReport: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [report, setReport] = React.useState<ReportDTO | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchReport = async () => {
        try {
            const response = await fetch(`${BASE_URL}/reports/${id}`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Грешка при зареждане на доклада.');
            const data = await response.json();
            setReport(data);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResolve = async (action: 'Approve' | 'Reject') => {
        if (!window.confirm(`Сигурни ли сте, че искате да ${action === 'Approve' ? 'ОДОБРИТЕ' : 'ОТХВЪРЛИТЕ'} този доклад?`)) return;

        try {
            const response = await fetch(`${BASE_URL}/reports/${id}/resolve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                fetchReport();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Възникна грешка при обработка на доклада.');
        }
    };

    React.useEffect(() => {
        fetchReport();
    }, [id]);

    if (isLoading) return <div className="admin-content">Зареждане...</div>;
    if (!report) return <div className="admin-content">Докладът не е намерен.</div>;

    return (
        <div className="admin-form-container">
            <h2>Детайли за доклад</h2>
            
            <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <p><strong>От потребител:</strong> {report.from?.username || 'Система'}</p>
                <p><strong>Дата:</strong> {new Date(report.sentDate).toLocaleString('bg-BG')}</p>
                <p><strong>Тип съдържание:</strong> {report.targetType}</p>
                <p><strong>ID на съдържанието:</strong> {report.targetId}</p>
                <p><strong>Статус:</strong> 
                    <span className={`status-active ${
                        report.status === 'Pending' ? 'status-user' : 
                        report.status === 'Resolved' ? 'status-active' : 'status-banned'
                    }`} style={{ marginLeft: '10px' }}>
                        {report.status === 'Pending' ? 'Чакащ' : 
                         report.status === 'Resolved' ? 'Одобрен' : 'Отхвърлен'}
                    </span>
                </p>
            </div>

            <div className="form-group">
                <label>Съдържание / Причина:</label>
                <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '100px', background: 'white' }}>
                    {report.content}
                </div>
            </div>

            <div className="form-actions">
                {report.status === 'Pending' && (
                    <>
                        <button 
                            className="btn-save" 
                            onClick={() => handleResolve('Approve')}
                        >
                            <i className="fas fa-check"></i> ОДОБРИ (Наложи Strike)
                        </button>
                        <button 
                            className="btn-force-end" 
                            style={{ marginTop: 0, padding: '12px 30px' }}
                            onClick={() => handleResolve('Reject')}
                        >
                            <i className="fas fa-times"></i> ОТХВЪРЛИ
                        </button>
                    </>
                )}
                <button 
                    className="btn-cancel" 
                    onClick={() => navigate('/admin/reports')}
                >
                    НАЗАД
                </button>
            </div>
        </div>
    );
};

export default AdminReport;
