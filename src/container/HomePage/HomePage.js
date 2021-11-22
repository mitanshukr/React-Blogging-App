import React from "react";
// import homeSVG from "../../assets/home.svg";
import classes from "./HomePage.module.css";
import "./typewriter.css";

import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";
import writingSampleImg from "../../assets/Images/WritingSample.png";

class HomePage extends React.Component {
  render() {
    return (
      <>
        <div className={`noselect ${classes.Home}`}>
          <h1 className={classes.headline}>
            Write what you <span className={classes.red}>Love!</span>
          </h1>
          <div className={classes.typewriter}>
            <Typewriter
              options={{
                autoStart: true,
                loop: true,
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    `Welcome to your<br><strong>Writing Playground</strong>.`
                  )
                  .pauseFor(2000)
                  .deleteAll()
                  .typeString(`Write what your heart says,<br>`)
                  .pauseFor(1000)
                  .typeString(
                    `Without a fear of <span class=${classes.red}>Judgement!</span>`
                  )
                  .pauseFor(2000)
                  .deleteAll()
                  .typeString(`Share with your loved ones,<br>`)
                  .pauseFor(1000)
                  // .deleteAll()
                  .typeString(
                    `<strong>or keep it <span class=${classes.red}>Secret.</span></strong>`
                  )
                  .pauseFor(2000)
                  .deleteAll()
                  .typeString(
                    `Welcome to the Next<br><strong><span class=${classes.red}>Beautiful Thing</span> :)</strong>`
                  )
                  .pauseFor(15000)
                  .start();
              }}
            />
          </div>
          <div className={classes.cta}>
            <Link to="/write">Start Writing</Link>
          </div>
          <div className={classes.homeImages}>
            <img src={writingSampleImg} alt="A writing Sample" />
            <img src={writingSampleImg} alt="A writing Sample" />
          </div>
        </div>
        <div
          style={{ width: "100%", height: "200px", backgroundColor: "green" }}
        >
          More Content Here...
        </div>
      </>
    );
  }
}

export default HomePage;
