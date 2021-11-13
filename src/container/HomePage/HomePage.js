import React from "react";
// import homeSVG from "../../assets/home.svg";
import classes from "./HomePage.module.css";

import Typewriter from "typewriter-effect";

class HomePage extends React.Component {
  render() {
    return (
      <div className={classes.Home}>
        {/* <img src={homeSVG} /> */}
        Home
        <h1>Start your Journal</h1>
        <p>Write what you Love!</p>
        <iframe title="aveva" src="https://www.aveva.com/en/perspectives/success-stories/" />
        <Typewriter
          options={{
            strings: ["Hello", "World"],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
    );
  }
}

export default HomePage;
