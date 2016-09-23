(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('turnos.turnos')
        .controller('TurnoSlotDetailCtrl',turnoDetailCtrl);
  
    turnoDetailCtrl.$inject =  [ '$uibModalInstance', 
                                '$loading', 
                                'toastr',
                                'moment', 
                                'turnoSlot',
                                'Turno',
                                'TurnoSlot'];

    function turnoDetailCtrl ($uibModalInstance, 
                              $loading,
                              toastr,
                              moment,
                              turnoSlot,
                              Turno,
                              TurnoSlot){
        var vm = this;
        vm.cancelTurn = cancelTurn;
        vm.title = '';
        vm.turnoSlot = angular.copy(turnoSlot);
        vm.turno = {};
        vm.dismiss = dismiss;
        vm.markedTurnAsPresent = markedTurnAsPresent;
        vm.modalStyle = {};
        vm.showDelete = showDelete;
        vm.showMarkAsPresent = showMarkAsPresent;
        vm.panelStyle = panelStyle;

        vm.cancelModal = {
            style : {},
            show : function show(){
                this.style = {display:'block'};
            },
            dismiss : function dismiss(){
                this.style = {};
            },
            confirm : function confirm(){
                this.dismiss();
                vm.cancelTurn();
            }
        };

        vm.presentModal = {
            style : {},
            show : function show(){
                this.style = {display:'block'};
            },
            dismiss : function dismiss(){
                this.style = {};
            },
            confirm : function confirm(){
                this.dismiss();
                vm.markedTurnAsPresent();
            }
        };

        activate();

        function activate(){
            if(vm.turnoSlot.state === TurnoSlot.state.ocuppied){
                vm.turno = new Turno(turnoSlot.currentTurno);
                if(vm.turno.state === Turno.state.initial){
                    vm.title = 'Turno reservado';
                }else if(vm.turno.state === Turno.state.present){
                    vm.title = 'Turno reservado - Paciente presente';
                }
            }else{
                vm.title = 'Turno disponible';
            }
        }

        function dismiss (){
            $uibModalInstance.dismiss('dismiss');
        }

        function cancelTurn(){
            $loading.start('app');
            vm.turno.state = Turno.state.canceled;
            vm.turno.$update(function(){
                $loading.finish('app');
                toastr.success('Turno cancelado con éxito');
                $uibModalInstance.close('deleted');
            },
            function(errorResponse){
                if(errorResponse.status == 400 && errorResponse.data.error){
                    $loading.finish('app');
                    toastr.warning(errorResponse.data.error);
                }else{
                    vm.turnoSlot = angular.copy(turno);
                    displayComunicationError('app');
                }
            });
        }

        function markedTurnAsPresent(){
            $loading.start('app');
            vm.turno.state = Turno.state.present;
            vm.turno.$update(function(){
                $loading.finish('app');
                toastr.success('Turno marcado como presente con éxito');
                $uibModalInstance.close('markedAsPresent');
            },
            function(errorResponse){
                if(errorResponse.status == 400 && errorResponse.data.error){
                    $loading.finish('app');
                    toastr.warning(errorResponse.data.error);
                }else{
                    displayComunicationError('app');
                }
            });
        }

        function showMarkAsPresent(){
            return vm.turno && vm.turno.state === Turno.state.initial;
        }

        function showDelete(){
            if(vm.turnoSlot.state === TurnoSlot.state.ocuppied && vm.turno.state === Turno.state.initial){
                return moment(vm.turnoSlot.day + ' ' + vm.turnoSlot.start).isSameOrAfter(moment(), 'minute');
            }
        }

        function panelStyle(){
            if(vm.turnoSlot.state === TurnoSlot.state.ocuppied && vm.turno.state === Turno.state.present){
                return 'panel-success';
            }
            return 'panel-default';
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
})();