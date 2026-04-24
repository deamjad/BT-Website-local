const Hs=()=>{};var _i={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zi=function(r){const e=[];let i=0;for(let o=0;o<r.length;o++){let a=r.charCodeAt(o);a<128?e[i++]=a:a<2048?(e[i++]=a>>6|192,e[i++]=a&63|128):(a&64512)===55296&&o+1<r.length&&(r.charCodeAt(o+1)&64512)===56320?(a=65536+((a&1023)<<10)+(r.charCodeAt(++o)&1023),e[i++]=a>>18|240,e[i++]=a>>12&63|128,e[i++]=a>>6&63|128,e[i++]=a&63|128):(e[i++]=a>>12|224,e[i++]=a>>6&63|128,e[i++]=a&63|128)}return e},$s=function(r){const e=[];let i=0,o=0;for(;i<r.length;){const a=r[i++];if(a<128)e[o++]=String.fromCharCode(a);else if(a>191&&a<224){const y=r[i++];e[o++]=String.fromCharCode((a&31)<<6|y&63)}else if(a>239&&a<365){const y=r[i++],m=r[i++],E=r[i++],A=((a&7)<<18|(y&63)<<12|(m&63)<<6|E&63)-65536;e[o++]=String.fromCharCode(55296+(A>>10)),e[o++]=String.fromCharCode(56320+(A&1023))}else{const y=r[i++],m=r[i++];e[o++]=String.fromCharCode((a&15)<<12|(y&63)<<6|m&63)}}return e.join("")},Gi={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const i=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,o=[];for(let a=0;a<r.length;a+=3){const y=r[a],m=a+1<r.length,E=m?r[a+1]:0,A=a+2<r.length,I=A?r[a+2]:0,x=y>>2,C=(y&3)<<4|E>>4;let G=(E&15)<<2|I>>6,J=I&63;A||(J=64,m||(G=64)),o.push(i[x],i[C],i[G],i[J])}return o.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(zi(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):$s(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const i=e?this.charToByteMapWebSafe_:this.charToByteMap_,o=[];for(let a=0;a<r.length;){const y=i[r.charAt(a++)],E=a<r.length?i[r.charAt(a)]:0;++a;const I=a<r.length?i[r.charAt(a)]:64;++a;const C=a<r.length?i[r.charAt(a)]:64;if(++a,y==null||E==null||I==null||C==null)throw new zs;const G=y<<2|E>>4;if(o.push(G),I!==64){const J=E<<4&240|I>>2;if(o.push(J),C!==64){const H=I<<6&192|C;o.push(H)}}}return o},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class zs extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Gs=function(r){const e=zi(r);return Gi.encodeByteArray(e,!0)},Ae=function(r){return Gs(r).replace(/\./g,"")},Ws=function(r){try{return Gi.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qs(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Js=()=>qs().__FIREBASE_DEFAULTS__,Xs=()=>{if(typeof process>"u"||typeof _i>"u")return;const r=_i.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Ks=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&Ws(r[1]);return e&&JSON.parse(e)},Wi=()=>{try{return Hs()||Js()||Xs()||Ks()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Ys=r=>{var e,i;return(i=(e=Wi())==null?void 0:e.emulatorHosts)==null?void 0:i[r]},Qs=r=>{const e=Ys(r);if(!e)return;const i=e.lastIndexOf(":");if(i<=0||i+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const o=parseInt(e.substring(i+1),10);return e[0]==="["?[e.substring(1,i-1),o]:[e.substring(0,i),o]},qi=()=>{var r;return(r=Wi())==null?void 0:r.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zs{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,i)=>{this.resolve=e,this.reject=i})}wrapCallback(e){return(i,o)=>{i?this.reject(i):this.resolve(o),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(i):e(i,o))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tr(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const i={alg:"none",type:"JWT"},o=e||"demo-project",a=r.iat||0,y=r.sub||r.user_id;if(!y)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const m={iss:`https://securetoken.google.com/${o}`,aud:o,iat:a,exp:a+3600,auth_time:a,sub:y,user_id:y,firebase:{sign_in_provider:"custom",identities:{}},...r};return[Ae(JSON.stringify(i)),Ae(JSON.stringify(m)),""].join(".")}function er(){try{return typeof indexedDB=="object"}catch{return!1}}function nr(){return new Promise((r,e)=>{try{let i=!0;const o="validate-browser-context-for-indexeddb-analytics-module",a=self.indexedDB.open(o);a.onsuccess=()=>{a.result.close(),i||self.indexedDB.deleteDatabase(o),r(!0)},a.onupgradeneeded=()=>{i=!1},a.onerror=()=>{var y;e(((y=a.error)==null?void 0:y.message)||"")}}catch(i){e(i)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ir="FirebaseError";class jt extends Error{constructor(e,i,o){super(i),this.code=e,this.customData=o,this.name=ir,Object.setPrototypeOf(this,jt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ji.prototype.create)}}class Ji{constructor(e,i,o){this.service=e,this.serviceName=i,this.errors=o}create(e,...i){const o=i[0]||{},a=`${this.service}/${e}`,y=this.errors[e],m=y?sr(y,o):"Error",E=`${this.serviceName}: ${m} (${a}).`;return new jt(a,E,o)}}function sr(r,e){return r.replace(rr,(i,o)=>{const a=e[o];return a!=null?String(a):`<${o}?>`})}const rr=/\{\$([^}]+)}/g;function Ie(r,e){if(r===e)return!0;const i=Object.keys(r),o=Object.keys(e);for(const a of i){if(!o.includes(a))return!1;const y=r[a],m=e[a];if(vi(y)&&vi(m)){if(!Ie(y,m))return!1}else if(y!==m)return!1}for(const a of o)if(!i.includes(a))return!1;return!0}function vi(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function or(r){return r&&r._delegate?r._delegate:r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hr(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ar(r){return(await fetch(r,{credentials:"include"})).ok}class ne{constructor(e,i,o){this.name=e,this.instanceFactory=i,this.type=o,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(e,i){this.name=e,this.container=i,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const i=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(i)){const o=new Zs;if(this.instancesDeferred.set(i,o),this.isInitialized(i)||this.shouldAutoInitialize())try{const a=this.getOrInitializeService({instanceIdentifier:i});a&&o.resolve(a)}catch{}}return this.instancesDeferred.get(i).promise}getImmediate(e){const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),o=(e==null?void 0:e.optional)??!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(a){if(o)return null;throw a}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ur(e))try{this.getOrInitializeService({instanceIdentifier:wt})}catch{}for(const[i,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(i);try{const y=this.getOrInitializeService({instanceIdentifier:a});o.resolve(y)}catch{}}}}clearInstance(e=wt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(i=>"INTERNAL"in i).map(i=>i.INTERNAL.delete()),...e.filter(i=>"_delete"in i).map(i=>i._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=wt){return this.instances.has(e)}getOptions(e=wt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:i={}}=e,o=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(o))throw Error(`${this.name}(${o}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const a=this.getOrInitializeService({instanceIdentifier:o,options:i});for(const[y,m]of this.instancesDeferred.entries()){const E=this.normalizeInstanceIdentifier(y);o===E&&m.resolve(a)}return a}onInit(e,i){const o=this.normalizeInstanceIdentifier(i),a=this.onInitCallbacks.get(o)??new Set;a.add(e),this.onInitCallbacks.set(o,a);const y=this.instances.get(o);return y&&e(y,o),()=>{a.delete(e)}}invokeOnInitCallbacks(e,i){const o=this.onInitCallbacks.get(i);if(o)for(const a of o)try{a(e,i)}catch{}}getOrInitializeService({instanceIdentifier:e,options:i={}}){let o=this.instances.get(e);if(!o&&this.component&&(o=this.component.instanceFactory(this.container,{instanceIdentifier:cr(e),options:i}),this.instances.set(e,o),this.instancesOptions.set(e,i),this.invokeOnInitCallbacks(o,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,o)}catch{}return o||null}normalizeInstanceIdentifier(e=wt){return this.component?this.component.multipleInstances?e:wt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function cr(r){return r===wt?void 0:r}function ur(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const i=this.getProvider(e.name);if(i.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);i.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const i=new lr(e,this);return this.providers.set(e,i),i}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var R;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(R||(R={}));const pr={debug:R.DEBUG,verbose:R.VERBOSE,info:R.INFO,warn:R.WARN,error:R.ERROR,silent:R.SILENT},gr=R.INFO,dr={[R.DEBUG]:"log",[R.VERBOSE]:"log",[R.INFO]:"info",[R.WARN]:"warn",[R.ERROR]:"error"},mr=(r,e,...i)=>{if(e<r.logLevel)return;const o=new Date().toISOString(),a=dr[e];if(a)console[a](`[${o}]  ${r.name}:`,...i);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Xi{constructor(e){this.name=e,this._logLevel=gr,this._logHandler=mr,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in R))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?pr[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,R.DEBUG,...e),this._logHandler(this,R.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,R.VERBOSE,...e),this._logHandler(this,R.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,R.INFO,...e),this._logHandler(this,R.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,R.WARN,...e),this._logHandler(this,R.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,R.ERROR,...e),this._logHandler(this,R.ERROR,...e)}}const yr=(r,e)=>e.some(i=>r instanceof i);let wi,Ei;function _r(){return wi||(wi=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function vr(){return Ei||(Ei=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ki=new WeakMap,on=new WeakMap,Yi=new WeakMap,Ze=new WeakMap,pn=new WeakMap;function wr(r){const e=new Promise((i,o)=>{const a=()=>{r.removeEventListener("success",y),r.removeEventListener("error",m)},y=()=>{i(ft(r.result)),a()},m=()=>{o(r.error),a()};r.addEventListener("success",y),r.addEventListener("error",m)});return e.then(i=>{i instanceof IDBCursor&&Ki.set(i,r)}).catch(()=>{}),pn.set(e,r),e}function Er(r){if(on.has(r))return;const e=new Promise((i,o)=>{const a=()=>{r.removeEventListener("complete",y),r.removeEventListener("error",m),r.removeEventListener("abort",m)},y=()=>{i(),a()},m=()=>{o(r.error||new DOMException("AbortError","AbortError")),a()};r.addEventListener("complete",y),r.addEventListener("error",m),r.addEventListener("abort",m)});on.set(r,e)}let hn={get(r,e,i){if(r instanceof IDBTransaction){if(e==="done")return on.get(r);if(e==="objectStoreNames")return r.objectStoreNames||Yi.get(r);if(e==="store")return i.objectStoreNames[1]?void 0:i.objectStore(i.objectStoreNames[0])}return ft(r[e])},set(r,e,i){return r[e]=i,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function Ar(r){hn=r(hn)}function Ir(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...i){const o=r.call(tn(this),e,...i);return Yi.set(o,e.sort?e.sort():[e]),ft(o)}:vr().includes(r)?function(...e){return r.apply(tn(this),e),ft(Ki.get(this))}:function(...e){return ft(r.apply(tn(this),e))}}function Sr(r){return typeof r=="function"?Ir(r):(r instanceof IDBTransaction&&Er(r),yr(r,_r())?new Proxy(r,hn):r)}function ft(r){if(r instanceof IDBRequest)return wr(r);if(Ze.has(r))return Ze.get(r);const e=Sr(r);return e!==r&&(Ze.set(r,e),pn.set(e,r)),e}const tn=r=>pn.get(r);function Tr(r,e,{blocked:i,upgrade:o,blocking:a,terminated:y}={}){const m=indexedDB.open(r,e),E=ft(m);return o&&m.addEventListener("upgradeneeded",A=>{o(ft(m.result),A.oldVersion,A.newVersion,ft(m.transaction),A)}),i&&m.addEventListener("blocked",A=>i(A.oldVersion,A.newVersion,A)),E.then(A=>{y&&A.addEventListener("close",()=>y()),a&&A.addEventListener("versionchange",I=>a(I.oldVersion,I.newVersion,I))}).catch(()=>{}),E}const br=["get","getKey","getAll","getAllKeys","count"],Dr=["put","add","delete","clear"],en=new Map;function Ai(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(en.get(e))return en.get(e);const i=e.replace(/FromIndex$/,""),o=e!==i,a=Dr.includes(i);if(!(i in(o?IDBIndex:IDBObjectStore).prototype)||!(a||br.includes(i)))return;const y=async function(m,...E){const A=this.transaction(m,a?"readwrite":"readonly");let I=A.store;return o&&(I=I.index(E.shift())),(await Promise.all([I[i](...E),a&&A.done]))[0]};return en.set(e,y),y}Ar(r=>({...r,get:(e,i,o)=>Ai(e,i)||r.get(e,i,o),has:(e,i)=>!!Ai(e,i)||r.has(e,i)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cr{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(i=>{if(Rr(i)){const o=i.getImmediate();return`${o.library}/${o.version}`}else return null}).filter(i=>i).join(" ")}}function Rr(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const an="@firebase/app",Ii="0.14.11";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const it=new Xi("@firebase/app"),Pr="@firebase/app-compat",Nr="@firebase/analytics-compat",Or="@firebase/analytics",kr="@firebase/app-check-compat",Mr="@firebase/app-check",Lr="@firebase/auth",jr="@firebase/auth-compat",xr="@firebase/database",Vr="@firebase/data-connect",Br="@firebase/database-compat",Fr="@firebase/functions",Ur="@firebase/functions-compat",Hr="@firebase/installations",$r="@firebase/installations-compat",zr="@firebase/messaging",Gr="@firebase/messaging-compat",Wr="@firebase/performance",qr="@firebase/performance-compat",Jr="@firebase/remote-config",Xr="@firebase/remote-config-compat",Kr="@firebase/storage",Yr="@firebase/storage-compat",Qr="@firebase/firestore",Zr="@firebase/ai",to="@firebase/firestore-compat",eo="firebase",no="12.12.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ln="[DEFAULT]",io={[an]:"fire-core",[Pr]:"fire-core-compat",[Or]:"fire-analytics",[Nr]:"fire-analytics-compat",[Mr]:"fire-app-check",[kr]:"fire-app-check-compat",[Lr]:"fire-auth",[jr]:"fire-auth-compat",[xr]:"fire-rtdb",[Vr]:"fire-data-connect",[Br]:"fire-rtdb-compat",[Fr]:"fire-fn",[Ur]:"fire-fn-compat",[Hr]:"fire-iid",[$r]:"fire-iid-compat",[zr]:"fire-fcm",[Gr]:"fire-fcm-compat",[Wr]:"fire-perf",[qr]:"fire-perf-compat",[Jr]:"fire-rc",[Xr]:"fire-rc-compat",[Kr]:"fire-gcs",[Yr]:"fire-gcs-compat",[Qr]:"fire-fst",[to]:"fire-fst-compat",[Zr]:"fire-vertex","fire-js":"fire-js",[eo]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Se=new Map,so=new Map,cn=new Map;function Si(r,e){try{r.container.addComponent(e)}catch(i){it.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,i)}}function Te(r){const e=r.name;if(cn.has(e))return it.debug(`There were multiple attempts to register component ${e}.`),!1;cn.set(e,r);for(const i of Se.values())Si(i,r);for(const i of so.values())Si(i,r);return!0}function ro(r,e){const i=r.container.getProvider("heartbeat").getImmediate({optional:!0});return i&&i.triggerHeartbeat(),r.container.getProvider(e)}function oo(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ho={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},pt=new Ji("app","Firebase",ho);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ao{constructor(e,i,o){this._isDeleted=!1,this._options={...e},this._config={...i},this._name=i.name,this._automaticDataCollectionEnabled=i.automaticDataCollectionEnabled,this._container=o,this.container.addComponent(new ne("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw pt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lo=no;function co(r,e={}){let i=r;typeof e!="object"&&(e={name:e});const o={name:ln,automaticDataCollectionEnabled:!0,...e},a=o.name;if(typeof a!="string"||!a)throw pt.create("bad-app-name",{appName:String(a)});if(i||(i=qi()),!i)throw pt.create("no-options");const y=Se.get(a);if(y){if(Ie(i,y.options)&&Ie(o,y.config))return y;throw pt.create("duplicate-app",{appName:a})}const m=new fr(a);for(const A of cn.values())m.addComponent(A);const E=new ao(i,o,m);return Se.set(a,E),E}function uo(r=ln){const e=Se.get(r);if(!e&&r===ln&&qi())return co();if(!e)throw pt.create("no-app",{appName:r});return e}function kt(r,e,i){let o=io[r]??r;i&&(o+=`-${i}`);const a=o.match(/\s|\//),y=e.match(/\s|\//);if(a||y){const m=[`Unable to register library "${o}" with version "${e}":`];a&&m.push(`library name "${o}" contains illegal characters (whitespace or "/")`),a&&y&&m.push("and"),y&&m.push(`version name "${e}" contains illegal characters (whitespace or "/")`),it.warn(m.join(" "));return}Te(new ne(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fo="firebase-heartbeat-database",po=1,ie="firebase-heartbeat-store";let nn=null;function Qi(){return nn||(nn=Tr(fo,po,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(ie)}catch(i){console.warn(i)}}}}).catch(r=>{throw pt.create("idb-open",{originalErrorMessage:r.message})})),nn}async function go(r){try{const i=(await Qi()).transaction(ie),o=await i.objectStore(ie).get(Zi(r));return await i.done,o}catch(e){if(e instanceof jt)it.warn(e.message);else{const i=pt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});it.warn(i.message)}}}async function Ti(r,e){try{const o=(await Qi()).transaction(ie,"readwrite");await o.objectStore(ie).put(e,Zi(r)),await o.done}catch(i){if(i instanceof jt)it.warn(i.message);else{const o=pt.create("idb-set",{originalErrorMessage:i==null?void 0:i.message});it.warn(o.message)}}}function Zi(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mo=1024,yo=30;class _o{constructor(e){this.container=e,this._heartbeatsCache=null;const i=this.container.getProvider("app").getImmediate();this._storage=new wo(i),this._heartbeatsCachePromise=this._storage.read().then(o=>(this._heartbeatsCache=o,o))}async triggerHeartbeat(){var e,i;try{const a=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),y=bi();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((i=this._heartbeatsCache)==null?void 0:i.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===y||this._heartbeatsCache.heartbeats.some(m=>m.date===y))return;if(this._heartbeatsCache.heartbeats.push({date:y,agent:a}),this._heartbeatsCache.heartbeats.length>yo){const m=Eo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(m,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(o){it.warn(o)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const i=bi(),{heartbeatsToSend:o,unsentEntries:a}=vo(this._heartbeatsCache.heartbeats),y=Ae(JSON.stringify({version:2,heartbeats:o}));return this._heartbeatsCache.lastSentHeartbeatDate=i,a.length>0?(this._heartbeatsCache.heartbeats=a,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),y}catch(i){return it.warn(i),""}}}function bi(){return new Date().toISOString().substring(0,10)}function vo(r,e=mo){const i=[];let o=r.slice();for(const a of r){const y=i.find(m=>m.agent===a.agent);if(y){if(y.dates.push(a.date),Di(i)>e){y.dates.pop();break}}else if(i.push({agent:a.agent,dates:[a.date]}),Di(i)>e){i.pop();break}o=o.slice(1)}return{heartbeatsToSend:i,unsentEntries:o}}class wo{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return er()?nr().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const i=await go(this.app);return i!=null&&i.heartbeats?i:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const o=await this.read();return Ti(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const o=await this.read();return Ti(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}}function Di(r){return Ae(JSON.stringify({version:2,heartbeats:r})).length}function Eo(r){if(r.length===0)return-1;let e=0,i=r[0].date;for(let o=1;o<r.length;o++)r[o].date<i&&(i=r[o].date,e=o);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ao(r){Te(new ne("platform-logger",e=>new Cr(e),"PRIVATE")),Te(new ne("heartbeat",e=>new _o(e),"PRIVATE")),kt(an,Ii,r),kt(an,Ii,"esm2020"),kt("fire-js","")}Ao("");var Io="firebase",So="12.12.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */kt(Io,So,"app");var Ci=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var gn;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(p,l){function u(){}u.prototype=l.prototype,p.F=l.prototype,p.prototype=new u,p.prototype.constructor=p,p.D=function(g,f,_){for(var c=Array(arguments.length-2),z=2;z<arguments.length;z++)c[z-2]=arguments[z];return l.prototype[f].apply(g,c)}}function i(){this.blockSize=-1}function o(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(o,i),o.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function a(p,l,u){u||(u=0);const g=Array(16);if(typeof l=="string")for(var f=0;f<16;++f)g[f]=l.charCodeAt(u++)|l.charCodeAt(u++)<<8|l.charCodeAt(u++)<<16|l.charCodeAt(u++)<<24;else for(f=0;f<16;++f)g[f]=l[u++]|l[u++]<<8|l[u++]<<16|l[u++]<<24;l=p.g[0],u=p.g[1],f=p.g[2];let _=p.g[3],c;c=l+(_^u&(f^_))+g[0]+3614090360&4294967295,l=u+(c<<7&4294967295|c>>>25),c=_+(f^l&(u^f))+g[1]+3905402710&4294967295,_=l+(c<<12&4294967295|c>>>20),c=f+(u^_&(l^u))+g[2]+606105819&4294967295,f=_+(c<<17&4294967295|c>>>15),c=u+(l^f&(_^l))+g[3]+3250441966&4294967295,u=f+(c<<22&4294967295|c>>>10),c=l+(_^u&(f^_))+g[4]+4118548399&4294967295,l=u+(c<<7&4294967295|c>>>25),c=_+(f^l&(u^f))+g[5]+1200080426&4294967295,_=l+(c<<12&4294967295|c>>>20),c=f+(u^_&(l^u))+g[6]+2821735955&4294967295,f=_+(c<<17&4294967295|c>>>15),c=u+(l^f&(_^l))+g[7]+4249261313&4294967295,u=f+(c<<22&4294967295|c>>>10),c=l+(_^u&(f^_))+g[8]+1770035416&4294967295,l=u+(c<<7&4294967295|c>>>25),c=_+(f^l&(u^f))+g[9]+2336552879&4294967295,_=l+(c<<12&4294967295|c>>>20),c=f+(u^_&(l^u))+g[10]+4294925233&4294967295,f=_+(c<<17&4294967295|c>>>15),c=u+(l^f&(_^l))+g[11]+2304563134&4294967295,u=f+(c<<22&4294967295|c>>>10),c=l+(_^u&(f^_))+g[12]+1804603682&4294967295,l=u+(c<<7&4294967295|c>>>25),c=_+(f^l&(u^f))+g[13]+4254626195&4294967295,_=l+(c<<12&4294967295|c>>>20),c=f+(u^_&(l^u))+g[14]+2792965006&4294967295,f=_+(c<<17&4294967295|c>>>15),c=u+(l^f&(_^l))+g[15]+1236535329&4294967295,u=f+(c<<22&4294967295|c>>>10),c=l+(f^_&(u^f))+g[1]+4129170786&4294967295,l=u+(c<<5&4294967295|c>>>27),c=_+(u^f&(l^u))+g[6]+3225465664&4294967295,_=l+(c<<9&4294967295|c>>>23),c=f+(l^u&(_^l))+g[11]+643717713&4294967295,f=_+(c<<14&4294967295|c>>>18),c=u+(_^l&(f^_))+g[0]+3921069994&4294967295,u=f+(c<<20&4294967295|c>>>12),c=l+(f^_&(u^f))+g[5]+3593408605&4294967295,l=u+(c<<5&4294967295|c>>>27),c=_+(u^f&(l^u))+g[10]+38016083&4294967295,_=l+(c<<9&4294967295|c>>>23),c=f+(l^u&(_^l))+g[15]+3634488961&4294967295,f=_+(c<<14&4294967295|c>>>18),c=u+(_^l&(f^_))+g[4]+3889429448&4294967295,u=f+(c<<20&4294967295|c>>>12),c=l+(f^_&(u^f))+g[9]+568446438&4294967295,l=u+(c<<5&4294967295|c>>>27),c=_+(u^f&(l^u))+g[14]+3275163606&4294967295,_=l+(c<<9&4294967295|c>>>23),c=f+(l^u&(_^l))+g[3]+4107603335&4294967295,f=_+(c<<14&4294967295|c>>>18),c=u+(_^l&(f^_))+g[8]+1163531501&4294967295,u=f+(c<<20&4294967295|c>>>12),c=l+(f^_&(u^f))+g[13]+2850285829&4294967295,l=u+(c<<5&4294967295|c>>>27),c=_+(u^f&(l^u))+g[2]+4243563512&4294967295,_=l+(c<<9&4294967295|c>>>23),c=f+(l^u&(_^l))+g[7]+1735328473&4294967295,f=_+(c<<14&4294967295|c>>>18),c=u+(_^l&(f^_))+g[12]+2368359562&4294967295,u=f+(c<<20&4294967295|c>>>12),c=l+(u^f^_)+g[5]+4294588738&4294967295,l=u+(c<<4&4294967295|c>>>28),c=_+(l^u^f)+g[8]+2272392833&4294967295,_=l+(c<<11&4294967295|c>>>21),c=f+(_^l^u)+g[11]+1839030562&4294967295,f=_+(c<<16&4294967295|c>>>16),c=u+(f^_^l)+g[14]+4259657740&4294967295,u=f+(c<<23&4294967295|c>>>9),c=l+(u^f^_)+g[1]+2763975236&4294967295,l=u+(c<<4&4294967295|c>>>28),c=_+(l^u^f)+g[4]+1272893353&4294967295,_=l+(c<<11&4294967295|c>>>21),c=f+(_^l^u)+g[7]+4139469664&4294967295,f=_+(c<<16&4294967295|c>>>16),c=u+(f^_^l)+g[10]+3200236656&4294967295,u=f+(c<<23&4294967295|c>>>9),c=l+(u^f^_)+g[13]+681279174&4294967295,l=u+(c<<4&4294967295|c>>>28),c=_+(l^u^f)+g[0]+3936430074&4294967295,_=l+(c<<11&4294967295|c>>>21),c=f+(_^l^u)+g[3]+3572445317&4294967295,f=_+(c<<16&4294967295|c>>>16),c=u+(f^_^l)+g[6]+76029189&4294967295,u=f+(c<<23&4294967295|c>>>9),c=l+(u^f^_)+g[9]+3654602809&4294967295,l=u+(c<<4&4294967295|c>>>28),c=_+(l^u^f)+g[12]+3873151461&4294967295,_=l+(c<<11&4294967295|c>>>21),c=f+(_^l^u)+g[15]+530742520&4294967295,f=_+(c<<16&4294967295|c>>>16),c=u+(f^_^l)+g[2]+3299628645&4294967295,u=f+(c<<23&4294967295|c>>>9),c=l+(f^(u|~_))+g[0]+4096336452&4294967295,l=u+(c<<6&4294967295|c>>>26),c=_+(u^(l|~f))+g[7]+1126891415&4294967295,_=l+(c<<10&4294967295|c>>>22),c=f+(l^(_|~u))+g[14]+2878612391&4294967295,f=_+(c<<15&4294967295|c>>>17),c=u+(_^(f|~l))+g[5]+4237533241&4294967295,u=f+(c<<21&4294967295|c>>>11),c=l+(f^(u|~_))+g[12]+1700485571&4294967295,l=u+(c<<6&4294967295|c>>>26),c=_+(u^(l|~f))+g[3]+2399980690&4294967295,_=l+(c<<10&4294967295|c>>>22),c=f+(l^(_|~u))+g[10]+4293915773&4294967295,f=_+(c<<15&4294967295|c>>>17),c=u+(_^(f|~l))+g[1]+2240044497&4294967295,u=f+(c<<21&4294967295|c>>>11),c=l+(f^(u|~_))+g[8]+1873313359&4294967295,l=u+(c<<6&4294967295|c>>>26),c=_+(u^(l|~f))+g[15]+4264355552&4294967295,_=l+(c<<10&4294967295|c>>>22),c=f+(l^(_|~u))+g[6]+2734768916&4294967295,f=_+(c<<15&4294967295|c>>>17),c=u+(_^(f|~l))+g[13]+1309151649&4294967295,u=f+(c<<21&4294967295|c>>>11),c=l+(f^(u|~_))+g[4]+4149444226&4294967295,l=u+(c<<6&4294967295|c>>>26),c=_+(u^(l|~f))+g[11]+3174756917&4294967295,_=l+(c<<10&4294967295|c>>>22),c=f+(l^(_|~u))+g[2]+718787259&4294967295,f=_+(c<<15&4294967295|c>>>17),c=u+(_^(f|~l))+g[9]+3951481745&4294967295,p.g[0]=p.g[0]+l&4294967295,p.g[1]=p.g[1]+(f+(c<<21&4294967295|c>>>11))&4294967295,p.g[2]=p.g[2]+f&4294967295,p.g[3]=p.g[3]+_&4294967295}o.prototype.v=function(p,l){l===void 0&&(l=p.length);const u=l-this.blockSize,g=this.C;let f=this.h,_=0;for(;_<l;){if(f==0)for(;_<=u;)a(this,p,_),_+=this.blockSize;if(typeof p=="string"){for(;_<l;)if(g[f++]=p.charCodeAt(_++),f==this.blockSize){a(this,g),f=0;break}}else for(;_<l;)if(g[f++]=p[_++],f==this.blockSize){a(this,g),f=0;break}}this.h=f,this.o+=l},o.prototype.A=function(){var p=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);p[0]=128;for(var l=1;l<p.length-8;++l)p[l]=0;l=this.o*8;for(var u=p.length-8;u<p.length;++u)p[u]=l&255,l/=256;for(this.v(p),p=Array(16),l=0,u=0;u<4;++u)for(let g=0;g<32;g+=8)p[l++]=this.g[u]>>>g&255;return p};function y(p,l){var u=E;return Object.prototype.hasOwnProperty.call(u,p)?u[p]:u[p]=l(p)}function m(p,l){this.h=l;const u=[];let g=!0;for(let f=p.length-1;f>=0;f--){const _=p[f]|0;g&&_==l||(u[f]=_,g=!1)}this.g=u}var E={};function A(p){return-128<=p&&p<128?y(p,function(l){return new m([l|0],l<0?-1:0)}):new m([p|0],p<0?-1:0)}function I(p){if(isNaN(p)||!isFinite(p))return C;if(p<0)return M(I(-p));const l=[];let u=1;for(let g=0;p>=u;g++)l[g]=p/u|0,u*=4294967296;return new m(l,0)}function x(p,l){if(p.length==0)throw Error("number format error: empty string");if(l=l||10,l<2||36<l)throw Error("radix out of range: "+l);if(p.charAt(0)=="-")return M(x(p.substring(1),l));if(p.indexOf("-")>=0)throw Error('number format error: interior "-" character');const u=I(Math.pow(l,8));let g=C;for(let _=0;_<p.length;_+=8){var f=Math.min(8,p.length-_);const c=parseInt(p.substring(_,_+f),l);f<8?(f=I(Math.pow(l,f)),g=g.j(f).add(I(c))):(g=g.j(u),g=g.add(I(c)))}return g}var C=A(0),G=A(1),J=A(16777216);r=m.prototype,r.m=function(){if($(this))return-M(this).m();let p=0,l=1;for(let u=0;u<this.g.length;u++){const g=this.i(u);p+=(g>=0?g:4294967296+g)*l,l*=4294967296}return p},r.toString=function(p){if(p=p||10,p<2||36<p)throw Error("radix out of range: "+p);if(H(this))return"0";if($(this))return"-"+M(this).toString(p);const l=I(Math.pow(p,6));var u=this;let g="";for(;;){const f=Ct(u,l).g;u=bt(u,f.j(l));let _=((u.g.length>0?u.g[0]:u.h)>>>0).toString(p);if(u=f,H(u))return _+g;for(;_.length<6;)_="0"+_;g=_+g}},r.i=function(p){return p<0?0:p<this.g.length?this.g[p]:this.h};function H(p){if(p.h!=0)return!1;for(let l=0;l<p.g.length;l++)if(p.g[l]!=0)return!1;return!0}function $(p){return p.h==-1}r.l=function(p){return p=bt(this,p),$(p)?-1:H(p)?0:1};function M(p){const l=p.g.length,u=[];for(let g=0;g<l;g++)u[g]=~p.g[g];return new m(u,~p.h).add(G)}r.abs=function(){return $(this)?M(this):this},r.add=function(p){const l=Math.max(this.g.length,p.g.length),u=[];let g=0;for(let f=0;f<=l;f++){let _=g+(this.i(f)&65535)+(p.i(f)&65535),c=(_>>>16)+(this.i(f)>>>16)+(p.i(f)>>>16);g=c>>>16,_&=65535,c&=65535,u[f]=c<<16|_}return new m(u,u[u.length-1]&-2147483648?-1:0)};function bt(p,l){return p.add(M(l))}r.j=function(p){if(H(this)||H(p))return C;if($(this))return $(p)?M(this).j(M(p)):M(M(this).j(p));if($(p))return M(this.j(M(p)));if(this.l(J)<0&&p.l(J)<0)return I(this.m()*p.m());const l=this.g.length+p.g.length,u=[];for(var g=0;g<2*l;g++)u[g]=0;for(g=0;g<this.g.length;g++)for(let f=0;f<p.g.length;f++){const _=this.i(g)>>>16,c=this.i(g)&65535,z=p.i(f)>>>16,dt=p.i(f)&65535;u[2*g+2*f]+=c*dt,Dt(u,2*g+2*f),u[2*g+2*f+1]+=_*dt,Dt(u,2*g+2*f+1),u[2*g+2*f+1]+=c*z,Dt(u,2*g+2*f+1),u[2*g+2*f+2]+=_*z,Dt(u,2*g+2*f+2)}for(p=0;p<l;p++)u[p]=u[2*p+1]<<16|u[2*p];for(p=l;p<2*l;p++)u[p]=0;return new m(u,0)};function Dt(p,l){for(;(p[l]&65535)!=p[l];)p[l+1]+=p[l]>>>16,p[l]&=65535,l++}function st(p,l){this.g=p,this.h=l}function Ct(p,l){if(H(l))throw Error("division by zero");if(H(p))return new st(C,C);if($(p))return l=Ct(M(p),l),new st(M(l.g),M(l.h));if($(l))return l=Ct(p,M(l)),new st(M(l.g),l.h);if(p.g.length>30){if($(p)||$(l))throw Error("slowDivide_ only works with positive integers.");for(var u=G,g=l;g.l(p)<=0;)u=rt(u),g=rt(g);var f=W(u,1),_=W(g,1);for(g=W(g,2),u=W(u,2);!H(g);){var c=_.add(g);c.l(p)<=0&&(f=f.add(u),_=c),g=W(g,1),u=W(u,1)}return l=bt(p,f.j(l)),new st(f,l)}for(f=C;p.l(l)>=0;){for(u=Math.max(1,Math.floor(p.m()/l.m())),g=Math.ceil(Math.log(u)/Math.LN2),g=g<=48?1:Math.pow(2,g-48),_=I(u),c=_.j(l);$(c)||c.l(p)>0;)u-=g,_=I(u),c=_.j(l);H(_)&&(_=G),f=f.add(_),p=bt(p,c)}return new st(f,p)}r.B=function(p){return Ct(this,p).h},r.and=function(p){const l=Math.max(this.g.length,p.g.length),u=[];for(let g=0;g<l;g++)u[g]=this.i(g)&p.i(g);return new m(u,this.h&p.h)},r.or=function(p){const l=Math.max(this.g.length,p.g.length),u=[];for(let g=0;g<l;g++)u[g]=this.i(g)|p.i(g);return new m(u,this.h|p.h)},r.xor=function(p){const l=Math.max(this.g.length,p.g.length),u=[];for(let g=0;g<l;g++)u[g]=this.i(g)^p.i(g);return new m(u,this.h^p.h)};function rt(p){const l=p.g.length+1,u=[];for(let g=0;g<l;g++)u[g]=p.i(g)<<1|p.i(g-1)>>>31;return new m(u,p.h)}function W(p,l){const u=l>>5;l%=32;const g=p.g.length-u,f=[];for(let _=0;_<g;_++)f[_]=l>0?p.i(_+u)>>>l|p.i(_+u+1)<<32-l:p.i(_+u);return new m(f,p.h)}o.prototype.digest=o.prototype.A,o.prototype.reset=o.prototype.u,o.prototype.update=o.prototype.v,m.prototype.add=m.prototype.add,m.prototype.multiply=m.prototype.j,m.prototype.modulo=m.prototype.B,m.prototype.compare=m.prototype.l,m.prototype.toNumber=m.prototype.m,m.prototype.toString=m.prototype.toString,m.prototype.getBits=m.prototype.i,m.fromNumber=I,m.fromString=x,gn=m}).apply(typeof Ci<"u"?Ci:typeof self<"u"?self:typeof window<"u"?window:{});var ve=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var r,e=Object.defineProperty;function i(t){t=[typeof globalThis=="object"&&globalThis,t,typeof window=="object"&&window,typeof self=="object"&&self,typeof ve=="object"&&ve];for(var n=0;n<t.length;++n){var s=t[n];if(s&&s.Math==Math)return s}throw Error("Cannot find global object")}var o=i(this);function a(t,n){if(n)t:{var s=o;t=t.split(".");for(var h=0;h<t.length-1;h++){var d=t[h];if(!(d in s))break t;s=s[d]}t=t[t.length-1],h=s[t],n=n(h),n!=h&&n!=null&&e(s,t,{configurable:!0,writable:!0,value:n})}}a("Symbol.dispose",function(t){return t||Symbol("Symbol.dispose")}),a("Array.prototype.values",function(t){return t||function(){return this[Symbol.iterator]()}}),a("Object.entries",function(t){return t||function(n){var s=[],h;for(h in n)Object.prototype.hasOwnProperty.call(n,h)&&s.push([h,n[h]]);return s}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var y=y||{},m=this||self;function E(t){var n=typeof t;return n=="object"&&t!=null||n=="function"}function A(t,n,s){return t.call.apply(t.bind,arguments)}function I(t,n,s){return I=A,I.apply(null,arguments)}function x(t,n){var s=Array.prototype.slice.call(arguments,1);return function(){var h=s.slice();return h.push.apply(h,arguments),t.apply(this,h)}}function C(t,n){function s(){}s.prototype=n.prototype,t.Z=n.prototype,t.prototype=new s,t.prototype.constructor=t,t.Ob=function(h,d,v){for(var w=Array(arguments.length-2),S=2;S<arguments.length;S++)w[S-2]=arguments[S];return n.prototype[d].apply(h,w)}}var G=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?t=>t&&AsyncContext.Snapshot.wrap(t):t=>t;function J(t){const n=t.length;if(n>0){const s=Array(n);for(let h=0;h<n;h++)s[h]=t[h];return s}return[]}function H(t,n){for(let h=1;h<arguments.length;h++){const d=arguments[h];var s=typeof d;if(s=s!="object"?s:d?Array.isArray(d)?"array":s:"null",s=="array"||s=="object"&&typeof d.length=="number"){s=t.length||0;const v=d.length||0;t.length=s+v;for(let w=0;w<v;w++)t[s+w]=d[w]}else t.push(d)}}class ${constructor(n,s){this.i=n,this.j=s,this.h=0,this.g=null}get(){let n;return this.h>0?(this.h--,n=this.g,this.g=n.next,n.next=null):n=this.i(),n}}function M(t){m.setTimeout(()=>{throw t},0)}function bt(){var t=p;let n=null;return t.g&&(n=t.g,t.g=t.g.next,t.g||(t.h=null),n.next=null),n}class Dt{constructor(){this.h=this.g=null}add(n,s){const h=st.get();h.set(n,s),this.h?this.h.next=h:this.g=h,this.h=h}}var st=new $(()=>new Ct,t=>t.reset());class Ct{constructor(){this.next=this.g=this.h=null}set(n,s){this.h=n,this.g=s,this.next=null}reset(){this.next=this.g=this.h=null}}let rt,W=!1,p=new Dt,l=()=>{const t=Promise.resolve(void 0);rt=()=>{t.then(u)}};function u(){for(var t;t=bt();){try{t.h.call(t.g)}catch(s){M(s)}var n=st;n.j(t),n.h<100&&(n.h++,t.next=n.g,n.g=t)}W=!1}function g(){this.u=this.u,this.C=this.C}g.prototype.u=!1,g.prototype.dispose=function(){this.u||(this.u=!0,this.N())},g.prototype[Symbol.dispose]=function(){this.dispose()},g.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function f(t,n){this.type=t,this.g=this.target=n,this.defaultPrevented=!1}f.prototype.h=function(){this.defaultPrevented=!0};var _=(function(){if(!m.addEventListener||!Object.defineProperty)return!1;var t=!1,n=Object.defineProperty({},"passive",{get:function(){t=!0}});try{const s=()=>{};m.addEventListener("test",s,n),m.removeEventListener("test",s,n)}catch{}return t})();function c(t){return/^[\s\xa0]*$/.test(t)}function z(t,n){f.call(this,t?t.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,t&&this.init(t,n)}C(z,f),z.prototype.init=function(t,n){const s=this.type=t.type,h=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:null;this.target=t.target||t.srcElement,this.g=n,n=t.relatedTarget,n||(s=="mouseover"?n=t.fromElement:s=="mouseout"&&(n=t.toElement)),this.relatedTarget=n,h?(this.clientX=h.clientX!==void 0?h.clientX:h.pageX,this.clientY=h.clientY!==void 0?h.clientY:h.pageY,this.screenX=h.screenX||0,this.screenY=h.screenY||0):(this.clientX=t.clientX!==void 0?t.clientX:t.pageX,this.clientY=t.clientY!==void 0?t.clientY:t.pageY,this.screenX=t.screenX||0,this.screenY=t.screenY||0),this.button=t.button,this.key=t.key||"",this.ctrlKey=t.ctrlKey,this.altKey=t.altKey,this.shiftKey=t.shiftKey,this.metaKey=t.metaKey,this.pointerId=t.pointerId||0,this.pointerType=t.pointerType,this.state=t.state,this.i=t,t.defaultPrevented&&z.Z.h.call(this)},z.prototype.h=function(){z.Z.h.call(this);const t=this.i;t.preventDefault?t.preventDefault():t.returnValue=!1};var dt="closure_listenable_"+(Math.random()*1e6|0),as=0;function ls(t,n,s,h,d){this.listener=t,this.proxy=null,this.src=n,this.type=s,this.capture=!!h,this.ha=d,this.key=++as,this.da=this.fa=!1}function he(t){t.da=!0,t.listener=null,t.proxy=null,t.src=null,t.ha=null}function ae(t,n,s){for(const h in t)n.call(s,t[h],h,t)}function cs(t,n){for(const s in t)n.call(void 0,t[s],s,t)}function vn(t){const n={};for(const s in t)n[s]=t[s];return n}const wn="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function En(t,n){let s,h;for(let d=1;d<arguments.length;d++){h=arguments[d];for(s in h)t[s]=h[s];for(let v=0;v<wn.length;v++)s=wn[v],Object.prototype.hasOwnProperty.call(h,s)&&(t[s]=h[s])}}function le(t){this.src=t,this.g={},this.h=0}le.prototype.add=function(t,n,s,h,d){const v=t.toString();t=this.g[v],t||(t=this.g[v]=[],this.h++);const w=Ce(t,n,h,d);return w>-1?(n=t[w],s||(n.fa=!1)):(n=new ls(n,this.src,v,!!h,d),n.fa=s,t.push(n)),n};function De(t,n){const s=n.type;if(s in t.g){var h=t.g[s],d=Array.prototype.indexOf.call(h,n,void 0),v;(v=d>=0)&&Array.prototype.splice.call(h,d,1),v&&(he(n),t.g[s].length==0&&(delete t.g[s],t.h--))}}function Ce(t,n,s,h){for(let d=0;d<t.length;++d){const v=t[d];if(!v.da&&v.listener==n&&v.capture==!!s&&v.ha==h)return d}return-1}var Re="closure_lm_"+(Math.random()*1e6|0),Pe={};function An(t,n,s,h,d){if(Array.isArray(n)){for(let v=0;v<n.length;v++)An(t,n[v],s,h,d);return null}return s=Tn(s),t&&t[dt]?t.J(n,s,E(h)?!!h.capture:!1,d):us(t,n,s,!1,h,d)}function us(t,n,s,h,d,v){if(!n)throw Error("Invalid event type");const w=E(d)?!!d.capture:!!d;let S=Oe(t);if(S||(t[Re]=S=new le(t)),s=S.add(n,s,h,w,v),s.proxy)return s;if(h=fs(),s.proxy=h,h.src=t,h.listener=s,t.addEventListener)_||(d=w),d===void 0&&(d=!1),t.addEventListener(n.toString(),h,d);else if(t.attachEvent)t.attachEvent(Sn(n.toString()),h);else if(t.addListener&&t.removeListener)t.addListener(h);else throw Error("addEventListener and attachEvent are unavailable.");return s}function fs(){function t(s){return n.call(t.src,t.listener,s)}const n=ps;return t}function In(t,n,s,h,d){if(Array.isArray(n))for(var v=0;v<n.length;v++)In(t,n[v],s,h,d);else h=E(h)?!!h.capture:!!h,s=Tn(s),t&&t[dt]?(t=t.i,v=String(n).toString(),v in t.g&&(n=t.g[v],s=Ce(n,s,h,d),s>-1&&(he(n[s]),Array.prototype.splice.call(n,s,1),n.length==0&&(delete t.g[v],t.h--)))):t&&(t=Oe(t))&&(n=t.g[n.toString()],t=-1,n&&(t=Ce(n,s,h,d)),(s=t>-1?n[t]:null)&&Ne(s))}function Ne(t){if(typeof t!="number"&&t&&!t.da){var n=t.src;if(n&&n[dt])De(n.i,t);else{var s=t.type,h=t.proxy;n.removeEventListener?n.removeEventListener(s,h,t.capture):n.detachEvent?n.detachEvent(Sn(s),h):n.addListener&&n.removeListener&&n.removeListener(h),(s=Oe(n))?(De(s,t),s.h==0&&(s.src=null,n[Re]=null)):he(t)}}}function Sn(t){return t in Pe?Pe[t]:Pe[t]="on"+t}function ps(t,n){if(t.da)t=!0;else{n=new z(n,this);const s=t.listener,h=t.ha||t.src;t.fa&&Ne(t),t=s.call(h,n)}return t}function Oe(t){return t=t[Re],t instanceof le?t:null}var ke="__closure_events_fn_"+(Math.random()*1e9>>>0);function Tn(t){return typeof t=="function"?t:(t[ke]||(t[ke]=function(n){return t.handleEvent(n)}),t[ke])}function V(){g.call(this),this.i=new le(this),this.M=this,this.G=null}C(V,g),V.prototype[dt]=!0,V.prototype.removeEventListener=function(t,n,s,h){In(this,t,n,s,h)};function B(t,n){var s,h=t.G;if(h)for(s=[];h;h=h.G)s.push(h);if(t=t.M,h=n.type||n,typeof n=="string")n=new f(n,t);else if(n instanceof f)n.target=n.target||t;else{var d=n;n=new f(h,t),En(n,d)}d=!0;let v,w;if(s)for(w=s.length-1;w>=0;w--)v=n.g=s[w],d=ce(v,h,!0,n)&&d;if(v=n.g=t,d=ce(v,h,!0,n)&&d,d=ce(v,h,!1,n)&&d,s)for(w=0;w<s.length;w++)v=n.g=s[w],d=ce(v,h,!1,n)&&d}V.prototype.N=function(){if(V.Z.N.call(this),this.i){var t=this.i;for(const n in t.g){const s=t.g[n];for(let h=0;h<s.length;h++)he(s[h]);delete t.g[n],t.h--}}this.G=null},V.prototype.J=function(t,n,s,h){return this.i.add(String(t),n,!1,s,h)},V.prototype.K=function(t,n,s,h){return this.i.add(String(t),n,!0,s,h)};function ce(t,n,s,h){if(n=t.i.g[String(n)],!n)return!0;n=n.concat();let d=!0;for(let v=0;v<n.length;++v){const w=n[v];if(w&&!w.da&&w.capture==s){const S=w.listener,L=w.ha||w.src;w.fa&&De(t.i,w),d=S.call(L,h)!==!1&&d}}return d&&!h.defaultPrevented}function gs(t,n){if(typeof t!="function")if(t&&typeof t.handleEvent=="function")t=I(t.handleEvent,t);else throw Error("Invalid listener argument");return Number(n)>2147483647?-1:m.setTimeout(t,n||0)}function bn(t){t.g=gs(()=>{t.g=null,t.i&&(t.i=!1,bn(t))},t.l);const n=t.h;t.h=null,t.m.apply(null,n)}class ds extends g{constructor(n,s){super(),this.m=n,this.l=s,this.h=null,this.i=!1,this.g=null}j(n){this.h=arguments,this.g?this.i=!0:bn(this)}N(){super.N(),this.g&&(m.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function xt(t){g.call(this),this.h=t,this.g={}}C(xt,g);var Dn=[];function Cn(t){ae(t.g,function(n,s){this.g.hasOwnProperty(s)&&Ne(n)},t),t.g={}}xt.prototype.N=function(){xt.Z.N.call(this),Cn(this)},xt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Me=m.JSON.stringify,ms=m.JSON.parse,ys=class{stringify(t){return m.JSON.stringify(t,void 0)}parse(t){return m.JSON.parse(t,void 0)}};function Rn(){}function _s(){}var Vt={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Le(){f.call(this,"d")}C(Le,f);function je(){f.call(this,"c")}C(je,f);var Rt={},Pn=null;function xe(){return Pn=Pn||new V}Rt.Ia="serverreachability";function Nn(t){f.call(this,Rt.Ia,t)}C(Nn,f);function Bt(t){const n=xe();B(n,new Nn(n))}Rt.STAT_EVENT="statevent";function On(t,n){f.call(this,Rt.STAT_EVENT,t),this.stat=n}C(On,f);function F(t){const n=xe();B(n,new On(n,t))}Rt.Ja="timingevent";function kn(t,n){f.call(this,Rt.Ja,t),this.size=n}C(kn,f);function Ft(t,n){if(typeof t!="function")throw Error("Fn must not be null and must be a function");return m.setTimeout(function(){t()},n)}function Ut(){this.g=!0}Ut.prototype.ua=function(){this.g=!1};function vs(t,n,s,h,d,v){t.info(function(){if(t.g)if(v){var w="",S=v.split("&");for(let P=0;P<S.length;P++){var L=S[P].split("=");if(L.length>1){const j=L[0];L=L[1];const Q=j.split("_");w=Q.length>=2&&Q[1]=="type"?w+(j+"="+L+"&"):w+(j+"=redacted&")}}}else w=null;else w=v;return"XMLHTTP REQ ("+h+") [attempt "+d+"]: "+n+`
`+s+`
`+w})}function ws(t,n,s,h,d,v,w){t.info(function(){return"XMLHTTP RESP ("+h+") [ attempt "+d+"]: "+n+`
`+s+`
`+v+" "+w})}function Pt(t,n,s,h){t.info(function(){return"XMLHTTP TEXT ("+n+"): "+As(t,s)+(h?" "+h:"")})}function Es(t,n){t.info(function(){return"TIMEOUT: "+n})}Ut.prototype.info=function(){};function As(t,n){if(!t.g)return n;if(!n)return null;try{const v=JSON.parse(n);if(v){for(t=0;t<v.length;t++)if(Array.isArray(v[t])){var s=v[t];if(!(s.length<2)){var h=s[1];if(Array.isArray(h)&&!(h.length<1)){var d=h[0];if(d!="noop"&&d!="stop"&&d!="close")for(let w=1;w<h.length;w++)h[w]=""}}}}return Me(v)}catch{return n}}var Ve={NO_ERROR:0,TIMEOUT:8},Is={},Mn;function Be(){}C(Be,Rn),Be.prototype.g=function(){return new XMLHttpRequest},Mn=new Be;function Ht(t){return encodeURIComponent(String(t))}function Ss(t){var n=1;t=t.split(":");const s=[];for(;n>0&&t.length;)s.push(t.shift()),n--;return t.length&&s.push(t.join(":")),s}function ot(t,n,s,h){this.j=t,this.i=n,this.l=s,this.S=h||1,this.V=new xt(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Ln}function Ln(){this.i=null,this.g="",this.h=!1}var jn={},Fe={};function Ue(t,n,s){t.M=1,t.A=fe(Y(n)),t.u=s,t.R=!0,xn(t,null)}function xn(t,n){t.F=Date.now(),ue(t),t.B=Y(t.A);var s=t.B,h=t.S;Array.isArray(h)||(h=[String(h)]),Kn(s.i,"t",h),t.C=0,s=t.j.L,t.h=new Ln,t.g=gi(t.j,s?n:null,!t.u),t.P>0&&(t.O=new ds(I(t.Y,t,t.g),t.P)),n=t.V,s=t.g,h=t.ba;var d="readystatechange";Array.isArray(d)||(d&&(Dn[0]=d.toString()),d=Dn);for(let v=0;v<d.length;v++){const w=An(s,d[v],h||n.handleEvent,!1,n.h||n);if(!w)break;n.g[w.key]=w}n=t.J?vn(t.J):{},t.u?(t.v||(t.v="POST"),n["Content-Type"]="application/x-www-form-urlencoded",t.g.ea(t.B,t.v,t.u,n)):(t.v="GET",t.g.ea(t.B,t.v,null,n)),Bt(),vs(t.i,t.v,t.B,t.l,t.S,t.u)}ot.prototype.ba=function(t){t=t.target;const n=this.O;n&&lt(t)==3?n.j():this.Y(t)},ot.prototype.Y=function(t){try{if(t==this.g)t:{const S=lt(this.g),L=this.g.ya(),P=this.g.ca();if(!(S<3)&&(S!=3||this.g&&(this.h.h||this.g.la()||ii(this.g)))){this.K||S!=4||L==7||(L==8||P<=0?Bt(3):Bt(2)),He(this);var n=this.g.ca();this.X=n;var s=Ts(this);if(this.o=n==200,ws(this.i,this.v,this.B,this.l,this.S,S,n),this.o){if(this.U&&!this.L){e:{if(this.g){var h,d=this.g;if((h=d.g?d.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!c(h)){var v=h;break e}}v=null}if(t=v)Pt(this.i,this.l,t,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,$e(this,t);else{this.o=!1,this.m=3,F(12),mt(this),$t(this);break t}}if(this.R){t=!0;let j;for(;!this.K&&this.C<s.length;)if(j=bs(this,s),j==Fe){S==4&&(this.m=4,F(14),t=!1),Pt(this.i,this.l,null,"[Incomplete Response]");break}else if(j==jn){this.m=4,F(15),Pt(this.i,this.l,s,"[Invalid Chunk]"),t=!1;break}else Pt(this.i,this.l,j,null),$e(this,j);if(Vn(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),S!=4||s.length!=0||this.h.h||(this.m=1,F(16),t=!1),this.o=this.o&&t,!t)Pt(this.i,this.l,s,"[Invalid Chunked Response]"),mt(this),$t(this);else if(s.length>0&&!this.W){this.W=!0;var w=this.j;w.g==this&&w.aa&&!w.P&&(w.j.info("Great, no buffering proxy detected. Bytes received: "+s.length),Ye(w),w.P=!0,F(11))}}else Pt(this.i,this.l,s,null),$e(this,s);S==4&&mt(this),this.o&&!this.K&&(S==4?ci(this.j,this):(this.o=!1,ue(this)))}else Fs(this.g),n==400&&s.indexOf("Unknown SID")>0?(this.m=3,F(12)):(this.m=0,F(13)),mt(this),$t(this)}}}catch{}finally{}};function Ts(t){if(!Vn(t))return t.g.la();const n=ii(t.g);if(n==="")return"";let s="";const h=n.length,d=lt(t.g)==4;if(!t.h.i){if(typeof TextDecoder>"u")return mt(t),$t(t),"";t.h.i=new m.TextDecoder}for(let v=0;v<h;v++)t.h.h=!0,s+=t.h.i.decode(n[v],{stream:!(d&&v==h-1)});return n.length=0,t.h.g+=s,t.C=0,t.h.g}function Vn(t){return t.g?t.v=="GET"&&t.M!=2&&t.j.Aa:!1}function bs(t,n){var s=t.C,h=n.indexOf(`
`,s);return h==-1?Fe:(s=Number(n.substring(s,h)),isNaN(s)?jn:(h+=1,h+s>n.length?Fe:(n=n.slice(h,h+s),t.C=h+s,n)))}ot.prototype.cancel=function(){this.K=!0,mt(this)};function ue(t){t.T=Date.now()+t.H,Bn(t,t.H)}function Bn(t,n){if(t.D!=null)throw Error("WatchDog timer not null");t.D=Ft(I(t.aa,t),n)}function He(t){t.D&&(m.clearTimeout(t.D),t.D=null)}ot.prototype.aa=function(){this.D=null;const t=Date.now();t-this.T>=0?(Es(this.i,this.B),this.M!=2&&(Bt(),F(17)),mt(this),this.m=2,$t(this)):Bn(this,this.T-t)};function $t(t){t.j.I==0||t.K||ci(t.j,t)}function mt(t){He(t);var n=t.O;n&&typeof n.dispose=="function"&&n.dispose(),t.O=null,Cn(t.V),t.g&&(n=t.g,t.g=null,n.abort(),n.dispose())}function $e(t,n){try{var s=t.j;if(s.I!=0&&(s.g==t||ze(s.h,t))){if(!t.L&&ze(s.h,t)&&s.I==3){try{var h=s.Ba.g.parse(n)}catch{h=null}if(Array.isArray(h)&&h.length==3){var d=h;if(d[0]==0){t:if(!s.v){if(s.g)if(s.g.F+3e3<t.F)ye(s),de(s);else break t;Ke(s),F(18)}}else s.xa=d[1],0<s.xa-s.K&&d[2]<37500&&s.F&&s.A==0&&!s.C&&(s.C=Ft(I(s.Va,s),6e3));Hn(s.h)<=1&&s.ta&&(s.ta=void 0)}else _t(s,11)}else if((t.L||s.g==t)&&ye(s),!c(n))for(d=s.Ba.g.parse(n),n=0;n<d.length;n++){let P=d[n];const j=P[0];if(!(j<=s.K))if(s.K=j,P=P[1],s.I==2)if(P[0]=="c"){s.M=P[1],s.ba=P[2];const Q=P[3];Q!=null&&(s.ka=Q,s.j.info("VER="+s.ka));const vt=P[4];vt!=null&&(s.za=vt,s.j.info("SVER="+s.za));const ct=P[5];ct!=null&&typeof ct=="number"&&ct>0&&(h=1.5*ct,s.O=h,s.j.info("backChannelRequestTimeoutMs_="+h)),h=s;const ut=t.g;if(ut){const _e=ut.g?ut.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(_e){var v=h.h;v.g||_e.indexOf("spdy")==-1&&_e.indexOf("quic")==-1&&_e.indexOf("h2")==-1||(v.j=v.l,v.g=new Set,v.h&&(Ge(v,v.h),v.h=null))}if(h.G){const Qe=ut.g?ut.g.getResponseHeader("X-HTTP-Session-Id"):null;Qe&&(h.wa=Qe,N(h.J,h.G,Qe))}}s.I=3,s.l&&s.l.ra(),s.aa&&(s.T=Date.now()-t.F,s.j.info("Handshake RTT: "+s.T+"ms")),h=s;var w=t;if(h.na=pi(h,h.L?h.ba:null,h.W),w.L){$n(h.h,w);var S=w,L=h.O;L&&(S.H=L),S.D&&(He(S),ue(S)),h.g=w}else ai(h);s.i.length>0&&me(s)}else P[0]!="stop"&&P[0]!="close"||_t(s,7);else s.I==3&&(P[0]=="stop"||P[0]=="close"?P[0]=="stop"?_t(s,7):Xe(s):P[0]!="noop"&&s.l&&s.l.qa(P),s.A=0)}}Bt(4)}catch{}}var Ds=class{constructor(t,n){this.g=t,this.map=n}};function Fn(t){this.l=t||10,m.PerformanceNavigationTiming?(t=m.performance.getEntriesByType("navigation"),t=t.length>0&&(t[0].nextHopProtocol=="hq"||t[0].nextHopProtocol=="h2")):t=!!(m.chrome&&m.chrome.loadTimes&&m.chrome.loadTimes()&&m.chrome.loadTimes().wasFetchedViaSpdy),this.j=t?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Un(t){return t.h?!0:t.g?t.g.size>=t.j:!1}function Hn(t){return t.h?1:t.g?t.g.size:0}function ze(t,n){return t.h?t.h==n:t.g?t.g.has(n):!1}function Ge(t,n){t.g?t.g.add(n):t.h=n}function $n(t,n){t.h&&t.h==n?t.h=null:t.g&&t.g.has(n)&&t.g.delete(n)}Fn.prototype.cancel=function(){if(this.i=zn(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const t of this.g.values())t.cancel();this.g.clear()}};function zn(t){if(t.h!=null)return t.i.concat(t.h.G);if(t.g!=null&&t.g.size!==0){let n=t.i;for(const s of t.g.values())n=n.concat(s.G);return n}return J(t.i)}var Gn=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Cs(t,n){if(t){t=t.split("&");for(let s=0;s<t.length;s++){const h=t[s].indexOf("=");let d,v=null;h>=0?(d=t[s].substring(0,h),v=t[s].substring(h+1)):d=t[s],n(d,v?decodeURIComponent(v.replace(/\+/g," ")):"")}}}function ht(t){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let n;t instanceof ht?(this.l=t.l,zt(this,t.j),this.o=t.o,this.g=t.g,Gt(this,t.u),this.h=t.h,We(this,Yn(t.i)),this.m=t.m):t&&(n=String(t).match(Gn))?(this.l=!1,zt(this,n[1]||"",!0),this.o=Wt(n[2]||""),this.g=Wt(n[3]||"",!0),Gt(this,n[4]),this.h=Wt(n[5]||"",!0),We(this,n[6]||"",!0),this.m=Wt(n[7]||"")):(this.l=!1,this.i=new Jt(null,this.l))}ht.prototype.toString=function(){const t=[];var n=this.j;n&&t.push(qt(n,Wn,!0),":");var s=this.g;return(s||n=="file")&&(t.push("//"),(n=this.o)&&t.push(qt(n,Wn,!0),"@"),t.push(Ht(s).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),s=this.u,s!=null&&t.push(":",String(s))),(s=this.h)&&(this.g&&s.charAt(0)!="/"&&t.push("/"),t.push(qt(s,s.charAt(0)=="/"?Ns:Ps,!0))),(s=this.i.toString())&&t.push("?",s),(s=this.m)&&t.push("#",qt(s,ks)),t.join("")},ht.prototype.resolve=function(t){const n=Y(this);let s=!!t.j;s?zt(n,t.j):s=!!t.o,s?n.o=t.o:s=!!t.g,s?n.g=t.g:s=t.u!=null;var h=t.h;if(s)Gt(n,t.u);else if(s=!!t.h){if(h.charAt(0)!="/")if(this.g&&!this.h)h="/"+h;else{var d=n.h.lastIndexOf("/");d!=-1&&(h=n.h.slice(0,d+1)+h)}if(d=h,d==".."||d==".")h="";else if(d.indexOf("./")!=-1||d.indexOf("/.")!=-1){h=d.lastIndexOf("/",0)==0,d=d.split("/");const v=[];for(let w=0;w<d.length;){const S=d[w++];S=="."?h&&w==d.length&&v.push(""):S==".."?((v.length>1||v.length==1&&v[0]!="")&&v.pop(),h&&w==d.length&&v.push("")):(v.push(S),h=!0)}h=v.join("/")}else h=d}return s?n.h=h:s=t.i.toString()!=="",s?We(n,Yn(t.i)):s=!!t.m,s&&(n.m=t.m),n};function Y(t){return new ht(t)}function zt(t,n,s){t.j=s?Wt(n,!0):n,t.j&&(t.j=t.j.replace(/:$/,""))}function Gt(t,n){if(n){if(n=Number(n),isNaN(n)||n<0)throw Error("Bad port number "+n);t.u=n}else t.u=null}function We(t,n,s){n instanceof Jt?(t.i=n,Ms(t.i,t.l)):(s||(n=qt(n,Os)),t.i=new Jt(n,t.l))}function N(t,n,s){t.i.set(n,s)}function fe(t){return N(t,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),t}function Wt(t,n){return t?n?decodeURI(t.replace(/%25/g,"%2525")):decodeURIComponent(t):""}function qt(t,n,s){return typeof t=="string"?(t=encodeURI(t).replace(n,Rs),s&&(t=t.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),t):null}function Rs(t){return t=t.charCodeAt(0),"%"+(t>>4&15).toString(16)+(t&15).toString(16)}var Wn=/[#\/\?@]/g,Ps=/[#\?:]/g,Ns=/[#\?]/g,Os=/[#\?@]/g,ks=/#/g;function Jt(t,n){this.h=this.g=null,this.i=t||null,this.j=!!n}function yt(t){t.g||(t.g=new Map,t.h=0,t.i&&Cs(t.i,function(n,s){t.add(decodeURIComponent(n.replace(/\+/g," ")),s)}))}r=Jt.prototype,r.add=function(t,n){yt(this),this.i=null,t=Nt(this,t);let s=this.g.get(t);return s||this.g.set(t,s=[]),s.push(n),this.h+=1,this};function qn(t,n){yt(t),n=Nt(t,n),t.g.has(n)&&(t.i=null,t.h-=t.g.get(n).length,t.g.delete(n))}function Jn(t,n){return yt(t),n=Nt(t,n),t.g.has(n)}r.forEach=function(t,n){yt(this),this.g.forEach(function(s,h){s.forEach(function(d){t.call(n,d,h,this)},this)},this)};function Xn(t,n){yt(t);let s=[];if(typeof n=="string")Jn(t,n)&&(s=s.concat(t.g.get(Nt(t,n))));else for(t=Array.from(t.g.values()),n=0;n<t.length;n++)s=s.concat(t[n]);return s}r.set=function(t,n){return yt(this),this.i=null,t=Nt(this,t),Jn(this,t)&&(this.h-=this.g.get(t).length),this.g.set(t,[n]),this.h+=1,this},r.get=function(t,n){return t?(t=Xn(this,t),t.length>0?String(t[0]):n):n};function Kn(t,n,s){qn(t,n),s.length>0&&(t.i=null,t.g.set(Nt(t,n),J(s)),t.h+=s.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const t=[],n=Array.from(this.g.keys());for(let h=0;h<n.length;h++){var s=n[h];const d=Ht(s);s=Xn(this,s);for(let v=0;v<s.length;v++){let w=d;s[v]!==""&&(w+="="+Ht(s[v])),t.push(w)}}return this.i=t.join("&")};function Yn(t){const n=new Jt;return n.i=t.i,t.g&&(n.g=new Map(t.g),n.h=t.h),n}function Nt(t,n){return n=String(n),t.j&&(n=n.toLowerCase()),n}function Ms(t,n){n&&!t.j&&(yt(t),t.i=null,t.g.forEach(function(s,h){const d=h.toLowerCase();h!=d&&(qn(this,h),Kn(this,d,s))},t)),t.j=n}function Ls(t,n){const s=new Ut;if(m.Image){const h=new Image;h.onload=x(at,s,"TestLoadImage: loaded",!0,n,h),h.onerror=x(at,s,"TestLoadImage: error",!1,n,h),h.onabort=x(at,s,"TestLoadImage: abort",!1,n,h),h.ontimeout=x(at,s,"TestLoadImage: timeout",!1,n,h),m.setTimeout(function(){h.ontimeout&&h.ontimeout()},1e4),h.src=t}else n(!1)}function js(t,n){const s=new Ut,h=new AbortController,d=setTimeout(()=>{h.abort(),at(s,"TestPingServer: timeout",!1,n)},1e4);fetch(t,{signal:h.signal}).then(v=>{clearTimeout(d),v.ok?at(s,"TestPingServer: ok",!0,n):at(s,"TestPingServer: server error",!1,n)}).catch(()=>{clearTimeout(d),at(s,"TestPingServer: error",!1,n)})}function at(t,n,s,h,d){try{d&&(d.onload=null,d.onerror=null,d.onabort=null,d.ontimeout=null),h(s)}catch{}}function xs(){this.g=new ys}function qe(t){this.i=t.Sb||null,this.h=t.ab||!1}C(qe,Rn),qe.prototype.g=function(){return new pe(this.i,this.h)};function pe(t,n){V.call(this),this.H=t,this.o=n,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}C(pe,V),r=pe.prototype,r.open=function(t,n){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=t,this.D=n,this.readyState=1,Kt(this)},r.send=function(t){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const n={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};t&&(n.body=t),(this.H||m).fetch(new Request(this.D,n)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Xt(this)),this.readyState=0},r.Pa=function(t){if(this.g&&(this.l=t,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=t.headers,this.readyState=2,Kt(this)),this.g&&(this.readyState=3,Kt(this),this.g)))if(this.responseType==="arraybuffer")t.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof m.ReadableStream<"u"&&"body"in t){if(this.j=t.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Qn(this)}else t.text().then(this.Oa.bind(this),this.ga.bind(this))};function Qn(t){t.j.read().then(t.Ma.bind(t)).catch(t.ga.bind(t))}r.Ma=function(t){if(this.g){if(this.o&&t.value)this.response.push(t.value);else if(!this.o){var n=t.value?t.value:new Uint8Array(0);(n=this.B.decode(n,{stream:!t.done}))&&(this.response=this.responseText+=n)}t.done?Xt(this):Kt(this),this.readyState==3&&Qn(this)}},r.Oa=function(t){this.g&&(this.response=this.responseText=t,Xt(this))},r.Na=function(t){this.g&&(this.response=t,Xt(this))},r.ga=function(){this.g&&Xt(this)};function Xt(t){t.readyState=4,t.l=null,t.j=null,t.B=null,Kt(t)}r.setRequestHeader=function(t,n){this.A.append(t,n)},r.getResponseHeader=function(t){return this.h&&this.h.get(t.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const t=[],n=this.h.entries();for(var s=n.next();!s.done;)s=s.value,t.push(s[0]+": "+s[1]),s=n.next();return t.join(`\r
`)};function Kt(t){t.onreadystatechange&&t.onreadystatechange.call(t)}Object.defineProperty(pe.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(t){this.m=t?"include":"same-origin"}});function Zn(t){let n="";return ae(t,function(s,h){n+=h,n+=":",n+=s,n+=`\r
`}),n}function Je(t,n,s){t:{for(h in s){var h=!1;break t}h=!0}h||(s=Zn(s),typeof t=="string"?s!=null&&Ht(s):N(t,n,s))}function O(t){V.call(this),this.headers=new Map,this.L=t||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}C(O,V);var Vs=/^https?$/i,Bs=["POST","PUT"];r=O.prototype,r.Fa=function(t){this.H=t},r.ea=function(t,n,s,h){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+t);n=n?n.toUpperCase():"GET",this.D=t,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Mn.g(),this.g.onreadystatechange=G(I(this.Ca,this));try{this.B=!0,this.g.open(n,String(t),!0),this.B=!1}catch(v){ti(this,v);return}if(t=s||"",s=new Map(this.headers),h)if(Object.getPrototypeOf(h)===Object.prototype)for(var d in h)s.set(d,h[d]);else if(typeof h.keys=="function"&&typeof h.get=="function")for(const v of h.keys())s.set(v,h.get(v));else throw Error("Unknown input type for opt_headers: "+String(h));h=Array.from(s.keys()).find(v=>v.toLowerCase()=="content-type"),d=m.FormData&&t instanceof m.FormData,!(Array.prototype.indexOf.call(Bs,n,void 0)>=0)||h||d||s.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[v,w]of s)this.g.setRequestHeader(v,w);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(t),this.v=!1}catch(v){ti(this,v)}};function ti(t,n){t.h=!1,t.g&&(t.j=!0,t.g.abort(),t.j=!1),t.l=n,t.o=5,ei(t),ge(t)}function ei(t){t.A||(t.A=!0,B(t,"complete"),B(t,"error"))}r.abort=function(t){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=t||7,B(this,"complete"),B(this,"abort"),ge(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ge(this,!0)),O.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?ni(this):this.Xa())},r.Xa=function(){ni(this)};function ni(t){if(t.h&&typeof y<"u"){if(t.v&&lt(t)==4)setTimeout(t.Ca.bind(t),0);else if(B(t,"readystatechange"),lt(t)==4){t.h=!1;try{const v=t.ca();t:switch(v){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var n=!0;break t;default:n=!1}var s;if(!(s=n)){var h;if(h=v===0){let w=String(t.D).match(Gn)[1]||null;!w&&m.self&&m.self.location&&(w=m.self.location.protocol.slice(0,-1)),h=!Vs.test(w?w.toLowerCase():"")}s=h}if(s)B(t,"complete"),B(t,"success");else{t.o=6;try{var d=lt(t)>2?t.g.statusText:""}catch{d=""}t.l=d+" ["+t.ca()+"]",ei(t)}}finally{ge(t)}}}}function ge(t,n){if(t.g){t.m&&(clearTimeout(t.m),t.m=null);const s=t.g;t.g=null,n||B(t,"ready");try{s.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function lt(t){return t.g?t.g.readyState:0}r.ca=function(){try{return lt(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(t){if(this.g){var n=this.g.responseText;return t&&n.indexOf(t)==0&&(n=n.substring(t.length)),ms(n)}};function ii(t){try{if(!t.g)return null;if("response"in t.g)return t.g.response;switch(t.F){case"":case"text":return t.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in t.g)return t.g.mozResponseArrayBuffer}return null}catch{return null}}function Fs(t){const n={};t=(t.g&&lt(t)>=2&&t.g.getAllResponseHeaders()||"").split(`\r
`);for(let h=0;h<t.length;h++){if(c(t[h]))continue;var s=Ss(t[h]);const d=s[0];if(s=s[1],typeof s!="string")continue;s=s.trim();const v=n[d]||[];n[d]=v,v.push(s)}cs(n,function(h){return h.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Yt(t,n,s){return s&&s.internalChannelParams&&s.internalChannelParams[t]||n}function si(t){this.za=0,this.i=[],this.j=new Ut,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Yt("failFast",!1,t),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Yt("baseRetryDelayMs",5e3,t),this.Za=Yt("retryDelaySeedMs",1e4,t),this.Ta=Yt("forwardChannelMaxRetries",2,t),this.va=Yt("forwardChannelRequestTimeoutMs",2e4,t),this.ma=t&&t.xmlHttpFactory||void 0,this.Ua=t&&t.Rb||void 0,this.Aa=t&&t.useFetchStreams||!1,this.O=void 0,this.L=t&&t.supportsCrossDomainXhr||!1,this.M="",this.h=new Fn(t&&t.concurrentRequestLimit),this.Ba=new xs,this.S=t&&t.fastHandshake||!1,this.R=t&&t.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=t&&t.Pb||!1,t&&t.ua&&this.j.ua(),t&&t.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&t&&t.detectBufferingProxy||!1,this.ia=void 0,t&&t.longPollingTimeout&&t.longPollingTimeout>0&&(this.ia=t.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=si.prototype,r.ka=8,r.I=1,r.connect=function(t,n,s,h){F(0),this.W=t,this.H=n||{},s&&h!==void 0&&(this.H.OSID=s,this.H.OAID=h),this.F=this.X,this.J=pi(this,null,this.W),me(this)};function Xe(t){if(ri(t),t.I==3){var n=t.V++,s=Y(t.J);if(N(s,"SID",t.M),N(s,"RID",n),N(s,"TYPE","terminate"),Qt(t,s),n=new ot(t,t.j,n),n.M=2,n.A=fe(Y(s)),s=!1,m.navigator&&m.navigator.sendBeacon)try{s=m.navigator.sendBeacon(n.A.toString(),"")}catch{}!s&&m.Image&&(new Image().src=n.A,s=!0),s||(n.g=gi(n.j,null),n.g.ea(n.A)),n.F=Date.now(),ue(n)}fi(t)}function de(t){t.g&&(Ye(t),t.g.cancel(),t.g=null)}function ri(t){de(t),t.v&&(m.clearTimeout(t.v),t.v=null),ye(t),t.h.cancel(),t.m&&(typeof t.m=="number"&&m.clearTimeout(t.m),t.m=null)}function me(t){if(!Un(t.h)&&!t.m){t.m=!0;var n=t.Ea;rt||l(),W||(rt(),W=!0),p.add(n,t),t.D=0}}function Us(t,n){return Hn(t.h)>=t.h.j-(t.m?1:0)?!1:t.m?(t.i=n.G.concat(t.i),!0):t.I==1||t.I==2||t.D>=(t.Sa?0:t.Ta)?!1:(t.m=Ft(I(t.Ea,t,n),ui(t,t.D)),t.D++,!0)}r.Ea=function(t){if(this.m)if(this.m=null,this.I==1){if(!t){this.V=Math.floor(Math.random()*1e5),t=this.V++;const d=new ot(this,this.j,t);let v=this.o;if(this.U&&(v?(v=vn(v),En(v,this.U)):v=this.U),this.u!==null||this.R||(d.J=v,v=null),this.S)t:{for(var n=0,s=0;s<this.i.length;s++){e:{var h=this.i[s];if("__data__"in h.map&&(h=h.map.__data__,typeof h=="string")){h=h.length;break e}h=void 0}if(h===void 0)break;if(n+=h,n>4096){n=s;break t}if(n===4096||s===this.i.length-1){n=s+1;break t}}n=1e3}else n=1e3;n=hi(this,d,n),s=Y(this.J),N(s,"RID",t),N(s,"CVER",22),this.G&&N(s,"X-HTTP-Session-Id",this.G),Qt(this,s),v&&(this.R?n="headers="+Ht(Zn(v))+"&"+n:this.u&&Je(s,this.u,v)),Ge(this.h,d),this.Ra&&N(s,"TYPE","init"),this.S?(N(s,"$req",n),N(s,"SID","null"),d.U=!0,Ue(d,s,null)):Ue(d,s,n),this.I=2}}else this.I==3&&(t?oi(this,t):this.i.length==0||Un(this.h)||oi(this))};function oi(t,n){var s;n?s=n.l:s=t.V++;const h=Y(t.J);N(h,"SID",t.M),N(h,"RID",s),N(h,"AID",t.K),Qt(t,h),t.u&&t.o&&Je(h,t.u,t.o),s=new ot(t,t.j,s,t.D+1),t.u===null&&(s.J=t.o),n&&(t.i=n.G.concat(t.i)),n=hi(t,s,1e3),s.H=Math.round(t.va*.5)+Math.round(t.va*.5*Math.random()),Ge(t.h,s),Ue(s,h,n)}function Qt(t,n){t.H&&ae(t.H,function(s,h){N(n,h,s)}),t.l&&ae({},function(s,h){N(n,h,s)})}function hi(t,n,s){s=Math.min(t.i.length,s);const h=t.l?I(t.l.Ka,t.l,t):null;t:{var d=t.i;let S=-1;for(;;){const L=["count="+s];S==-1?s>0?(S=d[0].g,L.push("ofs="+S)):S=0:L.push("ofs="+S);let P=!0;for(let j=0;j<s;j++){var v=d[j].g;const Q=d[j].map;if(v-=S,v<0)S=Math.max(0,d[j].g-100),P=!1;else try{v="req"+v+"_"||"";try{var w=Q instanceof Map?Q:Object.entries(Q);for(const[vt,ct]of w){let ut=ct;E(ct)&&(ut=Me(ct)),L.push(v+vt+"="+encodeURIComponent(ut))}}catch(vt){throw L.push(v+"type="+encodeURIComponent("_badmap")),vt}}catch{h&&h(Q)}}if(P){w=L.join("&");break t}}w=void 0}return t=t.i.splice(0,s),n.G=t,w}function ai(t){if(!t.g&&!t.v){t.Y=1;var n=t.Da;rt||l(),W||(rt(),W=!0),p.add(n,t),t.A=0}}function Ke(t){return t.g||t.v||t.A>=3?!1:(t.Y++,t.v=Ft(I(t.Da,t),ui(t,t.A)),t.A++,!0)}r.Da=function(){if(this.v=null,li(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var t=4*this.T;this.j.info("BP detection timer enabled: "+t),this.B=Ft(I(this.Wa,this),t)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,F(10),de(this),li(this))};function Ye(t){t.B!=null&&(m.clearTimeout(t.B),t.B=null)}function li(t){t.g=new ot(t,t.j,"rpc",t.Y),t.u===null&&(t.g.J=t.o),t.g.P=0;var n=Y(t.na);N(n,"RID","rpc"),N(n,"SID",t.M),N(n,"AID",t.K),N(n,"CI",t.F?"0":"1"),!t.F&&t.ia&&N(n,"TO",t.ia),N(n,"TYPE","xmlhttp"),Qt(t,n),t.u&&t.o&&Je(n,t.u,t.o),t.O&&(t.g.H=t.O);var s=t.g;t=t.ba,s.M=1,s.A=fe(Y(n)),s.u=null,s.R=!0,xn(s,t)}r.Va=function(){this.C!=null&&(this.C=null,de(this),Ke(this),F(19))};function ye(t){t.C!=null&&(m.clearTimeout(t.C),t.C=null)}function ci(t,n){var s=null;if(t.g==n){ye(t),Ye(t),t.g=null;var h=2}else if(ze(t.h,n))s=n.G,$n(t.h,n),h=1;else return;if(t.I!=0){if(n.o)if(h==1){s=n.u?n.u.length:0,n=Date.now()-n.F;var d=t.D;h=xe(),B(h,new kn(h,s)),me(t)}else ai(t);else if(d=n.m,d==3||d==0&&n.X>0||!(h==1&&Us(t,n)||h==2&&Ke(t)))switch(s&&s.length>0&&(n=t.h,n.i=n.i.concat(s)),d){case 1:_t(t,5);break;case 4:_t(t,10);break;case 3:_t(t,6);break;default:_t(t,2)}}}function ui(t,n){let s=t.Qa+Math.floor(Math.random()*t.Za);return t.isActive()||(s*=2),s*n}function _t(t,n){if(t.j.info("Error code "+n),n==2){var s=I(t.bb,t),h=t.Ua;const d=!h;h=new ht(h||"//www.google.com/images/cleardot.gif"),m.location&&m.location.protocol=="http"||zt(h,"https"),fe(h),d?Ls(h.toString(),s):js(h.toString(),s)}else F(2);t.I=0,t.l&&t.l.pa(n),fi(t),ri(t)}r.bb=function(t){t?(this.j.info("Successfully pinged google.com"),F(2)):(this.j.info("Failed to ping google.com"),F(1))};function fi(t){if(t.I=0,t.ja=[],t.l){const n=zn(t.h);(n.length!=0||t.i.length!=0)&&(H(t.ja,n),H(t.ja,t.i),t.h.i.length=0,J(t.i),t.i.length=0),t.l.oa()}}function pi(t,n,s){var h=s instanceof ht?Y(s):new ht(s);if(h.g!="")n&&(h.g=n+"."+h.g),Gt(h,h.u);else{var d=m.location;h=d.protocol,n=n?n+"."+d.hostname:d.hostname,d=+d.port;const v=new ht(null);h&&zt(v,h),n&&(v.g=n),d&&Gt(v,d),s&&(v.h=s),h=v}return s=t.G,n=t.wa,s&&n&&N(h,s,n),N(h,"VER",t.ka),Qt(t,h),h}function gi(t,n,s){if(n&&!t.L)throw Error("Can't create secondary domain capable XhrIo object.");return n=t.Aa&&!t.ma?new O(new qe({ab:s})):new O(t.ma),n.Fa(t.L),n}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function di(){}r=di.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function q(t,n){V.call(this),this.g=new si(n),this.l=t,this.h=n&&n.messageUrlParams||null,t=n&&n.messageHeaders||null,n&&n.clientProtocolHeaderRequired&&(t?t["X-Client-Protocol"]="webchannel":t={"X-Client-Protocol":"webchannel"}),this.g.o=t,t=n&&n.initMessageHeaders||null,n&&n.messageContentType&&(t?t["X-WebChannel-Content-Type"]=n.messageContentType:t={"X-WebChannel-Content-Type":n.messageContentType}),n&&n.sa&&(t?t["X-WebChannel-Client-Profile"]=n.sa:t={"X-WebChannel-Client-Profile":n.sa}),this.g.U=t,(t=n&&n.Qb)&&!c(t)&&(this.g.u=t),this.A=n&&n.supportsCrossDomainXhr||!1,this.v=n&&n.sendRawJson||!1,(n=n&&n.httpSessionIdParam)&&!c(n)&&(this.g.G=n,t=this.h,t!==null&&n in t&&(t=this.h,n in t&&delete t[n])),this.j=new Ot(this)}C(q,V),q.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},q.prototype.close=function(){Xe(this.g)},q.prototype.o=function(t){var n=this.g;if(typeof t=="string"){var s={};s.__data__=t,t=s}else this.v&&(s={},s.__data__=Me(t),t=s);n.i.push(new Ds(n.Ya++,t)),n.I==3&&me(n)},q.prototype.N=function(){this.g.l=null,delete this.j,Xe(this.g),delete this.g,q.Z.N.call(this)};function mi(t){Le.call(this),t.__headers__&&(this.headers=t.__headers__,this.statusCode=t.__status__,delete t.__headers__,delete t.__status__);var n=t.__sm__;if(n){t:{for(const s in n){t=s;break t}t=void 0}(this.i=t)&&(t=this.i,n=n!==null&&t in n?n[t]:void 0),this.data=n}else this.data=t}C(mi,Le);function yi(){je.call(this),this.status=1}C(yi,je);function Ot(t){this.g=t}C(Ot,di),Ot.prototype.ra=function(){B(this.g,"a")},Ot.prototype.qa=function(t){B(this.g,new mi(t))},Ot.prototype.pa=function(t){B(this.g,new yi)},Ot.prototype.oa=function(){B(this.g,"b")},q.prototype.send=q.prototype.o,q.prototype.open=q.prototype.m,q.prototype.close=q.prototype.close,Ve.NO_ERROR=0,Ve.TIMEOUT=8,Ve.HTTP_ERROR=6,Is.COMPLETE="complete",_s.EventType=Vt,Vt.OPEN="a",Vt.CLOSE="b",Vt.ERROR="c",Vt.MESSAGE="d",V.prototype.listen=V.prototype.J,O.prototype.listenOnce=O.prototype.K,O.prototype.getLastError=O.prototype.Ha,O.prototype.getLastErrorCode=O.prototype.ya,O.prototype.getStatus=O.prototype.ca,O.prototype.getResponseJson=O.prototype.La,O.prototype.getResponseText=O.prototype.la,O.prototype.send=O.prototype.ea,O.prototype.setWithCredentials=O.prototype.Fa}).apply(typeof ve<"u"?ve:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}U.UNAUTHENTICATED=new U(null),U.GOOGLE_CREDENTIALS=new U("google-credentials-uid"),U.FIRST_PARTY=new U("first-party-uid"),U.MOCK_USER=new U("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let re="12.12.0";function To(r){re=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lt=new Xi("@firebase/firestore");function K(r,...e){if(Lt.logLevel<=R.DEBUG){const i=e.map(dn);Lt.debug(`Firestore (${re}): ${r}`,...i)}}function ts(r,...e){if(Lt.logLevel<=R.ERROR){const i=e.map(dn);Lt.error(`Firestore (${re}): ${r}`,...i)}}function bo(r,...e){if(Lt.logLevel<=R.WARN){const i=e.map(dn);Lt.warn(`Firestore (${re}): ${r}`,...i)}}function dn(r){if(typeof r=="string")return r;try{return(function(i){return JSON.stringify(i)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function se(r,e,i){let o="Unexpected state";typeof e=="string"?o=e:i=e,es(r,o,i)}function es(r,e,i){let o=`FIRESTORE (${re}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(i!==void 0)try{o+=" CONTEXT: "+JSON.stringify(i)}catch{o+=" CONTEXT: "+i}throw ts(o),new Error(o)}function Zt(r,e,i,o){let a="Unexpected state";typeof i=="string"?a=i:o=i,r||es(e,a,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class D extends jt{constructor(e,i){super(e,i),this.code=e,this.message=i,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(){this.promise=new Promise(((e,i)=>{this.resolve=e,this.reject=i}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(e,i){this.user=i,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Do{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,i){e.enqueueRetryable((()=>i(U.UNAUTHENTICATED)))}shutdown(){}}class Co{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,i){this.changeListener=i,e.enqueueRetryable((()=>i(this.token.user)))}shutdown(){this.changeListener=null}}class Ro{constructor(e){this.t=e,this.currentUser=U.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,i){Zt(this.o===void 0,42304);let o=this.i;const a=A=>this.i!==o?(o=this.i,i(A)):Promise.resolve();let y=new te;this.o=()=>{this.i++,this.currentUser=this.u(),y.resolve(),y=new te,e.enqueueRetryable((()=>a(this.currentUser)))};const m=()=>{const A=y;e.enqueueRetryable((async()=>{await A.promise,await a(this.currentUser)}))},E=A=>{K("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=A,this.o&&(this.auth.addAuthTokenListener(this.o),m())};this.t.onInit((A=>E(A))),setTimeout((()=>{if(!this.auth){const A=this.t.getImmediate({optional:!0});A?E(A):(K("FirebaseAuthCredentialsProvider","Auth not yet detected"),y.resolve(),y=new te)}}),0),m()}getToken(){const e=this.i,i=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(i).then((o=>this.i!==e?(K("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):o?(Zt(typeof o.accessToken=="string",31837,{l:o}),new ns(o.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Zt(e===null||typeof e=="string",2055,{h:e}),new U(e)}}class Po{constructor(e,i,o){this.P=e,this.T=i,this.I=o,this.type="FirstParty",this.user=U.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class No{constructor(e,i,o){this.P=e,this.T=i,this.I=o}getToken(){return Promise.resolve(new Po(this.P,this.T,this.I))}start(e,i){e.enqueueRetryable((()=>i(U.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Ri{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Oo{constructor(e,i){this.V=i,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,oo(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,i){Zt(this.o===void 0,3512);const o=y=>{y.error!=null&&K("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${y.error.message}`);const m=y.token!==this.m;return this.m=y.token,K("FirebaseAppCheckTokenProvider",`Received ${m?"new":"existing"} token.`),m?i(y.token):Promise.resolve()};this.o=y=>{e.enqueueRetryable((()=>o(y)))};const a=y=>{K("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=y,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((y=>a(y))),setTimeout((()=>{if(!this.appCheck){const y=this.V.getImmediate({optional:!0});y?a(y):K("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Ri(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((i=>i?(Zt(typeof i.token=="string",44558,{tokenResult:i}),this.m=i.token,new Ri(i.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ko(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),i=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(i);else for(let o=0;o<r;o++)i[o]=Math.floor(256*Math.random());return i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mo{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",i=62*Math.floor(4.129032258064516);let o="";for(;o.length<20;){const a=ko(40);for(let y=0;y<a.length;++y)o.length<20&&a[y]<i&&(o+=e.charAt(a[y]%62))}return o}}function gt(r,e){return r<e?-1:r>e?1:0}function Lo(r,e){const i=Math.min(r.length,e.length);for(let o=0;o<i;o++){const a=r.charAt(o),y=e.charAt(o);if(a!==y)return sn(a)===sn(y)?gt(a,y):sn(a)?1:-1}return gt(r.length,e.length)}const jo=55296,xo=57343;function sn(r){const e=r.charCodeAt(0);return e>=jo&&e<=xo}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pi="__name__";class Z{constructor(e,i,o){i===void 0?i=0:i>e.length&&se(637,{offset:i,range:e.length}),o===void 0?o=e.length-i:o>e.length-i&&se(1746,{length:o,range:e.length-i}),this.segments=e,this.offset=i,this.len=o}get length(){return this.len}isEqual(e){return Z.comparator(this,e)===0}child(e){const i=this.segments.slice(this.offset,this.limit());return e instanceof Z?e.forEach((o=>{i.push(o)})):i.push(e),this.construct(i)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let i=0;i<this.length;i++)if(this.get(i)!==e.get(i))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let i=0;i<this.length;i++)if(this.get(i)!==e.get(i))return!1;return!0}forEach(e){for(let i=this.offset,o=this.limit();i<o;i++)e(this.segments[i])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,i){const o=Math.min(e.length,i.length);for(let a=0;a<o;a++){const y=Z.compareSegments(e.get(a),i.get(a));if(y!==0)return y}return gt(e.length,i.length)}static compareSegments(e,i){const o=Z.isNumericId(e),a=Z.isNumericId(i);return o&&!a?-1:!o&&a?1:o&&a?Z.extractNumericId(e).compare(Z.extractNumericId(i)):Lo(e,i)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return gn.fromString(e.substring(4,e.length-2))}}class X extends Z{construct(e,i,o){return new X(e,i,o)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const i=[];for(const o of e){if(o.indexOf("//")>=0)throw new D(b.INVALID_ARGUMENT,`Invalid segment (${o}). Paths must not contain // in them.`);i.push(...o.split("/").filter((a=>a.length>0)))}return new X(i)}static emptyPath(){return new X([])}}const Vo=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Et extends Z{construct(e,i,o){return new Et(e,i,o)}static isValidIdentifier(e){return Vo.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Et.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Pi}static keyField(){return new Et([Pi])}static fromServerFormat(e){const i=[];let o="",a=0;const y=()=>{if(o.length===0)throw new D(b.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);i.push(o),o=""};let m=!1;for(;a<e.length;){const E=e[a];if(E==="\\"){if(a+1===e.length)throw new D(b.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const A=e[a+1];if(A!=="\\"&&A!=="."&&A!=="`")throw new D(b.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);o+=A,a+=2}else E==="`"?(m=!m,a++):E!=="."||m?(o+=E,a++):(y(),a++)}if(y(),m)throw new D(b.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Et(i)}static emptyPath(){return new Et([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e){this.path=e}static fromPath(e){return new At(X.fromString(e))}static fromName(e){return new At(X.fromString(e).popFirst(5))}static empty(){return new At(X.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&X.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,i){return X.comparator(e.path,i.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new At(new X(e.slice()))}}function Bo(r,e,i,o){if(e===!0&&o===!0)throw new D(b.INVALID_ARGUMENT,`${r} and ${i} cannot be used together.`)}function Fo(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function Uo(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(o){return o.constructor?o.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":se(12329,{type:typeof r})}function Ho(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new D(b.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const i=Uo(r);throw new D(b.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${i}`)}}return r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function k(r,e){const i={typeString:r};return e&&(i.value=e),i}function oe(r,e){if(!Fo(r))throw new D(b.INVALID_ARGUMENT,"JSON must be an object");let i;for(const o in e)if(e[o]){const a=e[o].typeString,y="value"in e[o]?{value:e[o].value}:void 0;if(!(o in r)){i=`JSON missing required field: '${o}'`;break}const m=r[o];if(a&&typeof m!==a){i=`JSON field '${o}' must be a ${a}.`;break}if(y!==void 0&&m!==y.value){i=`Expected '${o}' field to equal '${y.value}'`;break}}if(i)throw new D(b.INVALID_ARGUMENT,i);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ni=-62135596800,Oi=1e6;class tt{static now(){return tt.fromMillis(Date.now())}static fromDate(e){return tt.fromMillis(e.getTime())}static fromMillis(e){const i=Math.floor(e/1e3),o=Math.floor((e-1e3*i)*Oi);return new tt(i,o)}constructor(e,i){if(this.seconds=e,this.nanoseconds=i,i<0)throw new D(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+i);if(i>=1e9)throw new D(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+i);if(e<Ni)throw new D(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new D(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Oi}_compareTo(e){return this.seconds===e.seconds?gt(this.nanoseconds,e.nanoseconds):gt(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:tt._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(oe(e,tt._jsonSchema))return new tt(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Ni;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}tt._jsonSchemaVersion="firestore/timestamp/1.0",tt._jsonSchema={type:k("string",tt._jsonSchemaVersion),seconds:k("number"),nanoseconds:k("number")};function $o(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zo extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e){this.binaryString=e}static fromBase64String(e){const i=(function(a){try{return atob(a)}catch(y){throw typeof DOMException<"u"&&y instanceof DOMException?new zo("Invalid base64 string: "+y):y}})(e);return new Tt(i)}static fromUint8Array(e){const i=(function(a){let y="";for(let m=0;m<a.length;++m)y+=String.fromCharCode(a[m]);return y})(e);return new Tt(i)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(i){return btoa(i)})(this.binaryString)}toUint8Array(){return(function(i){const o=new Uint8Array(i.length);for(let a=0;a<i.length;a++)o[a]=i.charCodeAt(a);return o})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return gt(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Tt.EMPTY_BYTE_STRING=new Tt("");const un="(default)";class be{constructor(e,i){this.projectId=e,this.database=i||un}static empty(){return new be("","")}get isDefaultDatabase(){return this.database===un}isEqual(e){return e instanceof be&&e.projectId===this.projectId&&e.database===this.database}}function Go(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new D(b.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new be(r.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wo{constructor(e,i=null,o=[],a=[],y=null,m="F",E=null,A=null){this.path=e,this.collectionGroup=i,this.explicitOrderBy=o,this.filters=a,this.limit=y,this.limitType=m,this.startAt=E,this.endAt=A,this.Ee=null,this.Ie=null,this.Re=null,this.startAt,this.endAt}}function qo(r){return new Wo(r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ki,T;(T=ki||(ki={}))[T.OK=0]="OK",T[T.CANCELLED=1]="CANCELLED",T[T.UNKNOWN=2]="UNKNOWN",T[T.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",T[T.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",T[T.NOT_FOUND=5]="NOT_FOUND",T[T.ALREADY_EXISTS=6]="ALREADY_EXISTS",T[T.PERMISSION_DENIED=7]="PERMISSION_DENIED",T[T.UNAUTHENTICATED=16]="UNAUTHENTICATED",T[T.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",T[T.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",T[T.ABORTED=10]="ABORTED",T[T.OUT_OF_RANGE=11]="OUT_OF_RANGE",T[T.UNIMPLEMENTED=12]="UNIMPLEMENTED",T[T.INTERNAL=13]="INTERNAL",T[T.UNAVAILABLE=14]="UNAVAILABLE",T[T.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new gn([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jo=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xo=1048576;function rn(){return typeof document<"u"?document:null}class Ko{constructor(e,i,o=1e3,a=1.5,y=6e4){this.Ci=e,this.timerId=i,this.R_=o,this.A_=a,this.V_=y,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const i=Math.floor(this.d_+this.y_()),o=Math.max(0,Date.now()-this.f_),a=Math.max(0,i-o);a>0&&K("ExponentialBackoff",`Backing off for ${a} ms (base delay: ${this.d_} ms, delay with jitter: ${i} ms, last attempt: ${o} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,a,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mn{constructor(e,i,o,a,y){this.asyncQueue=e,this.timerId=i,this.targetTimeMs=o,this.op=a,this.removalCallback=y,this.deferred=new te,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((m=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,i,o,a,y){const m=Date.now()+o,E=new mn(e,i,m,a,y);return E.start(o),E}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new D(b.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var Mi,Li;(Li=Mi||(Mi={})).Ma="default",Li.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yo(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qo="ComponentProvider",ji=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const is="firestore.googleapis.com",xi=!0;class Vi{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new D(b.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=is,this.ssl=xi}else this.host=e.host,this.ssl=e.ssl??xi;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Jo;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Xo)throw new D(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Bo("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Yo(e.experimentalLongPollingOptions??{}),(function(o){if(o.timeoutSeconds!==void 0){if(isNaN(o.timeoutSeconds))throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);if(o.timeoutSeconds<5)throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);if(o.timeoutSeconds>30)throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(o,a){return o.timeoutSeconds===a.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ss{constructor(e,i,o,a){this._authCredentials=e,this._appCheckCredentials=i,this._databaseId=o,this._app=a,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Vi({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new D(b.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new D(b.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Vi(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(o){if(!o)return new Do;switch(o.type){case"firstParty":return new No(o.sessionIndex||"0",o.iamToken||null,o.authTokenFactory||null);case"provider":return o.client;default:throw new D(b.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(i){const o=ji.get(i);o&&(K(Qo,"Removing Datastore"),ji.delete(i),o.terminate())})(this),Promise.resolve()}}function Zo(r,e,i,o={}){var I;r=Ho(r,ss);const a=hr(e),y=r._getSettings(),m={...y,emulatorOptions:r._getEmulatorOptions()},E=`${e}:${i}`;a&&ar(`https://${E}`),y.host!==is&&y.host!==E&&bo("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const A={...y,host:E,ssl:a,emulatorOptions:o};if(!Ie(A,m)&&(r._setSettings(A),o.mockUserToken)){let x,C;if(typeof o.mockUserToken=="string")x=o.mockUserToken,C=U.MOCK_USER;else{x=tr(o.mockUserToken,(I=r._app)==null?void 0:I.options.projectId);const G=o.mockUserToken.sub||o.mockUserToken.user_id;if(!G)throw new D(b.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");C=new U(G)}r._authCredentials=new Co(new ns(x,C))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn{constructor(e,i,o){this.converter=i,this._query=o,this.type="query",this.firestore=e}withConverter(e){return new yn(this.firestore,e,this._query)}}class et{constructor(e,i,o){this.converter=i,this._key=o,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new _n(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new et(this.firestore,e,this._key)}toJSON(){return{type:et._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,i,o){if(oe(i,et._jsonSchema))return new et(e,o||null,new At(X.fromString(i.referencePath)))}}et._jsonSchemaVersion="firestore/documentReference/1.0",et._jsonSchema={type:k("string",et._jsonSchemaVersion),referencePath:k("string")};class _n extends yn{constructor(e,i,o){super(e,i,qo(o)),this._path=o,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new et(this.firestore,null,new At(e))}withConverter(e){return new _n(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bi="AsyncQueue";class Fi{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Ko(this,"async_queue_retry"),this._c=()=>{const o=rn();o&&K(Bi,"Visibility state changed to "+o.visibilityState),this.M_.w_()},this.ac=e;const i=rn();i&&typeof i.addEventListener=="function"&&i.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const i=rn();i&&typeof i.removeEventListener=="function"&&i.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const i=new te;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(i.resolve,i.reject),i.promise))).then((()=>i.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Yu.push(e),this.lc())))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!$o(e))throw e;K(Bi,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const i=this.ac.then((()=>(this.rc=!0,e().catch((o=>{throw this.nc=o,this.rc=!1,ts("INTERNAL UNHANDLED ERROR: ",Ui(o)),o})).then((o=>(this.rc=!1,o))))));return this.ac=i,i}enqueueAfterDelay(e,i,o){this.uc(),this.oc.indexOf(e)>-1&&(i=0);const a=mn.createAndSchedule(this,e,i,o,(y=>this.hc(y)));return this.tc.push(a),a}uc(){this.nc&&se(47125,{Pc:Ui(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ec(e){for(const i of this.tc)if(i.timerId===e)return!0;return!1}Ic(e){return this.Tc().then((()=>{this.tc.sort(((i,o)=>i.targetTimeMs-o.targetTimeMs));for(const i of this.tc)if(i.skipDelay(),e!=="all"&&i.timerId===e)break;return this.Tc()}))}Rc(e){this.oc.push(e)}hc(e){const i=this.tc.indexOf(e);this.tc.splice(i,1)}}function Ui(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class th extends ss{constructor(e,i,o,a){super(e,i,o,a),this.type="firestore",this._queue=new Fi,this._persistenceKey=(a==null?void 0:a.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Fi(e),this._firestoreClient=void 0,await e}}}function rh(r,e){const i=typeof r=="object"?r:uo(),o=typeof r=="string"?r:e||un,a=ro(i,"firestore").getImmediate({identifier:o});if(!a._initialized){const y=Qs("firestore");y&&Zo(a,...y)}return a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new nt(Tt.fromBase64String(e))}catch(i){throw new D(b.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+i)}}static fromUint8Array(e){return new nt(Tt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:nt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(oe(e,nt._jsonSchema))return nt.fromBase64String(e.bytes)}}nt._jsonSchemaVersion="firestore/bytes/1.0",nt._jsonSchema={type:k("string",nt._jsonSchemaVersion),bytes:k("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(...e){for(let i=0;i<e.length;++i)if(e[i].length===0)throw new D(b.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Et(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(e,i){if(!isFinite(e)||e<-90||e>90)throw new D(b.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(i)||i<-180||i>180)throw new D(b.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+i);this._lat=e,this._long=i}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return gt(this._lat,e._lat)||gt(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:It._jsonSchemaVersion}}static fromJSON(e){if(oe(e,It._jsonSchema))return new It(e.latitude,e.longitude)}}It._jsonSchemaVersion="firestore/geoPoint/1.0",It._jsonSchema={type:k("string",It._jsonSchemaVersion),latitude:k("number"),longitude:k("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e){this._values=(e||[]).map((i=>i))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(o,a){if(o.length!==a.length)return!1;for(let y=0;y<o.length;++y)if(o[y]!==a[y])return!1;return!0})(this._values,e._values)}toJSON(){return{type:St._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(oe(e,St._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((i=>typeof i=="number")))return new St(e.vectorValues);throw new D(b.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}St._jsonSchemaVersion="firestore/vectorValue/1.0",St._jsonSchema={type:k("string",St._jsonSchemaVersion),vectorValues:k("object")};function os(r,e,i){if((e=or(e))instanceof rs)return e._internalPath;if(typeof e=="string")return nh(r,e);throw fn("Field path arguments must be of type string or ",r)}const eh=new RegExp("[~\\*/\\[\\]]");function nh(r,e,i){if(e.search(eh)>=0)throw fn(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r);try{return new rs(...e.split("."))._internalPath}catch{throw fn(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r)}}function fn(r,e,i,o,a){let y=`Function ${e}() called with invalid data`;y+=". ";let m="";return new D(b.INVALID_ARGUMENT,y+r+m)}const Hi="@firebase/firestore",$i="4.14.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs{constructor(e,i,o,a,y){this._firestore=e,this._userDataWriter=i,this._key=o,this._document=a,this._converter=y}get id(){return this._key.path.lastSegment()}get ref(){return new et(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new ih(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const i=this._document.data.field(os("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i)}}}class ih extends hs{data(){return super.data()}}class we{constructor(e,i){this.hasPendingWrites=e,this.fromCache=i}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Mt extends hs{constructor(e,i,o,a,y,m){super(e,i,o,a,m),this._firestore=e,this._firestoreImpl=e,this.metadata=y}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const i=new Ee(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(i,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,i={}){if(this._document){const o=this._document.data.field(os("DocumentSnapshot.get",e));if(o!==null)return this._userDataWriter.convertValue(o,i.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new D(b.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,i={};return i.type=Mt._jsonSchemaVersion,i.bundle="",i.bundleSource="DocumentSnapshot",i.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?i:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),i.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),i)}}Mt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Mt._jsonSchema={type:k("string",Mt._jsonSchemaVersion),bundleSource:k("string","DocumentSnapshot"),bundleName:k("string"),bundle:k("string")};class Ee extends Mt{data(e={}){return super.data(e)}}class ee{constructor(e,i,o,a){this._firestore=e,this._userDataWriter=i,this._snapshot=a,this.metadata=new we(a.hasPendingWrites,a.fromCache),this.query=o}get docs(){const e=[];return this.forEach((i=>e.push(i))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,i){this._snapshot.docs.forEach((o=>{e.call(i,new Ee(this._firestore,this._userDataWriter,o.key,o,new we(this._snapshot.mutatedKeys.has(o.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const i=!!e.includeMetadataChanges;if(i&&this._snapshot.excludesMetadataChanges)throw new D(b.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===i||(this._cachedChanges=(function(a,y){if(a._snapshot.oldDocs.isEmpty()){let m=0;return a._snapshot.docChanges.map((E=>{const A=new Ee(a._firestore,a._userDataWriter,E.doc.key,E.doc,new we(a._snapshot.mutatedKeys.has(E.doc.key),a._snapshot.fromCache),a.query.converter);return E.doc,{type:"added",doc:A,oldIndex:-1,newIndex:m++}}))}{let m=a._snapshot.oldDocs;return a._snapshot.docChanges.filter((E=>y||E.type!==3)).map((E=>{const A=new Ee(a._firestore,a._userDataWriter,E.doc.key,E.doc,new we(a._snapshot.mutatedKeys.has(E.doc.key),a._snapshot.fromCache),a.query.converter);let I=-1,x=-1;return E.type!==0&&(I=m.indexOf(E.doc.key),m=m.delete(E.doc.key)),E.type!==1&&(m=m.add(E.doc),x=m.indexOf(E.doc.key)),{type:sh(E.type),doc:A,oldIndex:I,newIndex:x}}))}})(this,i),this._cachedChangesIncludeMetadataChanges=i),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new D(b.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=ee._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Mo.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const i=[],o=[],a=[];return this.docs.forEach((y=>{y._document!==null&&(i.push(y._document),o.push(this._userDataWriter.convertObjectMap(y._document.data.value.mapValue.fields,"previous")),a.push(y.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function sh(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return se(61501,{type:r})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ee._jsonSchemaVersion="firestore/querySnapshot/1.0",ee._jsonSchema={type:k("string",ee._jsonSchemaVersion),bundleSource:k("string","QuerySnapshot"),bundleName:k("string"),bundle:k("string")};(function(e,i=!0){To(lo),Te(new ne("firestore",((o,{instanceIdentifier:a,options:y})=>{const m=o.getProvider("app").getImmediate(),E=new th(new Ro(o.getProvider("auth-internal")),new Oo(m,o.getProvider("app-check-internal")),Go(m,a),m);return y={useFetchStreams:i,...y},E._setSettings(y),E}),"PUBLIC").setMultipleInstances(!0)),kt(Hi,$i,e),kt(Hi,$i,"esm2020")})();export{ne as C,jt as F,ro as _,Qs as a,uo as b,Te as c,oo as d,co as e,rh as f,or as g,hr as i,ar as p,kt as r};
