// src/layout/PageLayout.tsx

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../index.css';

interface PageLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: UserRole;
}

type UserRole = 'UTILISATEUR' | 'ADMIN';

export default function PageLayout({
  children,
  requireAuth = false,
  requiredRole,
}: PageLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const publicPaths = ['/login', '/reset-password', '/update-password'];
  const isPublicPage = publicPaths.includes(location.pathname);

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path ||
    (path === '/mainPage' && location.pathname === '/');

  const isHabilitationActive =
    location.pathname.startsWith('/addAuthorization') ||
    location.pathname.startsWith('/manageAuthorization');
  const isStatisticsActive = location.pathname.startsWith('/statistics');

  // Le layout centralise l'authentification et les droits pour éviter que
  // chaque page protégée réimplémente le même appel à /auth/me.
  useEffect(() => {
    if (isPublicPage) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          setUserRole(null);
          if (requireAuth || requiredRole) {
            navigate('/login', { replace: true });
          }
          return;
        }

        const data = await res.json();
        setUserRole(data.role);

        if (requiredRole && data.role !== requiredRole) {
          navigate('/mainPage', { replace: true });
        }
      } catch {
        setUserRole(null);
        if (requireAuth || requiredRole) {
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [isPublicPage, navigate, requireAuth, requiredRole]);

  // La déconnexion locale reste simple: on supprime le cookie puis on renvoie
  // vers l'écran de connexion.
  const logout = () => {
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (loading) {
    return <div className="contentShell">Chargement...</div>;
  }

  return (
    <div className="layout">
      <header className="appHeader">
        <Link to="/" className="logoLink" aria-label="Retour à l'accueil">
          <img className="logoSncfVoyageurs" src="/sncfVoyageurs.png" alt="Logo SNCF Voyageurs" />
        </Link>

        {userRole && (
          <div className="headerActions">
            <button
              type="button"
              className="menuButton"
              onClick={() => setMenuOpen((previous) => !previous)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
            >
              <img src={menuOpen ? '/retour.png' : '/menu.png'} alt="" aria-hidden="true" />
            </button>
          </div>
        )}
      </header>

      {userRole && <div className={`sidebarOverlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />}

      {userRole && (
        <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
          <div className="sidebarBrand" />

          <nav className="sidebarNav" aria-label="Navigation principale">
            <ul className="navList">
              <li className="navItem">
                <NavLink
                  to="/mainPage"
                  className={({ isActive: navActive }) =>
                    `navLink ${navActive || isActive('/mainPage') ? 'active' : ''}`.trim()
                  }
                >
                  <img
                    className="navIcon"
                    src={isActive('/mainPage') ? '/menage.png' : '/menagePlein.png'}
                    alt=""
                    aria-hidden="true"
                  />
                  <span className="navLabel">Contrôle nettoyage</span>
                </NavLink>
              </li>

              {userRole === 'ADMIN' && (
                <>
                  <li className="navItem">
                    <NavLink
                      to="/statistics"
                      className={({ isActive: navActive }) =>
                        `navLink ${navActive || isStatisticsActive ? 'active' : ''}`.trim()
                      }
                    >
                      <img
                        className="navIcon"
                        src={isStatisticsActive ? '/stat.png' : '/statPlein.png'}
                        alt=""
                        aria-hidden="true"
                      />
                      <span className="navLabel">Statistiques</span>
                    </NavLink>
                  </li>

                  <li className="navItem">
                    <div className={`navButton ${isHabilitationActive ? 'active' : ''}`}>
                      <img
                        className="navIcon"
                        src={isHabilitationActive ? '/habilitation.png' : '/habilitationPlein.png'}
                        alt=""
                        aria-hidden="true"
                      />
                      <span className="navLabel">Habilitation</span>
                    </div>

                    <ul className="subNavList submenu">
                      <li>
                        <NavLink
                          to="/addAuthorization"
                          className={({ isActive: navActive }) =>
                            `submenuLink ${navActive ? 'active' : ''}`.trim()
                          }
                        >
                          Ajouter une habilitation
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/manageAuthorization"
                          className={({ isActive: navActive }) =>
                            `submenuLink ${navActive ? 'active' : ''}`.trim()
                          }
                        >
                          Gérer une habilitation
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className="logoutContainer">
            <button type="button" className="logoutButton" onClick={logout}>
              <img className="logout" src="/logout.png" alt="" aria-hidden="true" />
              <span className="navLabel">Déconnexion</span>
            </button>
          </div>
        </aside>
      )}

      <div className="contentShell">
        <main className="pageMain">{children}</main>
      </div>

      <footer className="footer">
        <a
          href="https://www.sncf-voyageurs.com/fr/"
          target="_blank"
          rel="noreferrer"
          className="footerText"
        >
          © SNCF Voyageurs - Tous droits réservés
        </a>
        <img src="/logo_TgvInoui.png" alt="Logo TGV Inoui" />
      </footer>
    </div>
  );
}
