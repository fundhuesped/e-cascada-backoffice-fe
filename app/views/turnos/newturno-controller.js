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
                            'Turno',
                            'SocialService'];

  function newTurnoCtrl($uibModal, uiCalendarConfig, toastr, $loading, $filter, Especialidad, Prestacion, Paciente, Document, Profesional, Turno, SocialService) {
    var vm = this;
    vm.canConfirmTurno = canConfirmTurno;
    vm.canLookForTurnos = canLookForTurnos;
    vm.clearPacienteSelection = clearPacienteSelection;
    vm.cleanForm = cleanForm;
    vm.confirmTurno = confirmTurno;
    vm.currentTab = 0;
    vm.documents = [];
    vm.especialidades = null;
    vm.eventSources = [];
    vm.cleanTurnosSearch = cleanTurnosSearch;
    vm.lookForPacientes = lookForPacientes;
    vm.lookForTurnos = lookForTurnos;
    var lookedForTurnos = false;
    vm.newTurno = {};
    vm.openTurnoModal = openTurnoModal;
    vm.openPacienteModal = openPacienteModal;
    vm.paciente = null;
    vm.pageChanged = pageChanged;
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
    vm.socialServices = [];
    vm.pageSize = 20;
    vm.totalItems = null;
    vm.currentPage = 1;
    vm.updateSelectionRow = updateSelectionRow;
    vm.tabChanged = tabChanged;
    vm.calendarPopup = {
      opened: false,
      options: {
        minDate: new Date(),
      }
    };
    vm.birthDateCalendarPopup = {
      opened: false,
      options: {
        maxDate: new Date(),
      }
    };


    vm.openCalendar = openCalendar;
    vm.openBirthDateCalendar = openBirthDateCalendar;

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
        left: 'agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      eventClick: function selectTurnoOnEventClick(date, jsEvent, view) {
        vm.updateSelectionRow(date.id, vm.turnos, date);
      },
      viewRender: function(view, element){
        if(canLookForTurnos() && lookedForTurnos){
          vm.lookForTurnos();
        }
      }
    };

    function activate() {
      Document.getActiveList(function(documents){
        vm.documents = documents;
      }, displayComunicationError);
      
      Especialidad.getActiveList(function(especialidades){
        vm.especialidades = especialidades;
      }, displayComunicationError);
      
      Profesional.getActiveList(function(profesionales){
        vm.profesionales = profesionales;
      }, displayComunicationError);

      SocialService.getActiveList(function(socialServices){
        vm.socialServices = socialServices;
      }, displayComunicationError);

      vm.recomendationsPanel.message = 'Por favor comience a completar el formulario para buscar pacientes';
      vm.renderCalendar();
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
      vm.recomendationsPanel.message = 'Por favor comience a completar el formulario para buscar pacientes';
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
        paciente.documentType = vm.paciente.documentType;
        paciente.documentNumber = vm.paciente.documentNumber;
        paciente.socialService = vm.paciente.socialService;
        paciente.socialServiceNumber = vm.paciente.socialServiceNumber;
        paciente.prospect = true;
        paciente.birthDate = (vm.paciente.birthDate?$filter('date')(vm.paciente.birthDate, 'yyyy-MM-dd'):null);
        paciente.email = vm.paciente.email;
        paciente.$save(function(createdPaciente){
          vm.selectedTurno.paciente = createdPaciente;
          vm.reserveTurno();
        },function(){
          displayComunicationError('app');
        }
        );
      }
    }

    function openCalendar() {
      vm.calendarPopup.opened = true;
    }
    function openBirthDateCalendar() {
      vm.birthDateCalendarPopup.opened = true;
    }

    function cleanForm(){
      vm.cleanTurnosSearch();
      vm.newPaciente = null;
      vm.clearPacienteSelection();
    }
    
    function cleanTurnosResult() {
      lookedForTurnos = false;
      vm.totalItems = null;
      vm.selectedTurno = null;
      if(vm.turnos){
        vm.turnos.length = 0;
      }
      if(vm.eventSources){
        vm.eventSources.length = 0;
      }
    }

    function cleanTurnosSearch() {
      vm.selectedPrestacion = null;
      vm.selectedEspecialidad = null;
      vm.prestaciones.length = 0;
      vm.selectedProfesional = null;
      vm.selectedDate = null;
      vm.profesionales = Profesional.getActiveList(angular.noop,displayComunicationError);
      vm.especialidades = Especialidad.getActiveList(angular.noop, displayComunicationError);
      cleanTurnosResult();
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
        if(vm.paciente.birthDate){
          searchObject.birthDate = $filter('date')(vm.paciente.birthDate, 'yyyy-MM-dd');
        }

        Paciente.getActiveList(searchObject,
          function(recomendations){
            $loading.finish('recomendations');
            if(recomendations.length === 0){
              vm.recomendationList = [];
              vm.recomendationsPanel.message = 'No se encontraron pacientes con los criterios de busqueda';
              return;
            }
            vm.recomendationList = recomendations;
          }, function(){
            vm.recomendationsPanel.message = 'Ocurrió un error en la comunicación, por favor intente nuevamente.';
            displayComunicationError('recomendations');
          }
        );
        }
    }

    function canLookForTurnos(){
      return vm.selectedPrestacion && (vm.selectedEspecialidad || vm.selectedProfesional);
    }


    function tabChanged(){
      if(lookedForTurnos){
        lookForTurnos(true);
      }
    }

    function lookForTurnos(tabChanged) {
      $loading.start('app');
      cleanTurnosResult();

      var searchObject = {
        taken: false,
        prestacion: vm.selectedPrestacion.id,
        ordering:'day,start',
      };

      if (vm.selectedDate) {
        searchObject.day__gte = $filter('date')(vm.selectedDate, 'yyyy-MM-dd');
      }else{
        searchObject.day__gte = $filter('date')(new Date(), 'yyyy-MM-dd');
      }
      
      if (vm.selectedProfesional) {
        searchObject.profesional = vm.selectedProfesional.id;
      }

      //For calendar search
      if(vm.currentTab === 0 && !tabChanged){
        getAllTurnosForDates(searchObject);
      }else{
        getTurnosList(searchObject);
      }
    }

    function pageChanged() {
      if(vm.selectedPrestacion){
        $loading.start('app');      
        var searchObject = {
          taken: false,
          prestacion: vm.selectedPrestacion.id,
          ordering:'day,start',
        };

        if (vm.selectedDate) {
          searchObject.day__gte = $filter('date')(vm.selectedDate, 'yyyy-MM-dd');
        }else{
          searchObject.day__gte = $filter('date')(new Date(), 'yyyy-MM-dd');
        }
        
        if (vm.selectedProfesional) {
          searchObject.profesional = vm.selectedProfesional.id;
        }
        getTurnosList(searchObject);
      }
    }


    function getAllTurnosForDates(searchObject){
      var calendarView = uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar( 'getView' );
      searchObject.start = calendarView.start.format('YYYY-MM-DD');
      searchObject.end = calendarView.end.format('YYYY-MM-DD');
  
      Turno.getFullActiveList(searchObject).$promise.then(function (results) {
        lookedForTurnos = true;
        turnosSource =[];
        vm.turnos = results;
        angular.forEach(results, function (turno) {
          var startTime = new Date(turno.day + 'T' + turno.start + '-03:00');
          var endTime = new Date(turno.day + 'T' + turno.end+ '-03:00');

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
      }, function(){
        displayComunicationError('app');
      });
    }

    function getTurnosList(searchObject){
      searchObject.page = vm.currentPage;
      searchObject.page_size = vm.pageSize;

      Turno.getPaginatedActiveList(searchObject).$promise.then(function (paginatedResult) {
        lookedForTurnos = true;
        if(vm.currentPage===1){
          vm.totalItems = paginatedResult.count;
        }
        vm.turnos = paginatedResult.results;

        $loading.finish('app');
      }, function(){
        displayComunicationError('app');
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

    //Open turno info modal
    function openTurnoModal(turno) {
      var modalInstance = $uibModal.open({
        templateUrl: '/views/turnos/turno-detail.html',
        size: 'sm',
        backdrop:'static',
        controller: 'TurnoDetailCtrl',
        controllerAs: 'TurnoDetailCtrl',
        resolve: {
          turno: function () {
            return turno;
          }
        }
      });
      //Only way I found to inject Controller to refresh list after modal closing
      var ctrl = vm;
      modalInstance.result.then(function () {
        ctrl.cleanForm();
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
        vm.openTurnoModal(turno);
      },function(){
        displayComunicationError('app');
      });
    }    

    function especialidadChanged() {
      cleanTurnosResult();
      if (vm.selectedEspecialidad) {
        if(angular.isObject(vm.selectedProfesional)){
          vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id, profesional:vm.selectedProfesional.id}, angular.noop, displayComunicationError);
        }else{
          vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id}, angular.noop, displayComunicationError);
          vm.profesionales = Profesional.getActiveList({especialidad: vm.selectedEspecialidad.id}, angular.noop, displayComunicationError);
        }
      }else{
        vm.profesionales = Profesional.getActiveList(angular.noop,displayComunicationError);
        if(angular.isObject(vm.selectedProfesional)){
          vm.prestaciones = Prestacion.getActiveList({profesional:vm.selectedProfesional.id}, angular.noop, displayComunicationError);
        }else{
          vm.prestaciones = [];
        }

      }
    }

    function prestacionChanged() {
      cleanTurnosResult();
      if (vm.selectedPrestacion) {
        if(!angular.isObject(vm.selectedProfesional)){
          vm.profesionales = Profesional.getActiveList({prestacion: vm.selectedPrestacion.id}, angular.noop, displayComunicationError);
        }
      }
    }

    function profesionalChanged() {
      cleanTurnosResult();
      if (vm.selectedProfesional) {
        if(angular.isObject(vm.selectedEspecialidad)){
          vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id, profesional:vm.selectedProfesional.id}, angular.noop, displayComunicationError);
        }else{
          vm.prestaciones = Prestacion.getActiveList({profesional: vm.selectedProfesional.id}, angular.noop, displayComunicationError);
          vm.especialidades = Especialidad.getActiveList({profesional: vm.selectedProfesional.id}, angular.noop, displayComunicationError);
        }
      }else{
        vm.especialidades = Especialidad.getActiveList(angular.noop, displayComunicationError);
        if(angular.isObject(vm.selectedEspecialidad)){
          vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id}, angular.noop, displayComunicationError);
        }else{
           vm.prestaciones = [];         
        }
      }
    }

    function selectPaciente(paciente) {      
      paciente.birthDate =(paciente.birthDate?new Date(paciente.birthDate + 'T03:00:00'):null);     
      vm.paciente = paciente;
      vm.selectedPaciente = paciente;
      vm.newTurno.paciente = paciente;
      vm.recomendationList = [paciente];
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

      if (vm.paciente.firstName && vm.paciente.firstName.length >= 3) {
        populatedFields++;
      }

      if (vm.paciente.fatherSurname && vm.paciente.fatherSurname.length >= 3) {
        populatedFields++;
      }

      if (vm.paciente.birthDate) {
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
        if(vm.eventSources.length >0){
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

          

      }
      angular.forEach(entities, function (turno, index) {
        if (position != turno.id) {
          if(turno.selected){
            turno.selected = false;
          }
        } else {
          turno.selected = !turno.selected;
          if (calendarRepresentation) {
            if (calendarRepresentation.selected) {
              calendarRepresentation.color = '#D8C358';
              calendarRepresentation.selected = false;
            } else {
              calendarRepresentation.color = '#6CC547';
              calendarRepresentation.selected = true;
            }
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
