import {env} from "cloudflare:workers";
import {NextRequest,NextResponse} from "next/server";
import {cartCookie,cartDetails,parseCart} from "../../../src/lib/cart";
import {isLocale,paths} from "../../../src/lib/catalog";
import {policy} from "../../../src/content/policy";

const clean=(form:FormData,key:string,max=250)=>String(form.get(key)??"").trim().slice(0,max);
const go=(request:NextRequest,path:string)=>NextResponse.redirect(new URL(path,request.url),303);

export async function POST(request:NextRequest){
  const form=await request.formData();const rawLocale=clean(form,"locale",2);const locale=isLocale(rawLocale)?rawLocale:"en";const p=paths(locale);const fail=(reason="details")=>go(request,`${p.checkout}?error=${reason}`);
  const cart=parseCart(request.cookies.get(cartCookie)?.value);const rows=cartDetails(cart);if(!rows.length)return go(request,p.cart);
  const name=clean(form,"name",80),phone=clean(form,"phone",20),email=clean(form,"email",150),address=clean(form,"address",200),city=clean(form,"city",20),delivery=clean(form,"delivery",20),payment=clean(form,"payment",20);
  if(name.length<2||!/^0\d{9}$/.test(phone)||(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))||!form.has("consent")||!['ship','pickup'].includes(delivery)||!['cod','transfer'].includes(payment)||!['hanoi','other'].includes(city)||clean(form,"website"))return fail();
  if(delivery==="ship"&&address.length<5)return fail();if(payment==="cod"&&rows.reduce((n,row)=>n+row.qty,0)>policy.codMaxItems)return fail();
  if(!env.DB)return fail();
  const subtotal=rows.reduce((n,row)=>n+row.total,0);const shipping=delivery==="pickup"?0:city==="hanoi"?policy.shippingFeeHanoi:policy.shippingFeeOther;const total=subtotal+shipping;
  const orderId=crypto.randomUUID();const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,"0")).join("");const number=`RV${Date.now()}${Math.floor(Math.random()*1000).toString().padStart(3,"0")}`;const createdAt=new Date().toISOString();
  try{
    await env.DB.batch(rows.map(row=>env.DB!.prepare("INSERT OR IGNORE INTO inventory (sku,stock) VALUES (?,?)").bind(row.variant.sku,row.variant.stock)));
    const statements=[env.DB.prepare("INSERT INTO orders (id,token,number,created_at,locale,status,payment_method,delivery,customer_name,phone,email,address,city,subtotal,shipping_fee,total) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(orderId,token,number,createdAt,locale,payment==="cod"?"pending_confirmation":"pending_payment",payment,delivery,name,phone,email||null,delivery==="ship"?address:null,city,subtotal,shipping,total),...rows.map(row=>env.DB!.prepare("INSERT INTO order_items (id,order_id,sku,name,colour,qty,unit_price) VALUES (?,?,?,?,?,?,?)").bind(crypto.randomUUID(),orderId,row.variant.sku,row.product.name[locale],row.variant.colour[locale],row.qty,row.variant.priceVnd))];
    await env.DB.batch(statements);
    const response=go(request,`${p.order}/${token}`);response.cookies.set(cartCookie,"",{path:"/",maxAge:0});return response;
  }catch(error){const message=String(error);return fail(message.includes("OUT_OF_STOCK")?"stock":"details")}
}
