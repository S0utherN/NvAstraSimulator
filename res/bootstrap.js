/* Offline adapter: serves embedded data files to fetch(); nothing else is changed. */
(() => {
  const INDEX = {"data/simulator-versions.json":"res/data-core.js","data/atlas2-versions.json":"res/data-core.js","data/environment.json":"res/data-core.js","data/environment/sky-lut.bin":"res/data-core.js","data/iit-spectra.json":"res/data-core.js","data/environment/airglow.json":"res/data-core.js","data/environment/airglow.bin":"res/data-core.js","data/user-figures.json":"res/data-core.js","data/atlas2/barnard-stars.bin":"res/data-barnard.js","data/atlas2/barnard.bin":"res/data-barnard.js","data/atlas2/barnard.json":"res/data-barnard.js","data/atlas2/carina-core.bin":"res/data-carina.js","data/atlas2/carina-detail.bin":"res/data-carina.js","data/atlas2/carina-stars.bin":"res/data-carina.js","data/atlas2/carina.bin":"res/data-carina.js","data/atlas2/carina.json":"res/data-carina.js","data/atlas2/cygnus-stars.bin":"res/data-cygnus.js","data/atlas2/cygnus.bin":"res/data-cygnus.js","data/atlas2/cygnus.json":"res/data-cygnus.js","data/atlas2/gum-stars.bin":"res/data-gum.js","data/atlas2/gum.bin":"res/data-gum.js","data/atlas2/gum.json":"res/data-gum.js","data/atlas2/helix-detail.bin":"res/data-helix.js","data/atlas2/helix-stars.bin":"res/data-helix.js","data/atlas2/helix.bin":"res/data-helix.js","data/atlas2/helix.json":"res/data-helix.js","data/atlas2/horsehead-detail.bin":"res/data-horsehead.js","data/atlas2/horsehead-stars.bin":"res/data-horsehead.js","data/atlas2/horsehead.bin":"res/data-horsehead.js","data/atlas2/horsehead.json":"res/data-horsehead.js","data/atlas2/m27-detail.bin":"res/data-m27.js","data/atlas2/m27-stars.bin":"res/data-m27.js","data/atlas2/m27.bin":"res/data-m27.js","data/atlas2/m27.json":"res/data-m27.js","data/atlas2/m31-stars.bin":"res/data-m31.js","data/atlas2/m31.bin":"res/data-m31.js","data/atlas2/m31.json":"res/data-m31.js","data/atlas2/m42-core.bin":"res/data-m42.js","data/atlas2/m42-detail.bin":"res/data-m42.js","data/atlas2/m42-stars.bin":"res/data-m42.js","data/atlas2/m42.bin":"res/data-m42.js","data/atlas2/m42.json":"res/data-m42.js","data/atlas2/palette-stars.bin":"res/data-palette.js","data/atlas2/palette.bin":"res/data-palette.js","data/atlas2/palette.json":"res/data-palette.js","data/atlas2/rosette-detail.bin":"res/data-rosette.js","data/atlas2/rosette-stars.bin":"res/data-rosette.js","data/atlas2/rosette.bin":"res/data-rosette.js","data/atlas2/rosette.json":"res/data-rosette.js"};
  const store = new Map(), loading = new Map();
  window.__iitPortableData = entries => { for (const k in entries) store.set(k, entries[k]); };
  const load = src => {
    if (!loading.has(src)) loading.set(src, new Promise((ok, fail) => {
      const s = document.createElement('script');
      s.src = src; s.onload = ok;
      s.onerror = () => fail(new Error('便携数据缺失：' + src + '。请完整解压整个文件夹后再打开 START.html。'));
      document.head.appendChild(s);
    }));
    return loading.get(src);
  };
  const base = new URL('.', location.href);
  window.fetch = async input => {
    const url = new URL(input instanceof Request ? input.url : String(input), base);
    const key = decodeURIComponent(url.href.slice(base.href.length).split(/[?#]/)[0]);
    const src = INDEX[key];
    if (!src || url.origin !== base.origin) return new Response('Not embedded in the portable package', { status: 404 });
    await load(src);
    const b64 = store.get(key);
    const bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Response(bytes, { status: 200, headers: { 'content-type': key.endsWith('.json') ? 'application/json' : 'application/octet-stream' } });
  };
})();
