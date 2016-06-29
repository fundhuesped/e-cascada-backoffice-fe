(function () {
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('turnos.turnos')
        .controller('TurnosCanceladosCtrl',addTurnosCanceladosController);

    addTurnosCanceladosController.$inject = ['$loading',
                                  '$uibModalInstance',
                                  '$window',
                                  'Turno',
                                  'ausencia'];

    function addTurnosCanceladosController($loading, $uibModalInstance, $window, Turno, ausencia) {
      var vm = this;
      vm.ausencia = ausencia;
      vm.turnosCancelados = [];

      $loading.start('app');
      Turno.getCancelados({ausencia: ausencia.id, page_size:100, ordering:'day,start'}, function(turnosCancelados) {
        vm.turnosCancelados = turnosCancelados;
        $loading.finish('app');
      });

      vm.print = function() {
        $window.print();
      }

      vm.dismiss = dismiss;

      function dismiss (){
          $uibModalInstance.close('dismiss');
      }
    }
  })();
