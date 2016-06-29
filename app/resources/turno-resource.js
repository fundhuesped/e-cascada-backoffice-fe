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

      return Turno;
    }

    this.$get = ['$resource', 'apiBase', TurnoResource];
  }
})();
