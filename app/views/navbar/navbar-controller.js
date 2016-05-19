(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    
    function navbarCtrl (SessionService) {
    	var vm = this;
    	vm.logout = SessionService.logout;
    	vm.userFirstname = (SessionService.currentUser?SessionService.currentUser.first_name:'');
    	vm.userLastName = (SessionService.currentUser?SessionService.currentUser.last_name:'');

		activate();

		function activate(){
			if(!SessionService.currentUser){
				vm.logout();
			}
		}



    }
    angular.module('turnos.navbar').controller('NavbarCtrl',['SessionService', navbarCtrl]);
})();