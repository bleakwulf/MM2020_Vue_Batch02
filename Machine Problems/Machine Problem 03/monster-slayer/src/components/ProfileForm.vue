<template>
    <div class="container">
        <div class="h-spacer"></div>
        <div class="profile-form">
            <form>
                <div class="form-group">
                    <input type="text" 
                        name="fullName"
                        placeholder="Full Name" 
                        v-model.lazy.trim="fullName"
                        @blur="$v.fullName.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.fullName.$error 
                        }">
                    <div class="error" v-if="$v.fullName.$dirty && !$v.fullName.required">Full Name is required.</div>
                </div>
                <div class="form-group">
                    <input type="email" 
                        name="email"
                        placeholder="Email" 
                        v-model.lazy.trim="email"
                        @blur="$v.email.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.email.$error 
                        }">
                    <div class="error" v-if="$v.email.$dirty && !$v.email.required">Email is required.</div>
                    <div class="error" v-if="$v.email.$dirty && !$v.email.email">Email is not a valid email.</div>
                </div>
                <div class="form-group">
                    <input type="text" 
                        name="username" 
                        placeholder="Username"
                        v-model.lazy.trim="username"
                        @blur="$v.username.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.username.$error 
                        }">
                    <div class="error" v-if="$v.username.$dirty && !$v.username.required">Username is required.</div>
                    <div class="error" v-if="$v.username.$dirty && !$v.username.minLength">Username must be at least 6 characters long.</div>
                </div>
                <div class="form-group">
                    <input type="password" 
                        name="password" 
                        placeholder="Password"
                        v-model.lazy.trim="password"
                        @blur="$v.password.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.password.$errors 
                        }">
                    <div class="error" v-if="$v.password.$dirty && !$v.password.required">Password is required.</div>
                    <div class="error" v-if="$v.password.$dirty && !$v.password.minLength">Password must be at least 6 characters long.</div>
                </div>
                <div class="form-group">
                    <input type="text" 
                        name="characterName" 
                        placeholder="Character Name"
                        v-model.lazy.trim="characterName"
                        @blur="$v.characterName.$touch()"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.characterName.$error 
                        }">
                    <div class="error" v-if="$v.characterName.$dirty && !$v.characterName.required">Character Name is required.</div>
                    <div class="error" v-if="$v.characterName.$dirty && !$v.characterName.minLength">Character Name must be at least {{$v.characterName.$params.minLength.min}} characters long.</div>
                    <div class="error" v-if="$v.characterName.$dirty && !$v.characterName.maxLength">Character Name must be no longer than {{$v.characterName.$params.maxLength.max}} characters long.</div>
                </div>
                <div class="form-group">
                    <select v-model="characterClass" 
                        @blur="$v.characterClass.$touch()"
                        aria-placeholder="Character Class"
                        :class="{ 
                            'form-control': true,
                            'is-invalid': $v.characterClass.$error 
                        }">
                        <option v-for="charaClass in characterClasses" :key="charaClass.id">
                            {{ charaClass.name }}
                        </option>
                    </select>
                    <div class="error" v-if="$v.characterClass.$dirty && !$v.characterClass.required">Character Class is required.</div>
                </div>
                <div class="text-center mt-4">
                    <button type="submit"
                        class="btn btn-info"
                        :disabled="$v.$invalid"
                         @click.prevent="save()">START</button>
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

export default {
    data() {
        return {
            fullName: '', 
            email: '', 
            username: '', 
            password: '', 
            characterName: '', 
            characterClass: '', 
            eCharacterClass: CharacterClass
        }
    }, 
    validations: {
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
        characterClass: {
            required
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
            localStorage.setItem('monster-slayer-app', 
                JSON.stringify({
                    fullName: this.fullName, 
                    email: this.email, 
                    username: this.username, 
                    password: this.password, 
                    characterName: this.characterName, 
                    characterClass: this.eCharacterClass[this.characterClass.toUpperCase()],
                })
            );
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

    .error {    
        width: 100%;
        margin: 0.25rem;
        font-size: 65%;
        color: #dc3545;
        text-align: left    
    }
</style>