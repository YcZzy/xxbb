Component({
    properties: {
        quantity: {
            type: Number,
            value: 0
        },
        active: {
            type: Boolean,
            value: !1
        },
        lite: {
            type: Boolean,
            value: !1
        }
    },
    data: {
        display: "0"
    },
    observers: {
        "quantity, active, lite": function() {
            this.animate();
        }
    },
    lifetimes: {
        attached: function() {
            this.mounted = !0, this.animate();
        },
        detached: function() {
            this.mounted = !1, clearTimeout(this.timer);
        }
    },
    pageLifetimes: {
        hide: function() {
            this.hidden = !0, clearTimeout(this.timer);
        },
        show: function() {
            this.hidden = !1, this.animate();
        }
    },
    methods: {
        animate: function() {
            var t = this;
            if (clearTimeout(this.timer), this.mounted && !this.hidden && this.data.active) {
                var e = Math.max(0, Math.round(Number(this.data.quantity) || 0)), i = Date.now();
                !function a() {
                    if (t.mounted && !t.hidden && t.data.active) {
                        var n, d = t.data.lite ? 1 : Math.min(1, (Date.now() - i) / 1e3), o = (n = Math.round(e * (1 - Math.pow(1 - d, 3))), 
                        String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        t.data.display !== o && t.setData({
                            display: o
                        }), d < 1 && (t.timer = setTimeout(a, 50));
                    }
                }();
            }
        }
    }
});