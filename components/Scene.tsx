import React, { Suspense } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { Float, Text, Environment, Sparkles } from '@react-three/drei';
import EmberParticles from './EmberParticles';
import { Character } from '../types';

// Augment the global JSX namespace to recognize React Three Fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

interface SceneProps {
  activeCharacter: Character;
}

const SceneContent: React.FC<SceneProps> = ({ activeCharacter }) => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff8800" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

      <Suspense fallback={null}>
        <Environment preset="night" />
        
        <EmberParticles />
        
        <Sparkles 
            count={100} 
            scale={12} 
            size={4} 
            speed={0.4} 
            opacity={0.5} 
            color="#ffd700"
        />

        {/* Central 3D Kanji */}
        <Float 
            speed={2} 
            rotationIntensity={0.5} 
            floatIntensity={1} 
            floatingRange={[-0.2, 0.2]}
        >
          <Text
            font="https://fonts.gstatic.com/s/notoserifjp/v23/xn71YHs72GKoTvERpQt3TY3V_780zs0_Xw.woff2"
            fontSize={5}
            color={activeCharacter.themeColor}
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0]}
            fillOpacity={0.9}
            strokeWidth={0.02}
            strokeColor="#ffffff"
          >
            {activeCharacter.kanji}
            <meshStandardMaterial 
                emissive={activeCharacter.themeColor} 
                emissiveIntensity={2} 
                toneMapped={false} 
            />
          </Text>
        </Float>

        {/* Shadow floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </mesh>
      </Suspense>
    </>
  );
};

const Scene: React.FC<SceneProps> = ({ activeCharacter }) => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 5, 20]} />
        <SceneContent activeCharacter={activeCharacter} />
      </Canvas>
    </div>
  );
};

export default Scene;