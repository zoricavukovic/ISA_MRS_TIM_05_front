import { useState } from "react";
import api from "./baseApi";

export function login(form){
    return api.post('/auth/login',form).then((res)=>{
        console.log('Login success');
        localStorage.setItem("jwt", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
    });
}

export function logout(){
    localStorage.clear();
}

export function getCurrentUser(){
    let user = localStorage.getItem('user');
    if (user !== null)
        return JSON.parse(user);    
    return null;
}

export function tokenIsPresent() {
    let accessToken = getToken();
    return accessToken !== null;
}

export function getToken() {
    return localStorage.getItem('jwt');
}

export function setPasswordChangedForUser() {
    let user = getCurrentUser();
    if (user.userType.name === "ROLE_ADMIN") {
        user.passwordChanged = true;
        localStorage.setItem("user", JSON.stringify(user));
    }
}