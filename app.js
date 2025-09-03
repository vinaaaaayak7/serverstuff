async function load() {
const res = await fetch('files.json?_=' + Date.now());
const items = await res.json();
const qEl = document.getElementById('q');
const tagEl = document.getElementById('tag');
const typeEl = document.getElementById('type');
const clearBtn = document.getElementById('clearFilters');
const results = document.getElementById('results');
const count = document.getElementById('count');
const tmpl = document.getElementById('cardTmpl');


function kb(n) { return n ? (n/1024).toFixed(1) + ' KB' : ''; }


function render(list) {
results.innerHTML = '';
count.textContent = list.length + ' file' + (list.length !== 1 ? 's' : '');
for (const f of list) {
const node = tmpl.content.cloneNode(true);
node.querySelector('.file-name').textContent = f.name;
node.querySelector('.file-path').textContent = f.path || '';
node.querySelector('.file-type').textContent = f.type || 'file';
node.querySelector('.file-size').textContent = f.size ? kb(f.size) : '';
node.querySelector('.file-updated').textContent = f.updated ? ('Updated ' + f.updated) : '';
const tagsWrap = node.querySelector('.file-tags');
(f.tags || []).forEach(t => {
const span = document.createElement('span');
span.className = 'text-xs px-2 py-1 rounded-full border';
span.textContent = '#' + t;
tagsWrap.appendChild(span);
});
const dl = node.querySelector('.download-btn');
dl.href = f.url;
dl.rel = 'noopener noreferrer';
dl.textContent = 'Download';
node.querySelector('.copy-btn').addEventListener('click', async () => {
try { await navigator.clipboard.writeText(f.url); alert('Link copied!'); } catch(e) { console.log(e); }
});
results.appendChild(node);
}
}


function filter() {
const q = (qEl.value || '').toLowerCase().trim();
const tag = (tagEl.value || '').toLowerCase().trim();
const type = (typeEl.value || '').toLowerCase().trim();
const out = items.filter(f => {
const inName = (f.name||'').toLowerCase().includes(q);
const inPath = (f.path||'').toLowerCase().includes(q);
const inType = !type || (f.type||'').toLowerCase() === type;
const inTag = !tag || (f.tags||[]).some(t => (t||'').toLowerCase().includes(tag));
const inQTags = !q || (f.tags||[]).some(t => (t||'').toLowerCase().includes(q));
const inQType = !q || (f.type||'').toLowerCase().includes(q);
return (inName || inPath || inQTags || inQType) && inType && inTag;
});
render(out);
}


qEl.addEventListener('input', filter);
tagEl.addEventListener('input', filter);
typeEl.addEventListener('change', filter);
clearBtn.addEventListener('click', () => { qEl.value=''; tagEl.value=''; typeEl.value=''; filter(); });


render(items);
}


load();
