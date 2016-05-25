(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('turnos.turnos')
    	.controller('TurnosCtrl', turnosCtrl);

	turnosCtrl.$inject = ['Turno', 'Profesional', '$loading', '$filter'];

    function turnosCtrl (Turno, Profesional, $loading, $filter) {
	    var vm = this;
        vm.eventSources = [];
		vm.profesionales = [];
    	vm.searchProfesional = searchProfesional;
    	vm.lookForTurnos = lookForTurnos;
        vm.search = [];
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
	          left: 'month agendaWeek agendaDay',
	          center: 'title',
	          right: 'today prev,next'
	        },
	        businessHours:{
						    start: '8:00',
						    end: '16:00', 
						    dow: [ 1, 2, 3, 4, 5 ]
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
	        vm.eventSources.length = 0;
			vm.selectedProfesional = profesional;
			vm.selectedProfesional.selected = true;
			vm.lookForTurnos(profesional.id);
		}

	    function lookForTurnos(idProfesional) {
	      	$loading.start('app');
	    	var date = new Date();
	      	vm.turnos.length = 0;
	      	var formatedDate = $filter('date')(date, 'yyyy-MM-dd');
	      	Turno.query({profesional: idProfesional, day__gte: formatedDate})
	      	   .$promise
	      	   .then(function (results) {
			        var turnosSource =[];
			        angular.forEach(results, function (turno) {
			        	var event = createCalendarTurnoEvent(turno);
			          	turnosSource.push(event);
			          	turno.calendarRepresentation = event;
		        	});
			        vm.eventSources.push(turnosSource);
			        $loading.finish('app');
	        	});
	      }

      	function createCalendarTurnoEvent(turno){
	        var startTime = new Date(turno.day + 'T' + turno.start);
	        var endTime = new Date(turno.day + 'T' + turno.end);
	        var title = '';
	        var color = '#FFFFFF';
	        if(turno.taken){
	         	color = '#D8C358';
	         	title = turno.paciente.fatherSurname + ',' + turno.paciente.firstName + '-' + turno.paciente.primaryPhoneNumber;
	        }
	        return {
	            id: turno.id,
	            title: title,
	            start: startTime,
	            end: endTime,
	            allDay: false,
	            color: color,
	            borderColor: '#000000',
	            timezone:'America/Argentina/Buenos_Aires'
	         };
      	}
    }
})();