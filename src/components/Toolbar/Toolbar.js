import { NavLink } from 'react-router-dom';
import NavigationItems from '../Toolbar/NavigationItems/NavigationItems';
import './Toolbar.css';

const toolbar = props => {
    return (
        <header className="Header">
            <div><NavLink to="/" exact>Immune Ink</NavLink></div>
            <nav>
                <NavigationItems isAuthenticated={props.isAuthenticated}/>
            </nav>
        </header>
        //logo and togglerBtn
        //navigation menu
        //user profile...etc

    )
}

export default toolbar;