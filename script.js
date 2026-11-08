/* ===== EDIT THESE ===== */
const WEDDING_DATE = "2027-01-18T15:30:00+05:30";   // ceremony start (India time)
const MUSIC_FILE   = "assets/song.mp3";             // put your song here (see README)
const MAPS = {                                      // Google Maps links
  church: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("CSI St. George's Cathedral, Gopalapuram, Chennai 600086"),
  hall:   "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("CSI Lite Auditorium, Kilpauk, Chennai 600010")
};
/* ===== END EDIT ===== */

const $ = s => document.querySelector(s);
$("#mapChurch").href = MAPS.church;
$("#mapHall").href = MAPS.hall;

/* Music (starts only after the guest taps) */
const song = $("#song"), mbtn = $("#music");
song.src = MUSIC_FILE;
const setMusic = on => mbtn.classList.toggle("play", on);
song.addEventListener("canplay", () => { mbtn.hidden = false; }, { once: true });
song.addEventListener("error", () => { mbtn.hidden = true; });
mbtn.onclick = () => song.paused ? song.play().then(() => setMusic(true)).catch(() => {}) : (song.pause(), setMusic(false));

/* Opening animation */
$("#open").onclick = () => {
  const c = $("#cover");
  c.classList.add("opening");
  song.load();
  song.play().then(() => { mbtn.hidden = false; setMusic(true); }).catch(() => {});
  setTimeout(() => {
    c.classList.add("done");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    document.querySelectorAll("#hero .rv").forEach((e, i) => setTimeout(() => e.classList.add("in"), 250 * i));
  }, 2500);
  setTimeout(() => c.remove(), 4200);
};

/* Scroll reveals + nav highlight */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll(".rv").forEach(e => { if (!e.closest("#hero")) io.observe(e); });
const links = [...document.querySelectorAll("#nav a")];
const so = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
}), { threshold: .4 });
["hero", "wedding", "countdown", "venue", "travel"].forEach(id => so.observe(document.getElementById(id)));

/* Countdown */
const pad = n => String(n).padStart(2, "0");
function tick() {
  let t = Math.max(0, new Date(WEDDING_DATE) - Date.now()) / 1000;
  $("#d").textContent = pad(Math.floor(t / 86400));
  $("#h").textContent = pad(Math.floor(t % 86400 / 3600));
  $("#m").textContent = pad(Math.floor(t % 3600 / 60));
  $("#s").textContent = pad(Math.floor(t % 60));
  if (t === 0) $("#cdnote").textContent = "Today we say “I do”";
}
tick(); setInterval(tick, 1000);
