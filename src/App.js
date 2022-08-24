import 'bootstrap/dist/css/bootstrap.min.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SigIn from './pages/SigIn';
import LogIn from "./pages/LogIn";
import { useState } from "react";
import UserPage from "./pages/UserPage";

const PrivateRoute = (props) => {
    return props.isAuthenticated ? props.children : <LogIn />
};

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    onAuthStateChanged(auth, user => {
        if (user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    });

  return (
    <BrowserRouter>
        <Header isAuthenticated={isAuthenticated}/>
        <Routes>
            <Route path={'/signup'} element={<SigIn />} isAuthenticated={isAuthenticated} />
            <Route path={'/login'} element={<LogIn />} isAuthenticated={isAuthenticated} />
            <Route path={'/user'} element={(
                <PrivateRoute isAuthenticated={isAuthenticated}>
                    <UserPage />
                </PrivateRoute>
            )} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
