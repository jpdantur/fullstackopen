import React from "react";
import ReactDOM from "react-dom";

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.name} {props.number}
    </p>
  );
};

const Content = (props) => {
  return (
    <div>
      <Part name={props.part1.name} number={props.part1.exercises} />
      <Part name={props.part2.name} number={props.part2.exercises} />
      <Part name={props.part3.name} number={props.part3.exercises} />
    </div>
  );
};

const Total = (props) => {
  return <p>Number of exercises {props.total}</p>;
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content
        part1={course.parts[0]}
        part2={course.parts[1]}
        part3={course.parts[2]}
      />
      <Total
        total={
          course.parts[0].exercises +
          course.parts[1].exercises +
          course.parts[2].exercises
        }
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
