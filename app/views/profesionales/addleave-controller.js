(function () {
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('turnos.profesionales')
        .controller('AddLeaveCtrl',addLeaveController);
        
    addLeaveController.$inject = ['$loading',
                                  '$uibModalInstance',
                                  '$filter',
                                  'profesional',
                                  'Leave'];

    function addLeaveController($loading, $uibModalInstance, $filter, profesional, Leave) {
        var vm = this;
        vm.cancel = cancel;
        vm.confirm = confirm;
        vm.errorMessage = null;
        vm.hideErrorMessage = hideErrorMessage;
        vm.leaveForm;
        vm.newLeave = {};
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
                    var leave = new Leave();
                    leave.start_day = $filter('date')(vm.newLeave.fromDate, 'yyyy-MM-dd');
                    leave.end_day = $filter('date')(vm.newLeave.toDate, 'yyyy-MM-dd');
                    leave.profesional = vm.profesional;
                    leave.notes = vm.newLeave.notes;
                    leave.reason = vm.newLeave.reason;
                    leave.$save(function(){
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