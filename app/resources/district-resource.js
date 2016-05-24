(function () {
    'use strict';
    function DistrictProvider() {
        function DistrictResource($resource, apiBase) {
            function transformDataSet(data){ 
                      return angular.fromJson(data).results;
            }
            var District = $resource(apiBase + 'comun/district/:id/', {id: '@id'}, {
                update: {
                    method: 'PUT'
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
            District._getActiveList = District.getActiveList;
            District.getActiveList = function(callbackOK,callbackNOK){
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

            District.getUrlForObjectId = function getUrlForObjectId(id) {
                return apiBase + 'comun/district/' + id + '/';
            };

            return District;
        }

        this.$get = ['$resource', 'apiBase', DistrictResource];
    }

    angular.module('turnos.resources').provider('District', DistrictProvider);
})();