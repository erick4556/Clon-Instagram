import React from "react";

const Main = ({ children, center }) => {
  let classes = `Main ${center ? "Main--center" : ""}`;
  console.log(children);
  return <main className={classes}>{children}</main>;
};

export default Main;
