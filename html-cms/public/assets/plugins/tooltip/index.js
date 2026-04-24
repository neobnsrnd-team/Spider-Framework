export default {
    name: 'tooltip',
    version: '1.0.0',
    
    mount: function(element, options) {
        var tooltipText = options.text || 'Tooltip';
        var tooltip = document.createElement('div');
        
        // Style the tooltip
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = 'position:fixed; background:#333; color:#fff; ' +
                                'padding:5px 10px; border-radius:4px; font-family: system-ui, sans-serif;' +
                                'font-size:12px; display:none; z-index:9999;';
        document.body.appendChild(tooltip);
        
        // Show on hover
        element.addEventListener('mouseenter', function(e) {
            tooltip.style.display = 'block';
            tooltip.style.left = e.clientX + 10 + 'px';
            tooltip.style.top = e.clientY + 10 + 'px';
        });
        
        // Hide when mouse leaves
        element.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });
        
        return { tooltip: tooltip };
    }
};