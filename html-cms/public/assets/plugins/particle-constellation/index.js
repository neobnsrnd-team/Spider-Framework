/*
Usage:

<div 
    data-cb-type="particle-constellation" 
    data-cb-speed="1.5" 
    data-cb-movement-speed="0.5" 
    data-cb-mouse-influence="100" 
    data-cb-particle-count="70" 
    data-cb-particle-size="3.5" 
    data-cb-particle-opacity="0.8" 
    data-cb-particle-shape="circle" 
    data-cb-color="#6464ff" 
    data-cb-bg-color="#ffffff" 
    data-cb-color-variation="150" 
    data-cb-transparent-bg="true" 
    data-cb-connection-distance="120" 
    data-cb-line-width="1" 
    data-cb-line-opacity="0.8" 
    data-cb-fade-mode="pulse" 
    data-cb-blur="0" 
    data-cb-glow="0" 
    data-cb-canvas-size="600">
</div>
*/

export default {
    name: 'particle-constellation',
    displayName: 'Particle Constellation',
    version: '1.0.0',

    settings: {
        _groups: [
            {
                id: 'animation',
                label: 'Animation',
                fields: ['speed', 'movementSpeed', 'mouseInfluence']
            },
            {
                id: 'particles',
                label: 'Particles',
                fields: ['particleCount', 'particleSize', 'particleOpacity', 'particleShape']
            },
            {
                id: 'colors',
                label: 'Colors',
                fields: ['color', 'bgColor', 'colorVariation', 'transparentBg']
            },
            {
                id: 'connections',
                label: 'Connections',
                fields: ['connectionDistance', 'lineWidth', 'lineOpacity', 'fadeMode']
            },
            {
                id: 'effects',
                label: 'Visual Effects',
                fields: ['blur', 'glow']
            },
            {
                id: 'layout',
                label: 'Layout',
                fields: ['canvasSize']
            }
        ],

        // Animation
        speed: {
            type: 'range',
            label: 'Speed',
            default: 1.0,
            min: 0.1,
            max: 3.0,
            step: 0.1,
            group: 'animation'
        },
        movementSpeed: {
            type: 'range',
            label: 'Movement Speed',
            default: 0.5,
            min: 0.1,
            max: 2.0,
            step: 0.1,
            group: 'animation'
        },
        mouseInfluence: {
            type: 'range',
            label: 'Mouse Influence',
            default: 100,
            min: 0,
            max: 200,
            step: 10,
            group: 'animation'
        },

        // Particles
        particleCount: {
            type: 'range',
            label: 'Particle Count',
            default: 80,
            min: 20,
            max: 200,
            step: 10,
            group: 'particles'
        },
        particleSize: {
            type: 'range',
            label: 'Particle Size',
            default: 3,
            min: 1,
            max: 10,
            step: 0.5,
            unit: 'px',
            group: 'particles'
        },
        particleOpacity: {
            type: 'range',
            label: 'Particle Opacity',
            default: 0.8,
            min: 0.1,
            max: 1.0,
            step: 0.1,
            group: 'particles'
        },
        particleShape: {
            type: 'select',
            label: 'Particle Shape',
            default: 'circle',
            options: [
                { value: 'circle', label: 'Circle' },
                { value: 'square', label: 'Square' },
                { value: 'triangle', label: 'Triangle' }
            ],
            group: 'particles'
        },

        // Colors
        color: {
            type: 'color',
            label: 'Primary Color',
            default: '#6464ff',
            group: 'colors'
        },
        bgColor: {
            type: 'color',
            label: 'Background Color',
            default: '#ffffff',
            group: 'colors'
        },
        transparentBg: {
            type: 'boolean',
            label: 'Transparent Background',
            default: false,
            group: 'colors'
        },
        colorVariation: {
            type: 'range',
            label: 'Color Variation',
            default: 60,
            min: 0,
            max: 180,
            step: 10,
            unit: '°',
            group: 'colors'
        },

        // Connections
        connectionDistance: {
            type: 'range',
            label: 'Connection Distance',
            default: 120,
            min: 50,
            max: 250,
            step: 10,
            unit: 'px',
            group: 'connections'
        },
        lineWidth: {
            type: 'range',
            label: 'Line Width',
            default: 1,
            min: 0.5,
            max: 3,
            step: 0.5,
            group: 'connections'
        },
        lineOpacity: {
            type: 'range',
            label: 'Line Opacity',
            default: 0.3,
            min: 0.1,
            max: 1.0,
            step: 0.1,
            group: 'connections'
        },
        fadeMode: {
            type: 'select',
            label: 'Fade Mode',
            default: 'distance',
            options: [
                { value: 'distance', label: 'Distance-based' },
                { value: 'fixed', label: 'Fixed Opacity' },
                { value: 'pulse', label: 'Pulsing' }
            ],
            group: 'connections'
        },

        // Visual Effects
        blur: {
            type: 'range',
            label: 'Blur Effect',
            default: 0,
            min: 0,
            max: 10,
            step: 1,
            unit: 'px',
            group: 'effects'
        },
        glow: {
            type: 'range',
            label: 'Glow Intensity',
            default: 0,
            min: 0,
            max: 20,
            step: 1,
            group: 'effects'
        },

        // Layout
        canvasSize: {
            type: 'range',
            label: 'Canvas Size',
            default: 600,
            min: 400,
            max: 1000,
            step: 50,
            unit: 'px',
            group: 'layout'
        }
    },

    mount: function(element, options) {
        const canvas = document.createElement('canvas');
        canvas.width = options.canvasSize || 600;
        canvas.height = options.canvasSize || 600;
        element.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let animationId;

        // Helper functions
        function hexToRgb(color) {
            const rgbaMatch = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/i.exec(color);
            if (rgbaMatch) {
                return {
                    r: parseInt(rgbaMatch[1], 10),
                    g: parseInt(rgbaMatch[2], 10),
                    b: parseInt(rgbaMatch[3], 10)
                };
            }
            
            const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
            if (hexMatch) {
                return {
                    r: parseInt(hexMatch[1], 16),
                    g: parseInt(hexMatch[2], 16),
                    b: parseInt(hexMatch[3], 16)
                };
            }
            
            return { r: 100, g: 100, b: 255 };
        }

        function hueShift(rgb, degrees) {
            const r = rgb.r / 255;
            const g = rgb.g / 255;
            const b = rgb.b / 255;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                switch (max) {
                    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                    case g: h = ((b - r) / d + 2) / 6; break;
                    case b: h = ((r - g) / d + 4) / 6; break;
                }
            }

            h = (h + degrees / 360) % 1;

            function hueToRgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            let nr, ng, nb;
            if (s === 0) {
                nr = ng = nb = l;
            } else {
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                nr = hueToRgb(p, q, h + 1/3);
                ng = hueToRgb(p, q, h);
                nb = hueToRgb(p, q, h - 1/3);
            }

            return {
                r: Math.round(nr * 255),
                g: Math.round(ng * 255),
                b: Math.round(nb * 255)
            };
        }

        // Convert color options
        const primaryColor = hexToRgb(options.color || '#6464ff');
        const backgroundColor = hexToRgb(options.bgColor || '#ffffff');
        const transparentBg = options.transparentBg !== undefined ? options.transparentBg : false;

        // Mouse tracking
        let mouse = { x: null, y: null };

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle class
        class Particle {
            constructor(index, total) {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * (options.movementSpeed || 0.5);
                this.vy = (Math.random() - 0.5) * (options.movementSpeed || 0.5);
                
                const colorVariation = options.colorVariation || 60;
                const hueShiftAmount = (index / total) * colorVariation;
                this.color = colorVariation > 0 ? 
                    hueShift(primaryColor, hueShiftAmount) : 
                    primaryColor;
            }

            update() {
                const speed = options.speed !== undefined ? options.speed : 1.0;
                
                this.baseX += this.vx * speed;
                this.baseY += this.vy * speed;

                if (this.baseX < 0 || this.baseX > canvas.width) this.vx *= -1;
                if (this.baseY < 0 || this.baseY > canvas.height) this.vy *= -1;

                this.x = this.baseX;
                this.y = this.baseY;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = options.mouseInfluence || 100;

                    if (distance < maxDistance) {
                        const force = (maxDistance - distance) / maxDistance;
                        this.x -= dx * force * 0.05;
                        this.y -= dy * force * 0.05;
                    }
                }
            }

            draw() {
                const glow = options.glow || 0;
                const particleSize = options.particleSize || 3;
                const particleOpacity = options.particleOpacity !== undefined ? options.particleOpacity : 0.8;
                const particleShape = options.particleShape || 'circle';

                if (glow > 0) {
                    ctx.shadowBlur = glow;
                    ctx.shadowColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
                }

                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${particleOpacity})`;
                
                if (particleShape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2);
                    ctx.fill();
                } else if (particleShape === 'square') {
                    ctx.fillRect(
                        this.x - particleSize, 
                        this.y - particleSize, 
                        particleSize * 2, 
                        particleSize * 2
                    );
                } else if (particleShape === 'triangle') {
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y - particleSize);
                    ctx.lineTo(this.x - particleSize, this.y + particleSize);
                    ctx.lineTo(this.x + particleSize, this.y + particleSize);
                    ctx.closePath();
                    ctx.fill();
                }

                if (glow > 0) {
                    ctx.shadowBlur = 0;
                }
            }
        }

        // Animation class
        class ParticleConstellation {
            constructor() {
                this.particles = [];
                this.initialize();
            }

            initialize() {
                this.particles = [];
                const particleCount = options.particleCount || 80;
                
                for (let i = 0; i < particleCount; i++) {
                    this.particles.push(new Particle(i, particleCount));
                }
            }

            connectParticles() {
                const time = Date.now() * 0.001;
                const connectionDistance = options.connectionDistance || 120;
                const lineWidth = options.lineWidth || 1;
                const lineOpacity = options.lineOpacity !== undefined ? options.lineOpacity : 0.3;
                const fadeMode = options.fadeMode || 'distance';
                
                for (let i = 0; i < this.particles.length; i++) {
                    for (let j = i + 1; j < this.particles.length; j++) {
                        const dx = this.particles[i].x - this.particles[j].x;
                        const dy = this.particles[i].y - this.particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < connectionDistance) {
                            let opacity;
                            
                            if (fadeMode === 'distance') {
                                opacity = (1 - distance / connectionDistance) * lineOpacity;
                            } else if (fadeMode === 'pulse') {
                                const pulse = (Math.sin(time * 2 + i + j) + 1) / 2;
                                opacity = pulse * lineOpacity;
                            } else {
                                opacity = lineOpacity;
                            }

                            const avgColor = {
                                r: (this.particles[i].color.r + this.particles[j].color.r) / 2,
                                g: (this.particles[i].color.g + this.particles[j].color.g) / 2,
                                b: (this.particles[i].color.b + this.particles[j].color.b) / 2
                            };

                            ctx.strokeStyle = `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, ${opacity})`;
                            ctx.lineWidth = lineWidth;
                            ctx.beginPath();
                            ctx.moveTo(this.particles[i].x, this.particles[i].y);
                            ctx.lineTo(this.particles[j].x, this.particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }

            update() {
                this.particles.forEach(particle => particle.update());
            }

            draw() {
                // Clear canvas with transparent or solid background
                if (transparentBg) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                } else {
                    ctx.fillStyle = `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                const blur = options.blur || 0;
                if (blur > 0) {
                    ctx.filter = `blur(${blur}px)`;
                } else {
                    ctx.filter = 'none';
                }

                this.connectParticles();
                
                this.particles.forEach(particle => particle.draw());
            }
        }

        const anim = new ParticleConstellation();

        function animate() {
            anim.update();
            anim.draw();
            animationId = requestAnimationFrame(animate);
        }

        animate();

        return {
            unmount: function() {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            }
        };
    }
};