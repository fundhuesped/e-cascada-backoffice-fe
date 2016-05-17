(function () {
  'use strict';
  /* jshint validthis: true */
  /*jshint latedef: nofunc */

  angular
    .module('turnos.turnos')
    .controller('NewTurnoCtrl',newTurnoCtrl);
  
  newTurnoCtrl.$inject =  [ '$uibModal', 
                            'uiCalendarConfig', 
                            'toastr', 
                            '$loading', 
                            '$filter', 
                            'Especialidad', 
                            'Prestacion', 
                            'Paciente', 
                            'Document', 
                            'Profesional', 
                            'Turno'];
  function newTurnoCtrl($uibModal, uiCalendarConfig, toastr, $loading, $filter, Especialidad, Prestacion, Paciente, Document, Profesional, Turno) {

    var vm = this;
    vm.canConfirmTurno = canConfirmTurno;
    vm.clearPacienteSelection = clearPacienteSelection;
    vm.confirmTurno = confirmTurno;
    vm.especialidades = null;
    vm.eventSources = [];
    vm.limpiarBusquedaTurno = limpiarBusquedaTurno;
    vm.lookForPacientes = lookForPacientes;
    vm.lookForTurnos = lookForTurnos;
    vm.newTurno = {};
    vm.openPacienteModal = openPacienteModal;
    vm.paciente = null;
    vm.prestaciones = [];
    vm.prestacionChanged = prestacionChanged;
    vm.profesionalChanged = profesionalChanged;
    vm.renderCalendar = renderCalendar;
    vm.reRedender = reRedender;
    vm.reserveTurno = reserveTurno;
    vm.especialidadChanged = especialidadChanged;
    vm.selectPaciente = selectPaciente;
    vm.selectedPaciente = null;
    var selectedRepresentation;
    vm.shouldLookForPacient = shouldLookForPacient;
    //Calendar
    var turnosSource = [];
    vm.updateSelectionRow = updateSelectionRow;

    activate();

    vm.calendarConfig =
    {
      height: 450,
      editable: false,
      lang: 'es',
      weekends: false,
      defaultView: 'agendaWeek',
      header: {
        left: 'agendaWeek month agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      eventClick: function selectTurnoOnEventClick(date, jsEvent, view) {
        vm.updateSelectionRow(date.id, vm.turnos, date);
      }
    };

    function activate() {
      vm.documents = Document.getActiveList();
      vm.especialidades = Especialidad.getActiveList();
      vm.profesionales = Profesional.getActiveList();
    }

    function canConfirmTurno(){
      if(vm.selectedTurno){
        if(vm.selectedPaciente){
          return true;
        }else{
          if(vm.paciente && vm.paciente.firstName && vm.paciente.fatherSurname && vm.paciente.primaryPhoneNumber) {
            return true;
          }
        }
      }
      return false; 
    }

    function clearPacienteSelection() {
      vm.recomendationList = [];
      vm.selectedPaciente = null;
      delete vm.paciente.selected;
      vm.paciente = null;
    }

    function confirmTurno() {
      $loading.start('app');
      if(vm.selectedPaciente){
        vm.selectedTurno.paciente = vm.selectedPaciente;
          vm.reserveTurno();
      }else{
        var paciente = new Paciente();        
        paciente.firstName = vm.paciente.firstName;
        paciente.fatherSurname = vm.paciente.fatherSurname;
        paciente.primaryPhoneNumber = vm.paciente.primaryPhoneNumber;
        paciente.prospect = true;
        paciente.$save(function(createdPaciente){
          vm.selectedTurno.paciente = createdPaciente;
          vm.reserveTurno();
        },function(error){
          console.log(error);
        }
        );
      }
    }

    function limpiarBusquedaTurno() {
      vm.showTurnos = false;
      vm.selectedPrestacion = null;
      vm.selectedEspecialidad = null;
      vm.prestaciones = [];
      vm.selectedProfesional = null;
      vm.selectedDate = null;
      vm.selectedPaciente = null;
    }

    function lookForPacientes() {
      if (vm.shouldLookForPacient()) {
        $loading.start('recomendations');
        vm.recomendations = Paciente.getActiveList(function(recomendations){
          $loading.finish('recomendations');
          vm.copyPaciente = angular.copy(vm.paciente);
          vm.copyPaciente.birthDate = $filter('date')(vm.copyPaciente.birthDate, "yyyy-MM-dd");
          vm.recomendationList = $filter('filter')(recomendations, vm.copyPaciente);
          }.bind(vm), function(){
            $loading.finish('recomendations');
            console.log('Failed get activePacientes');
          }
        );
        }
    }

    function lookForTurnos() {
      $loading.start('app');
      vm.showTurnos = true;
      vm.turnos = [];
      var turnoDate;
      if (vm.selectedDate) {
        turnoDate = $filter('date')(vm.selectedDate, 'yyyy-MM-dd');
      }
      var turnoProf;
      if (vm.selectedProfesional) {
        turnoProf = vm.selectedProfesional.id;
      }
      Turno.query({prestacion: vm.selectedPrestacion.id, profesional: turnoProf, day: turnoDate, taken: false}).$promise.then(function (results) {
        turnosSource =[];
        angular.forEach(results, function (turno) {
          vm.turnos.push(turno);
          var startTime = new Date(turno.day + 'T' + turno.start);
          var endTime = new Date(turno.day + 'T' + turno.end);
          console.log(startTime);
          var event = {
            id: turno.id,
            title: turno.profesional.fatherSurname,
            start: startTime,
            end: endTime,
            allDay: false,
            color: '#D8C358',
            timezone:'America/Argentina/Buenos_Aires'
          };
          turnosSource.push(event);
          turno.calendarRepresentation = event;
        });
        vm.eventSources.push(turnosSource);
        console.log(vm.eventSources);
        vm.renderCalendar();
        $loading.finish('app');
        });
      }

    //Open the detailed pacient info modal
    function openPacienteModal(selectedPaciente) {
      var modalInstance = $uibModal.open({
        templateUrl: '/views/pacientes/paciente.html',
        size: 'lg',
        controller: 'PacienteCtrl',
        controllerAs: 'PacienteCtrl',
        resolve: {
          paciente: function () {
            return selectedPaciente;
          }
        }
      });

      //Only way I found to inject Controller to refresh list after modal closing
      var ctrl = vm;
      modalInstance.result.then(function () {
        ctrl.lookForPacientes();
      });
    }

    function renderCalendar() {
      //Workarround to wait for the tab to appear
      setTimeout(function () {
        if (uiCalendarConfig.calendars.newTurnosCalendar) {
          uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar('render');
        }
      }, 1);
    }
    
    function reRedender() {
      uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar( 'rerenderEvents' );
    }

    function reserveTurno(){
      vm.selectedTurno.taken = true;
      vm.selectedTurno.$update(function(){
        $loading.finish('app');
        toastr.success('Turno creado con éxito');
        vm.limpiarBusquedaTurno();
        vm.turnos = [];
        vm.newPaciente = null;
        vm.selectedTurno = null;
        vm.clearPacienteSelection();
      }.bind(vm),function(error){
        $loading.finish('app');
        console.log('Error creando turno');
      });
    }    

    function especialidadChanged() {
      if (vm.selectedEspecialidad) {
        if(angular.isObject(vm.selectedProfesional)){
          vm.prestaciones = Prestacion.query({especialidad: vm.selectedEspecialidad.id, profesional:vm.selectedProfesional.id , status: 'Active'});
        }else{
          vm.prestaciones = Prestacion.query({especialidad: vm.selectedEspecialidad.id, status: 'Active'});
          vm.profesionales = Profesional.query({especialidad: vm.selectedEspecialidad.id, status: 'Active'});
        }
      }
    }

    function prestacionChanged() {
      if (vm.selectedPrestacion) {
        if(!angular.isObject(vm.selectedProfesional)){
          vm.profesionales = Profesional.query({prestacion: vm.selectedPrestacion.id, status: 'Active'});
        }
      }
    }

    function profesionalChanged() {
      if (vm.selectedProfesional) {
        if(angular.isObject(vm.selectedEspecialidad)){
          vm.prestaciones = Prestacion.query({especialidad: vm.selectedEspecialidad.id, profesional:vm.selectedProfesional.id , status: 'Active'});
        }else{
          vm.prestaciones = Prestacion.query({profesional: vm.selectedProfesional.id, status: 'Active'});
          vm.especialidades = Especialidad.query({profesional: vm.selectedProfesional.id, status: 'Active'});
        }
      }
    }

    function selectPaciente(paciente) {      
      vm.paciente = paciente;
      vm.selectedPaciente = paciente;
      vm.newTurno.paciente = paciente;
      paciente.selected = true;
    }

    function shouldLookForPacient() {
      var populatedFields = 0;
      if (vm.paciente === null) {
        return false;
      }

      if (vm.paciente.documentType) {
        populatedFields++;
      }

      if (vm.paciente.documentNumber) {
        return true;
      }

      if (vm.paciente.firstName) {
        populatedFields++;
      }

      if (vm.paciente.fatherSurname) {
        populatedFields++;
      }

      if (vm.paciente.birthDate) {
        populatedFields++;
      }

      if (vm.paciente.email) {
        populatedFields++;
      }

      if (populatedFields > 1) {
        return true;
      }

      return false;
    }

    //Update seleccion when selecting turno
    function updateSelectionRow(position, entities, calendarRepresentation) {
      if(calendarRepresentation){
        if(calendarRepresentation.selected){
          selectedRepresentation = null;
        }else{
          if(selectedRepresentation){
            selectedRepresentation.color = '#D8C358';
            selectedRepresentation.selected = false;
          }
          selectedRepresentation = calendarRepresentation;
        }
      }else{
        for (var i = vm.eventSources[0].length - 1; i >= 0; i--) {
          
          if(vm.eventSources[0][i].id == position){
            if(vm.eventSources[0][i].selected){
              vm.eventSources[0][i].color = '#D8C358';
              vm.eventSources[0][i].selected = false;
              selectedRepresentation = null;  
            }else{
              vm.eventSources[0][i].color = '#6CC547';
              vm.eventSources[0][i].selected = true;
              selectedRepresentation = event;            
            }
          }else{
            if(vm.eventSources[0][i].selected){
              vm.eventSources[0][i].selected = false;
              vm.eventSources[0][i].color = '#D8C358';
            }
          }
        }
          

      }
      angular.forEach(entities, function (turno, index) {

        if (position != turno.id) {
          if(turno.selected){
            turno.selected = false;
            //turno.calendarRepresentation.color = '#D8C358';
            //uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar('removeEvents', turno.calendarRepresentation.id);
            //uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar('renderEvent', turno.calendarRepresentation,true);
          }
        } else {
          turno.selected = !turno.selected;
          if (calendarRepresentation) {
            if (calendarRepresentation.selected) {
              calendarRepresentation.color = '#D8C358';
              calendarRepresentation.selected = false;
              //turno.calendarRepresentation.color = '#D8C358';
              //vm.selectedCalendarRepresentation = null;
            } else {
              calendarRepresentation.color = '#6CC547';
              /*if(vm.selectedCalendarRepresentation){
                vm.selectedCalendarRepresentation.color = '#D8C358';
                vm.selectedCalendarRepresentation.selected = false;
                vm.selectedCalendarRepresentation = calendarRepresentation;                
              }*/
              calendarRepresentation.selected = true;
              //turno.calendarRepresentation.color = '#dff0d8';
            }
            //uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar('removeEvents', turno.calendarRepresentation._id);
            //uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar('renderEvent', turno.calendarRepresentation,true);
          }

          if (vm.selectedTurno == turno) {
            vm.selectedTurno = null;
          } else {
            vm.selectedTurno = turno;
            vm.newTurno.prestacion = turno.prestacion;
            vm.newTurno.profesional = turno.profesional;
            vm.newTurno.day = turno.day;
            vm.newTurno.start = turno.start;
            vm.newTurno.end = turno.end;
          }
        }
      }.bind(vm));
      uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar( 'rerenderEvents' );
    }
  }
})();
