(function () {
  'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    angular
      .module('turnos.resources')
      .provider('TurnoSlot', TurnoSlotProvider);

  function TurnoSlotProvider() {
    function TurnoSlotResource($resource, apiBase) {
        function transformDataSet(data, headersGetter, status){
          if(status > 0 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var TurnoSlot = $resource(apiBase + 'practicas/turnoSlot/:id/', {id: '@id'}, {
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
        
      TurnoSlot.state = {
        available:'Available',
        ocuppied:'Occupied',
        conflict:'Conflict',
        deleted:'Deleted',
      };

      return TurnoSlot;
    }

    this.$get = ['$resource', 'apiBase', TurnoSlotResource];
  }
})();
