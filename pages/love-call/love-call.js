require("../../@babel/runtime/helpers/Arrayincludes");

var e = require("../../@babel/runtime/helpers/regeneratorRuntime"), t = require("../../@babel/runtime/helpers/asyncToGenerator"), r = require("../../@babel/runtime/helpers/defineProperty"), a = require("../../@babel/runtime/helpers/toConsumableArray"), i = require("../../@babel/runtime/helpers/objectSpread2"), s = require("../../services/api"), n = require("../../config/env"), c = require("../../utils/share"), o = require("../../utils/mascot-theme"), l = require("../../utils/performance-mode"), h = require("../../utils/view-cache"), u = require("../../utils/session-scope"), d = require("../../utils/recharge-confirmation"), f = require("../../utils/payment-preparation"), b = require("../../utils/recharge-amount"), g = require("./burst"), m = require("./badge-progress"), p = function(e, t) {
    return JSON.stringify(e) === JSON.stringify(t);
}, v = require("../../utils/coin-pricing"), y = [ {
    code: "free",
    name: "今日心意",
    coins: 0,
    calls: 1,
    price: "每日免费",
    art: "heart"
}, {
    code: "spark",
    name: "星光应援",
    coins: 100,
    calls: 66,
    price: "100 i币",
    art: "star"
}, {
    code: "nova",
    name: "星河盛放",
    coins: 1e3,
    calls: 666,
    price: "1000 i币",
    art: "nova"
} ], C = [ 100, 1e3 ].map(function(e) {
    return {
        coins: e,
        price_cents: e,
        test_only: !1,
        priceText: (e / 100).toFixed(2)
    };
}), k = function(e) {
    return String(Math.max(0, Math.round(Number(e) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}, T = Date.parse("2026-09-10T00:00:00+08:00") / 1e3, w = {
    historyItems: [],
    historyCursor: "",
    historyLoaded: !1,
    historyLoading: !1,
    historyError: "",
    historyHasMore: !1
}, x = function(e) {
    var t = y.find(function(t) {
        return t.code === e.pack_code;
    }), r = new Date(1e3 * Number(e.created_at) + 288e5), a = Number.isFinite(r.getTime()) ? r.toISOString().slice(0, 16).replace("T", " ") : "--";
    return i(i({}, e), {}, {
        nickname: e.nickname || "一位星友",
        art: t ? t.art : "star",
        giftName: t ? t.name : "打call",
        timeText: a,
        quantityText: "+".concat(k(e.call_quantity)),
        costText: "".concat(k(e.coin_amount), " i币")
    });
}, R = b.parse, _ = function() {
    return new Promise(function(e, t) {
        return wx.login({
            success: function(r) {
                return r.code ? e(r.code) : t(new Error("微信登录失败"));
            },
            fail: t
        });
    });
}, A = function() {
    return "call_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 12));
}, D = function(e, t) {
    for (var r = String(e || "").split(".").map(Number), a = t.split(".").map(Number), i = 0; i < a.length; i++) {
        if (!Number.isFinite(r[i])) return !1;
        if (r[i] !== a[i]) return r[i] > a[i];
    }
    return !0;
};

Page(i(i(i({}, require("../../utils/inline-artwork")), g.methods(s, u, A)), {}, {
    data: i(i(i(i({
        inlineArt: {}
    }, g.initial), {}, {
        navigationHeight: 64,
        statusBarHeight: 20
    }, o.state()), {}, {
        performanceClass: l.className(),
        active: !1,
        heroVisible: !0,
        giftsVisible: !0,
        loading: !0,
        loadError: "",
        coinEnabled: !1,
        stateReady: !1,
        anchorsReady: !1,
        fromDigestTip: !1,
        currentTab: "send",
        tabInteracted: !1,
        honorExpanded: !1
    }, w), {}, {
        balance: null,
        balanceText: "--",
        balanceLoading: !1,
        myCalls: null,
        myCallsText: "--",
        freeAvailable: !1,
        anchors: [],
        visibleAnchors: [],
        selected: null,
        anchorWindowHeight: 700,
        anchorCardHeight: 96,
        anchorStackInset: 28,
        anchorStackStep: 12,
        query: "",
        onlyMine: !1,
        packs: y,
        pack: y[0],
        submitting: !1,
        showConfirm: !1,
        showRecharge: !1,
        badgePreview: null,
        preferencesVisible: !1,
        callIdentity: "",
        callIdentityLoading: !1,
        rechargeRecoveryVisible: !1,
        rechargeRecoveryId: "",
        rechargeRecoveryOrderId: "",
        callSending: !1,
        sendingName: "",
        sendingArt: "star",
        rechargeCoins: 100,
        rechargePriceText: "1.00",
        rechargeOptions: C,
        customRecharge: null,
        customRangeText: "",
        rechargeMode: "preset",
        rechargeCustomValue: "",
        rechargeInputError: "",
        rechargeCoinsText: "100",
        celebration: !1,
        celebrationQuantity: 0,
        celebrationName: "",
        celebrationAvatar: "",
        celebrationPack: "free",
        sparks: Array.from({
            length: 10
        }, function(e, t) {
            return t;
        }),
        statusMessage: "",
        rewardMessage: "",
        memberReward: ""
    }),
    onLoad: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        if (this.recordsOnly = "1" === e.records || "records" === e.panel, this.recordsOnly) wx.redirectTo({
            url: "/pages/wallet-records/wallet-records",
            fail: function() {
                return wx.showToast({
                    title: "明细打开失败，请返回重试",
                    icon: "none"
                });
            }
        }); else {
            c.enableShareMenu();
            var t = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync(), r = wx.getMenuButtonBoundingClientRect(), a = t.statusBarHeight || 20;
            this.setData({
                anchorWindowHeight: Math.max(176, Number(t.windowHeight) || 700),
                anchorStackInset: a + 8
            }), this.initialAccount = e.account || "", this.initialRecharge = "digest-tip" === e.from && "1" === e.recharge || "recharge" === e.panel, 
            this.requiredTipCoins = /^\d{1,5}$/.test(String(e.required_coins || "")) ? Math.max(1, Math.min(2e4, Number(e.required_coins))) : 9, 
            this.setData({
                fromDigestTip: "digest-tip" === e.from
            }), this.setData({
                statusBarHeight: a,
                navigationHeight: 2 * (r.top - a) + r.height + a
            }), this.completedOrders = new Set(), this.readVersion = 0, this.pageScope = u.current(), 
            this.restoreAnchors();
        }
    },
    onShow: function() {
        if (!this.recordsOnly) {
            this.visible = !0, this.memberFetchedAt = 0;
            var e = u.current();
            e !== this.pageScope && (this.resetBurst(), this.invalidateReads(), 
            this.pageScope = e, this.anchorsFetchedAt = 0, this.memberProfile = null, 
            this.memberFetchedAt = 0, this.pendingMemberOrder = null, this.preparedCallLogin = this.callAttempt = null, 
            this.refreshWalletAfterCall = !1, this.subscribedAccounts = null, this.userSelected = !1, 
            this.setData(i(i({
                anchors: [],
                visibleAnchors: [],
                selected: null,
                anchorsReady: !1
            }, w), {}, {
                loading: !0,
                balance: null,
                balanceText: "--",
                coinEnabled: !1,
                freeAvailable: !1,
                myCalls: null,
                myCallsText: "--",
                showConfirm: !1,
                showRecharge: !1,
                rechargeRecoveryVisible: !1,
                callSending: !1,
                submitting: !1,
                badgePreview: null,
                preferencesVisible: !1,
                callIdentity: "",
                callIdentityLoading: !1
            })), this.restoreAnchors()), this.setData({
                active: !0,
                balanceLoading: !1
            }), o.sync(this), this.data.submitting || (this.refreshWalletAfterCall || this.pendingMemberOrder ? (this.flushCallRefresh(), 
            this.refreshSubscriptions()) : (this.loadCenter({
                reuseAnchors: !0
            }), this.refreshMember())), this.finishDigestRecharge(), "history" === this.data.currentTab && this.loadCallHistory(!0);
        }
    },
    onReady: function() {
        this.pageReady = !0, this.observeDecorations();
    },
    onResize: function(e) {
        var t = Number(e.size && e.size.windowHeight);
        if (!(this.disposed || !Number.isFinite(t) || t <= 0)) {
            var r = Math.max(176, t);
            r !== this.data.anchorWindowHeight && (this.setData({
                anchorWindowHeight: r
            }), this.filterAnchors());
        }
    },
    onHide: function() {
        this.visible = !1, this.stopBurst(), this.burstOffer = null, this.preparedCallLogin = null, 
        this.invalidateReads(), this.setData({
            active: !1,
            celebration: !1,
            badgePreview: null,
            showConfirm: !1,
            burstConfirm: !1,
            callIdentity: "",
            callIdentityLoading: !1
        });
    },
    onUnload: function() {
        this.inlineArtStopped = !0, this.visible = !1, this.stopBurst(), this.disposed = !0, 
        this.preparedCallLogin = null, this.invalidateReads(), this.heroObserver && this.heroObserver.disconnect(), 
        this.giftObserver && this.giftObserver.disconnect();
    },
    back: function() {
        var e = this;
        wx.navigateBack({
            fail: function() {
                return wx.switchTab({
                    url: e.data.fromDigestTip ? "/pages/daily-digest/daily-digest" : "/pages/media/media"
                });
            }
        });
    },
    noop: function() {},
    invalidateReads: function() {
        this.readVersion = (this.readVersion || 0) + 1, this.anchorTask = this.subscriptionTask = this.stateTask = this.balanceTask = this.memberTask = null, 
        this.historyTask = null, this.disposed || this.setChanged({
            historyLoading: !1
        }), clearTimeout(this.refreshTimer), this.refreshTimer = null, clearTimeout(this.cacheTimer);
    },
    readTicket: function() {
        return {
            version: this.readVersion,
            scope: u.current()
        };
    },
    readCurrent: function(e) {
        return !(this.disposed || !this.visible || e.version !== this.readVersion) && (!e.scope || e.scope === u.current() || (this.resetBurst(), 
        this.invalidateReads(), this.pageScope = u.current(), this.anchorsFetchedAt = 0, 
        this.subscribedAccounts = this.memberProfile = this.pendingMemberOrder = null, 
        this.preparedCallLogin = this.callAttempt = null, this.refreshWalletAfterCall = !1, 
        this.setChanged(i(i({
            stateReady: !1,
            anchorsReady: !1,
            loading: !1,
            coinEnabled: !1
        }, w), {}, {
            anchors: [],
            visibleAnchors: [],
            selected: null,
            balance: null,
            balanceText: "--",
            balanceLoading: !1,
            freeAvailable: !1,
            myCalls: null,
            myCallsText: "--",
            showConfirm: !1,
            showRecharge: !1,
            rechargeRecoveryVisible: !1,
            callSending: !1,
            submitting: !1,
            badgePreview: null,
            preferencesVisible: !1,
            callIdentity: "",
            callIdentityLoading: !1,
            loadError: "登录状态已变化，请点击重试"
        })), !1));
    },
    setChanged: function(e, t) {
        for (var r = {}, a = 0, i = Object.keys(e); a < i.length; a++) {
            var s = i[a];
            p(this.data[s], e[s]) || (r[s] = e[s]);
        }
        Object.keys(r).length ? this.setData(r, t) : t && t();
    },
    restoreAnchors: function() {
        if (!this.data.fromDigestTip) {
            var e = h.read("love-call:anchors:v3", 3e5);
            e && Array.isArray(e.data) && this.applyAnchors(e.data.slice().sort(function(e, t) {
                return Number(t.featured) - Number(e.featured) || (t.calls || 0) - (e.calls || 0);
            }));
        }
    },
    persistAnchors: function() {
        var e = this;
        clearTimeout(this.cacheTimer);
        var t = this.readTicket();
        this.cacheTimer = setTimeout(function() {
            e.readCurrent(t) && h.write("love-call:anchors:v3", e.data.anchors);
        }, 400);
    },
    applyAnchors: function(e) {
        var t, r = this, s = this.data.anchors, n = new Map(e.map(function(e) {
            return [ e.account, e ];
        })), c = s.filter(function(e) {
            return n.has(e.account);
        }).map(function(e) {
            return n.get(e.account);
        }), o = new Set(c.map(function(e) {
            return e.account;
        }));
        c.push.apply(c, a(e.filter(function(e) {
            return !o.has(e.account);
        })));
        var l = this.data.selected && this.data.selected.account || this.initialAccount, h = c.find(function(e) {
            return e.account === l;
        }) || c.find(function(e) {
            return e.subscribed;
        }) || c[0] || null, u = {};
        this.data.loading && (u.loading = !1), this.patchRows("anchors", s, c, u), 
        p(this.data.selected, h) || (u.selected = h ? i({}, h) : null), this.data.badgePreview && (u.badgePreview = (null == h ? void 0 : h.account) === (null === (t = this.data.selected) || void 0 === t ? void 0 : t.account) ? m.preview(h.badgeProgress, this.data.badgePreview.code) : null), 
        Object.keys(u).length && this.setData(u, function() {
            return r.observeDecorations();
        }), this.filterAnchors();
    },
    patchRows: function(e, t, r, a) {
        t.length !== r.length || t.some(function(e, t) {
            return e.account !== r[t].account;
        }) ? a[e] = r.map(function(e) {
            return i({}, e);
        }) : r.forEach(function(r, i) {
            for (var s = 0, n = Object.keys(r); s < n.length; s++) {
                var c = n[s];
                p(t[i][c], r[c]) || (a["".concat(e, "[").concat(i, "].").concat(c)] = r[c]);
            }
        });
    },
    observeDecorations: function() {
        var e = this;
        if (this.pageReady && !this.disposed && !this.data.fromDigestTip && wx.createIntersectionObserver) {
            !this.data.selected && this.heroObserver && (this.heroObserver.disconnect(), 
            this.heroObserver = null);
            var t = function(t, a, i) {
                e[t] || (e[t] = wx.createIntersectionObserver(e, {
                    thresholds: [ 0, .01 ]
                }), e[t].relativeToViewport().observe(a, function(t) {
                    var a = t.intersectionRatio > 0;
                    e.disposed || a === e.data[i] || e.setData(r({}, i, a));
                }));
            };
            this.data.selected && t("heroObserver", ".call-hero", "heroVisible"), 
            t("giftObserver", ".gift-section", "giftsVisible");
        }
    },
    loadCenter: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = e.reuseAnchors && this.data.anchorsReady && Date.now() - (this.anchorsFetchedAt || 0) < 3e4;
        return Promise.all([ this.data.fromDigestTip || t ? Promise.resolve() : this.refreshAnchors(), this.data.fromDigestTip ? Promise.resolve() : this.refreshSubscriptions(), this.refreshCenterState() ]);
    },
    refreshAnchors: function() {
        var e = this;
        if (!this.visible || this.disposed) return Promise.resolve();
        if (this.anchorTask) return this.anchorTask;
        var t = this.readTicket(), r = s.fetchCallAnchors().then(function(r) {
            if (e.readCurrent(t)) {
                var a = new Map(e.data.anchors.map(function(e) {
                    return [ e.account, e ];
                })), i = (r.data.items || []).map(function(t) {
                    var i;
                    return {
                        account: t.account,
                        name: t.nickname || t.account,
                        initial: Array.from(t.nickname || t.account)[0],
                        avatar: t.avatar_url && t.avatar_url.startsWith("/") ? n.API_BASE_URL + t.avatar_url : t.avatar_url || "",
                        calls: "number" == typeof t.call_count ? t.call_count : null,
                        callsText: "number" == typeof t.call_count ? k(t.call_count) : "--",
                        badgeProgress: m.build(t, r.data.badge_definitions),
                        live: "live" === t.status,
                        statusKnown: Boolean(t.status),
                        featured: Boolean(t.featured),
                        subscribed: e.subscribedAccounts ? e.subscribedAccounts.has(t.account) : Boolean(null === (i = a.get(t.account)) || void 0 === i ? void 0 : i.subscribed)
                    };
                }).sort(function(e, t) {
                    return Number(t.featured) - Number(e.featured) || (t.calls || 0) - (e.calls || 0);
                });
                e.applyAnchors(i), e.anchorsFetchedAt = Date.now(), e.pageScope = u.current(), 
                e.setChanged({
                    anchorsReady: !0
                }), e.persistAnchors();
            }
        }).catch(function(r) {
            e.readCurrent(t) && e.setChanged({
                loading: !1,
                loadError: r.message || "主播暂时无法加载，请重试"
            });
        }).finally(function() {
            e.anchorTask === r && (e.anchorTask = null);
        });
        return this.anchorTask = r, r;
    },
    refreshSubscriptions: function() {
        var e = this;
        if (!this.visible || this.disposed) return Promise.resolve();
        if (this.subscriptionTask) return this.subscriptionTask;
        var t = this.readTicket(), r = s.fetchSubscriptions().then(function(r) {
            if (e.readCurrent(t) && (e.subscribedAccounts = new Set((r.data.items || []).filter(function(e) {
                return e.enabled;
            }).map(function(e) {
                return e.anchor_account;
            })), e.data.anchors.length || e.data.anchorsReady)) {
                if (e.applyAnchors(e.data.anchors.map(function(t) {
                    return i(i({}, t), {}, {
                        subscribed: e.subscribedAccounts.has(t.account)
                    });
                })), !e.userSelected && !e.initialAccount && !e.data.burstEnabled) {
                    var a = e.data.anchors.find(function(e) {
                        return e.subscribed;
                    });
                    a && e.setChanged({
                        selected: i({}, a)
                    });
                }
                e.data.anchorsReady && e.persistAnchors();
            }
        }).catch(function() {}).finally(function() {
            e.subscriptionTask === r && (e.subscriptionTask = null);
        });
        return this.subscriptionTask = r, r;
    },
    refreshCenterState: function() {
        var r = this, a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        if (!this.visible || this.disposed) return Promise.resolve();
        if (this.stateTask) return this.stateTask;
        var n = this.readTicket(), c = a.background && this.data.stateReady;
        this.setChanged(i(i({}, c ? {} : {
            stateReady: !1
        }), {}, {
            loadError: ""
        }));
        var o = Promise.resolve().then(t(e().mark(function a() {
            var o, l, h, d, f;
            return e().wrap(function(a) {
                for (;;) switch (a.prev = a.next) {
                  case 0:
                    return a.prev = 0, a.next = 3, s.fetchLoveCallCenter().catch(function() {
                        var r = t(e().mark(function t(r) {
                            var a;
                            return e().wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                  case 0:
                                    if ([ "NOT_FOUND", "API_NOT_FOUND" ].includes(r.code)) {
                                        e.next = 2;
                                        break;
                                    }
                                    throw r;

                                  case 2:
                                    return e.next = 4, s.fetchMascotSkinState();

                                  case 4:
                                    return a = e.sent, e.abrupt("return", {
                                        data: {
                                            coin_enabled: !1,
                                            free_available: !a.data.daily_call_used,
                                            my_calls: null,
                                            records: [],
                                            legacy: !0
                                        }
                                    });

                                  case 6:
                                  case "end":
                                    return e.stop();
                                }
                            }, t);
                        }));
                        return function(e) {
                            return r.apply(this, arguments);
                        };
                    }());

                  case 3:
                    if (o = a.sent, r.readCurrent(n)) {
                        a.next = 6;
                        break;
                    }
                    return a.abrupt("return");

                  case 6:
                    l = o.data, h = v.pricedPacks(y, l.packs), r.pendingRecharge = (l.records || []).find(function(e) {
                        return "recharge" === e.kind && "pending" === e.status;
                    }) || null, d = (Array.isArray(l.recharge_options) ? l.recharge_options : C).filter(function(e) {
                        return [ 100, 1e3 ].includes(e.coins) && e.price_cents === e.coins;
                    }).map(function(e) {
                        return i(i({}, e), {}, {
                            test_only: !1,
                            priceText: (e.price_cents / 100).toFixed(2)
                        });
                    }), f = b.limits(l), r.pageScope = u.current(), r.setChanged(i(i(i({
                        packs: h
                    }, r.data.showConfirm || r.data.submitting || r.data.burstEnabled ? {} : {
                        pack: h.find(function(e) {
                            return e.code === r.data.pack.code;
                        }) || h[0]
                    }), {}, {
                        stateReady: !0,
                        coinEnabled: !0 === l.coin_enabled,
                        rechargeOptions: d,
                        customRecharge: f,
                        customRangeText: b.rangeText(f),
                        freeAvailable: !0 === l.free_available,
                        myCalls: null == l.my_calls ? null : l.my_calls,
                        myCallsText: null == l.my_calls ? "--" : k(l.my_calls)
                    }, r.data.fromDigestTip ? {
                        loading: !1
                    } : {}), l.legacy ? {
                        statusMessage: "新版 i币接口待上线，每日免费支持照常使用"
                    } : {})), l.coin_enabled && null === r.data.balance && r.refreshBalance(), 
                    r.initialRecharge && l.coin_enabled && (r.initialRecharge = !1, 
                    r.openRecharge(r.requiredTipCoins)), a.next = 20;
                    break;

                  case 17:
                    a.prev = 17, a.t0 = a.catch(0), r.readCurrent(n) && r.setChanged(i(i({}, c ? {} : {
                        stateReady: !1
                    }), {}, {
                        loadError: a.t0.message || "暂时无法加载，请重试"
                    }));

                  case 20:
                  case "end":
                    return a.stop();
                }
            }, a, null, [ [ 0, 17 ] ]);
        }))).finally(function() {
            r.stateTask === o && (r.stateTask = null);
        });
        return this.stateTask = o, o;
    },
    onSearch: function(e) {
        this.setData({
            query: e.detail.value
        }), this.filterAnchors();
    },
    switchScope: function(e) {
        this.setData({
            onlyMine: "mine" === e.currentTarget.dataset.scope
        }), this.filterAnchors();
    },
    filterAnchors: function() {
        var e = this, t = this.data.query.trim().toLowerCase(), r = this.data.anchors.filter(function(r) {
            return (!e.data.onlyMine || r.subscribed) && (!t || "".concat(r.name, " ").concat(r.account).toLowerCase().includes(t));
        }), a = Math.max(0, r.length - 1), i = this.data.anchorCardHeight, s = Math.max(0, Math.min(192, this.data.anchorWindowHeight - i - this.data.anchorStackInset - 24)), n = a ? Math.min(12, s / a) : 12, c = {};
        this.patchRows("visibleAnchors", this.data.visibleAnchors, r, c), this.data.anchorStackStep !== n && (c.anchorStackStep = n), 
        Object.keys(c).length && this.setData(c);
    },
    selectAnchor: function(e) {
        var t, r = this;
        if (!this.data.submitting) if (null !== (t = this.burstSession) && void 0 !== t && t.current) this.notify("请先核对上一笔连送结果"); else {
            this.resetBurst();
            var a = this.data.anchors.find(function(t) {
                return t.account === e.currentTarget.dataset.account;
            });
            a && (this.userSelected = !0, this.setData({
                selected: i({}, a)
            }, function() {
                r.visible && wx.pageScrollTo({
                    selector: "#call-target",
                    duration: r.data.performanceClass ? 0 : 220
                });
            }), this.haptic("light"));
        }
    },
    scrollToAnchors: function() {
        this.data.submitting || this.data.fromDigestTip || (this.haptic("light"), 
        wx.pageScrollTo({
            selector: "#call-anchors",
            duration: this.data.performanceClass ? 0 : 260
        }));
    },
    choosePack: function(e) {
        var t;
        if (!this.data.submitting) if (null !== (t = this.burstSession) && void 0 !== t && t.current) this.notify("请先核对上一笔连送结果"); else {
            this.resetBurst();
            var r = this.data.packs.find(function(t) {
                return t.code === e.currentTarget.dataset.code;
            });
            r && (this.setData({
                pack: r,
                statusMessage: ""
            }), this.haptic("light"));
        }
    },
    haptic: function(e) {
        wx.vibrateShort && wx.vibrateShort({
            type: e,
            fail: function() {}
        });
    },
    notify: function(e) {
        this.disposed || this.setData({
            statusMessage: e
        });
    },
    refreshBalance: function() {
        var e, t, r = this;
        if (this.data.callSending || null !== (e = this.burstSession) && void 0 !== e && e.running || null !== (t = this.burstSession) && void 0 !== t && t.current) return Promise.resolve();
        if (this.balanceTask) return this.balanceTask;
        if (!this.data.coinEnabled || !this.visible || this.disposed) return Promise.resolve();
        var a = this.readTicket();
        this.setData({
            balanceLoading: !0
        });
        var i = s.fetchMyCoinWallet().then(function(e) {
            e && r.readCurrent(a) && (r.setChanged({
                balance: e.data.balance,
                balanceText: k(e.data.balance)
            }), r.burstSession && r.burstCurrent(r.burstSession) && Number.isInteger(e.data.balance) && (r.burstSession.wallet = e.data.balance, 
            r.syncBurst(r.burstSession)));
        }).catch(function(e) {
            r.readCurrent(a) && (r.setChanged({
                balance: null,
                balanceText: "--"
            }), r.notify(e.message || "余额暂不可用"));
        }).finally(function() {
            r.balanceTask === i && (r.balanceTask = null), r.readCurrent(a) && r.setChanged({
                balanceLoading: !1
            });
        });
        return this.balanceTask = i, i;
    },
    submit: function() {
        var e;
        if (this.data.burstEnabled) return this.enqueueBurst();
        if (null !== (e = this.burstSession) && void 0 !== e && e.current) this.notify("请先核对上一笔连送结果"); else if (!this.data.submitting && this.data.selected && this.data.stateReady && this.data.anchorsReady) return "free" === this.data.pack.code ? this.sendFree() : void (this.data.coinEnabled ? null !== this.data.balance ? this.data.balance < this.data.pack.coins ? this.openRecharge(this.data.pack.coins) : (this.setData({
            showConfirm: !0,
            burstConfirm: !1
        }), this.refreshMember(void 0, !0), this.prepareCallLogin()) : this.refreshBalance() : this.notify("i币支付暂未开放，每日免费打 Call 不受影响"));
    },
    closeConfirm: function() {
        this.data.submitting || (this.preparedCallLogin = null, this.burstOffer = null, 
        this.setData({
            showConfirm: !1,
            burstConfirm: !1
        }));
    },
    prepareCallLogin: function() {
        var e = u.current(), t = this.preparedCallLogin;
        if (t && t.scope === e && Date.now() - t.createdAt < 6e4) return t;
        var r = {
            scope: e,
            createdAt: Date.now()
        };
        return r.promise = _().then(function(e) {
            return {
                code: e
            };
        }, function() {
            return null;
        }), this.preparedCallLogin = r, r;
    },
    takeCallLogin: function() {
        var r = this;
        return t(e().mark(function t() {
            var a, i;
            return e().wrap(function(e) {
                for (;;) switch (e.prev = e.next) {
                  case 0:
                    return a = r.prepareCallLogin(), r.preparedCallLogin = null, 
                    e.next = 4, a.promise;

                  case 4:
                    if (i = e.sent, a.scope === u.current()) {
                        e.next = 7;
                        break;
                    }
                    throw new Error("登录状态已变化，请重新确认");

                  case 7:
                    return e.abrupt("return", i && Date.now() - a.createdAt < 6e4 ? i.code : _());

                  case 8:
                  case "end":
                    return e.stop();
                }
            }, t);
        }))();
    },
    sendFree: function() {
        var r = this;
        return t(e().mark(function t() {
            var a, n, c, o, l, h;
            return e().wrap(function(e) {
                for (;;) switch (e.prev = e.next) {
                  case 0:
                    if (r.data.stateReady && r.data.anchorsReady && r.data.freeAvailable && !r.data.submitting) {
                        e.next = 2;
                        break;
                    }
                    return e.abrupt("return");

                  case 2:
                    return a = i({}, r.data.selected), r.setData({
                        submitting: !0,
                        statusMessage: ""
                    }), e.prev = 4, e.next = 7, s.submitLoveCall({
                        douyin_account: a.account
                    });

                  case 7:
                    if (n = e.sent, !r.disposed) {
                        e.next = 10;
                        break;
                    }
                    return e.abrupt("return");

                  case 10:
                    c = n.data || {}, o = c.mascot_skin_campaign || {}, l = c.mascot_theme_campaign || {}, 
                    h = o.newly_unlocked ? "连续守候达成，专属形象已解锁" : l.newly_unlocked ? "累计支持达成，专属主题已解锁" : o.streak_days ? "已连续支持 ".concat(o.streak_days, " 天") : "", 
                    r.setData({
                        rewardMessage: h
                    }), r.setData({
                        freeAvailable: !1
                    }), r.celebrate(1, a, "free"), r.queueCallRefresh(), e.next = 24;
                    break;

                  case 20:
                    e.prev = 20, e.t0 = e.catch(4), r.disposed || "LOVE_CALL_DAILY_LIMIT" !== e.t0.code || r.setData({
                        freeAvailable: !1
                    }), r.notify(e.t0.message || "未能确认，请刷新后查看");

                  case 24:
                    return e.prev = 24, r.disposed || r.setData({
                        submitting: !1
                    }), e.finish(24);

                  case 27:
                  case "end":
                    return e.stop();
                }
            }, t, null, [ [ 4, 20, 24, 27 ] ]);
        }))();
    },
    confirmCall: function() {
        var r = this;
        return t(e().mark(function t() {
            var a, n, c, o, l, h, d, f, b, g;
            return e().wrap(function(e) {
                for (;;) switch (e.prev = e.next) {
                  case 0:
                    if (!r.data.burstConfirm) {
                        e.next = 2;
                        break;
                    }
                    return e.abrupt("return", r.startBurst());

                  case 2:
                    if (null === (a = r.burstSession) || void 0 === a || !a.current) {
                        e.next = 5;
                        break;
                    }
                    return r.notify("请先核对上一笔连送结果"), e.abrupt("return");

                  case 5:
                    if (!r.data.submitting && !r.data.preferencesVisible && r.data.stateReady && r.data.anchorsReady && r.data.selected) {
                        e.next = 7;
                        break;
                    }
                    return e.abrupt("return");

                  case 7:
                    return n = i({}, r.data.selected), c = r.data.pack, o = {
                        scope: u.current(),
                        target: n,
                        myCalls: r.data.myCalls
                    }, r.callAttempt = o, l = function() {
                        return r.callAttempt === o && o.scope === u.current();
                    }, h = !0, r.invalidateReads(), r.setData({
                        submitting: !0,
                        showConfirm: !1,
                        callSending: !0,
                        balanceLoading: !1,
                        sendingName: n.name,
                        sendingArt: c.art,
                        statusMessage: ""
                    }), r.haptic("light"), e.prev = 16, e.next = 19, r.takeCallLogin();

                  case 19:
                    if (d = e.sent, l()) {
                        e.next = 22;
                        break;
                    }
                    return e.abrupt("return");

                  case 22:
                    return e.next = 24, s.createLoveCallOrder({
                        kind: "call",
                        request_id: A(),
                        anchor_account: n.account,
                        pack_code: c.code
                    });

                  case 24:
                    if (f = e.sent, l()) {
                        e.next = 27;
                        break;
                    }
                    return e.abrupt("return");

                  case 27:
                    if ("call" === (b = f.data).kind && b.anchor_account === n.account && b.pack_code === c.code && b.call_quantity === c.calls && b.coin_amount === c.coins) {
                        e.next = 33;
                        break;
                    }
                    if (!b.can_cancel) {
                        e.next = 32;
                        break;
                    }
                    return e.next = 32, s.cancelLoveCallOrder(b.order_id);

                  case 32:
                    throw new Error("价格或订单内容已变化，请刷新后重新确认，尚未发起扣款");

                  case 33:
                    return e.next = 35, s.confirmLoveCallOrder(f.data.order_id, d);

                  case 35:
                    if (g = e.sent, l() && !r.disposed) {
                        e.next = 38;
                        break;
                    }
                    return e.abrupt("return");

                  case 38:
                    if (g.data.order_id === f.data.order_id && "call" === g.data.kind && g.data.coin_amount === b.coin_amount) {
                        e.next = 40;
                        break;
                    }
                    throw new Error("结果待确认，请在明细中查看");

                  case 40:
                    r.consumeResult(g.data, n, o), h = "delivered" !== g.data.status || !Number.isInteger(g.data.platform_balance) || g.data.platform_balance < 0, 
                    e.next = 47;
                    break;

                  case 44:
                    e.prev = 44, e.t0 = e.catch(16), l() && r.notify(e.t0.message || "结果待确认，请在明细中查看，不要重复付款");

                  case 47:
                    return e.prev = 47, r.callAttempt !== o || r.disposed || (r.callAttempt = null, 
                    r.setData({
                        submitting: !1,
                        showConfirm: !1,
                        callSending: !1
                    }), o.scope === u.current() ? r.queueCallRefresh(h) : (r.invalidateReads(), 
                    r.setData({
                        stateReady: !1,
                        anchorsReady: !1,
                        balance: null,
                        balanceText: "--",
                        myCalls: null,
                        myCallsText: "--",
                        loadError: "登录状态已变化，请重新加载并在明细确认结果"
                    }))), e.finish(47);

                  case 50:
                  case "end":
                    return e.stop();
                }
            }, t, null, [ [ 16, 44, 47, 50 ] ]);
        }))();
    },
    consumeResult: function(e, t, r) {
        this.disposed || ("delivered" === e.status ? "call" !== e.kind || this.completedOrders.has(e.order_id) ? "recharge" === e.kind ? (this.notify("充值已确认，i币余额已更新"), 
        this.data.fromDigestTip && (this.returnAfterRecharge = !0)) : "digest_tip" === e.kind && this.notify("早报打赏已确认，谢大人恩赏") : (this.completedOrders.add(e.order_id), 
        this.applyConfirmedCall(e, r), null != r && r.burst || this.celebrate(e.call_quantity, t, e.pack_code), 
        this.pendingMemberOrder = e) : "pending" === e.status ? this.notify("订单确认中，可在明细继续确认，不会重复扣费") : "refunded" === e.status ? this.notify("订单已退款，到账情况请查看微信支付账单") : "recharge" === e.kind && "failed" === e.status ? this.notify("充值订单已关闭，本次未充值") : this.notify("INSUFFICIENT_COINS" === e.error_code ? "digest_tip" === e.kind ? "i币余额不足，本次未完成打赏" : "i币余额不足，本次未增加 Call" : "本次未完成，请查看明细"));
    },
    applyConfirmedCall: function(e, t) {
        this.invalidateReads();
        var r = {
            balanceLoading: !1
        };
        Number.isInteger(e.platform_balance) && e.platform_balance >= 0 && (r.balance = e.platform_balance, 
        r.balanceText = k(e.platform_balance));
        var a = e.call_quantity;
        if (t && Number.isInteger(a) && a > 0) {
            Number.isInteger(t.myCalls) && (r.myCalls = Math.max(this.data.myCalls || 0, t.myCalls + a), 
            r.myCallsText = k(r.myCalls));
            var s = t.target;
            if (Number.isInteger(s.calls)) {
                var n, c = function(e) {
                    if (e.account !== s.account) return e;
                    var t = Math.max(e.calls || 0, s.calls + a);
                    return i(i({}, e), {}, {
                        calls: t,
                        callsText: k(t),
                        badgeProgress: m.withCount(e.badgeProgress, t)
                    });
                };
                this.patchRows("anchors", this.data.anchors, this.data.anchors.map(c), r), 
                this.patchRows("visibleAnchors", this.data.visibleAnchors, this.data.visibleAnchors.map(c), r), 
                (null === (n = this.data.selected) || void 0 === n ? void 0 : n.account) === s.account && (r.selected = c(this.data.selected));
            }
        }
        this.setChanged(r);
    },
    applyCallIdentity: function(e) {
        var t = e && "boolean" == typeof e.public_calls && "string" == typeof e.nickname && e.nickname.trim();
        this.setData({
            callIdentity: t ? e.public_calls ? "本次以「".concat(e.nickname, "」播报") : "本次匿名播报「一位星友」" : "",
            callIdentityLoading: !1
        });
    },
    openCallPreferences: function() {
        this.data.submitting || this.data.fromDigestTip || (this.haptic("light"), 
        this.resumeCallConfirm = this.data.showConfirm, this.setData({
            showConfirm: !1,
            preferencesVisible: !0
        }));
    },
    openBadgePreview: function(e) {
        var t, r;
        if (!this.data.submitting && !this.data.fromDigestTip && "send" === this.data.currentTab) {
            var a = m.preview(null === (t = this.data.selected) || void 0 === t ? void 0 : t.badgeProgress, e.currentTarget.dataset.code);
            a && (null === (r = this.data.badgePreview) || void 0 === r ? void 0 : r.code) !== a.code && (this.stopBurst(), 
            this.setData({
                badgePreview: a
            }), this.haptic("light"));
        }
    },
    toggleHonorProgress: function() {
        var e;
        !this.data.submitting && "send" === this.data.currentTab && null !== (e = this.data.selected) && void 0 !== e && e.badgeProgress.available && (this.setData({
            honorExpanded: !this.data.honorExpanded
        }), this.haptic("light"));
    },
    closeBadgePreview: function() {
        this.setData({
            badgePreview: null
        });
    },
    closeCallPreferences: function() {
        this.data.preferencesVisible && (this.setData({
            preferencesVisible: !1,
            showConfirm: Boolean(this.resumeCallConfirm)
        }), this.resumeCallConfirm = !1, this.data.callIdentity || this.refreshMember(void 0, !0));
    },
    callPreferencesProfile: function(e) {
        this.memberTask = null, this.memberProfile = e.detail.profile, this.memberFetchedAt = Date.now(), 
        this.applyCallIdentity(e.detail.profile), "history" === this.data.currentTab && (this.historyTask = null, 
        this.historyRevision = (this.historyRevision || 0) + 1, this.setData(i({}, w)), 
        this.loadCallHistory(!0));
    },
    callPreferencesUnconfirmed: function() {
        this.memberTask = null, this.memberProfile = null, this.memberFetchedAt = 0, 
        this.setData({
            callIdentity: "",
            callIdentityLoading: !1
        });
    },
    retryCallIdentity: function() {
        return this.refreshMember(void 0, !0);
    },
    refreshMember: function(e) {
        var t = this, r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        if (!this.visible || this.disposed) return Promise.resolve();
        if ("function" != typeof s.fetchMyCallProfile) return this.setData({
            callIdentity: "",
            callIdentityLoading: !1
        }), Promise.resolve();
        if (this.memberTask) return e ? this.memberTask.then(function() {
            return t.visible && !t.disposed ? t.refreshMember(e) : void 0;
        }) : this.memberTask;
        if (!r && !e && this.memberProfile && Date.now() - this.memberFetchedAt < 3e4) return Promise.resolve();
        var a = this.readTicket();
        this.setData({
            callIdentity: "",
            callIdentityLoading: !0
        });
        var i = s.fetchMyCallProfile().then(function(r) {
            if (t.memberTask === i && t.readCurrent(a)) {
                var s = r.data, n = t.memberProfile;
                if (t.memberProfile = s, t.memberFetchedAt = Date.now(), t.applyCallIdentity(s), 
                e && t.visible && t.data.celebration && Number.isInteger(e.coin_amount)) {
                    var c = n && n.public_id === s.public_id && s.level > n.level;
                    t.setData({
                        memberReward: "+".concat(e.coin_amount, " 经验 · ").concat(c ? "升级至 " : "", "Lv.").concat(s.level, " ").concat(s.title)
                    });
                }
            }
        }).catch(function() {
            t.memberTask === i && t.readCurrent(a) && t.setData({
                callIdentity: "",
                callIdentityLoading: !1
            });
        }).finally(function() {
            t.memberTask === i && (t.memberTask = null);
        });
        return this.memberTask = i, i;
    },
    queueCallRefresh: function() {
        var e = this, t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        this.invalidateReads(), this.refreshWalletAfterCall = this.refreshWalletAfterCall || t, 
        this.anchorsFetchedAt = 0, clearTimeout(this.refreshTimer), this.visible && !this.disposed && (this.refreshTimer = setTimeout(function() {
            return e.flushCallRefresh();
        }, 0));
    },
    flushCallRefresh: function() {
        var e, t;
        if (clearTimeout(this.refreshTimer), this.refreshTimer = null, !this.visible || this.disposed) return Promise.resolve();
        if (null !== (e = this.burstSession) && void 0 !== e && e.running || null !== (t = this.burstSession) && void 0 !== t && t.current) return Promise.resolve();
        var r = this.refreshWalletAfterCall, a = this.pendingMemberOrder;
        return this.refreshWalletAfterCall = !1, this.pendingMemberOrder = null, 
        Promise.all([ this.refreshAnchors(), this.refreshCenterState({
            background: !0
        }), this.subscribedAccounts || this.data.fromDigestTip ? Promise.resolve() : this.refreshSubscriptions(), r ? this.refreshBalance() : Promise.resolve(), a ? this.refreshMember(a) : Promise.resolve() ]);
    },
    showHistory: function() {
        this.data.submitting || wx.navigateTo({
            url: "/pages/wallet-records/wallet-records"
        });
    },
    switchCallTab: function(e) {
        var t = e.currentTarget.dataset.tab;
        ![ "send", "history" ].includes(t) || this.data.submitting || this.data.fromDigestTip || t === this.data.currentTab || (this.stopBurst(), 
        this.setData({
            currentTab: t,
            tabInteracted: !0
        }), this.haptic("light"), "history" === t && this.loadCallHistory(!0));
    },
    loadCallHistory: function() {
        var e = this, t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        if (!this.visible || this.disposed || this.data.fromDigestTip) return Promise.resolve();
        if (this.historyTask) return this.historyTask;
        if (!t && this.data.historyLoaded && !this.data.historyHasMore) return Promise.resolve();
        var r = this.readTicket(), i = t ? "" : this.data.historyCursor, n = this.historyRevision || 0;
        this.setChanged({
            historyLoading: !0,
            historyError: ""
        });
        var c = Promise.resolve().then(function() {
            return s.fetchLoveCallHistory(i);
        }).then(function(i) {
            if (n === (e.historyRevision || 0) && e.readCurrent(r)) {
                var s = i.data, c = s.items.some(function(e) {
                    return Number.isFinite(Number(e.created_at)) && Number(e.created_at) > 0 && Number(e.created_at) < T;
                }), o = s.items.filter(function(e) {
                    return "coin" === e.source && "delivered" === e.status && e.coin_amount > 0 && !e.refund_amount && Number.isFinite(Number(e.created_at)) && Number(e.created_at) >= T;
                }).map(x), l = t ? [] : e.data.historyItems.slice(), h = new Set(l.map(function(e) {
                    return e.record_id;
                }));
                l.push.apply(l, a(o.filter(function(e) {
                    return !h.has(e.record_id);
                }))), e.setData({
                    historyItems: l,
                    historyLoaded: !0,
                    historyCursor: c ? "" : s.next_cursor || "",
                    historyHasMore: Boolean(!c && s.has_more && s.next_cursor)
                });
            }
        }).catch(function(t) {
            n === (e.historyRevision || 0) && e.readCurrent(r) && e.setData({
                historyError: [ "NOT_FOUND", "API_NOT_FOUND" ].includes(t.code) ? "打call明细暂未开放，请稍后重试" : t.message || "明细加载失败，请重试"
            });
        }).finally(function() {
            e.historyTask === c && (e.historyTask = null, e.setChanged({
                historyLoading: !1
            }));
        });
        return this.historyTask = c, c;
    },
    refreshCallHistory: function() {
        return this.loadCallHistory(!0);
    },
    moreCallHistory: function() {
        return this.loadCallHistory(!1);
    },
    onReachBottom: function() {
        "history" === this.data.currentTab && this.data.historyHasMore && !this.data.historyError && this.moreCallHistory();
    },
    openRecharge: function(e) {
        var t = this;
        if (!this.data.submitting && this.data.stateReady) if (this.stopBurst(), 
        this.data.coinEnabled) if (this.pendingRecharge && this.pageScope === u.current()) this.setData({
            showRecharge: !1,
            rechargeRecoveryVisible: !0,
            rechargeRecoveryId: "call:" + this.pendingRecharge.order_id,
            rechargeRecoveryOrderId: this.pendingRecharge.order_id
        }); else {
            var r = this.data.fromDigestTip && this.data.rechargeOptions.find(function(r) {
                return r.coins >= (Number(e) || t.requiredTipCoins);
            }) || this.data.rechargeOptions.find(function(t) {
                return t.coins === e;
            }) || this.data.rechargeOptions[0];
            r ? (this.rechargeLogin = this.rechargeLogin || f.createLoginPreparation(), 
            this.rechargeLogin.prepare(), this.setData({
                showRecharge: !0,
                rechargeCoins: r.coins,
                rechargePriceText: r.priceText,
                rechargeCoinsText: k(r.coins),
                rechargeMode: "preset",
                rechargeCustomValue: "",
                rechargeInputError: "",
                statusMessage: ""
            }), this.data.fromDigestTip && this.data.customRecharge && Number(e) > r.coins && this.updateCustomRecharge((Number(e) / 100).toFixed(2))) : this.notify("暂无可用充值档位，请刷新后重试");
        } else this.notify("i币充值暂未开放");
    },
    chooseRecharge: function(e) {
        if (!this.data.submitting) {
            var t = this.data.rechargeOptions.find(function(t) {
                return t.coins === Number(e.detail && void 0 !== e.detail.coins ? e.detail.coins : e.currentTarget.dataset.coins);
            });
            t && (this.setData({
                rechargeCoins: t.coins,
                rechargePriceText: t.priceText,
                rechargeCoinsText: k(t.coins),
                rechargeMode: "preset",
                rechargeInputError: "",
                statusMessage: ""
            }), this.haptic("light"));
        }
    },
    chooseCustomRecharge: function() {
        !this.data.submitting && this.data.customRecharge && (this.setData({
            rechargeMode: "custom",
            statusMessage: ""
        }), this.updateCustomRecharge(this.data.rechargeCustomValue), this.haptic("light"));
    },
    onRechargeInput: function(e) {
        !this.data.submitting && this.data.customRecharge && this.updateCustomRecharge(String(e.detail.value || ""));
    },
    updateCustomRecharge: function(e) {
        var t = R(e, this.data.customRecharge);
        this.setData({
            rechargeMode: "custom",
            rechargeCustomValue: e,
            rechargeCoins: t,
            rechargePriceText: null === t ? "--" : (t / 100).toFixed(2),
            rechargeCoinsText: null === t ? "--" : k(t),
            rechargeInputError: e && null === t ? "请输入".concat(this.data.customRangeText, "，最多两位小数") : "",
            statusMessage: ""
        });
    },
    closeRecharge: function() {
        this.data.submitting || (this.rechargeLogin && this.rechargeLogin.clear(), 
        this.setData({
            showRecharge: !1
        }));
    },
    closeRechargeRecovery: function() {
        this.setData({
            rechargeRecoveryVisible: !1
        }), this.refreshCenterState(), this.refreshBalance();
    },
    recharge: function() {
        var r = this;
        return t(e().mark(function t() {
            var a, n, c, o, l, h, g, m, p, v, y, C, k, T, w, x, _, S, P;
            return e().wrap(function(e) {
                for (;;) switch (e.prev = e.next) {
                  case 0:
                    if (!r.data.submitting && r.data.stateReady) {
                        e.next = 2;
                        break;
                    }
                    return e.abrupt("return");

                  case 2:
                    if (r.data.coinEnabled) {
                        e.next = 5;
                        break;
                    }
                    return r.notify("i币充值暂未开放"), e.abrupt("return");

                  case 5:
                    if (a = "custom" === r.data.rechargeMode ? R(r.data.rechargeCustomValue, r.data.customRecharge) : null, 
                    n = "custom" === r.data.rechargeMode ? null === a ? null : {
                        coins: a,
                        price_cents: a
                    } : r.data.rechargeOptions.find(function(e) {
                        return e.coins === r.data.rechargeCoins;
                    })) {
                        e.next = 10;
                        break;
                    }
                    return r.notify("充值档位已变化，请重新选择"), e.abrupt("return");

                  case 10:
                    if (b.validCoins(n.coins) && !(n.coins < 100) && n.price_cents === n.coins) {
                        e.next = 13;
                        break;
                    }
                    return r.notify("充值金额无效，请重新选择，最低 1 元、最多两位小数"), e.abrupt("return");

                  case 13:
                    if ("function" == typeof wx.requestVirtualPayment) {
                        e.next = 16;
                        break;
                    }
                    return r.notify("请升级微信后再充值"), e.abrupt("return");

                  case 16:
                    if ("ios" !== (c = wx.getSystemInfoSync()).platform || D(c.version, "8.0.68") && D(String(c.system || "").replace(/^iOS\s*/i, ""), "15")) {
                        e.next = 20;
                        break;
                    }
                    return r.notify("iOS 支付需要 iOS 15、微信 8.0.68 或以上版本"), e.abrupt("return");

                  case 20:
                    return r.setData({
                        submitting: !0,
                        statusMessage: ""
                    }), o = null, l = !1, h = !1, g = u.current(), m = {}, r.rechargeAttempt = m, 
                    p = function() {
                        return !r.disposed && r.rechargeAttempt === m && u.current() === g;
                    }, v = f.timing("recharge"), y = r.rechargeLogin || f.createLoginPreparation(), 
                    r.rechargeLogin = null, C = y.take().then(function(e) {
                        return {
                            code: e
                        };
                    }, function(e) {
                        return {
                            error: e
                        };
                    }), e.prev = 32, e.next = 35, v.measure("create_order", function() {
                        return s.createLoveCallOrder({
                            kind: "recharge",
                            coins: n.coins,
                            request_id: A()
                        });
                    });

                  case 35:
                    if (k = e.sent, "recharge" === (o = k.data).kind && o.coin_amount === n.coins) {
                        e.next = 40;
                        break;
                    }
                    return r.notify("充值订单金额与所选档位不一致，已停止支付"), e.abrupt("return");

                  case 40:
                    return e.next = 42, C;

                  case 42:
                    if (!(T = e.sent).error) {
                        e.next = 45;
                        break;
                    }
                    throw T.error;

                  case 45:
                    if (p() && r.visible) {
                        e.next = 47;
                        break;
                    }
                    return e.abrupt("return");

                  case 47:
                    return e.next = 49, v.measure("pay_data", function() {
                        return s.loveCallPayData(o.order_id, T.code);
                    });

                  case 49:
                    if (w = e.sent, x = JSON.parse(w.data.signData), "short_series_coin" === w.data.mode && x.buyQuantity === n.coins && x.outTradeNo === o.order_id) {
                        e.next = 54;
                        break;
                    }
                    return r.notify("微信支付参数与所选档位不一致，已停止支付"), e.abrupt("return");

                  case 54:
                    if (p() && r.visible) {
                        e.next = 56;
                        break;
                    }
                    return e.abrupt("return");

                  case 56:
                    return l = !0, v.mark("cashier_invoked"), e.next = 60, v.measure("cashier_roundtrip", function() {
                        return new Promise(function(e, t) {
                            return wx.requestVirtualPayment(i(i({}, w.data), {}, {
                                success: e,
                                fail: t
                            }));
                        });
                    });

                  case 60:
                    if (h = !0, p()) {
                        e.next = 63;
                        break;
                    }
                    return e.abrupt("return");

                  case 63:
                    return r.notify("正在确认充值到账"), e.next = 66, d.confirm(o, {
                        isCurrent: p,
                        canRetry: function() {
                            return p() && r.visible;
                        }
                    });

                  case 66:
                    (_ = e.sent) && p() && r.consumeResult(_), e.next = 88;
                    break;

                  case 70:
                    if (e.prev = 70, e.t0 = e.catch(32), p()) {
                        e.next = 74;
                        break;
                    }
                    return e.abrupt("return");

                  case 74:
                    if (!l || !o || h) {
                        e.next = 87;
                        break;
                    }
                    return e.prev = 75, e.next = 78, d.confirm(o, {
                        isCurrent: p,
                        retry: !1
                    });

                  case 78:
                    (S = e.sent) && p() && r.consumeResult(S), e.next = 85;
                    break;

                  case 82:
                    e.prev = 82, e.t1 = e.catch(75), r.notify("充值结果待确认，后台会自动核对，请勿重复付款");

                  case 85:
                    e.next = 88;
                    break;

                  case 87:
                    r.notify(e.t0.message || "请在明细查看订单，请勿重复付款");

                  case 88:
                    if (e.prev = 88, r.disposed || r.rechargeAttempt !== m) {
                        e.next = 101;
                        break;
                    }
                    if (P = p(), r.rechargeAttempt = null, r.invalidateReads(), 
                    r.setData({
                        submitting: !1,
                        showRecharge: !1
                    }), P) {
                        e.next = 96;
                        break;
                    }
                    return e.abrupt("return");

                  case 96:
                    return r.refreshWalletAfterCall = !r.visible, e.next = 99, r.refreshCenterState();

                  case 99:
                    r.refreshBalance(), r.finishDigestRecharge();

                  case 101:
                    return e.finish(88);

                  case 102:
                  case "end":
                    return e.stop();
                }
            }, t, null, [ [ 32, 70, 88, 102 ], [ 75, 82 ] ]);
        }))();
    },
    finishDigestRecharge: function() {
        this.returnAfterRecharge && this.data.fromDigestTip && this.visible && (this.returnAfterRecharge = !1, 
        this.back());
    },
    celebrate: function(e, t, r) {
        this.visible && (this.setData({
            celebration: !0,
            celebrationQuantity: e,
            celebrationName: t.name,
            celebrationAvatar: t.avatar,
            celebrationPack: r,
            rewardMessage: "free" === r ? this.data.rewardMessage : "",
            memberReward: ""
        }), this.haptic("nova" === r ? "medium" : "light"));
    },
    closeCelebration: function() {
        this.setData({
            celebration: !1
        }), this.refreshTimer && this.flushCallRefresh();
    },
    onShareAppMessage: function() {
        return c.appMessage({
            title: "一起为爱播点亮星光",
            path: "/pages/love-call/love-call"
        });
    }
}));