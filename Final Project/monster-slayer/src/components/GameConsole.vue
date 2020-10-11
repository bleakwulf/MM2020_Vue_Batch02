<template>
    <div id="game-console">
        <app-profile />
        <button type="button"
            class="btn btn-info"
            @click.prevent="signout()">SIGN OUT</button>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Profile from './Profile'

export default {
    components: {
        'app-profile': Profile
    }, 
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
    }

</style>