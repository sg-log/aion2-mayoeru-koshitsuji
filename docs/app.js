"use strict";
const notesEl=document.getElementById("notes"),empty=document.getElementById("empty"),countEl=document.getElementById("resultCount"),search=document.getElementById("query");
const categories=[...document.querySelectorAll("[data-cat]")];const aliases={"金貨":"ギーナ","お金":"ギーナ","キナ":"ギーナ","毎日やること":"デイリー","日課":"デイリー","毎週やること":"ウィークリー","週課":"ウィークリー"};
const catNames={money:"通貨・商店",items:"アイテム・素材",gear:"装備・強化",battle:"戦闘・スキル",explore:"探索・コンテンツ",settings:"設定・便利機能",daily:"デイリー",weekly:"ウィークリー"};
let records=[],category="";
function norm(s){return String(s||"").normalize("NFKC").toLowerCase().replace(/[\s　・_()（）]/g,"")}
function words(q){let terms=q.trim().split(/[\s　]+/).filter(Boolean);return terms.map(t=>[norm(t),norm(aliases[t]||"")].filter(Boolean))}
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function render(){const terms=words(search.value),visible=records.filter(n=>{if(category&&n.category!==category)return false;const hay=norm([n.title,n.summary,...(n.details||[]),...(n.keywords||[]),catNames[n.category]||""].join(" "));return terms.every(group=>group.some(t=>hay.includes(t)))});countEl.textContent=visible.length+" 件";notesEl.replaceChildren();empty.hidden=visible.length>0;empty.textContent=records.length?"該当するメモはありません。別の言葉で探してみてね。":"公開準備中です。確認できた情報から少しずつ増やします。";
for(const n of visible){const a=el("a","note");a.href="./note.html?id="+encodeURIComponent(n.id);a.append(el("span","tag",catNames[n.category]||"メモ"),el("strong","",n.title),el("p","",n.summary));notesEl.append(a)}}
function choose(cat){category=category===cat?"":cat;for(const b of categories)b.setAttribute("aria-pressed",String(b.dataset.cat===category));render();document.getElementById("results").scrollIntoView({behavior:"smooth",block:"start"})}
categories.forEach(b=>b.addEventListener("click",()=>choose(b.dataset.cat)));
document.querySelectorAll("[data-query]").forEach(b=>b.addEventListener("click",()=>{search.value=b.dataset.query;category="";categories.forEach(x=>x.setAttribute("aria-pressed","false"));render();search.focus()}));
search.addEventListener("input",()=>{render();const url=new URL(location.href);search.value.trim()?url.searchParams.set("q",search.value.trim()):url.searchParams.delete("q");history.replaceState(null,"",url)});
search.value=new URLSearchParams(location.search).get("q")||"";
fetch("./data/notes.json").then(r=>{if(!r.ok)throw new Error("data unavailable");return r.json()}).then(a=>{records=Array.isArray(a)?a.filter(n=>n.status==="公開中"):[];render()}).catch(()=>{empty.hidden=false;empty.textContent="メモ一覧を読み込めませんでした。ページを再読み込みしてください。";countEl.textContent="";});
