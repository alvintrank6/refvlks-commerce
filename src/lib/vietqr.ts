const field=(id:string,value:string)=>`${id}${String(value.length).padStart(2,"0")}${value}`;

export function crc16(value:string){let crc=0xffff;for(const char of value){crc^=char.charCodeAt(0)<<8;for(let i=0;i<8;i++)crc=(crc&0x8000)?((crc<<1)^0x1021)&0xffff:(crc<<1)&0xffff}return crc.toString(16).toUpperCase().padStart(4,"0")}

export function vietqrPayload(amount:number,reference:string){
  if(!Number.isInteger(amount)||amount<=0||!/^[A-Z0-9]{1,25}$/.test(reference))throw new Error("Invalid VietQR amount or reference");
  const account=field("00","970407")+field("01","19070671343017");
  const merchant=field("00","A000000727")+field("01",account)+field("02","QRIBFTTA");
  const raw=field("00","01")+field("01","12")+field("38",merchant)+field("53","704")+field("54",String(amount))+field("58","VN")+field("59","NGUYEN TUNG ANH")+field("62",field("08",reference))+"6304";
  return raw+crc16(raw);
}
