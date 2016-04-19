(function () {
  'use strict';
  function AgendaProvider() {
    function AgendaResource($resource, apiBase) {
      var Agenda = $resource(apiBase + 'practicas/agenda/:agendaId/', {agendaId: '@id'}, {
        update: {
          method: 'PUT'
        },
        getActiveList: {
          method: 'GET',
          params: {status: 'Active'},
          isArray: true
        },
        getInactiveList: {
          method: 'GET',
          params: {status: 'Inactive'},
          isArray: true
        }
      });

      Agenda.getUrlForObjectId = function getUrlForObjectId(id) {
        return apiBase + 'practicas/agenda/' + id + '/';
      };

      return Agenda;
    }

    this.$get = ['$resource', 'apiBase', AgendaResource];
  }

  angular.module('turnos.resources').provider('Agenda', AgendaProvider);
})();
