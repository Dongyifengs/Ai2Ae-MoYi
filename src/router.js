import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: "/",
            name: 'tools',
            component: () => import("./views/Tools.vue")
        },
        {
            path: "/modes",
            name: 'modes',
            component: () => import("./views/Modes.vue")
        },
        {
            path: "/settings",
            name: 'settings',
            component: () => import("./views/Settings.vue")
        }
    ]
});
