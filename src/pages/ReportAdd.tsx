import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '.';
import { useAuth } from '../auth/AuthContext';

const ReportAdd: React.FC = () => {
    const { targetId } = useParams<{ targetId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [content, setContent] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Взимаме типа на обекта от query параметрите
    const queryParams = new URLSearchParams(location.search);
    const targetType = queryParams.get('type') || 'Post';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error('Моля, въведете съдържание на доклада.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${BASE_URL}/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    from: user?.id,
                    targetType,
                    targetId,
                }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Докладът е изпратен успешно!');
                navigate(-1);
            } else {
                toast.error(data.message || 'Грешка при изпращане на доклада.');
            }
        } catch (error) {
            toast.error('Възникна грешка при връзката със сървъра.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: '600px' }}>
            <h2>Докладване на {targetType === 'Post' ? 'публикация' : targetType === 'Comment' ? 'коментар' : 'отговор'}</h2>
            <p>Моля, опишете защо докладвате това съдържание.</p>
            
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="content">Причина за доклада:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Опишете нарушението..."
                        rows={6}
                        required
                    ></textarea>
                </div>
                <button 
                    type="submit" 
                    className="btn-submit btn-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Изпращане...' : 'ИЗПРАТИ ДОКЛАД'}
                </button>
                <button 
                    type="button" 
                    className="btn-cancel btn-full mt-15"
                    onClick={() => navigate(-1)}
                    style={{ background: '#666', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                    ОТКАЗ
                </button>
            </form>
        </div>
    );
};

export default ReportAdd;
