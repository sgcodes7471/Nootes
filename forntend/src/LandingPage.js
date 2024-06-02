
import './LandingPage.css';
import './LoginPage.css';
import './SignupPage.css';
import './MainPage.css';
import Navbar from './Navbar.js';

function LandingPage(){

  return(<>
 <div className="body-wrapper" id="landing-page-wrapper">

    <Navbar/>

    <div className="landing-page-header">
      <div className="landing-page-header-logo">NOOTES</div>
      <div className="landing-page-header-about">A verstatile online notes making application that helps you keep a track of yourself. The Simple yet Elegant design and the ease in it's usage is what makes it a standout!</div>
      <div className='landing-page-header-illustration'><img className='MainImg' alt=' ' src={require('./p1.png')}/></div>
      <div className="landing-page-header-btn-wrapper"><button>Happy Noting!</button></div>
    </div>

    
  </div>
  </>)
}

export default LandingPage