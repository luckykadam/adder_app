import React, { Component } from 'react';
import { Text, TextInput, View, Button } from 'react-native';

export default class PizzaTranslator extends Component {
  constructor(props) {
    super(props);
    this.state = {first: 0, second: 0, sum: 0};
  }

  setFirst(first) {
    this.setState({first: Number(first), second: this.state.second, sum: this.state.sum})
  }

  setSecond(second) {
    this.setState({first: this.state.first, second: Number(second), sum: this.state.sum})
  }

  updateSum() {
    this.setState({first: this.state.first, second: this.state.second, sum: this.state.first + this.state.second})
  }

  render() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40, backgroundColor: "gray"}}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.setFirst(text)}
          value={this.state.text}
        />
        <TextInput
          style={{height: 40, backgroundColor: "gray"}}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.setSecond(text)}
          value={this.state.text}
        />
        <Button
          style={{backgroundColor: "blue"}}
          title="sum"
          onPress={() => this.updateSum()}
        />
        <Text style={{padding: 10, fontSize: 42}}>
          { this.state.sum }
        </Text>
      </View>
    );
  }
}