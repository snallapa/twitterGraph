import React, { Component } from 'react';
import TwitterGraph from './twitterGraph';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      followers: [],
      edges: []
    };
  }

  componentDidMount() {
    fetch("/friends").then((res) => {
      res.json().then((data) => {
        const edges = data.edges.map((edge) => {
          const {source, target} = edge;
          return {source: data.nodes[source], target: data.nodes[target]};
        })
        this.setState({followers: data.nodes, edges: edges});
      });
    });
  }

  render() {
    return (
      <div>
        <TwitterGraph followers={this.state.followers} edges={this.state.edges} />
      </div>
    );
  }
}

export default App;
