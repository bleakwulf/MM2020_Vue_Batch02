import LoginForm from './components/LoginForm.vue';
import ProfileForm from './components/ProfileForm.vue';
import GameConsole from './components/GameConsole.vue';

export const routes = [
    {
        path: '/register',
        component: ProfileForm
    },
    {
        path: '/game',
        component: GameConsole
    },
    {
        path: '/',
        component: LoginForm
    }
];