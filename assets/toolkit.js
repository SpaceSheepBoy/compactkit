import { FFmpeg } from '/vendor/ffmpeg/index.js';
import { toBlobURL } from '/vendor/util/index.js';

const CORE = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm';

let ffmpeg;
let ffmpegLoaded = false;

export const $ = id => document.getElementById(id);

export function formatMB(bytes){
  return `${(bytes / 1e6).toFixed(2)} MB`;
}

export function baseName(name){
  return (name || 'file').replace(/\.[^.]+$/, '').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'file';
}

export function extension(name, fallback){
  return ((name || '').match(/\.([a-z0-9]+)$/i)?.[1] || fallback || 'bin').toLowerCase();
}

export function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function wireSingleFileDrop({ drop, input, onFile }){
  input.addEventListener('change', event => onFile(event.target.files[0]));
  ['dragover', 'dragenter'].forEach(eventName => {
    drop.addEventListener(eventName, event => {
      event.preventDefault();
      drop.classList.add('drag');
    });
  });
  ['dragleave', 'drop'].forEach(eventName => {
    drop.addEventListener(eventName, event => {
      event.preventDefault();
      drop.classList.remove('drag');
    });
  });
  drop.addEventListener('drop', event => onFile(event.dataTransfer.files[0]));
}

export function wireMultiFileDrop({ drop, input, onFiles }){
  input.addEventListener('change', event => onFiles(Array.from(event.target.files || [])));
  ['dragover', 'dragenter'].forEach(eventName => {
    drop.addEventListener(eventName, event => {
      event.preventDefault();
      drop.classList.add('drag');
    });
  });
  ['dragleave', 'drop'].forEach(eventName => {
    drop.addEventListener(eventName, event => {
      event.preventDefault();
      drop.classList.remove('drag');
    });
  });
  drop.addEventListener('drop', event => onFiles(Array.from(event.dataTransfer.files || [])));
}

export async function ensureFFmpeg(onProgress){
  if(ffmpegLoaded) return ffmpeg;
  ffmpeg = new FFmpeg();
  if(onProgress){
    ffmpeg.on('progress', ({ progress }) => onProgress(Math.max(0, Math.min(1, progress || 0))));
  }
  await ffmpeg.load({
    coreURL: await toBlobURL(`${CORE}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${CORE}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  ffmpegLoaded = true;
  return ffmpeg;
}

export async function cleanupFFmpeg(files){
  if(!ffmpeg) return;
  for(const file of files){
    try{ await ffmpeg.deleteFile(file); }catch(error){}
  }
}
