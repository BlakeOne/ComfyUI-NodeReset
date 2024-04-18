import { app } from "../../scripts/app.js";

app.registerExtension({
	name: "ComfyUI.NodeReset",
	setup() {
		const defaultWidgets = {};
		const orig = LGraphCanvas.prototype.getNodeMenuOptions;
        LGraphCanvas.prototype.getNodeMenuOptions = function(node) {
			const options = orig.call(this, node);
			options.push(null, {				
				content: "Reset",
				callback: () => {
					if (!defaultWidgets[node.type]) {
						defaultWidgets[node.type] = LiteGraph.createNode(node.type, node.name, node.options).widgets;
					}
					defaultWidgets[node.type].forEach(defaultWidget => {
						let widget = node.widgets.find(widget => widget.name === defaultWidget.name);
						if (widget) {
							widget = widget.widget ?? widget;
							defaultWidget = defaultWidget.widget ?? defaultWidget;

							widget.value = defaultWidget.value;
							if (widget.options && widget.options.property && node.properties[widget.options.property] !== undefined) {
								node.setProperty(widget.options.property, widget.value);
							}
							if (widget.callback) {
								widget.callback(widget.value, this, node);
							}							
						}
					});
					node.setDirtyCanvas(true, false);
				}				
			});
			return options;
		};
	}
});
