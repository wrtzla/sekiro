import React, { useRef, useMemo } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

// Augment the global JSX namespace to recognize React Three Fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

const EmberParticles: React.FC = () => {
  const count = 300;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  // Create dummy object for positioning
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random initial positions and speeds
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      
      // Update time
      t = particle.t += speed / 2;
      
      // Calculate position based on parametric equations (Lissajous-like movement)
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      // Apply positions
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );

      // Upward drift (fire embers)
      dummy.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 2;

      // Scale pulse
      const scale = (Math.sin(t * 5) + 1.5) / 5;
      dummy.scale.set(scale, scale, scale);

      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      mesh.current.setMatrixAt(i, dummy.matrix);
      
      // Reset position if it drifts too far up
      if (dummy.position.y > 20) particle.yFactor -= 40;
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
    // Rotate entire system slowly
    mesh.current.rotation.y += 0.001;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial 
        color="#ff5500" 
        emissive="#ff2200" 
        emissiveIntensity={2} 
        transparent 
        opacity={0.8} 
        toneMapped={false}
      />
    </instancedMesh>
  );
};

export default EmberParticles;