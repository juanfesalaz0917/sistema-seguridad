// src/layout/DefaultLayout.tsx
import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { store } from '../store/store';
import { Provider } from 'react-redux';
import { useUiLibrary } from '../context/UiLibraryContext';

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { library } = useUiLibrary();

  // Clases adaptativas según la librería
  const getLayoutClasses = () => {
    if (library === 'bootstrap') {
      return 'layout-bootstrap';
    }
    if (library === 'mui') {
      return 'layout-mui';
    }
    // Tailwind por defecto
    return 'dark:bg-boxdark-2 dark:text-bodydark';
  };

  const getWrapperClasses = () => {
    if (library === 'bootstrap') {
      return 'd-flex vh-100 overflow-hidden';
    }
    if (library === 'mui') {
      return 'layout-mui-wrapper';
    }
    return 'flex h-screen overflow-hidden';
  };

  const getContentClasses = () => {
    if (library === 'bootstrap') {
      return 'content-area-bootstrap d-flex flex-column overflow-auto';
    }
    if (library === 'mui') {
      return 'content-area-mui';
    }
    return 'relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden';
  };

  const getMainClasses = () => {
    if (library === 'bootstrap') {
      return 'flex-fill';
    }
    return '';
  };

  const getMainInnerClasses = () => {
    if (library === 'bootstrap') {
      return 'container-fluid p-3 p-md-4';
    }
    if (library === 'mui') {
      return 'main-inner-mui';
    }
    return 'mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10';
  };

  return (
    <Provider store={store}>
      <div className={getLayoutClasses()}>
        <div className={getWrapperClasses()}>
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Content Area */}
          <div className={getContentClasses()}>
            {/* Header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content */}
            <main className={getMainClasses()}>
              <div className={getMainInnerClasses()}>
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default DefaultLayout;