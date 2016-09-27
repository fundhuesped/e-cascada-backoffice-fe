(function () {
  'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    angular
      .module('turnos.resources')
      .provider('Turno', TurnoProvider);

  function TurnoProvider() {
    function TurnoResource($resource, apiBase) {
        function transformDataSet(data, headersGetter, status){
          if(status > 0 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var Turno = $resource(apiBase + 'practicas/turno/:id/', {id: '@id'}, {
        update: {
          method: 'PUT'
        },
        getActiveList: {
          method: 'GET',
          params: {status: 'Active'},
          isArray: true,
          transformResponse: transformDataSet
        },
        getFullActiveList: {
          method: 'GET',
          params: {status: 'Active', all: true},
          isArray: true
        },
        getInactiveList: {
          method: 'GET',
          params: {status: 'Inactive'},
          isArray: true,
          transformResponse: transformDataSet
        },
        query:{
            method: 'GET',
            isArray: true,
            transformResponse: transformDataSet
        },
        queryPaginated:{
           method: 'GET',
           isArray: false
        },
        getPaginatedActiveList:{
          method: 'GET',
          params: {status: 'Active'},
          isArray: false
        },
        getCancelados:{
          url: apiBase + 'practicas/turno/cancelado/',
          method: 'GET',
          isArray: true,
          transformResponse: transformDataSet
        }
      });

      Turno.state = {
        initial:'Initial',
        present:'Present',
        absent:'Absent',
        served:'Served',
        canceled:'Canceled',
      };
      Turno.cancelationReason = {
        absent:'ProfesionalAbsent',
        agendaChanged:'AgendaChanged',
        pacientRequest:'PacientRequest',
        other:'Other'
      };
      Turno.cancelationReasonDescription = {
        ProfesionalAbsent:'Ausencia del profesional',
        AgendaChanged:'Modificación de agenda',
        PacientRequest:'Pedido del paciente',
        Other:'Otros'
      };

      return Turno;
    }

    this.$get = ['$resource', 'apiBase', TurnoResource];
  }
})();
