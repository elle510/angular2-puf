import {Component} from 'angular2/core';
console.log(Component);

@Component({
    selector: 'my-app',
    template: '<h1>My First Angular 2 App</h1>{{name}}'
})
export class AppComponent {
	name: string = 'Ahn Hyung-Ro';
	constructor() {
		//this.name = 'Max';
	}
}