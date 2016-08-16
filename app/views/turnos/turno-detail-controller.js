(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function turnoDetailCtrl ($uibModalInstance, turno) {
        var vm = this;
        vm.title = '';
        vm.turno = angular.copy(turno);
        vm.dismiss = dismiss;

        activate();

        function activate(){
            if(turno.taken === true){
                vm.title = 'Turno asignado';
            }else{
                vm.title = 'Turno disponible';
            }
        }

        function dismiss (){
            $uibModalInstance.close('dismiss');
        }

    }
    angular.module('turnos.turnos').controller('TurnoDetailCtrl',['$uibModalInstance', 'turno', turnoDetailCtrl]);
})();