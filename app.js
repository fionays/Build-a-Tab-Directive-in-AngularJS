
/**
 * https://github.com/angular-ui/bootstrap/tree/master/src/tabs
 */

'use strict';
(function(window) {
  angular.module('app', []);

  angular.module('app')
  .directive('tab', Tab)
  .directive('tabset', Tabset);

  function Tab() {
    return {
      restrict: 'E',
      transclude: true,
      template: '<div role="tabpanel" ng-transclude ng-show="active"></div>',
      require: '^tabset',
      scope: {
        heading: '@'
      }, //this prevents any data leak from this directive into parent, vice also
      link: function(scope, element, attrs, tabsetCtrl){
        // Add a property to the scope, to indicate the active state of tab
        scope.active = false;

        // Add a property to disable the tag
        scope.disabled = false;

        // Add a observer for the 'disable' attribute, call the callback whenever it changes.
        if (attrs.disable) {
          attrs.$observe('disable', function(value) {
            // set the disabled property to true if the attribute is truty
            scope.disabled = (value !== 'false');
          });
        }
        // Tab will be initialized when page loading.
        // Then each tab will register themself to the tabset.

        // Now any property bound to the scope in the tab directive will also be
        // accessible by tabSet directive
        tabsetCtrl.addTab(scope);
      }
    };
  }

  function Tabset() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        type: '@',
        vertical: '@',
        justified: '@'
      },
      templateUrl: 'tabset.html',
      bindToController: true, // all properties in the scope property will be bound to the controller
      controllerAs: 'tabset',
      controller: function() {
        var self = this; // allow us to refer to the controller itself within the closures.
        self.tabs = [];

        self.classes = {};

        if (self.type === 'pills') {
          self.classes['nav-pills'] = true;
        }else {
          self.classes['nav-tabs'] = true;
        }

        if (self.justified) {
          self.classes['nav-justified'] = true;
        }

        if (self.vertical) {
          self.classes['nav-stacked'] = true;
        }

        self.select = function(selectedTab) {
          // Disbale the disabled tags
          if (selectedTab.disabled) {return}
          // set other active tags to false
          angular.forEach(self.tabs, function(tab) {
            if (tab.active && tab !== selectedTab) {
              tab.active = false;
            }
          });

          // Set the selectedTab active
          selectedTab.active = true;
        }
        // registering each tab to tabset. The tabset will be responsible for deciding each tab is active
        // as well as providing an interface to select tabs.
        self.addTab = function(tab) {
          self.tabs.push(tab);

          // Automatically make the first tab active.
          // When the first tab get registered, display it.
          if (self.tabs.length === 1) {
            tab.active = true;
          }
        };
      }
    };
  }
})(window);
