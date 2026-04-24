export default {
    name: 'cta-buttons',
    displayName: 'CTA Buttons',
    version: '1.0.0',

    settings: {
        _groups: [
            {
                id: 'primary',
                label: 'Primary Button',
                fields: [
                    'primaryStyle',
                    'primaryColor1', 'primaryColor2', 'primaryTextColor',
                    'primaryPaddingY', 'primaryPaddingX', 'primaryBorderRadius',
                    'primaryFontSize', 'primaryFontWeight',
                    'primaryShadow', 'primaryHoverLift'
                ]
            },
            {
                id: 'secondary',
                label: 'Secondary Button',
                fields: [
                    'secondaryStyle',
                    'secondaryColor1', 'secondaryColor2', 'secondaryTextColor',
                    'secondaryPaddingY', 'secondaryPaddingX', 'secondaryBorderRadius',
                    'secondaryFontSize', 'secondaryFontWeight',
                    'secondaryShadow', 'secondaryHoverLift'
                ]
            },
            {
                id: 'layout',
                label: 'Layout',
                fields: ['gap', 'alignment']
            }
        ],

        primaryStyle: {
            type: 'select',
            label: 'Button Style',
            default: 'gradient',
            options: [
                { value: 'gradient', label: 'Gradient' },
                { value: 'solid', label: 'Solid' },
                { value: 'outline', label: 'Outline' },
                { value: 'ghost', label: 'Ghost' }
            ],
            group: 'primary'
        },
        primaryColor1: {
            type: 'color',
            label: 'Primary Color',
            default: '#6366f1',
            group: 'primary'
        },
        primaryColor2: {
            type: 'color',
            label: 'Secondary Color',
            default: '#8b5cf6',
            group: 'primary'
        },
        primaryTextColor: {
            type: 'color',
            label: 'Text Color',
            default: '#ffffff',
            group: 'primary'
        },
        primaryPaddingY: {
            type: 'range',
            label: 'Padding Vertical',
            default: 14,
            min: 8,
            max: 24,
            step: 1,
            unit: 'px',
            group: 'primary'
        },
        primaryPaddingX: {
            type: 'range',
            label: 'Padding Horizontal',
            default: 32,
            min: 16,
            max: 64,
            step: 1,
            unit: 'px',
            group: 'primary'
        },
        primaryBorderRadius: {
            type: 'range',
            label: 'Border Radius',
            default: 12,
            min: 0,
            max: 50,
            step: 1,
            unit: 'px',
            group: 'primary'
        },
        primaryFontSize: {
            type: 'range',
            label: 'Font Size',
            default: 16,
            min: 12,
            max: 24,
            step: 1,
            unit: 'px',
            group: 'primary'
        },
        primaryFontWeight: {
            type: 'boolean',
            label: 'Bold Text',
            default: true,
            group: 'primary'
        },
        primaryShadow: {
            type: 'boolean',
            label: 'Drop Shadow',
            default: true,
            group: 'primary'
        },
        primaryHoverLift: {
            type: 'boolean',
            label: 'Hover Lift Effect',
            default: true,
            group: 'primary'
        },

        secondaryStyle: {
            type: 'select',
            label: 'Button Style',
            default: 'outline',
            options: [
                { value: 'gradient', label: 'Gradient' },
                { value: 'solid', label: 'Solid' },
                { value: 'outline', label: 'Outline' },
                { value: 'ghost', label: 'Ghost' }
            ],
            group: 'secondary'
        },
        secondaryColor1: {
            type: 'color',
            label: 'Primary Color',
            default: '#e2e8f0',
            group: 'secondary'
        },
        secondaryColor2: {
            type: 'color',
            label: 'Secondary Color',
            default: '#cbd5e1',
            group: 'secondary'
        },
        secondaryTextColor: {
            type: 'color',
            label: 'Text Color',
            default: '#0f172a',
            group: 'secondary'
        },
        secondaryPaddingY: {
            type: 'range',
            label: 'Padding Vertical',
            default: 14,
            min: 8,
            max: 24,
            step: 1,
            unit: 'px',
            group: 'secondary'
        },
        secondaryPaddingX: {
            type: 'range',
            label: 'Padding Horizontal',
            default: 32,
            min: 16,
            max: 64,
            step: 1,
            unit: 'px',
            group: 'secondary'
        },
        secondaryBorderRadius: {
            type: 'range',
            label: 'Border Radius',
            default: 12,
            min: 0,
            max: 50,
            step: 1,
            unit: 'px',
            group: 'secondary'
        },
        secondaryFontSize: {
            type: 'range',
            label: 'Font Size',
            default: 16,
            min: 12,
            max: 24,
            step: 1,
            unit: 'px',
            group: 'secondary'
        },
        secondaryFontWeight: {
            type: 'boolean',
            label: 'Bold Text',
            default: true,
            group: 'secondary'
        },
        secondaryShadow: {
            type: 'boolean',
            label: 'Drop Shadow',
            default: true,
            group: 'secondary'
        },
        secondaryHoverLift: {
            type: 'boolean',
            label: 'Hover Lift Effect',
            default: false,
            group: 'secondary'
        },

        gap: {
            type: 'range',
            label: 'Gap Between Buttons',
            default: 16,
            min: 0,
            max: 48,
            step: 4,
            unit: 'px',
            group: 'layout'
        },
        alignment: {
            type: 'select',
            label: 'Alignment',
            default: 'center',
            options: [
                { value: 'flex-start', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'flex-end', label: 'Right' }
            ],
            group: 'layout'
        }
    },

    editor: {
        openContentEditor: function (element, builder, onChange) {
            const container = document.createElement('div');

            const buttons = element.querySelectorAll('.cta-btn');
            const primaryBtn = buttons[0];
            const secondaryBtn = buttons[1];

            // Primary Button Section
            const primaryTitle = document.createElement('h3');
            primaryTitle.textContent = 'Primary Button';
            primaryTitle.style.cssText = 'font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #0f172a;';

            // Primary Button Text
            const primaryTextLabel = document.createElement('label');
            primaryTextLabel.textContent = 'Button Text';
            primaryTextLabel.style.cssText = 'display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;';

            const primaryTextInput = document.createElement('input');
            primaryTextInput.type = 'text';
            primaryTextInput.placeholder = 'Enter button text';
            primaryTextInput.value = primaryBtn.textContent.trim();
            primaryTextInput.style.cssText = 'width: 100%; padding: 8px 12px; margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;';

            primaryTextInput.addEventListener('input', () => {
                primaryBtn.textContent = primaryTextInput.value;
                if (onChange) onChange();
            });

            // Primary Link URL
            const primaryLinkLabel = document.createElement('label');
            primaryLinkLabel.textContent = 'Link URL';
            primaryLinkLabel.style.cssText = 'display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;';

            const primaryLinkInput = document.createElement('input');
            primaryLinkInput.type = 'url';
            primaryLinkInput.placeholder = 'https://example.com';
            primaryLinkInput.value = primaryBtn.getAttribute('href') || '';
            primaryLinkInput.style.cssText = 'width: 100%; padding: 8px 12px; margin-bottom: 8px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;';

            primaryLinkInput.addEventListener('input', () => {
                if (primaryLinkInput.value) {
                    primaryBtn.setAttribute('href', primaryLinkInput.value);
                } else {
                    primaryBtn.removeAttribute('href');
                }
                if (onChange) onChange();
            });

            // Primary Help Text
            const primaryHelpText = document.createElement('small');
            primaryHelpText.textContent = 'Enter a valid URL for the button';
            primaryHelpText.style.cssText = 'display: block; font-size: 12px; color: #64748b; margin-bottom: 24px;';

            // Divider
            const divider = document.createElement('div');
            divider.style.cssText = 'height: 1px; background: #e2e8f0; margin: 24px 0;';

            // Secondary Button Section
            const secondaryTitle = document.createElement('h3');
            secondaryTitle.textContent = 'Secondary Button';
            secondaryTitle.style.cssText = 'font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #0f172a;';

            // Secondary Button Text
            const secondaryTextLabel = document.createElement('label');
            secondaryTextLabel.textContent = 'Button Text';
            secondaryTextLabel.style.cssText = 'display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;';

            const secondaryTextInput = document.createElement('input');
            secondaryTextInput.type = 'text';
            secondaryTextInput.placeholder = 'Enter button text';
            secondaryTextInput.value = secondaryBtn.textContent.trim();
            secondaryTextInput.style.cssText = 'width: 100%; padding: 8px 12px; margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;';

            secondaryTextInput.addEventListener('input', () => {
                secondaryBtn.textContent = secondaryTextInput.value;
                if (onChange) onChange();
            });

            // Secondary Link URL
            const secondaryLinkLabel = document.createElement('label');
            secondaryLinkLabel.textContent = 'Link URL';
            secondaryLinkLabel.style.cssText = 'display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;';

            const secondaryLinkInput = document.createElement('input');
            secondaryLinkInput.type = 'url';
            secondaryLinkInput.placeholder = 'https://example.com';
            secondaryLinkInput.value = secondaryBtn.getAttribute('href') || '';
            secondaryLinkInput.style.cssText = 'width: 100%; padding: 8px 12px; margin-bottom: 8px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;';

            secondaryLinkInput.addEventListener('input', () => {
                if (secondaryLinkInput.value) {
                    secondaryBtn.setAttribute('href', secondaryLinkInput.value);
                } else {
                    secondaryBtn.removeAttribute('href');
                }
                if (onChange) onChange();
            });

            // Secondary Help Text
            const secondaryHelpText = document.createElement('small');
            secondaryHelpText.textContent = 'Enter a valid URL for the button';
            secondaryHelpText.style.cssText = 'display: block; font-size: 12px; color: #64748b;';

            // Assemble editor
            container.appendChild(primaryTitle);
            container.appendChild(primaryTextLabel);
            container.appendChild(primaryTextInput);
            container.appendChild(primaryLinkLabel);
            container.appendChild(primaryLinkInput);
            container.appendChild(primaryHelpText);
            
            container.appendChild(divider);
            
            container.appendChild(secondaryTitle);
            container.appendChild(secondaryTextLabel);
            container.appendChild(secondaryTextInput);
            container.appendChild(secondaryLinkLabel);
            container.appendChild(secondaryLinkInput);
            container.appendChild(secondaryHelpText);

            const hr = document.createElement('hr');
            hr.style.cssText = 'display: block; margin; 30px 0;';
            container.appendChild(hr);
            return container;
        }
    },

    mount: function (element, options) {
        const container = element.querySelector('.cta-buttons-container') || element;
        
        container.style.display = 'flex';
        container.style.gap = `${options.gap || 16}px`;
        container.style.justifyContent = options.alignment || 'center';
        container.style.alignItems = 'center';
        container.style.flexWrap = 'wrap';

        const buttons = container.querySelectorAll('.cta-btn');
        buttons.forEach((btn, index) => {
            const prefix = index === 0 ? 'primary' : 'secondary';
            this.styleButton(btn, options, prefix);
        });

        return {};
    },

    styleButton: function(btn, opts, prefix) {
        const style = opts[`${prefix}Style`] || 'gradient';
        const c1 = opts[`${prefix}Color1`] || '#6366f1';
        const c2 = opts[`${prefix}Color2`] || '#8b5cf6';
        const tc = opts[`${prefix}TextColor`] || '#ffffff';
        const py = opts[`${prefix}PaddingY`] ?? 14;
        const px = opts[`${prefix}PaddingX`] ?? 32;
        const br = opts[`${prefix}BorderRadius`] ?? 12;
        const fs = opts[`${prefix}FontSize`] ?? 16;
        const fw = opts[`${prefix}FontWeight`] !== false;
        const shadow = opts[`${prefix}Shadow`] !== false;
        const lift = opts[`${prefix}HoverLift`] !== false;

        // Helper function to add alpha to any color format
        const addAlpha = (color, alpha) => {
            if (color.startsWith('rgba')) {
                return color.replace(/[\d.]+\)$/g, `${alpha})`);
            } else if (color.startsWith('rgb')) {
                return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
            } else {
                return `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
            }
        };

        let bg, border, color, boxShadow;
        
        if (style === 'gradient') {
            bg = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
            border = 'none';
            color = tc;
            boxShadow = shadow ? `0 10px 40px ${addAlpha(c1, 0.25)}` : 'none';
        } else if (style === 'solid') {
            bg = c1;
            border = 'none';
            color = tc;
            boxShadow = shadow ? `0 10px 40px ${addAlpha(c1, 0.25)}` : 'none';
        } else if (style === 'outline') {
            bg = 'white';
            border = `1px solid ${c1}`;
            color = tc;
            boxShadow = shadow ? '0 2px 8px rgba(0, 0, 0, 0.04)' : 'none';
        } else { // ghost
            bg = 'transparent';
            border = 'none';
            color = c1;
            boxShadow = shadow ? `0 10px 40px ${addAlpha(c1, 0.25)}` : 'none';
        }

        // Apply all styles at once
        btn.style.padding = `${py}px ${px}px`;
        btn.style.borderRadius = `${br}px`;
        btn.style.fontSize = `${fs}px`;
        btn.style.fontWeight = fw ? '600' : '400';
        btn.style.background = bg;
        btn.style.border = border;
        btn.style.color = color;
        btn.style.boxShadow = boxShadow;
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.3s ease';
        btn.style.textDecoration = 'none';
        btn.style.display = 'inline-block';

        // Hover handlers
        btn.onmouseenter = () => {
            if (lift) btn.style.transform = 'translateY(-2px)';
            
            if (style === 'gradient') {
                if (shadow) btn.style.boxShadow = `0 15px 50px ${addAlpha(c1, 0.38)}`;
            } else if (style === 'solid') {
                btn.style.background = c2;
                if (shadow) btn.style.boxShadow = `0 15px 50px ${addAlpha(c1, 0.38)}`;
            } else if (style === 'outline') {
                btn.style.background = `${addAlpha(c2, 0.03)}`;
                btn.style.borderColor = c2;
                if (shadow) btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            } else { // ghost
                btn.style.background = `${addAlpha(c1, 0.03)}`;
                if (shadow) btn.style.boxShadow = `0 15px 50px ${addAlpha(c1, 0.38)}`;
            }
        };

        btn.onmouseleave = () => {
            btn.style.transform = 'translateY(0)';
            btn.style.background = bg;
            btn.style.border = border;
            btn.style.boxShadow = boxShadow;
            if (style === 'outline') {
                btn.style.borderColor = c1;
            }
        };
    }
};