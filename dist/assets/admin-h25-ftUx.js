import{s as u}from"./auth-nav-BisOj3S9.js";/* empty css               */import"https://esm.sh/@supabase/supabase-js";const f=e=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",minimumFractionDigits:2}).format(Number(e||0)),y=()=>{document.getElementById("adminLocked").classList.add("hidden-admin"),document.getElementById("adminContent").classList.remove("hidden-admin")},h=()=>{try{return JSON.parse(localStorage.getItem("smartTomProducts"))||[]}catch{return[]}},p=()=>{try{return JSON.parse(localStorage.getItem("smartTomOrders"))||[]}catch{return[]}},g=()=>{try{return JSON.parse(localStorage.getItem("smartTomProfiles"))||[]}catch{return[]}},$=async()=>{const{data:e,error:n}=await u.from("profiles").select("*");if(n||!e)return;const i=g(),c=e.map(a=>{const o=i.find(d=>d.id===a.user_id)||{};return{...o,id:a.user_id,email:a.email||o.email||"",fullName:a.full_name||o.fullName||"",schoolName:a.school_name||o.schoolName||"",studentId:a.school_id_number||o.studentId||"",verificationStatus:a.verification_status||o.verificationStatus||"pending",verificationSubmittedAt:a.verification_submitted_at||o.verificationSubmittedAt||"",verificationRejectionReason:a.verification_rejection_reason||o.verificationRejectionReason||"",idPhotoUrl:a.id_photo_url||o.idPhotoUrl||"",idPhotoDataUrl:o.idPhotoDataUrl||""}});localStorage.setItem("smartTomProfiles",JSON.stringify(c))},b=(e,n)=>{const i=document.getElementById("productMessage");i.className=`status show ${e}`,i.textContent=n},N=e=>{const n=document.getElementById("verificationDetail");n.classList.remove("hidden-admin"),n.innerHTML=`
          <div class="verification-detail-head">
            <div>
              <span class="muted">Student verification review</span>
              <h3>${e.fullName||"Student"}</h3>
              <p>${e.email||"No email"} • ${e.phone||"No phone"}</p>
            </div>
            <span class="pill ${e.verificationStatus||"pending"}">${e.verificationStatus||"pending"}</span>
          </div>
          <div class="verification-detail-grid">
            <div>
              <strong>School</strong><p>${e.schoolName||"Not provided"}</p>
              <strong>Student ID number</strong><p>${e.studentId||"Not provided"}</p>
              <strong>Submitted</strong><p>${e.verificationSubmittedAt?new Date(e.verificationSubmittedAt).toLocaleString():"Not submitted"}</p>
              ${e.verificationRejectionReason?`<strong>Rejection reason</strong><p>${e.verificationRejectionReason}</p>`:""}
            </div>
            <div class="verification-image-large">
              ${e.idPhotoDataUrl?`<img src="${e.idPhotoDataUrl}" alt="${e.fullName||"Student"} school ID" />`:'<p class="muted">No ID image is available.</p>'}
            </div>
          </div>
          <div class="verification-detail-actions">
            <button class="btn approve-profile" data-id="${e.id}" type="button">Approve verification</button>
            <button class="btn ghost reject-profile" data-id="${e.id}" type="button">Reject verification</button>
          </div>
        `,n.querySelectorAll(".approve-profile, .reject-profile").forEach(i=>{i.addEventListener("click",async()=>{const c=g(),a=c.find(d=>d.id===i.dataset.id);if(!a)return;a.verificationStatus=i.classList.contains("approve-profile")?"approved":"rejected",a.verificationRejectionReason=a.verificationStatus==="rejected"?"Profile or ID information needs correction.":"",await u.from("profiles").update({verification_status:a.verificationStatus,verification_rejection_reason:a.verificationRejectionReason||null}).eq("user_id",a.id),localStorage.setItem("smartTomProfiles",JSON.stringify(c));const o=a.verificationStatus==="rejected"?"rejected":"approved";document.querySelectorAll(".sub-tab").forEach(d=>{const l=d.dataset.sub===o;d.classList.toggle("active",l),d.classList.toggle("secondary",!l)}),document.getElementById("verificationDetail").classList.add("hidden-admin"),r()})})},r=()=>{var v;const e=g(),n=document.getElementById("verificationQueue"),i=((v=document.querySelector(".sub-tab.active"))==null?void 0:v.dataset.sub)||"pending",c=e.filter(t=>(t.verificationStatus||"pending")===i);n.innerHTML=c.length?c.map(t=>`
          <article class="verification-card">
            <div>
              <strong>${t.fullName||"Student"}</strong>
              <small>${t.email||"No email"} • ID: ${t.studentId||"Not provided"}</small>
              <small>${t.schoolName||"School not provided"} • ${t.phone||"No phone"}</small>
              ${t.idPhotoDataUrl?`<img class="verification-photo" src="${t.idPhotoDataUrl}" alt="Student ID photo" />`:"<small>No ID image saved in this browser</small>"}
            </div>
            <div class="verification-actions">
              <span class="pill ${t.verificationStatus||"pending"}">${t.verificationStatus||"pending"}</span>
              <button class="btn review-profile" data-id="${t.id}" type="button">Review details</button>
            </div>
          </article>
        `).join(""):`<p class="muted">No ${i} student profiles.</p>`,document.querySelectorAll(".sub-tab").forEach(t=>{t.onclick=()=>{document.querySelectorAll(".sub-tab").forEach(s=>{s.classList.remove("active"),s.classList.add("secondary")}),t.classList.remove("secondary"),t.classList.add("active"),r()}}),document.querySelectorAll(".review-profile").forEach(t=>{t.addEventListener("click",()=>{const s=g().find(m=>m.id===t.dataset.id);s&&N(s)})});const a=document.getElementById("adminProducts"),o=h();a.innerHTML=o.length?o.map(t=>`
          <tr>
            <td>${t.name}</td>
            <td>${t.category}</td>
            <td>${f(t.price)}</td>
            <td>${t.stock}</td>
            <td><button class="btn ghost remove-product" data-id="${t.id}" type="button">Remove</button></td>
          </tr>
        `).join(""):'<tr><td colspan="5">No products available.</td></tr>';const d=document.getElementById("adminOrders"),l=p();d.innerHTML=l.length?l.map(t=>`
          <tr>
            <td>${t.id.slice(0,8)}</td>
            <td>${t.studentName||"Student name not provided"}<br><small>${t.contact||"Contact not provided"}</small></td>
            <td>${new Date(t.createdAt).toLocaleString()}</td>
            <td>${t.pickupDate||"Not specified"}<br><small>${t.pickupLocation||"Location not specified"}</small></td>
            <td>${t.studentId||"Not provided"}</td>
            <td>${t.items.map(s=>`${s.name} x${s.qty}`).join(", ")}</td>
            <td>${f(t.total)}</td>
            <td>${t.paymentMethod||"Not specified"}<br><small>${t.notes||"No notes"}</small></td>
            <td>
              <select class="order-status" data-id="${t.id}">
                ${["new","processing","ready","completed","cancelled"].map(s=>`<option ${t.status===s?"selected":""}>${s}</option>`).join("")}
              </select>
            </td>
          </tr>
        `).join(""):'<tr><td colspan="9">No orders placed yet.</td></tr>',document.querySelectorAll(".remove-product").forEach(t=>{t.addEventListener("click",()=>{confirm("Remove this product from the student catalog?")&&(localStorage.setItem("smartTomProducts",JSON.stringify(o.filter(s=>s.id!==t.dataset.id))),r())})}),document.querySelectorAll(".order-status").forEach(t=>{t.addEventListener("change",()=>{const s=p(),m=s.find(S=>S.id===t.dataset.id);m&&(m.status=t.value,localStorage.setItem("smartTomOrders",JSON.stringify(s)),r())})})},I=async()=>{const{data:e}=await u.auth.getSession();if(!e.session){window.location.href="login.html";return}const{data:n,error:i}=await u.rpc("is_admin");if(i||!n){const a=e.session,o=(i==null?void 0:i.message)||"The database returned false for is_admin().";document.getElementById("adminAccessMessage").textContent=`Signed in as ${a.user.email||"unknown account"} (${a.user.id}). Admin check failed: ${o}`;return}y(),$().finally(r);const c=new URLSearchParams(window.location.search).get("section");c&&document.getElementById(c)&&document.getElementById(c).scrollIntoView({behavior:"smooth",block:"start"})};I();document.getElementById("productForm").addEventListener("submit",e=>{e.preventDefault();const n=new FormData(e.currentTarget),i=h();i.unshift({id:crypto.randomUUID(),name:n.get("name").toString(),category:n.get("category").toString(),price:Number(n.get("price")),stock:Number(n.get("stock")),image:n.get("image").toString()||"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"}),localStorage.setItem("smartTomProducts",JSON.stringify(i)),e.currentTarget.reset(),b("success","Product added to the student catalog."),r()});
