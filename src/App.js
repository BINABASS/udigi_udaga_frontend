import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './components/auth/Welcome';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ForgotPassword from './components/auth/ForgotPassword';
import Properties from './components/properties/Properties';
import Layout from './components/layout/Layout';
import Booking from './components/booking/Booking';
import Contact from './components/Contact';
import './App.css';

// Configure React Router v7 future flags
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <Router future={routerConfig.future}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={
          <Layout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="properties" element={<Properties />} />
              <Route path="booking/:id" element={<Booking />} />
              <Route path="booking" element={<Booking />} />
              <Route path="bookings" element={<Navigate to="/dashboard/booking" replace />} />
            </Routes>
          </Layout>
        } />
        <Route path="/dashboard/*" element={
          <Layout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="properties" element={<Properties />} />
              <Route path="booking/:id" element={<Booking />} />
              <Route path="booking" element={<Booking />} />
              <Route path="bookings" element={<Navigate to="/dashboard/booking" replace />} />
            </Routes>
          </Layout>
        } />
        <Route path="/properties" element={<Navigate to="/dashboard/properties" replace />} />
      </Routes>
    </Router>
  );
}

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
// import Welcome from './components/auth/Welcome';
// import Login from './components/auth/Login';
// import Dashboard from './components/dashboard/Dashboard';
// import ForgotPassword from './components/auth/ForgotPassword';
// import Properties from './components/properties/Properties';
// import Layout from './components/layout/Layout';
// import Booking from './components/booking/Booking';
// import Contact from './components/Contact';
// import './App.css';

// // Configure React Router v7 future flags
// const routerConfig = {
//   future: {
//     v7_startTransition: true,
//     v7_relativeSplatPath: true
//   }
// };

// function App() {
//   return (
//     <Router future={routerConfig.future}>
//       <Routes>
//         <Route path="/" element={<Welcome />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/dashboard" element={
//           <Layout>
//             <Routes>
//               <Route index element={<Dashboard />} />
//               <Route path="properties" element={<Properties />} />
//               <Route path="booking/:id" element={<Booking />} />
//               <Route path="bookings" element={
//                 <div className="no-bookings">
//                   <h2>No Bookings</h2>
//                   <p>You need to select a property first.</p>
//                   <Link to="/dashboard/properties" className="back-btn">
//                     <i className="fas fa-arrow-left"></i> Back to Properties
//                   </Link>
//                 </div>
//               } />
//             </Routes>
//           </Layout>
//         } />
//         <Route path="/dashboard/*" element={
//           <Layout>
//             <Routes>
//               <Route index element={<Dashboard />} />
//               <Route path="properties" element={<Properties />} />
//               <Route path="booking/:id" element={<Booking />} />
//               <Route path="bookings" element={
//                 <div className="no-bookings">
//                   <h2>No Bookings</h2>
//                   <p>You need to select a property first.</p>
//                   <Link to="/dashboard/properties" className="back-btn">
//                     <i className="fas fa-arrow-left"></i> Back to Properties
//                   </Link>
//                 </div>
//               } />
//             </Routes>
//           </Layout>
//         } />
//         <Route path="/properties" element={<Navigate to="/dashboard/properties" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
