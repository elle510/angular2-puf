System.register("app2.component", ["angular2/core"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var core_1;
  var AppComponent;
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }],
    execute: function() {
      AppComponent = (function() {
        function AppComponent() {
          this.name = 'Ahn Hyung-Ro';
        }
        AppComponent = __decorate([core_1.Component({
          selector: 'my-app',
          template: '<h1>My First Angular 2 App</h1>{{name}}'
        }), __metadata('design:paramtypes', [])], AppComponent);
        return AppComponent;
      })();
      exports_1("AppComponent", AppComponent);
    }
  };
});

System.register("boot2", ["angular2/platform/browser", "./app2.component"], function(exports_1) {
  var browser_1,
      app2_component_1;
  return {
    setters: [function(browser_1_1) {
      browser_1 = browser_1_1;
    }, function(app2_component_1_1) {
      app2_component_1 = app2_component_1_1;
    }],
    execute: function() {
      browser_1.bootstrap(app2_component_1.AppComponent);
    }
  };
});

//# sourceMappingURL=puf.js.map