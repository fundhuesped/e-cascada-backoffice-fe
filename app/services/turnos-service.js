(function(){
    'use strict';
    function TurnosService(){
	    var date = new Date();
    	var d = date.getDate();
    	var m = date.getMonth();
    	var y = date.getFullYear();
        this.events = [
	      {title: 'All Day Event', start: '2016-01-01',end: '2016-01-02'},
	      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
	      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
	      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
	      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
	      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    	];
    };
    angular.module('turnos.services').service('TurnosSrv', [ TurnosService]);
})();