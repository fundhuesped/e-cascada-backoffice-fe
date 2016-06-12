(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function turnoDetailCtrl ($uibModalInstance, turno) {
        var vm = this;

        vm.turno = angular.copy(turno);
        vm.dismiss = dismiss;

        activate();

        function activate(){
        }

        function dismiss (){
            $uibModalInstance.close('dismiss');
        }

    }
    angular.module('turnos.turnos').controller('TurnoDetailCtrl',['$uibModalInstance', 'turno', turnoDetailCtrl]);
})();