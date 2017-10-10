import React, { Component } from 'react';
import {select, forceSimulation, forceCenter, forceManyBody, forceLink, forceCollide, drag, event} from 'd3';

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
    let nodes = svg.append("g").attr("class", "nodes").selectAll(".nodes");
    let links = svg.append("g").attr("class", "links").selectAll(".links");
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
      circles.attr("cx", (d) => Math.max(radius, Math.min(width - radius, d.x)))
           .attr("cy", (d) => Math.max(radius, Math.min(height - radius, d.y)));
    });
    simulation.force("link").links(this.props.edges);
  }

  render() {
    return (
      <div>
        <svg ref={node => this.node = node} width={960} height={600}>
        </svg>
      </div>
    );
  }
}

export default TwitterGraph;
