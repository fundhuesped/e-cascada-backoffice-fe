(function () {
    'use strict';

    function newTurnoCtrl($uibModal, uiCalendarConfig, toastr, $loading, $filter, Especialidad, Prestacion, Paciente, Document, Profesional) {
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

        /*
        this.turnos = [
            {
                id: 123156,
                date: '2016-03-25',
                hour: '9:30',
                hourTo: '9:50',
                especialidad: {
                    id: 1,
                    name: 'Infectologia',
                },
                prestacion: {
                    id: 1,
                    name: 'Consulta Infectologia',
                },
                medic: {
                    id: 4,
                    name: 'Fernandez'
                }
            },
            {
                id: 53453,
                date: '2016-03-25',
                hour: '9:50',
                hourTo: '11:10',
                especialidad: {
                    id: 1,
                    name: 'Infectologia',
                },
                prestacion: {
                    id: 1,
                    name: 'Consulta Infectologia',
                },
                medic: {
                    id: 4,
                    name: 'Fernandez'
                }
            },
        ];
        */

        this.lookForTurnos = function lookForTurnos() {
            $loading.start('app');
            setTimeout(function () {
                $loading.finish('app');
                this.showTurnos = true;
                initTurnos();
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

        function initTurnos() {
            var turnosSource = [];
            var increment = 0;
            angular.forEach(self.turnos, function (turno, key) {

                var tmpTurno = {
                    id: key,
                    title: turno.medic.name,
                    start: new Date(y, m, d + 2 + dateIncrement, 9 + increment, 0),
                    end: new Date(y, m, d + 2 + dateIncrement, 9 + increment, 20),
                    allDay: false,
                    color: '#D8C358'
                };
                turno.calendarRepresentation = tmpTurno;
                turnosSource.push(tmpTurno);
                increment++;
            });
        }

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

    angular.module('turnos.turnos').controller('NewTurnoCtrl', ['$uibModal', 'uiCalendarConfig', 'toastr', '$loading', '$filter', 'Especialidad', 'Prestacion', 'Paciente', 'Document', 'Profesional', newTurnoCtrl]);
})();