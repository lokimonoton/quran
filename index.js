const https = require('https')
const fs = require('fs');
const request = async (url, method = 'GET', postData) => {
    const lib = https;
  
    const [h, ...path] = url.split('://')[1].split('/');
    const [host, port] = h.split(':');
  
    const params = {
      method,
      host,
      port:  443 ,
      path: `/${path.join("/")}` || '/',
    };
  
    return new Promise((resolve, reject) => {
      const req = lib.request(params, res => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`Status Code: ${res.statusCode}`));
        }
  
        const data = [];
  
        res.on('data', chunk => {
          data.push(chunk);
        });
  
        res.on('end', () => resolve(Buffer.concat(data).toString()));
      });
  
      req.on('error', reject);
  
      if (postData) {
        req.write(postData);
      }
  
      // IMPORTANT
      req.end();
    });
  };
  const download=async (data,namaAyat,namaPelantun)=> {
    
    return new Promise((resolve,reject)=>{
        https.get(data.audio,(res) => {
                        
            const path = `./audio/${namaPelantun}/${namaAyat}/${data.number}.mp3`; 
            const filePath = fs.createWriteStream(path);
            res.pipe(filePath);
            filePath.on('finish',() => {
                filePath.close();
                resolve(`${data.number} Download Completed`); 
            })
        })
    })
  }
  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function scrapeAudio(surat,edisiPelantun,namaPelantun){
    const d = await request(
        `http://api.alquran.cloud/v1/surah/${surat}/${edisiPelantun}`,
      );
const dir='./audio';      
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    const ayat=JSON.parse(d).data.ayahs
    const namaAyat=JSON.parse(d).data.englishName.toLowerCase().replaceAll("-","")
    if (!fs.existsSync(`./audio/${namaPelantun}`)){
        fs.mkdirSync(`./audio/${namaPelantun}`);
    }
    if (!fs.existsSync(`./audio/${namaPelantun}/${namaAyat}`)){
        fs.mkdirSync(`./audio/${namaPelantun}/${namaAyat}`);
    }
    for(let i=0;i<ayat.length;i++){
console.log(await download(ayat[i],namaAyat,namaPelantun))
    }
    await timeout(3000)
    return "done"
}

async function scrapeNow(){
    for(let i=1;i<=114;i++){
       await scrapeAudio(i,"ar.husary","husary")
        await timeout(5000)
    }
}
scrapeNow()


