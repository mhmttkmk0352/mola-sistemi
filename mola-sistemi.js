
const fs = require("fs");

const cert = fs.readFileSync("../sslverisi/CER-CRT-Files/test_test_com.crt");
const ca = fs.readFileSync("../sslverisi/CER-CRT-Files/My_CA_Bundle.ca-bundle");
const key = fs.readFileSync("../sslverisi/ek/test.com.key");



let httpsOptions ={
	cert:cert,
	ca: ca,
	key:key
}


const http = require("http");
const https = require("https");
const redirectHttps = require("redirect-https");

const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const bodyParser = require("body-parser");

var app = express();
var token = "5b479aa6-4c57-4eff-8a19-03896e8d29c0";
var idhavuzu = {}


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



redirectOptions = {port: 444}

httpServer = http.createServer(redirectHttps(redirectOptions));
server = https.createServer(httpsOptions, app);

httpServer.listen(8102, function(){
	console.log("HTTP 8102 portu dinlemede");
});
server.listen(444, function(){
	console.log("SSL 444 portu dinlemede ");
});



/*
httpserver=http.createServer(le.middleware(redirectHttps()));
server=https.createServer(le.httpsOptions, le.middleware(app));
server.listen(444, function() {
    console.log("https Sunucu Baslatildi: " + 444);
})
httpserver.listen(80, function() {
console.log("Servis baslatildi. 444 SSL Portu Uzerinden Calistiriliyor.");
console.log("Ulasim saglayabileceginiz adres : https://test.test.com");
});
*/


const io = require("socket.io").listen(server);


MongoClient.connect("mongodb://admin:test@localhost", {useNewUrlParser: true}, function(hata, baglan){
	var vt = baglan.db("mola");
	console.log("MongoDB Bağlantısı Sağlandı.");



	function molalistelet(){
				vt.collection("moladurum").find({moladurum: "aktif"}, {projection: {_id: 0}}).toArray(function(hata, sonuc){
					if (hata){
						console.log("MongoDB içerisindeki moladurumu okunamıyor");
					}
					else
					{
						io.emit("molalistele", {
							durum : sonuc
						});
					}
				});
	}



	express.json();
	app.use(bodyParser.json());



// {
// 	"id": "44",
// 	"ad": "Ayşe",
// 	"tarih_ilk": "2019/01/17",
// 	"tarih_son": "2019/02/17",
// 	"mola_turu": "yemek"
// }


	function sifirkoy(deger){
		if (deger < 10){
			deger = "0"+deger;
			return deger;
		}
		else
		{
			return deger;
		}
	}

	app.post("/molabitir", function(request, response){
		var id = request.param("id");
		var req_token = request.param("token");

		var data = {"id": id, "token": req_token}

		console.log("Mola bitirme İsteği");

			if (data.token == token){
		
				console.log(data);
				vt.collection("moladurum").findOne({id: data.id}, function(hata, sonuc){
					if (sonuc && sonuc.moladurum == "aktif"){
					
						
						var baslangic_cek = 0;

						vt.collection("moladurum").findOne({id: data.id}, function(err, res){
							baslangic_cek = res.baslangic;
							

							if (baslangic_cek && baslangic_cek > 100)
							{
								var suan = new Date().getTime();
								suan = Math.floor(suan/1000);

								console.log("Başlangıç Çek: "+ baslangic_cek);
								console.log("Bitiş Çek: "+suan);

								var gecenzaman = suan-baslangic_cek;
								console.log("Geçen Zaman Çek: "+gecenzaman);

										function sifirkoy(deger){
											if (deger < 10){
												deger = "0"+deger;
												return deger;
											}
											else
											{
												return deger;
											}
										}


								vt.collection("moladurum").updateOne({id: data.id}, {$set: {moladurum: "pasif", bitis: suan, molatipi: res.molatipi, gecenzaman:gecenzaman}}, function(hata, sonuc){
									molalistelet();
									if (!hata){
										var baslangic_trhvesaat = new Date(1000 * res.baslangic);
										var baslangic_yili = baslangic_trhvesaat.getFullYear();
										var baslangic_ayi = sifirkoy(baslangic_trhvesaat.getMonth()+1);
										var baslangic_gunu = sifirkoy(baslangic_trhvesaat.getDate());
										var baslangic_saati = sifirkoy(baslangic_trhvesaat.getHours());
										var baslangic_dakikasi = sifirkoy(baslangic_trhvesaat.getMinutes());
										var baslangic_saniyesi = sifirkoy(baslangic_trhvesaat.getSeconds());
										var baslangic_tarih = baslangic_yili+"/"+baslangic_ayi+"/"+baslangic_gunu;
										var baslangic_saat = baslangic_saati+"."+baslangic_dakikasi+"."+baslangic_saniyesi;
										var baslangic_tumu = baslangic_tarih+" "+baslangic_saat;

										var bitis_trhvesaat = new Date(1000 * suan);
										var bitis_yili = bitis_trhvesaat.getFullYear();
										var bitis_ayi = sifirkoy(bitis_trhvesaat.getMonth()+1);
										var bitis_gunu = sifirkoy(bitis_trhvesaat.getDate());
										var bitis_saati = sifirkoy(bitis_trhvesaat.getHours());
										var bitis_dakikasi = sifirkoy(bitis_trhvesaat.getMinutes());
										var bitis_saniyesi = sifirkoy(bitis_trhvesaat.getSeconds());
										var bitis_tarih = bitis_yili+"/"+bitis_ayi+"/"+bitis_gunu;
										var bitis_saat = bitis_saati+"."+bitis_dakikasi+"."+bitis_saniyesi;
										var bitis_tumu = bitis_tarih+" "+bitis_saat;

										var aciklamametni = "";
										if (res.aciklama){
											aciklamametni = res.aciklama;
										}
										else
										{
											aciklamametni = "";
										}


										var md_suan = new Date();
										var md_yil = md_suan.getFullYear();
										var md_ay = sifirkoy(md_suan.getMonth()+1);
										var md_gun = sifirkoy(md_suan.getDate());
										var md_bugun = md_yil+"/"+md_ay+"/"+md_gun;

										vt.collection("kayit").insertOne({kayitturu: "1", id: data.id, ad: res.ad, molatipi: res.molatipi, baslangic_tarihi: baslangic_tarih, baslangic_saati: baslangic_saat, bitis_tarihi: bitis_tarih, bitis_saati: bitis_saat,gecenzaman: gecenzaman, aciklama: aciklamametni});
										console.log("molabitirildi");

										vt.collection("kayit").find({kayitturu: "1", id: data.id, baslangic_tarihi: md_bugun}).toArray(function(kay_hata, kay_cikti){

						
												var md_sure_topla = 0;
												
												kay_cikti.forEach(function(value, index){
													console.log(value.gecenzaman);
													md_sure_topla = parseInt(parseInt(md_sure_topla)+parseInt(value.gecenzaman));

												});
												

												console.log("Toplam Süre: ");
												console.log(md_sure_topla);
												var cikti = {};
												
												cikti["durum"] = "1";
												cikti["toplamsure"] = md_sure_topla;

												response.send(cikti);
											


										});
										//response.send("1");
									}
								});
								//socket.emit("molabitir", "");
								
							}
						});
					}
					else
					{
						//socket.emit("molabitirilemiyor", "");
						console.log("moladadegilsin");

										var md_suan = new Date();
										var md_yil = md_suan.getFullYear();
										var md_ay = sifirkoy(md_suan.getMonth()+1);
										var md_gun = sifirkoy(md_suan.getDate());
										var md_bugun = md_yil+"/"+md_ay+"/"+md_gun;
										
										vt.collection("kayit").find({kayitturu: "1", id: data.id, baslangic_tarihi: md_bugun}).toArray(function(kay_hata, kay_cikti){

						
												var md_sure_topla = 0;
												
												kay_cikti.forEach(function(value, index){
													console.log(value.gecenzaman);
													md_sure_topla = parseInt(parseInt(md_sure_topla)+parseInt(value.gecenzaman));

												});
												

												console.log("Toplam Süre: ");
												console.log(md_sure_topla);
												var cikti = {};
												
												cikti["durum"] = "1";
												cikti["toplamsure"] = md_sure_topla;

												response.send(cikti);
											


										});
					}
				});

				molalistelet();
			}
	});

	app.get("/sorgula", function(req, res){
		console.log("Sorgula İsteği geldi");


		var md_yonetici = req.param("yonetici");
		var md_baslangic = req.param("baslangic");
		var md_bitis = req.param("bitis");
		var md_token = req.param("token");



		console.log(md_yonetici+" "+md_baslangic+" "+md_bitis);


		var gelen = {}

		gelen["id"] = md_yonetici;
		gelen["baslangic_tarihi"] = md_baslangic;
		gelen["bitis_tarihi"] = md_bitis;
		gelen["token"] = md_token;

console.log(gelen);




		if (req){
			

				if (gelen && gelen.token == token)
				{

			        var tumkayitlar = {};

			        var day = 1000*60*60*24;
			        date1 = new Date(gelen.baslangic_tarihi);
			        date2 = new Date(gelen.bitis_tarihi);
			     
			     
			        var diff = (date2.getTime()- date1.getTime())/day;
			        var tarihHavuzu = [];

			        for(var i=0;i<=diff; i++)
			        {
			           	var xx = date1.getTime()+day*i;
			           	var yy = new Date(xx);
			     
			           	var tarihsondurum = yy.getFullYear()+"/"+(sifirkoy(yy.getMonth()+1))+"/"+sifirkoy(yy.getDate());

			           	var pushla = {baslangic_tarihi: tarihsondurum}
			           	tarihHavuzu.push(pushla);
			        }
		//tarihHavuzu.push(pushla);




					console.log("MongoSorguHavuzu");

				
					if (gelen.baslangic_tarihi && gelen.bitis_tarihi){
						delete gelen["baslangic_tarihi"];
						delete gelen["bitis_tarihi"];
						gelen["kayitturu"] = "1";
						gelen["$or"] = tarihHavuzu;

						delete gelen["token"];

						console.log(gelen);
					}
					else
					{
						console.log(gelen);
					}
					

					console.log("Find gelen");
					console.log(gelen);

					if (gelen["id"]  == "999999999"){
						delete gelen["id"] ;
						console.log("Tüm Yöneticileri Görüntüle Seçildi");
					}


			        vt.collection("kayit").find(gelen).sort({_id: 1}).toArray(function(hata, sonuc){
							if (hata){
								console.log("Hata");
							}
							else
							{
								console.log("Başarılı");
								console.log(sonuc);
								res.send(sonuc);
								console.log("Sonuç Değeri:");
								console.log(sonuc.length);
							}
					});

			       
				}
				else
				{
					res.send("Token Bilgisi Göndermeden Veri Okuyamazsınız.");
				}

		}

	});





	io.on("connection", function(socket){
		console.log("Online: "+ io.engine.clientsCount);

		socket.on("disconnect", function(data){
			console.log("Online "+ io.engine.clientsCount);
		});
		molalistelet();




		socket.on("savunma", function(data){
			console.log("Bir süre aşım savunması alındı");
			console.log(data);

										var suan = new Date();
										var yil = suan.getFullYear();
										var ay = sifirkoy(suan.getMonth()+1);
										var gun = sifirkoy(suan.getDate());
										var bugun = yil+"/"+ay+"/"+gun;

			vt.collection("savunma").insertOne({id: data.id, bugun: bugun, savunma: data.mesaj}, function(hata, sonuc){
				if (sonuc){
					socket.emit("savunma", "");
					console.log("socket.mit işlemi yapıldı");
				}
			});
		});






		//MESAJIN KİMDEN GELDİĞİNİ ÖĞRENİYORUZ
		socket.on("kimsin", function(data){
			if (data.token == token){
				console.log("Kimsin Cevabı Geldi");
				console.log(socket.id);
				console.log(data);
				if (data.id && data.id != ""){
					vt.collection("kayit").findOne({id: data.id} , function(hata, cikti){
						if (cikti && cikti != ""){
							console.log("Zaten Kayıtlı: "+JSON.stringify(data));

							vt.collection("moladurum").findOne({id: data.id}, function(mhata, mcikti){
								if (mcikti && mcikti.moladurum == "aktif"){
									console.log(data.id+" Moladasın");
									socket.emit("halamoladasin", {
										mesaj: "Sayın "+mcikti.ad+" hala molada görünüyorsunuz. Molayı bitirmeden devam edemezsiniz.",
										bilgi: mcikti
									});
									var suan = new Date().getTime();
									suan = Math.floor(parseInt(suan));

									socket.emit("molasayacinibaslat", {
										baslangic: mcikti.baslangic,
										suan: suan
									});

								}
								else
								{
									console.log(data.id+" Molada değilsin");	
								}
							});

							// if (cikti.moladurum == "aktif"){
							// 	console.log(data.id+ " şu an moladasınız");
							// }
							// else
							// {
							// 	console.log(data.id+ " şu an molada değilsiniz");
							// }
						}
						else
						{
							console.log("Henüz Kaydı Yok");

							vt.collection("kayit").insertOne({id: data.id, ad: data.ad}, function(hata, cikti){
								if (hata) throw hata;
								console.log("Yeni Kayıt Başarılı: "+ JSON.stringify(data));
							});
						}
					});
				}
				molalistelet();			
			} 

		});

		socket.on("molaistegi", function(data){
			if (data.token == token){
				console.log("Mola isteği geldi");
				console.log(data);

				var suan = new Date().getTime();
				suan = Math.floor(suan/1000);
				vt.collection("moladurum").findOne({id: data.id}, function(hata, cikti){
					console.log("moladurum koleksiyonu: ");
					if (hata) throw hata;

					
					if (cikti && cikti.moladurum == "aktif"){
						console.log(data.ad+ " siz zaten moladasınız");
						socket.emit("molabitirilsinmi", "");
					}
					else if (cikti && cikti.moladurum == "pasif")
					{
						
						var aciklamametni = "";
						if (data.aciklama){
							aciklamametni = data.aciklama;
						}
						else
						{
							aciklamametni = "";
						}

						vt.collection("moladurum").updateOne({id: data.id}, {$set: {ad: data.ad, moladurum: "aktif", molatipi: data.molatipi, baslangic: suan, aciklama: aciklamametni}}, function(hata, sonuc){
							molalistelet();
						});

						socket.emit("molaistegi", {
							durum: "görüldü",
							baslangic: suan
						});
					}
					else
					{
						console.log("İlk Mola");
						vt.collection("moladurum").insertOne({id: data.id, ad: data.ad, molatipi: data.molatipi, baslangic: suan, moladurum: "aktif",aciklama: data.aciklama}, function(){
							molalistelet();
						});
						socket.emit("molaistegi", {
							durum: "görüldü",
							baslangic: suan
						});
					}	
				});

				
				molalistelet();
							
			}

		});





		socket.on("molabitir", function(data){
			if (data.token == token){
				console.log("Mola bitirme İsteği");
				console.log(data);
				vt.collection("moladurum").findOne({id: data.id}, function(hata, sonuc){
					if (sonuc && sonuc.moladurum == "aktif"){
					
						
						var baslangic_cek = 0;

						vt.collection("moladurum").findOne({id: data.id}, function(err, res){
							baslangic_cek = res.baslangic;
							

							if (baslangic_cek && baslangic_cek > 100)
							{
								var suan = new Date().getTime();
								suan = Math.floor(suan/1000);

								console.log("Başlangıç Çek: "+ baslangic_cek);
								console.log("Bitiş Çek: "+suan);

								var gecenzaman = suan-baslangic_cek;
								console.log("Geçen Zaman Çek: "+gecenzaman);

										function sifirkoy(deger){
											if (deger < 10){
												deger = "0"+deger;
												return deger;
											}
											else
											{
												return deger;
											}
										}


								vt.collection("moladurum").updateOne({id: data.id}, {$set: {moladurum: "pasif", bitis: suan, molatipi: res.molatipi, gecenzaman:gecenzaman}}, function(hata, sonuc){
									molalistelet();
									if (!hata){
										var baslangic_trhvesaat = new Date(1000 * res.baslangic);
										var baslangic_yili = baslangic_trhvesaat.getFullYear();
										var baslangic_ayi = sifirkoy(baslangic_trhvesaat.getMonth()+1);
										var baslangic_gunu = sifirkoy(baslangic_trhvesaat.getDate());
										var baslangic_saati = sifirkoy(baslangic_trhvesaat.getHours());
										var baslangic_dakikasi = sifirkoy(baslangic_trhvesaat.getMinutes());
										var baslangic_saniyesi = sifirkoy(baslangic_trhvesaat.getSeconds());
										var baslangic_tarih = baslangic_yili+"/"+baslangic_ayi+"/"+baslangic_gunu;
										var baslangic_saat = baslangic_saati+":"+baslangic_dakikasi+":"+baslangic_saniyesi;
										var baslangic_tumu = baslangic_tarih+" "+baslangic_saat;

										var bitis_trhvesaat = new Date(1000 * suan);
										var bitis_yili = bitis_trhvesaat.getFullYear();
										var bitis_ayi = sifirkoy(bitis_trhvesaat.getMonth()+1);
										var bitis_gunu = sifirkoy(bitis_trhvesaat.getDate());
										var bitis_saati = sifirkoy(bitis_trhvesaat.getHours());
										var bitis_dakikasi = sifirkoy(bitis_trhvesaat.getMinutes());
										var bitis_saniyesi = sifirkoy(bitis_trhvesaat.getSeconds());
										var bitis_tarih = bitis_yili+"/"+bitis_ayi+"/"+bitis_gunu;
										var bitis_saat = bitis_saati+":"+bitis_dakikasi+":"+bitis_saniyesi;
										var bitis_tumu = bitis_tarih+" "+bitis_saat;

										var aciklamametni = "";
										if (res.aciklama){
											aciklamametni = res.aciklama;
										}
										else
										{
											aciklamametni = "";
										}
										vt.collection("kayit").insertOne({kayitturu: "1", id: data.id, ad: res.ad, molatipi: res.molatipi, baslangic_tarihi: baslangic_tarih, baslangic_saati: baslangic_saat, bitis_tarihi: bitis_tarih, bitis_saati: bitis_saat,gecenzaman: gecenzaman, aciklama: aciklamametni});
									}
								});
								socket.emit("molabitir", "");
								console.log("Mola bitirildi : "+ data.id+ " " +data.ad);
							}
						});
					}
					else
					{
						socket.emit("molabitirilemiyor", "");
						console.log("Zaten molada değilsiniz: "+ data.id+ " " +data.ad);
					}
				});

				molalistelet();
			}
		});



		socket.emit("kimsin", "");
		console.log("Kimsin Sorgusu Gönderildi");
	});




});

