import MainPage from "./MainPage";
import LandingPage from "./LandingPage";
import SignupPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import ForgotPassword from "./forgotPassword";
// import './dark.css'
import { BrowserRouter } from 'react-router-dom';
import {Route , Routes} from 'react-router-dom';

 function App (){
    return(
        <BrowserRouter>
        <Routes>
            <Route exact path='/' element={<LandingPage/>}/>
            <Route exact path='/SignUp' element={<SignupPage/>}/>
            <Route exact path='/LogIn' element={<LoginPage/>}/>
            <Route exact path='/ForgotPassword' element={<ForgotPassword/>}/>
            <Route exact path='/LogIn/:id' element={<MainPage/>}/>
         </Routes>
        </BrowserRouter>
    )
}

export default App;