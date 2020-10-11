import Login from './components/Login.vue';
import Register from './components/Register.vue';
import GameConsole from './components/GameConsole.vue';
import Profile from './components/Profile.vue'
import ProfileMain from './components/ProfileMain.vue'
import Inventory from './components/Inventory.vue';
import SkillsInventory from './components/SkillsInventory.vue';
import Dungeons from './components/Dungeons.vue';

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
                        path: 'inventory', 
                        component: Inventory,
                        children: [
                            {
                                path: '', 
                                component: SkillsInventory
                            }
                        ]
                    }
                ]
            }, 
            {
                name: 'dungeons',
                path: 'dungeons', 
                component: Dungeons
            }
        ]
    },
    {
        path: '/',
        component: Login
    }
];