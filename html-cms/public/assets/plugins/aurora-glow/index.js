/*
Usage:
<div data-cb-type="aurora-glow" data-cb-speed-multiplier="1.2" data-cb-height="28" data-cb-alpha-global="90" data-cb-color-a="#30cfd0" data-cb-color-b="#6366f1" data-cb-color-c="#ec4899" data-cb-reduced-motion="false" style="height: 100%; position: relative; overflow: hidden;">
</div>
*/

export default {
    name: 'aurora-glow',
    displayName: 'Aurora Glow',
    version: '1.2.0',

    // ===== SETTINGS =====
    settings: {
        speedMultiplier: {
            type: 'range',
            label: 'Speed Multiplier',
            default: 1,
            min: 0.1,
            max: 5,
            step: 0.1,
            unit: '×'
        },
        height: {
            type: 'range',
            label: 'Wave Vertical Position',
            default: 30,
            min: 0,
            max: 100,
            step: 1,
            unit: '%'
        },
        alphaGlobal: {
            type: 'range',
            label: 'Global Opacity',
            default: 100,
            min: 0,
            max: 100,
            step: 1,
            unit: '%'
        },
        colorA: { type: 'color', label: 'Color A', default: '#6366f1' },
        colorB: { type: 'color', label: 'Color B', default: '#8b5cf6' },
        colorC: { type: 'color', label: 'Color C', default: '#ec4899' }
    },

    // ===== MOUNT =====
    mount(element, options = {}) {
        element.setAttribute('data-cb-type', 'aurora-glow');
        element.style.position = 'relative';
        element.style.overflow = 'hidden';

        // Canvas only
        const canvas = document.createElement('canvas');
        canvas.className = 'hero-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        element.innerHTML = '';
        element.appendChild(canvas);

        // Base animation class
        class HeroAnimation {
            constructor(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.running = false;
                this._onResize = this.resize.bind(this);
                window.addEventListener('resize', this._onResize);

                // Observe container resize for dynamic layouts
                const observer = new ResizeObserver(this._onResize);
                observer.observe(canvas.parentElement);
                this._observer = observer;

                this.resize();
            }

            resize() {
                const dpr = window.devicePixelRatio || 1;
                const rect = this.canvas.parentElement.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;

                this.canvas.width = Math.round(width * dpr);
                this.canvas.height = Math.round(height * dpr);
                this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

                this.width = width;
                this.height = height;
            }

            start() {
                if (this.running) return;
                this.running = true;
                const loop = () => {
                    if (!this.running) return;
                    this.update();
                    this.draw();
                    this._raf = requestAnimationFrame(loop);
                };
                loop();
            }

            stop() {
                this.running = false;
                if (this._raf) cancelAnimationFrame(this._raf);
            }

            destroy() {
                this.stop();
                window.removeEventListener('resize', this._onResize);
                if (this._observer) this._observer.disconnect();
            }
        }

        // AuroraGlow class
        class AuroraGlow extends HeroAnimation {
            constructor(canvas, opts = {}) {
                super(canvas);
                this.time = 0;
                this.opts = opts;
                this._prepareLayers();
            }

            // Parse hex color (#RGB, #RRGGBB, #RRGGBBAA)
            _hexToRgba(hex) {
                if (!hex) return [255, 255, 255, 1];
                let h = hex.replace('#', '').trim();
                if (h.length === 3) h = h.split('').map(c => c + c).join('');
                if (h.length === 4) h = h.split('').map(c => c + c).join('');
                if (h.length === 6) h += 'FF'; // add full opacity
                if (h.length !== 8) return [255, 255, 255, 1];
                const r = parseInt(h.slice(0, 2), 16);
                const g = parseInt(h.slice(2, 4), 16);
                const b = parseInt(h.slice(4, 6), 16);
                const a = parseInt(h.slice(6, 8), 16) / 255;
                return [r, g, b, a];
            }

            _prepareLayers() {
                const alphaFactor = (this.opts.alphaGlobal ?? 100) / 100;
                this.layers = [
                    { offset: 0, speed: 0.3, color: this._hexToRgba(this.opts.colorA || '#6366f1'), alpha: 0.15 * alphaFactor },
                    { offset: 2, speed: 0.4, color: this._hexToRgba(this.opts.colorB || '#8b5cf6'), alpha: 0.12 * alphaFactor },
                    { offset: 4, speed: 0.5, color: this._hexToRgba(this.opts.colorC || '#ec4899'), alpha: 0.10 * alphaFactor }
                ];
            }

            update() {
                const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                const speedMul = Number(this.opts.speedMultiplier || 1);
                const slowFactor = prefersReduced ? 0.2 : 1;
                this.time += 0.005 * speedMul * slowFactor;
            }

            draw() {
                const ctx = this.ctx;
                const bg = ctx.createLinearGradient(0, 0, 0, this.height);
                bg.addColorStop(0, '#fafafa');
                bg.addColorStop(1, '#f0f0f0');
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, this.width, this.height);

                const baselinePct = Math.max(0, Math.min(100, Number(this.opts.height || 30)));
                const baseline = this.height * (baselinePct / 100);

                this.layers.forEach(layer => {
                    ctx.beginPath();
                    const points = 50;
                    for (let i = 0; i <= points; i++) {
                        const x = (i / points) * this.width;
                        const t = this.time * layer.speed + layer.offset;
                        const y = baseline +
                            Math.sin(i * 0.1 + t) * 80 +
                            Math.cos(i * 0.15 + t * 0.7) * 50 +
                            Math.sin(i * 0.05 + t * 1.2) * 40;
                        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                    }
                    ctx.lineTo(this.width, this.height);
                    ctx.lineTo(0, this.height);
                    ctx.closePath();

                    const [r, g, b, a] = layer.color;
                    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
                    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${layer.alpha * a})`);
                    gradient.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.fillStyle = gradient;
                    ctx.fill();
                });
            }

            setOptions(newOpts = {}) {
                this.opts = Object.assign({}, this.opts, newOpts);
                this._prepareLayers();
            }
        }

        // Create & start animation
        const instance = new AuroraGlow(canvas, options);
        instance.start();

        return { instance };
    },

    // ===== UNMOUNT =====
    unmount(element, ctx) {
        try {
            if (ctx && ctx.instance) ctx.instance.destroy();
        } catch (err) {
            console.error('aurora-glow unmount error', err);
        }
    }
};
