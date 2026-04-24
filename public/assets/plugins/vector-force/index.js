export default {
    name: 'vector-force',
    displayName: 'Vector Force Field',
    version: '2.0.2',
    
    settings: {
        _groups: [
            {
                id: 'content',
                label: 'Content',
                fields: ['fontSize', 'fontWeight', 'letterSpacing']
            },
            {
                id: 'physics',
                label: 'Physics',
                fields: ['forceRadius', 'forceStrength', 'springStrength', 'damping', 'maxDisplacement']
            },
            {
                id: 'appearance',
                label: 'Appearance',
                fields: ['textColor', 'cursorSize', 'cursorColor', 'showGlow', 'glowColor']
            },
            {
                id: 'effects',
                label: 'Effects',
                fields: ['enableColorChange', 'enableRotation', 'rotationIntensity', 'enableScale', 'scaleIntensity']
            }
        ],
        
        // Content Settings
        fontSize: {
            type: 'range',
            label: 'Font Size',
            default: 6,
            min: 2,
            max: 20,
            step: 0.5,
            unit: 'rem',
            group: 'content'
        },
        fontWeight: {
            type: 'select',
            label: 'Font Weight',
            default: '900',
            options: [
                { value: '300', label: 'Light' },
                { value: '400', label: 'Normal' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: '700', label: 'Bold' },
                { value: '800', label: 'Extra Bold' },
                { value: '900', label: 'Black' }
            ],
            group: 'content'
        },
        letterSpacing: {
            type: 'range',
            label: 'Letter Spacing',
            default: 0.05,
            min: 0,
            max: 0.3,
            step: 0.01,
            unit: 'em',
            group: 'content'
        },
        
        // Physics Settings
        forceRadius: {
            type: 'range',
            label: 'Force Radius',
            default: 200,
            min: 50,
            max: 400,
            step: 10,
            unit: 'px',
            group: 'physics'
        },
        forceStrength: {
            type: 'range',
            label: 'Force Strength',
            default: 0.8,
            min: 0.1,
            max: 2.0,
            step: 0.1,
            group: 'physics'
        },
        springStrength: {
            type: 'range',
            label: 'Spring Strength',
            default: 0.15,
            min: 0.05,
            max: 0.3,
            step: 0.01,
            group: 'physics'
        },
        damping: {
            type: 'range',
            label: 'Damping',
            default: 0.85,
            min: 0.5,
            max: 0.95,
            step: 0.01,
            group: 'physics'
        },
        maxDisplacement: {
            type: 'range',
            label: 'Max Displacement',
            default: 100,
            min: 30,
            max: 200,
            step: 10,
            unit: 'px',
            group: 'physics'
        },
        
        // Appearance Settings
        textColor: {
            type: 'color',
            label: 'Text Color',
            default: '#ffffff',
            group: 'appearance'
        },
        cursorSize: {
            type: 'range',
            label: 'Cursor Size',
            default: 30,
            min: 10,
            max: 60,
            step: 5,
            unit: 'px',
            group: 'appearance'
        },
        cursorColor: {
            type: 'color',
            label: 'Cursor Color',
            default: '#ffffff',
            group: 'appearance'
        },
        showGlow: {
            type: 'boolean',
            label: 'Show Cursor Glow',
            default: true,
            group: 'appearance'
        },
        glowColor: {
            type: 'color',
            label: 'Glow Color',
            default: '#6496ff',
            group: 'appearance'
        },
        
        // Effects Settings
        enableColorChange: {
            type: 'boolean',
            label: 'Color Change on Proximity',
            default: true,
            group: 'effects'
        },
        enableRotation: {
            type: 'boolean',
            label: 'Rotation Effect',
            default: false,
            group: 'effects'
        },
        enableScale: {
            type: 'boolean',
            label: 'Scale Effect',
            default: false,
            group: 'effects'
        },
        rotationIntensity: {
            type: 'range',
            label: 'Rotation Intensity',
            default: 2,
            min: 0,
            max: 10,
            step: 0.5,
            group: 'effects'
        },
        scaleIntensity: {
            type: 'range',
            label: 'Scale Intensity',
            default: 0.3,
            min: 0,
            max: 1,
            step: 0.1,
            group: 'effects'
        }
    },
    
    editor: {
        openContentEditor: function(element, builder, onChange) {
            const container = document.createElement('div');
            
            // Get current text from the h1.vf-text element
            let textElement = element.querySelector('.vf-text');
            let currentText = '';
            
            if (textElement) {
                // Get text from letter spans or direct text content
                const letterSpans = textElement.querySelectorAll('.vf-letter');
                if (letterSpans.length > 0) {
                    currentText = Array.from(letterSpans).map(span => span.textContent).join('');
                } else {
                    currentText = textElement.textContent.trim();
                }
            }
            
            if (!currentText) {
                currentText = 'FORCE FIELD';
            }
            
            // Label
            const label = document.createElement('label');
            label.textContent = 'Text Content';
            label.style.cssText = 'display: block; font-weight: 500; margin-bottom: 8px;';
            
            // Text input
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.value = currentText;
            textInput.placeholder = 'Enter your text...';
            textInput.style.cssText = 'width: 100%; font-size: 16px;';
            
            // Info text
            const info = document.createElement('small');
            info.textContent = 'This text is SEO-friendly and stored in your HTML.';
            info.style.cssText = 'display: block; margin-top: 8px; color: #666; font-size: 12px;';
            
            // Update handler
            let updateTimer;
            textInput.addEventListener('input', () => {
                clearTimeout(updateTimer);
                updateTimer = setTimeout(() => {
                    const newText = textInput.value || 'FORCE FIELD';
                    
                    // Find the text element
                    let vfText = element.querySelector('.vf-text');
                    if (vfText) {
                        // Clear letter spans and set new text
                        vfText.innerHTML = '';
                        vfText.textContent = newText;
                        
                        // Clear cached data to force rebuild
                        delete element._vfLetters;
                        delete vfText.dataset.lastText;
                    }
                    
                    onChange();
                }, 300);
            });
            
            container.appendChild(label);
            container.appendChild(textInput);
            container.appendChild(info);
            
            return container;
        }
    },
    
    mount: function(element, options) {
        // Helper function to normalize color values
        const normalizeColor = (color) => {
            if (!color) return null;
            if (color.startsWith('rgb') || color.startsWith('hsl') || color.startsWith('#')) {
                return color;
            }
            if (/^[0-9A-Fa-f]{6}$/.test(color)) {
                return '#' + color;
            }
            return color;
        };
        
        // Helper to add alpha to color
        const addAlpha = (color, alpha) => {
            if (!color) return `rgba(255, 255, 255, ${alpha})`;
            color = normalizeColor(color);
            
            if (color.startsWith('#')) {
                const hex = color.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
            
            if (color.startsWith('rgb')) {
                const match = color.match(/rgba?\(([^)]+)\)/);
                if (match) {
                    const parts = match[1].split(',').map(p => p.trim());
                    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
                }
            }
            
            return color;
        };
        
        // Find existing elements
        let textElement = element.querySelector('.vf-text');
        
        // Create unique ID for this instance
        const instanceId = 'vf-' + Math.random().toString(36).substr(2, 9);
        
        // Look for existing cursor elements (by class and instance ID)
        let cursor = document.querySelector(`.vf-cursor[data-instance="${instanceId}"]`);
        let cursorGlow = document.querySelector(`.vf-glow[data-instance="${instanceId}"]`);
        
        // Create cursor elements and append to body
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.className = 'vf-cursor';
            cursor.dataset.instance = instanceId;
            cursor.style.display = 'none'; // Start hidden
            document.body.appendChild(cursor);
        }
        
        if (!cursorGlow) {
            cursorGlow = document.createElement('div');
            cursorGlow.className = 'vf-glow';
            cursorGlow.dataset.instance = instanceId;
            cursorGlow.style.display = 'none'; // Start hidden
            document.body.appendChild(cursorGlow);
        }
        
        // Store references on element for cleanup
        element._vfCursor = cursor;
        element._vfCursorGlow = cursorGlow;
        
        // If no text element exists, create default structure
        if (!textElement) {
            textElement = document.createElement('h1');
            textElement.className = 'vf-text';
            textElement.textContent = 'FORCE FIELD';
            element.insertBefore(textElement, element.firstChild);
        }
        
        // Apply text styling
        textElement.style.fontSize = `${options.fontSize || 6}rem`;
        textElement.style.fontWeight = options.fontWeight || '900';
        textElement.style.letterSpacing = `${options.letterSpacing || 0.05}em`;
        textElement.style.color = normalizeColor(options.textColor) || '#ffffff';
        
        // Apply cursor styling
        cursor.style.width = `${options.cursorSize || 30}px`;
        cursor.style.height = `${options.cursorSize || 30}px`;
        cursor.style.borderColor = addAlpha(options.cursorColor || '#ffffff', 0.5);
        
        // Apply glow styling
        const glowColor = normalizeColor(options.glowColor) || '#6496ff';
        cursorGlow.style.background = `radial-gradient(circle, ${addAlpha(glowColor, 0.3)} 0%, transparent 70%)`;
        
        // Split text into letters (preserve existing structure if re-mounting)
        const existingLetters = textElement.querySelectorAll('.vf-letter');
        const shouldRebuild = existingLetters.length === 0 || 
                              textElement.textContent !== textElement.dataset.lastText ||
                              !element._vfLetters;
        
        if (shouldRebuild) {
            const currentTextContent = textElement.textContent;
            textElement.textContent = '';
            textElement.dataset.lastText = currentTextContent;
            
            const letters = [];
            currentTextContent.split('').forEach((char) => {
                const span = document.createElement('span');
                span.className = 'vf-letter';
                span.textContent = char;
                span.style.display = char === ' ' ? 'inline' : 'inline-block';
                textElement.appendChild(span);
                
                if (char !== ' ') {
                    letters.push({
                        element: span,
                        originalPos: { x: 0, y: 0 },
                        currentPos: { x: 0, y: 0 },
                        velocity: { x: 0, y: 0 }
                    });
                }
            });
            
            // Store letters on element for animation
            element._vfLetters = letters;
            
            // Store original positions after layout
            setTimeout(() => {
                letters.forEach(letter => {
                    const rect = letter.element.getBoundingClientRect();
                    letter.originalPos = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    };
                    letter.currentPos = { ...letter.originalPos };
                });
            }, 100);
        }
        
        const letters = element._vfLetters || [];
        
        // Function to update letter positions (after scroll/resize)
        const updateLetterPositions = () => {
            letters.forEach(letter => {
                const rect = letter.element.getBoundingClientRect();
                const newOriginalPos = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
                
                // Calculate the offset between old and new positions
                const deltaX = newOriginalPos.x - letter.originalPos.x;
                const deltaY = newOriginalPos.y - letter.originalPos.y;
                
                // Update original position
                letter.originalPos = newOriginalPos;
                
                // Adjust current position by the same delta to maintain relative displacement
                letter.currentPos.x += deltaX;
                letter.currentPos.y += deltaY;
            });
        };
        
        // Update positions on scroll and resize
        let scrollTimeout;
        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateLetterPositions();
            }, 50);
        };
        
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateLetterPositions();
            }, 100);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        
        // Mouse tracking
        let mousePos = { x: 0, y: 0 };
        let lastMousePos = { x: 0, y: 0 };
        let mouseVelocity = { x: 0, y: 0 };
        let isMouseInside = false;
        
        // Check if mouse is inside element bounds
        const isInBounds = (clientX, clientY) => {
            const rect = element.getBoundingClientRect();
            return (
                clientX >= rect.left &&
                clientX <= rect.right &&
                clientY >= rect.top &&
                clientY <= rect.bottom
            );
        };
        
        // Mouse enter handler
        const handleMouseEnter = (e) => {
            isMouseInside = true;
            cursor.style.display = 'block';
            if (options.showGlow !== false) {
                cursorGlow.style.display = 'block';
            }
        };
        
        // Mouse leave handler
        const handleMouseLeave = (e) => {
            // Double check if really leaving
            if (!isInBounds(e.clientX, e.clientY)) {
                isMouseInside = false;
                cursor.style.display = 'none';
                cursorGlow.style.display = 'none';
            }
        };
        
        // Mouse move handler
        const handleMouseMove = (e) => {
            // Update mouse position
            mouseVelocity.x = e.clientX - lastMousePos.x;
            mouseVelocity.y = e.clientY - lastMousePos.y;
            
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
            
            lastMousePos = { x: e.clientX, y: e.clientY };
            
            // Update cursor position if visible
            if (isMouseInside) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            }
        };
        
        // Attach event listeners
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.addEventListener('mousemove', handleMouseMove);
        
        // Physics constants from options
        const FORCE_RADIUS = options.forceRadius || 200;
        const FORCE_STRENGTH = options.forceStrength || 0.8;
        const SPRING_STRENGTH = options.springStrength || 0.15;
        const DAMPING = options.damping || 0.85;
        const MAX_DISPLACEMENT = options.maxDisplacement || 100;
        
        // Animation loop
        let animationId;
        const animate = () => {
            letters.forEach(letter => {
                if (isMouseInside) {
                    const dx = letter.currentPos.x - mousePos.x;
                    const dy = letter.currentPos.y - mousePos.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < FORCE_RADIUS && distance > 0) {
                        const force = (1 - distance / FORCE_RADIUS) * FORCE_STRENGTH;
                        const angle = Math.atan2(dy, dx);
                        
                        const forceX = Math.cos(angle) * force * 50;
                        const forceY = Math.sin(angle) * force * 50;
                        
                        letter.velocity.x += forceX;
                        letter.velocity.y += forceY;
                        
                        if (options.enableColorChange !== false) {
                            const colorIntensity = 1 - (distance / FORCE_RADIUS);
                            const baseColor = normalizeColor(options.cursorColor) || '#ffffff';
                            
                            if (options.cursorColor) {
                                if (baseColor.startsWith('#')) {
                                    const hex = baseColor.replace('#', '');
                                    const r = parseInt(hex.substr(0, 2), 16);
                                    const g = parseInt(hex.substr(2, 2), 16);
                                    const b = parseInt(hex.substr(4, 2), 16);
                                    
                                    const adjustedR = Math.min(255, Math.floor(r + (255 - r) * colorIntensity * 0.3));
                                    const adjustedG = Math.min(255, Math.floor(g + (255 - g) * colorIntensity * 0.3));
                                    const adjustedB = Math.min(255, Math.floor(b + (255 - b) * colorIntensity * 0.3));
                                    
                                    letter.element.style.color = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
                                } else if (baseColor.startsWith('rgb')) {
                                    letter.element.style.color = baseColor;
                                } else {
                                    letter.element.style.color = baseColor;
                                }
                            } else {
                                const hue = 200 + colorIntensity * 60;
                                letter.element.style.color = `hsl(${hue}, 80%, ${50 + colorIntensity * 30}%)`;
                            }
                        }
                        
                        // Rotation effect
                        const rotationIntensity = options.rotationIntensity || 2;
                        let rotation = 0;
                        if (options.enableRotation === true) {
                            const proximityFactor = 1 - (distance / FORCE_RADIUS);
                            rotation = mouseVelocity.x * rotationIntensity * proximityFactor;
                        }
                        
                        // Scale effect
                        const scaleIntensity = options.scaleIntensity || 0.3;
                        let scale = 1;
                        if (options.enableScale === true) {
                            const proximityFactor = 1 - (distance / FORCE_RADIUS);
                            scale = 1 + (proximityFactor * scaleIntensity);
                        }
                        
                        letter._rotation = rotation;
                        letter._scale = scale;
                    } else {
                        letter.element.style.color = normalizeColor(options.textColor) || '#ffffff';
                        letter._rotation = 0;
                        letter._scale = 1;
                    }
                } else {
                    // Reset color when mouse is outside
                    letter.element.style.color = normalizeColor(options.textColor) || '#ffffff';
                    letter._rotation = 0;
                    letter._scale = 1;
                }
                
                // Apply spring force
                const springDx = letter.originalPos.x - letter.currentPos.x;
                const springDy = letter.originalPos.y - letter.currentPos.y;
                
                letter.velocity.x += springDx * SPRING_STRENGTH;
                letter.velocity.y += springDy * SPRING_STRENGTH;
                
                // Apply damping
                letter.velocity.x *= DAMPING;
                letter.velocity.y *= DAMPING;
                
                // Update position
                letter.currentPos.x += letter.velocity.x;
                letter.currentPos.y += letter.velocity.y;
                
                // Limit displacement
                const displaceX = letter.currentPos.x - letter.originalPos.x;
                const displaceY = letter.currentPos.y - letter.originalPos.y;
                const displaceDistance = Math.sqrt(displaceX * displaceX + displaceY * displaceY);
                
                if (displaceDistance > MAX_DISPLACEMENT) {
                    const ratio = MAX_DISPLACEMENT / displaceDistance;
                    letter.currentPos.x = letter.originalPos.x + displaceX * ratio;
                    letter.currentPos.y = letter.originalPos.y + displaceY * ratio;
                }
                
                // Apply transform
                const offsetX = letter.currentPos.x - letter.originalPos.x;
                const offsetY = letter.currentPos.y - letter.originalPos.y;
                const rotation = letter._rotation || 0;
                const scale = letter._scale || 1;
                
                letter.element.style.transform = 
                    `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`;
            });
            
            animationId = requestAnimationFrame(animate);
        };
        
        animate();
        
        // Cursor scale effect
        let mouseMoveTimeout;
        const handleCursorEffect = () => {
            if (!isMouseInside) return;
            
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = addAlpha(options.cursorColor || '#6496ff', 0.8);
            
            clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = setTimeout(() => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.borderColor = addAlpha(options.cursorColor || '#ffffff', 0.5);
            }, 100);
        };
        
        element.addEventListener('mousemove', handleCursorEffect);
        
        // Cleanup
        return {
            destroy: () => {
                cancelAnimationFrame(animationId);
                element.removeEventListener('mouseenter', handleMouseEnter);
                element.removeEventListener('mouseleave', handleMouseLeave);
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mousemove', handleCursorEffect);
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleResize);
                
                // Remove cursor elements from DOM
                if (cursor && cursor.parentElement) {
                    cursor.remove();
                }
                if (cursorGlow && cursorGlow.parentElement) {
                    cursorGlow.remove();
                }
            }
        };
    },
    
    unmount: function(element, instance) {
        if (instance && instance.destroy) {
            instance.destroy();
        }
    }
};