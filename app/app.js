import angular from 'angular'
import ngRoute from 'angular-route'
import angularUIRouter from 'angular-ui-router';
import cars from 'cars/cars'
import apolloServ from 'apollo/apollo-wrapper-service-module'
import view2 from 'view2/view2'
import version from 'components/version/version'

var myApp = angular
  .module('myApp', [
    ngRoute,
      angularUIRouter,
    version.name,
    cars.name,
      apolloServ.name,
    view2.name,
  ])
  .config(($locationProvider, $stateProvider, $urlRouterProvider) => {
    $locationProvider.hashPrefix('!')
      $urlRouterProvider.otherwise('/cars');
  })

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document.body, [myApp.name])
  })
