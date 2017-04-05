import gql from 'graphql-tag';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import * as http from 'http';
// import ApolloWrapperService from 'apollo/apollo-wrapper-service'

export class CarsController {

    constructor($scope, ApolloWrapperService) {
        this.scope= $scope
        this.ApolloWrapperService= ApolloWrapperService;
        this.car = {};
        this.cars = [];
        this.fetchCarsList();
        this.startSubscriptions();
    }

    fetchCarsList() {
        this.ApolloWrapperService.getAllCars().then(result => {
            this.addAllQueryResults(result);
            this.scope.$apply();
        });
    };

    startSubscriptions() {
        this.ApolloWrapperService.subscribeToCars()
            .subscribe({
                next(data) {
                    console.log('Got data- ', data);
                    console.log('Pushing to car list...');
                    this.cars.push(data);
                    this.scope.$apply();
                },
                error(err) {
                    console.log('Error- ', err);
                }
            });
    }

    addAllQueryResults(result) {
        this.cars = {};
        let immutableCars = result.data.car;
        this.cars = JSON.parse( JSON.stringify( immutableCars ));
    }

    showAddForm (){
        this.addFormShow = true;
    }
    hideAddForm (){
        this.addFormShow = false;
        this.editFormShow = false;
    }

    showEditForm (car){
        this.editFormShow = true;
        this.editedCarName = car.name;
        this.editedCarId = car.id;
    }

    addNewCar (car) {
        this.ApolloWrapperService.addNewCar(this.car).then(result => {
            this.fetchCarsList();
            this.car.name = ''
            this.addFormShow = false;
        });
    };

    editCar (car) {
        car.id = this.editedCarId;
        console.log(car);
        this.ApolloWrapperService.editCar(this.editedCarName, this.car.name).then(result => {
            this.fetchCarsList();
            this.car.name = ''
            this.addFormShow = false;
        });
        this.editFormShow = false;
    };

    removeLogic(name) {
        http.delete("http://localhost:8080/cars/removeCar/" + name).success(function (res) {
            console.log(res)
            this.fetchCarsList();
        });
    }

    removeCar (name) {
        this.ApolloWrapperService.deleteCar(name)
            .then(result => {
                console.log("After delete - ", name)
            })
        this.car.name = '';
    }
};