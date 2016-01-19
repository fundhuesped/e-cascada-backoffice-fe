(function(){
    'use strict';
    
    function turnosCtrl (TurnosSrv) {
	    var date = new Date();
    	var d = date.getDate();
    	var m = date.getMonth();
    	var y = date.getFullYear();
    	 /* config object */
    this.eventSources = [];
	    this.calendarConfig = 
	      {
	        height: 450,
	        editable: false,
	        lang: 'es',
	        weekends: false,
	        header:{
	          left: 'month agendaWeek agendaDay',
	          center: 'title',
	          right: 'today prev,next'
	        },
	    };
	this.toggleSources = function toggleSources(){
		this.eventSources.length = 0;
		if(this.ramirez){
			var ramirezCal = 	     [ 
				{title: 'Hanna Blade', start: new Date(y, m, d + 3, 9, 0),end: new Date(y, m, d + 3, 16, 20),allDay: false},
				{title: 'Kenneth Burts', start: new Date(y, m, d + 3, 9, 20),end: new Date(y, m, d + 3, 16, 40),allDay: false},
	      		{title: 'Vacaciones',start: new Date(y, m, d + 5),end: new Date(y, m, d + 20)}];
			this.eventSources.push(ramirezCal);
		}
		if(this.fernandez){
			var fernandezCal = 	     [ 
				{title: 'Jessie Blake', start: new Date(y, m, d + 3, 9, 0),end: new Date(y, m, d + 3, 9, 20),allDay: false,color:"#ee8505"},
				{title: 'Tom Umland', start: new Date(y, m, d + 3, 9, 20),end: new Date(y, m, d + 3, 9, 40),allDay: false,color:"#ee8505"},
				{title: 'Molly Truluck', start: new Date(y, m, d + 3, 9, 40),end: new Date(y, m, d + 3, 10, 0),allDay: false,color:"#ee8505"},
				{title: 'Merrilee Eoff', start: new Date(y, m, d + 3, 10, 0),end: new Date(y, m, d + 3, 10, 20),allDay: false,color:"#ee8505"}];
			this.eventSources.push(fernandezCal);
		}
		console.log(this.eventSources);
	}

    }
    angular.module('turnos.turnos').controller('TurnosCtrl',['TurnosSrv',turnosCtrl]);
})();