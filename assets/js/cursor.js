// Cursor
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; });
(function anim() { rx += (mx - rx) * .11; ry += (my - ry) * .11; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(anim); })();
document.querySelectorAll('a,button,.prod-card,.cat-card,.why-card,.payment-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.style.width = '18px'; cur.style.height = '18px'; ring.style.width = '50px'; ring.style.height = '50px'; ring.style.borderColor = 'rgba(0,217,255,.4)'; });
    el.addEventListener('mouseleave', () => { cur.style.width = '10px'; cur.style.height = '10px'; ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = 'rgba(0,217,255,.3)'; });
});