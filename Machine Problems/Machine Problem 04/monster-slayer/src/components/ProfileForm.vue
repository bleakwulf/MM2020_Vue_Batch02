<template>
    <div class="container">
        <div class="h-spacer"></div>
        <div class="profile-form">
            <form>
                <div class="form-group">
                    <input type="text" 
                        name="fullName"
                        placeholder="Full Name" 
                        v-model.lazy.trim="accountData.fullName"
                        @blur="$v.accountData.fullName.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.accountData.fullName.$error 
                        }">
                    <div class="error" v-if="$v.accountData.fullName.$dirty && !$v.accountData.fullName.required">Full Name is required.</div>
                </div>
                <div class="form-group">
                    <input type="email" 
                        name="email"
                        placeholder="Email" 
                        v-model.lazy.trim="accountData.email"
                        @blur="$v.accountData.email.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.accountData.email.$error 
                        }">
                    <div class="error" v-if="$v.accountData.email.$dirty && !$v.accountData.email.required">Email is required.</div>
                    <div class="error" v-if="$v.accountData.email.$dirty && !$v.accountData.email.email">Email is not a valid email.</div>
                </div>
                <div class="form-group">
                    <input type="text" 
                        name="username" 
                        placeholder="Username"
                        v-model.lazy.trim="accountData.username"
                        @blur="$v.accountData.username.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.accountData.username.$error 
                        }">
                    <div class="error" v-if="$v.accountData.username.$dirty && !$v.accountData.username.required">Username is required.</div>
                    <div class="error" v-if="$v.accountData.username.$dirty && !$v.accountData.username.minLength">Username must be at least 6 characters long.</div>
                </div>
                <div class="form-group">
                    <input type="password" 
                        name="password" 
                        placeholder="Password"
                        v-model.lazy.trim="accountData.password"
                        @blur="$v.accountData.password.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.accountData.password.$errors 
                        }">
                    <div class="error" v-if="$v.accountData.password.$dirty && !$v.accountData.password.required">Password is required.</div>
                    <div class="error" v-if="$v.accountData.password.$dirty && !$v.accountData.password.minLength">Password must be at least 6 characters long.</div>
                </div>
                <div class="form-group">
                    <input type="text" 
                        name="characterName" 
                        placeholder="Character Name"
                        v-model.lazy.trim="accountData.characterName"
                        @blur="$v.accountData.characterName.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.accountData.characterName.$error 
                        }">
                    <div class="error" v-if="$v.accountData.characterName.$dirty && !$v.accountData.characterName.required">Character Name is required.</div>
                    <div class="error" v-if="$v.accountData.characterName.$dirty && !$v.accountData.characterName.minLength">Character Name must be at least {{$v.accountData.characterName.$params.minLength.min}} characters long.</div>
                    <div class="error" v-if="$v.accountData.characterName.$dirty && !$v.accountData.characterName.maxLength">Character Name must be no longer than {{$v.accountData.characterName.$params.maxLength.max}} characters long.</div>
                </div>
                <div class="form-group">
                    <select v-model="accountData.classType" 
                        @blur="$v.accountData.classType.$touch()"
                        aria-placeholder="Character Class"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.accountData.classType.$error 
                        }">
                        <option value="null" disabled hidden>Select Character Class</option>
                        <option v-for="charaClass in characterClasses" :key="charaClass.id">
                            {{ charaClass.name }}
                        </option>
                    </select>
                    <div class="error" v-if="$v.accountData.classType.$dirty && !$v.accountData.classType.required">Character Class is required.</div>
                </div>
                <div class="text-center mt-4">
                    <button type="submit"
                        class="btn btn-info"
                        :disabled="$v.$invalid"
                         @click.prevent="save()">REGISTER</button>

                    <p class="p-3">
                        Already have an account? <router-link to="/">Login here.</router-link>
                    </p>
                </div>
            </form>
        </div>
        <div class="h-spacer"></div>
    </div>
</template>

<script>
import { eventBus } from '../main';
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';

import * as HELPERS from '../shared/Helpers.js'
import { CharacterClass } from '../shared/PlayableCharacter.js';

import AccountsApiMixin from '../shared/api-mixins/AccountsApiMixin.vue'

export default {
    mixins: [
        AccountsApiMixin
    ],
    data() {
        return {
            accountData: {
                fullName: '', 
                email: '', 
                username: '', 
                password: '', 
                characterName: '', 
                classType: null
            }, 
            eCharacterClass: CharacterClass
        }
    }, 
    validations: {
        accountData: {
            fullName: {
                required
            }, 
            email: {
                required,
                email
            }, 
            username: {
                required, 
                minLength: minLength(6)
            }, 
            password: {
                required, 
                minLength: minLength(6)
            }, 
            characterName: {
                required, 
                minLength: minLength(6),
                maxLength: maxLength(20)
            }, 
            classType: {
                required
            }
        }
    }, 
    computed: {
        characterClasses: function() {
            const characterClasses = Object.keys(CharacterClass);
            
            return Object.keys(CharacterClass)
                .filter(x => !(parseInt(x) >= 0))
                .map( (charaClass, i) => {
                    return { 
                        id: this.eCharacterClass[charaClass], 
                        name: HELPERS.toProperCase( charaClass  )
                    }
                });
        }
    }, 
    methods: {
        save: function() {
            const payload = { ...this.accountData, 
                classType: this.eCharacterClass[this.accountData.classType.toUpperCase()]
            };

            this.register(payload)
                .then(res => {
                    alert(`Congratulations!\nYou have been successfully registered.`);
                    this.$router.push('/')
                }, error => {
                    alert(`Oops! Error encountered while attempting to register.`);
                });

            eventBus.$emit('START_GAME', true);
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
    
    .profile-form {
        flex-grow: 1;
        flex-basis: 45%;
    }
</style>