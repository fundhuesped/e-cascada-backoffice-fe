(function () {
  'use strict';
  function LeaveProvider() {
    function LeaveResource($resource, apiBase) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var Leave = $resource(apiBase + 'practicas/ausencia/:id/', {id: '@id'}, {
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
        getPaginatedActiveList:{
          method: 'GET',
          params:{status:'Active'},
          isArray: false
        }
      });

      Leave.status = {
        active:'Active',
        inactive:'Inactive'
      };

      return Leave;
    }

    this.$get = ['$resource', 'apiBase', LeaveResource];
  }

  angular.module('turnos.resources').provider('Leave', LeaveProvider);
})();
