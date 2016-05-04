(function () {
  'use strict';
  function TurnoProvider() {
    function TurnoResource($resource, apiBase) {
      var Turno = $resource(apiBase + 'practicas/turno/:turnoId/', {turnoId: '@id'}, {
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
        },
        query:{
            method: 'GET',
            params:{status:'Inactive'},
            isArray: true,
            transformResponse: function(data){ 
              var tmp = angular.fromJson(data);
                return tmp.results;
            }
        }
      });

      Turno.getUrlForObjectId = function getUrlForObjectId(id) {
        return apiBase + 'practicas/turno/' + id + '/';
      };

      return Turno;
    }

    this.$get = ['$resource', 'apiBase', TurnoResource];
  }

  angular.module('turnos.resources').provider('Turno', TurnoProvider);
})();
