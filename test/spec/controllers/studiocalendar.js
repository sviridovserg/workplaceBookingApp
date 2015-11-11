'use strict';

describe('Controller: StudiocalendarCtrl', function () {

  // load the controller's module
  beforeEach(module('designerWorkplaceApp'));

  var StudiocalendarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StudiocalendarCtrl = $controller('StudiocalendarCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
