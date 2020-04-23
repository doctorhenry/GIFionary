import Vue from "vue";
import Router from "vue-router";
import MainMenu from "./components/MainMenu.vue";
import Routes from "../../library/constants/routes";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: Routes.Mainmenu,
            component: MainMenu,
            props: true
        },
        {
            path: `/${Routes.Game}`,
            name: Routes.Game,
            component: () => import( "./components/Game.vue"),
            props: true
        },
        {
            path: `/${Routes.RoomList}`,
            name: Routes.RoomList,
            component: () => import( "./components/RoomList.vue"),
            props: true
        },
    ]
});