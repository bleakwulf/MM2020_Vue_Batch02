<template>
    <div>
        <div class="profile-menu">
            <router-link to="/game/profile/">Profile</router-link> | 
            <router-link to="/game/profile/skills/">Skills</router-link> | 
            <router-link to="/game/profile/inventory/">Items</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {

}
</script>

<style>
    .profile-menu {
        text-align: center;
        margin-bottom: 20px;
        text-transform: uppercase;
        font-weight: 700;
    }
</style>