/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Prices } from './pages/Prices';
import { Partners } from './pages/Partners';
import { PartnerDetail } from './pages/PartnerDetail';
import { Technologies } from './pages/Technologies';
import { About } from './pages/About';
import { Contacts } from './pages/Contacts';
import { FAQ } from './pages/FAQ';
import { ModalProvider } from './context/ModalContext';
import { SiteEditorProvider } from './context/SiteEditorContext';
import { LeadModal } from './components/LeadModal';
import { VisualEditor } from './components/VisualEditor';
import { EditorLauncher } from './components/EditorLauncher';
import { InlineVisualEditor } from './components/InlineVisualEditor';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const Router = import.meta.env.PROD && import.meta.env.BASE_URL !== '/' ? HashRouter : BrowserRouter;

  return (
    <ModalProvider>
      <Router>
        <SiteEditorProvider>
          <ScrollToTop />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/prices" element={<Prices />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/partners/:id" element={<PartnerDetail />} />
                <Route path="/technologies" element={<Technologies />} />
                <Route path="/about" element={<About />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/faq" element={<FAQ />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <LeadModal />
          <EditorLauncher />
          <InlineVisualEditor />
          <VisualEditor />
        </SiteEditorProvider>
      </Router>
    </ModalProvider>
  );
}
