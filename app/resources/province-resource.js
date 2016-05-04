(function () {
    'use strict';
    function ProvinceProvider() {
        function ProvinceResource($resource, apiBase) {
            function transformDataSet(data){ 
                return angular.fromJson(data).results;
            }
            var Province = $resource(apiBase + 'comun/province/:provinceId/', {provinceId: '@id'}, {
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
            Province._getActiveList = Province.getActiveList;
            Province.getActiveList = function(callbackOK,callbackNOK){
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

            Province.getUrlForObjectId = function getUrlForObjectId(id) {
                return apiBase + 'comun/province/' + id + '/';
            };

            return Province;
        }

        this.$get = ['$resource', 'apiBase', ProvinceResource];
    }

    angular.module('turnos.resources').provider('Province', ProvinceProvider);
})();