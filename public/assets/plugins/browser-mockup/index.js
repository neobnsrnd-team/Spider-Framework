export default {
    name: 'browser-mockup',
    displayName: 'Browser Mockup',
    version: '1.0.0',

    settings: {
        maxWidth: {
            type: 'number',
            label: 'Max Width',
            default: 1100,
            min: 600,
            max: 1600,
            step: 50,
            unit: 'px'
        },
        rotateX: {
            type: 'range',
            label: 'Rotate X (degrees)',
            default: 8,
            min: 0,
            max: 20,
            step: 1
        },
        rotateY: {
            type: 'range',
            label: 'Rotate Y (degrees)',
            default: -8,
            min: -20,
            max: 20,
            step: 1
        },
        enableHover: {
            type: 'boolean',
            label: 'Enable Hover Effect',
            default: true
        }
    },

    editor: {
        openContentEditor: function (element, builder, onChange) {
            const container = document.createElement('div');

            const screenshot = element.querySelector('.screenshot-image');

            // Image preview
            const imgPreview = document.createElement('img');
            imgPreview.src = screenshot?.getAttribute('src') || 'https://placehold.co/800x600?text=No+Image';
            imgPreview.style.cssText = `
                width: 100%;
                max-width: 400px;
                height: auto;
                object-fit: cover;
                display: block;
                border-radius: 8px;
                margin-bottom: 16px;
                border: 1px solid #e5e7eb;
            `;

            // Image URL input
            const imgInput = document.createElement('input');
            imgInput.type = 'text';
            imgInput.placeholder = 'Screenshot URL';
            imgInput.value = screenshot?.getAttribute('src') || '';
            imgInput.style.cssText = 'flex: 1;';
            imgInput.addEventListener('input', () => {
                if (screenshot) {
                    screenshot.src = imgInput.value;
                    imgPreview.src = imgInput.value || 'https://placehold.co/800x600?text=No+Image';
                    onChange?.();
                }
            });

            // Browse button
            const browseBtn = document.createElement('button');
            browseBtn.textContent = 'Browse Files';
            browseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
            browseBtn.style.cssText = 'width: 45px;';
            browseBtn.onclick = (e) => {
                e.preventDefault();
                builder.openFilePicker('image', (url) => {
                    imgInput.value = url;
                    if (screenshot) {
                        screenshot.src = url;
                        imgPreview.src = url;
                        onChange?.();
                    }
                }, browseBtn);
            };

            const inputGroup = document.createElement('div');
            inputGroup.style.cssText = 'display: flex; gap: 4px;margin-bottom:20px';
            inputGroup.appendChild(imgInput);
            inputGroup.appendChild(browseBtn);

            // Alt text input
            const altLabel = document.createElement('label');
            altLabel.textContent = 'Image Alt Text';
            // altLabel.style.cssText = 'display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #333;';

            const altInput = document.createElement('input');
            altInput.type = 'text';
            altInput.placeholder = 'Alt text for accessibility';
            altInput.value = screenshot?.getAttribute('alt') || 'App Mockup';

            altInput.addEventListener('input', () => {
                if (screenshot) {
                    screenshot.alt = altInput.value;
                    onChange?.();
                }
            });

            // Reset Transform Button
            // const resetBtn = document.createElement('button');
            // resetBtn.innerHTML = '🔄 Reset Transform';
            // resetBtn.style.cssText = 'width: 100%; padding: 10px; background: #ef4444; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;';
            // resetBtn.onclick = (e) => {
            //     e.preventDefault();
            //     // Reset rotation to 0
            //     element.dataset.cbRotateX = '0';
            //     element.dataset.cbRotateY = '0';
                
            //     const container = element.querySelector('.app-container');
            //     if (container) {
            //         container.style.transform = 'rotateX(0deg) rotateY(0deg)';
            //     }
                
            //     onChange?.();
                
            //     // Show confirmation
            //     resetBtn.textContent = '✓ Transform Reset!';
            //     setTimeout(() => {
            //         resetBtn.innerHTML = '🔄 Reset Transform';
            //     }, 1500);
            // };

            container.appendChild(imgPreview);
            container.appendChild(inputGroup);
            container.appendChild(altLabel);
            container.appendChild(altInput);
            // container.appendChild(resetBtn);

            return container;
        }
    },

    mount: function (element, options) {
        const container = element.querySelector('.app-container');
        const showcase = element.querySelector('.app-showcase');

        // Apply settings (use ?? instead of || to handle 0 values correctly)
        if (container) {
            const rotateX = options.rotateX ?? 8;
            const rotateY = options.rotateY ?? -8;
            container.style.maxWidth = `${options.maxWidth ?? 1100}px`;
            container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }

        // Apply hover effect if enabled
        if (options.enableHover !== false && showcase && container) {
            const rotateX = options.rotateX ?? 8;
            const rotateY = options.rotateY ?? -8;
            const rotateXHalf = rotateX / 2;
            const rotateYHalf = rotateY / 2;
            
            showcase.addEventListener('mouseenter', () => {
                container.style.transform = `rotateX(${rotateXHalf}deg) rotateY(${rotateYHalf}deg) scale(1.02)`;
            });

            showcase.addEventListener('mouseleave', () => {
                container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        }

        return {};
    }
};