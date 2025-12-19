import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        const res = await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // envoie le cookie pour suppression
        });

        if (res.ok) {
          navigate('/login'); // redirige vers login après déconnexion
        } else {
          console.error('Erreur lors de la déconnexion');
        }
      } catch (error) {
        console.error('Erreur réseau', error);
      }
    };

    logout();
  }, [navigate]);

  return null; // rien à afficher
}
