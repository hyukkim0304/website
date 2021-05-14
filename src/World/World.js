import React, { useEffect, useState, useRef } from "react";
import Matter from "matter-js";

const STATIC_DENSITY = 15;
const PARTICLE_SIZE = 6;
const PARTICLE_BOUNCYNESS = 0.9;

const World = () => {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const [constraints, setContraints] = useState();
  const [scene, setScene] = useState();
  const [someStateValue, setSomeStateValue] = useState(false);
  const handleResize = () => {
    setContraints(boxRef.current.getBoundingClientRect());
  };

  const handleClick = () => {
    setSomeStateValue(!someStateValue);
  };

  useEffect(() => {
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let World = Matter.World;
    let Bodies = Matter.Bodies;
    let engine = Engine.create({});
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        background: "transparent",
        wireframes: false,
      },
    });

    const floor = Bodies.rectangle(0, 0, 0, 100, {
      isStatic: true,
      render: {
        fillStyle: "blue",
      },
    });

    const leftWall = Bodies.rectangle(-50, 90, 100, 2000, {
      isStatic: true,
    });

    const rightWall = Bodies.rectangle(1200, 200, 100, 2000, {
      isStatic: true,
      render: {
        fillStyle: "blue",
      },
    });

    World.add(engine.world, [floor, leftWall, rightWall]);

    Engine.run(engine);

    Render.run(render);

    setContraints(boxRef.current.getBoundingClientRect());

    setScene(render);

    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (constraints) {
      let { width, height } = constraints;
      // Dynamically update canvas and bounds
      scene.bounds.max.x = width;
      scene.bounds.max.y = height;
      scene.options.width = width;
      scene.options.height = height;
      scene.canvas.width = width;
      scene.canvas.height = height;
      // Dynamically update floor
      const floor = scene.engine.world.bodies[0];
      const leftWall = scene.engine.world.bodies[1];
      const rightWall = scene.engine.world.bodies[2];

      Matter.Body.setPosition(floor, {
        x: width / 2,
        y: height + 50,
        width,
        height: 100,
      });

      Matter.Body.setPosition(leftWall, {
        x: -50,
        y: height / 2,
        width: 100,
        height,
      });

      Matter.Body.setPosition(rightWall, {
        x: width + 50,
        y: height / 2,
        width: 100,
        height,
      });

      Matter.Body.setVertices(floor, [
        { x: 0, y: height + 100 },
        { x: width, y: height + 100 },
        { x: width, y: height },
        { x: 0, y: height },
      ]);
    }
  }, [scene, constraints]);

  const textures = [
    "https://i.ibb.co/z4VSpxG/face-1.png",
    "https://i.ibb.co/cDXgJ6C/face-2.png",
    "https://i.ibb.co/NTPjrhs/face-3.png",
    "https://i.ibb.co/T4rKcVC/face-4.png",
    "https://i.ibb.co/Dw9049M/face-5.png",
    "https://i.ibb.co/gt9BYYQ/face-6.png",
    "https://i.ibb.co/hfys0b2/face-7.png",
    "https://i.ibb.co/zbDfcrh/face-8.png",
    "https://i.ibb.co/6RP73dX/face-9.png",
    "https://i.ibb.co/nns9sKj/face-10.png",
  ];

  useEffect(() => {
    // Add a new "ball" everytime `someStateValue` changes
    if (scene) {
      let { width } = constraints;
      let randomX = Math.round(Math.random() * width);
      const ORIGINAL_SIZE = 120;
      const SIZE = Math.floor(Math.random() * 76) + 30;

      Matter.World.add(
        scene.engine.world,
        Matter.Bodies.circle(randomX, -30, 40, {
          angle: Math.PI * (Math.random() * 2 - 1),
          friction: 0.001,
          frictionAir: 0.01,
          restitution: 0.5,
          render: {
            sprite: {
              texture: textures[Math.floor(Math.random() * textures.length)],
              xScale: 1,
              yScale: 1,
            },
          },
        })
      );
    }
  }, [someStateValue]);

  return (
    <div>
      <button onClick={() => handleClick()}>Checkout</button>
      <div
        ref={boxRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default World;
