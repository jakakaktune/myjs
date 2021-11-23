var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "interactive") {
		clearInterval(readyStateCheckInterval);

		let current_url = window.location.href;

		if (current_url.split('twitch.tv')[1].length > 1) {
// 			replace_player();
			replace_button();
		}

		window.addEventListener('click', () => {
			console.log('location: ' + window.location.href);
			if (window.location.href != current_url) {
				console.log('change url');
				current_url = window.location.href;
				replace_player();
			}
		});
	}
	}, 10);

function replace_button () {
	let button = document.querySelector('button[data-test-selector="follow-button"]')?? document.querySelector('button[data-test-selector="unfollow-button"]');
	let parent = button.parentNode;
	
	let new_button = document.createElement('a');
	
	new_button.setAttribute('href', 'vlc-x-callback://x-callback-url/stream?url='+video_url);
	
	new_button.innerHTML = 'vlc';
	
	new_button.setAttribute('class', button.className);
	
	button.insertBefore(new_button);
}

function replace_player () {
	const proxy_url      = 'https://jaka.ml:51820';
	const video_url      = 	window.location.href;
	const file_extension = '.m3u8';
	let stream_url = "";

	console.log("video url: " + video_url);


	// Make a request for a user with a given ID
	axios.get(`${proxy_url}/get-link/${ btoa(video_url) }`)
	.then(function (response) {

		if (player) {
			player.dispose();
		}
		// console.log(response);
		stream_url = response.data;

		const hls_proxy_url  = `${proxy_url}/${ btoa(stream_url) }${file_extension}`;
		console.log("proxy: " + hls_proxy_url);

		// const hls_proxy_url  = `${proxy_url}/${ btoa(`${video_url}|${referer_url}`) }${file_extension}`

		old_player = document.querySelector('.video-player');
		parent = old_player.parentNode;

		old_player.remove();

		let video = document.createElement('video');

		video.setAttribute('id', 'my_video_1');
		video.setAttribute('class', 'video-js vjs-fluid vjs-default-skin');
		video.setAttribute('preload', 'auto');
		video.setAttribute('data-setup', '{}');
		video.setAttribute('controls', 'true');

		let source = document.createElement('source');

		source.setAttribute('src', hls_proxy_url);

		video.appendChild(source);

		parent.appendChild(video);

		var player = videojs('my_video_1');
		player.play();

		
	})
	.catch(function (error) {
		// handle error
		console.log(error);
	})
}
