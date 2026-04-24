export default {
    name: 'before-after-slider',
    displayName: 'Before/After Slider',
    version: '1.0.2',

    settings: {
        startPosition: {
            type: 'range',
            label: 'Starting Position',
            default: 50,
            min: 0,
            max: 100,
            step: 1,
            unit: '%'
        },
        orientation: {
            type: 'select',
            label: 'Orientation',
            default: 'horizontal',
            options: [
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' }
            ]
        },
        showLabels: {
            type: 'boolean',
            label: 'Show Labels',
            default: true
        }
    },

    editor: {
        openContentEditor: function (element, builder, onChange) {
            const container = document.createElement('div');

            const beforeImg = element.querySelector('.ba-before img');
            const afterImg = element.querySelector('.ba-after img');
            const beforeLabel = element.querySelector('.ba-label-before');
            const afterLabel = element.querySelector('.ba-label-after');

            // Helper to create image field
            const createImageField = (label, currentSrc, onUpdate) => {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'margin-bottom: 20px;';

                const title = document.createElement('h4');
                title.textContent = label;
                title.style.cssText = 'margin: 0 0 8px 0; font-size: 14px; font-weight: 500;';

                const preview = document.createElement('img');
                preview.src = currentSrc || 'https://placehold.co/200x150?text=No+Image';
                preview.style.cssText = 'width: 100%; max-width: 200px; height: 150px; object-fit: cover; display: block; border-radius: 6px; margin-bottom: 8px;';

                const inputGroup = document.createElement('div');
                inputGroup.style.cssText = 'display: flex; gap: 4px;';

                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = 'Image URL';
                input.value = currentSrc || '';
                input.style.cssText = 'flex: 1;';

                input.addEventListener('input', () => {
                    preview.src = input.value || 'https://placehold.co/200x150?text=No+Image';
                    onUpdate(input.value);
                    onChange?.();
                });

                const browseBtn = document.createElement('button');
                browseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
                browseBtn.style.cssText = 'width: 45px;';
                browseBtn.onclick = (e) => {
                    e.preventDefault();
                    builder.openFilePicker('image', (url) => {
                        input.value = url;
                        preview.src = url;
                        onUpdate(url);
                        onChange?.();
                    }, browseBtn);
                };

                inputGroup.appendChild(input);
                inputGroup.appendChild(browseBtn);

                wrapper.appendChild(title);
                wrapper.appendChild(preview);
                wrapper.appendChild(inputGroup);

                return wrapper;
            };

            // Before image field
            const beforeField = createImageField('Before Image', beforeImg?.getAttribute('src'), (url) => {
                if (!beforeImg) return;
                beforeImg.src = url;
            });

            // After image field
            const afterField = createImageField('After Image', afterImg?.getAttribute('src'), (url) => {
                if (!afterImg) return;
                afterImg.src = url;
            });

            // Alt text fields
            const altWrapper = document.createElement('div');
            altWrapper.style.cssText = 'margin-bottom: 20px;';

            const altTitle = document.createElement('h4');
            altTitle.textContent = 'Alt Text';
            altTitle.style.cssText = 'margin: 0 0 8px 0; font-size: 14px; font-weight: 500;';

            const beforeAltInput = document.createElement('input');
            beforeAltInput.type = 'text';
            beforeAltInput.placeholder = 'Before image alt text';
            beforeAltInput.value = beforeImg?.getAttribute('alt') || '';
            beforeAltInput.style.cssText = 'width: 100%; margin-bottom: 8px;';
            beforeAltInput.addEventListener('input', () => {
                if (beforeImg) beforeImg.alt = beforeAltInput.value;
                onChange?.();
            });

            const afterAltInput = document.createElement('input');
            afterAltInput.type = 'text';
            afterAltInput.placeholder = 'After image alt text';
            afterAltInput.value = afterImg?.getAttribute('alt') || '';
            afterAltInput.style.cssText = 'width: 100%;';
            afterAltInput.addEventListener('input', () => {
                if (afterImg) afterImg.alt = afterAltInput.value;
                onChange?.();
            });

            altWrapper.appendChild(altTitle);
            altWrapper.appendChild(beforeAltInput);
            altWrapper.appendChild(afterAltInput);

            // Label fields
            const labelWrapper = document.createElement('div');
            labelWrapper.style.cssText = 'margin-bottom: 20px;';

            const labelTitle = document.createElement('h4');
            labelTitle.textContent = 'Labels';
            labelTitle.style.cssText = 'margin: 0 0 8px 0; font-size: 14px; font-weight: 500;';

            const beforeLabelInput = document.createElement('input');
            beforeLabelInput.type = 'text';
            beforeLabelInput.placeholder = 'Before label (e.g., "Before")';
            beforeLabelInput.value = beforeLabel?.textContent || '';
            beforeLabelInput.style.cssText = 'width: 100%; margin-bottom: 8px;';
            beforeLabelInput.addEventListener('input', () => {
                if (beforeLabel) beforeLabel.textContent = beforeLabelInput.value;
                onChange?.();
            });

            const afterLabelInput = document.createElement('input');
            afterLabelInput.type = 'text';
            afterLabelInput.placeholder = 'After label (e.g., "After")';
            afterLabelInput.value = afterLabel?.textContent || '';
            afterLabelInput.style.cssText = 'width: 100%;';
            afterLabelInput.addEventListener('input', () => {
                if (afterLabel) afterLabel.textContent = afterLabelInput.value;
                onChange?.();
            });

            labelWrapper.appendChild(labelTitle);
            labelWrapper.appendChild(beforeLabelInput);
            labelWrapper.appendChild(afterLabelInput);

            container.appendChild(beforeField);
            container.appendChild(afterField);
            container.appendChild(altWrapper);
            container.appendChild(labelWrapper);

            return container;
        }
    },

    mount: function (element, options) {
        const container = element.querySelector('.ba-container');
        const slider = element.querySelector('.ba-slider');
        const beforeDiv = element.querySelector('.ba-before');
        const handle = element.querySelector('.ba-handle');

        if (!container || !slider || !beforeDiv || !handle) return {};

        const isVertical = options.orientation === 'vertical';
        const startPos = Number.isFinite(parseInt(options.startPosition)) ? parseInt(options.startPosition) : 50;

        // Utility: pointer coords (mouse or touch)
        const getPoint = (e) => {
            if (e.touches && e.touches.length) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        };

        // Apply clip based on percentage (0..100)
        // H: reveal left -> right (clip RIGHT)
        // V: reveal top -> bottom (clip BOTTOM)
        const applyClip = (percent) => {
            const p = Math.max(0, Math.min(100, percent));
            if (isVertical) {
                const val = `inset(0 0 ${100 - p}% 0)`; // âœ… clip from bottom
                beforeDiv.style.clipPath = val;
                beforeDiv.style.webkitClipPath = val;
                slider.style.top = `${p}%`;
            } else {
                const val = `inset(0 ${100 - p}% 0 0)`; // clip from right
                beforeDiv.style.clipPath = val;
                beforeDiv.style.webkitClipPath = val;
                slider.style.left = `${p}%`;
            }
        };

        // Initial position
        applyClip(startPos);

        // Labels visibility (defensive)
        const labels = element.querySelectorAll('.ba-label-before, .ba-label-after');
        const showLabels = options.showLabels === true || options.showLabels === 'true';
        labels.forEach(label => {
            label.style.display = showLabels ? 'block' : 'none';
        });

        let isDragging = false;

        const updateFromEvent = (e) => {
            if (!isDragging) return;
            const rect = container.getBoundingClientRect();
            const pt = getPoint(e);
            let position;

            if (isVertical) {
                position = ((pt.y - rect.top) / rect.height) * 100; // down -> bigger %
            } else {
                position = ((pt.x - rect.left) / rect.width) * 100;  // right -> bigger %
            }

            applyClip(position);

            // Prevent scroll on touch while dragging
            if (e.cancelable) e.preventDefault();
        };

        const startDrag = (e) => {
            isDragging = true;
            if (e.cancelable) e.preventDefault();
            updateFromEvent(e);
        };

        const stopDrag = () => {
            isDragging = false;
        };

        // Events
        handle.addEventListener('mousedown', startDrag);
        handle.addEventListener('touchstart', startDrag, { passive: false });

        document.addEventListener('mousemove', updateFromEvent);
        document.addEventListener('touchmove', updateFromEvent, { passive: false });

        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag, { passive: true });
        document.addEventListener('touchcancel', stopDrag, { passive: true });

        // Cleanup
        return {
            unmount: () => {
                handle.removeEventListener('mousedown', startDrag);
                handle.removeEventListener('touchstart', startDrag, { passive: false });
                document.removeEventListener('mousemove', updateFromEvent);
                document.removeEventListener('touchmove', updateFromEvent, { passive: false });
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchend', stopDrag, { passive: true });
                document.removeEventListener('touchcancel', stopDrag, { passive: true });
            }
        };
    }
};