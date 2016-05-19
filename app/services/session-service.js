(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function SessionService(Token, $state, localStorageService){
        var srv = this;
        srv.login = login;
        srv.logout = logout;
        srv.currentUser = null;
        srv.token = null;

        activate();

        function activate(){
            if(localStorageService.get('currentUser')){
                srv.currentUser = localStorageService.get('currentUser');
            }
        }

        function login(username, password, rememberMe, callOK, callNOK){
            Token.login(username, password).then(function(response){
                srv.currentUser = response.data;
                if(rememberMe){
                    localStorageService.set('currentUser', srv.currentUser);
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