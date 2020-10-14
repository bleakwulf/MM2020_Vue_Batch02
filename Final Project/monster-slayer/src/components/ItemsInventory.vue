<template>
    <div id="items-invemtpry-panel">
        TO DO: Items Inventory
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            inventory: null
        }
    }, 

    methods: {
        ...mapActions([ 'loadInventory' ]),
    }, 

    computed: {
        ...mapGetters([ 'getInventory' ])
    }, 

    async create() {
        await this.loadInventory()
            .then( res => {
                this.inventory = this.getInventory;
            })
    }

}
</script>

<style>

</style>