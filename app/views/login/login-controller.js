(function(){
    'use strict';
    
    function loginCtrl ($state) {
    	this.login = function login(LoginForm){
    		if(this.username=='nlgonzalez' && this.password=='huesped'){
    			$state.transitionTo('home');
    		}else{
				LoginForm.$setValidity('username', false);
				LoginForm.$setValidity('password', false);
    		}
    	}
    }
    angular.module('turnos.login').controller('LoginCtrl',['$state',loginCtrl]);
})();