function StockListCtrl($scope, $http, Chameleon, version) {

  var bugsense = new Bugsense({ apiKey: 'ffae2ef2', appversion: version });
  var POLL_ID = 'stock-update';
  var POLL_PERIOD = 30 * 60; // 30 minutes between updates.
  var API_URL = 'http://widgetgecko.com/api/stocks/';

  // This has to be done like this or it doesn't work.
  // I should probably figure out why at some point, but not right now.
  setTimeout(function () {
    Chameleon.init({ version: version });
  }, 1);

  $scope.stocks = [];
  $scope.symbols = [];
  $scope.isConfigured = false;

  $scope.$on('chameleon.load', startPolling);
  $scope.$on('chameleon.resume', startPolling);
  $scope.$on('chameleon.pause', stopPolling);
  $scope.$on('chameleon.connect', startPolling);
  $scope.$on('chameleon.disconnect', stopPolling);
  $scope.$on('chameleon.notchameleon', startPolling);
  $scope.$on('chameleon.configure', showSettings);
  $scope.$on('chameleon.refresh', function () {
    updateStocks();
  });

  // Very, very debug code.
  $scope.$on('chameleon.notchameleon', function () {
    $('body').addClass('not-chameleon');
  });

  function startPolling(event) {
    loadSymbols(function () {
      stopPolling();
      if ($scope.symbols.length === 0) {
        $scope.isConfigured = false;
        return;
      }
      $scope.isConfigured = true;
      updateStocks();
      $scope.$emit('chameleon.polling.start', {
        id: POLL_ID,
        interval: POLL_PERIOD,
        callback: function () {
          updateStocks();
        }
      });
    });
  }

  function stopPolling(event) {
    $scope.$emit('chameleon.polling.stop', {
      id: POLL_ID
    });
  }

  function updateStocks() {
    $scope.$emit('chameleon.showLoading');
    $http.get(API_URL + '?symbol=' + _.pluck($scope.symbols, 'name').join('|'))
      .success(function (data) {
        $scope.stocks = data;
        $scope.$emit('chameleon.invalidate');
        $scope.$emit('chameleon.hideLoading');
      });
  }

  function showSettings() {
    $scope.$emit('chameleon.promptHtml', {
      url: 'settings.html',
      callback: function () {
        startPolling();
      }
    });
  }

  $scope.showSettings = function () {
    showSettings();
  };

  function loadSymbols(callback) {
    $scope.$emit('chameleon.getData', function (data) {
      $scope.$apply(function () {
        if (data && data.symbols) {
          $scope.symbols = data.symbols;
        }
        callback();
      })
    });
  }
}

function StockSettingsCtrl($scope, Chameleon, version) {

  // This has to be done like this or it doesn't work.
  // I should probably figure out why at some point, but not right now.
  setTimeout(function () {
    Chameleon.init({ version: version });
    loadSymbols();
  }, 1);


  $scope.addSymbol = function() {
    $scope.symbols.push({ name: $scope.newSymbol.toUpperCase() });
    $scope.newSymbol = '';
    saveSymbols();
  }

  $scope.removeSymbol = function (symbol) {
    $scope.symbols = _.reject($scope.symbols, function (s) {
      return s.name === symbol.name;
    });
    saveSymbols();
  }

  $scope.close = function () {
    $scope.$emit('chameleon.close', true);
  }

  function saveSymbols() {
    $scope.$emit('chameleon.getData', function (data) {
      if (! data) {
        data = {};
      }
      data.symbols = $scope.symbols;
      $scope.$emit('chameleon.saveData', data);
    });
  }

  function loadSymbols() {
    $scope.$emit('chameleon.getData', function (data) {
      $scope.$apply(function () {
        if (data && data.symbols) {
          $scope.symbols = data.symbols;
        }
      })
    });
  }

  $scope.symbols = [];
}