Dogs = new Mongo.Collection("dogs");


if (Meteor.isClient) {

  Session.set('currentTemplate', 'index');
  Session.set('currentDogId', "");

  //*******body helpers/events*********//
  Template.body.helpers({
    index: function() {
      return Session.get('currentTemplate') === 'index' ? true : false;
    },
    new: function() {
      return Session.get('currentTemplate') === 'new' ? true : false;
    },
    edit: function() {
      return Session.get('currentTemplate') === 'edit' ? true : false;
    }
  });

  //*******dog index helpers/events*********/
  Template.dogIndex.helpers({
    dogs: function() {
      return Dogs.find();
    }
  });

  Template.dogIndex.events({
    "click #add-new": function(event, template) {
      Session.set('currentTemplate', "new");
    },
    "click .edit": function(event, template) {
      Session.set('currentTemplate', "edit");
      Session.set('currentDogId', event.target.name);
    },
    "click .delete": function(event, template) {
      if (confirm("Are you sure?")) {
        Dogs.remove(event.target.name);
      }
    }
  });

  //*******addDog events/helpers******//
  Template.addDog.events({
    "submit form": function(event, template) {
      event.preventDefault();

      var name = event.target.dogname.value;
      var age = event.target.age.value;
      var breed = event.target.breed.value;

      var newDog = {
        name: name,
        age: age,
        breed: breed,
        createdAt: new Date()
      };

      Dogs.insert(newDog);

      name = "";
      age = "";
      breed = "";

      Session.set('currentTemplate', 'index');
      return false;
    },

    "click .back": function() {
        event.preventDefault();
        Session.set('currentTemplate', 'index');
      } //end click#back
  }); //end addDog events

  //*********Edit helpers/events**********//

  Template.editDog.helpers({
    currentDog: function() {
      var id = Session.get('currentDogId');
      return Dogs.findOne({
        _id: id
      });
    }
  });

  Template.editDog.events({
    "click .back": function() {
      Session.set('currentTemplate', 'index');
    }, //end click#back
    "submit form": function(event, template) {
        event.preventDefault();
        Dogs.update({
          _id: Session.get('currentDogId')
        }, {
          $set: {
            name: event.target.name.value,
            age: event.target.age.value,
            breed: event.target.breed.value
          }
        });
        console.log('edit me');
        Session.set('currentTemplate', 'index');
        return false;
      }
  });

} //end ifMeteorIsClient


if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}
