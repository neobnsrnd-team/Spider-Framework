export default {
    name: 'blobs-bg',
    displayName: 'Gradient Blobs',
    version: '1.0.0',

    settings: {
        _groups: [
            {
                id: 'colors',
                label: 'Color Settings',
                fields: ['colorScheme', 'intensity']
            },
            {
                id: 'animation',
                label: 'Animation Settings',
                fields: ['blobCount', 'animationSpeed']
            },
            {
                id: 'advanced',
                label: 'Advanced',
                fields: ['blobOpacity', 'blobBlur']
            }
        ],
        colorScheme: {
            type: 'select',
            label: 'Color Scheme',
            default: 'peach',
            options: [
                { value: 'sunset', label: 'Sunset (Red-Orange)' },
                { value: 'peach', label: 'Peach (Light Pink-Cream)' },
                { value: 'autumn', label: 'Autumn (Burnt Orange-Gold)' },
                { value: 'warmPink', label: 'Warm Pink (Coral-Purple Pink)' },
                { value: 'terracotta', label: 'Terracotta (Clay-Sand)' }
            ],
            group: 'colors'
        },
        intensity: {
            type: 'select',
            label: 'Intensity',
            default: 'medium',
            options: [
                { value: 'subtle', label: 'Subtle' },
                { value: 'medium', label: 'Medium' },
                { value: 'bold', label: 'Bold' }
            ],
            group: 'colors'
        },
        blobCount: {
            type: 'number',
            label: 'Number of Blobs',
            default: 4,
            min: 2,
            max: 5,
            step: 1,
            group: 'animation'
        },
        animationSpeed: {
            type: 'select',
            label: 'Animation Speed',
            default: 'slow',
            options: [
                { value: 'slow', label: 'Slow' },
                { value: 'medium', label: 'Medium' },
                { value: 'fast', label: 'Fast' }
            ],
            group: 'animation'
        },
        blobOpacity: {
            type: 'range',
            label: 'Blob Opacity',
            default: 40,
            min: 10,
            max: 80,
            step: 5,
            unit: '%',
            group: 'advanced'
        },
        blobBlur: {
            type: 'range',
            label: 'Blur Amount',
            default: 60,
            min: 30,
            max: 100,
            step: 5,
            unit: 'px',
            group: 'advanced'
        }
    },

    mount: function(element, options) {
        // Warm color schemes configuration
        const colorSchemes = {
            sunset: {
                blobs: [
                    { gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)' }, // Coral red
                    { gradient: 'linear-gradient(135deg, #ffa726 0%, #ffb74d 100%)' }, // Warm orange
                    { gradient: 'linear-gradient(135deg, #ff7043 0%, #ff8a65 100%)' }, // Deep orange
                    { gradient: 'linear-gradient(135deg, #ffca28 0%, #ffd54f 100%)' }, // Golden yellow
                    { gradient: 'linear-gradient(135deg, #ff6f61 0%, #ff8b7b 100%)' }  // Peachy coral
                ]
            },
            peach: {
                blobs: [
                    { gradient: 'linear-gradient(135deg, #ffb3ba 0%, #ffccd5 100%)' }, // Light pink
                    { gradient: 'linear-gradient(135deg, #ffd1a1 0%, #ffe4c4 100%)' }, // Peach
                    { gradient: 'linear-gradient(135deg, #ffc3a0 0%, #ffdab9 100%)' }, // Apricot
                    { gradient: 'linear-gradient(135deg, #ffafcc 0%, #ffc8dd 100%)' }, // Rose
                    { gradient: 'linear-gradient(135deg, #ffe5d9 0%, #fff0e8 100%)' }  // Cream
                ]
            },
            autumn: {
                blobs: [
                    { gradient: 'linear-gradient(135deg, #d35400 0%, #e67e22 100%)' }, // Burnt orange
                    { gradient: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)' }, // Red
                    { gradient: 'linear-gradient(135deg, #f39c12 0%, #f1c40f 100%)' }, // Gold
                    { gradient: 'linear-gradient(135deg, #d68910 0%, #e59a3c 100%)' }, // Amber
                    { gradient: 'linear-gradient(135deg, #ba4a00 0%, #dc7633 100%)' }  // Rust
                ]
            },
            warmPink: {
                blobs: [
                    { gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' }, // Coral pink
                    { gradient: 'linear-gradient(135deg, #fbc2eb 0%, #fccde2 100%)' }, // Light purple pink
                    { gradient: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fb9 100%)' }, // Hot pink
                    { gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fff4d4 100%)' }, // Warm yellow
                    { gradient: 'linear-gradient(135deg, #fd79a8 0%, #ff9ff3 100%)' }  // Bright pink
                ]
            },
            terracotta: {
                blobs: [
                    { gradient: 'linear-gradient(135deg, #d4a373 0%, #e8c4a0 100%)' }, // Tan
                    { gradient: 'linear-gradient(135deg, #c97c5d 0%, #d99578 100%)' }, // Terracotta
                    { gradient: 'linear-gradient(135deg, #b85c38 0%, #cd7f5f 100%)' }, // Clay
                    { gradient: 'linear-gradient(135deg, #e8b298 0%, #f4d0bc 100%)' }, // Sand
                    { gradient: 'linear-gradient(135deg, #a0522d 0%, #bc6c45 100%)' }  // Sienna
                ]
            }
        };

        // Intensity configurations
        const intensityConfigs = {
            subtle: { blobSizes: [450, 400, 350, 330, 370] },
            medium: { blobSizes: [500, 450, 400, 380, 420] },
            bold: { blobSizes: [550, 500, 450, 430, 470] }
        };

        // Animation speed configurations (in seconds)
        const speedConfigs = {
            slow: 15,
            medium: 10,
            fast: 6
        };

        // Get configuration from options
        const colorScheme = options.colorScheme || 'peach';
        const intensity = options.intensity || 'medium';
        const blobCount = options.blobCount || 4;
        const animationSpeed = options.animationSpeed || 'slow';
        const blobOpacity = (options.blobOpacity || 40) / 100; // Convert percentage to decimal
        const blobBlur = options.blobBlur || 60;

        // Get scheme and config
        const scheme = colorSchemes[colorScheme] || colorSchemes.peach;
        const config = intensityConfigs[intensity] || intensityConfigs.medium;
        const animationDuration = speedConfigs[animationSpeed] || speedConfigs.slow;

        // Set CSS variables
        element.style.setProperty('--blob-opacity', blobOpacity);
        element.style.setProperty('--blob-blur', blobBlur + 'px');
        element.style.setProperty('--animation-duration', animationDuration + 's');

        // Clear existing content
        element.innerHTML = '';

        // Create blobs container
        const blobsContainer = document.createElement('div');
        blobsContainer.className = 'cb-warm-blobs-bg__container';

        // Create blob elements
        const blobsToUse = scheme.blobs.slice(0, blobCount);
        blobsToUse.forEach((blob, index) => {
            const blobElement = document.createElement('div');
            blobElement.className = 'cb-warm-blobs-bg__blob cb-warm-blobs-bg__blob--' + (index + 1);

            // Set blob-specific size and gradient
            const blobSize = config.blobSizes[index] || 400;
            element.style.setProperty('--blob-size-' + (index + 1), blobSize + 'px');
            element.style.setProperty('--blob-gradient-' + (index + 1), blob.gradient);

            blobsContainer.appendChild(blobElement);
        });

        element.appendChild(blobsContainer);

        return {
            destroy: function() {
                element.innerHTML = '';
            }
        };
    },

    unmount: function(element, instance) {
        if (instance && instance.destroy) {
            instance.destroy();
        }
    }
};