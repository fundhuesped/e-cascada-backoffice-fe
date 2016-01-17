(function(){
    'use strict';
    
    function turnosCtrl (TurnosSrv) {
    	 /* config object */
    this.eventSources = [TurnosSrv.events];
	    this.calendarConfig = 
	      {
	        height: 450,
	        editable: true,
	        header:{
	          left: 'month agendaWeek agendaDay',
	          center: 'title',
	          right: 'today prev,next'
	        },
	    };
    }
    angular.module('turnos.turnos').controller('TurnosCtrl',['TurnosSrv',turnosCtrl]);
})();