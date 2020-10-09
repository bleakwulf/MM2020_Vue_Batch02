import Login from './components/Login.vue';
import Register from './components/Register.vue';
// import GameConsole from './components/GameConsole.vue';

export const routes = [
    {
        path: '/register',
        component: Register
    },
    // {
    //     path: '/game',
    //     component: GameConsole
    // },
    {
        path: '/',
        component: Login
    }
];