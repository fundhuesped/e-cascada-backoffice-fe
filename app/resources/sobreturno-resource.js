(function () {
  'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    angular
      .module('turnos.resources')
      .provider('Sobreturno', SobreturnoProvider);

  function SobreturnoProvider() {
    function SobreturnoResource($resource, apiBase) {
        var Sobreturno = $resource(apiBase + 'practicas/sobreturno/', {}, {});
      return Sobreturno;
    }

    this.$get = ['$resource', 'apiBase', SobreturnoResource];
  }
})();
