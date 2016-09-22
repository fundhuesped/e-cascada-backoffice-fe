(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('turnos.turnos')
    	.controller('TurnosCtrl', turnosCtrl);

	turnosCtrl.$inject = ['Turno', 
						  'TurnoSlot', 
						  'Profesional', 
						  '$loading', 
						  '$filter', 
						  'uiCalendarConfig', 
						  '$uibModal', 
						  'Leave', 
						  'Especialidad', 
						  'Prestacion', 
						  'toastr'];

    function turnosCtrl (Turno,
    					 TurnoSlot, 
    					 Profesional, 
    					 $loading, 
    					 $filter, 
    					 uiCalendarConfig, 
    					 $uibModal, 
    					 Leave, 
    					 Especialidad, 
    					 Prestacion, 
    					 toastr) {
	    var vm = this;
	    vm.canLookForTurnos = canLookForTurnos;
        vm.eventSources = [];
    	vm.getProfesionales = getProfesionales;
    	vm.lookForTurnos = lookForTurnos;
    	vm.especialidadChanged = especialidadChanged;
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
		        if(vm.selectedProfesional || vm.selectedPrestacion ){
		          	vm.lookForTurnos();
	        	}
	    	}
	    };

	    activate();


	    function activate(){
	        vm.especialidades = Especialidad.getActiveList(function(especialidades){
	        	vm.especialidades = especialidades;
	        },displayComunicationError);
	    }

		function getProfesionales(firstname){
			if(firstname.length>2){
		        return Profesional.getActiveList({firstName: firstname}, angular.noop, displayComunicationError).$promise;
			}
		}
		
		function selectProfesional(profesional){
			if(vm.selectedProfesional && vm.selectedProfesional != profesional){
				vm.selectedProfesional.selected = false;
			}
			vm.selectedProfesional = profesional;
			vm.selectedProfesional.selected = true;
		}

	    function especialidadChanged() {
	      if (vm.selectedEspecialidad) {
	        if(angular.isObject(vm.selectedProfesional)){
	          vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id, profesional:vm.selectedProfesional.id}, angular.noop, displayComunicationError);
	        }else{
	          vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id}, angular.noop, displayComunicationError);
	        }
	      }
	    }

	    function canLookForTurnos() {
	    	if(vm.selectedEspecialidad&&!vm.selectedPrestacion){
	    		return false;
	    	}
	    	return vm.selectedPrestacion || vm.selectedProfesional;
	    }

	    function lookForTurnos() {
	      	$loading.start('app');
	      	vm.turnos.length = 0;
	        vm.eventSources.length = 0;
  	      	
	        var searchObject = {};

  	      	var calendarView = uiCalendarConfig.calendars.turnsCalendar.fullCalendar( 'getView' );

	      	searchObject.start = calendarView.start.format('YYYY-MM-DD');
    	  	searchObject.end = calendarView.end.format('YYYY-MM-DD');

    	  	if(vm.selectedProfesional){
    	  		searchObject.profesional = vm.selectedProfesional.id;
    	  	}

    	  	if(vm.selectedEspecialidad){
    	  		searchObject.especialidad = vm.selectedEspecialidad.id;
			}

    	  	if(vm.selectedPrestacion){
    	  		searchObject.prestacion = vm.selectedPrestacion.id;
    	  	}

    	  	if(vm.turnStatus==='taken'){
    	  		searchObject.state = Turno.state.ocuppied;
    	  	}else{
    	  		if(vm.turnStatus==='notTaken'){
    	  			searchObject.state = Turno.state.available;
    	  		}
    	  	}

	      	TurnoSlot.getFullActiveList(searchObject)
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
	        	}, function(){displayComunicationError('app');});
      	    
      	    if(vm.selectedProfesional){
      	    	searchAusencias();
      	    }
	      }

      	function searchAusencias(){
		    Leave.getFullActiveList({profesional:vm.searchProfesional.id}, function(results){
		        var ausenciasSource =[];
	            vm.ausencias = results;
		        angular.forEach(results, function (ausencia) {
		        	var event = createCalendarAusenciaEvent(ausencia);
	            	ausenciasSource.push(event);
		          	ausencia.calendarRepresentation = event;
	        	});
		        vm.eventSources.push(ausenciasSource);
        	}, function(){displayComunicationError('app');});
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
	        size: 'md',
	        backdrop:'static',
	        controller: 'TurnoDetailCtrl',
	        controllerAs: 'TurnoDetailCtrl',
	        resolve: {
	          turno: function () {
	            return turno;
	          }
	        }
	      });
	      modalInstance.result.then(function () {
	      	vm.lookForTurnos();
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

      	function createCalendarTurnoEvent(turnoSlot){
	        var startTime = new Date(turnoSlot.day + 'T' + turnoSlot.start + '-03:00');
	        var endTime = new Date(turnoSlot.day + 'T' + turnoSlot.end+ '-03:00');
	        var title = '';
	        var color = '#B2EBF2';
  	      	var turno = turnoSlot.turnos[0];
	        if(turnoSlot.state === TurnoSlot.state.ocuppied){
	         	color = '#00796B';
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