---
---

require.config({
    paths: {
        'z80e': '../tools/z80e'
    },
    shim: {
        '../tools/kpack': {
            exports: 'exports'
        },
        '../tools/genkfs': {
            exports: 'exports'
        },
        '../tools/scas': {
            exports: 'exports'
        },
        'z80e': {
            exports: 'exports'
        }
    }
})

window.toolchain = {
    kpack: null,
    genkfs: null,
    scas: null,
    z80e: null,
    ide_emu: null,
    kernel_rom: null,
}

files = []

log = (text) ->
    log_els = document.querySelectorAll('.tool-log')
    console.log(text)
    for log_el in log_els
        if log_el.innerHTML == ''
            log_el.innerHTML += text
        else
            log_el.innerHTML += '\n' + text
        log_el.scrollTop = log_el.scrollHeight
window.ide_log = log

copy_between_systems = (fs1, fs2, from, to, encoding) ->
    for f in fs1.readdir(from)
        continue if f in ['.', '..']
        fs1p = from + '/' + f
        fs2p = to + '/' + f
        s = fs1.stat(fs1p)
        log("Writing #{fs1p} to #{fs2p}")
        if fs1.isDir(s.mode)
            try
                fs2.mkdir(fs2p)
            catch
                # pass
            copy_between_systems(fs1, fs2, fs1p, fs2p, encoding)
        else
            fs2.writeFile(fs2p, fs1.readFile(fs1p, { encoding: encoding }), { encoding: encoding })

install_package = (repo, name, callback) ->
    full_name = repo + '/' + name
    log("Downloading " + full_name)
    xhr = new XMLHttpRequest()
    xhr.open('GET', "https://packages.knightos.org/" + full_name + "/download")
    xhr.responseType = 'arraybuffer'
    xhr.onload = () ->
        log("Installing " + full_name)
        file_name = '/packages/' + repo + '-' + name + '.pkg'
        data = new Uint8Array(xhr.response)
        toolchain.kpack.FS.writeFile(file_name, data, { encoding: 'binary' })
        toolchain.kpack.Module.callMain(['-e', file_name, '/pkgroot'])
        copy_between_systems(toolchain.kpack.FS, toolchain.scas.FS, "/pkgroot/include", "/include", "utf8")
        copy_between_systems(toolchain.kpack.FS, toolchain.genkfs.FS, "/pkgroot", "/root", "binary")
        log("Package installed.")
        callback() if callback?
    xhr.send()

current_emulator = null

load_environment = ->
    toolchain.genkfs.FS.writeFile("/kernel.rom", toolchain.kernel_rom, { encoding: 'binary' })
    toolchain.genkfs.FS.mkdir("/root")
    toolchain.genkfs.FS.mkdir("/root/bin")
    toolchain.genkfs.FS.mkdir("/root/etc")
    toolchain.genkfs.FS.mkdir("/root/home")
    toolchain.genkfs.FS.mkdir("/root/lib")
    toolchain.genkfs.FS.mkdir("/root/share")
    toolchain.genkfs.FS.mkdir("/root/var")
    toolchain.kpack.FS.mkdir("/packages")
    toolchain.kpack.FS.mkdir("/pkgroot")
    toolchain.kpack.FS.mkdir("/pkgroot/include")
    toolchain.scas.FS.mkdir("/include")
    packages = 0
    callback = () ->
        packages++
        log("Ready to go!") if packages == 2
        b.style.display = 'inline' for b in document.querySelectorAll('.run-button')
    install_package('core', 'init', callback)
    install_package('core', 'kernel-headers', callback)

run_project = (main) ->
    # Assemble
    window.toolchain.scas.FS.writeFile('/main.asm', main)
    log("Calling assembler...")
    ret = window.toolchain.scas.Module.callMain(['/main.asm', '-I/include/', '-o', 'executable'])
    return ret if ret != 0
    log("Assembly done!")
    # Build filesystem
    executable = window.toolchain.scas.FS.readFile("/executable", { encoding: 'binary' })
    window.toolchain.genkfs.FS.writeFile("/root/bin/executable", executable, { encoding: 'binary' })
    window.toolchain.genkfs.FS.writeFile("/root/etc/inittab", "/bin/executable")
    window.toolchain.genkfs.FS.writeFile("/kernel.rom", new Uint8Array(toolchain.kernel_rom), { encoding: 'binary' })
    window.toolchain.genkfs.Module.callMain(["/kernel.rom", "/root"])
    rom = window.toolchain.genkfs.FS.readFile("/kernel.rom", { encoding: 'binary' })

    log("Loading your program into the emulator!")
    if current_emulator != null
        current_emulator.cleanup()
    current_emulator = new toolchain.ide_emu(document.querySelectorAll('.emulator-screen'))
    current_emulator.load_rom(rom.buffer)
    return 0

check_resources = ->
    for prop in Object.keys(window.toolchain)
        if window.toolchain[prop] == null
            return
    log("Ready.")
    load_environment()

downloadKernel = ->
    log("Finding latest kernel on GitHub...")
    xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://api.github.com/repos/KnightOS/kernel/releases')
    xhr.onload = ->
        json = JSON.parse(xhr.responseText)
        release = json[0]
        rom = new XMLHttpRequest()
        if release?
            log("Downloading kernel #{ release.tag_name }...")
            rom.open('GET', _.find(release.assets, (a) -> a.name == 'kernel-TI84pSE.rom').url)
        else
            # fallback
            log("Downloading kernel")
            rom.open('GET', 'http://builds.knightos.org/latest-TI84pSE.rom')
        rom.setRequestHeader("Accept", "application/octet-stream")
        rom.responseType = 'arraybuffer'
        rom.onload = () ->
            window.toolchain.kernel_rom = rom.response
            log("Loaded kernel ROM.")
            check_resources()
        rom.send()
    xhr.onerror = ->
    xhr.send()

downloadKernel()

log("Downloading scas...")
require(['../tools/scas'], (scas) ->
    log("Loaded scas.")
    window.toolchain.scas = scas
    window.toolchain.scas.Module.preRun.pop()()
    check_resources()
)

log("Downloading kpack...")
require(['../tools/kpack'], (kpack) ->
    log("Loaded kpack.")
    window.toolchain.kpack = kpack
    check_resources()
)

log("Downloading genkfs...")
require(['../tools/genkfs'], (genkfs) ->
    log("Loaded genkfs.")
    window.toolchain.genkfs = genkfs
    check_resources()
)

log("Downloading emulator bindings...")
require(['ide_emu'], (ide_emu) ->
    log("Loaded emulator bindings.")
    window.toolchain.ide_emu = ide_emu
    window.toolchain.z80e = require("z80e")
    check_resources()
)

((el) ->
    # Set up default editors
    editor = ace.edit(el)
    editor.setTheme("ace/theme/github")
    if el.dataset.file.indexOf('.asm') == el.dataset.file.length - 4
        editor.getSession().setMode("ace/mode/assembly_x86")
    files.push({
        name: el.dataset.file,
        editor: editor
    })
    xhr = new XMLHttpRequest()
    xhr.open('GET', el.dataset.source)
    xhr.onload = () ->
        editor.setValue(this.responseText)
        editor.navigateFileStart()
    xhr.send()
    button = document.createElement('button')
    button.className = 'run-button'
    button.style.display = 'none'
    button.addEventListener('click', (e) ->
        e.preventDefault()
        ret = run_project(editor.getValue())
        if ret != 0
            alert("Assembler returned nonzero exit status, see log to the left")
    )
    button.textContent = 'Run'
    el.appendChild(button)
    textarea = document.createElement('textarea')
    textarea.className = "form-control tool-log"
    textarea.rows = 8
    textarea.setAttribute('disabled', 'disabled')
    el.parentElement.querySelector('.calculator-wrapper').appendChild(textarea)
)(el) for el in document.querySelectorAll('.editor')

document.getElementById('install-package').addEventListener('click', (e) ->
    e.preventDefault()
    p = document.getElementById('package-name').value.split('/')
    install_package(p[0], p[1])
)

((el) ->
    el.addEventListener('click', () ->
        p = el.dataset.package.split('/')
        install_package(p[0], p[1])
    )
)(el) for el in document.querySelectorAll('.install-package-button')

window.setInterval(() ->
    if window.current_asic?
        document.getElementById('register-pc').textContent = '0x' + window.current_asic.cpu.registers.PC.toString(16).toUpperCase()
    else
        document.getElementById('register-pc').textContent = '0x0000'
, 100)
