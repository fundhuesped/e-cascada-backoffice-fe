(function(){
    'use strict';
    
    function newTurnoController ($uibModal,uiCalendarConfig) {
	    var date = new Date();
    	var d = date.getDate();
    	var m = date.getMonth();
    	var y = date.getFullYear();
    	var self = this;
    	this.paciente = {};

    	//Calendar
	    this.eventSources = [];
	    this.calendarConfig = 
		      {
		        height: 450,
		        editable: false,
		        lang: 'es',
		        weekends: false,
		        defaultView: 'agendaWeek',
		        header:{
		          left: 'agendaWeek month agendaDay',
		          center: 'title',
		          right: 'today prev,next'
		        },
                eventClick: function selectTurnoOnEventClick( date, jsEvent, view){
			        	this.updateSelectionRow(date.id,this.turnos, date);
			    }.bind(this)
	    };
	     
	    this.renderCalendar = function renderCalendar() {
	    	//Workarround to wait for the tab to appear
	    	setTimeout(function(){ 
	    		if(uiCalendarConfig.calendars.newTurnosCalendar){
	        	uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar('render');
	      } }, 1);
	    };

		this.eventSources = [];

    	//Update seleccion when selecting turno 
		this.updateSelectionRow = function updateSelectionRow(position, entities, calendarRepresentation) {
		  	angular.forEach(entities, function(turno, index) {
		    	if (position != index) {
		      		turno.selected = false;
		      		turno.calendarRepresentation.color = '#D8C358';
		      	}else{
		      		turno.selected = !turno.selected;
		      		if(calendarRepresentation){
			        	if(calendarRepresentation.selected){
			        		calendarRepresentation.color = '#D8C358';
			        		calendarRepresentation.selected = false;
				      		turno.calendarRepresentation.color = '#D8C358';
				      		this.selectedCalendarRepresentation = null;
			        	}else{
			        		calendarRepresentation.color = '#dff0d8';
				      		this.selectedCalendarRepresentation = calendarRepresentation;
			        		calendarRepresentation.selected = true;
				      		turno.calendarRepresentation.color = '#dff0d8';
			        	}
    		        	uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar( 'renderEvent',calendarRepresentation);
		      		}
		      		//console.log(uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar);
		        	//uiCalendarConfig.calendars.newTurnosCalendar.fullCalendar( 'rerenderEvents');
		      		//console.log(this.eventSources);
		      		if(this.selectedTurno == turno){
		      			this.selectedTurno = null;
		      		}else{
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
		};

		this.selectPaciente = function selectPaciente(paciente){
			this.paciente = paciente;
			paciente.selected = true;
		};

    	this.clearPacienteSelection = function clearPacienteSelection(){
    		delete this.paciente.selected;
    		this.paciente = {};
    	};





		this.especialidades = [
    		{
	    		id: 1,
	    		name: 'Pediatria',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                description: 'Especialidad dedicada a menores de 15 años',
                createdBy: {
                    id:1,
                    name: 'Admin'
                },
                lastModifiedBy:null
    		},
    		{
	    		id: 2,
	    		name: 'Infectologia',
                description: 'Se encarga del estudio, la prevención, el diagnóstico, tratamiento y pronóstico de las enfermedades producidas por agentes infecciosos',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                createdBy: {
                    id:1,
                    name: 'Admin'
                },
                lastModifiedBy:null

    		}
    	];

		this.medicos = [
			{
				id: 'fernandez',
				name: 'Fernandez',
				color: '#ee8505',
				selected: false

			},
			{
				id: 'ramirez',
				name: 'Ramirez',
				color: '#3a87ad',
				selected: false

			},
			{
				id: 'perez',
				name: 'Perez',
				color: '#3a87ad',
				selected: false
			}
		];
		this.prestaciones = [
    		{
	    		id: 1,
	    		name: 'Turno infecto primera vez',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                duration: '40m', 
                description: 'Turno doble por primera vez infectologia',
                createdBy: {
                    id:1,
                    name: 'Admin'
                },
                notes : 'Se debera empadronar, acercarse con 30 minutos de anterioridad',
                lastModifiedBy:null
    		},
    		{
	    		id: 2,
	    		name: 'Turno infectologia',
                description: 'Turno infectologia',
                duration: '20m',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                createdBy: {
                    id:1,
                    name: 'Admin'
                },
                notes: '',
                lastModifiedBy:null

    		}
    	];

	    this.recomendations = [
	    		{
		    		id: 1,
		    		firstname: 'Nicolas',
	                othernames: 'Juan',
	                fathersurname: 'Perez',
	                mothersurname: 'Cortes', 
	                docType: {
	                	id: '1',
	                	name: 'DNI'
	                },
	                docNumber: '43355679',
	                birthdate: '1967-02-01',
	                contactPhone: '1158773388',
	                pnscode: 'MNPC1023NDM'
	    		},
	    		{
		    		id: 5,
		    		firstname: 'Guadalupe',
	                othernames: 'Carla',
	                fathersurname: '',
	                mothersurname: 'Salvatierra', 
	                docType: {
	                	id: '1',
	                	name: 'DNI'
	                },
	                docNumber: '28556279',
	                birthdate: '1988-12-12'
	    		},
	    		{
		    		id: 2,
		    		firstname: 'Roberto',
	                othernames: '',
	                fathersurname: 'Kitos',
	                mothersurname: '', 
	                docType: {
	                	id: '1',
	                	name: 'DNI'
	                },
	                docNumber: '33556279',
	                birthdate: '1988-03-25'
	    		},
	    		{
		    		id: 4,
		    		firstname: 'Analia',
	                othernames: '',
	                fathersurname: 'Barros',
	                mothersurname: 'Cuca', 
	                docType: {
	                	id: '3',
	                	name: 'LC'
	                },
	                docNumber: '8556279',
	                birthdate: '1937-04-12'
	    		}
	    	];


	    this.turnos = [
			{
				id: 123156,
				date : '2016-03-25',
				hour: '9:30',
				hourTo: '9:50',
				especialidad: {
					id: 1,
					name: 'Infectologia',
				},
				prestacion: {
					id: 1,
					name: 'Turno Infectologia',
				},
				medic : {
					id: 4,
					name: 'Fernandez'
				}
			},
			{
				id: 53453,
				date : '2016-03-25',
				hour: '9:50',
				hourTo: '11:10',
				especialidad: {
					id: 1,
					name: 'Infectologia',
				},
				prestacion: {
					id: 1,
					name: 'Turno Infectologia',
				},
				medic : {
					id: 4,
					name: 'Fernandez'
				}
			},
	    ];
	    function initTurnos(){
	    	var turnosSource = [];
			angular.forEach(self.turnos, function(turno, key) {
				var tmpTurno = {id: key ,title: turno.medic.name, start: new Date(y, m, d + 2, 9, 0),end: new Date(y, m, d + 2, 9, 20),allDay: false,color:'#D8C358'};
		  		turno.calendarRepresentation = tmpTurno;
		  		turnosSource.push(tmpTurno);
			});
			self.eventSources.push(turnosSource);
	    }
	    this.showTurnos = function showTurnos(){
	    	if(this.selectedPrestacion && this.selectedEspecialidad && this.newTurno && this.newTurno.turnDate && this.selectedMedico){
	    		if(this.eventSources.length == 0){
		    		initTurnos();
	    		}
	    		return true;
	    	}
	    	return false;
	    };

    }
    angular.module('turnos.turnos').controller('NewTurnoController',['$uibModal','uiCalendarConfig',newTurnoController]);
})();