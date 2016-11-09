(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    
    function changePasswordCtrl ($state, SessionService, $loading, toastr) {
        var vm = this;
        vm.errorMessage = null;
        vm.changePassword = changePassword;
        vm.hideErrorMessage = hideErrorMessage;
        vm.changePasswordForm;

        function changePassword(){
            
            $loading.start('app');
            hideErrorMessage();

            if(vm.changePasswordForm.$valid){
                SessionService.changePassword(vm.oldPassword, vm.newPassword, vm.repeatNewPassword, function(){
                    $loading.finish('app');
                    SessionService.logout();
                }, function(errorResponse){
                    $loading.finish('app');
                    if(errorResponse.status === 400){
                        vm.errorMessage = 'Revise los datos ingresados';
                    }else{
                        displayComunicationError('app');
                    }
                });
            }
    	}

        function hideErrorMessage() {
            vm.errorMessage = null;
        }

        function displayComunicationError(loading){
          if(!toastr.active()){
            toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
          }
          if(loading){
            $loading.finish(loading);
          }
        }
    }
    angular.module('turnos.profile').controller('ChangePasswordCtrl',['$state', 'SessionService', '$loading', 'toastr', changePasswordCtrl]);
})();