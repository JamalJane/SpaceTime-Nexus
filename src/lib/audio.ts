class SoundManager {
    ctx: AudioContext | null = null
    masterGain: GainNode | null = null
    ambientOsc: OscillatorNode | null = null
    isMuted = false

    constructor() {
        // Lazy init on first interaction
    }

    init() {
        if (this.ctx) return
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        this.ctx = new AudioContext()
        this.masterGain = this.ctx.createGain()
        this.masterGain.gain.value = 0.4 // Master volume
        this.masterGain.connect(this.ctx.destination)

        this.startAmbient()
    }

    toggleMute() {
        if (!this.masterGain) return
        this.isMuted = !this.isMuted
        this.masterGain.gain.setTargetAtTime(
            this.isMuted ? 0 : 0.4,
            this.ctx!.currentTime,
            0.1
        )
    }

    private startAmbient() {
        if (!this.ctx || !this.masterGain) return

        // Create a low rumbles drone using brown noise approx (filtered noise)
        const bufferSize = 2 * this.ctx.sampleRate
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
        const data = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1
            data[i] = (lastOut + (0.02 * white)) / 1.02
            lastOut = data[i]
            data[i] *= 3.5 // compensates for gain loss
        }

        const noise = this.ctx.createBufferSource()
        noise.buffer = buffer
        noise.loop = true

        // Lowpass filter for "space drone" hum
        const filter = this.ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 120

        noise.connect(filter)
        filter.connect(this.masterGain)
        noise.start()
    }

    // UI Sounds
    hover() {
        if (!this.ctx || this.isMuted) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(800, this.ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05)

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

        osc.connect(gain)
        gain.connect(this.masterGain!)
        osc.start()
        osc.stop(this.ctx.currentTime + 0.05)
    }

    click() {
        if (!this.ctx || this.isMuted) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(600, this.ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1)

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1)

        osc.connect(gain)
        gain.connect(this.masterGain!)
        osc.start()
        osc.stop(this.ctx.currentTime + 0.1)
    }

    error() {
        if (!this.ctx || this.isMuted) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(150, this.ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.2)

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2)

        osc.connect(gain)
        gain.connect(this.masterGain!)
        osc.start()
        osc.stop(this.ctx.currentTime + 0.2)
    }
}

// Brown noise helper var
let lastOut = 0

export const audio = new SoundManager()
