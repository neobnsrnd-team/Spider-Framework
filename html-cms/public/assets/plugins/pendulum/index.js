export default {
    name: 'pendulum',
    displayName: 'Pendulum Harmonics',
    version: '1.0.0',

    settings: {
        _groups: [
            {
                id: 'animation',
                label: 'Animation',
                fields: ['speed', 'trailLength']
            },
            {
                id: 'colors',
                label: 'Colors',
                fields: ['color', 'bgColor', 'colorVariation', 'transparentBg']
            },
            {
                id: 'drawing',
                label: 'Drawing Style',
                fields: ['lineWidth', 'trailOpacity', 'pendulumOpacity', 'ballSize', 'ballOpacity', 'blur', 'drawMode', 'fadeCurve']
            },
            {
                id: 'physics',
                label: 'Pendulum Physics',
                fields: ['pendulumCount', 'swingAngle', 'startAngle', 'lengthRatio', 'baseFreq', 'freqIncrement', 'freqDistribution']
            },
            {
                id: 'layout',
                label: 'Layout',
                fields: ['pivotY', 'canvasSize', 'margin']
            }
        ],

        // Animation
        speed: {
            type: 'range',
            label: 'Speed',
            default: 0.5,
            min: 0.1,
            max: 3.0,
            step: 0.1,
            group: 'animation'
        },
        trailLength: {
            type: 'range',
            label: 'Trail Length',
            default: 100,
            min: 20,
            max: 300,
            step: 10,
            group: 'animation'
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
            default: true,
            group: 'colors'
        },
        colorVariation: {
            type: 'range',
            label: 'Color Variation',
            default: 0,
            min: 0,
            max: 180,
            step: 10,
            unit: '°',
            group: 'colors'
        },

        // Drawing Style
        lineWidth: {
            type: 'range',
            label: 'Line Width',
            default: 1,
            min: 0.5,
            max: 5,
            step: 0.5,
            group: 'drawing'
        },
        trailOpacity: {
            type: 'range',
            label: 'Trail Opacity',
            default: 0.3,
            min: 0.1,
            max: 1,
            step: 0.1,
            group: 'drawing'
        },
        pendulumOpacity: {
            type: 'range',
            label: 'Pendulum Line Opacity',
            default: 0.2,
            min: 0,
            max: 1,
            step: 0.1,
            group: 'drawing'
        },
        ballSize: {
            type: 'range',
            label: 'Ball Size',
            default: 6,
            min: 2,
            max: 15,
            step: 1,
            unit: 'px',
            group: 'drawing'
        },
        ballOpacity: {
            type: 'range',
            label: 'Ball Opacity',
            default: 0.6,
            min: 0.1,
            max: 1,
            step: 0.1,
            group: 'drawing'
        },
        blur: {
            type: 'range',
            label: 'Blur Effect',
            default: 0,
            min: 0,
            max: 10,
            step: 1,
            unit: 'px',
            group: 'drawing'
        },
        drawMode: {
            type: 'select',
            label: 'Draw Mode',
            default: 'lines',
            options: [
                { value: 'lines', label: 'Lines' },
                { value: 'curves', label: 'Curves (Bezier)' },
                { value: 'dots', label: 'Dots' }
            ],
            group: 'drawing'
        },
        fadeCurve: {
            type: 'select',
            label: 'Trail Fade Curve',
            default: 'linear',
            options: [
                { value: 'linear', label: 'Linear' },
                { value: 'exponential', label: 'Exponential' },
                { value: 'easeIn', label: 'Ease In' },
                { value: 'easeOut', label: 'Ease Out' }
            ],
            group: 'drawing'
        },

        // Pendulum Physics
        pendulumCount: {
            type: 'range',
            label: 'Pendulum Count',
            default: 7,
            min: 3,
            max: 15,
            step: 1,
            group: 'physics'
        },
        swingAngle: {
            type: 'range',
            label: 'Swing Angle',
            default: 60,
            min: 15,
            max: 120,
            step: 5,
            unit: '°',
            group: 'physics'
        },
        startAngle: {
            type: 'range',
            label: 'Starting Angle',
            default: 45,
            min: 0,
            max: 90,
            step: 5,
            unit: '°',
            group: 'physics'
        },
        lengthRatio: {
            type: 'range',
            label: 'Min/Max Length Ratio',
            default: 0.5,
            min: 0.3,
            max: 0.9,
            step: 0.1,
            group: 'physics'
        },
        baseFreq: {
            type: 'range',
            label: 'Base Frequency',
            default: 0.020,
            min: 0.005,
            max: 0.050,
            step: 0.005,
            group: 'physics'
        },
        freqIncrement: {
            type: 'range',
            label: 'Frequency Increment',
            default: 0.005,
            min: 0.001,
            max: 0.020,
            step: 0.001,
            group: 'physics'
        },
        freqDistribution: {
            type: 'select',
            label: 'Frequency Distribution',
            default: 'linear',
            options: [
                { value: 'linear', label: 'Linear' },
                { value: 'logarithmic', label: 'Logarithmic' },
                { value: 'exponential', label: 'Exponential' }
            ],
            group: 'physics'
        },

        // Layout
        pivotY: {
            type: 'range',
            label: 'Pivot Y Position',
            default: 15,
            min: 5,
            max: 40,
            step: 5,
            unit: '%',
            group: 'layout'
        },
        canvasSize: {
            type: 'range',
            label: 'Canvas Size',
            default: 600,
            min: 400,
            max: 1000,
            step: 50,
            unit: 'px',
            group: 'layout'
        },
        margin: {
            type: 'range',
            label: 'Margin',
            default: 20,
            min: 10,
            max: 50,
            step: 5,
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

        function getFadeOpacity(index, total, curve) {
            const ratio = index / total;
            switch(curve) {
                case 'exponential':
                    return Math.pow(ratio, 2);
                case 'easeIn':
                    return 1 - Math.cos(ratio * Math.PI / 2);
                case 'easeOut':
                    return Math.sin(ratio * Math.PI / 2);
                default:
                    return ratio;
            }
        }

        // Convert color options
        const primaryColor = hexToRgb(options.color || '#6464ff');
        const backgroundColor = hexToRgb(options.bgColor || '#ffffff');
        const transparentBg = options.transparentBg !== undefined ? options.transparentBg : true;

        // Animation class
        class PendulumHarmonics {
            constructor() {
                this.time = 0;
                this.trails = [];
                this.initialize();
            }

            initialize() {
                this.pendulums = [];
                this.trails = [];
                
                const swingAngle = (options.swingAngle || 60) * Math.PI / 180;
                const maxSwingFactor = Math.sin(swingAngle);
                
                this.pivotY = canvas.height * ((options.pivotY || 15) / 100);
                
                const availableHeight = canvas.height - this.pivotY - (options.margin || 20);
                const availableWidth = (canvas.width / 2) - (options.margin || 20);
                
                const maxLengthByHeight = availableHeight;
                const maxLengthByWidth = availableWidth / maxSwingFactor;
                const maxLength = Math.min(maxLengthByHeight, maxLengthByWidth);
                const minLength = maxLength * (options.lengthRatio || 0.5);
                
                const pendulumCount = options.pendulumCount || 7;
                
                for (let i = 0; i < pendulumCount; i++) {
                    let frequency;
                    const ratio = i / (pendulumCount - 1);
                    
                    switch(options.freqDistribution || 'linear') {
                        case 'logarithmic':
                            frequency = (options.baseFreq || 0.020) * Math.pow(2, ratio * 2);
                            break;
                        case 'exponential':
                            frequency = (options.baseFreq || 0.020) * Math.exp(ratio * 2);
                            break;
                        default:
                            frequency = (options.baseFreq || 0.020) + i * (options.freqIncrement || 0.005);
                    }
                    
                    this.pendulums.push({
                        length: minLength + (i / (pendulumCount - 1)) * (maxLength - minLength),
                        angle: (options.startAngle || 45) * Math.PI / 180,
                        frequency: frequency,
                        phase: i * Math.PI / pendulumCount
                    });
                }
            }

            update() {
                this.time += 1 * (options.speed !== undefined ? options.speed : 0.5);
                
                const swingAngle = (options.swingAngle || 60) * Math.PI / 180;
                
                const tips = this.pendulums.map(p => {
                    const angle = Math.sin(this.time * p.frequency + p.phase) * swingAngle;
                    return {
                        x: canvas.width / 2 + Math.sin(angle) * p.length,
                        y: this.pivotY + Math.cos(angle) * p.length
                    };
                });
                
                this.trails.push([...tips]);
                if (this.trails.length > (options.trailLength || 100)) {
                    this.trails.shift();
                }
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
                }
                
                const fadeCurve = options.fadeCurve || 'linear';
                const trailOpacity = options.trailOpacity !== undefined ? options.trailOpacity : 0.3;
                const colorVariation = options.colorVariation || 0;
                
                this.trails.forEach((trailPoints, trailIndex) => {
                    const fadeOpacity = getFadeOpacity(trailIndex, this.trails.length, fadeCurve);
                    const opacity = fadeOpacity * trailOpacity;
                    
                    for (let i = 0; i < trailPoints.length - 1; i++) {
                        let color = primaryColor;
                        if (colorVariation > 0) {
                            const hueShiftAmount = (i / trailPoints.length) * colorVariation;
                            color = hueShift(primaryColor, hueShiftAmount);
                        }
                        
                        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                        ctx.lineWidth = options.lineWidth || 1;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        
                        const drawMode = options.drawMode || 'lines';
                        
                        if (drawMode === 'curves' && i < trailPoints.length - 2) {
                            const p0 = trailPoints[i];
                            const p1 = trailPoints[i + 1];
                            const p2 = trailPoints[i + 2];
                            
                            const cp1x = p1.x;
                            const cp1y = p1.y;
                            
                            ctx.beginPath();
                            ctx.moveTo(p0.x, p0.y);
                            ctx.quadraticCurveTo(cp1x, cp1y, p2.x, p2.y);
                            ctx.stroke();
                            i++;
                        } else if (drawMode === 'dots') {
                            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                            ctx.beginPath();
                            ctx.arc(trailPoints[i].x, trailPoints[i].y, options.lineWidth || 1, 0, Math.PI * 2);
                            ctx.fill();
                        } else {
                            ctx.beginPath();
                            ctx.moveTo(trailPoints[i].x, trailPoints[i].y);
                            ctx.lineTo(trailPoints[i + 1].x, trailPoints[i + 1].y);
                            ctx.stroke();
                        }
                    }
                });
                
                ctx.filter = 'none';
                
                const current = this.trails[this.trails.length - 1];
                if (current) {
                    const pendulumOpacity = options.pendulumOpacity !== undefined ? options.pendulumOpacity : 0.2;
                    const ballSize = options.ballSize || 6;
                    const ballOpacity = options.ballOpacity !== undefined ? options.ballOpacity : 0.6;
                    
                    current.forEach((tip, i) => {
                        if (pendulumOpacity > 0) {
                            ctx.strokeStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${pendulumOpacity})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(canvas.width / 2, this.pivotY);
                            ctx.lineTo(tip.x, tip.y);
                            ctx.stroke();
                        }
                        
                        let color = primaryColor;
                        if (colorVariation > 0) {
                            const hueShiftAmount = (i / current.length) * colorVariation;
                            color = hueShift(primaryColor, hueShiftAmount);
                        }
                        
                        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${ballOpacity})`;
                        ctx.beginPath();
                        ctx.arc(tip.x, tip.y, ballSize, 0, Math.PI * 2);
                        ctx.fill();
                    });
                }
            }
        }

        const anim = new PendulumHarmonics();

        function animate() {
            anim.update();
            anim.draw();
            requestAnimationFrame(animate);
        }

        animate();

        return {
            unmount: function() {
                // Clean up if needed
            }
        };
    }
};