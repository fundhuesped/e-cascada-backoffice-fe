(function () {
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('turnos.profesionales')
        .controller('AddLeaveCtrl',addLeaveController);
        
    addLeaveController.$inject = ['$loading',
                                  '$uibModalInstance',
                                  'profesional',
                                  'Leave'];

    function addLeaveController($loading, $uibModalInstance, profesional, Leave) {
        var vm = this;
        vm.cancel = cancel;
        vm.confirm = confirm;
        vm.errorMessage = null;
        vm.hideErrorMessage = hideErrorMessage;
        vm.leaveForm;
        vm.newLeave = new Leave();
        vm.profesional = angular.copy(profesional);
        vm.showErrorMessage = showErrorMessage;

        activate();

        function activate() {
        }

        function confirm() {
            if(vm.leaveForm.$valid){
                if(vm.newLeave.fromDate && vm.newLeave.toDate && vm.newLeave.fromDate <= vm.newLeave.toDate){
                    vm.hideErrorMessage();
                    $loading.start('app');
                    vm.newLeave.$save(function(){
                        $loading.finish('app');
                        $uibModalInstance.close('modified');
                    },function(){
                        $loading.finish('app');
                        vm.showErrorMessage();
                    });
                }else{
                    vm.errorMessage = 'Por favor revise el formulario';
                }
            }else{
                vm.errorMessage = 'Por favor revise el formulario';
            }
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
        
        function showErrorMessage() {
            vm.errorMessage = 'Ocurio un error en la comunicación';
        }
        
        function hideErrorMessage() {
            vm.errorMessage = null;
        }

    }
})();