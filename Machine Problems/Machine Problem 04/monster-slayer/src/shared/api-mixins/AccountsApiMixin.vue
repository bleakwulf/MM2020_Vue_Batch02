<script>
import * as APP_CONSTANTS from '../constants/constants.js';

const accountsApiUrl = `${APP_CONSTANTS.baseApiUrl}/accounts`;

export default {
    methods: {
        register(accountData) {
            return this.$http.post(accountsApiUrl, accountData);
        },
        login(loginData) {
            return this.$http.post(`${accountsApiUrl}/login`, loginData);
        },
        getCharacter(accountId) {
            return this.$http.get(`${accountsApiUrl}/${accountId}/character`);
        }
    }
    
}
</script>