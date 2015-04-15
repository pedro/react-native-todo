'use strict';

var React = require('react-native');
var { AsyncStorage } = React;
var URL = 'https://frack.herokuapp.com/tables/ok/3ee38582-caa7-4a25-b60c-4128fcc4e667';

module.exports = {
  getTodos: function() {
    return new Promise((resolve, reject) => {
      fetch(URL)
        .then((response) => response.text())
        .then((responseBody) => {
          var todos = [];
          if (responseBody !== null) {
            console.log('parsing:')
            console.log(responseBody);
            var raw = JSON.parse(responseBody);

            // server has a different interface than the app, bridge it:
            todos = raw.data.map((todo) => {
              return { txt: todo.title, complete: todo.completed };
            });
          }
          resolve(todos);
        })
        .catch(reject)
        .done();
    });
  },
  saveTodos: function(todos) {
    // adapt local todos back to the format expected by the server
    var payload = todos.map((todo) => {
      return { title: todo.txt, completed: todo.complete };
    });
    var opts = { method: 'put', body: JSON.stringify(payload) };
    return fetch(URL, opts)
  }
};