(function () {
    'use strict';
    function CivilStatusProvider() {
        function CivilStatusResource($resource, apiBase) {
            var CivilStatus = $resource(apiBase + 'comun/civilStatusType/:civilStatusTypeId/', {civilStatusTypeId: '@id'}, {
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

            CivilStatus.getUrlForObjectId = function getUrlForObjectId(id) {
                return apiBase + 'comun/civilStatusType/' + id + '/';
            };

            return CivilStatus;
        }

        this.$get = ['$resource', 'apiBase', CivilStatusResource];
    }

    angular.module('turnos.resources').provider('CivilStatus', CivilStatusProvider);
})();