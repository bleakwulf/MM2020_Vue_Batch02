import Login from './components/Login.vue';
import Register from './components/Register.vue';
import GameConsole from './components/GameConsole.vue';
import Profile from './components/Profile.vue'
import ProfileMain from './components/ProfileMain.vue'
import ItemsInventory from './components/ItemsInventory.vue';
import SkillsInventory from './components/SkillsInventory.vue';
import Dungeons from './components/Dungeons.vue';
import Battleground from './components/Battleground.vue';

export const routes = [
    {
        path: '/register',
        component: Register
    },
    {
        path: '/game',
        component: GameConsole, 
        children: [
            {
                name: 'profile', 
                path: 'profile', 
                component: Profile, 
                children: [
                    {
                        path: '', 
                        component: ProfileMain

                    }, 
                    {
                        path: 'skills', 
                        component: SkillsInventory
                    }, 
                    {
                        path: 'inventory', 
                        component: ItemsInventory
                    }
                ]
            }, 
            {
                name: 'dungeons',
                path: 'dungeons', 
                component: Dungeons
            }, 
            {
                name: 'encounter',
                path: 'encounter', 
                component: Battleground
            }
        ]
    },
    {
        path: '/',
        component: Login
    }
];