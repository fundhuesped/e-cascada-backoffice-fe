(function () {
  'use strict';
  function LeaveProvider() {
    function LeaveResource($resource, apiBase) {
        function transformDataSet(data){ 
                  return angular.fromJson(data).results;
        }
        var Leave = $resource(apiBase + 'practicas/ausencia/:leaveId/', {leaveId: '@id'}, {
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

      return Leave;
    }

    this.$get = ['$resource', 'apiBase', LeaveResource];
  }

  angular.module('turnos.resources').provider('Leave', LeaveProvider);
})();
