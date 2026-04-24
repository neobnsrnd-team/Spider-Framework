export default {
    name: 'button',
    displayName: 'Button',
    version: '1.0.0',

    settings: {
        primaryColor: {
            type: 'color',
            label: 'Primary Color',
            default: '#3b82f6'
        },
        secondaryColor: {
            type: 'color',
            label: 'Secondary Color',
            default: '#8b5cf6'
        }
    },

    editor: {
        openContentEditor: function (element, builder, onChange) {
            const container = document.createElement('div');
            container.style.cssText = 'padding: 16px;';

            const link = element.querySelector('a');

            // Button Text Input
            const textLabel = document.createElement('label');
            textLabel.textContent = 'Button Text';
            textLabel.style.cssText = 'display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;';

            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.placeholder = 'Enter button text';
            textInput.value = link.textContent.trim();
            textInput.style.cssText = 'width: 100%; padding: 8px 12px; margin-bottom: 16px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;';

            textInput.addEventListener('input', () => {
                link.textContent = textInput.value;
                if (onChange) onChange();
            });

            // Link URL Input
            const linkLabel = document.createElement('label');
            linkLabel.textContent = 'Link URL';
            linkLabel.style.cssText = 'display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;';

            const linkInput = document.createElement('input');
            linkInput.type = 'url';
            linkInput.placeholder = 'https://example.com';
            linkInput.value = link.getAttribute('href') || '';
            linkInput.style.cssText = 'width: 100%; padding: 8px 12px; margin-bottom: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;';

            linkInput.addEventListener('input', () => {
                link.setAttribute('href', linkInput.value);
                if (onChange) onChange();
            });

            // Help text
            const helpText = document.createElement('small');
            helpText.textContent = 'Enter a valid URL for the button';
            helpText.style.cssText = 'display: block; font-size: 12px; color: #666;';

            // Assemble editor
            container.appendChild(textLabel);
            container.appendChild(textInput);
            container.appendChild(linkLabel);
            container.appendChild(linkInput);
            container.appendChild(helpText);

            return container;
        }
    },

    mount: function (element, options) {
        const link = element.querySelector('a');
        
        const primaryColor = options.primaryColor || '#3b82f6';
        const secondaryColor = options.secondaryColor || '#8b5cf6';
        
        link.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
        
        return {};
    }
};