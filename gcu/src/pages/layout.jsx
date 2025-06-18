import { Outlet, Link } from "react-router-dom";
import '../index'
import '../App'
import ph from '../assets/orionthemes-placeholder-image-2.png'

const Layout = () => {
  return (
    <>
      <nav>
        <header>
          <img className = "logo" src ={ph} alt = "gc_logo" height = "150px"/>
          <div id = "title">GUARD COMICS</div>

          <div className = "dropdown">
            <img className ="menu" src ="https://upload.wikimedia.org/wikipedia/commons/d/db/MenuResp.png"  alt="empty" width = "60px" height = "60px" />
            <div className = "dropdown-content">
              <ul>
                <li>
                  <button><Link to="/">Home</Link></button>
                </li>
                <li>
                  <button><Link to="/gallery">Gallery</Link></button>
                </li>
                <li>
                  <button><Link to="/contact">Contact</Link></button>
                </li>
              </ul>
              {/* <button className="button-57" role="button"><span className="text">Artisans' Quarters</span><span>Comic List</span></button>
              <button className="button-57" role="button"><span className="text">Town Bulletin</span><span>Latest Updates</span></button>
              <button className="button-57" role="button"><span class="text">Spring Gala</span><span>New Comics</span></button>
              <button className="button-57" role="button"><span class="text">Genres</span><span>IDK Genres</span></button> 
              <button className="button-57" role="button"><span className="text">King's Court</span><span>Info & More</span></button> */}
            </div>
          </div>
        </header>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;