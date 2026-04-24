/*
Usage:

<div data-cb-type="simple-stats" style="flex-wrap: wrap; gap: 32px; display: flex; justify-content: space-between;" class="flex justify-between" data-cb-columns="4" data-cb-alignment="center" data-cb-duration="2" data-cb-delay="0.1" data-cb-easing="ease-out" data-cb-number-size="60" data-cb-label-size="14" data-cb-show-dividers="true">
    <div class="stat-item" data-target="250">
        <div class="stat-number">250</div>
        <div class="stat-label">Projects Delivered</div>
    </div>
    <div class="stat-item" data-target="98">
        <div class="stat-number">98</div>
        <div class="stat-label">Client Satisfaction</div>
    </div>
    <div class="stat-item" data-target="15">
        <div class="stat-number">15</div>
        <div class="stat-label">Countries Served</div>
    </div>
    <div class="stat-item" data-target="24/7">
        <div class="stat-number">24/7</div>
        <div class="stat-label">Support Available</div>
    </div>
</div>
*/
export default {
    name: 'simple-stats',
    displayName: 'Simple Stats',
    version: '1.0.0',

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
                fields: ['numberSize', 'labelSize', 'showDividers']
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
        numberSize: {
            type: 'number',
            label: 'Number Size',
            default: 60,
            min: 24,
            max: 96,
            step: 2,
            unit: 'px',
            group: 'appearance'
        },
        labelSize: {
            type: 'number',
            label: 'Label Size',
            default: 14,
            min: 12,
            max: 24,
            step: 1,
            unit: 'px',
            group: 'appearance'
        },
        showDividers: {
            type: 'toggle',
            label: 'Show Dividers',
            default: true,
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

                // Number Input
                const numberLabel = document.createElement('label');
                numberLabel.textContent = 'Target Number';
                numberLabel.style.cssText = 'display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;';

                const numberInput = document.createElement('input');
                numberInput.type = 'text';
                numberInput.placeholder = '250+';
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
                labelInput.placeholder = 'Projects Delivered';
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
        element.style.display = 'flex';
        element.style.justifyContent = 'space-between';
        element.style.flexWrap = 'wrap';
        element.style.gap = '32px';

        // Apply custom sizes and alignment
        const stats = element.querySelectorAll('.stat-item');
        const alignment = options.alignment || 'center';
        const showDividers = options.showDividers !== false;
        
        stats.forEach((stat, index) => {
            stat.style.textAlign = alignment;
            stat.style.flex = '1';
            stat.style.minWidth = '120px';

            // Add/remove divider
            if (showDividers && index < stats.length - 1) {
                stat.style.borderRight = '1px solid rgb(229, 231, 235)';
                stat.style.paddingRight = '32px';
            } else {
                stat.style.borderRight = 'none';
                stat.style.paddingRight = '0';
            }

            const number = stat.querySelector('.stat-number');
            const label = stat.querySelector('.stat-label');

            if (number && options.numberSize) {
                number.style.fontSize = `${options.numberSize}px`;
            }
            if (label && options.labelSize) {
                label.style.fontSize = `${options.labelSize}px`;
            }
        });

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
                        const targetText = entry.target.dataset.target || '0';
                        const prefix = entry.target.dataset.prefix || '';
                        const suffix = entry.target.dataset.suffix || '';

                        // Check if target contains only numbers (and decimals)
                        const numericMatch = targetText.match(/[\d.]+/);
                        if (numericMatch) {
                            const targetValue = parseFloat(numericMatch[0]);
                            // Extract non-numeric parts
                            const beforeNum = targetText.substring(0, targetText.indexOf(numericMatch[0]));
                            const afterNum = targetText.substring(targetText.indexOf(numericMatch[0]) + numericMatch[0].length);
                            
                            animateValue(numberElement, 0, targetValue, duration, easeFn, prefix + beforeNum, afterNum + suffix);
                        } else {
                            // No numeric value, just display as-is
                            numberElement.textContent = prefix + targetText + suffix;
                        }
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