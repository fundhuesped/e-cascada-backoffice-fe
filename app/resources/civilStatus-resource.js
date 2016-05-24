(function () {
    'use strict';
    function CivilStatusProvider() {
        function CivilStatusResource($resource, apiBase) {
            function transformDataSet(data){ 
                      return angular.fromJson(data).results;
            }
            var CivilStatus = $resource(apiBase + 'comun/civilStatusType/:id/', {id: '@id'}, {
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

            CivilStatus.getUrlForObjectId = function getUrlForObjectId(id) {
                return apiBase + 'comun/civilStatusType/' + id + '/';
            };

            return CivilStatus;
        }

        this.$get = ['$resource', 'apiBase', CivilStatusResource];
    }

    angular.module('turnos.resources').provider('CivilStatus', CivilStatusProvider);
})();