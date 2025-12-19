// src/layout/pageLayout.tsx

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../index.css";

interface PageLayoutProps {
  children: ReactNode;
}

type UserRole = 'UTILISATEUR' | 'ADMIN';

export default function PageLayout({ children }: PageLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const isActive = (path: string) =>
    location.pathname === path || (path === '/mainPage' && location.pathname === '/');
  const isHabilitationActive =
    location.pathname.startsWith('/addAuthorization') ||
    location.pathname.startsWith('/manageAuthorization');

  const isSubActive = (path: string) => location.pathname === path;

  // --- Récupération du rôle depuis le backend ---
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          setUserRole(null);
          return;
        }

        const data = await res.json();
        setUserRole(data.role);
      } catch (err) {
        console.error('Impossible de récupérer le rôle utilisateur', err);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // --- Déconnexion ---
  const logout = () => {
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="layout flex flex-col min-h-screen">
      <header className="bgColorFooterHeaderNav p-4 flex justify-start">
        <a href="/">
          <img
            className="logoSncfVoyageurs"
            src="../../public/sncfVoyageurs.png"
            alt="Logo Sncf Voyageur blanc"
          />
        </a>
      </header>

      <main className="flex-1 flex p-4">
        {/* --- Sidebar uniquement si connecté --- */}
        {userRole && (
          <aside>
            <nav>
              <ul>
                {/* Contrôle Nettoyage */}
                <li className={isActive('/mainPage') ? 'selected' : ''}>
                  <a href="/mainPage">
                    <img
                      className="navIcon"
                      src={
                        isActive('/mainPage')
                          ? "../../public/menage.png"
                          : "../../public/menagePlein.png"
                      }
                      alt="icone nettoyage"
                    />
                    
                  </a>
                  <a href="/mainPage"  className="bigNav ">Controle Nettoyage</a>
                </li>

                {/* Habilitation (ADMIN uniquement) */}
                {userRole === 'ADMIN' && (
                  <li className={isHabilitationActive ? 'selected' : ''}>
                    <ul className="habilitationUl">
                      <li>
                        <img
                          className="navIcon"
                          src={
                            isHabilitationActive
                              ? "../../public/habilitation.png"
                              : "../../public/habilitationPlein.png"
                          }
                          alt="icone habilitation"
                        />
                        <div className="bigNav">Habilitation</div>
                      </li>

                      <div className="none">
                        <li className={location.pathname === '/addAuthorization' ? 'selectedItem' : 'white'}>
                          <a href="/addAuthorization">Ajouter une habilitation</a>
                        </li>
                        <li className={location.pathname === '/manageAuthorization' ? 'selectedItem' : 'white'}>
                          <a href="/manageAuthorization">Gérer une habilitation</a>
                        </li>
                      </div>
                    </ul>
                  </li>
                )}
              </ul>
            </nav>

            {/* Déconnexion */}
            <div className="logoutContainer">
              <a href="/logout" onClick={logout}>
                <img
                  className="logout"
                  src="../../public/logout.png"
                  alt="icone deconnexion"
                />
              </a>
              <a className="bigNav" href="/logout" onClick={logout}>
                Déconnexion
              </a>
            </div>
          </aside>
        )}

        {children}
      </main>

      <footer className="bgColorFooterHeaderNav">
        <a
          href="https://www.sncf-voyageurs.com/fr/"
          target="_blank"
          className="footerText"
        >
          © SNCF Voyageurs – Tous droits réservés
        </a>

        <img
          src="../../public/logo_TgvInoui.png"
          alt="Logo Tgv Inoui blanc"
        />
      </footer>
    </div >
  );
}
