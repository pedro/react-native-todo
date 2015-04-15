'use strict';

var React = require('react-native');
var { AsyncStorage } = React;
var STORAGE_KEY = 'todos';

module.exports = {
  getTodos: function() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(STORAGE_KEY)
        .then((value) => {
          if (value !== null) {
            resolve(JSON.parse(value));
          }
          // nothing in the local store, give users a stub
          else {
            var todos = [
              {txt: 'Learn react native', complete:false},
              {txt: 'Make a to-do app', complete:true}
            ];
            resolve(todos);
          }
        })
        .catch(reject)
        .done();
    });
  },
  saveTodos: function(todos) {
    return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};