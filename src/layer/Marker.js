L.Marker = L.Class.extend({
	includes: L.Mixin.Events,
	
	options: {
		icon: new L.Icon(),
		clickable: true
	},
	
	initialize: function(latlng, options) {
		this._latlng = latlng;	
	},
	
	onAdd: function(map) {
		this._map = map;
		
		if (!this._icon) {
			this._icon = this.options.icon.createIcon();
			map._panes.markerPane.appendChild(this._icon);
			this._initInteraction();
		}
		if (!this._shadow) {
			this._shadow = this.options.icon.createShadow();
			map._panes.shadowPane.appendChild(this._shadow);
		}
		
		map.on('viewreset', this._reset, this);
		this._reset();
	},
	
	onRemove: function(map) {
		if (this._icon) {
			map._panes.markerPane.removeChild(this._icon);
		}
		if (!this._shadow) {
			map._panes.shadowPane.removeChild(this._shadow);
		}
		map.off('viewreset', this._reset, this);
	},
	
	getLatLng: function() {
		return this._latlng;
	},
	
	_reset: function() {
		var pos = this._map.latLngToLayerPoint(this._latlng);
		
		L.DomUtil.setPosition(this._icon, pos);
		L.DomUtil.setPosition(this._shadow, pos);
		
		this._icon.style.zIndex = pos.top;
	},
	
	_initInteraction: function() {
		if (this.options.clickable) {
			this._icon.className += ' leaflet-clickable';
			L.DomEvent.addListener(this._icon, 'mousedown', L.DomEvent.stopPropagation);
			L.DomEvent.addListener(this._icon, 'click', this._onClick, this);
		}
	},
	
	_onClick: function(e) {
		this.fire('click');
		L.DomEvent.stopPropagation(e);
	}
});