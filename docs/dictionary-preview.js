"use strict";
(() => {
  const Search = globalThis.AionSearch;
  const sample = [
    {id:"demo-inheritance",category:"gear",title:"装備継承の前に確認すること",summary:"引き継ぐ内容と装備の扱いを、短い手順で確認する記事の表示例。",keywords:["装備","継承","引き継ぎ","引継"],details:["継承元と継承先の表示を確認する。","必要な素材や条件を確認する。","確定する前に注意点を読み返す。"],caution:"ここには仕様確認後の注意事項を掲載します。",image:true},
    {id:"demo-daily",category:"daily",title:"毎日の優先順位を確認したい",summary:"プレイ時間が短い日に、何から確認するかをまとめる表示例。",keywords:["日課","毎日","デイリー","優先度"],details:["期限が近い項目から確認。","後回しにできるものは別にまとめる。"],caution:"実際の回数・更新時間は検証してから掲載します。"},
    {id:"demo-currency",category:"money",title:"ギーナの種類と使い道",summary:"「金貨」や「お金」で検索しても見つけられる記事の表示例。",keywords:["ギーナ","金貨","お金","キナ"],details:["名称の違いを表に整理する。","使える場所や条件を確認する。"],image:true},
    {id:"demo-potential",category:"gear",title:"潜在力強化の調べ方",summary:"強化の画面・素材・更新時の注意点をまとめる記事の表示例。",keywords:["強化","潜在力","装備"],details:["強化画面の位置を画像で示す。","素材の必要数を確認してから掲載する。"],image:true},
    {id:"demo-weekly",category:"weekly",title:"週の更新前に確認したいこと",summary:"回数が残っているコンテンツを探しやすく整理する表示例。",keywords:["週課","毎週","リセット","ダンジョン"],details:["回数と期限を並べる。","持ち越せる項目とそうでない項目を区別する。"]},
    {id:"demo-nightmare",category:"explore",title:"悪夢の挑戦回数を確認する",summary:"挑戦できる場所や回数の見方を案内する表示例。",keywords:["悪夢","ダンジョン","探索"],details:["画面の該当箇所を確認する。","回数の仕組みを短い表で示す。"],image:true},
    {id:"demo-material",category:"items",title:"素材はどこで手に入る？",summary:"素材の入手先と使い道を一覧で探せる記事の表示例。",keywords:["素材","入手","アイテム"],details:["素材アイコンと名前を並べる。","入手先と使用用途を分けて書く。"],image:true},
    {id:"demo-skill",category:"battle",title:"スキルの仕組みを調べる",summary:"スキルの名称、選択肢、操作箇所を整理する表示例。",keywords:["スキル","戦闘"],details:["画面の設定箇所を示す。","用途別に短く説明する。"],image:true},
    {id:"demo-setting",category:"settings",title:"便利な設定を探す",summary:"操作や画面表示を快適にする設定を集める記事の表示例。",keywords:["設定","便利"],details:["設定画面を開く。","該当する項目を確認する。"]}
  ].map(item => ({...item,status:"表示例"}));
  let entries = sample;
  let demo = true;
  let category = "all";
  let activeQuery = new URLSearchParams(location.search).get("q") || "";
  const byId = (id) => document.getElementById(id);
  const nav = [...document.querySelectorAll("[data-category]")];
  const search = byId("search");
  const list = byId("articleList");
  const listing = byId("listing");
  const detail = byId("detail");
  const getCounts = () => {
    const counts = {all:entries.length};
    for(const item of entries) counts[item.category] = (counts[item.category] || 0) + 1;
    for(const node of document.querySelectorAll("[data-count-for]")) {
      node.textContent = String(counts[node.dataset.countFor] || 0);
    }
  };
  function make(tag,cls,content){
    const e=document.createElement(tag);
    if(cls)e.className=cls;
    if(content!==undefined)e.textContent=content;
    return e;
  }
  function refreshUrl(){
    const u = new URL(location.href);
    activeQuery ? u.searchParams.set("q",activeQuery) : u.searchParams.delete("q");
    if(category !== "all")u.searchParams.set("category",category);
    else u.searchParams.delete("category");
    history.replaceState(null,"",u);
  }
  function selectCategory(name){
    category=name;
    nav.forEach(b=>{
      const selected = b.dataset.category===category;
      b.classList.toggle("selected",selected);
      b.setAttribute("aria-pressed",String(selected));
    });
    refreshUrl();
    render();
    showList();
  }
  function visibleEntries(){
    return entries.filter(item=>
      (category==="all"||item.category===category)
      && Search.matches(item,activeQuery)
    );
  }
  function render(){
    getCounts();
    const matches = visibleEntries();
    byId("listTitle").textContent=category==="all"?"記事一覧":(Search.labels[category]||"記事一覧");
    byId("listCount").textContent=matches.length+" 件";
    list.replaceChildren();
    byId("empty").hidden=matches.length>0;
    byId("emptyTitle").textContent=demo?"見つかりませんでした":"まだ公開記事がありません";
    byId("emptyText").textContent=demo?"ほかの言葉やカテゴリで探してみてね。":"確認された情報から追加していきます。";
    for(const item of matches){
      const button=make("button","article-item");
      button.type="button";
      const content=make("span","article-text");
      const upper=make("span","article-topline");
      upper.append(make("span","category-tag",Search.labels[item.category]||"記事"));
      content.append(upper,make("strong","",item.title),make("p","",item.summary));
      button.append(content,make("span","item-arrow","›"));
      button.addEventListener("click",()=>showDetail(item));
      list.append(button);
    }
  }
  function showList(){
    detail.hidden=true;
    listing.hidden=false;
    byId("demoMessage").hidden=false;
    search.focus({preventScroll:true});
  }
  function showDetail(item){
    listing.hidden=true;detail.hidden=false;byId("demoMessage").hidden=true;
    byId("detailCategory").textContent=Search.labels[item.category]||"記事";
    byId("detailStatus").textContent=demo?"レイアウト例":"確認済み記事";
    byId("detailTitle").textContent=item.title;
    byId("detailSummary").textContent=item.summary;
    const steps=byId("detailSteps");
    steps.replaceChildren();
    for(const line of (item.details||[]))steps.append(make("li","",line));
    byId("detailStepsSection").hidden=!item.details?.length;
    byId("detailCaution").textContent=item.caution||"";
    byId("detailCautionSection").hidden=!item.caution;
    byId("detailImageSection").hidden=!(demo&&item.image);
    byId("imageCaption").textContent="画像付き記事の配置例。実際のゲーム画面ではありません。";
    const sources=byId("detailSources");sources.replaceChildren();
    if(demo){
      sources.append(make("p","","本番の記事では、ここに公式ガイド等の出典を表示します。"));
      byId("checkedAt").textContent="確認日：本番記事で表示";
    } else {
      for(const s of (item.sources||[])){
        const p=make("p","");const a=make("a","",s.label||s.url);
        a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";p.append(a);sources.append(p);
      }
      byId("checkedAt").textContent="確認日："+(item.checked_at||"未設定");
    }
    document.querySelector(".workspace").scrollIntoView({block:"start",behavior:"auto"});
  }
  function setQuery(q){
    activeQuery=q;search.value=q;byId("clearSearch").hidden=!q;
    refreshUrl();render();showList();
  }
  search.value=activeQuery;
  byId("clearSearch").hidden=!activeQuery;
  search.addEventListener("input",()=>{activeQuery=search.value;byId("clearSearch").hidden=!activeQuery;refreshUrl();render();listing.hidden=false;detail.hidden=true;byId("demoMessage").hidden=false;});
  byId("clearSearch").addEventListener("click",()=>setQuery(""));
  for(const btn of document.querySelectorAll("[data-query]"))btn.addEventListener("click",()=>setQuery(btn.dataset.query));
  for(const btn of nav)btn.addEventListener("click",()=>selectCategory(btn.dataset.category));
  byId("back").addEventListener("click",showList);
  const dialog=byId("imageDialog");
  byId("imageExpand").addEventListener("click",()=>{
    byId("largeImage").replaceChildren(byId("imageExpand").querySelector(".image-faux").cloneNode(true));
    dialog.showModal();
  });
  byId("closeDialog").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",(e)=>{if(e.target===dialog)dialog.close();});
  const requested = new URLSearchParams(location.search).get("category");
  category = nav.some(n=>n.dataset.category===requested)?requested:"all";
  async function load(){
    try{
      const response=await fetch("./data/notes.json");
      if(!response.ok)throw new Error("unavailable");
      const data=await response.json();
      if(!Array.isArray(data))throw new Error("invalid data");
      const approved=data.filter(item=>item&&item.status==="公開中");
      if(approved.length){
        entries=approved;demo=false;
        byId("demoMessage").innerHTML="<span class='demo-dot'></span><span>現在公開されている記事を表示しています。</span>";
      }
    }catch(error){
      byId("demoMessage").innerHTML="<span class='demo-dot'></span><span><strong>デモ表示中。</strong> 公開データの読込に失敗しました。表示例は実際の攻略情報ではありません。</span>";
    }
    selectCategory(category);
  }
  load();
})();