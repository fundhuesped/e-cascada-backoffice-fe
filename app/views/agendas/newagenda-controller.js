(function () {
  'use strict';
  /* jshint validthis: true */
  /*jshint latedef: nofunc */

  function newAgendaCtrl($loading, $uibModalInstance, $filter, Agenda, Profesional, Especialidad, Prestacion, toastr) {
    var vm = this;
    vm.close = close;
    vm.profesionales = [];
    vm.selectPrestacion = selectPrestacion;
    vm.changeDates = changeDates;
    vm.hoursFrom = 8;
    vm.minutesFrom = 0;
    vm.hoursTo = 20;
    vm.minutesTo = 0;

    vm.fromDateCalendarPopup = {
      opened: false,
      options: {
      }
    };
    vm.fromCalendarPopup = {
      opened: false,
      openCalendar : function(){
        this.opened = true;
      }
    };
    vm.toDateCalendarPopup = {
      opened: false,
      options: {
      },
      openCalendar : function(){
        this.opened = true;
      }
    };
    vm.daysStr = [
      {'index': 0, 'name': 'Lu', 'selected': false},
      {'index': 1, 'name': 'Ma', 'selected': false},
      {'index': 2, 'name': 'Mie', 'selected': false},
      {'index': 3, 'name': 'Jue', 'selected': false},
      {'index': 4, 'name': 'Vi', 'selected': false},
      {'index': 5, 'name': 'Sa', 'selected': false},
      {'index': 6, 'name': 'Do', 'selected': false}
    ];
    vm.showTable = false;
    activate();

    function activate() {
      vm.profesionales = Profesional.getActiveList(function(profesionales){
        vm.profesionales = profesionales;
      },displayComunicationError);
    }

    vm.confirm = function confirm() {
      if (vm.newAgendaForm.$valid) {
        vm.hideErrorMessage();
        $loading.start('app');
        var agenda = new Agenda();
        agenda.profesional = vm.selectedProfesional;
        agenda.prestacion = vm.selectedPrestacion;
        agenda.start = vm.hoursFrom + ':' + vm.minutesFrom;
        agenda.end = vm.hoursTo + ':' + vm.minutesTo;
        agenda.validFrom = moment(vm.agenda.validFrom).format('YYYY-MM-DD');
        agenda.validTo = moment(vm.agenda.validTo).format('YYYY-MM-DD');
        agenda.start = vm.agenda.start;
        agenda.end = vm.agenda.end;
        agenda.periods = vm.agenda.periods;
        agenda.status = 'Active';
        agenda.$save(function () {
            $loading.finish('app');
            $uibModalInstance.close('created');
          }, function () {
            displayComunicationError('app');
          }
        );
      } else {
        vm.errorMessage = 'Por favor revise el formulario';
      }
    };

    function close() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.loadAgenda = function loadAgenda() {
      vm.hideErrorMessage();
      if (vm.newAgendaForm.$valid) {
        var periodFrom = new Date();
        var periodTo = new Date();

        periodFrom.setHours(vm.hoursFrom);
        periodFrom.setMinutes(vm.minutesFrom);

        periodTo.setHours(vm.hoursTo);
        periodTo.setMinutes(vm.minutesTo);

        if (periodFrom >= periodTo) {
          vm.errorMessage = 'Hora desde debe ser inferior a hora hasta';
          return;
        }

        var diffMillis = periodTo - periodFrom;
        var durationMillis = vm.selectedPrestacion.duration * 60000;
        var countPeriods = diffMillis / durationMillis;

        var i, varTo;
        var varFrom = periodFrom;
        var period, periods = [];
        for (i = 0; i < countPeriods; i++) {
          varTo = new Date(varFrom.getTime() + vm.selectedPrestacion.duration * 60000);
          if (varTo > periodTo) {
            break;
          }
          var index = i + 1;
          var daysArray = [], day, j;
          for (j = 0; j < vm.daysStr.length; j++) {
            day = {
              'id': j,
              'index': j,
              'name': vm.daysStr[j].name,
              'selected': false
            };
            daysArray.push(day);
          }
          period = {
            'id': index,
            'start': $filter('date')(varFrom, 'HH:mm'),
            'end': $filter('date')(varTo, 'HH:mm'),
            'selected': false,
            'daysOfWeek': daysArray
          };
          periods.push(period);
          varFrom = varTo;
        }

        vm.agenda.start = $filter('date')(periodFrom, 'HH:mm');
        vm.agenda.end = $filter('date')(periodTo, 'HH:mm');
        vm.agenda.periods = periods;

        if (periods.length > 0) {
          vm.showTable = true;
        } else {
          vm.errorMessage = 'La combinación de horarios para la prestación seleccionada no posee rangos validos';
        }
      }
    };


    function selectPrestacion(){
      Agenda.getActiveList({page_size:1,ordering:'-validTo', profesional:vm.selectedProfesional.id, prestacion:vm.selectedPrestacion.id}, function(list){
        vm.agenda = {};
        if(list.length>0){
          vm.agenda.validFrom = moment(list[0].validTo).add(1,'month').startOf('month');
          vm.agenda.validTo = moment(vm.agenda.validFrom).endOf('month');
        }else{
          vm.agenda.validFrom = moment().add(1,'day').toDate();
          vm.agenda.validTo = moment().add(1,'month').endOf("month").toDate();;
        }
      },displayComunicationError);
    }

    vm.showErrorMessage = function showErrorMessage() {
      vm.errorMessage = 'Ocurio un error en la comunicación';
    };

    vm.hideErrorMessage = function hideErrorMessage() {
      vm.errorMessage = null;
    };

    vm.searchPrestaciones = function searchPrestaciones() {
      if (vm.selectedEspecialidad && vm.selectedProfesional) {
        vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id,profesional: vm.selectedProfesional.id});
      }
    };

    vm.searchEspecialidades = function searchEspecialidades() {
      vm.prestaciones = [];
      if (vm.selectedProfesional) {
        Especialidad.getActiveList({profesional: vm.selectedProfesional.id}, function(especialidades){
          vm.especialidades = especialidades;
        },displayComunicationError);
      }
    };


    vm.checkAllRow = function checkAllRow(period) {
      var i, j, selection;
      for (i = 0; i < vm.agenda.periods.length; i++) {
        selection = vm.agenda.periods[i];
        if (selection.id === period.id) {
          for (j = 0; j < vm.agenda.periods[i].daysOfWeek.length; j++) {
            vm.agenda.periods[i].daysOfWeek[j].selected = vm.agenda.periods[i].selected;
          }
        }
      }
    };

    vm.checkAllColumn = function checkAllColumn(day) {
      var i, j, selection;
      for (i = 0; i < vm.agenda.periods.length; i++) {
        for (j = 0; j < vm.agenda.periods[i].daysOfWeek.length; j++) {
          selection = vm.agenda.periods[i].daysOfWeek[j];
          if (selection.name.indexOf(day.name) == 0) {
            selection.selected = day.selected;
          }
        }
      }
    };

    vm.changeState = function changeState(day, period) {
      period.selected = false;
      var i, selection;
      for (i = 0; i < vm.daysStr.length; i++) {
        selection = vm.daysStr[i];
        if (selection.name.indexOf(day.day) == 0) {
          selection.selected = false;
          break;
        }
      }
    };

    function changeDates() {
      vm.showTable = false;
    }

    function displayComunicationError(loading){
      if(!toastr.active()){
        toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
      }
      if(loading){
        $loading.finish(loading);
      }
    }

  }

  angular.module('turnos.agendas').controller('NewAgendaCtrl', ['$loading', '$uibModalInstance', '$filter', 'Agenda', 'Profesional', 'Especialidad', 'Prestacion', 'toastr', newAgendaCtrl]);
})();
