import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import "./styles.css";

const missions = [
  {
    name: "Artemis II",
    copy: "Testing the Orion spacecraft and SLS rocket on the path to the Moon and Mars.",
    image: "/assets/missions/artemis-ii.png",
  },
  {
    name: "Europa Clipper",
    copy: "Investigating Jupiter's ocean moon and the conditions that could support life.",
    image: "/assets/missions/europa-clipper.png",
  },
  {
    name: "James Webb Space Telescope",
    copy: "Revealing the universe in unprecedented detail across infrared wavelengths.",
    image: "/assets/missions/jwst.png",
  },
];

const gallery = [
  ["Carina Nebula", "/assets/gallery/carina-nebula.png"],
  ["M51 Whirlpool", "/assets/gallery/m51-whirlpool.png"],
  ["Pillars of Creation", "/assets/gallery/pillars-creation.png"],
  ["Southern Ring", "/assets/gallery/southern-ring.png"],
];

const timeline = [
  ["1957", "Sputnik 1", "Humanity's first step into the space age."],
  ["1969", "Apollo 11", "One small step for a man, a giant leap."],
  ["1990", "Hubble Launch", "A new eye on the universe, forever changing our view."],
  ["2012", "Curiosity", "Exploring Mars and seeking signs of past habitability."],
  ["2020+", "Artemis Era", "Returning to the Moon. Preparing for Mars."],
];

function HeroScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      canvas.classList.add("hero-canvas-fallback");
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    camera.position.set(0, 0.6, 9);

    const group = new THREE.Group();
    scene.add(group);

    const ambient = new THREE.AmbientLight(0x7896bb, 0.42);
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(-4, 5, 6);
    const rim = new THREE.PointLight(0x49b7ff, 3.6, 18);
    rim.position.set(4.6, 2.2, 3.5);
    scene.add(ambient, key, rim);

    const starCount = 1600;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 36;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = -Math.random() * 28 - 2;
      const warmth = Math.random();
      colors[i3] = 0.64 + warmth * 0.36;
      colors[i3 + 1] = 0.72 + warmth * 0.18;
      colors[i3 + 2] = 0.92 + Math.random() * 0.08;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        size: 0.018,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      }),
    );
    scene.add(stars);

    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x2f6fa8,
      roughness: 0.72,
      metalness: 0.02,
      emissive: 0x081321,
      emissiveIntensity: 0.8,
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(4.55, 96, 96), earthMaterial);
    earth.position.set(5.35, -1.7, -1.45);
    group.add(earth);

    new THREE.TextureLoader().load("/assets/earth-texture.png", (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      earthMaterial.map = texture;
      earthMaterial.color.set(0xffffff);
      earthMaterial.emissive.set(0x02070c);
      earthMaterial.emissiveIntensity = 0.35;
      earthMaterial.needsUpdate = true;
    });

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(4.68, 96, 96),
      new THREE.MeshBasicMaterial({
        color: 0x73cbff,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
      }),
    );
    atmosphere.position.copy(earth.position);
    group.add(atmosphere);

    const nightLights = new THREE.Group();
    for (let i = 0; i < 56; i += 1) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.012 + Math.random() * 0.018, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffd58b, transparent: true, opacity: 0.75 }),
      );
      const angle = Math.random() * Math.PI * 1.2 - 0.15;
      const radius = 4.58;
      dot.position.set(
        earth.position.x - Math.cos(angle) * (0.7 + Math.random() * 2.5),
        earth.position.y + Math.sin(angle) * (0.5 + Math.random() * 1.55),
        earth.position.z + radius * 0.18,
      );
      nightLights.add(dot);
    }
    group.add(nightLights);

    const craft = new THREE.Group();
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xcdd5de,
      roughness: 0.42,
      metalness: 0.66,
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d1118,
      roughness: 0.35,
      metalness: 0.55,
    });
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0x172b45,
      emissive: 0x1e5480,
      emissiveIntensity: 0.32,
      roughness: 0.28,
      metalness: 0.45,
    });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 1.0, 16, 32), bodyMaterial);
    body.rotation.z = Math.PI / 2;
    craft.add(body);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.55, 32), bodyMaterial);
    nose.position.x = 0.75;
    nose.rotation.z = -Math.PI / 2;
    craft.add(nose);
    const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.39, 0.24, 32), darkMaterial);
    engine.position.x = -0.76;
    engine.rotation.z = Math.PI / 2;
    craft.add(engine);
    [-1, 1].forEach((side) => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.035, 0.48), panelMaterial);
      panel.position.set(0, side * 0.63, 0);
      craft.add(panel);
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.48, 0.05), darkMaterial);
      strut.position.set(0, side * 0.36, 0);
      craft.add(strut);
    });
    craft.position.set(2.05, -0.2, 1.85);
    craft.rotation.set(-0.2, -0.72, 0.18);
    craft.scale.setScalar(0.44);
    group.add(craft);

    const makeOrbit = (radiusX, radiusY, z, color, opacity) => {
      const points = [];
      for (let i = 0; i <= 180; i += 1) {
        const t = (i / 180) * Math.PI * 1.46 + 0.18;
        points.push(new THREE.Vector3(Math.cos(t) * radiusX + 2.1, Math.sin(t) * radiusY - 0.6, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
      );
      line.rotation.z = -0.12;
      group.add(line);
    };
    makeOrbit(5.3, 1.48, 1.15, 0xb7c8d6, 0.35);
    makeOrbit(4.65, 1.12, 1.12, 0xd6e2ec, 0.22);
    makeOrbit(7.4, 1.65, 0.85, 0xff1f32, 0.36);

    let width = 0;
    let height = 0;
    let pointerX = 0;
    let scrollY = window.scrollY;
    const clock = new THREE.Clock();

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onPointer = (event) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      document.documentElement.style.setProperty("--scroll-y", `${scrollY}px`);
    };

    const render = () => {
      const t = clock.getElapsedTime();
      const heroProgress = Math.min(scrollY / Math.max(window.innerHeight, 1), 1.4);
      stars.rotation.y = t * 0.006 + pointerX * 0.025;
      earth.rotation.y = t * 0.026;
      atmosphere.rotation.y = t * 0.02;
      craft.position.y = -0.2 + Math.sin(t * 0.9) * 0.08 - heroProgress * 0.32;
      craft.position.x = 2.05 + pointerX * 0.18 + heroProgress * 0.45;
      craft.rotation.y = -0.72 + Math.sin(t * 0.55) * 0.08 + pointerX * 0.08;
      group.position.y = -heroProgress * 0.42;
      group.rotation.z = pointerX * 0.008;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      renderer.dispose();
      starGeometry.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
    };
  }, []);

  return <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />;
}

function Arrow() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="arrow-icon">
      <path d="M3 9h10.2M9.6 4.7 13.9 9l-4.3 4.3" />
    </svg>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="COMET home">
        <img src="/assets/comet-worm.svg" alt="COMET" />
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#missions">Missions</a>
        <a href="#signals">Discoveries</a>
        <a href="#signals">Images</a>
        <a href="#timeline">Live</a>
      </nav>
      <a className="header-cta" href="#journey">
        Launch experience <Arrow />
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="top">
      <HeroScene />
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />
      <div className="hero-content">
        <h1>Explore the next horizon</h1>
        <p>A living front door to missions, discoveries, and the human drive beyond Earth.</p>
        <div className="hero-actions">
          <a className="button primary" href="#missions">
            Launch experience <Arrow />
          </a>
          <a className="button secondary" href="#missions">
            View missions
          </a>
        </div>
      </div>
    </section>
  );
}

function Missions() {
  return (
    <section className="section missions-section" id="missions">
      <div className="section-heading">
        <h2>Missions in motion</h2>
      </div>
      <div className="mission-layout">
        <div className="mission-rail" aria-hidden="true" />
        <div className="mission-copy">
          {missions.map((mission) => (
            <article className="mission-copy-item" key={mission.name}>
              <span className="mission-dot" />
              <h3>{mission.name}</h3>
              <p>{mission.copy}</p>
              <a href="#journey">
                Explore mission <Arrow />
              </a>
            </article>
          ))}
        </div>
        <div className="mission-visuals">
          {missions.map((mission, index) => (
            <div
              className="mission-visual"
              style={{
                "--mission-image": `url(${mission.image})`,
                "--shift": `${index * 14}px`,
              }}
              key={mission.name}
              aria-label={`${mission.name} visual`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Signals() {
  return (
    <section className="section signals-section" id="signals">
      <div className="section-heading">
        <h2>Signals from deep space</h2>
        <p className="section-note">
          * Images in this section are AI-generated artistic interpretations and may not be
          scientifically accurate.
        </p>
      </div>
      <div className="gallery-row">
        {gallery.map(([name, pos]) => (
          <a className="gallery-card" href="#journey" key={name}>
            <span className="gallery-image" style={{ "--gallery-image": `url(${pos})` }} />
            <span className="gallery-title">
              {name} <Arrow />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="section timeline-section" id="timeline">
      <div className="section-heading">
        <h2>The arc of exploration</h2>
      </div>
      <div className="timeline-track">
        {timeline.map(([year, title, copy], index) => (
          <article className="timeline-node" key={title} style={{ "--index": index }}>
            <span className="node-orbit" aria-hidden="true" />
            <strong>{year}</strong>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="journey-section" id="journey">
      <div className="lunar-horizon" aria-hidden="true" />
      <div className="journey-content">
        <h2>The universe is calling.</h2>
        <p>Where will you explore first?</p>
        <a className="button primary" href="#top">
          Start your journey <Arrow />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span className="brand footer-brand">
        <img src="/assets/comet-worm.svg" alt="COMET" />
      </span>
      <nav aria-label="Footer navigation">
        <a href="#top">Privacy Policy</a>
        <a href="#top">Terms of Use</a>
        <a href="#top">Site Map</a>
        <a href="#top">Contact</a>
        <a href="#top">Accessibility</a>
      </nav>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Missions />
        <Signals />
        <Timeline />
        <Journey />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
