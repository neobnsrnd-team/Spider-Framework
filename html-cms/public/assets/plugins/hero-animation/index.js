export default {
    name: 'hero-animation',
    displayName: 'Hero Animation',
    version: '1.0.0',

    settings: {
        _groups: [
            {
                id: 'general',
                label: 'General Settings',
                fields: ['animationType', 'speed', 'baseColor']
            },
            {
                id: 'canvas',
                label: 'Canvas Settings',
                fields: ['canvasWidth', 'canvasHeight']
            }
        ],

        animationType: {
            type: 'select',
            label: 'Animation Type',
            default: 'neural',
            options: [
                { value: 'neural', label: 'Neural Network' },
                { value: 'pendulum', label: 'Pendulum Harmonics' },
                { value: 'rings', label: 'Oscillating Rings' },
                { value: 'fractal', label: 'Fractal Tree' },
                { value: 'fourier', label: 'Fourier Series' },
                { value: 'lorenz', label: 'Lorenz Attractor' },
                { value: 'bezier', label: 'Bezier Curves' },
                { value: 'packing', label: 'Circular Packing' },
                { value: 'lissajous', label: 'Lissajous Curves' },
                { value: 'graph', label: 'Graph Network' },
                { value: 'spline', label: 'Spline Interpolation' },
                { value: 'waves', label: 'Circular Waves' }
            ],
            group: 'general'
        },

        speed: {
            type: 'range',
            label: 'Animation Speed',
            default: 1,
            min: 0.2,
            max: 3,
            step: 0.1,
            group: 'general'
        },

        baseColor: {
            type: 'color',
            label: 'Base Color',
            default: '#6464ff',
            group: 'general'
        },

        canvasWidth: {
            type: 'number',
            label: 'Canvas Width',
            default: 600,
            min: 300,
            max: 1200,
            step: 50,
            unit: 'px',
            group: 'canvas'
        },

        canvasHeight: {
            type: 'number',
            label: 'Canvas Height',
            default: 600,
            min: 300,
            max: 1200,
            step: 50,
            unit: 'px',
            group: 'canvas'
        }
    },

    mount: function(element, options) {
        const canvas = element.querySelector('canvas');
        if (!canvas) {
            console.error('Hero Animation: Canvas element not found');
            return {};
        }

        const ctx = canvas.getContext('2d');
        
        canvas.width = options.canvasWidth || 600;
        canvas.height = options.canvasHeight || 600;

        const hexToRgb = (color) => {
            // Handle rgba format
            const rgbaMatch = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/i.exec(color);
            if (rgbaMatch) {
                return {
                    r: parseInt(rgbaMatch[1], 10),
                    g: parseInt(rgbaMatch[2], 10),
                    b: parseInt(rgbaMatch[3], 10)
                };
            }
            
            // Handle hex format
            const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
            if (hexMatch) {
                return {
                    r: parseInt(hexMatch[1], 16),
                    g: parseInt(hexMatch[2], 16),
                    b: parseInt(hexMatch[3], 16)
                };
            }
            
            // Default fallback
            return { r: 100, g: 100, b: 255 };
        };

        const color = hexToRgb(options.baseColor || '#6464ff');
        const speed = options.speed || 1;

        let animationFrame;
        let currentAnimation;

        // === Animation 1: Neural Network ===
        class NeuralNetwork {
            constructor() {
                this.nodes = [];
                this.connections = [];
                this.time = 0;
                this.initNodes();
            }

            initNodes() {
                const layers = [4, 6, 6, 3];
                const spacing = canvas.width / (layers.length + 1);

                layers.forEach((count, i) => {
                    const layer = [];
                    const vSpace = canvas.height / (count + 1);

                    for (let j = 0; j < count; j++) {
                        layer.push({
                            x: spacing * (i + 1),
                            y: vSpace * (j + 1),
                            baseY: vSpace * (j + 1),
                            activation: Math.random(),
                            targetActivation: Math.random(),
                            phase: Math.random() * Math.PI * 2
                        });
                    }
                    this.nodes.push(layer);
                });

                for (let i = 0; i < this.nodes.length - 1; i++) {
                    for (let from of this.nodes[i]) {
                        for (let to of this.nodes[i + 1]) {
                            this.connections.push({ from, to, weight: Math.random() });
                        }
                    }
                }
            }

            update() {
                this.time += 0.03 * speed;

                this.nodes.forEach(layer => {
                    layer.forEach(node => {
                        node.activation += (node.targetActivation - node.activation) * 0.08;
                        if (Math.random() < 0.05) node.targetActivation = Math.random();
                        node.y = node.baseY + Math.sin(this.time + node.phase) * 5;
                    });
                });
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                this.connections.forEach(conn => {
                    const opacity = (conn.from.activation + conn.to.activation) / 2;
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(conn.from.x, conn.from.y);
                    ctx.lineTo(conn.to.x, conn.to.y);
                    ctx.stroke();
                });

                this.nodes.forEach(layer => {
                    layer.forEach(node => {
                        const radius = 6 + node.activation * 6;
                        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.5 + node.activation * 0.5})`;
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                        ctx.fill();
                    });
                });
            }
        }

        // === Animation 2: Pendulum Harmonics ===
        class PendulumHarmonics {
            constructor() {
                this.time = 0;
                this.pendulums = [];
                this.trails = [];
                this.maxTrailLength = 100;
                
                // Position pivot to maximize vertical space usage
                // Swing angle is PI/3, so max displacement is sin(PI/3) ≈ 0.866
                const swingAngle = Math.PI / 3;
                const maxSwingFactor = Math.sin(swingAngle);
                
                // Position pivot so pendulum can swing fully without cropping
                this.pivotY = canvas.height * 0.15;
                
                // Calculate max safe length considering both vertical and horizontal constraints
                const availableHeight = canvas.height - this.pivotY - 20; // 20px margin at bottom
                const availableWidth = (canvas.width / 2) - 20; // 20px margin on sides
                
                // Max length limited by both height (when vertical) and width (when at max angle)
                const maxLengthByHeight = availableHeight;
                const maxLengthByWidth = availableWidth / maxSwingFactor;
                const maxLength = Math.min(maxLengthByHeight, maxLengthByWidth);
                const minLength = maxLength * 0.5;
                
                for (let i = 0; i < 7; i++) {
                    this.pendulums.push({
                        length: minLength + (i / 6) * (maxLength - minLength),
                        angle: Math.PI / 4,
                        frequency: 0.02 + i * 0.005,
                        phase: i * Math.PI / 7
                    });
                }
            }

            update() {
                this.time += 1 * speed;
                
                const tips = this.pendulums.map(p => {
                    const angle = Math.sin(this.time * p.frequency + p.phase) * (Math.PI / 3);
                    return {
                        x: canvas.width / 2 + Math.sin(angle) * p.length,
                        y: this.pivotY + Math.cos(angle) * p.length
                    };
                });
                
                this.trails.push([...tips]);
                if (this.trails.length > this.maxTrailLength) {
                    this.trails.shift();
                }
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                this.trails.forEach((trailPoints, trailIndex) => {
                    const opacity = (trailIndex / this.trails.length) * 0.3;
                    
                    for (let i = 0; i < trailPoints.length - 1; i++) {
                        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(trailPoints[i].x, trailPoints[i].y);
                        ctx.lineTo(trailPoints[i + 1].x, trailPoints[i + 1].y);
                        ctx.stroke();
                    }
                });
                
                const current = this.trails[this.trails.length - 1];
                if (current) {
                    current.forEach((tip, i) => {
                        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(canvas.width / 2, this.pivotY);
                        ctx.lineTo(tip.x, tip.y);
                        ctx.stroke();
                        
                        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`;
                        ctx.beginPath();
                        ctx.arc(tip.x, tip.y, 6, 0, Math.PI * 2);
                        ctx.fill();
                    });
                }
            }
        }

        // === Animation 3: Oscillating Rings ===
        class OscillatingRings {
            constructor() {
                this.time = 0;
                this.rings = [];
                this.numRings = 12;
                this.initRings();
            }

            initRings() {
                for (let i = 0; i < this.numRings; i++) {
                    this.rings.push({
                        baseRadius: 40 + i * 30,
                        frequency: 0.04 + i * 0.006,
                        phase: i * Math.PI / 6,
                        amplitude: 20,
                        segments: 60
                    });
                }
            }

            update() {
                this.time += 0.05 * speed;
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                
                this.rings.forEach((ring, ringIndex) => {
                    const points = [];
                    
                    for (let i = 0; i <= ring.segments; i++) {
                        const angle = (i / ring.segments) * Math.PI * 2;
                        const radiusOffset = Math.sin(angle * 4 + this.time * ring.frequency + ring.phase) * ring.amplitude;
                        const radius = ring.baseRadius + radiusOffset;
                        
                        points.push({
                            x: centerX + Math.cos(angle) * radius,
                            y: centerY + Math.sin(angle) * radius
                        });
                    }
                    
                    const opacity = 0.2 + (ringIndex / this.numRings) * 0.3;
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);
                    
                    for (let i = 1; i < points.length; i++) {
                        ctx.lineTo(points[i].x, points[i].y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                    
                    if (ringIndex % 3 === 0) {
                        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.3})`;
                        ctx.lineWidth = 8;
                        ctx.stroke();
                    }
                });
                
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
                gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`);
                gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // === Animation 4: Fractal Tree ===
        class FractalTree {
            constructor() {
                this.time = 0;
                this.branches = [];
                this.maxDepth = 10;
                this.angle = Math.PI / 6;
                this.initTree();
            }

            initTree() {
                this.branches = [{
                    x1: canvas.width / 2,
                    y1: canvas.height * 0.85,
                    x2: canvas.width / 2,
                    y2: canvas.height * 0.65,
                    depth: 0,
                    growth: 0,
                    angle: -Math.PI / 2
                }];
            }

            update() {
                this.time += 0.015 * speed;
                
                this.branches.forEach(branch => {
                    if (branch.growth < 1) {
                        branch.growth += 0.02 * speed;
                    }
                });

                const newBranches = [];
                this.branches.forEach(branch => {
                    if (branch.growth >= 1 && branch.depth < this.maxDepth && !branch.hasChildren) {
                        const len = Math.abs(branch.y2 - branch.y1) * 0.67;
                        const angleVariation = Math.sin(this.time + branch.depth) * 0.2;
                        
                        const leftAngle = branch.angle - this.angle + angleVariation;
                        newBranches.push({
                            x1: branch.x2,
                            y1: branch.y2,
                            x2: branch.x2 + Math.cos(leftAngle) * len,
                            y2: branch.y2 + Math.sin(leftAngle) * len,
                            depth: branch.depth + 1,
                            growth: 0,
                            angle: leftAngle
                        });
                        
                        const rightAngle = branch.angle + this.angle - angleVariation;
                        newBranches.push({
                            x1: branch.x2,
                            y1: branch.y2,
                            x2: branch.x2 + Math.cos(rightAngle) * len,
                            y2: branch.y2 + Math.sin(rightAngle) * len,
                            depth: branch.depth + 1,
                            growth: 0,
                            angle: rightAngle
                        });
                        
                        branch.hasChildren = true;
                    }
                });
                
                this.branches.push(...newBranches);
                
                if (this.branches.length > 800) {
                    this.initTree();
                }
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                this.branches.forEach(branch => {
                    const currentX = branch.x1 + (branch.x2 - branch.x1) * branch.growth;
                    const currentY = branch.y1 + (branch.y2 - branch.y1) * branch.growth;
                    
                    const opacity = 0.4 - (branch.depth / this.maxDepth) * 0.3;
                    const thickness = 8 - (branch.depth / this.maxDepth) * 6;
                    
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                    ctx.lineWidth = thickness;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(branch.x1, branch.y1);
                    ctx.lineTo(currentX, currentY);
                    ctx.stroke();
                    
                    if (branch.depth >= this.maxDepth - 2 && branch.growth > 0.8) {
                        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.3 * branch.growth})`;
                        ctx.beginPath();
                        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
            }
        }

        // === Animation 5: Fourier Series ===
        class FourierSeries {
            constructor() {
                this.time = 0;
                this.circles = [];
                this.path = [];
                this.maxPathLength = 200;
                
                const amplitudes = [80, 40, 20, 15, 10, 8, 6];
                const frequencies = [1, 3, 5, 7, 9, 11, 13];
                
                for (let i = 0; i < amplitudes.length; i++) {
                    this.circles.push({
                        radius: amplitudes[i],
                        frequency: frequencies[i],
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }

            update() {
                this.time += 0.02 * speed;
                
                let x = canvas.width / 2;
                let y = canvas.height / 2;
                
                this.circles.forEach(circle => {
                    const angle = this.time * circle.frequency + circle.phase;
                    x += Math.cos(angle) * circle.radius;
                    y += Math.sin(angle) * circle.radius;
                });
                
                this.path.push({ x, y });
                if (this.path.length > this.maxPathLength) {
                    this.path.shift();
                }
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                let x = canvas.width / 2;
                let y = canvas.height / 2;
                
                this.circles.forEach((circle, index) => {
                    const angle = this.time * circle.frequency + circle.phase;
                    const nextX = x + Math.cos(angle) * circle.radius;
                    const nextY = y + Math.sin(angle) * circle.radius;
                    
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.15 - index * 0.015})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(x, y, circle.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.3 - index * 0.03})`;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(nextX, nextY);
                    ctx.stroke();
                    
                    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.4 - index * 0.04})`;
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    x = nextX;
                    y = nextY;
                });
                
                ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fill();
                
                if (this.path.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(this.path[0].x, this.path[0].y);
                    
                    for (let i = 1; i < this.path.length; i++) {
                        const opacity = (i / this.path.length) * 0.5;
                        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                        ctx.lineWidth = 2;
                        ctx.lineTo(this.path[i].x, this.path[i].y);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(this.path[i].x, this.path[i].y);
                    }
                }
                
                if (this.path.length > 0) {
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`;
                    ctx.setLineDash([5, 5]);
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(this.path[this.path.length - 1].x, this.path[this.path.length - 1].y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }
        }

        // === Animation 6: Lorenz Attractor ===
        class LorenzAttractor {
            constructor() {
                this.x = 0.1;
                this.y = 0;
                this.z = 0;
                this.points = [];
                this.maxPoints = 2000;
                
                this.sigma = 10;
                this.rho = 28;
                this.beta = 8/3;
                this.dt = 0.005;
                
                this.rotation = 0;
            }

            update() {
                const dx = this.sigma * (this.y - this.x);
                const dy = this.x * (this.rho - this.z) - this.y;
                const dz = this.x * this.y - this.beta * this.z;
                
                this.x += dx * this.dt * speed;
                this.y += dy * this.dt * speed;
                this.z += dz * this.dt * speed;
                
                this.points.push({ x: this.x, y: this.y, z: this.z });
                
                if (this.points.length > this.maxPoints) {
                    this.points.shift();
                }
                
                this.rotation += 0.003 * speed;
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                const scale = 8;
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                
                for (let i = 1; i < this.points.length; i++) {
                    const prev = this.points[i - 1];
                    const curr = this.points[i];
                    
                    const prevX = prev.x * Math.cos(this.rotation) - prev.y * Math.sin(this.rotation);
                    const prevZ = prev.z;
                    
                    const currX = curr.x * Math.cos(this.rotation) - curr.y * Math.sin(this.rotation);
                    const currZ = curr.z;
                    
                    const x1 = centerX + prevX * scale;
                    const y1 = centerY + prevZ * scale - 100;
                    const x2 = centerX + currX * scale;
                    const y2 = centerY + currZ * scale - 100;
                    
                    const opacity = (i / this.points.length) * 0.4;
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
                
                if (this.points.length > 0) {
                    const last = this.points[this.points.length - 1];
                    const lastX = last.x * Math.cos(this.rotation) - last.y * Math.sin(this.rotation);
                    const lastZ = last.z;
                    const x = centerX + lastX * scale;
                    const y = centerY + lastZ * scale - 100;
                    
                    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
                    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`);
                    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(x, y, 15, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // === Animation 7: Bezier Curves ===
        class BezierCurves {
            constructor() {
                this.time = 0;
                this.curves = [];
                this.numCurves = 8;
                this.initCurves();
            }

            initCurves() {
                for (let i = 0; i < this.numCurves; i++) {
                    this.curves.push({
                        startX: 100,
                        startY: canvas.height / 2,
                        endX: canvas.width - 100,
                        endY: canvas.height / 2,
                        phase: i * Math.PI / 4,
                        frequency: 0.02 + i * 0.005,
                        amplitude: 100 + i * 10
                    });
                }
            }

            update() {
                this.time += 0.03 * speed;
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                this.curves.forEach((curve, index) => {
                    const cp1x = canvas.width * 0.3 + Math.sin(this.time * curve.frequency + curve.phase) * curve.amplitude;
                    const cp1y = canvas.height * 0.3 + Math.cos(this.time * curve.frequency + curve.phase) * curve.amplitude;
                    const cp2x = canvas.width * 0.7 + Math.cos(this.time * curve.frequency + curve.phase + Math.PI) * curve.amplitude;
                    const cp2y = canvas.height * 0.7 + Math.sin(this.time * curve.frequency + curve.phase + Math.PI) * curve.amplitude;
                    
                    const opacity = 0.15 + (index / this.numCurves) * 0.3;
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(curve.startX, curve.startY);
                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, curve.endX, curve.endY);
                    ctx.stroke();
                    
                    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.6})`;
                    ctx.beginPath();
                    ctx.arc(cp1x, cp1y, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(cp2x, cp2y, 4, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([5, 5]);
                    ctx.beginPath();
                    ctx.moveTo(curve.startX, curve.startY);
                    ctx.lineTo(cp1x, cp1y);
                    ctx.moveTo(curve.endX, curve.endY);
                    ctx.lineTo(cp2x, cp2y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                });
            }
        }

        // === Animation 8: Circular Packing ===
        class CircularPacking {
            constructor() {
                this.circles = [];
                this.time = 0;
                this.initCircles();
            }

            initCircles() {
                const numCircles = 15;
                for (let i = 0; i < numCircles; i++) {
                    this.circles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        targetRadius: 20 + Math.random() * 40,
                        radius: 5,
                        growing: true,
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }

            checkCollision(c1, c2) {
                const dx = c1.x - c2.x;
                const dy = c1.y - c2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                return dist < (c1.radius + c2.radius);
            }

            update() {
                this.time += 0.02 * speed;
                
                this.circles.forEach((circle, i) => {
                    if (circle.growing && circle.radius < circle.targetRadius) {
                        let canGrow = true;
                        for (let j = 0; j < this.circles.length; j++) {
                            if (i !== j && this.checkCollision(circle, this.circles[j])) {
                                canGrow = false;
                                break;
                            }
                        }
                        
                        if (circle.x - circle.radius < 0 || circle.x + circle.radius > canvas.width ||
                            circle.y - circle.radius < 0 || circle.y + circle.radius > canvas.height) {
                            canGrow = false;
                        }
                        
                        if (canGrow) {
                            circle.radius += 0.5 * speed;
                        } else {
                            circle.growing = false;
                        }
                    }
                    
                    circle.currentRadius = circle.radius + Math.sin(this.time * 2 + circle.phase) * 2;
                });
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                this.circles.forEach(circle => {
                    const gradient = ctx.createRadialGradient(
                        circle.x, circle.y, 0,
                        circle.x, circle.y, circle.currentRadius + 10
                    );
                    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
                    gradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`);
                    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(circle.x, circle.y, circle.currentRadius + 10, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(circle.x, circle.y, circle.currentRadius, 0, Math.PI * 2);
                    ctx.stroke();
                });
            }
        }

        // === Animation 9: Lissajous Curves ===
        class LissajousCurves {
            constructor() {
                this.time = 0;
                this.curves = [];
                this.initCurves();
            }

            initCurves() {
                const ratios = [
                    { a: 3, b: 2 },
                    { a: 5, b: 4 },
                    { a: 4, b: 3 },
                    { a: 5, b: 3 },
                    { a: 7, b: 5 }
                ];
                
                ratios.forEach((ratio, i) => {
                    this.curves.push({
                        a: ratio.a,
                        b: ratio.b,
                        delta: i * Math.PI / 5,
                        amplitude: 120 - i * 15,
                        phase: 0
                    });
                });
            }

            update() {
                this.time += 0.005 * speed;
                this.curves.forEach(curve => {
                    curve.phase = this.time;
                });
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                
                this.curves.forEach((curve, index) => {
                    const opacity = 0.15 + (index / this.curves.length) * 0.35;
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    
                    for (let t = 0; t <= Math.PI * 2; t += 0.02) {
                        const x = centerX + curve.amplitude * Math.sin(curve.a * t + curve.phase);
                        const y = centerY + curve.amplitude * Math.sin(curve.b * t + curve.delta);
                        
                        if (t === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    ctx.closePath();
                    ctx.stroke();
                    
                    const currentT = (this.time * 0.5) % (Math.PI * 2);
                    const px = centerX + curve.amplitude * Math.sin(curve.a * currentT + curve.phase);
                    const py = centerY + curve.amplitude * Math.sin(curve.b * currentT + curve.delta);
                    
                    const gradient = ctx.createRadialGradient(px, py, 0, px, py, 10);
                    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity + 0.4})`);
                    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(px, py, 10, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
        }

        // === Animation 10: Graph Network ===
        class GraphNetwork {
            constructor() {
                this.nodes = [];
                this.edges = [];
                this.time = 0;
                this.initGraph();
            }

            initGraph() {
                const numNodes = 12;
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                
                for (let i = 0; i < numNodes; i++) {
                    const angle = (i / numNodes) * Math.PI * 2;
                    const radius = 150 + Math.random() * 50;
                    
                    this.nodes.push({
                        x: centerX + Math.cos(angle) * radius,
                        y: centerY + Math.sin(angle) * radius,
                        vx: 0,
                        vy: 0,
                        baseAngle: angle,
                        baseRadius: radius,
                        activation: Math.random(),
                        targetActivation: Math.random()
                    });
                }
                
                for (let i = 0; i < numNodes; i++) {
                    const numConnections = 2 + Math.floor(Math.random() * 2);
                    for (let j = 0; j < numConnections; j++) {
                        const target = (i + j + 1) % numNodes;
                        if (!this.edges.find(e => 
                            (e.from === i && e.to === target) || 
                            (e.from === target && e.to === i))) {
                            this.edges.push({ from: i, to: target });
                        }
                    }
                }
            }

            update() {
                this.time += 0.005 * speed;
                
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                
                this.nodes.forEach((node, i) => {
                    const angle = node.baseAngle + this.time * 0.1;
                    const radius = node.baseRadius + Math.sin(this.time + i) * 5;
                    node.x = centerX + Math.cos(angle) * radius;
                    node.y = centerY + Math.sin(angle) * radius;
                    
                    node.activation += (node.targetActivation - node.activation) * 0.02;
                    if (Math.random() < 0.01) {
                        node.targetActivation = Math.random();
                    }
                });
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                this.edges.forEach(edge => {
                    const from = this.nodes[edge.from];
                    const to = this.nodes[edge.to];
                    const avgActivation = (from.activation + to.activation) / 2;
                    
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.2 + avgActivation * 0.3})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(from.x, from.y);
                    ctx.lineTo(to.x, to.y);
                    ctx.stroke();
                });
                
                this.nodes.forEach(node => {
                    const radius = 8 + node.activation * 6;
                    
                    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2);
                    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${0.6 + node.activation * 0.3})`);
                    gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${0.2 + node.activation * 0.2})`);
                    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.7 + node.activation * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
        }

        // === Animation 11: Spline Interpolation ===
        class SplineInterpolation {
            constructor() {
                this.time = 0;
                this.controlPoints = [];
                this.numPoints = 8;
                this.initPoints();
            }

            initPoints() {
                for (let i = 0; i < this.numPoints; i++) {
                    const x = (i / (this.numPoints - 1)) * (canvas.width - 100) + 50;
                    const y = canvas.height / 2;
                    
                    this.controlPoints.push({
                        x: x,
                        baseY: y,
                        y: y,
                        amplitude: 80 + Math.random() * 40,
                        frequency: 0.02 + Math.random() * 0.01,
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }

            update() {
                this.time += 0.04 * speed;
                
                this.controlPoints.forEach(point => {
                    point.y = point.baseY + Math.sin(this.time * point.frequency + point.phase) * point.amplitude;
                });
            }

            catmullRom(p0, p1, p2, p3, t) {
                const t2 = t * t;
                const t3 = t2 * t;
                
                return {
                    x: 0.5 * ((2 * p1.x) + 
                        (-p0.x + p2.x) * t + 
                        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + 
                        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
                    y: 0.5 * ((2 * p1.y) + 
                        (-p0.y + p2.y) * t + 
                        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + 
                        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
                };
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                
                for (let i = 0; i < this.controlPoints.length - 1; i++) {
                    const p0 = this.controlPoints[Math.max(0, i - 1)];
                    const p1 = this.controlPoints[i];
                    const p2 = this.controlPoints[i + 1];
                    const p3 = this.controlPoints[Math.min(this.controlPoints.length - 1, i + 2)];
                    
                    for (let t = 0; t <= 1; t += 0.05) {
                        const point = this.catmullRom(p0, p1, p2, p3, t);
                        if (i === 0 && t === 0) {
                            ctx.moveTo(point.x, point.y);
                        } else {
                            ctx.lineTo(point.x, point.y);
                        }
                    }
                }
                ctx.stroke();
                
                this.controlPoints.forEach((point, i) => {
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([5, 5]);
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.baseY);
                    ctx.lineTo(point.x, point.y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    
                    const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 15);
                    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`);
                    gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
                    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 15, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
        }

        // === Animation 12: Circular Waves ===
        class CircularWaves {
            constructor() {
                this.time = 0;
                this.waves = [];
                this.maxWaves = 12;
                this.spawnInterval = 150;
                this.spawnCounter = 0;
                
                for (let i = 0; i < 3; i++) {
                    this.waves.push({
                        x: canvas.width / 2,
                        y: canvas.height / 2,
                        radius: 80 + i * 50,
                        maxRadius: 300,
                        speed: 0.3
                    });
                }
            }

            update() {
                this.time += 0.01 * speed;
                this.spawnCounter++;
                
                if (this.spawnCounter >= this.spawnInterval / speed) {
                    this.waves.push({
                        x: canvas.width / 2,
                        y: canvas.height / 2,
                        radius: 80,
                        maxRadius: 300,
                        speed: 0.3
                    });
                    this.spawnCounter = 0;
                }
                
                this.waves = this.waves.filter(wave => {
                    wave.radius += wave.speed * speed;
                    return wave.radius < wave.maxRadius;
                });
            }

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                this.waves.forEach(wave => {
                    const progress = wave.radius / wave.maxRadius;
                    const opacity = (1 - progress) * 0.5;
                    
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    if (progress < 0.3) {
                        const glowOpacity = (0.3 - progress) / 0.3 * 0.3;
                        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${glowOpacity})`;
                        ctx.lineWidth = 8;
                        ctx.stroke();
                    }
                    
                    for (let i = 1; i <= 2; i++) {
                        const innerRadius = wave.radius - i * 20;
                        if (innerRadius > 0) {
                            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.5})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(wave.x, wave.y, innerRadius, 0, Math.PI * 2);
                            ctx.stroke();
                        }
                    }
                });
                
                const gradient = ctx.createRadialGradient(
                    canvas.width / 2, canvas.height / 2, 0,
                    canvas.width / 2, canvas.height / 2, 20
                );
                gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`);
                gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize animation based on type
        const animationType = options.animationType || 'neural';
        switch(animationType) {
            case 'neural':
                currentAnimation = new NeuralNetwork();
                break;
            case 'pendulum':
                currentAnimation = new PendulumHarmonics();
                break;
            case 'rings':
                currentAnimation = new OscillatingRings();
                break;
            case 'fractal':
                currentAnimation = new FractalTree();
                break;
            case 'fourier':
                currentAnimation = new FourierSeries();
                break;
            case 'lorenz':
                currentAnimation = new LorenzAttractor();
                break;
            case 'bezier':
                currentAnimation = new BezierCurves();
                break;
            case 'packing':
                currentAnimation = new CircularPacking();
                break;
            case 'lissajous':
                currentAnimation = new LissajousCurves();
                break;
            case 'graph':
                currentAnimation = new GraphNetwork();
                break;
            case 'spline':
                currentAnimation = new SplineInterpolation();
                break;
            case 'waves':
                currentAnimation = new CircularWaves();
                break;
            default:
                currentAnimation = new NeuralNetwork();
        }

        function animate() {
            currentAnimation.update();
            currentAnimation.draw();
            animationFrame = requestAnimationFrame(animate);
        }

        animate();

        return {
            unmount: function() {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            }
        };
    }
};