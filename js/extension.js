import { app } from "../../scripts/app.js";

app.registerExtension({
	name: "ComfyUI.NodeDefaults",
	setup() {
		const defaultWidgets = {};
		const orig = LGraphCanvas.prototype.getNodeMenuOptions;
        LGraphCanvas.prototype.getNodeMenuOptions = function(node) {						
			const options = orig.call(this, node);
			options.push(null, {				
				content: "Restore default values",
				callback: () => {
					if (!defaultWidgets[node.type]) {
						defaultWidgets[node.type] = LiteGraph.createNode(node.type, node.name, node.options).widgets;
					}
					defaultWidgets[node.type].forEach(defaultWidget => {
						const widget = node.widgets.find(widget => widget.name === defaultWidget.name);
						if (widget) widget.value = defaultWidget.value;									
					});
					node.setDirtyCanvas(true, false);
				}				
			});
			return options;
		};
	}
});