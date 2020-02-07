import React, { Component } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

export default class PizzaTranslator extends Component {
  constructor(props) {
    super(props);
    this.state = {first: 0, second: 0, sum: 0};
  }

  async componentDidMount() {
    await tf.ready()
    const modelJson = require('./full_adder_js/model.json');
    const modelWeights = require('./full_adder_js/group1-shard1of1.bin');
    this.model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
    console.log("successfully loaded model")
  }
  
  setFirst(first) {
    this.setState({first: Number(first), second: this.state.second, sum: this.state.sum})
  }

  setSecond(second) {
    this.setState({first: this.state.first, second: Number(second), sum: this.state.sum})
  }

  updateSum() {

    a = this.state.first.toString(2);
    b = this.state.second.toString(2);
    n = Math.max(a.length, b.length);
    
    // pad
    if (a.length < n) {
      a = "0".repeat(n-a.length) + a
    }
    if (b.length < n) {
      b = "0".repeat(n-b.length) + b
    }

    p = a.split('').map((item) => parseInt(item, 10)).reverse()
    q = b.split('').map((item) => parseInt(item, 10)).reverse()

    c = 0
    answer = []
    for (i=0; i<n; i++) {
      var x = tf.tensor2d([[p[i], q[i], c]], [1, 3]);
      var y = this.model.predict(x).dataSync();
      [c, s] = y.map(z=>z>0.5?1:0)
      answer.push(s)
    }
    answer.push(c)
    
    var sum = parseInt(answer.reverse().join(''), 2)
    console.log("sum: ", sum)
    this.setState({first: this.state.first, second: this.state.second, sum: sum})
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