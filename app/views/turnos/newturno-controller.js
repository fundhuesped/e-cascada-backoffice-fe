(function () {
  'use strict';

  function newTurnoCtrl($scope, $uibModal, uiCalendarConfig, toastr, $loading, $filter, Especialidad, Prestacion, Paciente, Document, Profesional, Turno) {
    var date = new Date();
    var dateIncrement = 0;
    if (date.getDay() == 4) {
      dateIncrement = 4;
    } else {
      if (date.getDay() == 5) {
        dateIncrement = 3;
      }
    }
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var self = this;
    this.paciente = null;
    this.especialidades = null;

    //Calendar
    this.eventSources = [];
    this.calendarConfig =
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
        this.updateSelectionRow(date.id, this.turnos, date);
      }.bind(this)
    };

    this.renderCalendar = function renderCalendar() {
      //Workarround to wait for the tab to appear
      setTimeout(function () {
        if (uiCalendarConfig.calendars.newTurnosCalendar) {
          uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar('render');
        }
      }, 1);
    };

    this.eventSources = [];

    //Update seleccion when selecting turno
    this.updateSelectionRow = function updateSelectionRow(position, entities, calendarRepresentation) {
      angular.forEach(entities, function (turno, index) {
        if (position != index) {
          turno.selected = false;
          turno.calendarRepresentation.color = '#D8C358';
        } else {
          turno.selected = !turno.selected;
          if (calendarRepresentation) {
            if (calendarRepresentation.selected) {
              calendarRepresentation.color = '#D8C358';
              calendarRepresentation.selected = false;
              turno.calendarRepresentation.color = '#D8C358';
              this.selectedCalendarRepresentation = null;
            } else {
              calendarRepresentation.color = '#dff0d8';
              this.selectedCalendarRepresentation = calendarRepresentation;
              calendarRepresentation.selected = true;
              turno.calendarRepresentation.color = '#dff0d8';
            }
            uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar('renderEvent', calendarRepresentation);
          }
          if (this.selectedTurno == turno) {
            this.selectedTurno = null;
          } else {
            this.selectedTurno = turno;
          }
        }
      }.bind(this));
    };

    //Open the detailed pacient info modal
    this.openPacienteModal = function openPacienteModal(selectedPaciente) {
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
      var ctrl = this;
      modalInstance.result.then(function () {
        ctrl.lookForPacientes()
      })
    };

    this.selectPaciente = function selectPaciente(paciente) {
      this.paciente = paciente;
      paciente.selected = true;
    };

    this.clearPacienteSelection = function clearPacienteSelection() {
      this.recomendationList = [];
      delete this.paciente.selected;
      this.paciente = null;
    };

    this.lookForTurnos = function lookForTurnos() {
      $loading.start('app');
      setTimeout(function () {
        $loading.finish('app');
        this.showTurnos = true;
        $scope.turnos = [];
        $scope.eventSources = [];
        Turno.query({prestacion: this.selectedPrestacion.id, taken: false}).$promise.then(function (results) {
          angular.forEach(results, function (turno) {
            $scope.turnos.push(turno);
            var startTime = new Date(turno.day + "T" + turno.start);
            var endTime = new Date(turno.day + "T" + turno.end);
            var tmpTurno = {
              id: turno.id,
              title: turno.profesional.fatherSurname,
              start: startTime,
              end: endTime,
              allDay: false,
              color: '#D8C358'
            };
            turno.calendarRepresentation = tmpTurno;
            $scope.eventSources.push(tmpTurno);
          });
        });
        this.turnos = $scope.turnos;
        this.eventSources = $scope.eventSources;
      }.bind(this), 1000);
    };

    this.shouldLookForPacient = function shouldLookForPacient() {
      var populatedFields = 0;
      if (this.paciente === null) {
        return false;
      }

      if (this.paciente.documentType) {
        populatedFields++;
      }

      if (this.paciente.documentNumber) {
        return true;
      }

      if (this.paciente.firstName) {
        populatedFields++;
      }

      if (this.paciente.fatherSurname) {
        populatedFields++;
      }

      if (this.paciente.birthDate) {
        populatedFields++;
      }

      if (this.paciente.email) {
        populatedFields++;
      }

      if (populatedFields > 1) {
        return true;
      }

      return false;
    };

    this.lookForPacientes = function lookForPacientes() {
      if (this.shouldLookForPacient()) {
        $loading.start('recomendations');
        this.recomendations = Paciente.getActiveList();
        setTimeout(function () {
          $loading.finish('recomendations');
          this.copyPaciente = angular.copy(this.paciente);
          this.copyPaciente.birthDate = $filter('date')(this.copyPaciente.birthDate, "yyyy-MM-dd");
          this.recomendationList = $filter('filter')(this.recomendations, this.copyPaciente);
        }.bind(this), 1000);
      }
    };

    this.limpiarBusquedaTurno = function limpiarBusquedaTurno() {
      this.showTurnos = false;
      this.selectedPrestacion = null;
      this.selectedEspecialidad = null;
      this.prestaciones = [];
      this.selectedProfesional = null;
    };

    this.confirmTurno = function confirmTurno() {
      $loading.start('app');
      setTimeout(function () {
        $loading.finish('app');
        toastr.success('Turno creado con éxito');
        this.limpiarBusquedaTurno();
        this.selectedTurno.selected = false;
        this.selectedTurno = null;
        this.clearPacienteSelection();
      }.bind(this), 3000);
    };

    this.searchPrestacionesMedicos = function searchPrestacionesMedicos() {
      this.prestaciones = [];
      if (this.selectedEspecialidad) {
        this.prestaciones = Prestacion.query({especialidad: this.selectedEspecialidad.id, status: 'Active'});
        this.profesionales = Profesional.query({especialidad: this.selectedEspecialidad.id, status: 'Active'});
      }
    };

    this.searchProfesionales = function searchProfesionales() {
      this.profesionales = [];
      if (this.selectedPrestacion) {
        this.profesionales = Profesional.query({prestacion: this.selectedPrestacion.id, status: 'Active'});
      }
    };

    this.init = function init() {
      this.documents = Document.getActiveList();
      this.especialidades = Especialidad.getActiveList();
    };

    this.init();
  }

  angular.module('turnos.turnos').controller('NewTurnoCtrl', ['$scope', '$uibModal', 'uiCalendarConfig', 'toastr', '$loading', '$filter', 'Especialidad', 'Prestacion', 'Paciente', 'Document', 'Profesional', 'Turno', newTurnoCtrl]);
})();
