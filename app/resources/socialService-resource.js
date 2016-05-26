(function () {
    'use strict';
    function SocialServiceProvider() {
        function SocialServiceResource($resource, apiBase) {
            function transformDataSet(data){ 
                return angular.fromJson(data).results;
            }            
            var SocialService = $resource(apiBase + 'comun/socialService/:id/', {id: '@id'}, {
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

            return SocialService;
        }

        this.$get = ['$resource', 'apiBase', SocialServiceResource];
    }

    angular.module('turnos.resources').provider('SocialService', SocialServiceProvider);
})();