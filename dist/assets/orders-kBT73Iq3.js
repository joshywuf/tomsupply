import{s as h}from"./auth-nav-BisOj3S9.js";/* empty css               */import"https://esm.sh/@supabase/supabase-js";const i={products:"smartTomProducts",cart:"smartTomCart",orders:"smartTomOrders"},m=o=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",minimumFractionDigits:2}).format(Number(o||0)),v=[{id:crypto.randomUUID(),name:"Print Bundle",category:"Printing",price:149,stock:15,image:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"},{id:crypto.randomUUID(),name:"Notebook Pack",category:"Supplies",price:195,stock:8,image:"https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"},{id:crypto.randomUUID(),name:"Pens & Highlighters",category:"Stationery",price:110,stock:20,image:"https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"}],u=(o,r)=>{try{const e=localStorage.getItem(o);return e?JSON.parse(e):r}catch{return r}},p=(o,r)=>localStorage.setItem(o,JSON.stringify(r)),b=()=>{const o=u(i.products,null);return o||(I(v),v)},I=o=>p(i.products,o),l=()=>u(i.cart,[]),d=o=>p(i.cart,o),k=()=>{const o=document.getElementById("catalogGrid"),r=b();o.innerHTML=r.map(e=>`
          <article class="product-card">
            <div class="product-image">
              <img src="${e.image||"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"}" alt="${e.name}" />
            </div>
            <div class="product-body">
              <div class="product-header">
                <h3 class="product-title">${e.name}</h3>
                <span class="price-tag">${m(e.price)}</span>
              </div>

              <div class="product-meta">
                <span>${e.category}</span>
                <span>${e.stock} available</span>
              </div>

              <div class="product-actions">
                <button class="btn secondary add-cart-btn" data-id="${e.id}" ${Number(e.stock)<1?"disabled":""}>${Number(e.stock)<1?"Out of stock":"Add to cart"}</button>
              </div>
            </div>
          </article>
        `).join(""),document.querySelectorAll(".add-cart-btn").forEach(e=>{e.addEventListener("click",()=>{const c=b().find(a=>a.id===e.dataset.id);if(!c)return;const t=l(),n=t.find(a=>a.id===c.id);n?n.qty+=1:t.push({...c,qty:1}),d(t),g()})})},g=()=>{const o=l(),r=document.getElementById("cartItems"),e=document.getElementById("cartTotal");if(!o.length){r.innerHTML='<div class="cart-item"><div><strong>Your cart is empty</strong><small>Add a product to begin your order.</small></div></div>',e.textContent="₱0.00";return}r.innerHTML=o.map(t=>`
          <div class="cart-item">
            <div>
              <strong>${t.name}</strong>
              <small>${m(t.price)} each • ${t.stock} available</small>
              <div class="quantity-controls">
                <button class="btn ghost cart-action" data-action="decrease" data-id="${t.id}" type="button">−</button>
                <span>${t.qty}</span>
                <button class="btn ghost cart-action" data-action="increase" data-id="${t.id}" type="button">+</button>
                <button class="btn ghost cart-action remove-action" data-action="remove" data-id="${t.id}" type="button">Remove</button>
              </div>
            </div>
            <strong>${m(t.qty*Number(t.price))}</strong>
          </div>
        `).join("");const c=o.reduce((t,n)=>t+Number(n.price)*n.qty,0);e.textContent=m(c),document.querySelectorAll(".cart-action").forEach(t=>{t.addEventListener("click",()=>{const n=l(),a=n.find(s=>s.id===t.dataset.id);a&&(t.dataset.action==="remove"?d(n.filter(s=>s.id!==a.id)):t.dataset.action==="increase"&&a.qty<Number(a.stock)?(a.qty+=1,d(n)):t.dataset.action==="decrease"&&(a.qty-=1,d(a.qty>0?n:n.filter(s=>s.id!==a.id))),g())})})};document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!l().length){alert("Add an item to your cart before placing an order.");return}const r=u("smartTomProfiles",[]),e=localStorage.getItem("smartTomCurrentProfileId");if(!r.find(t=>t.id===e&&t.verificationStatus==="approved")){document.getElementById("verificationNotice").className="status error show",document.getElementById("verificationNotice").innerHTML='Your profile must be approved by an admin before ordering. <a href="profile.html"><strong>Complete your profile</strong></a>.',document.getElementById("verificationNotice").scrollIntoView({behavior:"smooth",block:"center"});return}document.getElementById("checkoutPanel").classList.remove("hidden-admin"),document.getElementById("checkoutPanel").scrollIntoView({behavior:"smooth",block:"start"})});document.getElementById("cancelCheckoutBtn").addEventListener("click",()=>{document.getElementById("checkoutPanel").classList.add("hidden-admin")});document.getElementById("checkoutForm").addEventListener("submit",o=>{o.preventDefault();const r=l(),e=new FormData(o.currentTarget),c=u(i.orders,[]),t={id:crypto.randomUUID(),createdAt:new Date().toISOString(),status:"new",studentName:e.get("fullName").toString(),contact:e.get("contact").toString(),pickupDate:e.get("pickupDate").toString(),pickupLocation:e.get("pickupLocation").toString(),studentId:e.get("studentId").toString(),studentProfileId:localStorage.getItem("smartTomCurrentProfileId"),paymentMethod:e.get("paymentMethod").toString(),notes:e.get("notes").toString(),items:r,total:r.reduce((a,s)=>a+Number(s.price)*s.qty,0)};(async()=>{const{data:a}=await h.auth.getSession();if(!a.session){alert("Please sign in before placing a request."),window.location.href="login.html";return}const s=r.map(y=>({user_id:a.session.user.id,item_name:y.name,quantity:y.qty,notes:`${t.notes||"No notes"} | Pickup: ${t.pickupDate} at ${t.pickupLocation} | Payment: ${t.paymentMethod}`,status:"pending"})),{error:f}=await h.from("orders").insert(s);if(f){document.getElementById("checkoutMessage").className="status error show",document.getElementById("checkoutMessage").textContent=f.message||"Unable to save your request.";return}c.unshift(t),p(i.orders,c),d([]),g(),o.currentTarget.reset(),document.getElementById("checkoutPanel").classList.add("hidden-admin"),alert(`Request ${t.id.slice(0,8)} sent. The admin has been notified.`)})()});k();g();
