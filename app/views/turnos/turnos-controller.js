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
		if(this.infecto){
			var infectocal = 	     [ 
				{title: 'Hanna Blade', start: new Date(y, m, d + 3, 9, 0),end: new Date(y, m, d + 3, 16, 20),allDay: false,color:'#D8C358'},
				{title: 'Kenneth Burts', start: new Date(y, m, d + 3, 9, 20),end: new Date(y, m, d + 3, 16, 40),allDay: false,color:'#D8C358'},
				{title: 'Lola Burns', start: new Date(y, m, d + 3, 9, 20),end: new Date(y, m, d + 3, 16, 40),allDay: false,color:'#D8C358'}]
			this.eventSources.push(infectocal);
		}
		if(this.gineco){
			var  ginecocal = 	     [ 
				{title: 'Hanna Blade', start: new Date(y, m, d + 3, 9, 0),end: new Date(y, m, d + 3, 16, 20),allDay: false,color:'#6D0839'}]
			this.eventSources.push(ginecocal);			
		}
		console.log(this.eventSources);
	}



	this.listMedicos = [
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

	this.medicos = function medicos(){
		var tmpMedicos = [];
		console.log(this.medicosSearch);
		if(this.medicosSearch){
			for (var i = this.listMedicos.length - 1; i >= 0; i--) {
				if(this.listMedicos[i].name.search(this.medicosSearch)!==-1){
					tmpMedicos.push(this.listMedicos[i]);
				}
			}
			return tmpMedicos;
		}else{
			return this.listMedicos;
		}
	};

    }
    angular.module('turnos.turnos').controller('TurnosCtrl',['TurnosSrv',turnosCtrl]);
})();