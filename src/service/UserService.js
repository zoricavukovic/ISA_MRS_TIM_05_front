import { getCurrentUser } from "./AuthService";
import api from "./baseApi";


export function getAllUsers() {
    return api.get('/users');
}

export function getUserById(id) {
    return api.get('/users/' + id);
}

export function editUserById(id, editedUser) {
    return api.put('/users/updateUser/' + id, editedUser);
}

export function createUser(newUser) {
    return api.post('/users/createUser', newUser);
}

export function sendLogInForm(form){
    return api.post('/users/login',form);
}

export function setNewPassword(changePassword) {
    return api.post('/users/changePassword', changePassword)
}


export function userLoggedIn(history) {
    if (getCurrentUser() === null || getCurrentUser() === undefined) {
        history.push('/login');
        return false;
    }
    return true;
}

export function checkIfEmailAlreadyExist(email) {
    return api.get('/users/checkIfEmailAlreadyExist/' + email);
}

export function activateAccount(email) {
    return api.get('/users/activateAccount/'+ email);
}

export function subscribeClientWithEntity(clientId, entityId) {
    return api.post('/users/subscribe/'+clientId+"/"+entityId);
}

export function unsubscribeClientWithEntity(clientId, entityId) {
    return api.post('/users/unsubscribe/'+clientId+"/"+entityId);
}

function userLoggedInWithRole(history, role) {
    if (userLoggedIn(history)) {
        if (getCurrentUser().userType.name !== role) {
            history.push('/forbiddenPage');
            return false;
        }
    }
    return true;
}

export function userLoggedInAsInstructor(history) {
    return userLoggedInWithRole(history, "ROLE_INSTRUCTOR");
}
export function userLoggedInAsCottageOwner(history) {
    return userLoggedInWithRole(history, "ROLE_COTTAGE_OWNER");
}
export function userLoggedInAsShipOwner(history) {
    return userLoggedInWithRole(history, "ROLE_SHIP_OWNER");
}
export function userLoggedInAsOwner(history) {
    if (!userLoggedIn(history))
        return false;
    if (getCurrentUser().userType.name === "ROLE_INSTRUCTOR" || getCurrentUser().userType.name === "ROLE_COTTAGE_OWNER" || getCurrentUser().userType.name === "ROLE_SHIP_OWNER" )
        return true;
    return false;
}

export function userLoggedInAsSuperAdminOrAdminWithResetedPassword(history) {
    if (!userLoggedIn(history))
        return false;
    if (getCurrentUser().userType.name === "ROLE_SUPER_ADMIN")
        return true;
    if (!userLoggedInWithRole(history, "ROLE_ADMIN"))
        return false;
    if (getCurrentUser().passwordChanged === true) {
        return true;
    }
    history.push('/changePassword');
    return false;
}

export function userLoggedInAsClient(history) {
    return userLoggedInWithRole(history, "ROLE_CLIENT");
}
export function userLoggedInAsSuperAdmin(history) {
    return userLoggedInWithRole(history, "ROLE_SUPER_ADMIN");
}

export function getAllNewAccountRequests() {
    return api.get('/users/getAllNewAccountRequests');
}

export function giveResponseForNewAccountRequest(response) {
    return api.put('/users/giveResponseForNewAccountRequest', response);
}


export function logicalDeleteUserById(userId, adminId, confirmPass) {
    return api.delete('/users/' + userId + '/' + adminId, {data : confirmPass});
}