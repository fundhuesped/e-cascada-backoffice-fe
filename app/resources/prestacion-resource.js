(function() {
    'use strict';
    function PrestacionProvider() {
      function PrestacionResource($resource,apiBase) {
        var Prestacion = $resource(apiBase + 'practicas/prestacion/:prestacionId/',{prestacionId:'@id'},{
          update: {
            method:'PUT'
          },
          getActiveList:{
            method: 'GET',
            params:{status:'Active'},
            isArray: true
          },
          getInactiveList:{
            method: 'GET',
            params:{status:'Inactive'},
            isArray: true
          }
        });

        Object.defineProperty(Prestacion.prototype,
            'durationHours', {
            enumerable: true,
            configurable: false,
            get: function () {
              var tempVal = Math.floor(this.duration/60)|0;
              return tempVal;
            },
            set: function (value) {
                this.duration = this.durationMinutes + value *60;
            }
        });

        Object.defineProperty(Prestacion.prototype,
            'durationMinutes', {
            enumerable: true,
            configurable: false,
            get: function () {
              return Math.floor(this.duration%60)|0;
            },
            set: function (value) {
              this.duration = this.durationHours*60 + value;
            }
        });
        return Prestacion;


        
    	}
      this.$get = ['$resource','apiBase',PrestacionResource];
    }
  angular.module('turnos.resources').provider('Prestacion',PrestacionProvider);
})();