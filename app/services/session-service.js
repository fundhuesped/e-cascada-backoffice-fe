(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function SessionService(Token, User, $state,localStorageService){
        var srv = this;
        srv.login = login;
        srv.logout = logout;
        srv.currentUser = null;
        srv.currentToken = null;
        srv.changePassword = changePassword;
        activate();

        function activate(){
            if(localStorageService.get('currentUser')){
                srv.currentUser = localStorageService.get('currentUser');
                srv.currentToken = localStorageService.get('currentToken');
            }
        }

        function changePassword(oldPassword, newPassword, repeatNewPassword, callOK, callNOK){
            User.changePassword({ 
                                    old_password: oldPassword,
                                    new_password1: newPassword, 
                                    new_password2: repeatNewPassword
                                },function(){
                callOK();
            },function(error){
                callNOK(error);
            });
        }

        function login(username, password, rememberMe, callOK, callNOK){
            Token.login(username, password).then(function(response){
                srv.currentUser = response.data;
                var headers = response.headers();
                srv.currentToken = headers['auth-token'];
                if(rememberMe){
                    localStorageService.set('currentUser', srv.currentUser);
                    localStorageService.set('currentToken', srv.currentToken);
                }
                callOK(response.data);   
            },function(error){
                callNOK(error);
            });
        }

        function logout(){
            srv.currentUser = null;
            srv.token = null;
            srv.currentUser = localStorageService.remove('currentUser');
            $state.transitionTo('login');
        }
    }
    angular.module('turnos.services').service('SessionService', ['Token', 'User', '$state', 'localStorageService', SessionService ]);
})();