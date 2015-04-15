'use strict';
var styles = require('../styles/styles');
var React = require('react-native');
var ToDoList = require('./ToDoList');
var ToDoEdit = require('./ToDoEdit');
var { Text, View, ListView, TouchableHighlight, AlertIOS } = React;

// pick a storage backend:
// var Storage = require('../storage/local.js');
var Storage = require('../storage/remote.js');

var ToDoContainer = React.createClass({

  getInitialState: function() {
    return {
      items: []
    };
  },

  componentDidMount: function() {
    Storage.getTodos()
      .then((todos) => {
        this.setState({items: todos});
      })
      .done();
  },

  AlertMenu: function(rowData, rowID) {
    AlertIOS.alert(
      'Quick Menu',
      null,
      [
        {text: 'Delete', onPress: () => this.deleteItem(rowID)},
        {text: 'Edit', onPress: () => this.openItem(rowData, rowID)},
        {text: 'Cancel'},
      ]
    )
  },

  deleteItem: function(index){
    var items = this.state.items;
    items.splice(index,1);
    this.setState({items: items})
  },

  updateItem: function(formData, index){
    var items = this.state.items;
    var todo = {txt: formData.txt, complete: formData.complete};
    if (index) {
      items[index] = todo;
    }
    else {
      items.push(todo)
    }
    Storage.saveTodos(items)
      .then(() => {
        this.setState({items: items});
        this.props.navigator.pop();
      })
      .done();
  },

  openItem: function(rowData, rowID) {
    this.props.navigator.push({
      title: rowData && rowData.txt || 'New Item',
      component: ToDoEdit,
      passProps: {item: rowData, id: rowID, update: this.updateItem}
    });
  },

  toggleItem: function(item, index) {
    var items = this.state.items;
    items[index].complete = !items[index].complete;
    Storage.saveTodos(items)
      .then(() => {
        this.setState({items: items});
      })
      .done();
  },

  render: function() {
    return (
      <View style={{flex:1}}>
        <ToDoList
          items={this.state.items}
          onPressItem={this.toggleItem}
          onLongPressItem={this.AlertMenu} />
        <TouchableHighlight
          style={[styles.button, styles.newButton]}
          underlayColor='#99d9f4'
          onPress={this.openItem}>
            <Text style={styles.buttonText}>+</Text>
        </TouchableHighlight>
      </View>
    );
  }

});

module.exports = ToDoContainer;
