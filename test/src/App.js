import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./routes/Login.js"
import Home from "./routes/Home.js"
import Profile from "./routes/Profile.js"
import ContextProvider from "./Context.js"
import OtherProfile from "./routes/OtherProfile.js"
function App() {
  return (
    <div>

        <BrowserRouter>
        <ContextProvider>
        <Routes>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/user/:id" element={<OtherProfile/>}/>
        </Routes>
        </ContextProvider>
        </BrowserRouter>


    </div>
    )
}

export default App;
