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
                            'TurnoSlot',
                            'Turno',
                            'Sobreturno'];


  function newTurnoCtrl($uibModal,
                        uiCalendarConfig,
                        toastr,
                        $loading,
                        $filter,
                        Especialidad,
                        Prestacion,
                        Paciente,
                        Document,
                        Profesional,
                        TurnoSlot,
                        Turno,
                        Sobreturno) {
    var vm = this;
    vm.canConfirmSobreturno = canConfirmSobreturno;
    vm.canConfirmTurno = canConfirmTurno;
    vm.canLookForTurnos = canLookForTurnos;
    vm.clearPacienteSelection = clearPacienteSelection;
    vm.cleanForm = cleanForm;
    vm.cleanSobreturnosForm = cleanSobreturnosForm;
    vm.confirmTurno = confirmTurno;
    vm.confirmSobreturno = confirmSobreturno;
    vm.currentTab = 0;
    vm.especialidades = null;
    vm.eventSources = [];
    vm.sobreturnoEventSources = [];
    vm.cleanTurnosSearch = cleanTurnosSearch;
    vm.lookForPacientes = lookForPacientes;
    vm.lookForTurnos = lookForTurnos;
    vm.lookForTurnosForDates = lookForTurnosForDates;
    vm.sobreTurnosWarningMessage = vm.sobreTurnosWarningMessage;
    var lookedForTurnos = false;
    vm.newTurno = {};
    vm.notes = '';
    vm.openTurnoModal = openTurnoModal;
    vm.openPacienteModal = openPacienteModal;
    vm.paciente = {};

    //Default documentType to DNI
    vm.paciente.documentType = {id: 1, name: "DNI", description: "DNI", status: "Active"};

    vm.profesionales = [];

    vm.pageChanged = pageChanged;
    vm.prestaciones = [];
    vm.profesionalChanged = profesionalChanged;
    vm.sobreturnoProfesionalChanged = sobreturnoProfesionalChanged;
    vm.sobreturnoSearchChanged = sobreturnoSearchChanged;
    vm.sobreturnoPrestaciones = [];
    vm.sobreturnoProfesionales = [];
    vm.recomendationsPanel = {};
    vm.renderCalendar = renderCalendar;
    vm.reserveTurno = reserveTurno;
    vm.reserveSobreturno = reserveSobreturno;
    vm.especialidadChanged = especialidadChanged;
    vm.selectPaciente = selectPaciente;
    vm.selectedPaciente = null;
    vm.shouldLookForPacient = shouldLookForPacient;
    vm.sobreturno = {};
    vm.pageSize = 20;
    vm.totalItems = null;
    vm.currentPage = 1;
    vm.updateSelectionRow = updateSelectionRow;
    vm.tabChanged = tabChanged;
    vm.calendarPopup = {
      opened: false,
      options: {
        minDate: new Date()
      }
    };
    vm.birthDateCalendarPopup = {
      opened: false,
      options: {
        maxDate: new Date()
      }
    };
    vm.sobreturnoCalendarPopup = {
      opened: false,
      options: {
        minDate: new Date()
      },
      openCalendar : function(){
        this.opened = true;
      }
    };


    vm.openCalendar = openCalendar;
    vm.openBirthDateCalendar = openBirthDateCalendar;

    //Calendar
    var turnosSource = [];
    var sobreturnosSource = [];
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

    vm.sobreturnoCalendarConfig =
    {
      height: 450,
      editable: false,
      lang: 'es',
      weekends: true,
      defaultView: 'agendaDay',
      header: {
        left: '',
        center: 'title',
        right: ''
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
        vm.sobreturnoProfesionales = profesionales;
      }, displayComunicationError);

      vm.recomendationsPanel.message = 'Por favor comience a completar el formulario para buscar pacientes';
      vm.renderCalendar();
    }

    function canConfirmSobreturno(){
      if(vm.sobreturno.profesional && vm.sobreturno.prestacion && vm.sobreturno.day && vm.sobreturno.start && vm.sobreturno.end){
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
      vm.paciente = {};
      //Default documentType to DNI
      vm.paciente.documentType = {id: 1, name: "DNI", description: "DNI", status: "Active"};
      vm.recomendationsPanel.message = 'Por favor comience a completar el formulario para buscar pacientes';
    }

    function confirmSobreturno() {
      $loading.start('app');
      if(vm.selectedPaciente){
        vm.sobreturno.paciente = vm.selectedPaciente;
        vm.reserveSobreturno();
      }else{
        var paciente = new Paciente();
        paciente.firstName = vm.paciente.firstName;
        paciente.fatherSurname = vm.paciente.fatherSurname;
        paciente.primaryPhoneNumber = vm.paciente.primaryPhoneNumber;
        paciente.documentType = vm.paciente.documentType;
        paciente.documentNumber = vm.paciente.documentNumber;
        paciente.prospect = true;
        paciente.birthDate = (vm.paciente.birthDate?$filter('date')(vm.paciente.birthDate, 'yyyy-MM-dd'):null);
        paciente.email = vm.paciente.email;
        paciente.$save(function(createdPaciente){
                        vm.sobreturno.paciente = createdPaciente;
                        vm.reserveSobreturno();
                      },function(){
                        displayComunicationError('app');
                      }
        );
      }
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
      vm.notes = '';
      vm.clearPacienteSelection();
      vm.cleanSobreturnosForm();
    }

    function cleanSobreturnosForm(){
      vm.sobreturno = {};
      vm.sobreturnoPrestaciones = [];
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


  function cleanSobreturnosResult() {
      if(vm.sobreturnoEventSources){
        vm.sobreturnoEventSources.length = 0;
      }
    }




    function cleanTurnosSearch() {
      vm.selectedPrestacion = null;
      vm.selectedEspecialidad = null;
      vm.prestaciones.length = 0;
      vm.selectedProfesional = null;
      vm.selectedDate = null;
      vm.profesionales.length = 0;
      vm.especialidades = Especialidad.getActiveList(angular.noop, displayComunicationError);
      cleanTurnosResult();
    }

    function lookForPacientes() {
      if (vm.shouldLookForPacient()) {
        $loading.start('recomendations');
        vm.recomendationsPanel.message = null;

        var searchObject = {};

        if(vm.paciente.documentType && vm.paciente.documentNumber){
          searchObject.documentType = vm.paciente.documentType.id;
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
      return vm.selectedPrestacion && vm.selectedEspecialidad && vm.selectedProfesional;
    }


    function tabChanged(newTab){
      if(lookedForTurnos){
        lookForTurnos(newTab);
      }
    }

    function lookForTurnos(newTab) {
      $loading.start('app');
      cleanTurnosResult();

      var searchObject = {
        state: 'Available',
        prestacion: vm.selectedPrestacion.id,
        ordering:'day,start'
      };
      if (vm.selectedDate) {
        searchObject.day__gte = $filter('date')(vm.selectedDate, 'yyyy-MM-dd');
      }else{
        searchObject.day__gte = $filter('date')(new Date(), 'yyyy-MM-dd');
      }
      if (vm.selectedProfesional && vm.selectedProfesional.id !== -99) {
        searchObject.profesional = vm.selectedProfesional.id;
      }

      //For calendar search
      if(newTab !== undefined){
        if(newTab === 0){
          getAllTurnoSlotsForDates(searchObject);
        }else{
          getTurnoSlotsList(searchObject);
        }
      }else{
        if(vm.currentTab === 0){
          getAllTurnoSlotsForDates(searchObject);
        }else{
          getTurnoSlotsList(searchObject);
        }
      }
    }


    function lookForTurnosForDates() {
      $loading.start('app');
      cleanSobreturnosResult();

      var searchObject = {
        prestacion: vm.sobreturno.prestacion.id,
        ordering:'day,start'
      };
      searchObject.day = $filter('date')(vm.sobreturno.day, 'yyyy-MM-dd');
      

      if (vm.sobreturno.profesional && vm.sobreturno.profesional.id !== -99) {
        searchObject.profesional = vm.sobreturno.profesional.id;
      }

      getAllTurnoSlotsForSobreturnoDate(searchObject);

    }



    function pageChanged() {
      if(vm.selectedPrestacion){
        $loading.start('app');
        var searchObject = {
          state: 'Available',
          prestacion: vm.selectedPrestacion.id,
          ordering:'day,start'
        };

        if (vm.selectedDate) {
          searchObject.day__gte = $filter('date')(vm.selectedDate, 'yyyy-MM-dd');
        }else{
          searchObject.day__gte = $filter('date')(new Date(), 'yyyy-MM-dd');
        }
        if (vm.selectedProfesional) {
          searchObject.profesional = vm.selectedProfesional.id;
        }
        getTurnoSlotsList(searchObject);
      }
    }

    function getAllTurnoSlotsForSobreturnoDate(searchObject){
      TurnoSlot.getFullActiveList(searchObject).$promise.then(function (results) {
        sobreturnosSource =[];
        if(results.length===0){
          vm.sobreTurnosWarningMessage = "El médico no tiene agenda cargada el día seleccionado";
        }else{
          vm.sobreTurnosWarningMessage = null;
        }
        angular.forEach(results, function (turno) {
          var event = createCalendarTurnoEvent(turno);
          sobreturnosSource.push(event);
          turno.calendarRepresentation = event;
        });
        vm.sobreturnoEventSources.push(sobreturnosSource);
        uiCalendarConfig.calendars.sobreturnoCalendar.fullCalendar( 'gotoDate',searchObject.day );
        renderSobreturnosCalendar();
        $loading.finish('app');
      }, function(){
        displayComunicationError('app');
      });
    }

    function createCalendarTurnoEvent(turnoSlot){
      var startTime = new Date(turnoSlot.day + 'T' + turnoSlot.start + '-03:00');
      var endTime = new Date(turnoSlot.day + 'T' + turnoSlot.end+ '-03:00');
      var title = '';
      var color = '#B2EBF2';
      if(turnoSlot.state === TurnoSlot.state.ocuppied){
          var turno = turnoSlot.currentTurno;
        if(turno.state === Turno.state.present){
          color = '#d6e9c6';
        }else{
          color = '#00796B';
        }
        title = turno.paciente.fatherSurname + ',' + turno.paciente.firstName + '-' + turno.paciente.primaryPhoneNumber;
      }
      return {
          id: turnoSlot.id,
          title: title,
          start: startTime,
          end: endTime,
          allDay: false,
          color: color,
          textColor: '#000000',
          borderColor: '#000000',
          timezone:'America/Argentina/Buenos_Aires'
       };
    }

    function getAllTurnoSlotsForDates(searchObject){
      var calendarView = uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar( 'getView' );
      searchObject.start = calendarView.start.format('YYYY-MM-DD');
      searchObject.end = calendarView.end.format('YYYY-MM-DD');
      TurnoSlot.getFullActiveList(searchObject).$promise.then(function (results) {
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

    function getTurnoSlotsList(searchObject){
      searchObject.page = vm.currentPage;
      searchObject.page_size = vm.pageSize;

      TurnoSlot.getPaginatedActiveList(searchObject).$promise.then(function (paginatedResult) {
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
      modalInstance.result.then(function (resolution) {
        if(resolution==='modified'){
          if(vm.selectedPaciente && vm.selectedPaciente.id === selectedPaciente.id){
            Paciente.get({id:selectedPaciente.id}, function(returnedObject){
              vm.selectedPaciente = returnedObject;
              returnedObject.birthDate =(returnedObject.birthDate?new Date(returnedObject.birthDate + 'T03:00:00'):null);
              vm.paciente = returnedObject;
            });
          }
        }else{
          if(resolution==='deleted'){
            if(vm.selectedPaciente && vm.selectedPaciente.id === selectedPaciente.id){
              clearPacienteSelection();
            }
          }
        }
        vm.lookForPacientes();
      });
    }

    //Open turno info modal
    function openTurnoModal(turno) {
      var modalInstance = $uibModal.open({
        templateUrl: '/views/turnos/turno-detail-modal.html',
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
      modalInstance.result.then(angular.noop,function () {
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

    function renderSobreturnosCalendar() {
      if (uiCalendarConfig.calendars.sobreturnoCalendar) {
        uiCalendarConfig.calendars.sobreturnoCalendar.fullCalendar('render');
      }
    }


    function reserveSobreturno(){
      var sobreturno = new Sobreturno();
      sobreturno.paciente = vm.sobreturno.paciente.id;
      sobreturno.notes = vm.sobreturno.notes;
      sobreturno.turnoSlot = {};
      sobreturno.turnoSlot.day = $filter('date')(vm.sobreturno.day, 'yyyy-MM-dd');
      sobreturno.turnoSlot.start = $filter('date')(vm.sobreturno.start , 'HH:mm');
      sobreturno.turnoSlot.end = $filter('date')(vm.sobreturno.end , 'HH:mm');
      sobreturno.turnoSlot.profesional = vm.sobreturno.profesional.id;
      sobreturno.turnoSlot.prestacion = vm.sobreturno.prestacion.id;
      sobreturno.$save(function(turnoResult){
        $loading.finish('app');
        vm.openTurnoModal(turnoResult);
      },function(){
        displayComunicationError('app');
      });
    }
    function reserveTurno(){
      var turno = new Turno();

      turno.turnoSlot = vm.selectedTurno.id;
      turno.paciente = vm.selectedTurno.paciente;
      turno.notes = vm.notes;
      turno.$save(function(turnoResult){
        $loading.finish('app');
        vm.openTurnoModal(turnoResult);
      },function(err){
        if(err && err.status == 400){
          toastr.warning(err.data.error);
        }else{
          displayComunicationError('app');
        }
      });
    }

    function especialidadChanged() {
      cleanTurnosResult();
      if (vm.selectedEspecialidad) {
          Profesional.getActiveList({especialidad: vm.selectedEspecialidad.id}, function (profesionales) {
            vm.profesionales = [{id:-99,firstName:'Todos los médicos'}];
            vm.profesionales = vm.profesionales.concat(profesionales);
          }, displayComunicationError);
          vm.prestaciones = [];
      }
    }


    function profesionalChanged() {
      cleanTurnosResult();
      if (vm.selectedProfesional) {
        if(vm.selectedProfesional.id === -99){
          vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id}, angular.noop, displayComunicationError);
        }else{
          vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id, profesional:vm.selectedProfesional.id}, angular.noop, displayComunicationError);
        }
      }
    }

    function sobreturnoProfesionalChanged() {
      vm.sobreturnoPrestaciones = Prestacion.getActiveList({profesional:vm.sobreturno.profesional.id}, angular.noop, displayComunicationError);
    }

    function sobreturnoSearchChanged() {
      if(vm.sobreturno.prestacion && vm.sobreturno.day){
        lookForTurnosForDates();
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

      if (vm.paciente.documentType && vm.paciente.documentNumber) {
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
