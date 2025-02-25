import {Link} from 'react-router-dom'
import Search from '../search-box/Search';
import './Header.css'

function Header(){
    return (
       <div className="header d-flex justify-content-between align-items-center bg-info">
        <Link to ='/'>
        <img src="https://static.gamberorosso.it/dishcovery-logo.jpg" className='w-25' alt="logo" />
        </Link>

        <ul className="nav d-flex gap-3">
            <li className="nav-item links">
                <Link to ='/'>Home</Link>
            </li>

            <li className="nav-item links">
                <Link to ='/'>Explore</Link>
            </li>

            <li className="nav-item links">
                <Link to ='/saved'>Saved</Link>
            </li>

            <li className="nav-item links">
                <Link to ='/community'>Community</Link>
            </li>
            <li className="nav-item links">
                <Link to ='/login'>Login</Link>
            </li>
            <li className="nav-item links">
                <Link to ='/register'>Register</Link>
            </li>
        </ul>

        <Search/>
       </div>
    )
}

export default Header;