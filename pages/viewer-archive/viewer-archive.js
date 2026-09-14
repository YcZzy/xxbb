var e = require("../../@babel/runtime/helpers/defineProperty"), t = require("../../@babel/runtime/helpers/toConsumableArray"), a = require("../../@babel/runtime/helpers/regeneratorRuntime"), r = require("../../@babel/runtime/helpers/asyncToGenerator"), n = require("../../config/env"), i = require("../../services/api"), o = require("../../utils/share"), c = require("../../utils/mascot-theme"), s = require("../../utils/view-cache"), u = require("../../utils/performance-mode");

function h(e) {
    return "".concat(e).padStart(2, "0");
}

function l() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(), t = new Date(e + 288e5);
    return {
        year: t.getUTCFullYear(),
        month: t.getUTCMonth() + 1,
        day: t.getUTCDate(),
        hour: t.getUTCHours(),
        minute: t.getUTCMinutes()
    };
}

function d() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(), t = l(e);
    return "".concat(t.year, "-").concat(h(t.month), "-").concat(h(t.day));
}

function v(e) {
    var t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(e || ""));
    return t ? Date.UTC(Number(t[1]), Number(t[2]) - 1, Number(t[3])) : Date.now();
}

function m(e, t) {
    if (e === t) return "今天";
    var a = new Date(v(e)), r = [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ][a.getUTCDay()];
    return "".concat(a.getUTCMonth() + 1, "月").concat(a.getUTCDate(), "日 · ").concat(r);
}

function f(e) {
    var t = Number(e || 0);
    if (!t) return "--:--";
    var a = l(1e3 * t);
    return "".concat(h(a.hour), ":").concat(h(a.minute));
}

function g(e) {
    var t = Math.max(0, Math.round(Number(e) || 0));
    return t ? "".concat(t).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "--";
}

function p(e) {
    if (null == e || "" === e) return "--";
    var t = Math.max(0, Math.round(Number(e) || 0));
    return t ? t >= 1e8 ? "".concat((t / 1e8).toFixed(t >= 1e9 ? 1 : 2), "亿") : t >= 1e4 ? "".concat((t / 1e4).toFixed(t >= 1e5 ? 1 : 2), "万") : "".concat(t).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "--";
}

function w(e) {
    if (null == e || "" === e) return "-";
    var t = Math.max(0, Math.round(Number(e) || 0));
    return t ? "+".concat(p(t)) : "0";
}

function x(e) {
    var t = Math.max(0, Math.round(Number(e) || 0));
    if (!t) return "--";
    var a = Math.floor(t / 60), r = t % 60;
    return "".concat(a, "分").concat(r, "秒");
}

function _(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], a = Math.max(0, Math.round((Number(e) || 0) / 60)), r = Math.floor(a / 60), n = a % 60;
    return r ? n ? t ? "".concat(r, "时").concat(n, "分") : "".concat(r, " 小时 ").concat(n, " 分钟") : "".concat(r, t ? "小时" : " 小时") : "".concat(n, t ? "分" : " 分钟");
}

function y(e) {
    return Array.from(e || "")[0] || "";
}

function b(e, t) {
    var a = Math.floor(v(t) / 1e3) - 28800, r = [ {
        event_id: "preview-morning",
        session_number: 1,
        room_title: "上午场记录",
        started_at: a + 36e3 + 480,
        ended_at: a + 39600 + 3120,
        duration_seconds: 6240,
        is_live: !1,
        peak_viewer_count: 32860,
        total_viewer_count: 428600,
        like_count: 686900,
        follower_gain: 1842,
        follower_gain_estimated: !0,
        average_viewer_count: 25480,
        average_stay_seconds: 126,
        average_stay_estimated: !0,
        viewer_curve: [ 18200, 21400, 26900, 24300, 29100, 32860, 30400, 27600, 22100 ].map(function(e, t) {
            return {
                sampled_at: a + 36e3 + 480 + 780 * t,
                viewer_count: e
            };
        })
    }, {
        event_id: "preview-evening",
        session_number: 2,
        room_title: "晚间场记录",
        started_at: a + 75600 + 120,
        ended_at: a + 82800 + 2640,
        duration_seconds: 9720,
        is_live: !1,
        peak_viewer_count: 58642,
        total_viewer_count: 817300,
        like_count: 1246800,
        follower_gain: 3616,
        follower_gain_estimated: !0,
        average_viewer_count: 43820,
        average_stay_seconds: 113,
        average_stay_estimated: !0,
        viewer_curve: [ 24500, 31800, 40400, 36900, 48200, 53600, 49800, 58642, 55200, 46100, 39800 ].map(function(e, t) {
            return {
                sampled_at: a + 75600 + 120 + 900 * t,
                viewer_count: e
            };
        })
    } ];
    return {
        account: e,
        date: t,
        session_count: r.length,
        peak_viewer_count: 58642,
        total_duration_seconds: 15960,
        items: r
    };
}

Page({
    data: {
        statusBarHeight: 20,
        navigationHeight: 64,
        mascotThemeSkin: "classic",
        mascotThemeClass: "theme-classic",
        mascotThemeIsIce: !1,
        mascotThemeIsMoonTide: !1,
        performanceClass: u.className(),
        anchors: [],
        selectedAnchorIndex: 0,
        selectedAnchor: {},
        anchorSelectorOpen: !1,
        anchorSelectorClosing: !1,
        todayDate: "",
        selectedDate: "",
        selectedDateLabel: "",
        loading: !1,
        loadError: "",
        isDevelopmentVersion: !1,
        isPreview: !1,
        sessions: [],
        sessionCount: 0,
        summaryPeak: "--",
        summaryDuration: "0 分钟",
        hasLiveSession: !1
    },
    onLoad: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        o.enableShareMenu(), this.pendingPreferredAccount = decodeURIComponent(String(e.account || "")).trim(), 
        this.setNavigationMetrics(), this.detectDevelopmentVersion();
        var t = d(), a = decodeURIComponent(String(e.date || "")).trim(), r = /^\d{4}-\d{2}-\d{2}$/.test(a) && a <= t ? a : t;
        this.setData({
            todayDate: t,
            selectedDate: r,
            selectedDateLabel: m(r, t)
        }), this.loadPage();
    },
    onShow: function() {
        c.sync(this), this.data.sessions.length && this.drawCharts();
    },
    onPullDownRefresh: function() {
        this.loadArchive().finally(function() {
            return wx.stopPullDownRefresh();
        });
    },
    onUnload: function() {
        this.chartDrawToken = (this.chartDrawToken || 0) + 1, this.anchorSelectorTimer && clearTimeout(this.anchorSelectorTimer);
    },
    setNavigationMetrics: function() {
        try {
            var e = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync(), t = wx.getMenuButtonBoundingClientRect(), a = e.statusBarHeight || 20, r = 2 * (t.top - a) + t.height + a;
            this.setData({
                statusBarHeight: a,
                navigationHeight: r
            });
        } catch (e) {}
    },
    goBack: function() {
        wx.vibrateShort && wx.vibrateShort({
            type: "light",
            fail: function() {}
        }), wx.navigateBack({
            delta: 1,
            fail: function() {
                wx.switchTab({
                    url: "/pages/media/media"
                });
            }
        });
    },
    detectDevelopmentVersion: function() {
        try {
            var e = (wx.getAccountInfoSync ? wx.getAccountInfoSync() : {}).miniProgram || {};
            this.setData({
                isDevelopmentVersion: "develop" === e.envVersion
            });
        } catch (e) {
            e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
            this.setData({
                isDevelopmentVersion: !1
            });
        }
    },
    loadPage: function() {
        var e = this;
        return r(a().mark(function t() {
            var r, o, c, u, h, l, d, v, m, f, g, p, w, x, _, b, S;
            return a().wrap(function(t) {
                for (;;) switch (t.prev = t.next) {
                  case 0:
                    return e.setData({
                        loading: !0,
                        loadError: ""
                    }), r = String(e.pendingPreferredAccount || "").toLowerCase(), 
                    o = s.read("viewer-archive-anchors", 36e5), c = o && Array.isArray(o.data) ? o.data : [], 
                    u = null, h = "", c.length && (l = r ? c.findIndex(function(e) {
                        return String(e.account || "").toLowerCase() === r;
                    }) : -1, d = c.findIndex(function(e) {
                        return e.isPrimary;
                    }), m = c[v = l >= 0 ? l : d < 0 ? 0 : d], e.setData({
                        anchors: c,
                        selectedAnchorIndex: v,
                        selectedAnchor: m
                    }), h = String(m.account || ""), u = e.loadArchive()), t.prev = 7, 
                    t.next = 10, i.fetchAnchors();

                  case 10:
                    if (f = t.sent, g = f && f.data && f.data.items || [], (p = g.map(function(e) {
                        return {
                            account: e.account,
                            nickname: e.nickname || e.account,
                            avatarUrl: (t = e.avatar_url, t && t.startsWith("/") ? "".concat(n.API_BASE_URL).concat(t) : t || ""),
                            initial: y(e.nickname || e.account),
                            status: e.status,
                            isPrimary: Boolean(e.is_primary),
                            featured: Boolean(e.featured)
                        };
                        var t;
                    })).length) {
                        t.next = 15;
                        break;
                    }
                    throw new Error("暂无可查看的主播");

                  case 15:
                    if (w = r ? p.findIndex(function(e) {
                        return String(e.account || "").toLowerCase() === r;
                    }) : -1, x = p.findIndex(function(e) {
                        return e.isPrimary;
                    }), _ = String(e.data.selectedAnchor.account || ""), b = _ ? p.findIndex(function(e) {
                        return e.account === _;
                    }) : -1, S = w >= 0 ? w : b >= 0 ? b : x < 0 ? 0 : x, e.pendingPreferredAccount = "", 
                    e.setData({
                        anchors: p,
                        selectedAnchorIndex: S,
                        selectedAnchor: p[S]
                    }), s.write("viewer-archive-anchors", p), !u || h !== p[S].account) {
                        t.next = 28;
                        break;
                    }
                    return t.next = 26, u;

                  case 26:
                    t.next = 30;
                    break;

                  case 28:
                    return t.next = 30, e.loadArchive();

                  case 30:
                    t.next = 35;
                    break;

                  case 32:
                    t.prev = 32, t.t0 = t.catch(7), e.setData({
                        loadError: t.t0.message || "在线趋势加载失败"
                    });

                  case 35:
                    return t.prev = 35, e.setData({
                        loading: !1
                    }), t.finish(35);

                  case 38:
                  case "end":
                    return t.stop();
                }
            }, t, null, [ [ 7, 32, 35, 38 ] ]);
        }))();
    },
    loadArchive: function() {
        var e = this;
        return r(a().mark(function t() {
            var r, n, o, c, u, h, l, d;
            return a().wrap(function(t) {
                for (;;) switch (t.prev = t.next) {
                  case 0:
                    if ((r = e.data.selectedAnchor) && r.account) {
                        t.next = 3;
                        break;
                    }
                    return t.abrupt("return");

                  case 3:
                    return n = (e.archiveLoadToken || 0) + 1, e.archiveLoadToken = n, 
                    a = r.account, v = e.data.selectedDate, o = "viewer-archive:".concat(String(a || ""), ":").concat(String(v || "")), 
                    c = s.read(o, 432e5), u = !1, c && (e.applyArchive(c.data), 
                    e.archiveSnapshotKey = o, e.archiveSnapshotSignature = JSON.stringify(c.data), 
                    u = !0), e.setData({
                        loading: !u,
                        loadError: "",
                        isPreview: !1
                    }), t.prev = 10, t.next = 13, i.fetchLiveArchives(r.account, e.data.selectedDate, 60);

                  case 13:
                    if (h = t.sent, n === e.archiveLoadToken) {
                        t.next = 16;
                        break;
                    }
                    return t.abrupt("return");

                  case 16:
                    l = h && h.data ? h.data : {}, d = JSON.stringify(l), e.archiveSnapshotKey === o && e.archiveSnapshotSignature === d || (e.applyArchive(l), 
                    s.write(o, l)), e.archiveSnapshotKey = o, e.archiveSnapshotSignature = d, 
                    t.next = 28;
                    break;

                  case 23:
                    if (t.prev = 23, t.t0 = t.catch(10), n === e.archiveLoadToken) {
                        t.next = 27;
                        break;
                    }
                    return t.abrupt("return");

                  case 27:
                    e.data.isDevelopmentVersion && "NOT_FOUND" === t.t0.code ? e.applyArchive(b(r.account, e.data.selectedDate), !0) : u || e.setData({
                        sessions: [],
                        sessionCount: 0,
                        summaryPeak: "--",
                        summaryDuration: "0 分钟",
                        hasLiveSession: !1,
                        loadError: t.t0.message || "在线趋势加载失败"
                    });

                  case 28:
                    return t.prev = 28, n === e.archiveLoadToken && e.setData({
                        loading: !1
                    }), t.finish(28);

                  case 31:
                  case "end":
                    return t.stop();
                }
                var a, v;
            }, t, null, [ [ 10, 23, 28, 31 ] ]);
        }))();
    },
    applyArchive: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], a = (e.items || []).map(function(e) {
            var t = Array.isArray(e.viewer_curve) ? e.viewer_curve.map(function(e) {
                return {
                    sampledAt: Number(e.sampled_at || 0),
                    viewerCount: Math.max(0, Number(e.viewer_count || 0))
                };
            }) : [];
            return {
                eventId: e.event_id,
                sessionNumber: Number(e.session_number || 0),
                roomTitle: e.room_title || "本场记录",
                startTime: f(e.started_at),
                endTime: e.is_live ? "进行中" : f(e.ended_at),
                durationText: _(e.duration_seconds),
                peakText: g(e.peak_viewer_count),
                totalViewerText: p(e.total_viewer_count),
                likeText: p(e.like_count),
                followerGainText: w(e.follower_gain),
                averageViewerText: p(e.average_viewer_count),
                averageStayText: x(e.average_stay_seconds),
                followerGainEstimated: Boolean(e.follower_gain_estimated),
                averageStayEstimated: !1 !== e.average_stay_estimated,
                isLive: Boolean(e.is_live),
                hasCurve: t.length > 0,
                lastViewerText: t.length ? g(t[t.length - 1].viewerCount) : "--",
                lastSampleTime: t.length ? f(t[t.length - 1].sampledAt) : "--:--",
                curveStartTime: t.length ? f(t[0].sampledAt) : f(e.started_at),
                curveEndTime: t.length ? f(t[t.length - 1].sampledAt) : e.is_live ? "现在" : f(e.ended_at),
                viewerCurve: t
            };
        });
        this.setData({
            sessions: a,
            sessionCount: Number(e.session_count || a.length),
            summaryPeak: g(e.peak_viewer_count),
            summaryDuration: _(e.total_duration_seconds, !0),
            hasLiveSession: a.some(function(e) {
                return e.isLive;
            }),
            isPreview: t,
            loadError: ""
        }), this.drawCharts();
    },
    openAnchorSelector: function() {
        this.data.anchors.length && (this.anchorSelectorTimer && clearTimeout(this.anchorSelectorTimer), 
        this.setData({
            anchorSelectorOpen: !0,
            anchorSelectorClosing: !1
        }));
    },
    closeAnchorSelector: function() {
        var e = this;
        this.data.anchorSelectorOpen && !this.data.anchorSelectorClosing && (this.setData({
            anchorSelectorClosing: !0
        }), this.anchorSelectorTimer && clearTimeout(this.anchorSelectorTimer), 
        this.anchorSelectorTimer = setTimeout(function() {
            e.setData({
                anchorSelectorOpen: !1,
                anchorSelectorClosing: !1
            });
        }, 180));
    },
    selectAnchor: function(e) {
        var t = Number(e.currentTarget.dataset.index), a = this.data.anchors[t];
        if (a) {
            var r = t !== this.data.selectedAnchorIndex;
            this.setData({
                selectedAnchorIndex: t,
                selectedAnchor: a
            }), this.closeAnchorSelector(), r && this.loadArchive();
        }
    },
    preventBubble: function() {},
    onDateChange: function(e) {
        var t = String(e.detail.value || this.data.todayDate);
        this.setData({
            selectedDate: t,
            selectedDateLabel: m(t, this.data.todayDate)
        }), this.loadArchive();
    },
    changeDateBy: function(e) {
        var t = Number(e.currentTarget.dataset.offset || 0);
        if (t && !(t > 0 && this.data.selectedDate === this.data.todayDate)) {
            var a = d(v(this.data.selectedDate) + 24 * t * 60 * 60 * 1e3 - 288e5);
            a > this.data.todayDate && (a = this.data.todayDate), this.setData({
                selectedDate: a,
                selectedDateLabel: m(a, this.data.todayDate)
            }), this.loadArchive();
        }
    },
    retryLoad: function() {
        this.data.anchors.length ? this.loadArchive() : this.loadPage();
    },
    drawCharts: function() {
        var e = this, t = (this.chartDrawToken || 0) + 1;
        this.chartDrawToken = t, this.chartLayouts = {}, wx.nextTick(function() {
            t === e.chartDrawToken && e.data.sessions.forEach(function(a, r) {
                a.hasCurve && e.drawChart(r, a.viewerCurve, t);
            });
        });
    },
    drawChart: function(e, a, r) {
        var n = this;
        wx.createSelectorQuery().in(this).select("#archive-chart-".concat(e)).fields({
            node: !0,
            size: !0,
            rect: !0
        }).exec(function(i) {
            if (r === n.chartDrawToken) {
                var o = i && i[0];
                if (o && o.node && o.width && o.height) {
                    var c = o.node, s = c.getContext("2d"), u = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync(), h = Math.max(1, Number(u.pixelRatio || 1));
                    c.width = o.width * h, c.height = o.height * h, s.scale(h, h);
                    var l = o.width, d = o.height, v = 13, m = 8, f = 12, g = 8, p = a.map(function(e) {
                        return Number(e.viewerCount || 0);
                    }), w = a.map(function(e) {
                        return Number(e.sampledAt || 0);
                    }), x = Math.min.apply(Math, t(p)), _ = Math.max.apply(Math, t(p)), y = Math.max(1, _ - x), b = Math.max(0, x - .2 * y), S = _ + .08 * y, T = Math.min.apply(Math, t(w)), D = Math.max.apply(Math, t(w)), k = Math.max(1, D - T), A = l - g - m, C = d - v - f, M = a.map(function(e) {
                        return {
                            x: g + (Number(e.sampledAt || T) - T) / k * A,
                            y: v + (1 - (Number(e.viewerCount || 0) - b) / Math.max(1, S - b)) * C
                        };
                    });
                    n.chartLayouts[e] = {
                        left: Number(o.left || 0),
                        width: l,
                        height: d,
                        coordinates: M,
                        points: a
                    };
                    var N = function() {
                        if (s.beginPath(), s.moveTo(M[0].x, M[0].y), 1 !== M.length) {
                            for (var e = 1; e < M.length; e += 1) {
                                var t = M[e - 1], a = M[e], r = (t.x + a.x) / 2, n = (t.y + a.y) / 2;
                                s.quadraticCurveTo(t.x, t.y, r, n);
                            }
                            var i = M[M.length - 1];
                            s.lineTo(i.x, i.y);
                        }
                    }, I = n.data.mascotThemeIsSoftGold ? {
                        areaStart: "rgba(158, 128, 77, 0.20)",
                        areaEnd: "rgba(158, 128, 77, 0.01)",
                        line: "#806238",
                        peak: "#806238",
                        peakFill: "#fffdf5"
                    } : n.data.mascotThemeIsMoonTide ? {
                        areaStart: "rgba(78, 119, 158, 0.2)",
                        areaEnd: "rgba(78, 119, 158, 0.01)",
                        line: "#497297",
                        peak: "#497297",
                        peakFill: "#ffffff"
                    } : n.data.mascotThemeIsIce ? {
                        areaStart: "rgba(49, 127, 155, 0.2)",
                        areaEnd: "rgba(49, 127, 155, 0.01)",
                        line: "#317f9b",
                        peak: "#317f9b",
                        peakFill: "#ffffff"
                    } : {
                        areaStart: "rgba(194, 52, 75, 0.2)",
                        areaEnd: "rgba(194, 52, 75, 0.01)",
                        line: "#c2344b",
                        peak: "#c2344b",
                        peakFill: "#ffffff"
                    }, P = s.createLinearGradient(0, v, 0, d);
                    P.addColorStop(0, I.areaStart), P.addColorStop(1, I.areaEnd), 
                    N();
                    var L = M[M.length - 1];
                    s.lineTo(L.x, d - f), s.lineTo(M[0].x, d - f), s.closePath(), 
                    s.fillStyle = P, s.fill(), N(), s.strokeStyle = I.line, s.lineWidth = 2.2, 
                    s.lineCap = "round", s.lineJoin = "round", s.stroke();
                    var E = p.indexOf(_), B = M[E];
                    s.beginPath(), s.arc(B.x, B.y, 4.2, 0, 2 * Math.PI), s.fillStyle = I.peakFill, 
                    s.fill(), s.lineWidth = 2.2, s.strokeStyle = I.peak, s.stroke();
                }
            }
        });
    },
    onChartTouch: function(t) {
        var a = Number(t.currentTarget.dataset.sessionIndex), r = this.chartLayouts && this.chartLayouts[a];
        if (r && r.coordinates.length) {
            var n = t.touches && t.touches.length ? t.touches : t.changedTouches, i = n && n[0];
            if (i) {
                var o = NaN;
                if (void 0 !== i.x && Number.isFinite(Number(i.x)) ? o = Number(i.x) : void 0 !== i.clientX ? o = Number(i.clientX) - r.left : void 0 !== i.pageX && (o = Number(i.pageX) - r.left), 
                Number.isFinite(o)) {
                    var c = 0, s = Number.POSITIVE_INFINITY;
                    r.coordinates.forEach(function(e, t) {
                        var a = Math.abs(e.x - o);
                        a < s && (s = a, c = t);
                    });
                    var u = this.data.sessions[a];
                    if (!u || !u.activePoint || u.activePoint.pointIndex !== c) {
                        var h = r.coordinates[c], l = r.points[c], d = Math.max(0, Math.min(100, h.x / r.width * 100)), v = Math.max(0, Math.min(100, h.y / r.height * 100));
                        this.setData(e({}, "sessions[".concat(a, "].activePoint"), {
                            pointIndex: c,
                            xPercent: Number(d.toFixed(2)),
                            yPercent: Number(v.toFixed(2)),
                            tooltipLeftPercent: Number(Math.max(20, Math.min(80, d)).toFixed(2)),
                            viewerText: g(l.viewerCount),
                            timeText: f(l.sampledAt)
                        })), "touchstart" === t.type && wx.vibrateShort && wx.vibrateShort({
                            type: "light",
                            fail: function() {}
                        });
                    }
                }
            }
        }
    }
});