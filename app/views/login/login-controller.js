(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    
    function loginCtrl ($state, SessionService) {
        var vm = this;
        vm.errorMessage = null;
        vm.login = login;
        vm.rememberMe = true;
        vm.hideErrorMessage = hideErrorMessage;

        function login(){
            if(vm.LoginForm.$valid){
                SessionService.login(vm.username, vm.password, vm.rememberMe, function(data){
                    $state.transitionTo('home');
                }, function(){
                    vm.errorMessage = 'Usuario o password incorrecto';

                });
            }
    	}
        function hideErrorMessage() {
            vm.errorMessage = null;
        }
    }
    angular.module('turnos.login').controller('LoginCtrl',['$state', 'SessionService',loginCtrl]);
})();