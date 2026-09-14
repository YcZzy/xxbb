var e = require("../../@babel/runtime/helpers/objectSpread2");

require("../../@babel/runtime/helpers/Arrayincludes");

var r = function(e) {
    return String(e).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}, t = function(e) {
    return [ "call_100000", "call_10000" ].includes(e) ? "/assets/images/badges/".concat(e.replace("_", "-"), ".png") : "";
}, a = {
    love_100: "爱",
    support_1000: "千",
    call_10000: "万",
    call_100000: "星"
};

function n(n, o) {
    var l = n && n.call_count;
    if (!Number.isSafeInteger(l) || l < 0 || !Array.isArray(o) || !o.length) return {
        available: !1
    };
    if (!o.every(function(e) {
        return e && "string" == typeof e.code && e.code && "string" == typeof e.name && e.name && Number.isSafeInteger(e.threshold) && e.threshold > 0;
    })) return {
        available: !1
    };
    var d = o.map(function(r) {
        return e(e({}, r), {}, {
            name: "call_100000" === r.code ? "星河加冕" : r.name
        });
    }).sort(function(e, r) {
        return e.threshold - r.threshold;
    }), c = Array.isArray(n.badge_awarded_codes), s = new Set(c ? n.badge_awarded_codes : []), h = d.find(function(e) {
        return l < e.threshold;
    }) || d[d.length - 1], i = Math.max(0, h.threshold - l), u = d[d.length - 1], m = l >= u.threshold;
    return {
        available: !0,
        awardsKnown: c,
        count: l,
        countText: r(l),
        targetText: r(h.threshold),
        targetName: h.name,
        targetCode: h.code,
        artwork: t(h.code),
        targetSymbol: h.symbol || a[h.code] || "徽",
        scale: Math.min(1, l / h.threshold),
        remaining: i,
        remainingText: r(i),
        reachedTop: m,
        awardedTop: m && s.has(u.code),
        tiers: d.map(function(e, n) {
            return {
                code: e.code,
                name: e.name,
                threshold: e.threshold,
                level: e.level || n + 1,
                symbol: e.symbol || a[e.code] || "徽",
                artwork: t(e.code),
                fullThresholdText: r(e.threshold),
                remainingText: r(Math.max(0, e.threshold - l)),
                scale: Math.min(1, l / e.threshold),
                thresholdText: e.threshold >= 1e4 ? "".concat(e.threshold / 1e4, "万") : r(e.threshold),
                reached: l >= e.threshold,
                awarded: s.has(e.code),
                current: e.code === h.code,
                stateText: c ? s.has(e.code) ? "已获章" : l >= e.threshold ? "待颁发" : "未达成" : "状态待同步"
            };
        })
    };
}

module.exports = {
    build: n,
    withCount: function(e, r) {
        return e && e.available ? n({
            call_count: r,
            badge_awarded_codes: e.awardsKnown ? e.tiers.filter(function(e) {
                return e.awarded;
            }).map(function(e) {
                return e.code;
            }) : void 0
        }, e.tiers) : e;
    },
    preview: function(r, t) {
        if (!r || !r.available) return null;
        var a = r.tiers.find(function(e) {
            return e.code === t;
        });
        return a ? e(e({}, a), {}, {
            countText: r.countText,
            awardsKnown: r.awardsKnown
        }) : null;
    }
};