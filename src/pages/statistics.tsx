import { useState } from 'react';
import PageLayout from '../layouts/PageLayout';

export default function Statistics() {
  const [reportLoaded, setReportLoaded] = useState(false);
  const canEmbedReport =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  return (
    <PageLayout requireAuth requiredRole="ADMIN">
      <section className="dashboardGrid pageSection">
        <div className="dashboardHero">
          <div className="dashboardHeroContent">
            <div>
              <p className="pageEyebrow">Pilotage</p>
              <h1 className="dashboardHeroTitle">Tableau de bord Power BI</h1>
              <p className="pageSubtitle">
                Consultez les KPI, les comparaisons entre sites, les performances par
                type d&apos;espace et le détail des contrôles consolidés.
              </p>
            </div>

            <aside className="dashboardHeroAside">
              <h3>Contenu du rapport</h3>
              <ul>
                <li>Indicateurs de conformité et volumes de contrôles.</li>
                <li>Comparaisons par site, espace et agent.</li>
                <li>Analyse détaillée des résultats et des pièces jointes.</li>
              </ul>
            </aside>
          </div>
        </div>

        <div className="dashboardFrameCard">
          <div className="dashboardFrameHeader">
            <div>
              <h2>Rapport Power BI</h2>
              <p className="frameStatus">
                {canEmbedReport
                  ? reportLoaded
                    ? 'Le tableau de bord est prêt.'
                    : 'Chargement du rapport Power BI...'
                  : "L'ouverture intégrée n'est pas disponible sur cette adresse. Utilisez le bouton d'ouverture externe."}
              </p>
            </div>

            <a
              className="ghostButton"
              href="https://app.powerbi.com/links/Z0VGE6hC-A?ctid=4a7c8238-5799-4b16-9fc6-9ad8fce5a7d9&pbi_source=linkShare&bookmarkGuid=74ea3a75-19e1-42f0-9d63-83f18571a2ac"
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir Power BI
            </a>
          </div>

          {canEmbedReport ? (
            <div className="dashboardFrameWrapper reportFrameWrapper">
              <iframe
                className="reportFrame"
                src="https://app.powerbi.com/links/Z0VGE6hC-A?ctid=4a7c8238-5799-4b16-9fc6-9ad8fce5a7d9&pbi_source=linkShare&bookmarkGuid=74ea3a75-19e1-42f0-9d63-83f18571a2ac"
                title="Tableau de bord Power BI"
                allowFullScreen
                onLoad={() => setReportLoaded(true)}
              />
            </div>
          ) : (
            <div className="externalAccessCard">
              <h3>Ouverture externe recommandée</h3>
              <p>
                Power BI peut refuser l&apos;affichage dans une iframe lorsque l&apos;application
                est ouverte via une adresse IP locale ou sur mobile. Utilisez le bouton
                ci-dessus pour consulter le rapport.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
