(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function SessionService(Token, $state, localStorageService){
        var srv = this;
        srv.login = login;
        srv.logout = logout;
        srv.currentUser = null;
        srv.currentToken = null;

        activate();

        function activate(){
            if(localStorageService.get('currentUser')){
                srv.currentUser = localStorageService.get('currentUser');
                srv.currentToken = localStorageService.get('currentToken');
            }
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
    angular.module('turnos.services').service('SessionService', [ 'Token','$state', 'localStorageService', SessionService ]);
})();