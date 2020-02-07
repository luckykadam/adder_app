import React, { Component } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { fetch, decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';

export default class PizzaTranslator extends Component {
  constructor(props) {
    super(props);
    this.state = {first: 0, second: 0, sum: 0};
  }

  async componentDidMount() {
    // try {
      await tf.ready()
      this.setState({
        isTfReady: true
      })
      console.log('isTfReady:', this.state.isTfReady)

    //   model = await mobilenet.load()
    //   this.setState({
    //     model: model
    //   });
    //   console.log('isModelLoaded:', this.model === null ? "No" : "Yes")
    // } catch (e) {
    //   console.warn("could not tf ready/load model: ", e)
    // }


    try {
      // Get reference to bundled model assets 
      const modelJson = require('./full_adder_js/model.json');
      const modelWeights = require('./full_adder_js/group1-shard1of1.bin');
      this.model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      // this.model = await tf.loadLayersModel(bundleResourceIO(modelJson));      

      console.log("successfully loaded model")
    } catch (e) {
      console.warn("could not load model: ", e)
    }

    //Output in Expo console
  }
  
  setFirst(first) {
    this.setState({first: Number(first), second: this.state.second, sum: this.state.sum})
  }

  setSecond(second) {
    this.setState({first: this.state.first, second: Number(second), sum: this.state.sum})
  }

  updateSum() {
    // const example = [[ 1.0, 1.0]];
    const example = tf.tensor2d([[ 1.0, 1.0, 0.0]], [1, 3]);
    [c, s] = this.model.predict(example).dataSync();
    console.log("prediction: ", c, s)
    this.setState({first: this.state.first, second: this.state.second, sum: s})


    // a = this.state.first.toString(2);
    // b = this.state.second.toString(2);
    // n = Math.max(a.length, b.length);
    
    // // pad
    // if (a.length < n) {
    //   a = "0".repeat(n-a.length) + a
    // }
    // if (b.length < n) {
    //   b = "0".repeat(n-b.length) + b
    // }

    // p = a.split('').map((item) => parseInt(item, 10)).reverse()
    // q = b.split('').map((item) => parseInt(item, 10)).reverse()
    // console.log("a: ", a, ", b: ", b, ", n: ", n, 'p: ', p, 'q: ', q)  

    // c = 0
    // answer = []
    // for (i=0; i<n; i++) {
    //   var x = tf.tensor2d([[p[i], q[i], c]], [1, 3]);
    //   var y = this.model.predict(x).dataSync();
    //   [c, s] = y.map(z=>z>0.5?1:0)
    //   console.log('input: ', x.dataSync())
    //   console.log("prediction: ", y)
    //   console.log("c, s: ", c, s)
    //   answer.push(s)
    // }
    // answer.push(c)
    // console.log("answer: ", answer)

  }

  render() {
    return (
      <View style={{padding: 10}}>
        <Text>TFJS ready? {this.state.isTfReady ? <Text>Yes</Text> : <Text>No</Text>}</Text>
        <Text>model ready? {this.model ? <Text>Yes</Text>: <Text>No</Text>}</Text>
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