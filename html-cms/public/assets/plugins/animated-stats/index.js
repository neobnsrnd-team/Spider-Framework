export default {
    name: 'animated-stats',
    displayName: 'Animated Stats',
    version: '1.1.0',

    settings: {
        _groups: [
            {
                id: 'layout',
                label: 'Layout',
                fields: ['columns', 'alignment']
            },
            {
                id: 'animation',
                label: 'Animation',
                fields: ['duration', 'delay', 'easing']
            },
            {
                id: 'appearance',
                label: 'Appearance',
                fields: ['iconSize', 'numberSize', 'labelSize']
            }
        ],

        columns: {
            type: 'number',
            label: 'Columns',
            default: 4,
            min: 1,
            max: 6,
            group: 'layout'
        },
        alignment: {
            type: 'select',
            label: 'Text Alignment',
            default: 'center',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ],
            group: 'layout'
        },
        duration: {
            type: 'number',
            label: 'Animation Duration',
            default: 2,
            min: 0.5,
            max: 5,
            step: 0.5,
            unit: 's',
            group: 'animation'
        },
        delay: {
            type: 'number',
            label: 'Stagger Delay',
            default: 0.1,
            min: 0,
            max: 1,
            step: 0.05,
            unit: 's',
            group: 'animation'
        },
        easing: {
            type: 'select',
            label: 'Easing Function',
            default: 'ease-out',
            options: [
                { value: 'linear', label: 'Linear' },
                { value: 'ease-out', label: 'Ease Out' },
                { value: 'ease-in-out', label: 'Ease In Out' }
            ],
            group: 'animation'
        },
        iconSize: {
            type: 'number',
            label: 'Icon Size (emoji & icon fonts)',
            default: 48,
            min: 24,
            max: 96,
            step: 4,
            unit: 'px',
            group: 'appearance'
        },
        numberSize: {
            type: 'number',
            label: 'Number Size',
            default: 42,
            min: 24,
            max: 72,
            step: 2,
            unit: 'px',
            group: 'appearance'
        },
        labelSize: {
            type: 'number',
            label: 'Label Size',
            default: 16,
            min: 12,
            max: 24,
            step: 1,
            unit: 'px',
            group: 'appearance'
        }
    },

    editor: {
        openContentEditor: function (element, builder, onChange) {
            const container = document.createElement('div');
            container.style.cssText = `
                margin-bottom: 28px;
            `;
            const stats = element.querySelectorAll('.stat-item');

            const accordionContainer = document.createElement('div');
            accordionContainer.className = 'is-accordion';

            const createStatEditor = (statItem, index) => {
                const section = document.createElement('div');
                section.dataset.statId = statItem.dataset.statId || `stat-${Date.now()}-${index}`;
                statItem.dataset.statId = section.dataset.statId;

                // Header
                const header = document.createElement('div');

                const labelText = statItem.querySelector('.stat-label')?.textContent || `Stat ${index + 1}`;
                const numberText = statItem.querySelector('.stat-number')?.textContent || '0';

                const headerTitle = document.createElement('span');
                headerTitle.textContent = `${numberText} - ${labelText}`;

                const toggle = document.createElement('span');
                toggle.innerHTML = '<svg style="width: 20px; height: 20px;transform: rotate(360deg);transition: all 0.2s ease"><use xlink:href="#icon-chevron-down"></use></svg>';

                header.appendChild(headerTitle);
                header.appendChild(toggle);

                // Body
                const body = document.createElement('div');
                body.style.cssText = `
                    padding: 12px;
                    display: none;
                `;

                // Icon Input
                const iconLabel = document.createElement('label');
                iconLabel.textContent = 'Icon';
                iconLabel.style.cssText = 'display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;';

                const iconInput = document.createElement('textarea');
                iconInput.rows = 3;
                iconInput.placeholder = 'Paste emoji, SVG code, or icon tag like:\n📊\n<svg>...</svg>\n<i class="bi bi-heart-fill"></i>';
                iconInput.style.cssText = 'width: 100%; margin-bottom: 8px; font-family: monospace; font-size: 12px; height: 120px;';

                const iconHint = document.createElement('small');
                iconHint.textContent = 'Supports: Icons, Emoji, SVG';
                iconHint.style.cssText = 'display: block; font-size: 11px; color: #666; margin-top: -4px; margin-bottom: 12px;';

                // Icon preview
                const iconPreview = document.createElement('div');
                iconPreview.style.cssText = `
                    width: 64px; height: 64px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 32px;
                `;

                // Get current icon content
                const iconElement = statItem.querySelector('.stat-icon');
                if (iconElement) {
                    const innerHTML = iconElement.innerHTML.trim();
                    if (innerHTML.startsWith('<')) {
                        iconInput.value = innerHTML;
                    } else {
                        iconInput.value = iconElement.textContent;
                    }
                }

                // Browse icons
                const browseIcons = document.createElement('button');
                browseIcons.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-dots"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>';
                browseIcons.style.cssText = 'width:50px;height 50px';
                browseIcons.onclick = (e) => {
                    builder.openIconPicker((html)=>{
                        iconInput.value = html;
                        updateIconPreview();
                        updateStatIcon();
                    });
                };

                const groupIconSelect = document.createElement('div');
                groupIconSelect.style.cssText = `
                    display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 6px;
                `;
                groupIconSelect.appendChild(iconPreview);
                groupIconSelect.appendChild(browseIcons);

                // Detect icon type from input
                const detectIconType = (value) => {
                    const trimmed = value.trim();
                    if (trimmed.startsWith('<svg')) return 'svg';
                    if (trimmed.startsWith('<i')) {
                        if (trimmed.includes('class="bi')) return 'bootstrap';
                        else if (trimmed.includes('class="ti')) return 'tabler';
                        else if (trimmed.includes('data-lucide')) return 'lucide';
                        else return 'othericon';
                    }
                    return 'emoji';
                };

                // Update icon preview
                const updateIconPreview = () => {
                    const value = iconInput.value.trim();
                    const type = detectIconType(value);
                    iconPreview.innerHTML = '';
                    
                    switch(type) {
                        case 'emoji':
                            iconPreview.textContent = value || '📊';
                            break;
                        case 'svg':
                        case 'bootstrap':
                        case 'tabler':
                        case 'othericon':
                        case 'lucide':
                            iconPreview.innerHTML = value || '<svg width="32" height="32"><circle cx="16" cy="16" r="12" fill="#999"/></svg>';
                            // Scale icons in preview
                            const previewIcon = iconPreview.querySelector('i, svg');
                            if (previewIcon) {
                                // previewIcon.style.width = '32px';
                                // previewIcon.style.height = '32px';
                                previewIcon.style.fontSize = '32px';
                            }
                            // Trigger lucide refresh if available
                            if (type === 'lucide' && window.lucide) {
                                setTimeout(() => window.lucide.createIcons(), 10);
                            }
                            break;
                    }
                };

                // Update actual icon in the stat
                const updateStatIcon = () => {
                    const value = iconInput.value.trim();
                    const type = detectIconType(value);
                    
                    let icon = statItem.querySelector('.stat-icon');
                    if (!icon) {
                        icon = document.createElement('div');
                        icon.className = 'stat-icon';
                        statItem.prepend(icon);
                    }
                    
                    icon.dataset.iconType = type;
                    
                    if (type === 'emoji') {
                        icon.textContent = value;
                        icon.innerHTML = '';
                    } else {
                        icon.innerHTML = value;
                        // Trigger lucide refresh if available
                        if (type === 'lucide' && window.lucide) {
                            setTimeout(() => window.lucide.createIcons(), 10);
                        }
                    }
                    
                    onChange?.();
                };

                iconInput.addEventListener('input', () => {
                    updateIconPreview();
                    updateStatIcon();
                });

                // Initialize preview
                updateIconPreview();

                // Number Input
                const numberLabel = document.createElement('label');
                numberLabel.textContent = 'Target Number';
                numberLabel.style.cssText = 'display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;';

                const numberInput = document.createElement('input');
                numberInput.type = 'text';
                numberInput.placeholder = '1000';
                numberInput.value = statItem.dataset.target || '0';
                numberInput.style.cssText = 'width: 100%; margin-bottom: 12px;';

                numberInput.addEventListener('input', () => {
                    statItem.dataset.target = numberInput.value;
                    statItem.querySelector('.stat-number').textContent = numberInput.value;
                    headerTitle.textContent = `${numberInput.value} - ${labelInput.value || 'Stat'}`;
                    onChange?.();
                });

                // Prefix Input
                const prefixLabel = document.createElement('label');
                prefixLabel.textContent = 'Prefix (optional)';
                prefixLabel.style.cssText = 'display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;';

                const prefixInput = document.createElement('input');
                prefixInput.type = 'text';
                prefixInput.placeholder = '$';
                prefixInput.value = statItem.dataset.prefix || '';
                prefixInput.style.cssText = 'width: 100%; margin-bottom: 12px;';

                prefixInput.addEventListener('input', () => {
                    statItem.dataset.prefix = prefixInput.value;
                    onChange?.();
                });

                // Suffix Input
                const suffixLabel = document.createElement('label');
                suffixLabel.textContent = 'Suffix (optional)';
                suffixLabel.style.cssText = 'display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;';

                const suffixInput = document.createElement('input');
                suffixInput.type = 'text';
                suffixInput.placeholder = '+';
                suffixInput.value = statItem.dataset.suffix || '';
                suffixInput.style.cssText = 'width: 100%; margin-bottom: 12px;';

                suffixInput.addEventListener('input', () => {
                    statItem.dataset.suffix = suffixInput.value;
                    onChange?.();
                });

                // Label Input
                const labelLabel = document.createElement('label');
                labelLabel.textContent = 'Label';
                labelLabel.style.cssText = 'display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;';

                const labelInput = document.createElement('input');
                labelInput.type = 'text';
                labelInput.placeholder = 'Happy Clients';
                labelInput.value = statItem.querySelector('.stat-label')?.textContent || '';
                labelInput.style.cssText = 'width: 100%; margin-bottom: 12px;';

                labelInput.addEventListener('input', () => {
                    statItem.querySelector('.stat-label').textContent = labelInput.value;
                    headerTitle.textContent = `${numberInput.value} - ${labelInput.value || 'Stat'}`;
                    onChange?.();
                });

                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<svg><use xlink:href="#icon-trash2"></use></svg>';
                deleteBtn.style.cssText = 'width: 100%; margin-top: 8px;';
                deleteBtn.onclick = (e) => {
                    e.preventDefault();
                    statItem.remove();
                    section.remove();
                    onChange?.();
                };

                // Append fields
                body.appendChild(groupIconSelect);
                body.appendChild(iconLabel);
                body.appendChild(iconInput);
                body.appendChild(iconHint);
                body.appendChild(numberLabel);
                body.appendChild(numberInput);
                body.appendChild(prefixLabel);
                body.appendChild(prefixInput);
                body.appendChild(suffixLabel);
                body.appendChild(suffixInput);
                body.appendChild(labelLabel);
                body.appendChild(labelInput);
                body.appendChild(deleteBtn);

                // Toggle logic
                header.addEventListener('click', () => {
                    const open = body.style.display === 'block';
                    body.style.display = open ? 'none' : 'block';
                    const icon = toggle.querySelector('svg');
                    icon.style.transform = open ? 'rotate(360deg)' : 'rotate(180deg)';
                });

                section.appendChild(header);
                section.appendChild(body);

                return section;
            };

            // Existing stats
            stats.forEach((stat, i) => {
                accordionContainer.appendChild(createStatEditor(stat, i));
            });

            // Add Stat button
            const addBtn = document.createElement('button');
            addBtn.textContent = '+ Add Stat';
            addBtn.onclick = (e) => {
                e.preventDefault();
                const newStat = document.createElement('div');
                newStat.className = 'stat-item';
                newStat.dataset.statId = `stat-${Date.now()}`;
                newStat.dataset.target = '100';
                newStat.innerHTML = `
                    <div class="stat-icon" data-icon-type="emoji">📊</div>
                    <div class="stat-number">100</div>
                    <div class="stat-label">New Stat</div>
                `;
                element.appendChild(newStat);
                const editor = createStatEditor(newStat, container.children.length);
                accordionContainer.insertBefore(editor, addBtn);
                onChange?.();
            };

            container.appendChild(accordionContainer);
            accordionContainer.appendChild(addBtn);
            return container;
        }
    },

    mount: function (element, options) {
        element.style.display = 'grid';
        element.style.gridTemplateColumns = `repeat(${options.columns || 4}, 1fr)`;
        element.style.gap = '32px';

        // Apply custom sizes and alignment
        const stats = element.querySelectorAll('.stat-item');
        const alignment = options.alignment || 'center';
        
        stats.forEach(stat => {
            // Apply alignment to the entire stat item content
            const alignMap = {
                'left': 'flex-start',
                'center': 'center',
                'right': 'flex-end'
            };
            stat.style.alignItems = alignMap[alignment] || 'center';
            stat.style.textAlign = alignment;

            const icon = stat.querySelector('.stat-icon');
            const number = stat.querySelector('.stat-number');
            const label = stat.querySelector('.stat-label');

            if (icon && options.iconSize) {
                const iconType = icon.dataset.iconType;
                // Only apply size to emoji and icon fonts, NOT SVG
                if (iconType === 'emoji') {
                    icon.style.fontSize = `${options.iconSize}px`;
                } else {
                    const iconChild = icon.querySelector('i');
                    if (iconChild) {
                        // Apply size to icon fonts (Bootstrap, Tabler, Lucide)
                        iconChild.style.fontSize = `${options.iconSize}px`;
                        iconChild.style.width = `${options.iconSize}px`;
                        iconChild.style.height = `${options.iconSize}px`;
                    }
                    const svg = icon.querySelector('svg');
                    if(svg) {
                        svg.style.width = `${options.iconSize}px`;
                        svg.style.height = `${options.iconSize}px`;
                    }
                }
            }
            if (number && options.numberSize) {
                number.style.fontSize = `${options.numberSize}px`;
            }
            if (label && options.labelSize) {
                label.style.fontSize = `${options.labelSize}px`;
            }
        });

        // Initialize Lucide icons if available
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Animation logic
        const duration = (options.duration || 2) * 1000;
        const delay = (options.delay || 0.1) * 1000;
        const easing = options.easing || 'ease-out';

        const easingFunctions = {
            'linear': t => t,
            'ease-out': t => 1 - Math.pow(1 - t, 3),
            'ease-in-out': t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        };

        const easeFn = easingFunctions[easing];

        const animateValue = (element, start, end, duration, easeFn, prefix = '', suffix = '') => {
            const startTime = performance.now();
            const hasDecimal = end.toString().includes('.');

            const step = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeFn(progress);
                const current = start + (end - start) * easedProgress;

                element.textContent = prefix + (hasDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };

        const observerCallback = (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';

                    setTimeout(() => {
                        const numberElement = entry.target.querySelector('.stat-number');
                        const targetValue = parseFloat(entry.target.dataset.target) || 0;
                        const prefix = entry.target.dataset.prefix || '';
                        const suffix = entry.target.dataset.suffix || '';

                        animateValue(numberElement, 0, targetValue, duration, easeFn, prefix, suffix);
                    }, index * delay);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.3
        });

        stats.forEach(stat => {
            observer.observe(stat);
        });

        return {
            destroy: () => {
                observer.disconnect();
            }
        };
    }
};