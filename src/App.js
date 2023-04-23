import React, { Component } from 'react';
import axios from 'axios';
import ToDoItem from './components/ToDoItem';
import CreateToDoItem from './components/CreateToDoItem';

class App extends Component {
  state = {
    "pending_items": [],
    "done_items": [],
    "pending_items_count": 0,
    "done_items_count": 0
  }

  // makes the API call
  getItems() {
    axios.get("http://127.0.0.1:8000/v1/item/get",
    {headers: {"token": "some_token"}})
    .then(this.handleReturnedState)
  }

  //ensures the API call is update when mounted
  componentDidMount() {
    this.getItems();
  }

  // convert items form API to HTML
  processItemValues(items) {
    let itemList = [];
    items.forEach((item, _) => {
      itemList.push(
        <ToDoItem key={item.title + item.status} 
                  title={item.title}
                  status={item.status}
                  passBackResponse={
                    this.handleReturnedState
                  }/>
      )
    })
    return itemList
  }

  handleReturnedState = (response) => {
    let pending_items = response.data["pending_items"]
    let done_items = response.data["done_items"]
    this.setState({
      "pending_items": this.processItemValues(pending_items),
      "done_items": this.processItemValues(done_items),
      "pending_items_count": response.data["pending_item_count"],
      "done_items_count": response.data["done_item_count"]
    })
  }

  //returns the HTML to be rendred
  render() {
    return (
      <div className="App">
        <h1>Pending Items</h1>
        <p> pending item count: {this.state.pending_items_count}</p>
        {this.state.pending_items}
        <h1>Done Items</h1>
        <p>done item count: {this.state.done_items_count}</p>
        {this.state.done_items}
        <CreateToDoItem passBackResponse={this.handleReturnedState} />
      </div>
    )
  }
}

export default App;