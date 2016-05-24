(function () {
  'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    angular
      .module('turnos.resources')
      .provider('Turno', TurnoProvider);

  function TurnoProvider() {
    function TurnoResource($resource, apiBase) {
        function transformDataSet(data){ 
                  return angular.fromJson(data).results;
        }
        var Turno = $resource(apiBase + 'practicas/turno/:turnoId/', {turnoId: '@id'}, {
        update: {
          method: 'PUT'
        },
        getActiveList: {
          method: 'GET',
          params: {status: 'Active'},
          isArray: true,
          transformResponse: transformDataSet
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
        }
      });

      Turno.getUrlForObjectId = function getUrlForObjectId(id) {
        return apiBase + 'practicas/turno/' + id + '/';
      };

      return Turno;
    }

    this.$get = ['$resource', 'apiBase', TurnoResource];
  }

})();
