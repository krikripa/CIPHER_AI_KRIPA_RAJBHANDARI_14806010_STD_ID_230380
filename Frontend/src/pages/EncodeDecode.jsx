import React, { useState } from "react";
import { useHistory } from "../auth/HistoryContext.jsx";
import CryptoJS from "crypto-js";

const encodersDecoders = {
  Base64: {
    encode: (text) => btoa(unescape(encodeURIComponent(text))),
    decode: (text) => { try { return decodeURIComponent(escape(atob(text))); } catch { return null; } }
  },
  Hex: {
    encode: (text) => text.split("").map(c => c.charCodeAt(0).toString(16).padStart(2,"0")).join(""),
    decode: (text) => { try { const clean=text.replace(/\s+/g,""); if(!/^[0-9a-fA-F]+$/.test(clean)||clean.length%2!==0) return null; return clean.match(/.{1,2}/g).map(h=>String.fromCharCode(parseInt(h,16))).join(""); } catch { return null; } }
  },
  Binary: {
    encode: (text) => text.split("").map(c=>c.charCodeAt(0).toString(2).padStart(8,"0")).join(" "),
    decode: (text) => { try { const clean = text.replace(/[^01]/g,""); if(clean.length%8!==0) return null; return clean.match(/.{1,8}/g).map(b=>String.fromCharCode(parseInt(b,2))).join(""); } catch { return null; } }
  },
  ROT13: {
    encode: (text) => text.replace(/[a-zA-Z]/g,c=>String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26)),
    decode: (text) => text.replace(/[a-zA-Z]/g,c=>String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26))
  },
  ROT47: {
    encode: (text) => text.replace(/[\x21-\x7E]/g,c=>String.fromCharCode(33+((c.charCodeAt(0)-33+47)%94))),
    decode: (text) => text.replace(/[\x21-\x7E]/g,c=>String.fromCharCode(33+((c.charCodeAt(0)-33+47)%94)))
  },
  URL: {
    encode: (text) => encodeURIComponent(text),
    decode: (text) => { try { return decodeURIComponent(text); } catch { return null; } }
  },
  "HTML Entity": {
    encode: (text) => text.replace(/[\u00A0-\u9999<>\&]/gim,i=>"&#"+i.charCodeAt(0)+";"),
    decode: (text) => { try { let d = text.replace(/&#(\d+);/g,(_,dec)=>String.fromCharCode(parseInt(dec))); d = d.replace(/&#x([0-9a-fA-F]+);/g,(_,hex)=>String.fromCharCode(parseInt(hex,16))); return d; } catch { return null; } }
  },
  AES: {
    encode: (text,key)=>key?CryptoJS.AES.encrypt(text,key).toString():null,
    decode: (text,key)=>{ try { return CryptoJS.AES.decrypt(text,key).toString(CryptoJS.enc.Utf8)||null } catch { return null; } }
  },
  DES: {
    encode: (text,key)=>key?CryptoJS.DES.encrypt(text,key).toString():null,
    decode: (text,key)=>{ try { return CryptoJS.DES.decrypt(text,key).toString(CryptoJS.enc.Utf8)||null } catch { return null; } }
  },
  "Triple DES": {
    encode: (text,key)=>key?CryptoJS.TripleDES.encrypt(text,key).toString():null,
    decode: (text,key)=>{ try { return CryptoJS.TripleDES.decrypt(text,key).toString(CryptoJS.enc.Utf8)||null } catch { return null; } }
  },
  XOR: {
    encode: (text,key)=>key?text.split("").map((c,i)=>String.fromCharCode(c.charCodeAt(0)^key.charCodeAt(i%key.length))).join(""):null,
    decode: (text,key)=>key?text.split("").map((c,i)=>String.fromCharCode(c.charCodeAt(0)^key.charCodeAt(i%key.length))).join(""):null
  },
  Vigenere: {
    encode: (text,key)=>key?text.split("").map((c,i)=>String.fromCharCode(c.charCodeAt(0)+key.charCodeAt(i%key.length))).join(""):null,
    decode: (text,key)=>key?text.split("").map((c,i)=>String.fromCharCode(c.charCodeAt(0)-key.charCodeAt(i%key.length))).join(""):null
  }
};

// ------------------------- AI Detect -------------------------
const smartDetect = (inputRaw, key="") => {
  if(!inputRaw || inputRaw.trim()==="") return null;
  const input = inputRaw.trim();

  const keyMethods = ["AES","DES","Triple DES","XOR","Vigenere"];
  const normalMethods = ["Base64","Hex","Binary","URL","HTML Entity","ROT13","ROT47"];

  // Key-based detection
  if(key.trim()!==""){
    for(let m of keyMethods){
      try{
        let decoded = null;
        if(m==="Vigenere") decoded = encodersDecoders["Vigenere"].decode(input,key);
        else decoded = encodersDecoders[m].decode(input,key);
        if(decoded!==null && decoded!==undefined && decoded!==input) 
          return {method:`${m} (using key)`, result:decoded};
      } catch{}
    }
  }

  // Normal methods detection
  for(let m of normalMethods){
    try{
      let decoded = null;
      switch(m){
        case "Binary":
          // allow spaces or no spaces
          const clean = input.replace(/[^01]/g,"");
          if(clean.length%8===0) decoded = clean.match(/.{1,8}/g).map(b=>String.fromCharCode(parseInt(b,2))).join("");
          break;
        case "ROT47":
          decoded = input.replace(/[\x21-\x7E]/g,c=>String.fromCharCode(33+((c.charCodeAt(0)-33+47)%94)));
          break;
        default:
          decoded = encodersDecoders[m].decode(input);
      }
      if(decoded!==null && decoded!==undefined && decoded!==input) return {method:m, result:decoded};
    } catch{}
  }

  return null;
};

// ------------------------- Component -------------------------
export default function EncodeDecode(){
  const { addHistory } = useHistory();
  const [input,setInput] = useState("");
  const [output,setOutput] = useState("");
  const [mode,setMode] = useState("decode");
  const [method,setMethod] = useState("Base64");
  const [key,setKey] = useState("");
  const [detected,setDetected] = useState("");
  const [warning,setWarning] = useState("");

  const handleProcess = () => {
    setWarning("");
    if(!input) return;
    const processor = encodersDecoders[method];
    if(!processor) return;

    const result = ["AES","DES","Triple DES","XOR","Vigenere"].includes(method)
      ? (key ? (mode==="encode"?processor.encode(input,key):processor.decode(input,key)) : null)
      : (mode==="encode"?processor.encode(input):processor.decode(input));

    if(!result){ setOutput("Invalid input or missing/wrong key."); return; }

    setOutput(result);
    addHistory(`${mode.toUpperCase()} ${method}: ${input} → ${result}`);
  };

  const handleDetect = () => {
    setWarning("");
    if(["AES","DES","Triple DES","XOR","Vigenere"].includes(method) && !key.trim()){
      setWarning("⚠ AI Detect for this cipher requires a key");
      return;
    }

    const detectedResult = smartDetect(input,key);
    if(detectedResult){
      setMethod(detectedResult.method.replace(" (using key)",""));
      setDetected(detectedResult.method);
      setOutput(detectedResult.result);
      addHistory(`AI Detected ${detectedResult.method}: ${input} → ${detectedResult.result}`);
    } else {
      setDetected("Invalid / Not Recognized Encoding");
      setOutput("Cannot auto-decode. Check input or key.");
    }
  };

  const handleFileUpload = async(e) => {
    const file = e.target.files[0];
    if(!file) return;
    const text = await file.text();
    setInput(text);
    addHistory(`File uploaded: ${file.name}`);
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-wrap gap-3 items-center">
        <input type="file" onChange={handleFileUpload} className="border p-1 rounded"/>
        <select value={mode} onChange={e=>setMode(e.target.value)} className="border p-2 rounded">
          <option value="decode">Decode</option>
          <option value="encode">Encode</option>
        </select>
        <select value={method} onChange={e=>{ setMethod(e.target.value); setDetected(""); setOutput(""); setWarning(""); }} className="border p-2 rounded">
          {Object.keys(encodersDecoders).map(m=><option key={m} value={m}>{m}</option>)}
        </select>
        {["AES","DES","Triple DES","XOR","Vigenere"].includes(method) &&
          <input type="text" placeholder="Key" value={key} onChange={e=>setKey(e.target.value)} className="border p-2 rounded"/>}
        <button onClick={handleProcess} className="bg-blue-500 text-white px-4 py-2 rounded">Go</button>
        <button onClick={handleDetect} className="bg-green-500 text-white px-4 py-2 rounded">AI Detect</button>
        <button onClick={()=>{ setInput(""); setOutput(""); setDetected(""); setKey(""); setWarning(""); }} className="bg-red-500 text-white px-4 py-2 rounded">Clear</button>
      </div>

      {warning && <div className="text-red-600 font-semibold">{warning}</div>}
      <textarea className="border p-4 rounded h-40 bg-white shadow" value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter encoded or decoded text here..."/>
      {detected && <div className="text-yellow-600 font-semibold">Detected: {detected}</div>}
      <textarea className="border p-4 rounded h-40 bg-gray-100 shadow" value={output} readOnly placeholder="Output will appear here..."/>
    </div>
  );
}
