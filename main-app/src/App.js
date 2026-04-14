import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import BarChart from "./bar-chart/BarChart";
import Tree from "./tree-demo/Tree";

const Home = () => (
  <div style={{ padding: "20px" }}>
    <h2>Redux Animation Demos</h2>
    <p>Select a demo from navigation</p>
  </div>
);

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
          <Link to="/bar-chart" style={{ marginRight: "15px" }}>Bar Chart</Link>
          <Link to="/tree">Tree Demo</Link>
        </nav>

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/bar-chart" component={BarChart} />
          <Route path="/tree" component={Tree} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;