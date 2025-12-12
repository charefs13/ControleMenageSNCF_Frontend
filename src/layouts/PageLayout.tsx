import type { ReactNode } from 'react';
import "../index.css";

interface PageLayoutProps {
    children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
    return (
        <div className="layout flex flex-col min-h-screen">
            <header className="bgColorFooterHeaderNav p-4 flex justify-start">
                <img src="" alt="Logo Sncf Voyageur blanc" />
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                {children}
            </main>
            <footer className="bgColorFooterHeaderNav">
                <img src="../../public/logo_TgvInoui.png" alt="Logo Tgv Inoui blanc" />
            </footer>
        </div>
    );
}
