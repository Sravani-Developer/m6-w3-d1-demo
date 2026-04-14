import React, { Fragment, Component } from "react";
import { Group } from "@vx/group";
import { Tree } from "@vx/hierarchy";
import { LinearGradient } from "@vx/gradient";
import { hierarchy } from "d3-hierarchy";
import Nodes from "./NodesMove";
import data from "./data";

const initializeNodes = node => {
  node.isExpanded = true;
  if (node.children) {
    node.children.forEach(initializeNodes);
  }
  return node;
};

const getLinkPath = (link, orientation, linkType, stepPercent = 0.5) => {
  const sx = orientation === "vertical" ? link.source.x : link.source.y;
  const sy = orientation === "vertical" ? link.source.y : link.source.x;
  const tx = orientation === "vertical" ? link.target.x : link.target.y;
  const ty = orientation === "vertical" ? link.target.y : link.target.x;

  if (linkType === "line") {
    return `M ${sx},${sy} L ${tx},${ty}`;
  }

  if (linkType === "step") {
    if (orientation === "vertical") {
      const midY = sy + (ty - sy) * stepPercent;
      return `M ${sx},${sy} L ${sx},${midY} L ${tx},${midY} L ${tx},${ty}`;
    } else {
      const midX = sx + (tx - sx) * stepPercent;
      return `M ${sx},${sy} L ${midX},${sy} L ${midX},${ty} L ${tx},${ty}`;
    }
  }

  if (orientation === "vertical") {
    const midY = (sy + ty) / 2;
    return `M ${sx},${sy} C ${sx},${midY} ${tx},${midY} ${tx},${ty}`;
  } else {
    const midX = (sx + tx) / 2;
    return `M ${sx},${sy} C ${midX},${sy} ${midX},${ty} ${tx},${ty}`;
  }
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: "cartesian",
      orientation: "vertical",
      linkType: "line",
      stepPercent: 0.5,
      treeData: initializeNodes(JSON.parse(JSON.stringify(data)))
    };
  }

  render() {
    const {
      width = 1000,
      height = 700,
      margin = {
        top: 30,
        left: 30,
        right: 30,
        bottom: 30
      }
    } = this.props;

    const { layout, orientation, linkType, stepPercent, treeData } = this.state;

    if (width < 10) return null;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let origin;
    let sizeWidth;
    let sizeHeight;

    if (layout === "polar") {
      origin = {
        x: innerWidth / 2,
        y: innerHeight / 2
      };
      sizeWidth = 2 * Math.PI;
      sizeHeight = Math.min(innerWidth, innerHeight) / 2;
    } else {
      if (orientation === "vertical") {
        origin = { x: 60, y: 40 };
        sizeWidth = innerWidth - 60;
        sizeHeight = innerHeight;
      } else {
        origin = { x: 60, y: 0 };
        sizeWidth = innerHeight;
        sizeHeight = innerWidth - 60;
      }
    }

    const root = hierarchy(treeData, d => (d.isExpanded ? d.children : null));

    return (
      <Fragment>
        <div style={{ margin: "10px 0px" }}>
          <span style={{ marginRight: 10 }}>
            <label>orientation:</label>
            <select
              onChange={e => this.setState({ orientation: e.target.value })}
              value={orientation}
              disabled={layout === "polar"}
            >
              <option value="vertical">vertical</option>
              <option value="horizontal">horizontal</option>
            </select>
          </span>

          <span>
            <label>link:</label>
            <select
              onChange={e => this.setState({ linkType: e.target.value })}
              value={linkType}
            >
              <option value="diagonal">diagonal</option>
              <option value="step">step</option>
              <option value="line">line</option>
            </select>
          </span>
        </div>

        <svg width={width} height={height}>
          <LinearGradient id="lg" from="#fff" to="#aaa" />
          <rect width={width} height={height} rx={14} fill="#888" />

          <Tree
            top={margin.top}
            left={margin.left}
            root={root}
            size={[sizeWidth, sizeHeight]}
            separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth}
          >
            {tree => (
              <Group top={origin.y} left={origin.x}>
                {tree.links().map((link, i) => (
                  <path
                    key={i}
                    d={getLinkPath(link, orientation, linkType, stepPercent)}
                    fill="none"
                    stroke="#b2f5ff"
                    strokeWidth={1.5}
                  />
                ))}

                <Nodes
                  nodes={tree.descendants()}
                  layout={layout}
                  orientation={orientation}
                  onNodeClick={node => {
                    node.data.isExpanded = !node.data.isExpanded;
                    this.setState({ treeData: { ...treeData } });
                  }}
                />
              </Group>
            )}
          </Tree>
        </svg>
      </Fragment>
    );
  }
}