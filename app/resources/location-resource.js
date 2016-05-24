(function () {
    'use strict';
    function LocationProvider() {
        function LocationResource($resource, apiBase) {
            function transformDataSet(data){ 
                      return angular.fromJson(data).results;
            }
            var Location = $resource(apiBase + 'comun/location/:id/', {id: '@id'}, {
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

            Location.getUrlForObjectId = function getUrlForObjectId(id) {
                return apiBase + 'comun/location/' + id + '/';
            };

            return Location;
        }

        this.$get = ['$resource', 'apiBase', LocationResource];
    }

    angular.module('turnos.resources').provider('Location', LocationProvider);
})();