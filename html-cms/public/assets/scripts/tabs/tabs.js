class Tabs {
    constructor(container) {
      this.container = container;
      this.tabs = [...container.querySelectorAll('[role="tab"]')];
      this.panels = [...container.querySelectorAll('[role="tabpanel"]')];
      
      this.init();
    }
  
    init() {
      this.tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => this.selectTab(index));
        tab.addEventListener('keydown', (e) => this.handleKeydown(e, index));
      });
      
      this.selectTab(0);
    }
  
    selectTab(index) {
      this.tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', i === index);
        tab.tabIndex = i === index ? 0 : -1;
      });
      
      this.panels.forEach((panel, i) => {
        panel.hidden = i !== index;
      });
      
      this.tabs[index].focus();
    }
  
    handleKeydown(e, index) {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.selectTab(index === 0 ? this.tabs.length - 1 : index - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.selectTab(index === this.tabs.length - 1 ? 0 : index + 1);
          break;
        case 'Home':
          e.preventDefault();
          this.selectTab(0);
          break;
        case 'End':
          e.preventDefault();
          this.selectTab(this.tabs.length - 1);
          break;
      }
    }
  }
  
