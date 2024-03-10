import NavigationBar from './navigationbar'
import {Outlet} from "react-router-dom";

function AppShell() {
    return (
        <div>
        <NavigationBar/>
        <Outlet/>
        </div>
    )
}

export default AppShell