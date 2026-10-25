/* learningmate-lab 공용 방문 카운터
 * 각 사이트 <head> 에 한 줄:  <script src="https://learningmate-lab.github.io/track.js" data-site="사이트-id" defer></script>
 * 활동 기록(선택):            window.LMTrack && LMTrack.event('mock')
 * 개인 정보는 보내지 않아요. 날짜별·사이트별 숫자만 올려요 (Abacus 카운터, 서버 없음).
 */
(function () {
  'use strict';
  var NS = 'learningmate-lab', API = 'https://abacus.jasoncameron.dev/hit/' + NS + '/';
  var me = document.currentScript;
  var site = ((me && me.getAttribute('data-site')) || location.pathname.split('/')[1] || 'portal').toLowerCase().replace(/[^a-z0-9-]/g, '');
  var noop = { event: function () { }, site: site };
  // 내 컴퓨터에서 연 파일·로컬 서버·아티팩트 미리보기 등은 세지 않음
  if (location.protocol === 'file:' || /^(localhost|127\.|192\.168\.)/.test(location.hostname) || !/github\.io$/.test(location.hostname)) { window.LMTrack = noop; return; }
  try { if (localStorage.getItem('lm.optout') === '1') { window.LMTrack = noop; return; } } catch (e) { }
  var d = new Date();
  var day = '' + d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // 한 교실이 같은 IP 를 쓰면 카운터 서버의 속도 제한(10초에 30번)에 걸릴 수 있어 줄을 세워 천천히 보내고, 실패하면 잠시 뒤 다시 보냄
  var q = [], busy = false;
  function hit(key) { q.push({ key: key, tries: 0 }); pump(); }
  function pump() {
    if (busy || !q.length) return; busy = true;
    var it = q.shift();
    fetch(API + it.key, { mode: 'cors', cache: 'no-store', keepalive: true }).then(function (r) { if (!r.ok) throw r.status; })
      .catch(function () { it.tries++; if (it.tries < 6) setTimeout(function () { q.push(it); pump(); }, 2000 + Math.random() * 8000 * it.tries); })
      .then(function () { busy = false; setTimeout(pump, 400 + Math.random() * 400); });
  }
  // 첫 방문 몰림을 조금 흩뜨림
  setTimeout(function () {
    hit(site + '.pv.' + day); hit(site + '.pv.total');
    if (!ls('lm.uv.' + site + '.' + day)) { ls('lm.uv.' + site + '.' + day, '1'); hit(site + '.uv.' + day); }
    if (!ls('lm.first.' + site)) { ls('lm.first.' + site, day); hit(site + '.uv.total'); }
  }, Math.random() * 1500);
  window.LMTrack = {
    site: site,
    event: function (name) {
      name = String(name || '').toLowerCase().replace(/[^a-z0-9_-]/g, ''); if (!name) return;
      hit(site + '.ev.' + name + '.' + day); hit(site + '.ev.' + name + '.total');
    },
  };
})();
