import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';

import PageTitleUpdater from '../components/common/PageTitleUpdater';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PageTitleUpdater />
      <Navbar />
      <main className="flex-grow">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
