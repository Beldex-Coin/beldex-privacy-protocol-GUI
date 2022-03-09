import Home from "../../pages/Home/Home"
import Dashboard from "../../pages/Dashboard/Dashboard";
import PageNotFound from "../../pages/PageNotFound/PageNotFound"
const routes = [
    { path: "/home", component: Home },
    { path: "/", component: Home, exact: true },
    { path: "/dashboard", component: Dashboard },
    { path: "/*", component: PageNotFound }
];

export default routes;