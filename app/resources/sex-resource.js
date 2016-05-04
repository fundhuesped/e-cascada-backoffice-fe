(function() {
    'use strict';
    function SexProvider() {
      function SexResource($resource,apiBase) {
        function transformDataSet(data){ 
          return angular.fromJson(data).results;
        }        
        var Sex = $resource(apiBase + 'comun/sexType/:sexTypeId/',{sexTypeId:'@id'},{
          update: {
            method:'PUT'
          },
          getActiveList:{
              method: 'GET',
              params:{status:'Active'},
              isArray: true,
              transformResponse: transformDataSet
          },
          getInactiveList:{
              method: 'GET',
              params:{status:'Inactive'},
              isArray: true,
              transformResponse: transformDataSet
          },
          query:{
              method: 'GET',
              isArray: true,
              transformResponse: transformDataSet
          }
        });
        Sex._getActiveList = Sex.getActiveList;
        Sex.getActiveList = function(callbackOK,callbackNOK){
          var promise = this._getActiveList(function(data){
            promise = data.results;
            if(callbackOK){
              callbackOK(data.results);
            }
          },function(error){
            if(callbackNOK){
              callbackNOK(error);
            }
          });
          return promise;
        };
        Sex.getUrlForObjectId = function getUrlForObjectId(id){
          return apiBase + 'comun/sexType/' + id + '/';
        };

        return Sex;
    	}
      this.$get = ['$resource','apiBase',SexResource];
    }
  angular.module('turnos.resources').provider('Sex',SexProvider);
})();