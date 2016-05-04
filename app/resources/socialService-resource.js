(function () {
    'use strict';
    function SocialServiceProvider() {
        function SocialServiceResource($resource, apiBase) {
            function transformDataSet(data){ 
                return angular.fromJson(data).results;
            }            
            var SocialService = $resource(apiBase + 'comun/socialService/:socialServiceId/', {socialServiceId: '@id'}, {
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
            SocialService._getActiveList = SocialService.getActiveList;
            SocialService.getActiveList = function(callbackOK,callbackNOK){
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
            SocialService.getUrlForObjectId = function getUrlForObjectId(id) {
                return apiBase + 'comun/socialService/' + id + '/';
            };

            return SocialService;
        }

        this.$get = ['$resource', 'apiBase', SocialServiceResource];
    }

    angular.module('turnos.resources').provider('SocialService', SocialServiceProvider);
})();