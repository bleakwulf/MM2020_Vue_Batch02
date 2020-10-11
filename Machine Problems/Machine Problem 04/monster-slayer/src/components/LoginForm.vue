<template>
    <div class="container">
        <div class="h-spacer"></div>
        <div class="login-form">
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
                <div class="text-center mt-4">
                    <button type="submit"
                        class="btn btn-info"
                        :disabled="$v.$invalid"
                         @click.prevent="signin()">LOGIN</button>
                    <button type="button"
                        class="btn btn-info"
                         @click.prevent="signup()">SIGN UP</button>
                </div>
            </form>
        </div>
        <div class="h-spacer"></div>
    </div>
    
</template>

<script>
import { eventBus } from '../main';
import { required } from 'vuelidate/lib/validators';

import AccountsApiMixin from '../shared/api-mixins/AccountsApiMixin.vue'
import { PlayableCharacter, PlayerStats } from '../shared/PlayableCharacter';
import { Skill, SkillNatureType } from '../shared/Skill';

export default {
    mixins: [
        AccountsApiMixin
    ],
    data() {
        return {
            loginData: {
                username: '', 
                password: ''
            }, 
            accountId: '' 
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
        signin: function() {
            eventBus.$emit('SHOW_LOADING_SPINNER', { showSpinner: true });
            this.login(this.loginData)
                .then(res => {
                    ({ accountId: this.accountId } = res.body);
                    this.buildPlayerCharacter();
                }, error => {
                    alert(`Invalid username and/or password.`);
                    eventBus.$emit('SHOW_LOADING_SPINNER', { showSpinner: false });
                })
        },
        signup: function() {
            this.$router.push('/register')
        }, 
        buildPlayerCharacter: function() {
            this.getCharacter(this.accountId)
                .then(res => {
                    const { stats, skills, name, classType } = res.body;
                    const advancedSkills = this.mapSkills(skills);
                    const characterProfile = new PlayableCharacter( name, classType, stats.health, stats.mana , advancedSkills );
                    
                    localStorage.setItem('monster-slayer-app', JSON.stringify( characterProfile ));
                    eventBus.$emit('SHOW_LOADING_SPINNER', { showSpinner: false });
                    this.$router.push('/game');
                }, error => {
                    alert(`OOps! Error encountered while retrieving your character profile.`);
                    eventBus.$emit('SHOW_LOADING_SPINNER', { showSpinner: false });
                });
        }, 
        mapSkills: function(skillSet) {
            return skillSet.map(skill => { 
                return new Skill(
                    skill.name, 
                    skill.name,
                    1, 
                    skill.target === 'enemy' ? SkillNatureType.OFFENSE : SkillNatureType.NEUTRAL,
                    skill.target === 'enemy' ? Math.abs(skill.damage) : 0, 
                    0, 
                    skill.target !== 'enemy' ? Math.abs(skill.damage) : 0, 
                    0 - Math.abs(skill.cost),
                    skill.target !== 'enemy' && skill.damage < 0 ? PlayerStats.HP : null
                )
            });
        }
    }
}
</script>

<style scoped>

    .container {
        display: flex;
        flex-flow: row nowrap;
    }
    
    .h-spacer {
        flex-grow: 1;
    }

    .login-form {
        flex-grow: 1;
        flex-basis: 45%;
    }

</style>