import React, { Component } from 'react';
import {select, forceSimulation, forceCenter, forceManyBody, forceLink, forceCollide, drag, zoom, event} from 'd3';

const radius = 25;

class TwitterGraph extends Component {

  constructor(props){
      super(props)
      this.createGraph = this.createGraph.bind(this)
   }
   componentDidMount() {
      this.createGraph()
   }
   componentDidUpdate() {
      this.createGraph()
   }

  createGraph() {
    const svg = select(this.node);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    let nodes = select(this.nodeG).selectAll(".nodes");
    let links = select(this.linkG).selectAll(".links");
    nodes= nodes.data(this.props.followers);
    const dragstarted = (d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragended = (d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };
    nodes.exit().remove();
    nodes.enter().append("defs").append("pattern")
    .attr("id", (d) => d.id)
    .attr("x", "0%")
    .attr("y", "0%")
    .attr("height", "100%")
    .attr("width", "100%")
    .append("image")
    .attr("x", "0%")
    .attr("y", "0%")
    .attr("height", "50")
    .attr("width", "50")
    .attr("xlink:href", (d) => d.img);
    nodes.enter().append("circle")
      .attr("r", radius)
      .attr("stroke", "black")
      .attr("fill", (d) => "url(#" + d.id + ")")
      .call(drag().on("start", dragstarted).on("drag", dragged).on("end", dragended))
      .merge(nodes);

    links = links.data(this.props.edges);
    links.exit().remove();
    links.enter().append("line").attr("stroke", "gray").attr("stroke-opacity", "0.1");

    const simulation = forceSimulation().force("link", forceLink().id(function(d) { return 4; }))
    .force("center", forceCenter(width / 2, height / 2))
    .force("collision", forceCollide(radius))
    .force("many-body", forceManyBody().strength(-980));
    const lines = svg.selectAll("line");
    const circles = svg.selectAll("circle");
    simulation.nodes(this.props.followers).on("tick", () => {
      lines.attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
		      .attr("x2", (d) => d.target.x)
		      .attr("y2", (d) => d.target.y);
      circles.attr("cx", (d) => d.x)
           .attr("cy", (d) => d.y);
    });
    simulation.force("link").links(this.props.edges);

  }

  render() {
    return (
      <div className="graph">
        <svg ref={node => this.node = node} width={1000} height={650} viewBox="0,0,960,600">
          <g className="nodes" ref={nodeG => this.nodeG = nodeG}></g>
          <g className="links" ref={linkG => this.linkG = linkG}></g>
        </svg>
      </div>
    );
  }
}

export default TwitterGraph;
