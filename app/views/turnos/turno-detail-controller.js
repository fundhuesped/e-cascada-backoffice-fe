(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('turnos.turnos')
        .controller('TurnoDetailCtrl',turnoDetailCtrl);
  
    turnoDetailCtrl.$inject =  [ '$uibModalInstance', 
                                '$loading', 
                                'toastr',
                                'moment', 
                                'turno',
                                'Turno',
                                'TurnoSlot'];

    function turnoDetailCtrl ($uibModalInstance, 
                              $loading,
                              toastr,
                              moment,
                              turno,
                              Turno,
                              TurnoSlot){
        var vm = this;
        vm.cancelTurn = cancelTurn;
        vm.title = '';
        vm.turno = angular.copy(turno);
        vm.turnoSlot = new TurnoSlot(turno.turnoSlot);
        vm.dismiss = dismiss;
        vm.markedAsTurnAsPresent = markedAsTurnAsPresent;
        vm.modalStyle = {};
        vm.showDelete = showDelete;
        vm.showMarkAsPresent = showMarkAsPresent;
        vm.newNotes = '';

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
                vm.newNotes = angular.copy(vm.turno.notes);
                this.style = {display:'block'};
            },
            dismiss : function dismiss(){
                this.style = {};
            },
            confirm : function confirm(){
                this.dismiss();
                vm.markedAsTurnAsPresent();
            }
        };

        activate();

        function activate(){
            if(vm.turno.state === Turno.state.initial){
                vm.title = 'Turno reservado';
            }else if(vm.turno.state === Turno.state.present){
                vm.title = 'Paciente presente';
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
                    vm.turno = angular.copy(turno);
                    displayComunicationError('app');
                }
            });
        }

        function markedAsTurnAsPresent(){
            $loading.start('app');
            vm.turno.state = Turno.state.present;
            vm.turno.notes = vm.newNotes;
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
                    vm.turno = angular.copy(turno);
                    displayComunicationError('app');
                }
            });
        }

        function showMarkAsPresent(){
            return vm.turno.state === Turno.state.initial;
        }

        function showDelete(){
            if(vm.turno.state === Turno.state.initial){
                return moment(vm.turnoSlot.day + ' ' + vm.turnoSlot.start).isSameOrAfter(moment(), 'minute') && vm.turnoSlot.state === TurnoSlot.state.ocuppied;
            }
            return true;
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