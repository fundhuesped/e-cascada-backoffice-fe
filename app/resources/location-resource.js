(function () {
    'use strict';
    function LocationProvider() {
        function LocationResource($resource, apiBase) {
            var Location = $resource(apiBase + 'comun/location/:locationId/', {locationId: '@id'}, {
                update: {
                    method: 'PUT'
                },
                getActiveList: {
                    method: 'GET',
                    params: {status: 'Active'},
                    isArray: true
                },
                getInactiveList: {
                    method: 'GET',
                    params: {status: 'Inactive'},
                    isArray: true
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