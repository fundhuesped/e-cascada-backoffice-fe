(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('turnos.turnos')
    	.controller('TurnosCtrl', turnosCtrl);
    	turnosCtrl.$inject = ['Turno', 'Profesional', '$loading', '$filter','uiCalendarConfig'];

    function turnosCtrl (Turno, Profesional, $loading, $filter,uiCalendarConfig) {
	    var vm = this;
	    var date = new Date();
    	var d = date.getDate();
    	var m = date.getMonth();
    	var y = date.getFullYear();
        vm.eventSources = [];
		vm.profesionales = [];
    	vm.searchMedicos = searchProfesional;
    	vm.lookForTurnos = lookForTurnos;
    	vm.renderCalendar = renderCalendar;
    	vm.reRedender = reRedender;
        vm.search = [];
    	vm.selectProfesional = selectProfesional;
	    var turnosSource = [];

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
	    };

	    activate();

	    function activate(){
	        vm.profesionales = Profesional.query({status: 'Active'});
	    }

	vm.toggleSources = function toggleSources(){
		vm.eventSources.length = 0;
		if(vm.ramirez){
			var ramirezCal = 	     [ 
				{title: 'Hanna Blade', start: new Date(y, m, d + 2, 9, 0),end: new Date(y, m, d + 3, 16, 20),allDay: false},
				{title: 'Kenneth Burts', start: new Date(y, m, d + 2, 9, 20),end: new Date(y, m, d + 3, 16, 40),allDay: false},
	      		{title: 'Vacaciones',start: new Date(y, m, d + 5),end: new Date(y, m, d + 20)}];
			vm.eventSources.push(ramirezCal);
		}
		if(vm.fernandez){
			var fernandezCal = 	     [ 
				{title: 'Jessie Blake', start: new Date(y, m, d + 2, 9, 0),end: new Date(y, m, d + 3, 9, 20),allDay: false,color:'#ee8505'},
				{title: 'Tom Umland', start: new Date(y, m, d + 2, 9, 20),end: new Date(y, m, d + 3, 9, 40),allDay: false,color:'#ee8505'},
				{title: 'Molly Truluck', start: new Date(y, m, d + 2, 9, 40),end: new Date(y, m, d + 3, 10, 0),allDay: false,color:'#ee8505'},
				{title: 'Merrilee Eoff', start: new Date(y, m, d + 2, 10, 0),end: new Date(y, m, d + 3, 10, 20),allDay: false,color:'#ee8505'}];
			vm.eventSources.push(fernandezCal);
		}
		if(vm.infecto){
			var infectocal = 	     [ 
				{title: 'Hanna Blade', start: new Date(y, m, d + 2, 9, 0),end: new Date(y, m, d + 3, 16, 20),allDay: false,color:'#D8C358'},
				{title: 'Kenneth Burts', start: new Date(y, m, d + 2, 9, 20),end: new Date(y, m, d + 3, 16, 40),allDay: false,color:'#D8C358'},
				{title: 'Lola Burns', start: new Date(y, m, d + 2, 9, 20),end: new Date(y, m, d + 3, 16, 40),allDay: false,color:'#D8C358'}];
			vm.eventSources.push(infectocal);
		}
		if(vm.gineco){
			var  ginecocal = 	     [ 
				{title: 'Hanna Blade', start: new Date(y, m, d + 3, 9, 0),end: new Date(y, m, d + 3, 16, 20),allDay: false,color:'#6D0839'}];
			vm.eventSources.push(ginecocal);			
		}
		console.log(vm.eventSources);
	}



	vm.listMedicos = [
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

	function searchProfesional(){
		if(vm.searchProfesional.firstname.length>0){
	        vm.profesionales = Profesional.query({firstName: vm.searchProfesional.firstname, status: 'Active'});

		}

//        vm.medicos = Turno.query({status:'Active',paciente:vm.paciente.id});

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
      vm.showTurnos = true;
      vm.turnos = [];
      var formatedDate = $filter('date')(date, 'yyyy-MM-dd');
      Turno.query({profesional: idProfesional, day__gte: formatedDate})
      	   .$promise
      	   .then(function (results) {
	        var turnosSource =[];
	        angular.forEach(results, function (turno) {
	          var startTime = new Date(turno.day + 'T' + turno.start);
	          var endTime = new Date(turno.day + 'T' + turno.end);
	          var title = '';
	          var color = '#FFFFFF';
	          if(turno.taken){
	         	color = '#D8C358';
	         	title = turno.paciente.fatherSurname + ',' + turno.paciente.firstName;
	          }
	          var event = {
	            id: turno.id,
	            title: title,
	            start: startTime,
	            end: endTime,
	            allDay: false,
	            color: color,
	            borderColor: '#000000',
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
	vm.medicos = function medicos(){
		var tmpMedicos = [];
		console.log(vm.medicosSearch);
		if(vm.medicosSearch){
			for (var i = vm.listMedicos.length - 1; i >= 0; i--) {
				if(vm.listMedicos[i].name.search(vm.medicosSearch)!==-1){
					tmpMedicos.push(vm.listMedicos[i]);
				}
			}
			return tmpMedicos;
		}else{
			return vm.listMedicos;
		}
	};
    }
})();