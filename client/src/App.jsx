// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


// import TaskList from './components/TaskList.jsx';
// import Register from './components/Register';
// import './index.css';

// function App() {
//   return (
//     <div className="app-container">
//       {/* <TaskList /> */}
//      <center> <h1> Task Manager </h1> </center> 
//       <Register />
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Tasks from './components/Tasks';
import TaskDetails from './components/TaskDetails';
function App() {
  // const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Default route redirects to /register */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Tasks page (protected route) */}
        <Route 
          path="/tasks" 
          element={localStorage.getItem('token') ? <Tasks /> : <Navigate to="/login" />} 
        />

            <Route 
          path="/tasks/:id" 
          element={localStorage.getItem('token') ? <TaskDetails /> : <Navigate to="/tasks" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
