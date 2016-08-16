(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('turnos.turnos')
    	.controller('TurnosCtrl', turnosCtrl);

	turnosCtrl.$inject = ['Turno', 'Profesional', '$loading', '$filter', 'uiCalendarConfig', '$uibModal', 'Leave'];

    function turnosCtrl (Turno, Profesional, $loading, $filter, uiCalendarConfig, $uibModal, Leave) {
	    var vm = this;
        vm.eventSources = [];
		vm.profesionales = [];
    	vm.searchProfesional = searchProfesional;
    	vm.lookForTurnos = lookForTurnos;
        vm.search = [];
        vm.selectedProfesional = null;
    	vm.selectProfesional = selectProfesional;
		var createCalendarTurnoEvent = createCalendarTurnoEvent;
		vm.turnos = [];
    	
    	 /* config object */
    	vm.eventSources = [];
	    vm.calendarConfig = {
	        height: 550,
	        editable: false,
	        lang: 'es',
	        weekends: false,
	        defaultView: 'agendaWeek',
	        header:{
	          left: 'month , agendaWeek agendaDay',
	          center: 'title',
	          right: 'today prev,next'
	        },
	        businessHours:{
						    start: '8:00',
						    end: '16:00', 
						    dow: [ 1, 2, 3, 4, 5 ]
							},

	    	eventClick: function selectTurnoOnEventClick(date, jsEvent, view) {
		        displayTurnDetails(date.id, vm.turnos, date);
		    },

	      	viewRender: function(view, element){
		        if(vm.selectedProfesional){
		          	vm.lookForTurnos(vm.selectedProfesional.id);
	        	}
	    	}

	    };

	    activate();

	    function activate(){
	        vm.profesionales = Profesional.getActiveList();
	    }

		function searchProfesional(){
			if(vm.searchProfesional.firstname.length>0){
		        vm.profesionales = Profesional.getActiveList({firstName: vm.searchProfesional.firstname});

			}
		}
		
		function selectProfesional(profesional){
			if(vm.selectedProfesional && vm.selectedProfesional != profesional){
				vm.selectedProfesional.selected = false;
			}
			vm.selectedProfesional = profesional;
			vm.selectedProfesional.selected = true;
			vm.lookForTurnos(profesional.id);
		}

	    function lookForTurnos(idProfesional) {
	      	$loading.start('app');
	      	vm.turnos.length = 0;
	        vm.eventSources.length = 0;
  	      	var calendarView = uiCalendarConfig.calendars.turnsCalendar.fullCalendar( 'getView' );

	      	var calendarStart = calendarView.start.format('YYYY-MM-DD');
    	  	var calendarEnd = calendarView.end.format('YYYY-MM-DD');

	      	Turno.getFullActiveList({profesional: idProfesional, start:calendarStart, end:calendarEnd})
	      	   .$promise
	      	   .then(function (results) {
			        var turnosSource =[];
			        vm.turnos = results;
			        angular.forEach(results, function (turno) {
			        	var event = createCalendarTurnoEvent(turno);
			          	turnosSource.push(event);
			          	turno.calendarRepresentation = event;
		        	});
			        vm.eventSources.push(turnosSource);
			        $loading.finish('app');
	        	});
  		    Leave.getFullActiveList({profesional:idProfesional}, function(results){
		        var ausenciasSource =[];
                vm.ausencias = results;
		        angular.forEach(results, function (ausencia) {
		        	var event = createCalendarAusenciaEvent(ausencia);
                	ausenciasSource.push(event);
		          	ausencia.calendarRepresentation = event;
            	});
		        vm.eventSources.push(ausenciasSource);
            });   
	      }

	    function displayTurnDetails(position, entities, calendarRepresentation) {
	      	angular.forEach(entities, function (turno, index) {
    			if (position == turno.id) {
					openTurnoModal(turno);
					return;
				}
			});
	    }

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
	    }

		function createCalendarAusenciaEvent(ausencia){
	        var startTime = new Date(ausencia.start_day+ 'T00:00-03:00');
	        var endTime = new Date(ausencia.end_day+ 'T00:00-03:00');
	        var title = '';
	        var color = '#FF9800';
    	 	
         	title = ausencia.reason.charAt(0).toUpperCase() + ausencia.reason.slice(1);;
	        return {
	            id: ausencia.id,
	            title: title,
	            start: startTime,
	            end: endTime,
	            allDay: true,
	            color: color,
	            textColor: '#000000',
	            borderColor: '#000000',
	            timezone:'America/Argentina/Buenos_Aires'
	         };
      	}

      	function createCalendarTurnoEvent(turno){
	        var startTime = new Date(turno.day + 'T' + turno.start + '-03:00');
	        var endTime = new Date(turno.day + 'T' + turno.end+ '-03:00');
	        var title = '';
	        var color = '#B2EBF2';
	        if(turno.taken){
	         	color = '#00796B';
	         	title = turno.paciente.fatherSurname + ',' + turno.paciente.firstName + '-' + turno.paciente.primaryPhoneNumber;
	        }
	        return {
	            id: turno.id,
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
    }
})();