<template>
  <div>
    <div class="container">
        <div class="h-spacer"></div>
        <div class="login-form main-form">
            <form>
                <div class="form-group">
                    <input type="text"
                        name="username"
                        placeholder="Username" 
                        v-model.lazy.trim="loginData.username"
                        @blur="$v.loginData.username.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.loginData.username.$error 
                        }">
                    <div class="error" v-if="$v.loginData.username.$dirty && !$v.loginData.username.required">Username is required.</div>
                </div>
                <div class="form-group">
                    <input type="password"
                        name="password"
                        placeholder="Password" 
                        v-model.lazy.trim="loginData.password"
                        @blur="$v.loginData.password.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.loginData.password.$error 
                        }">
                    <div class="error" v-if="$v.loginData.password.$dirty && !$v.loginData.password.required">Password is required.</div>
                </div>
                <div class="text-center mt-4 action-buttons">
                    <button type="submit"
                        class="btn btn-info"
                        :disabled="$v.$invalid"
                            @click.prevent="signin()">LOGIN</button>
                    <button type="button"
                        class="btn btn-info"
                            @click.prevent="signup()">SIGN UP</button>
                </div>
            </form>
            <p>accountId {{ accountId }}</p>
            <p>userdata {{ userdata }}</p>
        </div>
        <div class="h-spacer"></div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex'

export default {
    data() {
        return {
            loginData: {
                username: '', 
                password: ''
            }
        }
    }, 
    validations: {
        loginData: {
            username: {
                required
            }, 
            password: {
                required
            }
        }
    },
    methods: {
        ...mapActions([ 'login', 'logout']),
        signin() {
            // this.login(this.loginData);
            this.login(this.loginData)
                .then( res => {
                    this.$router.push('/game')
                }).catch( error =>
                    alert(error)
                );
        }, 
        signup: function() {
            this.$router.push('/register')
        }, 
    }, 
    computed: {
        ...mapGetters({ 
            accountId: 'getAccountId', 
            userdata: 'getUser'
        })
    }

}
</script>

<style>
    .container {
        display: flex;
        flex-flow: row nowrap;
    }
    .h-spacer {
        flex-grow: 1;
    }

    .main-form {
        flex-grow: 1;
        flex-basis: 45%;
    }

</style>