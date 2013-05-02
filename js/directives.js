angular.module('widget.directives', [])

  .directive('chameleonConfigMessage', function () {
    return {
      template: '<div class="chameleon-widget-message"><div class="chameleon-widget-message-block"><div class="widget-config"><div class="widget-config-btn" style="background-image: url(http://chameleon.teknision.com/widgets/common/images/config_widget_btn.png);"></div><div class="config-title"><p>Widget Not Configured</p></div><p class="config-message">Tap here to configure it now.</p></div></div>',
      restrict: 'E'
    }
  });