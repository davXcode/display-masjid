var nama_masjid = "NAMA MASJID / MUSHOLLA";
var alamat_masjid = "Jl. Sesuai Alamat Masjid atau Musholla yang dimaksud, Dan Kotanya";
var ketr_lain = "Keterangan tambahan apa saja tentang masjid.";
var judul_isi = "Kajian Malam Jumat";
var isi = "oleh Ust Abah Golek Tema Bisikan Maut";
var running_text = "INI UNTUK RUNNING TEXT, YANG ISINYA BISA APA SAJA, TERSERAH YANG MAU NGISI ..";
var overlay_text = "WAKTUNYA SHALAT";

var mHijriah = ["Muharram","Safar","Rabi'ul Awwal","Rabi'ul Akhir",
	"Jumadil Awwal","Jumadil Akhir","Rajab","Sha'ban","Ramadhan","Shawwal","Dzulkaidah","Dzulhijjah"];

var mName = ["JAN","FEB","MAR","APR","MEI","JUN","JUL","AGT","SEP","OKT","NOV","DES"];
var mHari = ["AHAD","SEN","SEL","RAB","KAM","JUM","SAB"];
var hari_ini = null;

var date = new Date(); // today
var arSholat;
var list = ["fajr","sunrise","dhuhr","asr","maghrib","isha"];

// Default 00:00:00
// + untuk tambah, - untuk kurang
var ihtiyath_sunrise = ["+", "00:00:00"];
var ihtiyath_subuh = ["+", "00:00:00"];
var ihtiyath_dzuhur = ["+", "00:00:00"];
var ihtiyath_ashar = ["+", "00:00:00"];
var ihtiyath_maghrib = ["+", "00:00:00"];
var ihtiyath_isya = ["+", "00:00:00"];

var video_enable = 0;
var image_enable = 1;

/* Pergantian video ke gambar */
var timeout_video = 5000; // Dalam milidetik (detik x 1000)

/* Layar hitam selesai adzan */
var interval_overlay = 1200000; // Dalam milidetik (menit x 60 x 1000)

/* Image Background */
var image_array = [
	"assets/img/bg.jpeg",
	"assets/img/bg2.jpeg",
	"assets/img/bg3.jpeg",
	"assets/img/bg4.jpeg",
	"assets/img/bg5.jpeg",
	"assets/img/bg6.jpeg",
	"assets/img/bg7.jpeg"
];

/* Video background */
// Tambah / ubah video dengan menambahkan koma (,)
var video_array = [
	"assets/video/random.mp4",
	"assets/video/adzan.mp4"
]

/* Audio tarhim */
var tarhim_subuh_maghrib = "assets/sound/Tarhim subuh atau maghrib.mpeg";
var tarhim_alternatif = "assets/sound/alternatif Tarhim.mpeg";

/* Audio adzan */
var adzan_subuh = "assets/sound/Shubuh 5.49.wav";
var adzan_dzuhur = "assets/sound/Dzuhur 5.54.wav";
var adzan_ashar = "assets/sound/Ashr 5.54.wav";
var adzan_maghrib = "assets/sound/maghrib 5.54.wav";
var adzan_isya = "assets/sound/Isya 5.54.wav";

/* Audio murotal */
// Tambah / ubah audio dengan menambahkan koma (,)
var random_murotal = [
	"assets/sound/Murrotal Al Fajr.mpeg",
	"assets/sound/Murrotal Al Kahfi.mpeg",
	"assets/sound/Murrotal Al mulk.mpeg",
	"assets/sound/Murrotal Al Waqiah.mpeg",
	"assets/sound/Murrotal An Nurr.mpeg",
	"assets/sound/Murrotal Ar Rahman.mpeg"
];

/* Imam Shalat */
var imam_subuh = "Ust. Solehudin";
var imam_dzuhur = "Ust. Furkon";
var imam_ashar = "Ust. Solehudin";
var imam_maghrib = "Ust. Furkon";
var imam_isya = "Ust. Solehudin";

/* Variabel lain */
var kmrn = -9;
var hm0 = -9;
var jam_now = -9;
var jam_adzan = -9
var sound_play = 0;
var next_adzan = 0;
var akhir_adzan = 0;
var lanjut_sound = -1;
var durasi_adzan = 0;
var durasi_tarhim = 0;
var durasi_murotal = 0;
var durasi_sisa_sound = 0;
var slider = 0;
var overlay = 0;
var total_image = image_array.length;
var current_image = 0;
var total_video = video_array.length;
var current_video = 0;
var previous_adzan = -1;

function initImam() {
	document.getElementById("imam_subuh").innerHTML = imam_subuh;
	document.getElementById("imam_dzuhur").innerHTML = imam_dzuhur;
	document.getElementById("imam_ashar").innerHTML = imam_ashar;
	document.getElementById("imam_maghrib").innerHTML = imam_maghrib;
	document.getElementById("imam_isya").innerHTML = imam_isya;
}

function initVars() {
	document.getElementById("nm_masjid").innerHTML = nama_masjid;
	document.getElementById("alm_masjid").innerHTML = alamat_masjid;
	document.getElementById("ket_lain").innerHTML = ketr_lain;
	document.getElementById("judul_isi").innerHTML = judul_isi;
	document.getElementById("isi").innerHTML = isi;
	document.getElementById("running_text").innerHTML = running_text;
}

function initOverlay() {
	if(hari_ini != null) {
		if(overlay == 0) {
			to_overlay = toHHMMSS(interval_overlay/1000);
			split_overlay = to_overlay.split(':');
			ovr_h = split_overlay[0];
			ovr_m = split_overlay[1];
			ovr_s = split_overlay[2];
			overlay_timeout = moment(previous_adzan, "HH:mm:ss")
			.add({'hours': ovr_h, 'minutes': ovr_m, 'seconds': ovr_s})
			.format('HH:mm:ss');
			if(jam_now > akhir_adzan && jam_now < overlay_timeout) {
				overlay = 1;
				console.log('Overlay - On');
				document.getElementById("overlay").style.display = "block";

				split_now = jam_now.split(':');
				now_h = split_now[0];
				now_m = split_now[1];
				now_s = split_now[2];
				durasi_sisa_overlay = moment(overlay_timeout, "HH:mm:ss")
				.subtract({'hours': now_h, 'minutes': now_m, 'seconds': now_s})
				.format('HH:mm:ss');
				dso = durasi_sisa_overlay.split(':');
				dso_interval = (+dso[0]) * 60 * 60 + (+dso[1]) * 60 + (+dso[2]);
				setInterval(removeOverlay, dso_interval*1000);
			}
		}
	}
}

function toHHMMSS(seconds) {
    var sec_num = parseInt(seconds, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

function initBackground () {
	if(image_enable == 1) {
		if(slider == 1) {
			if(video_enable == 1) {
				console.log("Slider - Off");
				slider = 0;
				document.getElementById("slider").style.backgroundImage = "";
				document.getElementById("slider").style.backgroundPosition = "";
				document.getElementById("slider").style.backgroundRepeat = "";
				document.getElementById("slider").style.backgroundSize = "";
			} else {
				slider = 0;
				initBackground();
			}
		} else {
			console.log("Slider - On");
			slider = 1;
			document.getElementById("slider").style.backgroundImage = 'url("'+image_array[current_image]+'")';
			document.getElementById("slider").style.backgroundPosition = "center";
			document.getElementById("slider").style.backgroundRepeat = "no-repeat";
			document.getElementById("slider").style.backgroundSize = "cover";
			setTimeout(initVideo, timeout_video);
		}
	} else {
		initVideo();
	}
}

function initVideo() {
	if(slider == 1) {
		if(current_image < total_image - 1) {
			current_image++;
		} else {
			current_image = 0;
		}
		initBackground();
	}
	if(video_enable == 1) {
		var video = document.getElementById("my-video");
		video.src=video_array[current_video];
		video.play();
		video.onended = function() {
			if(slider == 0) {
				if(current_video < total_video - 1) {
					current_video++;
				} else {
					current_video = 0;
				}
				initBackground ();
			}
		}
	}
}

function initAudio() {
	sound_murotal = null;
	if(next_adzan == "fajr") {
		// Untuk waktu subuh
		sound_tarhim = tarhim_subuh_maghrib;
		sound_adzan = adzan_subuh;
	} else if(next_adzan == "sunrise") {
		// Untuk waktu terbit
		return;
	}else if(next_adzan == "dhuhr") {
		// Untuk waktu dzuhur / jumat
		if(hari_ini = "JUM") {
			get_murotal = random_murotal[Math.floor(Math.random() * 5)];
			sound_murotal = get_murotal;
		}
		sound_tarhim = tarhim_alternatif;
		sound_adzan = adzan_dzuhur;
	} else if(next_adzan == "asr") {
		// Untuk waktu ashar
		sound_tarhim = tarhim_alternatif;
		sound_adzan = adzan_ashar;
	} else if(next_adzan == "maghrib") {
		// Untuk waktu maghrib
		sound_tarhim = tarhim_subuh_maghrib;
		sound_adzan = adzan_maghrib;
	} else if(next_adzan == "isha") {
		// Untuk waktu isya
		sound_tarhim = tarhim_alternatif;
		sound_adzan = adzan_isya;
	}
	if(next_adzan == "fajr") overlay_adzan = "SUBUH";
	else if(next_adzan == "dhuhr") {
		if(hari_ini == "JUM") overlay_adzan = "JUMAT";
		else overlay_adzan = "DZUHUR";
	}
	else if(next_adzan == "asr") overlay_adzan = "ASHAR";
	else if(next_adzan == "maghrib") overlay_adzan = "MAGHRIB";
	else if(next_adzan == "isha") overlay_adzan = "ISYA";
	document.getElementById("overlay_text").innerHTML = overlay_text+" "+overlay_adzan;

	if(sound_murotal != null) {
		path_murotal = new Audio(sound_murotal);
		path_murotal.onloadedmetadata = function() {
			durasi_murotal = path_murotal.duration;
		};
	}
	path_tarhim = new Audio(sound_tarhim);
	path_tarhim.onloadedmetadata = function() {
		durasi_tarhim = path_tarhim.duration;
	};
	path_adzan = new Audio(sound_adzan);
	path_adzan.onloadedmetadata = function() {
		durasi_adzan = path_adzan.duration;
	};
	
	if(sound_murotal != null) {
		// durasi_total = durasi_adzan+durasi_tarhim+durasi_murotal; // Dengan penambahan waktu adzan
		durasi_total = durasi_tarhim+durasi_murotal; // Tanpa penambahan waktu adzan
	} else {
		// durasi_total = durasi_adzan+durasi_tarhim; // Dengan penambahan waktu adzan
		durasi_total = durasi_tarhim; // Tanpa penambahan waktu adzan
	}

	durasi_total = toHHMMSS(Math.round(durasi_total));
    durasi_total = durasi_total.split(':');
	tot_h = durasi_total[0];
	tot_m = durasi_total[1];
	tot_s = durasi_total[2];
	moment_total = moment(jam_adzan, "HH:mm:ss")
	.subtract({'hours': tot_h, 'minutes': tot_m, 'seconds': tot_s})
	.format('HH:mm:ss');

	// Masuk urutan autoplay
	if(moment_total != jam_adzan) {
		if(jam_now == moment_total) {
			if(sound_play == 0) {
				console.log('Mulai Inisasi');
				startAudio(sound_murotal, sound_tarhim, sound_adzan, null);
			}
		} else {
			if(sound_play == 0) {
				// to_adzan = toHHMMSS(durasi_adzan);
				// split_adzan = to_adzan.split(':');
				// adz_h = split_adzan[0];
				// adz_m = split_adzan[1];
				// adz_s = split_adzan[2];
				// awal_adzan = moment(jam_adzan, "HH:mm:ss")
				// .subtract({'hours': adz_h, 'minutes': adz_m, 'seconds': adz_s})
				// .format('HH:mm:ss');  // Dengan penambahan waktu adzan

				awal_adzan = jam_adzan; // Tanpa penambahan waktu adzan
				to_adzan = toHHMMSS(durasi_adzan);
				split_adzan = to_adzan.split(':');
				adz_h = split_adzan[0];
				adz_m = split_adzan[1];
				adz_s = split_adzan[2];
				akhir_adzan = moment(awal_adzan, "HH:mm:ss")
				.add({'hours': adz_h, 'minutes': adz_m, 'seconds': adz_s})
				.format('HH:mm:ss');

				to_tarhim = toHHMMSS(durasi_tarhim);
				split_tarhim = to_tarhim.split(':');
				tar_h = split_tarhim[0];
				tar_m = split_tarhim[1];
				tar_s = split_tarhim[2];
				awal_tarhim = moment(awal_adzan, "HH:mm:ss")
				.subtract({'hours': tar_h, 'minutes': tar_m, 'seconds': tar_s})
				.format('HH:mm:ss');

				// console.log("Inisiasi: "+moment_total);
				// console.log("Awal Tarhim: "+awal_tarhim);
				// console.log("Awal Adzan "+awal_adzan);
				// console.log("Akhir Adzan "+akhir_adzan);
				// console.log("Akhir Overlay "+overlay_timeout);

				// Autoplay kembali murotal jika refresh
				if(jam_now > moment_total && jam_now < awal_tarhim) {
					console.log("Refresh Murotal");
					lanjut_sound = 0;
					split_now = jam_now.split(':');
					now_h = split_now[0];
					now_m = split_now[1];
					now_s = split_now[2];
					durasi_sisa_sound = moment(awal_tarhim, "HH:mm:ss")
					.subtract({'hours': now_h, 'minutes': now_m, 'seconds': now_s})
					.format('HH:mm:ss');
					dss = durasi_sisa_sound.split(':');
					dss_seconds = (+dss[0]) * 60 * 60 + (+dss[1]) * 60 + (+dss[2]);
					startAudio(sound_murotal, sound_tarhim, sound_adzan, durasi_murotal-dss_seconds);
				}

				// Autoplay kembali tarhim jika refresh
				if(jam_now > awal_tarhim && jam_now < awal_adzan) {
					console.log("Refresh Tarhim");
					lanjut_sound = 1;
					split_now = jam_now.split(':');
					now_h = split_now[0];
					now_m = split_now[1];
					now_s = split_now[2];
					durasi_sisa_sound = moment(awal_adzan, "HH:mm:ss")
					.subtract({'hours': now_h, 'minutes': now_m, 'seconds': now_s})
					.format('HH:mm:ss');
					dss = durasi_sisa_sound.split(':');
					dss_seconds = (+dss[0]) * 60 * 60 + (+dss[1]) * 60 + (+dss[2]);
					startAudio(sound_murotal, sound_tarhim, sound_adzan, durasi_tarhim-dss_seconds);
				}

				// Autoplay kembali adzan jika refresh
				if(jam_now > awal_adzan && jam_now < akhir_adzan) {
					console.log("Refresh Adzan");
					lanjut_sound = 2;
					split_now = jam_now.split(':');
					now_h = split_now[0];
					now_m = split_now[1];
					now_s = split_now[2];
					durasi_sisa_sound = moment(akhir_adzan, "HH:mm:ss")
					.subtract({'hours': now_h, 'minutes': now_m, 'seconds': now_s})
					.format('HH:mm:ss');
					dss = durasi_sisa_sound.split(':');
					dss_seconds = (+dss[0]) * 60 * 60 + (+dss[1]) * 60 + (+dss[2]);
					startAudio(sound_murotal, sound_tarhim, sound_adzan, durasi_adzan-dss_seconds);
				}
			}
		}
	}
}

function removeOverlay() {
	if(overlay == 1) {
		overlay = 0;
		console.log('Overlay - Off');
		document.getElementById("overlay").style.display = "none";
	}
}

function startAudio(sound_murotal = null, sound_tarhim, sound_adzan, durasi_sisa_sound = null) {
	var audionameslist =
		(hari_ini == "JUM" && next_adzan == "dhuhr" ? sound_murotal+`,` : "")
		+sound_tarhim+`,
		`+sound_adzan;
	var audionamesarray = audionameslist.split(',');
	var audio = new Audio(audionamesarray[0]);

	if(lanjut_sound != -1) {
		if(sound_murotal != null) {
			if(lanjut_sound == 0) {
				audio.src = audionamesarray[0];
				audio.load();
				audio.currentTime = durasi_sisa_sound;
				audio.play();
				index = 1;
			} else if(lanjut_sound == 1) {
				audio.src = audionamesarray[1];
				audio.load();
				audio.currentTime = durasi_sisa_sound;
				audio.play();
				index = 2;
			} else if(lanjut_sound == 2) {
				audio.src = audionamesarray[2];
				audio.load();
				audio.currentTime = durasi_sisa_sound;
				audio.play();
				index = 3;
			}
		} else {
			if(lanjut_sound == 1) {
				audio.src = audionamesarray[0];
				audio.load();
				audio.currentTime = durasi_sisa_sound;
				audio.play();
				index = 1;
			} else if(lanjut_sound == 2) {
				audio.src = audionamesarray[1];
				audio.load();
				audio.currentTime = durasi_sisa_sound;
				audio.play();
				index = 2;
			}
		}
	} else {
		audio.src = audionamesarray[0];
		audio.play();
		index = 1;
	}
	audio.onended = function() {
		if(index == audionamesarray.length) {
			if(overlay == 0) {
				lanjut_sound = -1;
				overlay = 1;
				console.log('Overlay - On');
				document.getElementById("overlay").style.display = "block";
				setInterval(removeOverlay, interval_overlay);
			}
		}
		if(index < audionamesarray.length) {
			audio.src = audionamesarray[index];
			audio.play();
			index++;
		}
	};
	sound_play = 1;
}

function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	var d1 = today.getDate();
	var d2 = today.getMonth();
	var yy = today.getYear()+1900;
	var d0 = today.getDay();

	if (kmrn==-9) {
		initVars();
		initImam();
		initBackground();
	}

	if (d0!=kmrn) {
		arSholat = prayTimes.getTimes(date, [-6.2889034,106.9684281], 7.00);
		for (var i=0; i<=5; i++) {
			if(i == 2) {
				if(hari_ini == "JUM") document.getElementById("nm"+i).innerHTML = "JUMAT";
				else document.getElementById("nm"+i).innerHTML = "DZUHUR";
			}
			document.getElementById("inm"+i).innerHTML = ""+ihtiyathTime(arSholat[list[i]]+":00", list[i]);
		}

		var iHijr = kuwaiticalendar(1);

		document.getElementById('tgl').innerHTML = mHari[d0] + ", " + d1 + "-" + mName[d2] + "-" + yy;
		document.getElementById('tglh').innerHTML = iHijr[0]+" "+mHijriah[iHijr[1]]+" "+iHijr[2];
		hari_ini = mHari[d0];
		kmrn = d0;
	}

	h = checkTime(h);
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById('jam').innerHTML = h + ":" + m + ":" + s;

	jam_now = h+":"+m+":"+s;
	h = h+":"+m;
	if (h != hm0) {
		var i2 = 0;
		for (var i=0; i<=5; i++) {
			if ((arSholat[list[i]] >= h || h > arSholat['isha']) && i2 == 0) {
				clr = "#902020";
				i2 = 1;
				jam_adzan = ihtiyathTime(arSholat[list[i]]+":00");
				if(i > 0) previous_adzan = ihtiyathTime(arSholat[list[i-1]]+":00");
				else previous_adzan = ihtiyathTime(arSholat[list[0]]+":00");
				next_adzan = list[i];
			} else {
				clr = "#ffffff";
			}
			document.getElementById("inm"+i).style.color = clr;
			document.getElementById("nm"+i).style.color = clr;
		}
		hm0 = h;
	}

	if(hari_ini != null) {
		initAudio();
		initOverlay();
	}
	
	var t = setTimeout(startTime, 500);
}

function ihtiyathTime(time, adzan) {
	if(adzan == "fajr") {
		// Untuk waktu subuh
		ihtiyath_format = ihtiyath_subuh[0];
		ihtiyath = ihtiyath_subuh[1];
	} else if(adzan == "sunrise") {
		// Untuk waktu terbit
		ihtiyath_format = ihtiyath_sunrise[0];
		ihtiyath = ihtiyath_sunrise[1];
	}else if(adzan == "dhuhr") {
		// Untuk waktu dzuhur / jumat
		ihtiyath_format = ihtiyath_dzuhur[0];
		ihtiyath = ihtiyath_dzuhur[1];
	} else if(adzan == "asr") {
		// Untuk waktu ashar
		ihtiyath_format = ihtiyath_ashar[0];
		ihtiyath = ihtiyath_ashar[1];
	} else if(adzan == "maghrib") {
		// Untuk waktu maghrib
		ihtiyath_format = ihtiyath_maghrib[0];
		ihtiyath = ihtiyath_maghrib[1];
	} else if(adzan == "isha") {
		// Untuk waktu isya
		ihtiyath_format = ihtiyath_isya[0];
		ihtiyath = ihtiyath_isya[1];
	}
	split_now = ihtiyath.split(':');
	iht_h = split_now[0];
	iht_m = split_now[1];
	iht_s = split_now[2];
	if(ihtiyath_format == "-") {
		iTime = moment(time, "HH:mm:ss")
		.subtract({'hours': iht_h, 'minutes': iht_m, 'seconds': iht_s})
		.format('HH:mm'); // Tanpa detik
		// .format('HH:mm:ss'); // Dengan detik
	} else {
		iTime = moment(time, "HH:mm:ss")
		.add({'hours': iht_h, 'minutes': iht_m, 'seconds': iht_s})
		.format('HH:mm'); // Tanpa detik
		// .format('HH:mm:ss'); // Dengan detik
	}
	return iTime;
	// return time;
}

function checkTime(i) {
	if (i < 10) {i = "0" + i}; // add zero in front of numbers < 10
	return i;
}

function gmod(n,m) {
	return ((n%m)+m)%m;
}

function kuwaiticalendar(adjust) {
	var today = new Date();
	if(adjust) {
		adjustmili = 1000*60*60*24*adjust; 
		todaymili = today.getTime()+adjustmili;
		today = new Date(todaymili);
	}
	day = today.getDate();
	month = today.getMonth();
	year = today.getFullYear();
	m = month+1;
	y = year;
	if(m<3) {
		y -= 1;
		m += 12;
	}

	a = Math.floor(y/100.);
	b = 2-a+Math.floor(a/4.);
	if(y<1583) b = 0;
	if(y==1582) {
		if(m>10) b = -10;
		if(m==10) {
			b = 0;
			if(day>4) b = -10;
		}
	}
	
	jd = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+day+b-1524;
	b = 0;

	if(jd>2299160) {
		a = Math.floor((jd-1867216.25)/36524.25);
		b = 1+a-Math.floor(a/4.);
	}
	bb = jd+b+1524;
	cc = Math.floor((bb-122.1)/365.25);
	dd = Math.floor(365.25*cc);
	ee = Math.floor((bb-dd)/30.6001);
	day =(bb-dd)-Math.floor(30.6001*ee);
	month = ee-1;
	if(ee>13) {
		cc += 1;
		month = ee-13;
	}
	year = cc-4716;

	if(adjust) {
		wd = gmod(jd+1-adjust,7)+1;
	} else {
		wd = gmod(jd+1,7)+1;
	}

	iyear = 10631./30.;
	epochastro = 1948084;
	epochcivil = 1948085;

	shift1 = 8.01/60.;
	
	z = jd-epochastro;
	cyc = Math.floor(z/10631.);
	z = z-10631*cyc;
	j = Math.floor((z-shift1)/iyear);
	iy = 30*cyc+j;
	z = z-Math.floor(j*iyear+shift1);
	im = Math.floor((z+28.5001)/29.5);
	if(im==13) im = 12;
	id = z-Math.floor(29.5001*im-29);

	var myRes = new Array(3);

	myRes[0] = id; //islamic date
	myRes[1] = im-1; //islamic month
	myRes[2] = iy; //islamic year

	return myRes;
}