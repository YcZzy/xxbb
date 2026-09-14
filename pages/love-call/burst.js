var e = require("../../@babel/runtime/helpers/regeneratorRuntime"), t = require("../../@babel/runtime/helpers/asyncToGenerator"), r = require("../../@babel/runtime/helpers/objectSpread2");

require("../../@babel/runtime/helpers/Arrayincludes");

var s = {
    burstEnabled: !1,
    burstConfirm: !1,
    burstPending: 0,
    burstSent: 0,
    burstReserved: 0,
    burstAvailable: 0,
    burstLimit: 0,
    burstBudget: 0,
    burstPaused: !1,
    burstChecking: !1,
    burstPulse: 0,
    burstVisible: !1
}, a = function(e, t, r) {
    return e && "string" == typeof e.order_id && e.order_id && (!r || e.order_id === r) && "call" === e.kind && e.anchor_account === t.target.account && e.pack_code === t.pack.code && e.coin_amount === t.pack.coins && e.call_quantity === t.pack.calls;
}, n = function(e) {
    return e && [ "delivered", "failed", "refunded" ].includes(e.status);
};

module.exports = {
    initial: s,
    methods: function(u, i, c) {
        return {
            burstCurrent: function(e) {
                return !this.disposed && this.burstSession === e && e.scope === i.current();
            },
            resetBurst: function() {
                this.burstSession && (this.burstSession.enabled = !1, this.burstSession.queue = []), 
                this.burstSession = this.burstOffer = null, this.disposed || this.setChanged(r({}, s));
            },
            toggleBurst: function(e) {
                var t;
                if (e.detail.value) {
                    if (this.setData({
                        burstEnabled: !1
                    }), !(this.data.submitting || null !== (t = this.burstSession) && void 0 !== t && t.current) && this.data.selected && this.data.stateReady && this.data.anchorsReady && this.data.coinEnabled && "free" !== this.data.pack.code) {
                        var s = this.data, a = s.pack, n = s.balance, u = s.selected;
                        if (!Number.isInteger(n) || n < a.coins) this.notify("余额不足或尚未确认，请先刷新余额或充值"); else {
                            var c = Math.min(10, Math.floor(n / a.coins));
                            this.burstOffer = {
                                pack: r({}, a),
                                target: r({}, u),
                                scope: i.current(),
                                limit: c
                            }, this.setData({
                                burstConfirm: !0,
                                showConfirm: !0,
                                burstLimit: c,
                                burstBudget: c * a.coins
                            }), this.refreshMember(void 0, !0), this.prepareCallLogin();
                        }
                    }
                } else this.stopBurst();
            },
            startBurst: function() {
                var e, t = this.burstOffer;
                if (!t || this.data.submitting || this.data.preferencesVisible || !this.visible || !this.data.stateReady || !this.data.anchorsReady || !this.data.coinEnabled || t.scope !== i.current() || t.target.account !== (null === (e = this.data.selected) || void 0 === e ? void 0 : e.account) || t.pack.code !== this.data.pack.code || t.pack.coins !== this.data.pack.coins || !Number.isInteger(this.data.balance) || this.data.balance < t.pack.coins) return this.notify("状态已变化，请重新确认连送"), 
                this.setData({
                    showConfirm: !1,
                    burstConfirm: !1
                }), void (this.burstOffer = null);
                this.burstSession = r(r({}, t), {}, {
                    enabled: !0,
                    queue: [],
                    current: null,
                    running: !1,
                    paused: !1,
                    sent: 0,
                    spent: 0,
                    wallet: this.data.balance
                }), this.burstOffer = null, this.setData(r(r({}, s), {}, {
                    burstEnabled: !0,
                    burstVisible: !0,
                    burstLimit: t.limit,
                    burstBudget: t.limit * t.pack.coins,
                    showConfirm: !1,
                    statusMessage: ""
                })), this.enqueueBurst();
            },
            syncBurst: function(e) {
                if (this.burstCurrent(e)) {
                    var t = e.queue.length + (e.current ? 1 : 0), r = t * e.pack.coins;
                    this.setChanged({
                        burstEnabled: e.enabled,
                        burstPending: t,
                        burstSent: e.sent,
                        burstReserved: r,
                        burstAvailable: Math.max(0, e.wallet - r),
                        burstPaused: e.paused,
                        burstVisible: !0
                    });
                }
            },
            enqueueBurst: function() {
                var e, t = this.burstSession;
                if (t && this.burstCurrent(t) && this.visible && t.enabled && !t.paused) {
                    if (t.target.account !== (null === (e = this.data.selected) || void 0 === e ? void 0 : e.account) || t.pack.code !== this.data.pack.code || t.pack.coins !== this.data.pack.coins) return this.stopBurst(), 
                    void this.notify("主播或礼物已变化，请重新开启连送");
                    var r = t.queue.length + (t.current ? 1 : 0);
                    r >= 10 || t.sent + r >= t.limit ? this.notify("已达本轮连送上限，请等待确认") : t.wallet - r * t.pack.coins < t.pack.coins ? this.notify("可用余额不足，未添加新的连送") : (t.queue.push({
                        request: {
                            kind: "call",
                            request_id: c(),
                            anchor_account: t.target.account,
                            pack_code: t.pack.code
                        },
                        phase: "queued"
                    }), this.setData({
                        burstPulse: this.data.burstPulse + 1,
                        statusMessage: ""
                    }), this.haptic("light"), this.syncBurst(t), t.running || (this.burstTask = this.drainBurst(t)));
                }
            },
            stopBurst: function() {
                var e = this.burstSession;
                e && (e.enabled = !1, e.queue = [], this.syncBurst(e));
            },
            pauseBurst: function(e, t) {
                e.enabled = !1, e.queue = [], e.paused = Boolean(e.current), this.burstCurrent(e) && this.notify(t);
            },
            acceptBurstResult: function(e, t, s) {
                if (!a(s, e, t.orderId)) throw new Error("订单结果不一致，请在明细核对");
                return !!n(s) && ("delivered" === s.status ? this.completedOrders.has(s.order_id) || (this.consumeResult(s, e.target, r(r({}, t.baseline), {}, {
                    burst: !0
                })), e.sent++, e.spent += e.pack.coins, e.wallet = Number.isInteger(s.platform_balance) && s.platform_balance >= 0 ? s.platform_balance : Math.max(0, e.wallet - e.pack.coins)) : this.pauseBurst(e, "INSUFFICIENT_COINS" === s.error_code ? "余额不足，连送已停止，未发送的已取消" : "本笔未完成，连送已停止，请查看明细"), 
                e.current = null, e.paused = !1, !0);
            },
            drainBurst: function(s) {
                var c = this;
                return t(e().mark(function t() {
                    var l, d, o, b, h, p, f, k;
                    return e().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            if (!s.running) {
                                e.next = 2;
                                break;
                            }
                            return e.abrupt("return");

                          case 2:
                            s.running = !0, c.invalidateReads(), c.setData({
                                submitting: !0,
                                balanceLoading: !1
                            }), e.prev = 5;

                          case 6:
                            if (!(c.burstCurrent(s) && c.visible && s.enabled && s.queue.length)) {
                                e.next = 81;
                                break;
                            }
                            return l = s.queue.shift(), s.current = l, l.baseline = {
                                target: r({}, c.data.anchors.find(function(e) {
                                    return e.account === s.target.account;
                                }) || s.target),
                                myCalls: c.data.myCalls
                            }, c.syncBurst(s), e.prev = 11, e.next = 14, c.takeCallLogin();

                          case 14:
                            if (d = e.sent, c.burstCurrent(s)) {
                                e.next = 17;
                                break;
                            }
                            return e.abrupt("return");

                          case 17:
                            if (c.visible && s.enabled) {
                                e.next = 20;
                                break;
                            }
                            return s.current = null, e.abrupt("break", 81);

                          case 20:
                            return l.phase = "creating", e.next = 23, u.createLoveCallOrder(l.request);

                          case 23:
                            if (o = e.sent, b = o.data, c.burstCurrent(s)) {
                                e.next = 35;
                                break;
                            }
                            if (!(c.disposed && c.burstSession === s && s.scope === i.current() && null != b && b.order_id && b.can_cancel)) {
                                e.next = 34;
                                break;
                            }
                            return e.prev = 27, e.next = 30, u.cancelLoveCallOrder(b.order_id);

                          case 30:
                            e.next = 34;
                            break;

                          case 32:
                            e.prev = 32, e.t0 = e.catch(27);

                          case 34:
                            return e.abrupt("return");

                          case 35:
                            if (l.orderId = b && b.order_id, a(b, s)) {
                                e.next = 45;
                                break;
                            }
                            if (null == b || !b.can_cancel || !b.order_id) {
                                e.next = 44;
                                break;
                            }
                            return e.next = 40, u.cancelLoveCallOrder(b.order_id);

                          case 40:
                            if (p = e.sent, c.burstCurrent(s)) {
                                e.next = 43;
                                break;
                            }
                            return e.abrupt("return");

                          case 43:
                            (null === (h = p.data) || void 0 === h ? void 0 : h.order_id) === b.order_id && "failed" === p.data.status && (s.current = null);

                          case 44:
                            throw new Error("价格或礼物已变化，连送已停止，尚未发起本笔扣款");

                          case 45:
                            if (!n(b)) {
                                e.next = 49;
                                break;
                            }
                            c.acceptBurstResult(s, l, b), e.next = 69;
                            break;

                          case 49:
                            if (c.visible && s.enabled) {
                                e.next = 60;
                                break;
                            }
                            if (!b.can_cancel) {
                                e.next = 57;
                                break;
                            }
                            return e.next = 53, u.cancelLoveCallOrder(b.order_id);

                          case 53:
                            if (f = e.sent, c.burstCurrent(s)) {
                                e.next = 56;
                                break;
                            }
                            return e.abrupt("return");

                          case 56:
                            c.acceptBurstResult(s, l, f.data);

                          case 57:
                            return e.abrupt("break", 81);

                          case 60:
                            return l.phase = "confirming", e.next = 63, u.confirmLoveCallOrder(b.order_id, d);

                          case 63:
                            if (k = e.sent, c.burstCurrent(s)) {
                                e.next = 66;
                                break;
                            }
                            return e.abrupt("return");

                          case 66:
                            if (c.acceptBurstResult(s, l, k.data)) {
                                e.next = 69;
                                break;
                            }
                            return c.pauseBurst(s, "本笔结果待确认，已暂停连送，未发送的已取消"), e.abrupt("break", 81);

                          case 69:
                            e.next = 78;
                            break;

                          case 71:
                            if (e.prev = 71, e.t1 = e.catch(11), c.burstCurrent(s)) {
                                e.next = 75;
                                break;
                            }
                            return e.abrupt("return");

                          case 75:
                            return "queued" === l.phase && (s.current = null), c.pauseBurst(s, e.t1.message || "结果待确认，已暂停连送，请核对本笔订单"), 
                            e.abrupt("break", 81);

                          case 78:
                            s.sent >= s.limit && (s.enabled = !1), e.next = 6;
                            break;

                          case 81:
                            return e.prev = 81, s.running = !1, s.current && (s.paused = !0, 
                            s.enabled = !1), s.enabled || (s.queue = []), c.burstCurrent(s) ? (c.setData({
                                submitting: !1
                            }), c.syncBurst(s), s.current || c.queueCallRefresh(!0)) : c.disposed || c.burstSession !== s || (c.resetBurst(), 
                            c.invalidateReads(), c.setData({
                                submitting: !1,
                                stateReady: !1,
                                anchorsReady: !1,
                                balance: null,
                                balanceText: "--",
                                myCalls: null,
                                myCallsText: "--",
                                loadError: "登录状态已变化，请重新加载并在明细确认结果"
                            })), e.finish(81);

                          case 87:
                          case "end":
                            return e.stop();
                        }
                    }, t, null, [ [ 5, , 81, 87 ], [ 11, 71 ], [ 27, 32 ] ]);
                }))();
            },
            checkBurstResult: function() {
                var r = this;
                return t(e().mark(function t() {
                    var s, n, i, c, l;
                    return e().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            if (s = r.burstSession, (n = null == s ? void 0 : s.current) && !s.running && !r.data.burstChecking && r.burstCurrent(s) && r.visible) {
                                e.next = 4;
                                break;
                            }
                            return e.abrupt("return");

                          case 4:
                            if (r.setData({
                                burstChecking: !0
                            }), e.prev = 5, !n.orderId) {
                                e.next = 12;
                                break;
                            }
                            return e.next = 9, u.fetchLoveCallOrder(n.orderId);

                          case 9:
                            e.t0 = e.sent, e.next = 15;
                            break;

                          case 12:
                            return e.next = 14, u.createLoveCallOrder(n.request);

                          case 14:
                            e.t0 = e.sent;

                          case 15:
                            if (i = e.t0, r.burstCurrent(s)) {
                                e.next = 18;
                                break;
                            }
                            return e.abrupt("return");

                          case 18:
                            if (c = i.data, a(c, s, n.orderId)) {
                                e.next = 21;
                                break;
                            }
                            throw new Error("订单内容已变化，请到明细处理");

                          case 21:
                            if (n.orderId = c.order_id, r.acceptBurstResult(s, n, c)) {
                                e.next = 33;
                                break;
                            }
                            if (!c.can_cancel) {
                                e.next = 30;
                                break;
                            }
                            return e.next = 26, u.cancelLoveCallOrder(c.order_id);

                          case 26:
                            if (l = e.sent, r.burstCurrent(s)) {
                                e.next = 29;
                                break;
                            }
                            return e.abrupt("return");

                          case 29:
                            r.acceptBurstResult(s, n, l.data);

                          case 30:
                            s.current && r.notify("本笔仍待确认，请在明细继续核对，不会自动追加扣款"), e.next = 34;
                            break;

                          case 33:
                            "delivered" === c.status && r.notify("本笔已送达，未发送的连送已取消");

                          case 34:
                            e.next = 39;
                            break;

                          case 36:
                            e.prev = 36, e.t1 = e.catch(5), r.burstCurrent(s) && r.notify(e.t1.message || "暂时无法核对，请稍后重试或查看明细");

                          case 39:
                            return e.prev = 39, r.burstCurrent(s) && (r.setData({
                                burstChecking: !1
                            }), r.syncBurst(s), s.current || r.queueCallRefresh(!0)), 
                            e.finish(39);

                          case 42:
                          case "end":
                            return e.stop();
                        }
                    }, t, null, [ [ 5, 36, 39, 42 ] ]);
                }))();
            }
        };
    },
    MAX_PENDING: 10
};