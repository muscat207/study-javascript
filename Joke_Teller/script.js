const button = document.getElementById('button');
const audioElement = document.getElementById('audio');

//VoiceRSS Javascript SDK
const VoiceRSS = { speech: function (e) { this._validate(e), this._request(e) }, _validate: function (e) { if (!e) throw "The settings are undefined"; if (!e.key) throw "The API key is undefined"; if (!e.src) throw "The text is undefined"; if (!e.hl) throw "The language is undefined"; if (e.c && "auto" != e.c.toLowerCase()) { var a = !1; switch (e.c.toLowerCase()) { case "mp3": a = (new Audio).canPlayType("audio/mpeg").replace("no", ""); break; case "wav": a = (new Audio).canPlayType("audio/wav").replace("no", ""); break; case "aac": a = (new Audio).canPlayType("audio/aac").replace("no", ""); break; case "ogg": a = (new Audio).canPlayType("audio/ogg").replace("no", ""); break; case "caf": a = (new Audio).canPlayType("audio/x-caf").replace("no", "") }if (!a) throw "The browser does not support the audio codec " + e.c } }, _request: function (e) { var e = this._buildRequest(e), a = this._getXHR(); a.onreadystatechange = function () { if (4 == a.readyState && 200 == a.status) { if (0 == a.responseText.indexOf("ERROR")) throw a.responseText; audioElement.src = a.responseText, audioElement.play() } }, a.open("POST", "https://api.voicerss.org/", !0), a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), a.send(e) }, _buildRequest: function (e) { var a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec(); return "key=" + (e.key || "") + "&src=" + (e.src || "") + "&hl=" + (e.hl || "") + "&v=" + (e.v || "") + "&r=" + (e.r || "") + "&c=" + (a || "") + "&f=" + (e.f || "") + "&ssml=" + (e.ssml || "") + "&b64=true" }, _detectCodec: function () { var e = new Audio; return e.canPlayType("audio/mpeg").replace("no", "") ? "mp3" : e.canPlayType("audio/wav").replace("no", "") ? "wav" : e.canPlayType("audio/aac").replace("no", "") ? "aac" : e.canPlayType("audio/ogg").replace("no", "") ? "ogg" : e.canPlayType("audio/x-caf").replace("no", "") ? "caf" : "" }, _getXHR: function () { try { return new XMLHttpRequest } catch (e) { } try { return new ActiveXObject("Msxml3.XMLHTTP") } catch (e) { } try { return new ActiveXObject("Msxml2.XMLHTTP.6.0") } catch (e) { } try { return new ActiveXObject("Msxml2.XMLHTTP.3.0") } catch (e) { } try { return new ActiveXObject("Msxml2.XMLHTTP") } catch (e) { } try { return new ActiveXObject("Microsoft.XMLHTTP") } catch (e) { } throw "The browser does not support HTTP request" } };

// Disable/Enable Button
function toggleButton() {
    button.disabled = !button.disabled;

}

// Passing Joke to VoiceRSS 
async function tellme(joke) {
    VoiceRSS.speech({
        key: 'fcec393e8da24043a74c025999f11e33',
        src: joke,
        hl: 'en-us',
        v: 'Linda',
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
}


// Get Jokes from Joke API
async function getJokes() {
    let joke = '';

    const apiUrl = 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.setup) {
            joke = `${data.setup} ... ${data.delivery}`;
        } else {
            joke = data.joke;
        }
        // Text-to-Speech
        tellme(joke);
        //Disabled Button
        toggleButton();
    } catch (error) {
        console.log('whoops,', error);
    }
}

// Event Listeners
button.addEventListener('click', getJokes);
audioElement.addEventListener('ended', toggleButton);
//On load
// getJokes();