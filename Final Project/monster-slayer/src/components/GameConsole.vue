<template>
    <div id="game-console">
        <div class="nav-main">
            <router-link to="/game/profile/">Character</router-link> | 
            <router-link to="/game/dungeons/">Dungeons</router-link>
        </div>
        <button type="button"
            class="btn btn-info btn-logout"
            @click.prevent="signout()">LOGOUT</button>
            <router-view></router-view>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import ProfileMain from './ProfileMain'
import SkillsInventory from './SkillsInventory'

export default {

    methods: {
        ...mapActions([ 'logout' ]), 

        async signout() {
            await this.logout();
            this.$router.push('/');
        }
    }

}
</script>

<style>
    #game-console {
        border-radius: 10px;
        background: #ffffff;
        box-shadow:  20px 20px 60px #ad9d9d, 
                    -20px -20px 60px #ffffff;
        padding: 20px 30px;
        border: 0.5px solid #ffffff;
        position: relative;
        height: 100%;
    }

    .btn-logout {
            position: absolute;
            top: 20px;
            right: 35px;
    }

    .nav-main {
        height: 2.25rem;
        font-size: 1.25rem;
        margin-bottom: 20px;
        text-transform: uppercase;
        font-weight: 900;
    }

</style>