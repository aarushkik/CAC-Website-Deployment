"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { getGuide } from "@/lib/data";
import type { Model3D } from "@/lib/models";
import { Icon } from "./Icon";

/**
 * A ring of 3D models that turns by itself. Every model spins on its own spot,
 * the ring brings the next one to the front every few seconds, and a drag or a
 * swipe turns the ring by hand. All of it is one 3D scene, so even a phone only
 * has to draw one picture.
 */
export function Carousel3D({ models, className = "" }: { models: Model3D[]; className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [front, setFront] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // the 3D loop reads these, React writes them
  const target = useRef(0);
  const lastTouch = useRef(0);

  const count = models.length;
  const go = (index: number) => {
    target.current = index;
    lastTouch.current = Date.now();
    setFront(((index % count) + count) % count);
  };

  useEffect(() => {
    if (!holder.current || count === 0) return undefined;
    const element = holder.current;
    let stopped = false;
    let cleanUp = () => {};

    (async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        if (stopped) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        element.appendChild(renderer.domElement);
        renderer.domElement.style.touchAction = "pan-y";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
        // looking down a little, so things that lie flat can still be seen
        camera.position.set(0, 3.4, 10.4);
        camera.lookAt(0, -0.35, 1.6);
        scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7558, 1.5));
        const sun = new THREE.DirectionalLight(0xffffff, 1.8);
        sun.position.set(3, 7, 6);
        scene.add(sun);

        // the turntable the models stand on
        const radius = 3.3;
        const ring = new THREE.Group();
        scene.add(ring);
        const deck = new THREE.Mesh(
          new THREE.CylinderGeometry(radius + 1.1, radius + 1.1, 0.12, 64),
          new THREE.MeshStandardMaterial({ color: 0x2f271d, roughness: 0.85 }),
        );
        deck.position.y = -1.06;
        ring.add(deck);
        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(radius + 1.1, 0.05, 8, 64),
          new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 }),
        );
        rim.rotation.x = Math.PI / 2;
        rim.position.y = -1;
        ring.add(rim);

        const step = (Math.PI * 2) / count;
        const spots: THREE_NS.Group[] = [];
        const loader = new GLTFLoader();
        models.forEach((model, i) => {
          const spot = new THREE.Group();
          // index 0 starts at the front, towards the camera
          spot.position.set(Math.sin(i * step) * radius, 0, Math.cos(i * step) * radius);
          ring.add(spot);
          spots.push(spot);
          loader
            .loadAsync(`/models/${model.file}`)
            .then((loaded) => {
              if (stopped) return;
              const object = loaded.scene;
              const box = new THREE.Box3().setFromObject(object);
              const size = box.getSize(new THREE.Vector3());
              const longest = Math.max(size.x, size.y, size.z, 0.001);
              const scale = 1.75 / longest;
              object.scale.setScalar(scale);
              const centre = box.getCenter(new THREE.Vector3()).multiplyScalar(scale);
              if (size.y < longest * 0.3) {
                // a flat thing (a controller, a wrench) is propped up like on a display stand
                object.position.set(-centre.x, -centre.y, -centre.z);
                const stand = new THREE.Group();
                stand.rotation.x = Math.PI / 2.6;
                stand.position.y = -0.15;
                stand.add(object);
                spot.add(stand);
              } else {
                object.position.set(-centre.x, -box.min.y * scale - 1, -centre.z);
                spot.add(object);
              }
              if (i === 0) setReady(true);
            })
            .catch(() => undefined);
        });

        const resize = () => {
          const width = element.clientWidth;
          const height = element.clientHeight;
          renderer.setSize(width, height, false);
          renderer.domElement.style.width = "100%";
          renderer.domElement.style.height = "100%";
          camera.aspect = width / Math.max(1, height);
          // a narrow screen needs the camera further back to keep the neighbours in view
          camera.position.z = camera.aspect < 1 ? 13.5 : 10.4;
          camera.lookAt(0, -0.35, 1.6);
          camera.updateProjectionMatrix();
        };
        const watcher = new ResizeObserver(resize);
        watcher.observe(element);
        resize();

        // drag or swipe sideways to turn the ring
        let dragFrom: number | null = null;
        let dragStart = 0;
        const down = (e: PointerEvent) => {
          dragFrom = e.clientX;
          dragStart = target.current;
          lastTouch.current = Date.now();
        };
        const move = (e: PointerEvent) => {
          if (dragFrom === null) return;
          target.current = dragStart - (e.clientX - dragFrom) / 140;
          lastTouch.current = Date.now();
        };
        const up = () => {
          if (dragFrom === null) return;
          dragFrom = null;
          target.current = Math.round(target.current);
          setFront(((target.current % count) + count) % count);
        };
        renderer.domElement.addEventListener("pointerdown", down);
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);

        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let before = performance.now();
        let turned = 0;
        let sinceAdvance = 0;
        let frame = 0;
        const draw = () => {
          frame = requestAnimationFrame(draw);
          const now = performance.now();
          const dt = Math.min((now - before) / 1000, 0.05);
          before = now;

          // move on by itself, unless someone touched it in the last few seconds
          sinceAdvance += dt;
          if (!still && dragFrom === null && sinceAdvance > 3.2 && Date.now() - lastTouch.current > 6000) {
            sinceAdvance = 0;
            target.current = Math.round(target.current) + 1;
            setFront(((target.current % count) + count) % count);
          }

          turned += (target.current - turned) * Math.min(1, dt * 4.5);
          ring.rotation.y = -turned * step;

          spots.forEach((spot, i) => {
            // how far this spot is from the front, 0 = at the front
            const away = Math.abs((((i - turned) % count) + count * 1.5) % count - count / 2);
            const grow = 1 + 0.55 * Math.max(0, 1 - away);
            spot.scale.setScalar(spot.scale.x + (grow - spot.scale.x) * Math.min(1, dt * 6));
            if (!still) spot.rotation.y += dt * (away < 0.5 ? 0.9 : 0.35);
          });
          renderer.render(scene, camera);
        };
        frame = requestAnimationFrame(draw);

        cleanUp = () => {
          cancelAnimationFrame(frame);
          watcher.disconnect();
          renderer.domElement.removeEventListener("pointerdown", down);
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          scene.traverse((object) => {
            const mesh = object as THREE_NS.Mesh;
            if (mesh.isMesh) {
              mesh.geometry.dispose();
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((m) => m.dispose());
            }
          });
          renderer.dispose();
          renderer.domElement.remove();
        };
        if (stopped) cleanUp();
      } catch {
        setFailed(true);
      }
    })();

    return () => {
      stopped = true;
      cleanUp();
    };
    // the list of models is fixed for the life of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  if (failed || count === 0) return null;
  const model = models[front];
  const guide = model.guides.map((id) => getGuide(id)).find(Boolean);

  return (
    <div className={className}>
      <div className="relative">
        <div
          ref={holder}
          role="img"
          aria-label={`Turning display of 3D models. In front: ${model.name}.`}
          className="h-64 w-full cursor-grab touch-pan-y overflow-hidden rounded-card bg-gradient-to-b from-workshop-100 to-workshop-200 active:cursor-grabbing sm:h-80"
        >
          {!ready && <span className="absolute inset-0 animate-pulse rounded-card bg-workshop-200/60" />}
        </div>
        <button
          type="button"
          onClick={() => go(Math.round(target.current) - 1)}
          aria-label="Previous model"
          className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-workshop-900 bg-surface text-workshop-900 shadow-card transition hover:scale-110 active:scale-95"
        >
          <Icon name="back" size={18} />
        </button>
        <button
          type="button"
          onClick={() => go(Math.round(target.current) + 1)}
          aria-label="Next model"
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-workshop-900 bg-surface text-workshop-900 shadow-card transition hover:scale-110 active:scale-95"
        >
          <Icon name="arrow" size={18} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3" aria-live="polite">
        <div key={model.id} className="animate-rise">
          <p className="font-bold text-workshop-900">{model.name}</p>
          <p className="text-sm text-workshop-800">
            {guide ? `${guide.title} · ${guide.time}` : "In the 3D workshop"}
          </p>
        </div>
        <Link
          href={guide ? `/guide/${guide.id}` : "/models"}
          className="flex min-h-[2.75rem] flex-none items-center gap-1.5 rounded-xl bg-brand-600 px-4 text-sm font-bold text-white transition hover:brightness-110 active:scale-95"
        >
          {guide ? "Open guide" : "See all"}
          <Icon name="arrow" size={16} />
        </Link>
      </div>
      <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
        {models.map((m, i) => (
          <span key={m.id} className={`h-1.5 rounded-full transition-all duration-300 ${i === front ? "w-6 bg-brand-600" : "w-1.5 bg-workshop-300"}`} />
        ))}
      </div>
    </div>
  );
}
