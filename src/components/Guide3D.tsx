"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";

/**
 * 3D pictures for guides, of two kinds. Five guides have a hand-built model (a
 * bike wheel, a chair, a door hinge, a faucet) made from simple shapes, where
 * the part a step is about glows orange. Thirty-four more show a ready-made
 * model of the item from public/models. The caption says which kind it is.
 */

type Three = typeof THREE_NS;
type Parts = Record<string, THREE_NS.Mesh[]>;
type ModelName = "wheel" | "chair" | "door" | "faucet";

/**
 * Guides that show a ready-made model from public/models. All of them are CC0
 * (free for any use): the .glb files are from Kenney's Furniture, Car, Food and
 * Survival kits (kenney.nl), the ones under ph/ are scans from Poly Haven
 * (polyhaven.com). See public/models/CREDITS.txt. They show what the item looks
 * like and do not change with the steps.
 */
const GUIDE_FILES: Record<string, string> = {
  "running-toilet": "toilet.glb",
  "unclog-toilet": "toilet.glb",
  "toilet-seat": "toilet.glb",
  "unclog-sink": "bathroomSink.glb",
  "disposal-jam": "kitchenSink.glb",
  "washer-smell": "washer.glb",
  "dryer-lint": "dryer.glb",
  "fridge-seal": "kitchenFridge.glb",
  "free-toaster-lever": "toaster.glb",
  "coffee-maker-descale": "kitchenCoffeeMachine.glb",
  "blender-gasket": "kitchenBlender.glb",
  "lamp-bulb-check": "lampRoundTable.glb",
  "squeaky-bed": "bedSingle.glb",
  "cabinet-hinge": "kitchenCabinet.glb",
  "level-table": "table.glb",
  "upholstery-tear": "loungeSofa.glb",
  "recaulk-tub": "bathtub.glb",
  "replace-showerhead": "shower.glb",
  "weatherstrip-door": "doorway.glb",
  "loose-door-handle": "doorway.glb",
  "stripped-screw-hole": "ph/screwdriver/screwdriver_1k.gltf",
  "clean-keyboard": "computerKeyboard.glb",
  "wiper-blades": "car/sedan.glb",
  "cabin-air-filter": "car/sedan.glb",
  "washer-fluid": "car/sedan.glb",
  "headlight-bulb": "car/sedan.glb",
  "tire-pressure": "car/wheel-default.glb",
  "patch-tent": "camp/tent.glb",
  "sharpen-knife": "food/cooking-knife.glb",
  "season-cast-iron": "food/frying-pan.glb",
  "loose-pot-handle": "food/pot.glb",
  "oil-cutting-board": "food/cutting-board.glb",
  "patch-hose": "ph/garden_hose_wall_mounted_01/garden_hose_wall_mounted_01_1k.gltf",
  "clean-waterproof-boots": "ph/rubber_boots/rubber_boots_1k.gltf",
};

/** Which hand-built model a guide uses, and which parts each step points at. */
const GUIDE_MODELS: Record<string, { model: ModelName; steps: string[][] }> = {
  "patch-tube": { model: "wheel", steps: [["tire", "rim"], ["hole"], ["patch"], ["valve", "tire"]] },
  "inflate-tire": { model: "wheel", steps: [["tire"], ["valve"], ["valve"], ["tire"], ["valve"]] },
  "tighten-joints": { model: "chair", steps: [["joints"], ["screws"], ["joints"], ["clamp"]] },
  "squeaky-hinge": { model: "door", steps: [["hinges"], ["pin"], ["door"], ["hinges"]] },
  "faucet-washer": { model: "faucet", steps: [["valve"], ["handle"], ["washer"], ["handle", "spout"]] },
};

const PART_NAMES: Record<string, string> = {
  tire: "tire", rim: "rim", hole: "the hole in the tube", patch: "patch", valve: "valve",
  joints: "the joints", screws: "screws and bolts", clamp: "clamp",
  hinges: "hinges", pin: "hinge pin", door: "door",
  handle: "handle", washer: "washer", spout: "spout",
};

export function hasModel(guideId: string): boolean {
  return guideId in GUIDE_MODELS || guideId in GUIDE_FILES;
}

function builders(THREE: Three) {
  const material = (colour: number, extra: THREE_NS.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color: colour, roughness: 0.6, metalness: 0.1, ...extra });
  const add = (group: THREE_NS.Group, parts: Parts, name: string, mesh: THREE_NS.Mesh) => {
    group.add(mesh);
    (parts[name] ??= []).push(mesh);
    return mesh;
  };
  const rod = (from: THREE_NS.Vector3, to: THREE_NS.Vector3, radius: number, mat: THREE_NS.Material) => {
    const length = from.distanceTo(to);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 12), mat);
    mesh.position.copy(from).add(to).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
    return mesh;
  };
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  return {
    wheel() {
      const group = new THREE.Group();
      const parts: Parts = {};
      // the tire is see-through so the tube inside it shows
      add(group, parts, "tire", new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 20, 80), material(0x2b2b2b, { transparent: true, opacity: 0.55 })));
      add(group, parts, "tube", new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.12, 16, 80), material(0x555a66)));
      add(group, parts, "rim", new THREE.Mesh(new THREE.TorusGeometry(1.27, 0.06, 12, 80), material(0xc9ced6, { metalness: 0.7, roughness: 0.3 })));
      const hub = add(group, parts, "rim", new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.4, 20), material(0xb0b6c0, { metalness: 0.7, roughness: 0.3 })));
      hub.rotation.x = Math.PI / 2;
      const spoke = material(0xd8dce2, { metalness: 0.6 });
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const side = i % 2 === 0 ? 0.12 : -0.12;
        add(group, parts, "rim", rod(v(0, 0, side), v(Math.cos(angle) * 1.24, Math.sin(angle) * 1.24, 0), 0.012, spoke));
      }
      add(group, parts, "valve", rod(v(0, -1.22, 0), v(0, -0.92, 0), 0.035, material(0xd9a441, { metalness: 0.6 })));
      // the hole and the patch sit on the outside of the tube, top right
      const at = Math.PI / 4;
      const hole = add(group, parts, "hole", new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), material(0xdc2626)));
      hole.position.set(Math.cos(at) * 1.62, Math.sin(at) * 1.62, 0);
      const patch = add(group, parts, "patch", new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.025, 24), material(0xe86a2a)));
      patch.position.set(Math.cos(at + 0.28) * 1.625, Math.sin(at + 0.28) * 1.625, 0);
      patch.rotation.z = at + 0.28 - Math.PI / 2;
      return { group, parts };
    },

    chair() {
      const group = new THREE.Group();
      const parts: Parts = {};
      const wood = material(0xb98552);
      const dark = material(0x8a5f38);
      const seat = add(group, parts, "seat", new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 1.5), wood));
      seat.position.y = 0;
      const corners: Array<[number, number]> = [[-0.65, -0.65], [0.65, -0.65], [-0.65, 0.65], [0.65, 0.65]];
      corners.forEach(([x, z], i) => {
        const back = z < 0;
        const leg = add(group, parts, "legs", new THREE.Mesh(new THREE.BoxGeometry(0.13, back ? 3.2 : 1.5, 0.13), dark));
        leg.position.set(x, back ? 0.1 : -0.75, z);
        // where the leg meets the seat is the joint that works loose
        const joint = add(group, parts, "joints", new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), material(0xd9c29a)));
        joint.position.set(x, -0.08, z);
        const screw = add(group, parts, "screws", new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.3, 10), material(0xcfd4da, { metalness: 0.8, roughness: 0.3 })));
        screw.rotation.z = Math.PI / 2;
        screw.position.set(x + (x < 0 ? 0.12 : -0.12), -0.2, z);
        void i;
      });
      // stretchers between the legs, and the back rails
      add(group, parts, "legs", rod(v(-0.65, -1, -0.65), v(0.65, -1, -0.65), 0.04, dark));
      add(group, parts, "legs", rod(v(-0.65, -1, 0.65), v(0.65, -1, 0.65), 0.04, dark));
      add(group, parts, "legs", rod(v(-0.65, -1, -0.65), v(-0.65, -1, 0.65), 0.04, dark));
      add(group, parts, "legs", rod(v(0.65, -1, -0.65), v(0.65, -1, 0.65), 0.04, dark));
      [1.55, 1.05].forEach((y) => {
        const rail = add(group, parts, "seat", new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 0.07), wood));
        rail.position.set(0, y, -0.65);
      });
      // a bar clamp squeezing the front legs together
      const steel = material(0x3f6fd8, { metalness: 0.4 });
      add(group, parts, "clamp", rod(v(-0.95, -0.45, 0.78), v(0.95, -0.45, 0.78), 0.035, steel));
      [-0.85, 0.85].forEach((x) => {
        const jaw = add(group, parts, "clamp", new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.22), steel));
        jaw.position.set(x, -0.45, 0.7);
      });
      group.position.y = -0.2;
      return { group, parts };
    },

    door() {
      const group = new THREE.Group();
      const parts: Parts = {};
      const frame = add(group, parts, "frame", new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.4, 0.5), material(0xe9e2d4)));
      frame.position.set(-1.05, 0, 0);
      // the door stands a little open so the hinge side shows
      const leaf = new THREE.Group();
      leaf.position.set(-0.93, 0, 0.12);
      leaf.rotation.y = -0.5;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.2, 0.09), material(0x9c6b43));
      slab.position.x = 0.9;
      leaf.add(slab);
      (parts.door ??= []).push(slab);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), material(0xd9a441, { metalness: 0.7, roughness: 0.3 }));
      knob.position.set(1.6, -0.1, 0.1);
      leaf.add(knob);
      (parts.door ??= []).push(knob);
      group.add(leaf);
      [1.1, 0, -1.1].forEach((y, i) => {
        const barrel = add(group, parts, "hinges", new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.42, 16), material(0xbfc5cd, { metalness: 0.8, roughness: 0.3 })));
        barrel.position.set(-0.93, y, 0.14);
        // the top pin is drawn pulled up a little, the way it is when you oil it
        const pin = add(group, parts, "pin", new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 10), material(0x8d949e, { metalness: 0.8 })));
        pin.position.set(-0.93, y + (i === 0 ? 0.22 : 0.02), 0.14);
      });
      return { group, parts };
    },

    faucet() {
      const group = new THREE.Group();
      const parts: Parts = {};
      const chrome = material(0xcfd5dc, { metalness: 0.85, roughness: 0.22 });
      const counter = add(group, parts, "counter", new THREE.Mesh(new THREE.BoxGeometry(3, 0.12, 1.8), material(0xe7e2d8)));
      counter.position.y = -0.6;
      add(group, parts, "spout", rod(v(0, -0.54, 0), v(0, 0.5, 0), 0.13, chrome));
      const arc = add(group, parts, "spout", new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.075, 14, 32, Math.PI), chrome));
      arc.position.set(0, 0.5, 0.4);
      arc.rotation.y = Math.PI / 2;
      add(group, parts, "spout", rod(v(0, 0.5, 0.8), v(0, 0.28, 0.8), 0.075, chrome));
      // the handle is lifted off, with the washer under it
      const stem = add(group, parts, "handle", rod(v(0.6, -0.54, 0), v(0.6, -0.2, 0), 0.07, chrome));
      void stem;
      const washer = add(group, parts, "washer", new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.03, 10, 24), material(0x1f2933)));
      washer.position.set(0.6, -0.08, 0);
      washer.rotation.x = Math.PI / 2;
      const knob = add(group, parts, "handle", new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.2, 20), chrome));
      knob.position.set(0.6, 0.22, 0);
      add(group, parts, "handle", rod(v(0.6, 0.3, 0), v(1, 0.36, 0), 0.035, chrome));
      // under the counter: the supply pipe and its shut-off valve
      add(group, parts, "pipe", rod(v(0.6, -0.66, 0), v(0.6, -1.7, 0), 0.05, material(0xb87333, { metalness: 0.6 })));
      const valve = add(group, parts, "valve", new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.07, 6), material(0x2f6fd8)));
      valve.position.set(0.6, -1.25, 0.12);
      valve.rotation.x = Math.PI / 2;
      group.position.y = 0.5;
      return { group, parts };
    },
  };
}

export function Guide3D({ guideId, step, className = "" }: { guideId: string; step: number; className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const focusRef = useRef<string[]>([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const config = GUIDE_MODELS[guideId];
  const file = GUIDE_FILES[guideId];
  const focus = config ? config.steps[Math.min(step, config.steps.length - 1)] ?? [] : [];
  focusRef.current = focus;

  useEffect(() => {
    if ((!config && !file) || !holder.current) return undefined;
    const element = holder.current;
    let stopped = false;
    let cleanUp = () => {};

    (async () => {
      try {
        const THREE = await import("three");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        if (stopped) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        element.appendChild(renderer.domElement);
        renderer.domElement.style.touchAction = "pan-y";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
        camera.position.set(3.4, 2.2, 5.2);
        scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7558, 1.5));
        const sun = new THREE.DirectionalLight(0xffffff, 1.6);
        sun.position.set(4, 6, 5);
        scene.add(sun);

        let parts: Parts = {};
        if (config) {
          const built = builders(THREE)[config.model]();
          parts = built.parts;
          scene.add(built.group);
        } else {
          const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
          const loaded = await new GLTFLoader().loadAsync(`/models/${file}`);
          if (stopped) return;
          // every model comes in its own size, so fit it into the same box and centre it
          const model = loaded.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const scale = 3.2 / Math.max(size.x, size.y, size.z, 0.001);
          model.scale.setScalar(scale);
          const centre = box.getCenter(new THREE.Vector3()).multiplyScalar(scale);
          model.position.sub(centre);
          scene.add(model);
        }

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        controls.autoRotateSpeed = 1.2;

        const resize = () => {
          const width = element.clientWidth;
          const height = element.clientHeight;
          renderer.setSize(width, height, false);
          renderer.domElement.style.width = "100%";
          renderer.domElement.style.height = "100%";
          camera.aspect = width / Math.max(1, height);
          camera.updateProjectionMatrix();
        };
        const watcher = new ResizeObserver(resize);
        watcher.observe(element);
        resize();

        const glow = new THREE.Color(0xff7a1a);
        const dark = new THREE.Color(0x000000);
        let frame = 0;
        const draw = (time: number) => {
          frame = requestAnimationFrame(draw);
          const pulse = 0.55 + 0.45 * Math.sin(time / 260);
          for (const [name, meshes] of Object.entries(parts)) {
            const lit = focusRef.current.includes(name);
            for (const mesh of meshes) {
              const mat = mesh.material as THREE_NS.MeshStandardMaterial;
              mat.emissive.copy(lit ? glow : dark);
              mat.emissiveIntensity = lit ? pulse * 1.8 : 0;
            }
          }
          controls.update();
          renderer.render(scene, camera);
        };
        frame = requestAnimationFrame(draw);
        setReady(true);

        cleanUp = () => {
          cancelAnimationFrame(frame);
          watcher.disconnect();
          controls.dispose();
          scene.traverse((object) => {
            const mesh = object as THREE_NS.Mesh;
            if (mesh.isMesh) {
              mesh.geometry.dispose();
              (mesh.material as THREE_NS.Material).dispose();
            }
          });
          renderer.dispose();
          renderer.domElement.remove();
        };
        if (stopped) cleanUp();
      } catch {
        // no WebGL on this device: the guide works the same without the picture
        setFailed(true);
      }
    })();

    return () => {
      stopped = true;
      cleanUp();
    };
  }, [config, file]);

  if ((!config && !file) || failed) return null;

  return (
    <figure className={`no-print ${className}`}>
      <div
        ref={holder}
        role="img"
        aria-label={
          config
            ? `3D picture for this guide. Highlighted: ${focus.map((p) => PART_NAMES[p] ?? p).join(" and ")}.`
            : "3D model of the item this guide is about."
        }
        className="relative h-56 w-full cursor-grab overflow-hidden rounded-card bg-gradient-to-b from-workshop-100 to-workshop-200 active:cursor-grabbing sm:h-64"
      >
        {!ready && <span className="absolute inset-0 animate-pulse" />}
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-workshop-600">
        {config ? (
          <>
            <span>
              <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#ff7a1a] align-middle" />
              This step: <strong className="text-workshop-900">{focus.map((p) => PART_NAMES[p] ?? p).join(" and ")}</strong>
            </span>
            <span>Simplified picture, not to scale. Drag to turn it.</span>
          </>
        ) : (
          <>
            <span>Drag to turn it. A general model, yours will look different.</span>
            <span>
              Model by{" "}
              <a
                href={file?.startsWith("ph/") ? "https://polyhaven.com" : "https://kenney.nl"}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {file?.startsWith("ph/") ? "Poly Haven" : "Kenney"}
              </a>{" "}
              (CC0)
            </span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
