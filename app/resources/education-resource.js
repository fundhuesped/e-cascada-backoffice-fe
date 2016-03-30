(function () {
    'use strict';
    function EducationProvider() {
        function EducationResource($resource, apiBase) {
            var Education = $resource(apiBase + 'comun/educationType/:educationTypeId/', {educationTypeId: '@id'}, {
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

            Education.getUrlForObjectId = function getUrlForObjectId(id) {
                return apiBase + 'comun/educationType/' + id + '/';
            };

            return Education;
        }

        this.$get = ['$resource', 'apiBase', EducationResource];
    }

    angular.module('turnos.resources').provider('Education', EducationProvider);
})();