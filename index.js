import { exec } from 'child_process'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'
import activeWindow from 'active-win';

const wait = time => new Promise((resolve,reject)=>setTimeout(resolve,time))
const getThisDir = () => path.resolve(dirname(fileURLToPath(import.meta.url)),'.')
const getFullPath = p => path.resolve(getThisDir(),p||'')

const nircmd = command => new Promise((resolve,reject)=>{
	const fullCommand = `${getFullPath('nircmd.exe')} ${command}`
	console.log(fullCommand)
	exec(fullCommand, {cwd: getThisDir()},(err,stdo)=>{
		if (err && err.code !== 4207175) {
			return reject(err)
		} else {
			return resolve(stdo)
		}
		
	})
})

const getTargetExe = () => (
	activeWindow()
	.then(aw=>path.basename(aw?.owner?.path))
)

wait(1000)
.then(()=>getTargetExe())
.then(target=>(
	nircmd(`muteappvolume ${target} 1`)
	.then(()=>wait(1000))
	.then(()=>nircmd('stdbeep'))
	.then(()=>wait(1000))
	.then(()=>nircmd(`muteappvolume ${target} 0`))
))

