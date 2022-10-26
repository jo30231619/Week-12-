//We are going to to create afew different classes that represent our locations and our restaurants and we are going to create a class for a restaurant service
//that is going to enable us to send the HTTP request of the Ajax request to the pre existing API
//and we are also going to create a class that is also going to help us manage the DOM. We are going to clear out the dom every time, 
// or at least the element that we put all the restaurants in the app div. and then repopulate the restaurants so its more clean so to start

class Restaurant { //we are creating a class named restaurant
    constructor(name) { // we need to know what the name of our restaurant is
        this.name = name;
        this.locations = []; //each restaurant is going to going to have a bunch of different of locations
    }

    addLocation(state, city) {  //this method will allow us to add more locations to the array this.locations
        this.locations.push(new Location(state, city));
    }
}

class Location {
    constructor(state, city) {  //the location is going to have a state and a city, the restaurants location 
        this.state = state;
        this.city = city;
    }
}

class RestaurantService {  //create a class called restaurant service
    static url = 'https://6355b2d8da523ceadc05ff35.mockapi.io/Promine_Tech_API/restaurant';

    static getAllRestaurants() { //lets create a few different methods to send the request, we want one for getting our restuarants, for getting all the restuarants, getting a specific restaurant, creating a restaurant, updating a restaurant, and deleting a restaurant, all of our crud operations
        return $.get(this.url);  //This is not going to take any parameters because its going to return all the restaurants im going to return with jquery all the restaurants from this url
    }

    static getRestaurant(id) { //lets write a method to get a specific restaurant 
        return $.get(this.url + `/${id}`);   //this will take an id from a specific restaurant we want to retrieve from the API, and then we are going to concatenate a string to add the ID
    }

    static createRestaurant(restaurant) {   //if we want to create a restaurant we use the post, and this is going to take a restaurant, and when I mean restaurant I mean an instance of our restaurant class, so its going to take something that has a name and then an array
        return $.post(this.url, restaurant);  //We want to post it to the API, and we are going to pass in this URL and the house that was passed in as the http payload. and the reason we are returning all these is because we are going to use these methods somewhere and wherever we use these methods, we want to be able to handle the promise that comes back, that will make this restaurant service reusable, if there were to grow into a larger application, we could use this restaurant service anywhere we needed to access the calls to our restaurants API
    }

    static updateRestaurant(restaurant) {   //Is going to take a restaurant, the restaurant that is going to be updated
        return $.ajax({    //for the update we have to use the AJAX method, this is going to take a few different parameters, This takes just one parameter and its an object and the object has multple field that make up the data needed to send this request
            url: this.url + `/${restaurant._id}`, //the first field is going to be a url and we are going to go ahead and concatenate the ID of the restaurant that was passed in so we are updating a restaurant, we are going to the grab the ID from that restaurant to tell the API which restaurant we want to update in the database. it is underscore ID because thats the value that the database will automatically create for our restaurant. We are using a mongo database here
            dataType: 'json',
            data: JSON.stringify(restaurant), //What is the payload? stringify is going to take an object and its going to convert it into a JSON string for sending it through the HTTP request and that JSON object or that object that you want to convert into JSON is the restaurant that is passed in as the parameter
            contentType: 'application/json',
            type: 'PUT'  //what http verb is this request and the type put request
        });
    }

    static deleteRestaurant(id) {  // all we need here is the id, we dont need the actual restaurant, we just need the ID to tell the API because thats the way the API works as it takes an ID, this is the restaurant we want to delete whatever restaurant matches this id, go ahead and delete it 
        return $.ajax({    // we are going to use our Ajax method on our jquery object 
            url: this.url + `/${id}`, 
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static restaurants; //restaurants will represent all the restaurants in this class

    static getAllRestaurants() {  //this method is going to call the getAllRestaurants method inside of our service and then its going to render them to the DOM
        RestaurantService.getAllRestaurants().then(restaurants => this.render(restaurants));   //this returns a promise and what we get back we are going to call restaurants and we are going to because this takes a call back, we are going to pass this into this.render and that is what is going to manage the DOM, what rerenders the DOM
    }

    static createRestaurant(name) {
        RestaurantService.createRestaurant(new Restaurant(name))
            .then(() => {
                return RestaurantService.getAllRestaurants();
            })
            .then((restaurants) => this.render(restaurants));
    }

    static deleteRestaurant(id) {
        RestaurantService.deleteRestaurant(id)
            .then(() => {
                return RestaurantService.getAllRestaurants();
            })
            .then((restaurants) => this.render(restaurants));
        

    }

    static addLocation(id) {
        for (let restaurant of this.restaurants) {
            if (restaurant._id == id) {
                restaurant.locations.push(new Location($(`#${restaurant._id}-location-state`).val(), $(`#${restaurant._id}-location-city`).val()));
                RestaurantService.updateRestaurant(restaurant)
                    .then(() => {
                        return RestaurantService.getAllRestaurants
                    })
                    .then((restaurants) => this.render(restaurants));
            }
        }
    }

    static deleteLocation(restaurantId, locationId) {
        for (let restaurant of this.restaurants) {
            if (restaurant._id == restaurantId) {
                for (let location of restaurant.locations) {
                    if (location._id == locationId) {
                        restaurant.locations.splice(restaurant.locations.indexOf(location), 1);
                        RestaurantService.updateRestaurant(restaurant)
                        .then(() => {
                            return RestaurantService.getAllRestaurants();
                        })
                        .then((restaurants) => this.render(restaurants));
                    }
                }
            }
        }
    }

    static addLocation(id) {
        for (let restaurant of this.restaurants) {
            if (restaurant._id == id) {
                restaurant.locations.push(new Location($(`#${restaurant._id}-location-state`).val(), $(`#${restaurant._id}-location-city`).val()));
                RestaurantService.updateRestaurant(restaurant) 
                    .then(() => {
                        return RestaurantService.getAllRestaurants();
                    })
                    .then((restaurants) => this.render(restaurants));
            }
        }
    }

    static render(restaurants) {  // it is going to take a list of restaurants and we are going to render those restaurants to the DOM
        this.restaurants = restaurants;   //this.restaurant is going to be set equal to whatever restaurant is going to be passed in to the render method
        $('#app').empty();  // we are going to go ahead and grab a reference to the app by its ID, this is where we are going to render everything, we ar going to start by clearing it so empty, every single time we render it we are going to empty it and then rerender everything  
        for (let restaurant of restaurants) {  //now we need a for loop to go over the restaurants
            $('#app').prepend(   //and we are going to prepend them so the newest one shows up on top, this is going to build the HTML for every single restaurant
                `<div id="${restaurant._id}" class="card">
                    <div class="card-header">
                        <h2>${restaurant.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteRestaurant('${restaurant._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${restaurant._id}-location-state" class="form-control" placeholder="State">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${restaurant._id}-location-city" class="form-control" placeholder="City">
                                </div>
                            </div>
                            <button id="${restaurant._id}-new-location" onclick="DOMManager.addLocation('${restaurant._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`             
            );
            for (let location of restaurant.locations) {
                $(`#${restaurant._id}`).find('.card-body').append(
                    `<p>
                        <span id="state-${location._id}"><strong>State: </strong> ${location.state}</span>
                        <span id="city-${location._id}"><strong>City: </strong> ${location.city}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteLocation('${restaurant._id}', '${location._id}')">Delete Location</button>`
                );
            }
        }
    }
}

$('#create-new-restaurant').click(() => {
    DOMManager.createRestaurant($('#new-restaurant-name').val());
    $('#new-restaurant-name').val('');
});

DOMManager.getAllRestaurants();