import { useEffect, useRef } from "react";

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeObserver: ResizeObserver | null = null;

    const syncSize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => syncSize());
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      void main() {
        vec2 uv = v_texCoord;
        
        // Simulating the dynamic teal lines / city pulse mesh
        float wave1 = sin(uv.x * 6.0 + u_time * 0.8) * cos(uv.y * 6.0 + u_time * 0.4);
        float wave2 = cos(uv.x * 12.0 - u_time * 0.5) * sin(uv.y * 12.0 + u_time * 0.6);
        float distToMouse = distance(uv, u_mouse / u_resolution);
        float mouseInfluence = smoothstep(0.4, 0.0, distToMouse) * 0.15;
        
        float combinedWaves = (wave1 + wave2 * 0.5) * (1.0 + mouseInfluence * 5.0);
        
        // Base dark navy tone
        vec3 darkNavy = vec3(0.039, 0.039, 0.043); // #0A0A0B
        // Glowing smart teal
        vec3 smartTeal = vec3(0.96, 0.62, 0.04); // #F59E0B
        
        // Create glowing grid lines representation
        float gridX = smoothstep(0.98, 1.0, sin(uv.x * 40.0 + combinedWaves * 0.1));
        float gridY = smoothstep(0.98, 1.0, sin(uv.y * 40.0 + combinedWaves * 0.1));
        float grid = gridX + gridY;
        
        vec3 finalColor = mix(darkNavy, smartTeal, clamp(combinedWaves * 0.12 + grid * 0.18 + mouseInfluence * 0.3, 0.0, 1.0));
        
        // High quality dark gradient
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const compileShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compiler error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const compiledVs = compileShader(gl.VERTEX_SHADER, vs);
    const compiledFs = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!compiledVs || !compiledFs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, compiledVs);
    gl.attachShader(prog, compiledFs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    let mouseCoords = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = 1.0 - (e.clientY - rect.top) / rect.height;
        mouseCoords.x = nx * canvas.width;
        mouseCoords.y = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    const render = (t: number) => {
      if (!resizeObserver) syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouseCoords.x, mouseCoords.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block bg-slate-950"
    />
  );
}
