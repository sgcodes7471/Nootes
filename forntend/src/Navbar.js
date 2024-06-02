import {useState} from 'react';
import {Link} from 'react-router-dom'
import './LandingPage.css';
import './LoginPage.css';
import './SignupPage.css';
import './MainPage.css';


function Navbar(){
  const [theme, setTheme]=useState(false);
  function handleThemes(){
    setTheme(!theme);
  }

  //white:false

  return(<>
   
    <div className="navbar-wrapper">
      <ul className="landing-page-navbar-ul">
        <li><Link to='/LogIn'>LogIn</Link> <div className='li-underscore'></div> </li>
        <li><Link to='/SignUp'>SignUp</Link>  <div className='li-underscore'></div></li>
        <li><button onClick={(e)=>{handleThemes()}}>{theme?(`Bright Side`):('Dark Side')}</button>  <div className='li-underscore'></div></li>
      </ul>
    </div>
  </>)
}

export default Navbar