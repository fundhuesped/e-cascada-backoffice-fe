(function () {
  'use strict';
  /* jshint validthis: true */
  /*jshint latedef: nofunc */
  function newAgendaCtrl($loading, $uibModalInstance, $filter, Agenda, Profesional, Especialidad, Prestacion) {
    var vm = this;

    this.daysStr = [{
      'index': 0,
      'name': 'Lu',
      'selected': false
      },
      {
        'index': 1,
        'name': 'Ma',
        'selected': false
      },
      {
        'index': 2,
        'name': 'Mie',
        'selected': false
      },
      {
        'index': 3,
        'name': 'Jue',
        'selected': false
      },
      {
        'index': 4,
        'name': 'Vi',
        'selected': false
      },
      {
        'index': 5,
        'name': 'Sa',
        'selected': false
      },
      {
        'index': 6,
        'name': 'Do',
        'selected': false
      }
    ];
    this.showTable = false;
    this.profesionales = null;
    this.currentDate = new Date();
    this.endMonth = new Date();
    this.endMonth.setDate(1);
    this.endMonth.setMonth(this.currentDate.getMonth() + 2);
    this.endMonth = new Date(this.endMonth.getTime() - 86400000);
    this.hoursFrom = 8;
    this.minutesFrom = 0;
    this.hoursTo = 17;
    this.minutesTo = 0;
    this.agenda = {
      validFrom: this.currentDate,
      validTo: this.endMonth
    };

    this.confirm = function confirm() {
      if (this.newAgendaForm.$valid) {
        this.hideErrorMessage();
        $loading.start('app');
        var agenda = new Agenda();
        agenda.profesional = this.selectedProfesional;
        agenda.prestacion = this.selectedPrestacion;
        agenda.start = this.hoursFrom + ':' + this.minutesFrom
        agenda.end = this.hoursTo + ':' + this.minutesTo
        agenda.validFrom = $filter('date')(this.agenda.validFrom, 'yyyy-MM-dd');
        agenda.validTo = $filter('date')(this.agenda.validTo, 'yyyy-MM-dd');
        agenda.start = this.agenda.start;
        agenda.end = this.agenda.end;
        agenda.periods = this.agenda.periods;
        agenda.status = 'Active';
        agenda.$save(function () {
            $loading.finish('app');
            $uibModalInstance.close('created');
          }, function (error) {
            $loading.finish('app');
            this.errorMessage = error.status + ' - ' + error.statusText;
          }.bind(this)
        );
      } else {
        this.errorMessage = 'Por favor revise el formulario';
      }
    };

    this.close = function close() {
      $uibModalInstance.dismiss('cancel');
    };

    this.loadAgenda = function loadAgenda() {
      this.hideErrorMessage();
      if (this.newAgendaForm.$valid) {
        var periodFrom = new Date();
        var periodTo = new Date();

        periodFrom.setHours(this.hoursFrom);
        periodFrom.setMinutes(this.minutesFrom);

        periodTo.setHours(this.hoursTo);
        periodTo.setMinutes(this.minutesTo);

        if (periodFrom >= periodTo) {
          this.errorMessage = 'Hora desde debe ser inferior a hora hasta';
          return;
        }

        var diffMillis = periodTo - periodFrom;
        var durationMillis = this.selectedPrestacion.duration * 60000;
        var countPeriods = diffMillis / durationMillis;

        var i, varTo;
        var varFrom = periodFrom;
        var period, periods = [];
        for (i = 0; i < countPeriods; i++) {
          varTo = new Date(varFrom.getTime() + this.selectedPrestacion.duration * 60000);
          if (varTo > periodTo) {
            break;
          }
          var index = i + 1;
          var daysArray = [], day, j;
          for (j = 0; j < this.daysStr.length; j++) {
            day = {
              'id': j+1,
              'index': j,
              'name': this.daysStr[j].name,
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

        this.agenda.start = $filter('date')(periodFrom, 'HH:mm');
        this.agenda.end = $filter('date')(periodTo, 'HH:mm');
        this.agenda.periods = periods;

        if (periods.length > 0) {
          this.showTable = true;
        } else {
          this.errorMessage = 'La combinación de horarios para la prestación seleccionada no posee rangos validos';
        }
      }
    };

    this.showErrorMessage = function showErrorMessage() {
      this.errorMessage = 'Ocurio un error en la comunicación';
    };

    this.hideErrorMessage = function hideErrorMessage() {
      this.errorMessage = null;
    };

    this.searchPrestaciones = function searchPrestaciones() {
      this.prestaciones = [];

      if (this.selectedEspecialidad && this.selectedProfesional) {
        vm.prestaciones = Prestacion.query({especialidad: vm.selectedEspecialidad.id,profesional: vm.selectedProfesional.id, status: 'Active'});
  /*      var i, j, exist;
        for (i = 0; i < this.selectedProfesional.prestaciones.length; i++) {
          if (this.selectedProfesional.prestaciones[i].especialidad.id === this.selectedEspecialidad.id) {
            exist = false;
            for (j = 0; j < this.prestaciones.length; j++) {
              if (this.prestaciones[j].id === this.selectedProfesional.prestaciones[i].id) {
                exist = true;
                break;
              }
            }
            if (!exist) {
              this.prestaciones.push(this.selectedProfesional.prestaciones[i]);
            }
          }
        }*/
      }
    };

    this.searchEspecialidades = function searchEspecialidades() {
      this.especialidades = [];
      if (this.selectedProfesional) {
        vm.especialidades = Especialidad.query({profesional: vm.selectedProfesional.id, status: 'Active'});
/*        var i, j, exist;
        for (i = 0; i < this.selectedProfesional.prestaciones.length; i++) {
          exist = false;
          for (j = 0; j < this.especialidades.length; j++) {
            if (this.especialidades[j].id === this.selectedProfesional.prestaciones[i].especialidad.id) {
              exist = true;
              break;
            }
          }
          if (!exist) {
            this.especialidades.push(this.selectedProfesional.prestaciones[i].especialidad);
          }
        }*/
      }
    };

    this.checkAllRow = function checkAllRow(period) {
      var i, j, selection;
      for (i = 0; i < this.agenda.periods.length; i++) {
        selection = this.agenda.periods[i];
        if (selection.id === period.id) {
          for (j = 0; j < this.agenda.periods[i].daysOfWeek.length; j++) {
            this.agenda.periods[i].daysOfWeek[j].selected = this.agenda.periods[i].selected;
          }
        }
      }
    };

    this.checkAllColumn = function checkAllColumn(day) {
      var i, j, selection;
      for (i = 0; i < this.agenda.periods.length; i++) {
        for (j = 0; j < this.agenda.periods[i].daysOfWeek.length; j++) {
          selection = this.agenda.periods[i].daysOfWeek[j];
          if (selection.name.indexOf(day.name) == 0) {
            selection.selected = day.selected;
          }
        }
      }
    };

    this.changeState = function changeState(day, period) {
      period.selected = false;
      var i, selection;
      for (i = 0; i < this.daysStr.length; i++) {
        selection = this.daysStr[i];
        if (selection.name.indexOf(day.day) == 0) {
          selection.selected = false;
          break;
        }
      }
    };

    this.init = function init() {
      this.profesionales = Profesional.getActiveList();
    };

    this.init();
  }

  angular.module('turnos.agendas').controller('NewAgendaCtrl', ['$loading', '$uibModalInstance', '$filter', 'Agenda', 'Profesional', 'Especialidad', 'Prestacion', newAgendaCtrl]);
})();
