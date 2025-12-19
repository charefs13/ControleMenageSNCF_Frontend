import { useEffect, useState } from 'react';
import PageLayout from '../layouts/PageLayout';
import { useNavigate } from 'react-router-dom';

type UserRole = 'UTILISATEUR' | 'ADMIN';

export default function Main() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include', // envoie le cookie HttpOnly
        });

        if (!res.ok) {
          navigate('/login');
          throw new Error('Utilisateur non connecté');
        }

        const data = await res.json();
        setUserRole(data.role);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <PageLayout><p>Chargement...</p></PageLayout>;
  if (error) return <PageLayout><p className="errorMessage">{error}</p></PageLayout>;

  return (
    <PageLayout userRole={userRole}>
      <h1>Bienvenue — rôle : {userRole}</h1>
      {userRole === 'ADMIN' && <p>Tu es admin, tu peux voir la section Habilitation.</p>}
      {userRole === 'UTILISATEUR' && <p>Tu es un utilisateur classique, accès limité.</p>}
    </PageLayout>
  );
}
