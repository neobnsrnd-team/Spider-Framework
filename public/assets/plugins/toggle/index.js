export default {
    name: 'toggle',
    version: '1.0.0',
    
    mount: function(element, options) {
        var targetId = options.target;
        var target = document.getElementById(targetId);
        
        if (!target) {
            console.error('Target element not found:', targetId);
            return null;
        }
        
        element.addEventListener('click', function() {
            if (target.style.display === 'none') {
                target.style.display = 'block';
            } else {
                target.style.display = 'none';
            }
        });
        
        return { target: target };
    }
};