import base64
import math
import struct
import wave
from io import BytesIO

def generate_pop_sound():
    sample_rate = 44100
    duration = 0.05
    num_samples = int(sample_rate * duration)
    
    audio_data = bytearray()
    for i in range(num_samples):
        t = i / sample_rate
        # Exponential envelope for pop sound
        envelope = math.exp(-t * 100)
        # Sine wave frequency descending from 800 to 200
        freq = 800 - (600 * (i / num_samples))
        val = int(envelope * math.sin(2 * math.pi * freq * t) * 32767)
        audio_data.extend(struct.pack('<h', val))
        
    out = BytesIO()
    with wave.open(out, 'wb') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        wav.writeframes(audio_data)
        
    b64 = base64.b64encode(out.getvalue()).decode('utf-8')
    print(f"data:audio/wav;base64,{b64}")

generate_pop_sound()
