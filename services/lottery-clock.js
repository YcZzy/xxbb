'use strict';

var t = require('../@babel/runtime/helpers/classCallCheck'),
  e = require('../@babel/runtime/helpers/createClass'),
  i = require('./api');

function r(t, e, i) {
  if (!t || String(t.room_id) !== String(e))
    return {
      visible: !1,
    };
  var r = 1e3 * Number(t.draw_at);
  if (!Number.isFinite(r) || r <= 0)
    return {
      visible: !1,
    };
  var n = Math.max(0, Math.ceil((r - i) / 1e3));
  return n > 86400 || i - r > 15e3
    ? {
        visible: !1,
      }
    : {
        visible: !0,
        urgent: n > 0 && n <= 60,
        pending: 0 === n,
        text:
          0 === n
            ? '开奖中'
            : ''
                .concat(String(Math.floor(n / 60)).padStart(2, '0'), ':')
                .concat(String(n % 60).padStart(2, '0')),
      };
}

var n = (function () {
    function i(e) {
      var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      (t(this, i),
        (this.fetcher = e),
        (this.now = r.now || Date.now),
        (this.setTimer = r.setTimer || setTimeout),
        (this.clearTimer = r.clearTimer || clearTimeout),
        (this.listeners = new Map()),
        (this.items = new Map()),
        (this.offset = 0),
        (this.nextFetchAt = 0),
        (this.receivedAt = 0),
        (this.generation = 0),
        (this.nextId = 1));
    }
    return (
      e(i, [
        {
          key: 'subscribe',
          value: function (t, e, i) {
            var r = this,
              n = this.nextId++;
            return (
              this.listeners.set(n, {
                account: String(t),
                roomId: String(e),
                callback: i,
                last: '',
              }),
              (!this.receivedAt || this.now() - this.receivedAt > 2e3) && (this.nextFetchAt = 0),
              this._tick(),
              function () {
                r.listeners.delete(n) &&
                  (r.listeners.size ||
                    (r.generation++,
                    r.items.clear(),
                    (r.receivedAt = 0),
                    (r.nextFetchAt = 0),
                    r.clearTimer(r.timer),
                    (r.timer = null)));
              }
            );
          },
        },
        {
          key: '_notify',
          value: function () {
            var t = this,
              e = this.now() + this.offset;
            this.listeners.forEach(function (i) {
              var n = t.items.get(i.account),
                s = r(n, i.roomId, e);
              s.pending &&
                i.expiredId !== n.lottery_id &&
                ((i.expiredId = n.lottery_id), (t.nextFetchAt = Math.min(t.nextFetchAt, t.now())));
              var a = JSON.stringify(s);
              i.last !== a && ((i.last = a), i.callback(s));
            });
          },
        },
        {
          key: '_nextFetch',
          value: function () {
            var t = this,
              e = this.now(),
              i = e + 5e3;
            return (
              this.listeners.forEach(function (r) {
                var n = r.account,
                  s = r.roomId,
                  a = t.items.get(n),
                  o = a && String(a.room_id) === s ? 1e3 * Number(a.draw_at) - t.offset : 0;
                o > e && (i = Math.min(i, o));
              }),
              i
            );
          },
        },
        {
          key: '_refresh',
          value: function () {
            var t = this;
            if (!this.inFlight && this.listeners.size) {
              this.inFlight = !0;
              var e = this.generation,
                i = this.now();
              ((this.nextFetchAt = i + 15e3),
                Promise.resolve()
                  .then(function () {
                    return t.fetcher();
                  })
                  .then(function (r) {
                    if (e === t.generation) {
                      var n = t.now(),
                        s = r && r.data;
                      if (
                        !s ||
                        !Array.isArray(s.items) ||
                        !Number.isFinite(Number(s.server_time_ms))
                      )
                        throw new Error('Invalid lottery response');
                      ((t.receivedAt = n), (t.offset = Number(s.server_time_ms) - (i + n) / 2));
                      var a =
                        !1 === s.enabled
                          ? []
                          : s.items.filter(function (t) {
                              return (
                                t &&
                                t.account &&
                                t.room_id &&
                                t.lottery_id &&
                                Number.isFinite(Number(t.draw_at)) &&
                                Number(t.draw_at) > 0
                              );
                            });
                      ((t.items = new Map(
                        a.map(function (t) {
                          return [String(t.account), t];
                        })
                      )),
                        (t.nextFetchAt = !1 === s.enabled ? n + 3e5 : t._nextFetch()),
                        t._notify());
                    }
                  })
                  .catch(function (i) {
                    e === t.generation &&
                      (t.nextFetchAt = t.now() + (i && 404 === i.statusCode ? 3e5 : 15e3));
                  })
                  .finally(function () {
                    ((t.inFlight = !1), t.listeners.size && t._tick());
                  }));
            }
          },
        },
        {
          key: '_tick',
          value: function () {
            var t = this;
            if ((this.clearTimer(this.timer), (this.timer = null), this.listeners.size)) {
              (this._notify(), this.now() >= this.nextFetchAt && this._refresh());
              var e = Array.from(this.listeners.values()).some(function (e) {
                var i = e.account,
                  n = e.roomId;
                return r(t.items.get(i), n, t.now() + t.offset).visible;
              })
                ? 1e3
                : Math.max(1e3, Math.min(15e3, this.nextFetchAt - this.now()));
              this.timer = this.setTimer(function () {
                return t._tick();
              }, e);
            }
          },
        },
      ]),
      i
    );
  })(),
  s = new n(function () {
    return i.fetchLotteries();
  });

module.exports = {
  clock: s,
  LotteryClock: n,
  countdownView: r,
};
