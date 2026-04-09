import { useState } from 'react';
import PageLayout from '../layouts/PageLayout';

export default function Main() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const canEmbedPowerApp =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  return (
    <PageLayout requireAuth>
      <section className="dashboardGrid pageSection">
        <div className="dashboardHero">
          <div className="dashboardHeroContent">
            <div>
              <p className="pageEyebrow">Contrôle de conformité</p>
              <h1 className="dashboardHeroTitle">Pilotage du contrôle de nettoyage</h1>
              <p className="pageSubtitle">
                Cette application remplace les Microsoft Forms utilisés pour les contrôles
                aléatoires de propreté afin de centraliser les données, fiabiliser le suivi
                et améliorer le pilotage opérationnel.
              </p>

              <div className="dashboardHighlights">
                <div className="dashboardHighlight">
                  <span className="dashboardHighlightMarker" />
                  <div>
                    <strong>Un contrôle par type d'espace</strong>
                    <div>
                      Chaque formulaire correspond à un seul type d'espace contrôlé pour
                      garantir une donnée claire, homogène et directement exploitable.
                    </div>
                  </div>
                </div>

                <div className="dashboardHighlight">
                  <span className="dashboardHighlightMarker" />
                  <div>
                    <strong>Traçabilité complète</strong>
                    <div>
                      Les informations générales, commentaires et pièces jointes sont
                      rattachés à chaque contrôle pour fiabiliser le suivi terrain.
                    </div>
                  </div>
                </div>

                <div className="dashboardHighlight">
                  <span className="dashboardHighlightMarker" />
                  <div>
                    <strong>Pilotage et reporting</strong>
                    <div>
                      Les données alimentent directement les tableaux de bord Power BI pour
                      suivre les KPI, comparer les sites et analyser les résultats par espace.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="dashboardHeroAside">
              <h3>Points clés</h3>
              <ul>
                <li>Parcours en 3 étapes: conditions, informations générales, conformité.</li>
                <li>Les critères sont saisis en Oui/Non avec Oui par défaut.</li>
                <li>Les contrôles sont exploitables en temps réel dans Power BI.</li>
              </ul>
            </aside>
          </div>
        </div>

        <div className="dashboardFrameCard">
          <div className="dashboardFrameHeader">
            <div>
              <h2>Formulaire de contrôle</h2>
              <p className="frameStatus">
                {canEmbedPowerApp
                  ? iframeLoaded
                    ? 'Le formulaire est prêt à être utilisé.'
                    : 'Chargement de l\'application Power Apps...'
                  : "L'ouverture intégrée n'est pas disponible sur cette adresse. Utilisez le bouton d'ouverture externe."}
              </p>
            </div>

            <div className="btnContainer">
              <a
                className="ghostButton"
                href="https://apps.powerapps.com/play/e/263349cf-5373-4f27-a7c8-e0df42ddde59/a/41fe4118-d663-4772-a8d4-3526e8533c92?tenantId=4a7c8238-5799-4b16-9fc6-9ad8fce5a7d9"
                target="_blank"
                rel="noreferrer"
              >
                Ouvrir Power Apps
              </a>
            </div>
          </div>

          {canEmbedPowerApp ? (
            <div className="dashboardFrameWrapper">
              <iframe
                className="powerAppFrame"
                src="https://apps.powerapps.com/play/e/263349cf-5373-4f27-a7c8-e0df42ddde59/a/41fe4118-d663-4772-a8d4-3526e8533c92?tenantId=4a7c8238-5799-4b16-9fc6-9ad8fce5a7d9"
                title="Formulaire Power Apps"
                allow="fullscreen"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
          ) : (
            <div className="externalAccessCard">
              <h3>Ouverture externe recommandée</h3>
              <p>
                Sur mobile ou via une adresse IP locale, Microsoft peut bloquer
                l&apos;affichage embarqué de Power Apps. Ouvrez l&apos;application dans un
                nouvel onglet pour l&apos;utiliser normalement.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
