class DropBoxController {
  constructor() {
    this.btnSendFileEl = document.querySelector('#btn-send-file');
    this.inputFilesEl = document.querySelector('#files');
    this.snackModalEl = document.querySelector('#react-snackbar-root');
    this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
    this.nameFileEl = this.snackModalEl.querySelector('.filename');
    this.timeFileEl = this.snackModalEl.querySelector('.timeleft');

    this.connectFirebase();
    this.initEvents();
  }

  connectFirebase() {
    const firebaseConfig = {
      apiKey: 'AIzaSyCymKCMxZVESsyN22d3gqsusndfk65vQaQ',
      authDomain: 'dropbox-clone-saulo.firebaseapp.com',
      databaseURL: 'https://dropbox-clone-saulo-default-rtdb.firebaseio.com',
      projectId: 'dropbox-clone-saulo',
      storageBucket: 'dropbox-clone-saulo.appspot.com',
      messagingSenderId: '287270481162',
      appId: '1:287270481162:web:812a788e20b6b09c4c1ef3',
    };
    firebase.initializeApp(firebaseConfig);
  }

  initEvents() {
    this.btnSendFileEl.addEventListener('click', (event) => {
      this.inputFilesEl.click();
    });

    this.inputFilesEl.addEventListener('change', (event) => {
      this.btnSendFileEl.disabled = true;
      this.modalShow(true);

      this.uploadTask(event.target.files)
        .then((responses) => {
          responses.forEach((response) => {
            this.getFirebaseRef().push().set(response.files['input-file']);
          });

          this.uploadComplete();
        })
        .catch((err) => {
          this.uploadComplete();
          console.error(err);
        });
    });
  }

  uploadComplete() {
    this.modalShow(false);
    this.inputFilesEl.value = '';
    this.btnSendFileEl.disabled = false;
  }

  getFirebaseRef() {
    return firebase.database().ref('files');
  }

  modalShow(show) {
    this.snackModalEl.style.display = show ? 'block' : 'none';
  }

  uploadTask(files) {
    const promisses = [];

    [...files].forEach((file) => {
      promisses.push(
        new Promise((resolve, reject) => {
          let ajax = new XMLHttpRequest();

          ajax.open('POST', '/upload');

          ajax.onload = (event) => {
            try {
              resolve(JSON.parse(ajax.responseText));
            } catch (e) {
              reject(e);
            }
          };

          ajax.onerror = (event) => {
            reject(event);
          };

          ajax.upload.onprogress = (event) => {
            this.uploadOnProgress(event, file);
          };

          let formData = new FormData();
          formData.append('input-file', file);

          this.startUploadTime = Date.now();

          ajax.send(formData);
        })
      );
    });
    return Promise.all(promisses);
  }

  uploadOnProgress(event, file) {
    const timeSpent = Date.now() - this.startUploadTime;
    const loaded = event.loaded;
    const total = event.total;
    const percent = parseInt((loaded / total) * 100);
    const timeLeft = ((100 - percent) * timeSpent) / percent;

    this.progressBarEl.style.width = `${percent}%`;
    this.nameFileEl.innerHTML = file.name;
    this.timeFileEl.innerHTML = this.formatTimeToHuman(timeLeft);
  }

  formatTimeToHuman(duration) {
    const seconds = parseInt((duration / 1000) % 60);
    const minutes = parseInt(duration / (1000 * 60)) % 60;
    const hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    if (hours > 0) {
      return `${hours}h${minutes}m${seconds}s`;
    }

    if (minutes > 0) {
      return `${minutes}m${seconds}s`;
    }

    if (seconds > 0) {
      return `${seconds}s`;
    }

    return '';
  }

  getFileIconView(file) {
    console.log(file);
    switch (file.mimetype) {
      case 'folder':
        return `<svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon"><title>content-folder-large</title><g fill="none" fill-rule="evenodd"><path d="M77.955 53h50.04A3.002 3.002 0 0 1 131 56.007v58.988a4.008 4.008 0 0 1-4.003 4.005H39.003A4.002 4.002 0 0 1 35 114.995V45.99c0-2.206 1.79-3.99 3.997-3.99h26.002c1.666 0 3.667 1.166 4.49 2.605l3.341 5.848s1.281 2.544 5.12 2.544l.005.003z" fill="#71B9F4"></path><path d="M77.955 52h50.04A3.002 3.002 0 0 1 131 55.007v58.988a4.008 4.008 0 0 1-4.003 4.005H39.003A4.002 4.002 0 0 1 35 113.995V44.99c0-2.206 1.79-3.99 3.997-3.99h26.002c1.666 0 3.667 1.166 4.49 2.605l3.341 5.848s1.281 2.544 5.12 2.544l.005.003z" fill="#92CEFF"></path></g></svg>`;

      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
      case 'image/gif':
        return `<svg version="1.1" id="Camada_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="160px" height="160px" viewBox="0 0 160 160" enable-background="new 0 0 160 160" xml:space="preserve"><filter height="102%" width="101.4%" id="mc-content-unknown-large-a" filterUnits="objectBoundingBox" y="-.5%" x="-.7%"><feOffset result="shadowOffsetOuter1" in="SourceAlpha" dy="1"></feOffset><feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix></filter><title>Imagem</title><g><g><g filter="url(#mc-content-unknown-large-a)"><path id="mc-content-unknown-large-b_2_" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47c-2.209,0-4-1.791-4-4V34C43,31.791,44.791,30,47,30z"></path></g><g><path id="mc-content-unknown-large-b_1_" fill="#F7F9FA" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47c-2.209,0-4-1.791-4-4V34C43,31.791,44.791,30,47,30z"></path></g></g></g><g><path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M81.148,62.638c8.086,0,16.173-0.001,24.259,0.001 c1.792,0,2.3,0.503,2.301,2.28c0.001,11.414,0.001,22.829,0,34.243c0,1.775-0.53,2.32-2.289,2.32 c-16.209,0.003-32.417,0.003-48.626,0c-1.775,0-2.317-0.542-2.318-2.306c-0.002-11.414-0.003-22.829,0-34.243 c0-1.769,0.532-2.294,2.306-2.294C64.903,62.637,73.026,62.638,81.148,62.638z M81.115,97.911c7.337,0,14.673-0.016,22.009,0.021 c0.856,0.005,1.045-0.238,1.042-1.062c-0.028-9.877-0.03-19.754,0.002-29.63c0.003-0.9-0.257-1.114-1.134-1.112 c-14.637,0.027-29.273,0.025-43.91,0.003c-0.801-0.001-1.09,0.141-1.086,1.033c0.036,9.913,0.036,19.826,0,29.738 c-0.003,0.878,0.268,1.03,1.069,1.027C66.443,97.898,73.779,97.911,81.115,97.911z"></path><path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M77.737,85.036c3.505-2.455,7.213-4.083,11.161-5.165 c4.144-1.135,8.364-1.504,12.651-1.116c0.64,0.058,0.835,0.257,0.831,0.902c-0.024,5.191-0.024,10.381,0.001,15.572 c0.003,0.631-0.206,0.76-0.789,0.756c-3.688-0.024-7.375-0.009-11.062-0.018c-0.33-0.001-0.67,0.106-0.918-0.33 c-2.487-4.379-6.362-7.275-10.562-9.819C78.656,85.579,78.257,85.345,77.737,85.036z"></path><path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M87.313,95.973c-0.538,0-0.815,0-1.094,0 c-8.477,0-16.953-0.012-25.43,0.021c-0.794,0.003-1.01-0.176-0.998-0.988c0.051-3.396,0.026-6.795,0.017-10.193 c-0.001-0.497-0.042-0.847,0.693-0.839c6.389,0.065,12.483,1.296,18.093,4.476C81.915,90.33,84.829,92.695,87.313,95.973z"></path><path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M74.188,76.557c0.01,2.266-1.932,4.223-4.221,4.255 c-2.309,0.033-4.344-1.984-4.313-4.276c0.03-2.263,2.016-4.213,4.281-4.206C72.207,72.338,74.179,74.298,74.188,76.557z"></path></g></svg>`;

      case 'application/pdf':
        return `<svg version="1.1" id="Camada_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="160px" height="160px" viewBox="0 0 160 160" enable-background="new 0 0 160 160" xml:space="preserve"><filter height="102%" width="101.4%" id="mc-content-unknown-large-a" filterUnits="objectBoundingBox" y="-.5%" x="-.7%"><feOffset result="shadowOffsetOuter1" in="SourceAlpha" dy="1"></feOffset><feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix></filter><title>Imagem</title><g><g><g filter="url(#mc-content-unknown-large-a)"> <path id="mc-content-unknown-large-b_2_" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47c-2.209,0-4-1.791-4-4V34 C43,31.791,44.791,30,47,30z"></path></g><g><path id="mc-content-unknown-large-b_1_" fill="#F7F9FA" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47 c-2.209,0-4-1.791-4-4V34C43,31.791,44.791,30,47,30z"></path></g></g></g><g><path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M81.148,62.638c8.086,0,16.173-0.001,24.259,0.001 c1.792,0,2.3,0.503,2.301,2.28c0.001,11.414,0.001,22.829,0,34.243c0,1.775-0.53,2.32-2.289,2.32 c-16.209,0.003-32.417,0.003-48.626,0c-1.775,0-2.317-0.542-2.318-2.306c-0.002-11.414-0.003-22.829,0-34.243 c0-1.769,0.532-2.294,2.306-2.294C64.903,62.637,73.026,62.638,81.148,62.638z M81.115,97.911c7.337,0,14.673-0.016,22.009,0.021 c0.856,0.005,1.045-0.238,1.042-1.062c-0.028-9.877-0.03-19.754,0.002-29.63c0.003-0.9-0.257-1.114-1.134-1.112 c-14.637,0.027-29.273,0.025-43.91,0.003c-0.801-0.001-1.09,0.141-1.086,1.033c0.036,9.913,0.036,19.826,0,29.738 c-0.003,0.878,0.268,1.03,1.069,1.027C66.443,97.898,73.779,97.911,81.115,97.911z"></path><path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M77.737,85.036c3.505-2.455,7.213-4.083,11.161-5.165 c4.144-1.135,8.364-1.504,12.651-1.116c0.64,0.058,0.835,0.257,0.831,0.902c-0.024,5.191-0.024,10.381,0.001,15.572 c0.003,0.631-0.206,0.76-0.789,0.756c-3.688-0.024-7.375-0.009-11.062-0.018c-0.33-0.001-0.67,0.106-0.918-0.33 c-2.487-4.379-6.362-7.275-10.562-9.819C78.656,85.579,78.257,85.345,77.737,85.036z"></path><path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M87.313,95.973c-0.538,0-0.815,0-1.094,0 c-8.477,0-16.953-0.012-25.43,0.021c-0.794,0.003-1.01-0.176-0.998-0.988c0.051-3.396,0.026-6.795,0.017-10.193 c-0.001-0.497-0.042-0.847,0.693-0.839c6.389,0.065,12.483,1.296,18.093,4.476C81.915,90.33,84.829,92.695,87.313,95.973z"></path><path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M74.188,76.557c0.01,2.266-1.932,4.223-4.221,4.255 c-2.309,0.033-4.344-1.984-4.313-4.276c0.03-2.263,2.016-4.213,4.281-4.206C72.207,72.338,74.179,74.298,74.188,76.557z"></path></g></svg>`;

      case 'audio/mp3':
      case 'audio/ogg':
        return `<svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon"><title>content-audio-large</title><defs><rect id="mc-content-audio-large-b" x="30" y="43" width="100" height="74" rx="4"></rect><filter x="-.5%" y="-.7%" width="101%" height="102.7%" filterUnits="objectBoundingBox" id="mc-content-audio-large-a"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix></filter></defs><g fill="none" fill-rule="evenodd"><g>    <use fill="#000" filter="url(#mc-content-audio-large-a)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-audio-large-b"></use>    <use fill="#F7F9FA" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-audio-large-b"></use></g><path d="M67 60c0-1.657 1.347-3 3-3 1.657 0 3 1.352 3 3v40c0 1.657-1.347 3-3 3-1.657 0-3-1.352-3-3V60zM57 78c0-1.657 1.347-3 3-3 1.657 0 3 1.349 3 3v4c0 1.657-1.347 3-3 3-1.657 0-3-1.349-3-3v-4zm40 0c0-1.657 1.347-3 3-3 1.657 0 3 1.349 3 3v4c0 1.657-1.347 3-3 3-1.657 0-3-1.349-3-3v-4zm-20-5.006A3 3 0 0 1 80 70c1.657 0 3 1.343 3 2.994v14.012A3 3 0 0 1 80 90c-1.657 0-3-1.343-3-2.994V72.994zM87 68c0-1.657 1.347-3 3-3 1.657 0 3 1.347 3 3v24c0 1.657-1.347 3-3 3-1.657 0-3-1.347-3-3V68z" fill="#637282"></path></g></svg>`;

      case 'video/mp4':
      case 'video/quicktime':
        return `<svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon"><title>content-video-large</title><defs><rect id="mc-content-video-large-b" x="30" y="43" width="100" height="74" rx="4"></rect><filter x="-.5%" y="-.7%" width="101%" height="102.7%" filterUnits="objectBoundingBox" id="mc-content-video-large-a">    <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>    <feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix></filter></defs><g fill="none" fill-rule="evenodd"><g>    <use fill="#000" filter="url(#mc-content-video-large-a)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-video-large-b"></use>    <use fill="#F7F9FA" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-video-large-b"></use></g><path d="M69 67.991c0-1.1.808-1.587 1.794-1.094l24.412 12.206c.99.495.986 1.3 0 1.794L70.794 93.103c-.99.495-1.794-.003-1.794-1.094V67.99z" fill="#637282"></path></g></svg>`;

      default:
        return `<svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon"><title>1357054_617b.jpg</title><defs><rect id="mc-content-unknown-large-b" x="43" y="30" width="74" height="100" rx="4"></rect><filter x="-.7%" y="-.5%" width="101.4%" height="102%" filterUnits="objectBoundingBox" id="mc-content-unknown-large-a"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix></filter></defs><g fill="none" fill-rule="evenodd"><g><use fill="#000" filter="url(#mc-content-unknown-large-a)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-unknown-large-b"></use><use fill="#F7F9FA" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-unknown-large-b"></use></g></g></svg>`;
    }
  }

  getFileView(file) {
    return `<li>
      ${this.getFileIconView(file)}
      <div class="name text-center">${file.name}</div>
    </li>`;
  }
}
