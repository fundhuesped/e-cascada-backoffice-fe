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
    vm.recomendationsPanel = {};
    vm.renderCalendar = renderCalendar;
    vm.reRedender = reRedender;
    vm.reserveTurno = reserveTurno;
    vm.especialidadChanged = especialidadChanged;
    vm.selectPaciente = selectPaciente;
    vm.selectedPaciente = null;
    vm.shouldLookForPacient = shouldLookForPacient;
    vm.pageSize = 20;
    vm.totalItems = null;
    vm.currentPage = 1;
    vm.updateSelectionRow = updateSelectionRow;
    vm.calendarPopup = {
      opened: false,
      altInputFormats: ['d!/M!/yyyy','dd-MM-yyyy']
    };


    vm.openCalendar = openCalendar;

    //Calendar
    var turnosSource = [];
    var selectedRepresentation;

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
      vm.recomendationsPanel.message = 'Por favor comience a completar el formulario para buscar pacientes';
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

    function openCalendar() {
      vm.calendarPopup.opened = true;
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
        vm.recomendationsPanel.message = null;

        var searchObject = {};
        if(vm.paciente.documentType){
          searchObject.documentType = vm.paciente.documentType.id;
        }
        if(vm.paciente.documentNumber){
          searchObject.documentNumber = vm.paciente.documentNumber;
        }
        if(vm.paciente.firstName){
          searchObject.firstName = vm.paciente.firstName;
        }
        if(vm.paciente.fatherSurname){
          searchObject.fatherSurname = vm.paciente.fatherSurname;
        }

        Paciente.getActiveList(searchObject,
           function(recomendations){
          $loading.finish('recomendations');
          if(recomendations.length === 0){
            vm.recomendationsPanel.message = 'No se encontraron pacientes con los criterios de busqueda';
            return;
          }
          vm.copyPaciente = angular.copy(vm.paciente);
          vm.copyPaciente.birthDate = $filter('date')(vm.copyPaciente.birthDate, "yyyy-MM-dd");
          vm.recomendationList = $filter('filter')(recomendations, vm.copyPaciente);
          }.bind(vm), function(){
            $loading.finish('recomendations');
            console.log('Failed to get activePacientes');
          }
        );
        }
    }

    function lookForTurnos() {
      $loading.start('app');
      vm.showTurnos = true;
      vm.turnos = [];

      var searchObject = {
        taken: false,
        prestacion: vm.selectedPrestacion.id,
        order_by:'asc',
        order_field:'day',
        page:vm.currentPage,
        page_size:vm.pageSize
      };

      if (vm.selectedDate) {
        searchObject.day__gte = $filter('date')(vm.selectedDate, 'yyyy-MM-dd');
      }
      if (vm.selectedProfesional) {
        searchObject.profesional = vm.selectedProfesional.id;
      }

      Turno.getPaginatedActiveList(searchObject).$promise.then(function (paginatedResult) {
        turnosSource =[];
        vm.totalItems = paginatedResult.count;
        angular.forEach(paginatedResult.results, function (turno) {
          vm.turnos.push(turno);
          var startTime = new Date(turno.day + 'T' + turno.start);
          var endTime = new Date(turno.day + 'T' + turno.end);
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
      var turno = new Turno();
      turno.taken = true;
      turno.id = vm.selectedTurno.id;
      turno.paciente = vm.selectedTurno.paciente;
      turno.day = vm.selectedTurno.day;
      turno.prestacion = vm.selectedTurno.prestacion;
      turno.profesional = vm.selectedTurno.profesional;

      turno.$update(function(){
        $loading.finish('app');
        toastr.success('Turno creado con éxito');
        vm.limpiarBusquedaTurno();
        vm.turnos = [];
        vm.newPaciente = null;
        vm.selectedTurno = null;
        vm.clearPacienteSelection();
      },function(error){
        $loading.finish('app');
        console.log('Error creando turno');
      });
    }    

    function especialidadChanged() {
      if (vm.selectedEspecialidad) {
        if(angular.isObject(vm.selectedProfesional)){
          vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id, profesional:vm.selectedProfesional.id});
        }else{
          vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id});
          vm.profesionales = Profesional.getActiveList({especialidad: vm.selectedEspecialidad.id});
        }
      }
    }

    function prestacionChanged() {
      if (vm.selectedPrestacion) {
        if(!angular.isObject(vm.selectedProfesional)){
          vm.profesionales = Profesional.getActiveList({prestacion: vm.selectedPrestacion.id});
        }
      }
    }

    function profesionalChanged() {
      if (vm.selectedProfesional) {
        if(angular.isObject(vm.selectedEspecialidad)){
          vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id, profesional:vm.selectedProfesional.id});
        }else{
          vm.prestaciones = Prestacion.getActiveList({profesional: vm.selectedProfesional.id});
          vm.especialidades = Especialidad.getActiveList({profesional: vm.selectedProfesional.id});
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
      });
      uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar( 'rerenderEvents' );
    }
  }
})();
