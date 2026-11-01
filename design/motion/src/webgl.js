import {
  Box,
  Camera,
  Color,
  Curve,
  Geometry,
  Mesh,
  Polyline,
  Program,
  Renderer,
  Torus,
  Transform,
  Vec3
} from "ogl";

const INK = "#101820";
const PAPER = "#f2eee6";
const COPPER = "#b5562b";
const APPROVED = "#2f6b4f";
const HAIRLINE = "#cfc8ba";

const flatVertex = `
  precision highp float;
  attribute vec3 position;
  attribute vec3 normal;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const flatFragment = `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uLight;
  varying vec3 vNormal;
  void main() {
    float light = abs(dot(normalize(vNormal), normalize(uLight)));
    vec3 color = mix(uColor * 0.9, uColor, 0.55 + 0.45 * light);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const cableFragment = `
  precision highp float;
  uniform vec3 uColor;
  uniform float uReveal;
  varying vec2 vUv;
  void main() {
    if (vUv.y > uReveal) discard;
    gl_FragColor = vec4(uColor, 1.0);
  }
`;

const edgeVertex = `
  attribute vec3 position;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const edgeFragment = `
  precision highp float;
  uniform vec3 wireColor;
  void main() {
    gl_FragColor = vec4(wireColor, 1.0);
  }
`;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOut = (value) => 1 - Math.pow(1 - clamp(value), 3);
const easeInOut = (value) => {
  const t = clamp(value);
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};
const damp = (value, target, lambda, dt) => value + (target - value) * (1 - Math.exp(-lambda * dt));

function color(value) {
  return new Color(value);
}

function makeProgram(gl, value) {
  return new Program(gl, {
    vertex: flatVertex,
    fragment: flatFragment,
    uniforms: {
      uColor: { value: color(value) },
      uLight: { value: new Vec3(0.45, 1, 0.65) }
    }
  });
}

function boxEdgeGeometry(gl, width, height, depth) {
  const x = width / 2;
  const y = height / 2;
  const z = depth / 2;
  const position = new Float32Array([
    -x, -y, -z,
     x, -y, -z,
     x,  y, -z,
    -x,  y, -z,
    -x, -y,  z,
     x, -y,  z,
     x,  y,  z,
    -x,  y,  z
  ]);
  const index = new Uint16Array([
    0, 1, 1, 2, 2, 3, 3, 0,
    4, 5, 5, 6, 6, 7, 7, 4,
    0, 4, 1, 5, 2, 6, 3, 7
  ]);
  return new Geometry(gl, {
    position: { size: 3, data: position },
    index: { data: index }
  });
}

function addBox(gl, parent, options) {
  const { width, height, depth, x, y, z, rotY = 0, face = PAPER, edge = INK, edges = true } = options;
  const group = new Transform();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  const geometry = new Box(gl, { width, height, depth });
  const mesh = new Mesh(gl, { geometry, program: makeProgram(gl, face) });
  group.addChild(mesh);

  let wire = null;
  if (edges) {
    wire = new Mesh(gl, {
      mode: gl.LINES,
      geometry: boxEdgeGeometry(gl, width, height, depth),
      program: new Program(gl, {
        vertex: edgeVertex,
        fragment: edgeFragment,
        uniforms: { wireColor: { value: color(edge) } }
      })
    });
    group.addChild(wire);
  }
  parent.addChild(group);
  return { group, mesh, wire };
}

function addCable(gl, parent, options) {
  const { points, value = COPPER, thickness = 2.4, reveal = 1 } = options;
  const line = new Polyline(gl, {
    points,
    fragment: cableFragment,
    uniforms: {
      uColor: { value: color(value) },
      uThickness: { value: thickness },
      uReveal: { value: reveal }
    }
  });
  line.mesh.frustumCulled = false;
  parent.addChild(line.mesh);
  return line;
}

function addLabel(layer, text, className = "") {
  const el = document.createElement("span");
  el.className = `motion-label ${className}`.trim();
  el.textContent = text;
  layer.appendChild(el);
  return { el, pos: new Vec3(), visible: false };
}

function lerpVec(out, a, b, t) {
  out[0] = a[0] + (b[0] - a[0]) * t;
  out[1] = a[1] + (b[1] - a[1]) * t;
  out[2] = a[2] + (b[2] - a[2]) * t;
  return out;
}

function samplePoints(points, t) {
  if (!points.length) return new Vec3();
  const p = clamp(t) * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(p));
  const local = p - index;
  const a = points[index];
  const b = points[index + 1] || points[index];
  return new Vec3(
    a[0] + (b[0] - a[0]) * local,
    a[1] + (b[1] - a[1]) * local,
    a[2] + (b[2] - a[2]) * local
  );
}

function projectPoint(world, camera, rect, out) {
  const m = camera.projectionViewMatrix;
  const x = m[0] * world[0] + m[4] * world[1] + m[8] * world[2] + m[12];
  const y = m[1] * world[0] + m[5] * world[1] + m[9] * world[2] + m[13];
  const w = m[3] * world[0] + m[7] * world[1] + m[11] * world[2] + m[15];
  if (w <= 0.0001) return false;
  const ndcX = x / w;
  const ndcY = y / w;
  out.x = rect.left + (ndcX * 0.5 + 0.5) * rect.width;
  out.y = rect.top + (1 - (ndcY * 0.5 + 0.5)) * rect.height;
  return ndcX > -1.15 && ndcX < 1.15 && ndcY > -1.15 && ndcY < 1.15;
}

function updateLabels(labels, camera, rect, active) {
  for (const label of labels) {
    const visible = active && projectPoint(label.pos, camera, rect, label);
    label.visible = visible;
    label.el.classList.toggle("is-visible", visible);
    if (visible) {
      label.el.style.transform = `translate(${label.x.toFixed(1)}px, ${label.y.toFixed(1)}px) translate(-50%, -50%)`;
    }
  }
}

function createHero(gl, labelsLayer) {
  const scene = new Transform();

  const net = new Vec3(-1.8, 3.0, 0);
  const meter = new Vec3(-1.8, 2.0, 0);
  const mdb = new Vec3(-1.8, 0.8, 0);
  const busbar = new Vec3(-0.8, 0.8, 0);
  const busbarTop = new Vec3(-0.8, 1.2, 0);
  const busbarBottom = new Vec3(-0.8, -0.4, 0);
  const smdb1 = new Vec3(1.2, 1.2, 0);
  const smdb2 = new Vec3(1.2, -0.4, 0);
  const earth = new Vec3(-0.8, -1.8, 0);

  const nodes = [
    { ...addBox(gl, scene, { width: 1.6, height: 0.5, depth: 0.18, x: net[0], y: net[1], z: net[2] }), baseY: net[1], label: "DEWA LV NETWORK" },
    { ...addBox(gl, scene, { width: 0.56, height: 0.74, depth: 0.18, x: meter[0], y: meter[1], z: meter[2] }), baseY: meter[1], label: "CT METER" },
    { ...addBox(gl, scene, { width: 0.7, height: 1.14, depth: 0.18, x: mdb[0], y: mdb[1], z: mdb[2] }), baseY: mdb[1], label: "MDB" },
    { ...addBox(gl, scene, { width: 0.28, height: 0.28, depth: 0.14, x: busbar[0], y: busbar[1], z: busbar[2] }), baseY: busbar[1], label: "BUSBAR" },
    { ...addBox(gl, scene, { width: 0.6, height: 0.66, depth: 0.16, x: smdb1[0], y: smdb1[1], z: smdb1[2] }), baseY: smdb1[1], label: "SMDB-01" },
    { ...addBox(gl, scene, { width: 0.6, height: 0.66, depth: 0.16, x: smdb2[0], y: smdb2[1], z: smdb2[2] }), baseY: smdb2[1], label: "SMDB-02" },
    { ...addBox(gl, scene, { width: 0.3, height: 0.3, depth: 0.1, x: earth[0], y: earth[1], z: earth[2] }), baseY: earth[1], label: "EARTH" }
  ];

  const mainRoute = [net, meter, mdb, busbar];
  const branchOne = [busbar, busbarTop, smdb1];
  const branchTwo = [busbar, busbarBottom, smdb2];
  const earthRun = [busbarBottom, earth];
  const cables = [
    addCable(gl, scene, { points: mainRoute, thickness: 0.72, reveal: 0 }),
    addCable(gl, scene, { points: branchOne, thickness: 0.58, reveal: 0 }),
    addCable(gl, scene, { points: branchTwo, thickness: 0.58, reveal: 0 }),
    addCable(gl, scene, { points: earthRun, value: APPROVED, thickness: 0.58, reveal: 0 })
  ];

  const pulse = addBox(gl, scene, {
    width: 0.16,
    height: 0.16,
    depth: 0.16,
    x: net[0],
    y: net[1],
    z: net[2] + 0.14,
    face: COPPER,
    edge: COPPER,
    edges: false
  });
  pulse.group.visible = false;

  const labels = [
    addLabel(labelsLayer, "DEWA LV NETWORK", "motion-label--dim"),
    addLabel(labelsLayer, "CT METER"),
    addLabel(labelsLayer, "MDB"),
    addLabel(labelsLayer, "BUSBAR", "motion-label--copper"),
    addLabel(labelsLayer, "SMDB-01", "motion-label--copper"),
    addLabel(labelsLayer, "SMDB-02", "motion-label--copper"),
    addLabel(labelsLayer, "EARTH", "motion-label--approved"),
    addLabel(labelsLayer, "SCALE NTS / A-101", "motion-label--dim")
  ];
  labels[0].pos.set(net[0], net[1] + 0.48, 0.1);
  labels[1].pos.set(meter[0] + 0.54, meter[1] + 0.1, 0.1);
  labels[2].pos.set(mdb[0], mdb[1] - 0.72, 0.1);
  labels[3].pos.set(busbar[0], busbar[1] + 0.62, 0.1);
  labels[4].pos.set(smdb1[0] + 0.54, smdb1[1], 0.1);
  labels[5].pos.set(smdb2[0] + 0.54, smdb2[1], 0.1);
  labels[6].pos.set(earth[0] + 0.46, earth[1], 0.1);
  labels[7].pos.set(net[0] - 0.2, -2.45, 0.1);

  const camStart = new Vec3(0.6, 4.2, 13.2);
  const camEnd = new Vec3(5.0, 5.0, 15.2);
  const target = new Vec3(-0.55, 0.4, 0);
  const cameraPosition = new Vec3();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let progress = 0;
  let current = 0;
  let introStart = null;

  const update = (time, dt) => {
    current = damp(current, progress, 5, dt);
    if (introStart === null) introStart = time;
    const elapsed = (time - introStart) / 1000;
    const entry = easeOut(clamp(elapsed / 0.65));

    nodes.forEach((node, index) => {
      const rise = easeOut(clamp((elapsed - index * 0.04) / 0.5));
      node.group.position.y = node.baseY + (1 - rise) * 0.9;
    });

    pointer.x = damp(pointer.x, pointer.tx, 4, dt);
    pointer.y = damp(pointer.y, pointer.ty, 4, dt);

    lerpVec(cameraPosition, camStart, camEnd, easeInOut(current));
    cameraPosition.x += pointer.x * 0.35 + Math.sin(time * 0.00022) * 0.05;
    cameraPosition.y += pointer.y * 0.2;

    const cableReveal = clamp(entry * 0.96 + current * 0.04);
    cables[0].program.uniforms.uReveal.value = clamp((cableReveal - 0.01) / 0.99);
    cables[1].program.uniforms.uReveal.value = clamp((cableReveal - 0.08) / 0.92);
    cables[2].program.uniforms.uReveal.value = clamp((cableReveal - 0.12) / 0.88);
    cables[3].program.uniforms.uReveal.value = clamp((cableReveal - 0.16) / 0.84);

    const pulseElapsed = elapsed - 0.85;
    const pulseVisible = pulseElapsed > 0 && pulseElapsed < 5.2;
    pulse.group.visible = pulseVisible;
    if (pulseVisible) {
      const cycleLength = 2.35;
      const local = (pulseElapsed % cycleLength) / cycleLength;
      const point = samplePoints([net, meter, mdb, busbar, busbarTop, smdb1], Math.min(1, local));
      pulse.group.position.copy(point);
      pulse.group.position.z += 0.14;
    }

    const approved = elapsed > 4.4 ? 1 : 0;
    [nodes[4].wire, nodes[5].wire, nodes[6].wire].forEach((wire) => {
      if (wire) wire.program.uniforms.wireColor.value.set(approved ? APPROVED : INK);
    });

    return { cameraPosition, target, pointer };
  };

  const setPointer = (x, y) => {
    pointer.tx = clamp(x, -1, 1) * 0.9;
    pointer.ty = clamp(y, -1, 1) * 0.6;
  };

  return {
    scene,
    labels,
    update,
    setPointer,
    setProgress: (value) => {
      progress = clamp(value);
    }
  };
}

function createProcess(gl, labelsLayer) {
  const scene = new Transform();

  const stationPoints = [
    new Vec3(-8, 0, 0),
    new Vec3(-4.5, 1.2, -1.5),
    new Vec3(-1, -0.5, 1.5),
    new Vec3(2.5, 1, -1),
    new Vec3(6, -0.4, 1.2),
    new Vec3(9.5, 0.6, 0)
  ];
  const cameraCurve = new Curve({
    points: [
      new Vec3(-11, 3.1, 8.1),
      new Vec3(-9, 2.8, 7.7),
      new Vec3(-5, 2.8, 7.7),
      new Vec3(-1, 2.8, 7.7),
      new Vec3(3, 2.8, 7.7),
      new Vec3(7, 2.8, 7.7),
      new Vec3(11, 3.1, 8.1)
    ],
    divisions: 160
  }).getPoints(160);
  const stationCurve = new Curve({ points: stationPoints, divisions: 160 }).getPoints(160);

  const cable = addCable(gl, scene, {
    points: stationCurve,
    thickness: 0.78,
    reveal: 0
  });

  const stations = stationPoints.map((point, index) => {
    const group = new Transform();
    group.position.copy(point);
    group.rotation.y = -0.22 + index * 0.025;
    scene.addChild(group);

    const board = addBox(gl, group, {
      width: 0.98,
      height: 0.6,
      depth: 0.05,
      x: 0,
      y: 0,
      z: 0,
      face: PAPER,
      edge: INK
    });

    const sheetPivot = new Transform();
    sheetPivot.position.set(0, 0.36, -0.04);
    group.addChild(sheetPivot);

    const sheet = addBox(gl, sheetPivot, {
      width: 0.88,
      height: 0.52,
      depth: 0.018,
      x: 0,
      y: 0.26,
      z: 0,
      face: "#e8e1d4",
      edge: INK
    });
    sheetPivot.rotation.x = -1.25;

    return { point, group, board, sheet, sheetPivot, baseY: point[1] };
  });

  const cloudPoints = [];
  const cloudCenter = stationPoints[3];
  for (let i = 0; i <= 14; i += 1) {
    const angle = (i / 14) * Math.PI * 2;
    const radius = 0.52 + (i % 3) * 0.09;
    cloudPoints.push(new Vec3(
      cloudCenter[0] + Math.cos(angle) * radius,
      cloudCenter[1] + Math.sin(angle) * radius,
      cloudCenter[2] + 0.12
    ));
  }
  const cloud = addCable(gl, scene, {
    points: cloudPoints,
    value: COPPER,
    thickness: 0.4,
    reveal: 1
  });
  cloud.mesh.position.z = 0.2;

  const checks = [];
  for (let i = 0; i < 3; i += 1) {
    const check = addBox(gl, scene, {
      width: 0.22,
      height: 0.035,
      depth: 0.035,
      x: stationPoints[4][0] - 0.25 + i * 0.24,
      y: stationPoints[4][1] + 0.62,
      z: stationPoints[4][2] + 0.2,
      face: APPROVED,
      edge: APPROVED,
      edges: false
    });
    check.group.rotation.z = -0.55;
    check.group.scale.set(0.001, 0.001, 0.001);
    checks.push(check);
  }

  const dial = new Transform();
  dial.position.set(stationPoints[5][0], stationPoints[5][1] + 0.02, stationPoints[5][2] + 0.18);
  scene.addChild(dial);
  const ring = new Mesh(gl, {
    geometry: new Torus(gl, { radius: 0.23, tube: 0.012, radialSegments: 4, tubularSegments: 36 }),
    program: makeProgram(gl, INK)
  });
  dial.addChild(ring);
  const needlePivot = new Transform();
  needlePivot.position.set(0, 0, 0.03);
  dial.addChild(needlePivot);
  const needle = new Mesh(gl, {
    geometry: new Box(gl, { width: 0.18, height: 0.018, depth: 0.008 }),
    program: makeProgram(gl, APPROVED)
  });
  needle.position.x = 0.09;
  needlePivot.addChild(needle);
  needlePivot.rotation.z = -0.9;

  const tab = addBox(gl, scene, {
    width: 0.12,
    height: 0.12,
    depth: 0.12,
    x: stationPoints[0][0],
    y: stationPoints[0][1] + 0.72,
    z: stationPoints[0][2],
    face: COPPER,
    edge: COPPER,
    edges: false
  });

  const labels = stationPoints.map((point, index) => {
    const label = addLabel(labelsLayer, `0${index + 1}`);
    label.pos.set(point[0], point[1] + 0.58, point[2] + 0.4);
    return label;
  });


  const cameraPosition = new Vec3();
  const target = new Vec3();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let progress = 0;
  let current = 0;

  const update = (time, dt) => {
    current = damp(current, progress, 5.5, dt);
    pointer.x = damp(pointer.x, pointer.tx, 4, dt);
    pointer.y = damp(pointer.y, pointer.ty, 4, dt);

    const cameraPoint = samplePoints(cameraCurve, current);
    cameraPosition.copy(cameraPoint);
    cameraPosition.x += pointer.x * 0.35;
    cameraPosition.y += pointer.y * 0.2;
    const lookPoint = samplePoints(stationCurve, clamp(current + 0.06));
    target.set(lookPoint[0], lookPoint[1] + 0.45, lookPoint[2]);

    cable.program.uniforms.uReveal.value = clamp((current - 0.01) / 0.88);

    stations.forEach((station, index) => {
      const local = clamp((current - (index / Math.max(1, stations.length - 1)) * 0.72) / 0.2);
      station.sheetPivot.rotation.x = -1.25 * (1 - easeOut(local));
      station.group.position.y = station.baseY + (1 - easeOut(local)) * 0.12;
      if (index === stations.length - 1) {
        const green = clamp((current - 0.93) / 0.05);
        if (station.board.wire) {
          station.board.wire.program.uniforms.wireColor.value.set(green > 0.5 ? APPROVED : INK);
        }
      }
    });

    const resolve = easeInOut(clamp((current - 0.7) / 0.08));
    cloud.mesh.visible = current < 0.79;
    const cloudScale = Math.max(0.001, 1 - resolve);
    cloud.mesh.scale.set(cloudScale, cloudScale, cloudScale);
    cloud.program.uniforms.uReveal.value = 1;

    checks.forEach((check, index) => {
      const local = clamp((current - 0.8 - index * 0.012) / 0.06);
      const scale = easeOut(local);
      const checkScale = Math.max(0.001, scale);
      check.group.scale.set(checkScale, checkScale, checkScale);
      check.group.visible = current > 0.8;
    });

    needlePivot.rotation.z = -0.9 + easeInOut(clamp((current - 0.9) / 0.1)) * 1.8;

    const activeIndex = Math.min(stations.length - 1, Math.floor(current * stations.length));
    const activePoint = stationPoints[activeIndex];
    tab.group.position.set(activePoint[0], activePoint[1] + 0.72, activePoint[2]);

    return { cameraPosition, target, pointer, activeIndex };
  };

  const setPointer = (x, y) => {
    pointer.tx = clamp(x, -1, 1) * 0.9;
    pointer.ty = clamp(y, -1, 1) * 0.6;
  };

  return {
    scene,
    labels,
    update,
    setPointer,
    setProgress: (value) => {
      progress = clamp(value);
    }
  };
}

export function createStage({ canvas, labelsLayer, hero, process, processVisual, onLost }) {
  const renderer = new Renderer({
    canvas,
    dpr: Math.min(window.devicePixelRatio || 1, 1.75),
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    powerPreference: "high-performance"
  });
  const gl = renderer.gl;
  renderer.autoClear = false;
  gl.clearColor(0, 0, 0, 0);

  const camera = new Camera(gl, { fov: 34, near: 0.1, far: 120, aspect: 1 });
  const heroScene = createHero(gl, labelsLayer);
  const processScene = createProcess(gl, labelsLayer);

  const pointer = { x: 0, y: 0 };
  const onPointerMove = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    heroScene.setPointer(pointer.x, pointer.y);
    processScene.setPointer(pointer.x, pointer.y);
    wake();
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  const resize = () => {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    renderer.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setSize(width, height);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const heroRect = { left: 0, top: 0, width: 1, height: 1, bottom: 1 };
  const processRect = { left: 0, top: 0, width: 1, height: 1, bottom: 1 };
  let frameId = 0;
  let lastTime = 0;
  let destroyed = false;
  let active = null;

  const refreshRects = () => {
    const heroBox = hero.getBoundingClientRect();
    heroRect.left = heroBox.left;
    heroRect.top = heroBox.top;
    heroRect.width = Math.max(1, heroBox.width);
    heroRect.height = Math.max(1, heroBox.height);
    heroRect.bottom = heroBox.bottom;

    const processBox = processVisual.getBoundingClientRect();
    processRect.left = processBox.left;
    processRect.top = processBox.top;
    processRect.width = Math.max(1, processBox.width);
    processRect.height = Math.max(1, processBox.height);
    processRect.bottom = processBox.bottom;
  };

  const clear = () => {
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  };

  const drawScene = (scene, rect, updateResult) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dpr = renderer.dpr;
    const width = Math.max(1, rect.width * dpr);
    const height = Math.max(1, rect.height * dpr);
    const x = rect.left * dpr;
    const y = (vh - rect.bottom) * dpr;

    const left = Math.max(0, Math.round(rect.left * dpr));
    const right = Math.min(Math.round(vw * dpr), Math.round((rect.left + rect.width) * dpr));
    const top = Math.max(0, Math.round(rect.top * dpr));
    const bottom = Math.min(Math.round(vh * dpr), Math.round((rect.top + rect.height) * dpr));
    if (right <= left || bottom <= top) return;

    camera.aspect = rect.width / rect.height;
    camera.perspective({ aspect: camera.aspect });
    camera.position.copy(updateResult.cameraPosition);
    camera.lookAt(updateResult.target);
    camera.updateMatrixWorld();

    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(left, Math.round(vh * dpr) - bottom, right - left, bottom - top);
    renderer.width = rect.width;
    renderer.height = rect.height;
    renderer.state.viewport.width = 0;
    renderer.setViewport(width, height, x, y);
    renderer.render({ scene: scene.scene, camera, clear: false });
    gl.disable(gl.SCISSOR_TEST);
    renderer.width = window.innerWidth;
    renderer.height = window.innerHeight;
  };

  const frame = (time) => {
    frameId = 0;
    if (destroyed) return;
    const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0.016;
    lastTime = time;

    refreshRects();
    const vh = window.innerHeight;
    const processVisible = processRect.bottom > 0 && processRect.top < vh && processRect.height > 20;
    const heroVisible = heroRect.bottom > 0 && heroRect.top < vh;

    if (!processVisible && !heroVisible) {
      if (active) {
        clear();
        heroScene.labels.forEach((label) => label.el.classList.remove("is-visible"));
        processScene.labels.forEach((label) => label.el.classList.remove("is-visible"));
      }
      active = null;
      return;
    }

    active = processVisible ? "process" : "hero";
    const updateResult = active === "process"
      ? processScene.update(time, dt)
      : heroScene.update(time, dt);

    clear();
    drawScene(active === "process" ? processScene : heroScene, active === "process" ? processRect : heroRect, updateResult);

    updateLabels(heroScene.labels, camera, heroRect, active === "hero");
    updateLabels(processScene.labels, camera, processRect, active === "process");

    frameId = window.requestAnimationFrame(frame);
  };

  function wake() {
    if (!frameId && !destroyed) frameId = window.requestAnimationFrame(frame);
  }

  const onContextLost = (event) => {
    event.preventDefault();
    destroyed = true;
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
    if (onLost) onLost();
  };
  canvas.addEventListener("webglcontextlost", onContextLost, false);
  canvas.addEventListener("webglcontextrestored", () => {
    window.location.reload();
  }, false);

  const destroy = () => {
    destroyed = true;
    if (frameId) window.cancelAnimationFrame(frameId);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", resize);
    try {
      heroScene.scene.traverse((node) => {
        if (node.geometry) node.geometry.remove();
        if (node.program) node.program.remove();
      });
      processScene.scene.traverse((node) => {
        if (node.geometry) node.geometry.remove();
        if (node.program) node.program.remove();
      });
    } catch (error) {}
    heroScene.labels.concat(processScene.labels).forEach((label) => label.el.remove());
  };

  wake();

  return {
    wake,
    setHeroProgress: (value) => {
      heroScene.setProgress(value);
      wake();
    },
    setProcessProgress: (value) => {
      processScene.setProgress(value);
      wake();
    },
    destroy
  };
}
