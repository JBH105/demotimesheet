import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from './components/Common/Loading';


// Lazy-load your route components
const LazyLogin = React.lazy(() => import('./screens/Login'));
const LazyLanding = React.lazy(() => import('./screens/Landing'));
const LazyHome = React.lazy(() => import('./screens/Timesheet/Home'));
const LazyEmployee = React.lazy(() => import('./screens/Timesheet/Employee'));
const LazyManagerTimesheet = React.lazy(() => import('./screens/Timesheet/ManagerTimeSheet'));
const LazyTimesheet = React.lazy(() => import('./screens/Timesheet/Timesheet'));
const LazyPending = React.lazy(() => import('./screens/Timesheet/Pending'));
const LazyHelp = React.lazy(() => import('./screens/Timesheet/Help'));
const LazyManagement = React.lazy(() => import('./screens/Manegement'));

const LazyRolliesHome = React.lazy(() => import('./screens/Materials/RolliesHome'));
const LazyRollies = React.lazy(() => import('./screens/Materials/Rollies'));
const LazySavedRollies = React.lazy(() => import('./screens/Materials/SavedRollies'));

const LazyMakersHome = React.lazy(() => import('./screens/Materials/Makers/MakersHome'));
const LazyMakers = React.lazy(() => import('./screens/Materials/Makers/Makers'));
const LazySavedMakers = React.lazy(() => import('./screens/Materials/Makers/SavedMakers'));

const LazyPackersHome = React.lazy(() => import('./screens/Materials/Packers/PackersHome'));
const LazyPackers = React.lazy(() => import('./screens/Materials/Packers/Packers'));
const LazySavedPackers = React.lazy(() => import('./screens/Materials/Packers/SavedPackers'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<LazyLogin />} />
          <Route path="/landing" element={<LazyLanding />} />
          <Route path="/home" element={<LazyHome />} />
          <Route path="/profiles" element={<LazyEmployee />} />
          <Route path="/managertimesheet" element={<LazyManagerTimesheet />} />
          <Route path="/timesheet" element={<LazyTimesheet />} />
          <Route path="/pending" element={<LazyPending />} />
          <Route path="/help" element={<LazyHelp />} />
          <Route path="/management" element={<LazyManagement />} />

          <Route path="/materials/rollies/home" element={<LazyRolliesHome />} />
          <Route path="/materials/rollies/sheet" element={<LazyRollies />} />
          <Route path="/materials/rollies/saved" element={<LazySavedRollies />} />

          <Route path="/materials/makers/home" element={<LazyMakersHome />} />
          <Route path="/materials/makers/sheet" element={<LazyMakers />} />
          <Route path="/materials/makers/saved" element={<LazySavedMakers />} />

          <Route path="/materials/packers/home" element={<LazyPackersHome />} />
          <Route path="/materials/packers/sheet" element={<LazyPackers />} />
          <Route path="/materials/packers/saved" element={<LazySavedPackers />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
