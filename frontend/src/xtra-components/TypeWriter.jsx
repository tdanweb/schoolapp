import React, {useState, useEffect} from "react";
import Typewriter from "typewriter-effect";
import { Typewriter } from "react-simple-typewriter";


function AppType() {
  return (
    <h1>
      I teach{" "}
      <span style={{ color: "blue" }}>
        <Typewriter
          words={["Mathematics", "Web Development", "React", "JavaScript"]}
          loop={true}
          cursor
          cursorStyle="|"
          typeSpeed={80}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </span>
    </h1>
  );
}

export {AppType}
/*
function TypeApp() {
  return (
    <Typewriter
      options={{
        strings: [
          "Teaching Mathematics 📘",
          "Building Web Apps 💻"
        ],
        autoStart: true,
        loop: true,
        delay: 50,
        deleteSpeed: 50,
      }}
    />
  );
}

export default TypeApp;

/*
function Writer(props){

    useEffect(() => {

        const typing = setInterval(() => {
            console.log("active")
        }, props.duration)

        return () => clearInterval(typing);
    }, [])

    return <div>T Dan is Here!!</div>
} */